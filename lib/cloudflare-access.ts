import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import { getRuntimeEnv } from "../db";

type HeaderReader = Pick<Headers, "get">;

export type CloudflareAccessIdentity = {
  email: string;
  fullName: string | null;
};

const jwksByTeamDomain = new Map<
  string,
  ReturnType<typeof createRemoteJWKSet>
>();

export function usesCloudflareAccess() {
  return getRuntimeEnv().AUTH_PROVIDER === "cloudflare-access";
}

export async function getCloudflareAccessIdentity(
  requestHeaders: HeaderReader,
): Promise<CloudflareAccessIdentity | null> {
  const env = getRuntimeEnv();
  if (env.AUTH_PROVIDER !== "cloudflare-access") return null;

  const teamDomain = normalizedTeamDomain(env.TEAM_DOMAIN);
  const audience = env.POLICY_AUD?.trim();
  const token = requestHeaders.get("cf-access-jwt-assertion");
  if (!teamDomain || !audience || !token) return null;

  try {
    const jwks = remoteJwks(teamDomain);
    const { payload } = await jwtVerify(token, jwks, {
      issuer: teamDomain,
      audience,
    });
    return identityFromPayload(payload);
  } catch {
    return null;
  }
}

function remoteJwks(teamDomain: string) {
  const existing = jwksByTeamDomain.get(teamDomain);
  if (existing) return existing;

  const created = createRemoteJWKSet(
    new URL(`${teamDomain}/cdn-cgi/access/certs`),
  );
  jwksByTeamDomain.set(teamDomain, created);
  return created;
}

function normalizedTeamDomain(value: string | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      !url.hostname.endsWith(".cloudflareaccess.com")
    ) {
      return null;
    }
    return url.origin;
  } catch {
    return null;
  }
}

function identityFromPayload(
  payload: JWTPayload,
): CloudflareAccessIdentity | null {
  const email =
    typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;

  const name =
    typeof payload.name === "string" && payload.name.trim()
      ? payload.name.trim()
      : null;
  return { email, fullName: name };
}
