import vinext from "vinext";
import { defineConfig } from "vite";
import hostingConfig from "./.openai/hosting.json";
import { sites } from "./build/sites-vite-plugin";

const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  "00000000-0000-4000-8000-000000000000";

const { d1, r2 } = hostingConfig;
const isStandaloneCloudflareBuild =
  process.env.CLINORO_TARGET === "cloudflare";
const standaloneD1DatabaseId =
  process.env.CLINORO_D1_DATABASE_ID?.trim();
const standaloneR2BucketName =
  process.env.CLINORO_R2_BUCKET_NAME?.trim();

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";

const localBindingConfig = {
  main: "./worker/index.ts",
  compatibility_date: "2026-05-15",
  compatibility_flags: ["nodejs_compat"],
  d1_databases: d1
    ? [
        {
          binding: d1,
          database_name: "site-creator-d1",
          database_id: SITE_CREATOR_PLACEHOLDER_DATABASE_ID,
        },
      ]
    : [],
  r2_buckets: r2
    ? [
        {
          binding: r2,
          bucket_name: "site-creator-r2",
        },
      ]
    : [],
};

function cloudflareBindingConfig() {
  if (!standaloneD1DatabaseId || !standaloneR2BucketName) {
    throw new Error(
      "Cloudflare build requires CLINORO_D1_DATABASE_ID and CLINORO_R2_BUCKET_NAME.",
    );
  }

  return {
    name: "clinoro-website",
    main: "./worker/index.ts",
    compatibility_date: "2026-05-15",
    compatibility_flags: ["nodejs_compat"],
    d1_databases: [
      {
        binding: "DB",
        database_name: "clinoro-production",
        database_id: standaloneD1DatabaseId,
      },
    ],
    r2_buckets: [
      {
        binding: "BUCKET",
        bucket_name: standaloneR2BucketName,
      },
    ],
  };
}

export default defineConfig(async () => {
  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import("@cloudflare/vite-plugin");

  return {
    server: {
      host: "0.0.0.0",
      allowedHosts: ["terminal.local"],
      ...(isCodexSeatbeltSandbox
        ? { watch: { useFsEvents: false, usePolling: true } }
        : {}),
    },
    plugins: [
      vinext(),
      sites(),
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        inspectorPort: false,
        config: isStandaloneCloudflareBuild
          ? cloudflareBindingConfig()
          : localBindingConfig,
      }),
    ],
  };
});
