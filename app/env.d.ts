declare module "react-dom/server.browser" {
  export * from "react-dom/server"
}

declare module "virtual:remix/server-build" {
  export * from "@remix-run/dev/server-build"
}

// quick-and-dirty globalThis.env exposed in fetch handler
declare const env: {
  KV: import("@cloudflare/workers-types").KVNamespace
  R2_BUCKET: import("@cloudflare/workers-types").R2Bucket
  DB: import("@cloudflare/workers-types").D1Database
}
