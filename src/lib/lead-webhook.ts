/**
 * Envio do lead qualificado ao Banco de Leads (BI).
 *
 * O navegador nunca chama o BI direto: manda para /api/lead-webhook (mesma
 * origem, sem token), e a rota servidor repassa ao BI com o token das
 * variáveis de ambiente. Assim não há CORS e o token não vai para o cliente.
 */

import { WHATSAPP_NUMBER } from "./config";
import type { Answers } from "./funnel/types";
import type { Tracking } from "./tracking/utm";
import { buildMessage } from "./whatsapp/message";

/** Identifica no BI a empresa e o produto de origem do lead. */
export const LEAD_FORM = "actum";

export type LeadWebhookPayload = {
  form: string;
  /** URL completa da página no momento do clique. */
  pagina: string;
  /** ISO 8601. */
  clicadoEm: string;
  nome: string | null;
  /** Só dígitos (DDD + número), sem o 55. */
  telefone: string | null;
  /** Número da Actum que recebe a mensagem. */
  whatsappDestino: string;
  /** Texto pré-preenchido no wa.me. */
  mensagem: string;
  /** Respostas cruas: chave = id do step, valor = `value` interno da opção. */
  respostas: Answers;
  tracking: Tracking;
};

/** "(41) 99999-0003" -> "41999990003"; vazio -> null. */
export function phoneDigits(input: string | undefined): string | null {
  const digits = (input ?? "").replace(/\D/g, "");
  return digits || null;
}

export function buildLeadPayload(
  answers: Answers,
  tracking: Tracking,
  pagina: string,
  clicadoEm: string = new Date().toISOString(),
  whatsappDestino: string = WHATSAPP_NUMBER,
): LeadWebhookPayload {
  return {
    form: LEAD_FORM,
    pagina,
    clicadoEm,
    nome: answers.nome?.trim() || null,
    telefone: phoneDigits(answers.telefone),
    whatsappDestino,
    mensagem: buildMessage(answers, tracking),
    respostas: answers,
    tracking,
  };
}

/**
 * Dispara sem esperar resposta. `keepalive` mantém a requisição viva quando a
 * página sai para o wa.me; erros são ignorados para o WhatsApp abrir sempre.
 */
export function sendLeadWebhook(payload: LeadWebhookPayload): void {
  if (typeof fetch !== "function") return;
  fetch("/api/lead-webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}
