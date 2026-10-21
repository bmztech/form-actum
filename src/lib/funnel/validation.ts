import { isValidName } from "../input/name";
import { isValidPhone } from "../input/phone";
import { CONSENT_SEPARATOR } from "./navigation";
import type { Step } from "./types";

/** Mensagem de erro para a resposta digitada, ou `null` se ela for válida. */
export function validateStep(step: Step, value: string): string | null {
  switch (step.kind) {
    case "phone":
      return isValidPhone(value) ? null : "Digite um WhatsApp válido com DDD.";
    case "name":
      return isValidName(value) ? null : "Digite um nome válido.";
    case "text":
      return step.optional || value.length >= 2 ? null : "Por favor, preencha este campo.";
    case "select":
      return step.options.some((o) => o.value === value) ? null : "Selecione uma opção.";
    case "consent": {
      const checked = value ? value.split(CONSENT_SEPARATOR) : [];
      const allChecked = step.options.every((o) => checked.includes(o.value));
      return allChecked ? null : "Marque todas as opções para continuar.";
    }
    case "choice":
      return null;
  }
}
