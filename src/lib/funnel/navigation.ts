/**
 * Motor do funil: funções puras que interpretam o array STEPS.
 * Não contém regra de negócio — perguntas, ramificações e sub-perguntas
 * condicionais ficam em ./steps.ts.
 */   

import { BRANCH_STEPS, STEPS } from "./steps";
import type { Answers, Step } from "./types";

export const stepById = (id: string) => STEPS.find((s) => s.id === id);

export function resolveNext(step: Step, value: string): string {
  return typeof step.next === "function" ? step.next(value) : step.next;
}

/** Separador dos valores marcados num step "consent" (ex.: "a,b"). */
export const CONSENT_SEPARATOR = ",";

export function labelFor(step: Step, value: string): string {
  if (step.kind === "choice" || step.kind === "select") {
    return step.options.find((o) => o.value === value)?.label ?? value;
  }
  if (step.kind === "consent") {
    return value
      .split(CONSENT_SEPARATOR)
      .map((v) => step.options.find((o) => o.value === v)?.label ?? v)
      .join(" · ");
  }
  return value;
}

export function questionOf(step: Step, answers: Answers): string {
  return typeof step.question === "function" ? step.question(answers) : step.question;
}

/** Total exato de perguntas do caminho que o lead está percorrendo. */
export function pathTotal(answers: Answers): number {
  const branchIds = Object.keys(BRANCH_STEPS);
  const base = STEPS.filter((s) => !branchIds.includes(s.id)).length;
  const extra = branchIds.filter((id) => BRANCH_STEPS[id](answers)).length;
  return base + extra;
}
