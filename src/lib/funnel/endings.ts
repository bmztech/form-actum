/**
 * Telas de encerramento do funil — quem cai aqui não vai para a fila
 * comercial. As letras seguem o documento "Formulário de Qualificação de
 * Leads — Actum" (Mensagens A a F), para facilitar a conferência.
 *
 * Um step encerra o funil devolvendo `endingId("A")` no `next`.
 */

import { RPV_TETO } from "../config";
import { formatReais } from "../format/currency";
import type { Ending } from "./types";

const ENDING_PREFIX = "end:";

export const ENDINGS = {
  /** P1: em andamento ou com recurso. Oferece a lista de nutrição. */
  A: {
    icon: "⏳",
    title: "Ainda não conseguimos antecipar o seu crédito",
    message:
      "A Actum compra créditos de processos que já terminaram, sem possibilidade de recurso. Se quiser, deixe seu WhatsApp e avisamos você quando fizer sentido refazer a simulação.",
    nurture: true,
  },
  /** P2: devedor não federal (Estado, Prefeitura, banco ou empresa). */
  B: {
    icon: "🏛️",
    title: "Obrigado pelo seu interesse",
    message:
      "Hoje a Actum compra apenas créditos pagos pelo Governo Federal, como os de ações contra o INSS. Créditos contra Estados, Prefeituras, bancos ou empresas não fazem parte do que atendemos no momento.",
  },
  /** P3: responsável legal por menor ou incapaz. */
  C: {
    icon: "🤝",
    title: "Agradecemos o seu contato",
    message:
      "No momento, a Actum não antecipa créditos de menores de idade ou de pessoas incapazes.",
  },
  /** P4: abaixo do valor mínimo. */
  D: {
    icon: "📉",
    title: "Valor abaixo do mínimo",
    message:
      "O valor que você informou está abaixo do mínimo que a Actum consegue antecipar hoje. Agradecemos o seu interesse.",
    retryStep: "valor",
  },
  /** P4: acima do teto da RPV. */
  E: {
    icon: "📈",
    title: "Crédito acima do limite da RPV",
    message: `Hoje a Actum antecipa apenas créditos federais pagos por Requisição de Pequeno Valor (RPV), que tem limite de 60 salários mínimos (${formatReais(RPV_TETO)},00). O seu crédito está acima desse limite ou foi emitido como precatório, por isso ainda não conseguimos avançar com a antecipação.`,
    retryStep: "valor",
  },
  /** P1: valor já depositado ou recebido. */
  F: {
    icon: "💰",
    title: "Não há o que antecipar",
    message:
      "Se o valor já foi depositado, ele já está disponível para você sacar, e não há o que antecipar. Em caso de dúvida sobre o saque, fale com o advogado do seu processo.",
  },
} satisfies Record<string, Ending>;

export type EndingKey = keyof typeof ENDINGS;

/** Id que um `next` devolve para encerrar o funil numa dessas telas. */
export const endingId = (key: EndingKey) => `${ENDING_PREFIX}${key}`;

/** Devolve a tela de encerramento de um id, ou `undefined` se não for uma. */
export function endingOf(id: string): Ending | undefined {
  if (!id.startsWith(ENDING_PREFIX)) return undefined;
  return ENDINGS[id.slice(ENDING_PREFIX.length) as EndingKey];
}
