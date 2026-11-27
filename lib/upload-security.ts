import { HttpError } from "./http-security";

const limits: Record<string, number> = {
  "image/jpeg": 15 * 1024 * 1024,
  "image/png": 15 * 1024 * 1024,
  "image/webp": 15 * 1024 * 1024,
  "image/gif": 15 * 1024 * 1024,
  "image/avif": 15 * 1024 * 1024,
  "video/mp4": 80 * 1024 * 1024,
  "video/webm": 80 * 1024 * 1024,
  "video/quicktime": 80 * 1024 * 1024,
  "application/pdf": 25 * 1024 * 1024,
};

export async function validateUpload(file: File): Promise<void> {
  const type = file.type.toLowerCase();
  const limit = limits[type];
  if (!limit || !file.size || file.size > limit) throw new HttpError(400, "Unsupported file type or size");
  const bytes = new Uint8Array(await file.slice(0, 4096).arrayBuffer());
  const starts = (...signature: number[]) => signature.every((byte, index) => bytes[index] === byte);
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));
  const isoMedia = bytes.length >= 12 && ascii(4, 8) === "ftyp";
  const brands = isoMedia ? ascii(8, Math.min(bytes.length, 80)) : "";
  const matches: Record<string, boolean> = {
    "image/jpeg": starts(0xff, 0xd8, 0xff),
    "image/png": starts(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a),
    "image/gif": ["GIF87a", "GIF89a"].includes(ascii(0, 6)),
    "image/webp": ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP",
    "image/avif": isoMedia && /avif|avis/.test(brands),
    "video/mp4": isoMedia && /isom|iso[2-9]|mp4[12]|avc1|M4V |dash|MSNV/.test(brands),
    "video/quicktime": (isoMedia && brands.includes("qt  ")) || (bytes.length >= 8 && ["moov", "mdat", "wide"].includes(ascii(4, 8))),
    "video/webm": starts(0x1a, 0x45, 0xdf, 0xa3) && ascii(0, bytes.length).includes("webm"),
    "application/pdf": ascii(0, 5) === "%PDF-",
  };
  if (!matches[type]) throw new HttpError(400, "File contents do not match its declared type");
}
