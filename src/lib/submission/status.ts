/**
 * Marca, por navegador, se o lead já concluiu o envio do formulário —
 * evita fazer a pessoa repetir o funil inteiro se abrir o link de novo.
 */

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "actum_submitted";

function hasSubmitted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markSubmitted(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // localStorage indisponível (modo privado/iframe) — segue sem persistir.
  }
}

function subscribe(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

/**
 * Lê "já enviou?" de forma segura pra SSR/hidratação — retorna `false` no
 * servidor e no primeiro paint do cliente, depois sincroniza com o valor
 * real do localStorage sem gerar mismatch de hidratação.
 */
export function useHasSubmitted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => hasSubmitted(),
    () => false,
  );
}
