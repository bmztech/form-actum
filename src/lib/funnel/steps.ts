/**
 * Definição declarativa do funil de qualificação da Actum.
 *
 * Segue o documento "Formulário de Qualificação de Leads — Actum" (08/10/2026):
 *   Etapa 1 (situacao)     -> em andamento/recurso: Mensagem A; já recebeu: F
 *   Etapa 2 (devedor)      -> Estado, Prefeitura, banco ou empresa: Mensagem B
 *   Etapa 3 (relacao)      -> herdeiro/cônjuge: sub-pergunta (habilitacao)
 *                          -> tutor/curador: Mensagem C
 *   Etapa 4 (valor)        -> abaixo do mínimo: D; acima do teto da RPV: E
 *   Etapa 5 (objetivo)
 *   Etapa 6 (nome, telefone, estado, processo, aceites)
 *
 * Para mudar perguntas, opções ou o encadeamento condicional, edite só o
 * array STEPS abaixo (e BRANCH_STEPS, se a ramificação mudar a contagem):
 *   - next como string  -> vai sempre para esse id
 *   - next como função  -> decide a partir da resposta (lógica condicional)
 *   - endingId("X")     -> encerra na tela X de ./endings.ts
 *
 * "submit" é reservado: encerra o funil e monta o WhatsApp.
 */

import { RPV_TETO, VALOR_MINIMO } from "../config";
import { formatReais } from "../format/currency";
import { endingId } from "./endings";
import type { Answers, Step } from "./types";

export const FIRST_STEP = "situacao";

const ESTADOS = [
  ["ac", "Acre"],
  ["al", "Alagoas"],
  ["ap", "Amapá"],
  ["am", "Amazonas"],
  ["ba", "Bahia"],
  ["ce", "Ceará"],
  ["df", "Distrito Federal"],
  ["es", "Espírito Santo"],
  ["go", "Goiás"],
  ["ma", "Maranhão"],
  ["mt", "Mato Grosso"],
  ["ms", "Mato Grosso do Sul"],
  ["mg", "Minas Gerais"],
  ["pa", "Pará"],
  ["pb", "Paraíba"],
  ["pr", "Paraná"],
  ["pe", "Pernambuco"],
  ["pi", "Piauí"],
  ["rj", "Rio de Janeiro"],
  ["rn", "Rio Grande do Norte"],
  ["rs", "Rio Grande do Sul"],
  ["ro", "Rondônia"],
  ["rr", "Roraima"],
  ["sc", "Santa Catarina"],
  ["sp", "São Paulo"],
  ["se", "Sergipe"],
  ["to", "Tocantins"],
].map(([value, name]) => ({ value, label: `${name} (${value.toUpperCase()})` }));

export const STEPS: Step[] = [
  // Etapa 1 — Filtro de elegibilidade básica
  {
    id: "situacao",
    kind: "choice",
    summaryLabel: "Situação do processo",
    question: "Qual é a situação atual do seu processo?",
    helper:
      "Decisão definitiva é quando o processo terminou e não cabe mais recurso/revisão da decisão (trânsito em julgado).",
    options: [
      { value: "rpv_emitida", label: "Ganhei, não cabe mais recurso e a ordem de pagamento (RPV) já foi emitida" },
      { value: "aguardando", label: "Ganhei, não cabe mais recurso, mas a ordem de pagamento ainda não foi emitida" },
      { value: "recorreu", label: "Ganhei, mas a outra parte recorreu ou ainda pode recorrer" },
      { value: "andamento", label: "O processo ainda está em andamento, sem decisão" },
      { value: "recebido", label: "O valor já foi depositado ou eu já recebi" },
      { value: "incerto", label: "Não tenho certeza" },
    ],
    next: (v) => {
      if (v === "recorreu" || v === "andamento") return endingId("A");
      if (v === "recebido") return endingId("F");
      return "devedor";
    },
  },
  // Etapa 2 — Perfil do devedor
  {
    id: "devedor",
    kind: "choice",
    summaryLabel: "Devedor",
    question: "Quem deve pagar o seu crédito?",
    helper:
      "Ações contra o INSS são federais, mesmo quando o processo corre na Justiça Estadual (como as de auxílio-acidente).",
    options: [
      { value: "inss", label: "INSS" },
      { value: "federal", label: "União ou outro órgão federal (universidades federais, Receita, Forças Armadas etc.)" },
      { value: "estadual", label: "Governo do Estado (Polícia Militar, secretarias, IPE etc.)" },
      { value: "municipal", label: "Prefeitura" },
      { value: "empresa", label: "Banco ou empresa (Caixa, Banco do Brasil, Petrobras etc.)" },
      { value: "incerto", label: "Não sei informar" },
    ],
    next: (v) =>
      v === "estadual" || v === "municipal" || v === "empresa" ? endingId("B") : "relacao",
  },
  // Etapa 3 — Legitimidade e relação com o crédito
  {
    id: "relacao",
    kind: "choice",
    summaryLabel: "Relação com o crédito",
    question: "Qual é a sua relação com este crédito?",
    options: [
      { value: "titular", label: "Sou o titular do processo" },
      { value: "ajudando", label: "Estou ajudando o titular, que está vivo (sou familiar ou procurador)" },
      { value: "advogado_cliente", label: "Sou advogado e o crédito é do meu cliente" },
      { value: "advogado_honorarios", label: "Sou advogado e o crédito é dos meus honorários" },
      { value: "herdeiro", label: "Sou herdeiro(a) do titular falecido" },
      { value: "conjuge", label: "Sou cônjuge ou companheiro(a) do titular falecido" },
      { value: "tutor", label: "Sou responsável legal (tutor ou curador) por menor de idade ou pessoa incapaz" },
    ],
    next: (v) => {
      if (v === "herdeiro" || v === "conjuge") return "habilitacao";
      if (v === "tutor") return endingId("C");
      return "valor";
    },
  },
  // Sub-pergunta — só aparece para herdeiro e cônjuge
  {
    id: "habilitacao",
    kind: "choice",
    summaryLabel: "Herdeiros habilitados",
    question: "Os herdeiros já foram habilitados no processo, com a parte de cada um reconhecida?",
    options: [
      { value: "sim", label: "Sim, já foram habilitados" },
      { value: "nao", label: "Ainda não" },
      { value: "nao_sei", label: "Não sei" },
    ],
    next: "valor",
  },
  // Etapa 4 — Faixa de valor (limites em config.ts, revisar todo janeiro)
  {
    id: "valor",
    kind: "choice",
    summaryLabel: "Valor aproximado",
    question: "Qual é o valor total aproximado do crédito, já atualizado?",
    helper:
      "Use o valor total que aparece no processo ou que o seu advogado informou, antes de descontar os honorários. Se não souber, marque 'Não sei'.",
    options: [
      { value: "abaixo_minimo", label: `Até ${formatReais(VALOR_MINIMO - 1)}` },
      { value: "5k_20k", label: `De ${formatReais(VALOR_MINIMO)} a R$ 19.999` },
      { value: "20k_60k", label: "De R$ 20.000 a R$ 59.999" },
      { value: "60k_teto", label: `De R$ 60.000 a ${formatReais(RPV_TETO)}` },
      { value: "acima_teto", label: `Acima de ${formatReais(RPV_TETO)}` },
      { value: "nao_sei", label: "Não sei o valor" },
    ],
    next: (v) => {
      if (v === "abaixo_minimo") return endingId("D");
      if (v === "acima_teto") return endingId("E");
      return "objetivo";
    },
  },
  // Etapa 5 — Momento e intenção de venda
  {
    id: "objetivo",
    kind: "choice",
    summaryLabel: "Objetivo",
    question: "Qual é o seu principal objetivo hoje ao buscar essa simulação?",
    options: [
      { value: "urgencia", label: "Preciso do dinheiro com urgência para resolver pendências" },
      { value: "comparar", label: "Quero apenas comparar propostas e entender quanto receberia" },
      { value: "planejar", label: "Quero planejar uma antecipação para os próximos meses" },
    ],
    next: "nome",
  },
  // Etapa 6 — Captura de contato e validação de segurança
  {
    id: "nome",
    kind: "name",
    summaryLabel: "Nome",
    question: "Qual é o seu nome completo?",
    placeholder: "Digite seu nome completo",
    next: "telefone",
  },
  {
    id: "telefone",
    kind: "phone",
    summaryLabel: "WhatsApp",
    question: "Qual o seu WhatsApp?",
    placeholder: "(00) 00000-0000",
    next: "estado",
  },
  {
    id: "estado",
    kind: "select",
    summaryLabel: "Estado",
    question: "Qual é o seu estado?",
    placeholder: "Selecione o seu estado",
    options: ESTADOS,
    next: "processo",
  },
  {
    id: "processo",
    kind: "text",
    summaryLabel: "Nº do processo / CPF do titular",
    question: "Número do processo ou CPF do titular (opcional)",
    placeholder: "Deixe em branco se preferir",
    helper: "Informar o número do processo agiliza a análise da sua proposta.",
    optional: true,
    next: "aceites",
  },
  {
    id: "aceites",
    kind: "consent",
    summaryLabel: "Aceites",
    question: "Para finalizar, confirme:",
    options: [
      { value: "contato_whatsapp", label: "Aceito receber contato da Actum pelo WhatsApp" },
      { value: "especialista", label: "Quero me conectar com um especialista" },
    ],
    next: "submit",
  },
];

/**
 * Sub-perguntas que existem só em algumas ramificações — ficam fora da
 * contagem base e entram no total apenas quando a condição é verdadeira.
 */
export const BRANCH_STEPS: Record<string, (answers: Answers) => boolean> = {
  habilitacao: (a) => a.relacao === "herdeiro" || a.relacao === "conjuge",
};

/**
 * Observações que vão num bloco à parte da mensagem de WhatsApp — etiquetas
 * para a Pré-análise que não são resposta direta de uma pergunta.
 */
export const LEAD_NOTES: ((answers: Answers) => string | null)[] = [
  (a) => (a.relacao === "ajudando" ? "Etiqueta: titular precisa assinar" : null),
  (a) => (a.valor_anterior ? `Valor informado antes da correção: ${a.valor_anterior}` : null),
];
