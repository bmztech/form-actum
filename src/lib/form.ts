/**
 * Definição declarativa do funil de qualificação de precatórios da Actum.
 *
 * Segue a arquitetura descrita em "Arquitetura do Formulário Actum":
 *   Etapa 1 (situacao)  -> "em andamento" desqualifica
 *   Etapa 2 (devedor)
 *   Etapa 3 (relacao)   -> "herdeiro" abre a sub-pergunta (inventario)
 *   Etapa 4 (valor)
 *   Etapa 5 (objetivo)
 *   Etapa 6 (estado, nome, telefone, processo)
 *     - estado "outro" abre a sub-pergunta (estado_outro)
 *     - processo é opcional
 *
 * Para mudar perguntas, opções ou o encadeamento condicional, edite só o
 * array STEPS abaixo:
 *   - next como string  -> vai sempre para esse id
 *   - next como função  -> decide a partir da resposta (lógica condicional)
 *
 * Os ids reservados são "submit" (dispara o WhatsApp) e "disqualified".
 */

export type Answers = Record<string, string>;

export type Choice = {
  value: string;
  label: string;
};

export type QuestionText = string | ((answers: Answers) => string);

type Base = {
  summaryLabel: string;
  counted?: boolean;
  hideInSummary?: boolean;
};

export type Step = Base &
  (
    | {
        id: string;
        kind: "text" | "phone" | "name";
        question: QuestionText;
        placeholder: string;
        helper?: string;
        optional?: boolean;
        next: string;
      }
    | {
        id: string;
        kind: "choice";
        question: QuestionText;
        options: Choice[];
        /** "grid" — lista longa em duas colunas, sem atalho de teclado. */
        layout?: "grid";
        next: string | ((value: string) => string);
      }
  );

export const FIRST_STEP = "situacao";

export const STEPS: Step[] = [
  // Etapa 1 — Filtro de elegibilidade básica
  {
    id: "situacao",
    kind: "choice",
    summaryLabel: "Situação do direito judicial",
    question: "Qual é a situação atual do seu direito judicial?",
    options: [
      { value: "expedido", label: "O processo já foi finalizado e o precatório já foi emitido (expedido)" },
      { value: "aguardando", label: "O processo foi ganho, mas ainda estou aguardando a emissão da ordem de pagamento" },
      { value: "andamento", label: "O processo ainda está em andamento na Justiça" },
      { value: "incerto", label: "Não tenho certeza" },
    ],
    next: (v) => (v === "andamento" ? "disqualified" : "devedor"),
  },
  // Etapa 2 — Perfil do devedor e liquidez
  {
    id: "devedor",
    kind: "choice",
    summaryLabel: "Devedor",
    question: "Quem é o devedor do seu crédito?",
    options: [
      { value: "federal", label: "Federal (União, INSS, Universidades Federais, etc.)" },
      { value: "estadual", label: "Estadual (Governo do Estado, Polícia Militar, etc.)" },
      { value: "municipal", label: "Municipal (Prefeitura)" },
      { value: "incerto", label: "Não sei informar" },
    ],
    next: "relacao",
  },
  // Etapa 3 — Legitimidade e relação com o crédito
  {
    id: "relacao",
    kind: "choice",
    summaryLabel: "Relação com o crédito",
    question: "Qual é a sua relação com este crédito?",
    options: [
      { value: "titular", label: "Sou o titular direto do processo (o precatório está no meu nome)" },
      { value: "herdeiro", label: "Sou herdeiro(a) do titular falecido" },
      { value: "advogado", label: "Sou o(a) advogado(a)" },
    ],
    next: (v) => (v === "herdeiro" ? "inventario" : "valor"),
  },
  // Sub-pergunta — só aparece quando relacao = herdeiro
  {
    id: "inventario",
    kind: "choice",
    summaryLabel: "Inventário",
    question: "O inventário já foi concluído ou existe partilha homologada?",
    options: [
      { value: "sim", label: "Sim, já foi concluído ou a partilha está homologada" },
      { value: "nao", label: "Ainda não, o inventário está em andamento" },
    ],
    next: "valor",
  },
  // Etapa 4 — Faixa de valor
  {
    id: "valor",
    kind: "choice",
    summaryLabel: "Valor aproximado",
    question: "Qual é o valor aproximado atualizado do seu precatório?",
    options: [
      { value: "ate_30k", label: "Até R$ 30.000,00" },
      { value: "30k_100k", label: "Entre R$ 30.000,00 e R$ 100.000,00" },
      { value: "100k_500k", label: "Entre R$ 100.000,00 e R$ 500.000,00" },
      { value: "acima_500k", label: "Acima de R$ 500.000,00" },
    ],
    next: "objetivo",
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
    next: "estado",
  },
  // Etapa 6 — Localização e captura de contato
  {
    id: "estado",
    kind: "choice",
    summaryLabel: "Estado",
    question: "Qual é o seu estado?",
    layout: "grid",
    options: [
      { value: "sp", label: "São Paulo (SP)" },
      { value: "rj", label: "Rio de Janeiro (RJ)" },
      { value: "mg", label: "Minas Gerais (MG)" },
      { value: "pr", label: "Paraná (PR)" },
      { value: "rs", label: "Rio Grande do Sul (RS)" },
      { value: "sc", label: "Santa Catarina (SC)" },
      { value: "ba", label: "Bahia (BA)" },
      { value: "go", label: "Goiás (GO)" },
      { value: "pe", label: "Pernambuco (PE)" },
      { value: "df", label: "Distrito Federal (DF)" },
      { value: "outro", label: "Outro estado" },
    ],
    next: (v) => (v === "outro" ? "estado_outro" : "nome"),
  },
  // Sub-pergunta — só aparece quando estado = outro
  {
    id: "estado_outro",
    kind: "text",
    summaryLabel: "Estado informado",
    question: "Qual é o seu estado?",
    placeholder: "Digite o nome do seu estado",
    next: "nome",
  },
  {
    id: "nome",
    kind: "name",
    summaryLabel: "Nome",
    question: "Para finalizar, qual é o seu nome completo?",
    placeholder: "Digite seu nome completo",
    next: "telefone",
  },
  {
    id: "telefone",
    kind: "phone",
    summaryLabel: "WhatsApp",
    question: "Qual o seu WhatsApp?",
    placeholder: "(00) 00000-0000",
    next: "processo",
  },
  {
    id: "processo",
    kind: "text",
    summaryLabel: "Nº do processo / CPF do titular",
    question: "Número do processo ou CPF do titular (opcional)",
    placeholder: "Deixe em branco se preferir",
    helper: "Preencher o número do processo acelera a análise da sua proposta em até 24 horas.",
    optional: true,
    next: "submit",
  },
];

export const stepById = (id: string) => STEPS.find((s) => s.id === id);

export function resolveNext(step: Step, value: string): string {
  return typeof step.next === "function" ? step.next(value) : step.next;
}

export function labelFor(step: Step, value: string): string {
  if (step.kind !== "choice") return value;
  return step.options.find((o) => o.value === value)?.label ?? value;
}

export function questionOf(step: Step, answers: Answers): string {
  return typeof step.question === "function" ? step.question(answers) : step.question;
}

/**
 * Sub-perguntas que existem só em algumas ramificações — ficam fora da
 * contagem base e entram no total apenas quando a condição é verdadeira.
 */
const BRANCH_STEPS: Record<string, (answers: Answers) => boolean> = {
  inventario: (a) => a.relacao === "herdeiro",
  estado_outro: (a) => a.estado === "outro",
};

/** Total exato de perguntas do caminho que o lead está percorrendo. */
export function pathTotal(answers: Answers): number {
  const branchIds = Object.keys(BRANCH_STEPS);
  const base = STEPS.filter((s) => !branchIds.includes(s.id)).length;
  const extra = branchIds.filter((id) => BRANCH_STEPS[id](answers)).length;
  return base + extra;
}
