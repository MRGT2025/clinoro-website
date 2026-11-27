import assert from "node:assert/strict";
import { test, after } from "node:test";
import { webcrypto } from "node:crypto";
import { readFile } from "node:fs/promises";

// Run after build:cloudflare. The compiled Worker uses only dummy keys and an in-memory DB.
const config = JSON.parse(await readFile(new URL("../dist/server/wrangler.json", import.meta.url), "utf8"));
assert.equal(config.vars?.CLINORO_AUTH_MODE, "cloudflare-access", "Build the production target before this test");
assert.equal(config.workers_dev, false);
assert.equal(config.preview_urls, false);

const issuer = "https://worker-local-test.cloudflareaccess.com";
const audience = "worker-local-audience";
const key = await webcrypto.subtle.generateKey({ name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["sign", "verify"]);
const jwk = { ...await webcrypto.subtle.exportKey("jwk", key.publicKey), kid: "worker-test", use: "sig", alg: "RS256" };
const originalFetch = globalThis.fetch;
globalThis.fetch = async (url) => {
  assert.equal(String(url), issuer + "/cdn-cgi/access/certs", "Unexpected external fetch");
  return Response.json({ keys: [jwk] });
};
after(() => { globalThis.fetch = originalFetch; });
const { default: worker } = await import(new URL("../dist/server/index.js", import.meta.url));
const context = { waitUntil() {}, passThroughOnException() {} };
let reads = 0;
let writes = 0;
const db = {
  prepare(sql) {
    return {
      args: [], bind(...args) { this.args = args; return this; },
      async first() {
        reads++;
        await new Promise(resolve => setTimeout(resolve, this.args[0] === "dummy-owner@example.test" ? 8 : 2));
        if (sql.includes("FROM admin_users")) return { email: this.args[0], username: "Dummy user", role: this.args[0] === "dummy-owner@example.test" ? "owner" : "admin", active: 1, created_at: 0 };
        return null;
      },
      async all() { reads++; return { results: [] }; },
      async run() { writes++; return { meta: { changes: 1 } }; },
    };
  },
  async batch() { return []; },
};
const env = { CLINORO_AUTH_MODE: "cloudflare-access", CLINORO_ACCESS_ISSUER: issuer, CLINORO_ACCESS_AUDIENCE: audience, DB: db, ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
const b64 = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
async function signed(email = "editor@example.test") {
  const now = Math.floor(Date.now() / 1000);
  const data = b64({ alg: "RS256", kid: "worker-test" }) + "." + b64({ iss: issuer, aud: [audience], exp: now + 300, iat: now, email });
  return data + "." + Buffer.from(await webcrypto.subtle.sign("RSASSA-PKCS1-v1_5", key.privateKey, new TextEncoder().encode(data))).toString("base64url");
}
const call = (path, headers = {}, init = {}, bindings = env) => worker.fetch(new Request("https://clinoromedical.com" + path, { ...init, headers }), bindings, context);

test("compiled production Worker rejects raw identity headers before querying data", async () => {
  reads = 0;
  const response = await call("/api/admin/revisions", { "oai-authenticated-user-email": "dummy-owner@example.test", "cf-access-authenticated-user-email": "dummy-owner@example.test" });
  assert.equal(response.status, 401);
  assert.equal(response.headers.get("cache-control"), "private, no-store");
  assert.equal(reads, 0);
  const missing = await call("/api/admin/revisions", {}, {}, { ...env, CLINORO_AUTH_MODE: undefined });
  assert.equal(missing.status, 503);
});

test("a valid signed identity reaches request-local app authorization", async () => {
  const response = await call("/api/admin/revisions", { "cf-access-jwt-assertion": await signed() });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { revisions: [] });
});

test("raw owner email cannot elevate a signed editor and verified owner retains access", async () => {
  const editor = await call("/api/admin/users", { "cf-access-jwt-assertion": await signed(), "oai-authenticated-user-email": "dummy-owner@example.test", "cf-access-authenticated-user-email": "dummy-owner@example.test" });
  assert.equal(editor.status, 403);
  const owner = await call("/api/admin/users", { "cf-access-jwt-assertion": await signed("dummy-owner@example.test") });
  assert.equal(owner.status, 200);
  await owner.arrayBuffer();
});

test("interleaved owner and editor requests keep distinct request-local identities", async () => {
  const owner = await signed("dummy-owner@example.test");
  const editor = await signed("editor@example.test");
  const results = await Promise.all(Array.from({ length: 12 }, async (_, index) => {
    const isOwner = index % 2 === 0;
    const response = await call("/api/admin/users", { "cf-access-jwt-assertion": isOwner ? owner : editor });
    await response.arrayBuffer();
    return { status: response.status, expected: isOwner ? 200 : 403 };
  }));
  for (const result of results) assert.equal(result.status, result.expected);
});

test("admin mutation rejects foreign origin and non-JSON requests without a write", async () => {
  const jwt = await signed("dummy-owner@example.test");
  for (const headers of [
    { "content-type": "application/json", origin: "https://foreign.example" },
    { "content-type": "text/plain", origin: "https://clinoromedical.com" },
  ]) {
    writes = 0;
    const response = await call("/api/admin/users", { ...headers, "cf-access-jwt-assertion": jwt }, { method: "POST", body: JSON.stringify({ email: "new@example.test", username: "Fixture" }) });
    assert.equal(response.status, headers.origin.includes("foreign") ? 403 : 415);
    assert.equal(writes, 0);
  }
});

test("encoded admin path cannot bypass production authentication", async () => {
  const response = await call("/api/%61dmin/revisions", { "oai-authenticated-user-email": "dummy-owner@example.test" });
  assert.equal(response.status, 401);
});
