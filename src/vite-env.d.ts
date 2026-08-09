/// <reference types="vite/client" />

// This file previously held a pasted `VITE_API_URL= "http://localhost:4000"`,
// which is not valid TypeScript in a .d.ts and declared nothing. Nothing
// caught it because `vite build` is transpile-only and there was no typecheck
// script (BrandHub issue #23).
interface ImportMetaEnv {
  // Base URL of the API, including the /api suffix. Optional: getApiBaseUrl()
  // in src/actions/brandActions.ts falls back to the hosted deployment when it
  // is unset or empty. Read it through that helper, never directly.
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
