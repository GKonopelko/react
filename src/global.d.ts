export {};
declare global {
  const vi: (typeof import('vitest'))['vi'];
  interface Window {
    fetch: typeof fetch;
  }
  namespace NodeJS {
    interface Global {
      fetch: typeof fetch;
    }
  }
  const global: typeof globalThis;
}
