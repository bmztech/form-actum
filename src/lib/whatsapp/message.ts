import { NURTURE_WHATSAPP_NUMBER, WHATSAPP_NUMBER } from "../config";
import { labelFor, stepById } from "../funnel/navigation";
import { LEAD_NOTES, STEPS } from "../funnel/steps";
import type { Answers } from "../funnel/types";
import type { Tracking } from "../tracking/utm";

function answerLabel(answers: Answers, stepId: string): string {
  const step = stepById(stepId);
  const value = answers[stepId];
  return step && value ? labelFor(step, value) : "";
}

function trackingLines(tracking: Tracking): string[] {
  const entries = Object.entries(tracking).filter(([, v]) => v);
  if (entries.length === 0) return [];
  return ["", "— origem —", ...entries.map(([key, value]) => `${key}: ${value}`)];
}

/** Primeira linha da mensagem — resume o caso para quem for atender. */
export function buildHeadline(answers: Answers): string {
  if (!answers.valor || !answers.devedor) return "Novo lead pelo formulário do site.";
  return `Novo lead: devedor ${answerLabel(answers, "devedor")}, valor ${answerLabel(answers, "valor")}`;
}

/** Monta o texto da mensagem que o lead envia para a Actum. */
export function buildMessage(answers: Answers, tracking: Tracking): string {
  const lines: string[] = [buildHeadline(answers), ""];

  for (const step of STEPS) {
    const value = answers[step.id];
    if (!value || step.hideInSummary) continue;
    lines.push(`${step.summaryLabel}: ${labelFor(step, value)}`);
  }

  const notes = LEAD_NOTES.map((note) => note(answers)).filter((n): n is string => !!n);
  if (notes.length > 0) {
    lines.push("", "— observações —", ...notes);
  }

  lines.push(...trackingLines(tracking));
  return lines.join("\n");
}

/** Link wa.me pronto para abrir a conversa já com a mensagem preenchida. */
export function buildWhatsAppUrl(
  answers: Answers,
  tracking: Tracking,
  whatsappNumber: string = WHATSAPP_NUMBER,
): string {
  const text = encodeURIComponent(buildMessage(answers, tracking));
  return `https://wa.me/${whatsappNumber}?text=${text}`;
}

/**
 * Mensagem da lista de nutrição (Mensagem A). Vai marcada com [NUTRIÇÃO]
 * para não ser confundida com um lead da fila comercial.
 */
export function buildNurtureMessage(answers: Answers, tracking: Tracking): string {
  const lines = [
    "[NUTRIÇÃO] Quero ser avisado(a) quando fizer sentido refazer a simulação.",
    "",
    `Situação do processo: ${answerLabel(answers, "situacao")}`,
    "Aceito receber contato da Actum pelo WhatsApp.",
    ...trackingLines(tracking),
  ];
  return lines.join("\n");
}

export function buildNurtureUrl(
  answers: Answers,
  tracking: Tracking,
  whatsappNumber: string = NURTURE_WHATSAPP_NUMBER,
): string {
  const text = encodeURIComponent(buildNurtureMessage(answers, tracking));
  return `https://wa.me/${whatsappNumber}?text=${text}`;
}
