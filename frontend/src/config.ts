import { DEV_HOST_IDENTIFIER, is } from "./utils/is";

export const config = {
  apiBaseUrl: '/api',
}

export function getApiHostname(): string {
  if(is.localhost) return `http://localhost:8000`;
  if(is.dev) return `http://${DEV_HOST_IDENTIFIER}`

  throw new Error(`Can't find domain name for this environment`)
}

export type Config = typeof config;
