import { remixHandler } from "./base.js"

export default {
  fetch: createFetchHandler(),
}

function createFetchHandler() {
  return async (request: Request, env: any) => {
    Object.assign(globalThis, { env })

    return remixHandler(request, env)
  }
}
