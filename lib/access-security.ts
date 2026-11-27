export type AuthenticatedUser = {
  email: string;
  displayName: string;
  fullName: string | null;
  authProvider: "cloudflare-access" | "chatgpt";
};

export type AccessConfiguration = { issuer?: string; audience?: string };
type Claims = Record<string, unknown>;
type VerificationOptions = { fetcher?: typeof fetch; clock?: () => number };

function decodePart(part: string): Uint8Array<ArrayBuffer> {
  if (!part || !/^[A-Za-z0-9_-]+$/.test(part)) throw new Error("Invalid token");
  const binary = atob(part.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(part.length / 4) * 4, "="));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function parsePart(part: string): Claims {
  const value = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(decodePart(part)));
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid token");
  return value;
}

/** Fixed issuer/audience configuration; never choose a key URL from unverified token fields. */
export function createAccessVerifier(configuration: AccessConfiguration, options: VerificationOptions = {}) {
  const fetcher = options.fetcher ?? fetch;
  const clock = options.clock ?? Date.now;
  let keys = new Map<string, CryptoKey>();
  let expiresAt = 0;
  let refreshedAt = -Infinity;
  let inflight: Promise<void> | null = null;

  async function refresh(): Promise<void> {
    if (inflight) return inflight;
    if (clock() - refreshedAt < 30_000) return;
    refreshedAt = clock();
    inflight = (async () => {
      const response = await fetcher(configuration.issuer + "/cdn-cgi/access/certs", {
        headers: { Accept: "application/json" }, redirect: "error", signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) throw new Error("Identity keys unavailable");
      const body = await response.text();
      if (body.length > 64 * 1024) throw new Error("Invalid identity keys");
      const document = JSON.parse(body) as { keys?: Array<JsonWebKey & { kid?: string }> };
      if (!Array.isArray(document.keys) || document.keys.length > 16) throw new Error("Invalid identity keys");
      const fresh = new Map<string, CryptoKey>();
      for (const key of document.keys) {
        if (key.kty !== "RSA" || !key.kid || (key.alg && key.alg !== "RS256") || (key.use && key.use !== "sig")) continue;
        fresh.set(key.kid, await crypto.subtle.importKey("jwk", key, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]));
      }
      if (!fresh.size) throw new Error("Invalid identity keys");
      keys = fresh;
      expiresAt = clock() + 5 * 60_000;
    })().finally(() => { inflight = null; });
    return inflight;
  }

  return async function verify(token: string | null): Promise<AuthenticatedUser> {
    if (!configuration.issuer || !/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(configuration.issuer) || !configuration.audience) throw new Error("Missing identity configuration");
    if (!token || token.length > 16 * 1024) throw new Error("Missing or invalid token");
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("Invalid token");
    const header = parsePart(parts[0]);
    const claims = parsePart(parts[1]);
    if (header.alg !== "RS256" || typeof header.kid !== "string" || header.kid.length > 200 || header.crit !== undefined) throw new Error("Invalid token");
    const now = clock() / 1000;
    const audience = claims.aud;
    if (claims.iss !== configuration.issuer || !(audience === configuration.audience || (Array.isArray(audience) && audience.includes(configuration.audience)))) throw new Error("Invalid token claims");
    if (typeof claims.exp !== "number" || !Number.isFinite(claims.exp) || claims.exp <= now) throw new Error("Expired token");
    if (claims.nbf !== undefined && (typeof claims.nbf !== "number" || !Number.isFinite(claims.nbf) || claims.nbf > now)) throw new Error("Token is not active");
    if (claims.iat !== undefined && (typeof claims.iat !== "number" || !Number.isFinite(claims.iat) || claims.iat > now + 30)) throw new Error("Invalid token time");
    if (expiresAt <= clock() || !keys.has(header.kid)) await refresh();
    const key = keys.get(header.kid);
    if (!key || expiresAt <= clock()) throw new Error("Unknown identity key");
    const valid = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, decodePart(parts[2]), new TextEncoder().encode(parts[0] + "." + parts[1]));
    if (!valid) throw new Error("Invalid signature");
    if (typeof claims.email !== "string" || claims.email.length > 320 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(claims.email)) throw new Error("User identity required");
    const email = claims.email.trim().toLowerCase();
    const fullName = typeof claims.name === "string" && claims.name.length < 200 ? claims.name : null;
    return { email, displayName: fullName ?? email, fullName, authProvider: "cloudflare-access" };
  };
}

/** This boundary is enabled only by the trusted Sites build, never by a request header/host. */
export function trustedSitesIdentity(headers: Headers): AuthenticatedUser | null {
  const email = headers.get("oai-authenticated-user-email")?.trim().toLowerCase();
  if (!email || email.length > 320 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  let fullName: string | null = null;
  if (headers.get("oai-authenticated-user-full-name-encoding") === "percent-encoded-utf-8") {
    try { fullName = decodeURIComponent(headers.get("oai-authenticated-user-full-name") ?? "") || null; } catch { /* Optional name. */ }
  }
  return { email, fullName, displayName: fullName ?? email, authProvider: "chatgpt" };
}

export function isAdminPath(pathname: string): boolean {
  let path: string;
  try { path = decodeURIComponent(pathname).replace(/\/{2,}/g, "/"); } catch { return false; }
  return path === "/admin" || path.startsWith("/admin/") || path === "/api/admin" || path.startsWith("/api/admin/");
}

declare global {
  var __CLINORO_AUTHENTICATED_USER: (() => AuthenticatedUser | null) | undefined;
}
