/// <reference types="vite/client" />

// This file previously held a pasted `VITE_API_URL= "http://localhost:4000"`,
// which is not valid TypeScript in a .d.ts and declared nothing. Nothing
// caught it because `vite build` is transpile-only and there was no typecheck
// script (BrandHub issue #23).
interface ImportMetaEnv {
  // Base URL of the API, including the /api suffix. Required: getApiBaseUrl()
  // in src/actions/brandActions.ts throws when it is unset or blank rather than
  // falling back to a default backend. Read it through that helper, never
  // directly. Still optional to TypeScript because import.meta.env genuinely
  // carries no value when .env is absent — the guard is the runtime one.
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
