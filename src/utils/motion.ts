// shortcut: read once at load; a user changing the OS setting mid-session needs a reload
export const prefersReducedMotion =
  typeof window !== 'undefined' && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
