// Auth is handled client-side by AppShell via localStorage tokens.
// Proxy cannot access localStorage, so we do not redirect here.
// All protected route guarding happens in src/components/dashboard/AppShell.tsx.

export const config = {
  matcher: [], // disabled
};

export function proxy() {}
