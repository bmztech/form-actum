/**
 * Tipos do funil. Descrevem o formato de uma pergunta (step) — as perguntas
 * em si ficam em ./steps.ts, as telas de encerramento em ./endings.ts e o
 * motor que percorre tudo em ./navigation.ts.
 */

export type Answers = Record<string, string>;

export type Choice = {
  value: string;
  label: string;
};

export type QuestionText = string | ((answers: Answers) => string);

type Base = {
  id: string;
  summaryLabel: string;
  question: QuestionText;
  /** Texto de ajuda mostrado abaixo da pergunta. */
  helper?: string;
  hideInSummary?: boolean;
};

export type Step = Base &
  (
    | {
        kind: "text" | "phone" | "name";
        placeholder: string;
        optional?: boolean;
        next: string;
      }
    | {
        kind: "choice";
        options: Choice[];
        /** "grid" — lista longa em duas colunas, sem atalho de teclado. */
        layout?: "grid";
        next: string | ((value: string) => string);
      }
    | {
        /** Lista longa num <select> nativo (ex.: os 27 estados). */
        kind: "select";
        options: Choice[];
        placeholder: string;
        next: string;
      }
    | {
        /** Checkboxes que o lead precisa marcar todos para seguir. */
        kind: "consent";
        options: Choice[];
        next: string;
      }
  );

/**
 * Tela que encerra o funil sem enviar o lead para a fila comercial.
 * Um step aponta para ela devolvendo `endingId(...)` no `next`.
 */
export type Ending = {
  title: string;
  message: string;
  icon: string;
  /** Mostra o opt-in de nutrição (Mensagem A). */
  nurture?: boolean;
  /** Mostra "Corrigir o valor informado", que volta para este step. */
  retryStep?: string;
};
