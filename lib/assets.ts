const optimizedAssets: Record<string, string> = {
  "/assets/patient-monitor.jpg": "/assets/patient-monitor.webp",
  "/assets/clinoro-logo-primary.png": "/assets/clinoro-logo-primary.webp",
};

/** Use smaller first-party variants while preserving custom and external media URLs. */
export function optimizedAssetUrl(source: string) {
  return optimizedAssets[source] || source;
}
