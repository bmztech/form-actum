/**
 * Wrapper fino sobre o `fbq` do Meta Pixel (carregado em src/app/layout.tsx).
 * Existe só para não espalhar `window.fbq as any` pelo resto do código.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackPixelEvent(event: string): void {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", event);
  }
}
