import assert from "node:assert/strict";
import { test, after } from "node:test";
import { webcrypto } from "node:crypto";
import { mkdir, mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { join } from "node:path";
import ts from "typescript";

// Compile the actual pure security helpers with the repository's locked TypeScript.
// No production tokens, network access, customer data, or live mutations are used.
const root = fileURLToPath(new URL("../", import.meta.url));
await mkdir(join(root, ".sites-runtime"), { recursive: true });
const temporary = await mkdtemp(join(root, ".sites-runtime/security-tests-"));
after(() => rm(temporary, { recursive: true, force: true }));
for (const name of ["access-security", "http-security", "upload-security", "json-ld"]) {
  const source = await readFile(join(root, "lib", name + ".ts"), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
    .replace(/from "\.\/http-security"/g, 'from "./http-security.mjs"');
  await writeFile(join(temporary, name + ".mjs"), compiled);
}
const load = (name) => import(pathToFileURL(join(temporary, name + ".mjs")).href);
const { createAccessVerifier, isAdminPath } = await load("access-security");
const { HttpError, assertSameOrigin, boundedRequest, readJsonBody, readUploadBody, errorResponse, UPLOAD_BODY_BYTES } = await load("http-security");
const { validateUpload } = await load("upload-security");
const { serializeJsonLd } = await load("json-ld");

const issuer = "https://local-security-test.cloudflareaccess.com";
const audience = "local-dummy-audience";
let now = 1_800_000_000_000;
const keys = await webcrypto.subtle.generateKey({ name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["sign", "verify"]);
const publicKey = { ...await webcrypto.subtle.exportKey("jwk", keys.publicKey), kid: "local-key", alg: "RS256", use: "sig" };
const base64url = (value) => Buffer.from(typeof value === "string" ? value : JSON.stringify(value)).toString("base64url");
const claims = () => ({ iss: issuer, aud: [audience], exp: now / 1000 + 300, nbf: now / 1000 - 1, iat: now / 1000, email: "editor@example.test", name: "Local Test" });
async function token(payload = claims(), header = { alg: "RS256", kid: "local-key", typ: "JWT" }) {
  const input = base64url(header) + "." + base64url(payload);
  const signature = await webcrypto.subtle.sign("RSASSA-PKCS1-v1_5", keys.privateKey, new TextEncoder().encode(input));
  return input + "." + Buffer.from(signature).toString("base64url");
}
function fixture(configuration = { issuer, audience }) {
  const requests = [];
  const verify = createAccessVerifier(configuration, { clock: () => now, fetcher: async (url) => {
    requests.push(url);
    assert.equal(url, issuer + "/cdn-cgi/access/certs");
    return Response.json({ keys: [publicKey] });
  } });
  return { verify, requests };
}

test("valid locally signed JWT produces a verified user", async () => {
  const f = fixture();
  assert.deepEqual(await f.verify(await token()), { email: "editor@example.test", displayName: "Local Test", fullName: "Local Test", authProvider: "cloudflare-access" });
  assert.equal(f.requests.length, 1);
  assert.equal((await f.verify(await token({ ...claims(), aud: audience }))).email, "editor@example.test");
  assert.equal(f.requests.length, 1);
});

test("invalid signatures and alternate algorithms are rejected", async () => {
  const f = fixture();
  const valid = await token();
  const parts = valid.split(".");
  parts[2] = (parts[2][0] === "A" ? "B" : "A") + parts[2].slice(1);
  await assert.rejects(f.verify(parts.join(".")));
  await assert.rejects(f.verify(await token(claims(), { alg: "HS256", kid: "local-key" })));
  await assert.rejects(f.verify(await token(claims(), { alg: "none", kid: "local-key" })));
  await assert.rejects(f.verify(await token(claims(), { alg: "RS256", kid: "local-key", crit: ["unknown"] })));
});

test("issuer, audience, expiry, activation time and user identity are enforced", async () => {
  const f = fixture();
  for (const change of [
    { iss: "https://other.cloudflareaccess.com" }, { aud: "other-audience" },
    { exp: now / 1000 - 1 }, { exp: undefined }, { exp: "tomorrow" },
    { nbf: now / 1000 + 60 }, { iat: now / 1000 + 60 }, { email: undefined },
  ]) await assert.rejects(f.verify(await token({ ...claims(), ...change })));
});

test("missing configuration/token fails closed before fetching keys", async () => {
  for (const configuration of [{}, { issuer }, { audience }, { issuer: "http://invalid.example", audience }]) {
    const f = fixture(configuration);
    await assert.rejects(f.verify(await token()));
    assert.equal(f.requests.length, 0);
  }
  const f = fixture();
  for (const value of [null, "", "invalid", "a.b.c", "x".repeat(17000)]) await assert.rejects(f.verify(value));
});

test("unknown kid attempts share a bounded refresh cooldown", async () => {
  const f = fixture();
  await f.verify(await token());
  const unknown = await token(claims(), { alg: "RS256", kid: "unknown" });
  await Promise.all(Array.from({ length: 25 }, () => assert.rejects(f.verify(unknown))));
  assert.equal(f.requests.length, 1);
  now += 31_000;
  await assert.rejects(f.verify(unknown));
  assert.equal(f.requests.length, 2);
});

test("key-fetch failures do not authenticate or cause an unbounded retry loop", async () => {
  let count = 0;
  const verify = createAccessVerifier({ issuer, audience }, { clock: () => now, fetcher: async () => { count++; throw new Error("offline fixture"); } });
  const value = await token();
  await assert.rejects(verify(value));
  await assert.rejects(verify(value));
  assert.equal(count, 1);
});

test("encoded and nested administrative paths remain protected", () => {
  for (const path of ["/admin", "/admin/", "/api/admin/users", "/api/%61dmin/users", "/%61dmin", "//api//admin/users", "/api%2fadmin/users"]) assert.equal(isAdminPath(path), true, path);
  for (const path of ["/", "/products", "/administrator", "/api/rfq", "/api/administer"]) assert.equal(isAdminPath(path), false, path);
});

function request(body, headers = {}, method = "POST") {
  return new Request("https://clinoromedical.com/api/admin/users", { method, body, headers: { origin: "https://clinoromedical.com", "content-type": "application/json", ...headers }, ...(body instanceof ReadableStream ? { duplex: "half" } : {}) });
}
const isStatus = (status) => (error) => error instanceof HttpError && error.status === status;

test("mutation origin guard accepts the site and rejects missing/foreign origins", () => {
  assert.doesNotThrow(() => assertSameOrigin(request("{}")));
  for (const origin of ["https://evil.example", "https://clinoromedical.com.evil.example", "null", ""]) assert.throws(() => assertSameOrigin(request("{}", { origin })), isStatus(403));
  assert.throws(() => assertSameOrigin(request("{}", { "sec-fetch-site": "cross-site" })), isStatus(403));
  assert.throws(() => assertSameOrigin(new Request("https://clinoromedical.com/api/admin/users", { method: "POST", body: "{}" })), isStatus(403));
});

test("bounded JSON accepts UTF-8 data and rejects non-JSON content types and roots", async () => {
  const input = { message: "آزمون امن" };
  assert.deepEqual(await readJsonBody(request(JSON.stringify(input)), 100), input);
  await assert.rejects(readJsonBody(request("{}", { "content-type": "text/plain" }), 100), isStatus(415));
  for (const input of ["[]", "null", "broken"]) await assert.rejects(readJsonBody(request(input), 100), isStatus(400));
});

test("actual stream bytes are bounded even without or with a false Content-Length", async () => {
  for (const headers of [{}, { "content-length": "1" }]) {
    const body = new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode('{"value":"')); controller.enqueue(new TextEncoder().encode("x".repeat(100))); controller.close(); } });
    await assert.rejects(readJsonBody(request(body, headers), 30), isStatus(413));
  }
  await assert.rejects(readJsonBody(request("{}", { "content-length": "1000" }), 30), isStatus(413));
});

test("multipart streams are limited before the parser accepts a file", async () => {
  const form = new FormData(); form.append("file", new File([new Uint8Array(1024)], "fixture.png", { type: "image/png" }));
  const upload = new Request("https://clinoromedical.com/api/admin/upload", { method: "POST", body: form });
  await assert.rejects(boundedRequest(upload, 200).formData(), isStatus(413));
  const oversized = new Request("https://clinoromedical.com/api/admin/upload", { method: "POST", headers: { "content-type": "multipart/form-data; boundary=test", "content-length": String(UPLOAD_BODY_BYTES + 1) }, body: "test" });
  await assert.rejects(readUploadBody(oversized), isStatus(413));
});

test("upload content signatures must agree with the allowed type", async () => {
  const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=", "base64");
  await validateUpload(new File([png], "one-pixel.png", { type: "image/png" }));
  await validateUpload(new File(["%PDF-1.7\nlocal test fixture"], "fixture.pdf", { type: "application/pdf" }));
  await assert.rejects(validateUpload(new File(["<html>not an image</html>"], "false.png", { type: "image/png" })), isStatus(400));
  await assert.rejects(validateUpload(new File(["<svg/>"], "vector.svg", { type: "image/svg+xml" })), isStatus(400));
});

test("JSON-LD cannot terminate its script and preserves Persian text", () => {
  const value = { name: "کلینورو", note: '</script><div data-test="safe-marker">text</div>', nested: ["<", "&"] };
  const encoded = serializeJsonLd(value);
  assert.equal(encoded.includes("<"), false);
  assert.deepEqual(JSON.parse(encoded), value);
});

test("error responses keep actionable status without leaking internal exceptions", async () => {
  const limited = errorResponse(new HttpError(429, "Too many requests", 10));
  assert.equal(limited.status, 429); assert.equal(limited.headers.get("retry-after"), "10");
  const failure = errorResponse(new Error("private database detail"));
  assert.equal(failure.status, 500);
  assert.equal((await failure.text()).includes("private database"), false);
});
