/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { AsyncLocalStorage } from "node:async_hooks";
import { isCatalogDocumentRequest } from "../lib/catalog";
import { createAccessVerifier, isAdminPath, trustedSitesIdentity, type AuthenticatedUser } from "../lib/access-security";

// Defined by the build target, never inferred from a request header or hostname.
declare const __CLINORO_TRUSTED_SITES_AUTH__: boolean;
const trustedSitesBuild = typeof __CLINORO_TRUSTED_SITES_AUTH__ !== "undefined" && __CLINORO_TRUSTED_SITES_AUTH__;
const requestIdentity = new AsyncLocalStorage<{ user: AuthenticatedUser | null }>();
// eslint-disable-next-line react/display-name -- request-local identity accessor, not a React component
globalThis.__CLINORO_AUTHENTICATED_USER = () => requestIdentity.getStore()?.user ?? null;
let verifier: ReturnType<typeof createAccessVerifier> | null = null;
let verifierConfiguration = "";

// Share one D1 read/normalization across layout, metadata and page rendering.
// Each fetch gets its own store; edits are visible on the very next request.
const contentRequests = new AsyncLocalStorage<Map<string, Promise<unknown>>>();
globalThis.__CLINORO_REQUEST_CACHE = () => contentRequests.getStore();

interface Env {
  CLINORO_AUTH_MODE?: string;
  CLINORO_ACCESS_ISSUER?: string;
  CLINORO_ACCESS_AUDIENCE?: string;
  ASSETS: Fetcher;
  DB: D1Database;
  BUCKET: R2Bucket;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

const PRIMARY_HOSTNAME = "clinoromedical.com";
const REDIRECT_HOSTNAMES = new Set([
  "www.clinoromedical.com",
  "clinoromedical.ir",
  "www.clinoromedical.ir",
]);

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    globalThis.__CLINORO_RUNTIME_ENV = env;
    const url = new URL(request.url);

    if (REDIRECT_HOSTNAMES.has(url.hostname.toLowerCase()) || (url.hostname.toLowerCase() === PRIMARY_HOSTNAME && url.protocol === "http:")) {
      url.protocol = "https:";
      url.hostname = PRIMARY_HOSTNAME;
      url.port = "";
      return new Response(null, {
        status: 308,
        headers: {
          Location: url.toString(),
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    let user: AuthenticatedUser | null = null;
    if (trustedSitesBuild) {
      // Only Sites builds run behind the platform's authenticated dispatch boundary.
      user = trustedSitesIdentity(request.headers);
    } else if (isAdminPath(url.pathname)) {
      if (env.CLINORO_AUTH_MODE !== "cloudflare-access") {
        return withSecurityHeaders(Response.json({ error: "Admin authentication is unavailable" }, { status: 503 }), url);
      }
      const configurationKey = (env.CLINORO_ACCESS_ISSUER ?? "") + "\n" + (env.CLINORO_ACCESS_AUDIENCE ?? "");
      if (!verifier || verifierConfiguration !== configurationKey) {
        verifier = createAccessVerifier({ issuer: env.CLINORO_ACCESS_ISSUER, audience: env.CLINORO_ACCESS_AUDIENCE });
        verifierConfiguration = configurationKey;
      }
      try { user = await verifier(request.headers.get("cf-access-jwt-assertion")); }
      catch { return withSecurityHeaders(Response.json({ error: "Unauthorized" }, { status: 401 }), url); }
    }
    const cleanHeaders = new Headers(request.headers);
    for (const name of ["oai-authenticated-user-email", "oai-authenticated-user-full-name", "oai-authenticated-user-full-name-encoding", "cf-access-authenticated-user-email"]) cleanHeaders.delete(name);
    request = new Request(request, { headers: cleanHeaders });

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      const imageResponse=await handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
      return withSecurityHeaders(imageResponse,url);
    }

    const publicBlogDocument = request.method === "GET"
      && /^\/blog(?:\/[^/]+)?$/.test(url.pathname)
      && !request.headers.has("cookie")
      && !request.headers.has("authorization")
      && !request.headers.has("rsc")
      && !request.headers.has("next-router-state-tree")
      && request.headers.get("accept")?.includes("text/html");
    const catalogDocument = isCatalogDocumentRequest(request.method, url.pathname, request.headers) || publicBlogDocument;
    if (catalogDocument) {
      const cached = await readCatalogCache(url);
      if (cached) return privateDocument(cached);
    }

    const response=await requestIdentity.run({ user },()=>contentRequests.run(new Map(),()=>handler.fetch(request, env, ctx)));
    const secured = withSecurityHeaders(response,url);
    if (catalogDocument && secured.status === 200 && secured.headers.get("content-type")?.includes("text/html") && !secured.headers.has("set-cookie")) {
      storeCatalogCache(url, secured, ctx);
    }
    return secured;
  },
};

const CATALOG_CACHE_SECONDS = 120;

type EdgeCache = {
  match(request: Request): Promise<Response | undefined>;
  put(request: Request, response: Response): Promise<void>;
};

function edgeCache() {
  const storage = (globalThis as { caches?: { default?: EdgeCache } }).caches;
  return storage?.default;
}

function catalogCacheRequest(url: URL) {
  return new Request(`https://clinoro-catalog-cache.internal/seo-20261118-v2${url.pathname}`);
}

async function readCatalogCache(url: URL) {
  try {
    return (await edgeCache()?.match(catalogCacheRequest(url))) ?? null;
  } catch {
    return null;
  }
}

function storeCatalogCache(url: URL, response: Response, ctx: ExecutionContext) {
  try {
    const cache = edgeCache();
    if (!cache) return;
    const headers = new Headers(response.headers);
    headers.set("Cache-Control", `public, s-maxage=${CATALOG_CACHE_SECONDS}, max-age=0`);
    const stored = new Response(response.clone().body, { status: response.status, headers });
    ctx.waitUntil(cache.put(catalogCacheRequest(url), stored).catch(() => undefined));
  } catch {
    // A cache miss must still render. Catalog HTML stays correct either way.
  }
}

function privateDocument(response: Response) {
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "no-store, must-revalidate");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

function withSecurityHeaders(response:Response,url:URL){
  const headers=new Headers(response.headers);
  headers.set("X-Content-Type-Options","nosniff");
  headers.set("X-Frame-Options","SAMEORIGIN");
  headers.set("Referrer-Policy","strict-origin-when-cross-origin");
  headers.set("Permissions-Policy","camera=(), microphone=(), geolocation=(), payment=()");
  if(url.protocol==="https:")headers.set("Strict-Transport-Security","max-age=31536000; includeSubDomains");
  if(headers.get("content-type")?.includes("text/html"))headers.set("Content-Security-Policy","default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https:; media-src 'self' blob: https:; font-src 'self' data:; connect-src 'self' https:; frame-src 'self'");
  if(isAdminPath(url.pathname))headers.set("Cache-Control","private, no-store");
  return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}

export default worker;
