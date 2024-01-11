import { vitePluginViteNodeMiniflare } from "@hiogawa/vite-node-miniflare"
import { unstable_vitePlugin as remix } from "@remix-run/dev"
import { Log } from "miniflare"
import { defineConfig } from "vite"

export default defineConfig({
  clearScreen: false,
  appType: "custom",
  ssr: {
    noExternal: true,
  },
  plugins: [
    vitePluginViteNodeMiniflare({
      debug: true,
      entry: "./app/worker-entry-wrapper.ts",
      miniflareOptions(options) {
        // @ts-ignore why type error
        options.log = new Log()
        options.kvPersist = ".wrangler/state/v3/kv"
        options.r2Persist = ".wrangler/state/v3/r2"
        options.d1Persist = ".wrangler/state/v3/d1"

        // @ts-ignore
        options.kvNamespaces = ["KV"]
        // @ts-ignore
        options.r2Buckets = ["R2_BUCKET"]
        // @ts-ignore
        options.d1Databases = ["DB"]
      },
      preBundle: {
        include: [
          "react",
          "react/jsx-dev-runtime",
          "react-dom",
          "react-dom/server.browser",
        ],
      },
      customRpc: {
        // DevServerHook is implemented via custom rpc
        // https://github.com/remix-run/remix/blob/db4471d2e32a175abdcb907b877f9a510c735d8b/packages/remix-server-runtime/dev.ts#L37-L48
        __remixGetCriticalCss: (...args: any[]) => {
          return globalThis["__remix_devServerHooks"].getCriticalCss(...args)
        },
      },
    }),
    remix(),
  ],
})
