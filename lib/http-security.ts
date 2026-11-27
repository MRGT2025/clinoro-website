export class HttpError extends Error {
  status: number;
  retryAfter?: number;
  constructor(status: number, message: string, retryAfter?: number) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

export function errorResponse(error: unknown): Response {
  const known = error instanceof HttpError;
  const headers: Record<string, string> = { "Cache-Control": "private, no-store" };
  if (known && error.retryAfter) headers["Retry-After"] = String(error.retryAfter);
  return Response.json(
    { error: known ? error.message : "Unable to process request" },
    { status: known ? error.status : 500, headers },
  );
}

/** Use within each mutation handler, after authentication and before reading its body. */
export function assertSameOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  const expected = new URL(request.url).origin;
  if (!origin || origin !== expected) throw new HttpError(403, "Request origin is not allowed");
  const site = request.headers.get("sec-fetch-site");
  if (site === "cross-site" || site === "same-site") {
    throw new HttpError(403, "Cross-site requests are not allowed");
  }
}

export function assertContentType(request: Request, expected: "application/json" | "multipart/form-data"): void {
  const type = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
  if (type !== expected) throw new HttpError(415, "Unsupported content type");
}

/** Content-Length is only an early rejection; the stream enforces the actual byte limit. */
export function boundedRequest(request: Request, maxBytes: number): Request {
  const declared = request.headers.get("content-length");
  if (declared !== null && (!/^\d+$/.test(declared) || Number(declared) > maxBytes)) {
    throw new HttpError(413, "Request body is too large");
  }
  if (!request.body) return request;
  const reader = request.body.getReader();
  let total = 0;
  const body = new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const chunk = await reader.read();
        if (chunk.done) { controller.close(); return; }
        total += chunk.value.byteLength;
        if (total > maxBytes) {
          void reader.cancel().catch(() => undefined);
          controller.error(new HttpError(413, "Request body is too large"));
          return;
        }
        controller.enqueue(chunk.value);
      } catch (error) { controller.error(error); }
    },
    cancel(reason) { return reader.cancel(reason); },
  });
  // Vinext can wrap route requests in a proxy; construct from public fields
  // instead of relying on the native Request constructor's private slots.
  return new Request(request.url, { method: request.method, headers: request.headers, body, duplex: "half" } as RequestInit & { duplex: string });
}

export async function readJsonBody(request: Request, maxBytes: number): Promise<Record<string, unknown>> {
  assertContentType(request, "application/json");
  const limited = boundedRequest(request, maxBytes);
  let value: unknown;
  try { value = await limited.json(); }
  catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(400, "Invalid JSON body");
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new HttpError(400, "Invalid JSON body");
  return value as Record<string, unknown>;
}

export const ADMIN_CONTENT_BYTES = 8 * 1024 * 1024;
export const SMALL_JSON_BYTES = 32 * 1024;
export const UPLOAD_BODY_BYTES = 80 * 1024 * 1024 + 128 * 1024;

export async function readUploadBody(request: Request): Promise<FormData> {
  assertContentType(request, "multipart/form-data");
  const limited = boundedRequest(request, UPLOAD_BODY_BYTES);
  try { return await limited.formData(); }
  catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(400, "Invalid upload body");
  }
}
