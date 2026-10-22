(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * ---------------------------------------------------------------------------
 * CONFIGURAÇÃO — edite apenas este arquivo para trocar número, links e textos.
 * ---------------------------------------------------------------------------
 */ /**
 * Número que recebe os leads no WhatsApp.
 * Formato: código do país + DDD + número, apenas dígitos.
 * Ex.: (42) 6825-0720  ->  "554268250720"
 */ __turbopack_context__.s([
    "META_PIXEL_ID",
    ()=>META_PIXEL_ID,
    "NURTURE_WHATSAPP_NUMBER",
    ()=>NURTURE_WHATSAPP_NUMBER,
    "RPV_TETO",
    ()=>RPV_TETO,
    "SALARIO_MINIMO",
    ()=>SALARIO_MINIMO,
    "SITE_URL",
    ()=>SITE_URL,
    "TRACKING_PARAMS",
    ()=>TRACKING_PARAMS,
    "VALOR_MINIMO",
    ()=>VALOR_MINIMO,
    "WHATSAPP_NUMBER",
    ()=>WHATSAPP_NUMBER
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const WHATSAPP_NUMBER = "554268250720";
const NURTURE_WHATSAPP_NUMBER = WHATSAPP_NUMBER;
const SALARIO_MINIMO = 1621; // 2026
const RPV_TETO = 60 * SALARIO_MINIMO; // R$ 97.260 em 2026
const VALOR_MINIMO = 5000;
const SITE_URL = "https://actumprecatorios.com.br/";
const META_PIXEL_ID = ("TURBOPACK compile-time value", "") || "1605537040923542";
const TRACKING_PARAMS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "fbclid",
    "gclid"
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/format/currency.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatReais",
    ()=>formatReais
]);
const BRL = new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 0
});
function formatReais(value) {
    return `R$ ${BRL.format(value)}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/funnel/endings.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ENDINGS",
    ()=>ENDINGS,
    "endingId",
    ()=>endingId,
    "endingOf",
    ()=>endingOf
]);
/**
 * Telas de encerramento do funil — quem cai aqui não vai para a fila
 * comercial. As letras seguem o documento "Formulário de Qualificação de
 * Leads — Actum" (Mensagens A a F), para facilitar a conferência.
 *
 * Um step encerra o funil devolvendo `endingId("A")` no `next`.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format/currency.ts [app-client] (ecmascript)");
;
;
const ENDING_PREFIX = "end:";
const ENDINGS = {
    /** P1: em andamento ou com recurso. Oferece a lista de nutrição. */ A: {
        icon: "⏳",
        title: "Ainda não conseguimos antecipar o seu crédito",
        message: "A Actum compra créditos de processos que já terminaram, sem possibilidade de recurso. Se quiser, deixe seu WhatsApp e avisamos você quando fizer sentido refazer a simulação.",
        nurture: true
    },
    /** P2: devedor não federal (Estado, Prefeitura, banco ou empresa). */ B: {
        icon: "🏛️",
        title: "Obrigado pelo seu interesse",
        message: "Hoje a Actum compra apenas créditos pagos pelo Governo Federal, como os de ações contra o INSS. Créditos contra Estados, Prefeituras, bancos ou empresas não fazem parte do que atendemos no momento."
    },
    /** P3: responsável legal por menor ou incapaz. */ C: {
        icon: "🤝",
        title: "Agradecemos o seu contato",
        message: "No momento, a Actum não antecipa créditos de menores de idade ou de pessoas incapazes."
    },
    /** P4: abaixo do valor mínimo. */ D: {
        icon: "📉",
        title: "Valor abaixo do mínimo",
        message: "O valor que você informou está abaixo do mínimo que a Actum consegue antecipar hoje. Agradecemos o seu interesse.",
        retryStep: "valor"
    },
    /** P4: acima do teto da RPV. */ E: {
        icon: "📈",
        title: "Crédito acima do limite da RPV",
        message: `Hoje a Actum antecipa apenas créditos federais pagos por Requisição de Pequeno Valor (RPV), que tem limite de 60 salários mínimos (${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatReais"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RPV_TETO"])},00). O seu crédito está acima desse limite ou foi emitido como precatório, por isso ainda não conseguimos avançar com a antecipação.`,
        retryStep: "valor"
    },
    /** P1: valor já depositado ou recebido. */ F: {
        icon: "💰",
        title: "Não há o que antecipar",
        message: "Se o valor já foi depositado, ele já está disponível para você sacar, e não há o que antecipar. Em caso de dúvida sobre o saque, fale com o advogado do seu processo."
    }
};
const endingId = (key)=>`${ENDING_PREFIX}${key}`;
function endingOf(id) {
    if (!id.startsWith(ENDING_PREFIX)) return undefined;
    return ENDINGS[id.slice(ENDING_PREFIX.length)];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/funnel/steps.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BRANCH_STEPS",
    ()=>BRANCH_STEPS,
    "FIRST_STEP",
    ()=>FIRST_STEP,
    "LEAD_NOTES",
    ()=>LEAD_NOTES,
    "STEPS",
    ()=>STEPS
]);
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format/currency.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$endings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/funnel/endings.ts [app-client] (ecmascript)");
;
;
;
const FIRST_STEP = "situacao";
const ESTADOS = [
    [
        "ac",
        "Acre"
    ],
    [
        "al",
        "Alagoas"
    ],
    [
        "ap",
        "Amapá"
    ],
    [
        "am",
        "Amazonas"
    ],
    [
        "ba",
        "Bahia"
    ],
    [
        "ce",
        "Ceará"
    ],
    [
        "df",
        "Distrito Federal"
    ],
    [
        "es",
        "Espírito Santo"
    ],
    [
        "go",
        "Goiás"
    ],
    [
        "ma",
        "Maranhão"
    ],
    [
        "mt",
        "Mato Grosso"
    ],
    [
        "ms",
        "Mato Grosso do Sul"
    ],
    [
        "mg",
        "Minas Gerais"
    ],
    [
        "pa",
        "Pará"
    ],
    [
        "pb",
        "Paraíba"
    ],
    [
        "pr",
        "Paraná"
    ],
    [
        "pe",
        "Pernambuco"
    ],
    [
        "pi",
        "Piauí"
    ],
    [
        "rj",
        "Rio de Janeiro"
    ],
    [
        "rn",
        "Rio Grande do Norte"
    ],
    [
        "rs",
        "Rio Grande do Sul"
    ],
    [
        "ro",
        "Rondônia"
    ],
    [
        "rr",
        "Roraima"
    ],
    [
        "sc",
        "Santa Catarina"
    ],
    [
        "sp",
        "São Paulo"
    ],
    [
        "se",
        "Sergipe"
    ],
    [
        "to",
        "Tocantins"
    ]
].map(_c = ([value, name])=>({
        value,
        label: `${name} (${value.toUpperCase()})`
    }));
_c1 = ESTADOS;
const STEPS = [
    // Etapa 1 — Filtro de elegibilidade básica
    {
        id: "situacao",
        kind: "choice",
        summaryLabel: "Situação do processo",
        question: "Qual é a situação atual do seu processo?",
        helper: "Decisão definitiva é quando o processo terminou e não cabe mais recurso/revisão da decisão (trânsito em julgado).",
        options: [
            {
                value: "rpv_emitida",
                label: "Ganhei, não cabe mais recurso e a ordem de pagamento (RPV) já foi emitida"
            },
            {
                value: "aguardando",
                label: "Ganhei, não cabe mais recurso, mas a ordem de pagamento ainda não foi emitida"
            },
            {
                value: "recorreu",
                label: "Ganhei, mas a outra parte recorreu ou ainda pode recorrer"
            },
            {
                value: "andamento",
                label: "O processo ainda está em andamento, sem decisão"
            },
            {
                value: "recebido",
                label: "O valor já foi depositado ou eu já recebi"
            },
            {
                value: "incerto",
                label: "Não tenho certeza"
            }
        ],
        next: (v)=>{
            if (v === "recorreu" || v === "andamento") return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$endings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["endingId"])("A");
            if (v === "recebido") return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$endings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["endingId"])("F");
            return "devedor";
        }
    },
    // Etapa 2 — Perfil do devedor
    {
        id: "devedor",
        kind: "choice",
        summaryLabel: "Devedor",
        question: "Quem deve pagar o seu crédito?",
        helper: "Ações contra o INSS são federais, mesmo quando o processo corre na Justiça Estadual (como as de auxílio-acidente).",
        options: [
            {
                value: "inss",
                label: "INSS"
            },
            {
                value: "federal",
                label: "União ou outro órgão federal (universidades federais, Receita, Forças Armadas etc.)"
            },
            {
                value: "estadual",
                label: "Governo do Estado (Polícia Militar, secretarias, IPE etc.)"
            },
            {
                value: "municipal",
                label: "Prefeitura"
            },
            {
                value: "empresa",
                label: "Banco ou empresa (Caixa, Banco do Brasil, Petrobras etc.)"
            },
            {
                value: "incerto",
                label: "Não sei informar"
            }
        ],
        next: (v)=>v === "estadual" || v === "municipal" || v === "empresa" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$endings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["endingId"])("B") : "relacao"
    },
    // Etapa 3 — Legitimidade e relação com o crédito
    {
        id: "relacao",
        kind: "choice",
        summaryLabel: "Relação com o crédito",
        question: "Qual é a sua relação com este crédito?",
        options: [
            {
                value: "titular",
                label: "Sou o titular do processo"
            },
            {
                value: "ajudando",
                label: "Estou ajudando o titular, que está vivo (sou familiar ou procurador)"
            },
            {
                value: "advogado_cliente",
                label: "Sou advogado e o crédito é do meu cliente"
            },
            {
                value: "advogado_honorarios",
                label: "Sou advogado e o crédito é dos meus honorários"
            },
            {
                value: "herdeiro",
                label: "Sou herdeiro(a) do titular falecido"
            },
            {
                value: "conjuge",
                label: "Sou cônjuge ou companheiro(a) do titular falecido"
            },
            {
                value: "tutor",
                label: "Sou responsável legal (tutor ou curador) por menor de idade ou pessoa incapaz"
            }
        ],
        next: (v)=>{
            if (v === "herdeiro" || v === "conjuge") return "habilitacao";
            if (v === "tutor") return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$endings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["endingId"])("C");
            return "valor";
        }
    },
    // Sub-pergunta — só aparece para herdeiro e cônjuge
    {
        id: "habilitacao",
        kind: "choice",
        summaryLabel: "Herdeiros habilitados",
        question: "Os herdeiros já foram habilitados no processo, com a parte de cada um reconhecida?",
        options: [
            {
                value: "sim",
                label: "Sim, já foram habilitados"
            },
            {
                value: "nao",
                label: "Ainda não"
            },
            {
                value: "nao_sei",
                label: "Não sei"
            }
        ],
        next: "valor"
    },
    // Etapa 4 — Faixa de valor (limites em config.ts, revisar todo janeiro)
    {
        id: "valor",
        kind: "choice",
        summaryLabel: "Valor aproximado",
        question: "Qual é o valor total aproximado do crédito, já atualizado?",
        helper: "Use o valor total que aparece no processo ou que o seu advogado informou, antes de descontar os honorários. Se não souber, marque 'Não sei'.",
        options: [
            {
                value: "abaixo_minimo",
                label: `Até ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatReais"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VALOR_MINIMO"] - 1)}`
            },
            {
                value: "5k_20k",
                label: `De ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatReais"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VALOR_MINIMO"])} a R$ 19.999`
            },
            {
                value: "20k_60k",
                label: "De R$ 20.000 a R$ 59.999"
            },
            {
                value: "60k_teto",
                label: `De R$ 60.000 a ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatReais"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RPV_TETO"])}`
            },
            {
                value: "acima_teto",
                label: `Acima de ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2f$currency$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatReais"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RPV_TETO"])}`
            },
            {
                value: "nao_sei",
                label: "Não sei o valor"
            }
        ],
        next: (v)=>{
            if (v === "abaixo_minimo") return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$endings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["endingId"])("D");
            if (v === "acima_teto") return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$endings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["endingId"])("E");
            return "objetivo";
        }
    },
    // Etapa 5 — Momento e intenção de venda
    {
        id: "objetivo",
        kind: "choice",
        summaryLabel: "Objetivo",
        question: "Qual é o seu principal objetivo hoje ao buscar essa simulação?",
        options: [
            {
                value: "urgencia",
                label: "Preciso do dinheiro com urgência para resolver pendências"
            },
            {
                value: "comparar",
                label: "Quero apenas comparar propostas e entender quanto receberia"
            },
            {
                value: "planejar",
                label: "Quero planejar uma antecipação para os próximos meses"
            }
        ],
        next: "nome"
    },
    // Etapa 6 — Captura de contato e validação de segurança
    {
        id: "nome",
        kind: "name",
        summaryLabel: "Nome",
        question: "Qual é o seu nome completo?",
        placeholder: "Digite seu nome completo",
        next: "telefone"
    },
    {
        id: "telefone",
        kind: "phone",
        summaryLabel: "WhatsApp",
        question: "Qual o seu WhatsApp?",
        placeholder: "(00) 00000-0000",
        next: "estado"
    },
    {
        id: "estado",
        kind: "select",
        summaryLabel: "Estado",
        question: "Qual é o seu estado?",
        placeholder: "Selecione o seu estado",
        options: ESTADOS,
        next: "processo"
    },
    {
        id: "processo",
        kind: "text",
        summaryLabel: "Nº do processo / CPF do titular",
        question: "Número do processo ou CPF do titular (opcional)",
        placeholder: "Deixe em branco se preferir",
        helper: "Informar o número do processo agiliza a análise da sua proposta.",
        optional: true,
        next: "aceites"
    },
    {
        id: "aceites",
        kind: "consent",
        summaryLabel: "Aceites",
        question: "Para finalizar, confirme:",
        options: [
            {
                value: "contato_whatsapp",
                label: "Aceito receber contato da Actum pelo WhatsApp"
            },
            {
                value: "especialista",
                label: "Quero me conectar com um especialista"
            }
        ],
        next: "submit"
    }
];
const BRANCH_STEPS = {
    habilitacao: (a)=>a.relacao === "herdeiro" || a.relacao === "conjuge"
};
const LEAD_NOTES = [
    (a)=>a.relacao === "ajudando" ? "Etiqueta: titular precisa assinar" : null,
    (a)=>a.valor_anterior ? `Valor informado antes da correção: ${a.valor_anterior}` : null
];
var _c, _c1;
__turbopack_context__.k.register(_c, 'ESTADOS$[\n  ["ac", "Acre"],\n  ["al", "Alagoas"],\n  ["ap", "Amapá"],\n  ["am", "Amazonas"],\n  ["ba", "Bahia"],\n  ["ce", "Ceará"],\n  ["df", "Distrito Federal"],\n  ["es", "Espírito Santo"],\n  ["go", "Goiás"],\n  ["ma", "Maranhão"],\n  ["mt", "Mato Grosso"],\n  ["ms", "Mato Grosso do Sul"],\n  ["mg", "Minas Gerais"],\n  ["pa", "Pará"],\n  ["pb", "Paraíba"],\n  ["pr", "Paraná"],\n  ["pe", "Pernambuco"],\n  ["pi", "Piauí"],\n  ["rj", "Rio de Janeiro"],\n  ["rn", "Rio Grande do Norte"],\n  ["rs", "Rio Grande do Sul"],\n  ["ro", "Rondônia"],\n  ["rr", "Roraima"],\n  ["sc", "Santa Catarina"],\n  ["sp", "São Paulo"],\n  ["se", "Sergipe"],\n  ["to", "Tocantins"],\n].map');
__turbopack_context__.k.register(_c1, "ESTADOS");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/funnel/navigation.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CONSENT_SEPARATOR",
    ()=>CONSENT_SEPARATOR,
    "labelFor",
    ()=>labelFor,
    "pathTotal",
    ()=>pathTotal,
    "questionOf",
    ()=>questionOf,
    "resolveNext",
    ()=>resolveNext,
    "stepById",
    ()=>stepById
]);
/**
 * Motor do funil: funções puras que interpretam o array STEPS.
 * Não contém regra de negócio — perguntas, ramificações e sub-perguntas
 * condicionais ficam em ./steps.ts.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$steps$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/funnel/steps.ts [app-client] (ecmascript)");
;
const stepById = (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$steps$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STEPS"].find((s)=>s.id === id);
function resolveNext(step, value) {
    return typeof step.next === "function" ? step.next(value) : step.next;
}
const CONSENT_SEPARATOR = ",";
function labelFor(step, value) {
    if (step.kind === "choice" || step.kind === "select") {
        return step.options.find((o)=>o.value === value)?.label ?? value;
    }
    if (step.kind === "consent") {
        return value.split(CONSENT_SEPARATOR).map((v)=>step.options.find((o)=>o.value === v)?.label ?? v).join(" · ");
    }
    return value;
}
function questionOf(step, answers) {
    return typeof step.question === "function" ? step.question(answers) : step.question;
}
function pathTotal(answers) {
    const branchIds = Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$steps$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BRANCH_STEPS"]);
    const base = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$steps$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STEPS"].filter((s)=>!branchIds.includes(s.id)).length;
    const extra = branchIds.filter((id)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$steps$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BRANCH_STEPS"][id](answers)).length;
    return base + extra;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/input/name.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Remove números e símbolos, mantendo letras (com acentos), espaços, apóstrofo e hífen. */ __turbopack_context__.s([
    "isValidName",
    ()=>isValidName,
    "maskName",
    ()=>maskName
]);
function maskName(input) {
    return input.replace(/[^\p{L}\s'-]/gu, "");
}
function isValidName(input) {
    return (input.match(/\p{L}/gu)?.length ?? 0) >= 2;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/input/phone.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Máscara de telefone brasileiro: (41) 99954-5084 */ __turbopack_context__.s([
    "isValidPhone",
    ()=>isValidPhone,
    "maskPhone",
    ()=>maskPhone
]);
function maskPhone(input) {
    const digits = input.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}
function isValidPhone(input) {
    const digits = input.replace(/\D/g, "");
    return digits.length === 10 || digits.length === 11;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/funnel/validation.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "validateStep",
    ()=>validateStep
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$input$2f$name$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/input/name.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$input$2f$phone$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/input/phone.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/funnel/navigation.ts [app-client] (ecmascript)");
;
;
;
function validateStep(step, value) {
    switch(step.kind){
        case "phone":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$input$2f$phone$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidPhone"])(value) ? null : "Digite um WhatsApp válido com DDD.";
        case "name":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$input$2f$name$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidName"])(value) ? null : "Digite um nome válido.";
        case "text":
            return step.optional || value.length >= 2 ? null : "Por favor, preencha este campo.";
        case "select":
            return step.options.some((o)=>o.value === value) ? null : "Selecione uma opção.";
        case "consent":
            {
                const checked = value ? value.split(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CONSENT_SEPARATOR"]) : [];
                const allChecked = step.options.every((o)=>checked.includes(o.value));
                return allChecked ? null : "Marque todas as opções para continuar.";
            }
        case "choice":
            return null;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/submission/status.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "markSubmitted",
    ()=>markSubmitted,
    "useHasSubmitted",
    ()=>useHasSubmitted
]);
/**
 * Marca, por navegador, se o lead já concluiu o envio do formulário —
 * evita fazer a pessoa repetir o funil inteiro se abrir o link de novo.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
const STORAGE_KEY = "actum_submitted";
function hasSubmitted() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        return localStorage.getItem(STORAGE_KEY) === "1";
    } catch  {
        return false;
    }
}
function markSubmitted() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        localStorage.setItem(STORAGE_KEY, "1");
    } catch  {
    // localStorage indisponível (modo privado/iframe) — segue sem persistir.
    }
}
function subscribe(onChange) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    window.addEventListener("storage", onChange);
    return ()=>window.removeEventListener("storage", onChange);
}
function useHasSubmitted() {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribe, {
        "useHasSubmitted.useSyncExternalStore": ()=>hasSubmitted()
    }["useHasSubmitted.useSyncExternalStore"], {
        "useHasSubmitted.useSyncExternalStore": ()=>false
    }["useHasSubmitted.useSyncExternalStore"]);
}
_s(useHasSubmitted, "FpwL93IKMLJZuQQXefVtWynbBPQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/tracking/pixel.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Wrapper fino sobre o `fbq` do Meta Pixel (carregado em src/app/layout.tsx).
 * Existe só para não espalhar `window.fbq as any` pelo resto do código.
 */ __turbopack_context__.s([
    "trackPixelEvent",
    ()=>trackPixelEvent
]);
function trackPixelEvent(event) {
    if (("TURBOPACK compile-time value", "object") !== "undefined" && typeof window.fbq === "function") {
        window.fbq("track", event);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/tracking/utm.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "readTracking",
    ()=>readTracking
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/config.ts [app-client] (ecmascript)");
;
const STORAGE_KEY = "actum_tracking";
function readTracking() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const params = new URLSearchParams(window.location.search);
    let stored = {};
    try {
        stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "{}");
    } catch  {
        stored = {};
    }
    const tracking = {
        ...stored
    };
    for (const key of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TRACKING_PARAMS"]){
        const value = params.get(key);
        if (value) tracking[key] = value;
    }
    // Referrer só é registrado na primeira visita, quando ainda não há nada salvo.
    if (!tracking.referrer && document.referrer) {
        tracking.referrer = document.referrer;
    }
    if (!tracking.landing_page) {
        tracking.landing_page = window.location.origin + window.location.pathname;
    }
    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tracking));
    } catch  {
    // sessionStorage indisponível (modo privado/iframe) — segue sem persistir.
    }
    return tracking;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/whatsapp/message.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildHeadline",
    ()=>buildHeadline,
    "buildMessage",
    ()=>buildMessage,
    "buildNurtureMessage",
    ()=>buildNurtureMessage,
    "buildNurtureUrl",
    ()=>buildNurtureUrl,
    "buildWhatsAppUrl",
    ()=>buildWhatsAppUrl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/funnel/navigation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$steps$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/funnel/steps.ts [app-client] (ecmascript)");
;
;
;
function answerLabel(answers, stepId) {
    const step = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stepById"])(stepId);
    const value = answers[stepId];
    return step && value ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["labelFor"])(step, value) : "";
}
function trackingLines(tracking) {
    const entries = Object.entries(tracking).filter(([, v])=>v);
    if (entries.length === 0) return [];
    return [
        "",
        "— origem —",
        ...entries.map(([key, value])=>`${key}: ${value}`)
    ];
}
function buildHeadline(answers) {
    if (!answers.valor || !answers.devedor) return "Novo lead pelo formulário do site.";
    return `Novo lead: devedor ${answerLabel(answers, "devedor")}, valor ${answerLabel(answers, "valor")}`;
}
function buildMessage(answers, tracking) {
    const lines = [
        buildHeadline(answers),
        ""
    ];
    for (const step of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$steps$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STEPS"]){
        const value = answers[step.id];
        if (!value || step.hideInSummary) continue;
        lines.push(`${step.summaryLabel}: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["labelFor"])(step, value)}`);
    }
    const notes = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$steps$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LEAD_NOTES"].map((note)=>note(answers)).filter((n)=>!!n);
    if (notes.length > 0) {
        lines.push("", "— observações —", ...notes);
    }
    lines.push(...trackingLines(tracking));
    return lines.join("\n");
}
function buildWhatsAppUrl(answers, tracking, whatsappNumber = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WHATSAPP_NUMBER"]) {
    const text = encodeURIComponent(buildMessage(answers, tracking));
    return `https://wa.me/${whatsappNumber}?text=${text}`;
}
function buildNurtureMessage(answers, tracking) {
    const lines = [
        "[NUTRIÇÃO] Quero ser avisado(a) quando fizer sentido refazer a simulação.",
        "",
        `Situação do processo: ${answerLabel(answers, "situacao")}`,
        "Aceito receber contato da Actum pelo WhatsApp.",
        ...trackingLines(tracking)
    ];
    return lines.join("\n");
}
function buildNurtureUrl(answers, tracking, whatsappNumber = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NURTURE_WHATSAPP_NUMBER"]) {
    const text = encodeURIComponent(buildNurtureMessage(answers, tracking));
    return `https://wa.me/${whatsappNumber}?text=${text}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Funnel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Funnel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * Funil de qualificação de leads da Actum Precatórios.
 *
 * Roteiro (ver docs/perguntas.md):
 *   situacao -> [andamento/recurso: A] [já recebeu: F]
 *            -> devedor -> [Estado/Prefeitura/empresa: B]
 *            -> relacao -> [herdeiro/cônjuge: habilitacao] [tutor: C]
 *            -> valor -> [abaixo do mínimo: D] [acima do teto: E]
 *            -> objetivo -> nome -> telefone -> estado
 *            -> processo (opcional) -> aceites -> WhatsApp
 *
 * As telas de encerramento (A–F) ficam em lib/funnel/endings.ts. Só D e E
 * deixam voltar ao funil, pelo botão "Corrigir o valor informado".
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$endings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/funnel/endings.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/funnel/navigation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$steps$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/funnel/steps.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$validation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/funnel/validation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$input$2f$name$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/input/name.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$input$2f$phone$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/input/phone.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$submission$2f$status$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/submission/status.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tracking$2f$pixel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/tracking/pixel.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tracking$2f$utm$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/tracking/utm.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$whatsapp$2f$message$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/whatsapp/message.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
/** Atalho de teclado da opção i: A, B, C… */ const letter = (i)=>String.fromCharCode(65 + i);
function Funnel() {
    _s();
    const [screen, setScreen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("intro");
    const [currentId, setCurrentId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$steps$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FIRST_STEP"]);
    const [history, setHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [answers, setAnswers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [draft, setDraft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [whatsAppUrl, setWhatsAppUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [ending, setEnding] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [nurtureUrl, setNurtureUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const tracking = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({});
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Funnel.useEffect": ()=>{
            tracking.current = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tracking$2f$utm$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["readTracking"])();
        }
    }["Funnel.useEffect"], []);
    const alreadySubmitted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$submission$2f$status$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useHasSubmitted"])();
    const step = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stepById"])(currentId);
    const total = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pathTotal"])(answers);
    const progress = screen === "question" ? Math.max(4, history.length / total * 100) : 0;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Funnel.useEffect": ()=>{
            if (screen === "question" && (step?.kind === "text" || step?.kind === "name" || step?.kind === "phone")) {
                inputRef.current?.focus();
            }
        }
    }["Funnel.useEffect"], [
        screen,
        currentId,
        step?.kind
    ]);
    const finish = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Funnel.useCallback[finish]": (finalAnswers)=>{
            setWhatsAppUrl((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$whatsapp$2f$message$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildWhatsAppUrl"])(finalAnswers, tracking.current));
            setScreen("done");
        }
    }["Funnel.useCallback[finish]"], []);
    const goTo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Funnel.useCallback[goTo]": (nextId, fromId, nextAnswers)=>{
            const reached = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$endings$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["endingOf"])(nextId);
            if (reached) {
                if (reached.nurture) setNurtureUrl((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$whatsapp$2f$message$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildNurtureUrl"])(nextAnswers, tracking.current));
                setEnding(reached);
                setScreen("ending");
                return;
            }
            if (nextId === "submit") {
                finish(nextAnswers);
                return;
            }
            setHistory({
                "Funnel.useCallback[goTo]": (h)=>[
                        ...h,
                        fromId
                    ]
            }["Funnel.useCallback[goTo]"]);
            setCurrentId(nextId);
            setDraft(nextAnswers[nextId] ?? "");
            setError(null);
        }
    }["Funnel.useCallback[goTo]"], [
        finish
    ]);
    const answer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Funnel.useCallback[answer]": (value)=>{
            const nextAnswers = {
                ...answers,
                [step.id]: value
            };
            setAnswers(nextAnswers);
            goTo((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveNext"])(step, value), step.id, nextAnswers);
        }
    }["Funnel.useCallback[answer]"], [
        answers,
        goTo,
        step
    ]);
    const submitInput = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Funnel.useCallback[submitInput]": ()=>{
            const value = draft.trim();
            const problem = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$validation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateStep"])(step, value);
            if (problem) {
                setError(problem);
                return;
            }
            answer(value);
        }
    }["Funnel.useCallback[submitInput]"], [
        answer,
        draft,
        step
    ]);
    /**
   * "Corrigir o valor informado" (Mensagens D e E): volta para a pergunta,
   * mantém as outras respostas e guarda o valor anterior para a Pré-análise.
   */ const retry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Funnel.useCallback[retry]": ()=>{
            const retryStep = ending?.retryStep;
            if (!retryStep) return;
            const previous = answers[retryStep];
            if (previous) {
                const label = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["labelFor"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stepById"])(retryStep), previous);
                const before = answers.valor_anterior?.split(", ") ?? [];
                const valorAnterior = before.includes(label) ? before : [
                    ...before,
                    label
                ];
                setAnswers({
                    ...answers,
                    valor_anterior: valorAnterior.join(", ")
                });
            }
            setCurrentId(retryStep);
            setDraft("");
            setError(null);
            setEnding(null);
            setScreen("question");
        }
    }["Funnel.useCallback[retry]"], [
        answers,
        ending
    ]);
    const goBack = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "Funnel.useCallback[goBack]": ()=>{
            if (history.length === 0) {
                setScreen("intro");
                return;
            }
            const previous = history[history.length - 1];
            setHistory({
                "Funnel.useCallback[goBack]": (h)=>h.slice(0, -1)
            }["Funnel.useCallback[goBack]"]);
            setCurrentId(previous);
            setDraft(answers[previous] ?? "");
            setError(null);
        }
    }["Funnel.useCallback[goBack]"], [
        answers,
        history
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Funnel.useEffect": ()=>{
            if (screen !== "question" || step?.kind !== "choice") return;
            if (step.layout === "grid") return;
            const onKey = {
                "Funnel.useEffect.onKey": (e)=>{
                    if (e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1) return;
                    const option = step.options[e.key.toUpperCase().charCodeAt(0) - 65];
                    if (option) {
                        e.preventDefault();
                        answer(option.value);
                    }
                }
            }["Funnel.useEffect.onKey"];
            window.addEventListener("keydown", onKey);
            return ({
                "Funnel.useEffect": ()=>window.removeEventListener("keydown", onKey)
            })["Funnel.useEffect"];
        }
    }["Funnel.useEffect"], [
        answer,
        screen,
        step
    ]);
    const canGoBack = screen === "question";
    const body = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Funnel.useMemo[body]": ()=>{
            if (screen === "intro" && alreadySubmitted) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AlreadySubmitted, {}, void 0, false, {
                fileName: "[project]/src/components/Funnel.tsx",
                lineNumber: 180,
                columnNumber: 56
            }, this);
            if (screen === "intro") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Intro, {
                onStart: {
                    "Funnel.useMemo[body]": ()=>setScreen("question")
                }["Funnel.useMemo[body]"]
            }, void 0, false, {
                fileName: "[project]/src/components/Funnel.tsx",
                lineNumber: 182,
                columnNumber: 14
            }, this);
            if (screen === "ending" && ending) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EndingScreen, {
                    ending: ending,
                    nurtureUrl: nurtureUrl,
                    onRetry: retry
                }, void 0, false, {
                    fileName: "[project]/src/components/Funnel.tsx",
                    lineNumber: 185,
                    columnNumber: 9
                }, this);
            }
            if (screen === "done") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Done, {
                url: whatsAppUrl
            }, void 0, false, {
                fileName: "[project]/src/components/Funnel.tsx",
                lineNumber: 188,
                columnNumber: 35
            }, this);
            const checked = draft ? draft.split(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CONSENT_SEPARATOR"]) : [];
            const toggle = {
                "Funnel.useMemo[body].toggle": (value)=>{
                    const next = checked.includes(value) ? checked.filter({
                        "Funnel.useMemo[body].toggle": (v)=>v !== value
                    }["Funnel.useMemo[body].toggle"]) : [
                        ...checked,
                        value
                    ];
                    setDraft(next.join(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CONSENT_SEPARATOR"]));
                    setError(null);
                }
            }["Funnel.useMemo[body].toggle"];
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-step-in",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl leading-snug font-bold text-ink sm:text-2xl",
                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$funnel$2f$navigation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["questionOf"])(step, answers)
                    }, void 0, false, {
                        fileName: "[project]/src/components/Funnel.tsx",
                        lineNumber: 201,
                        columnNumber: 9
                    }, this),
                    step.helper && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-3 text-sm leading-relaxed text-slate-soft",
                        children: step.helper
                    }, void 0, false, {
                        fileName: "[project]/src/components/Funnel.tsx",
                        lineNumber: 206,
                        columnNumber: 11
                    }, this),
                    step.kind === "choice" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: step.layout === "grid" ? "mt-8 grid gap-3 sm:grid-cols-2" : "mt-8 space-y-3",
                        children: step.options.map({
                            "Funnel.useMemo[body]": (option, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: {
                                        "Funnel.useMemo[body]": ()=>answer(option.value)
                                    }["Funnel.useMemo[body]"],
                                    className: "group flex w-full items-center gap-3 rounded-lg border-2 border-paper-2 bg-white px-4 py-4 text-left transition-all hover:-translate-y-0.5 hover:border-gold hover:shadow-md focus:outline-none focus-visible:border-gold focus-visible:ring-3 focus-visible:ring-gold/25",
                                    children: [
                                        step.layout !== "grid" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex size-7 shrink-0 items-center justify-center rounded-md bg-paper text-xs font-bold text-slate-soft transition-colors group-hover:bg-gold group-hover:text-white",
                                            children: letter(i)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Funnel.tsx",
                                            lineNumber: 227,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-base font-medium text-ink",
                                            children: option.label
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Funnel.tsx",
                                            lineNumber: 231,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, option.value, true, {
                                    fileName: "[project]/src/components/Funnel.tsx",
                                    lineNumber: 220,
                                    columnNumber: 15
                                }, this)
                        }["Funnel.useMemo[body]"])
                    }, void 0, false, {
                        fileName: "[project]/src/components/Funnel.tsx",
                        lineNumber: 212,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-8",
                        children: [
                            step.kind === "select" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                value: draft,
                                onChange: {
                                    "Funnel.useMemo[body]": (e)=>{
                                        setDraft(e.target.value);
                                        setError(null);
                                    }
                                }["Funnel.useMemo[body]"],
                                className: "w-full rounded-lg border-2 border-paper-2 bg-white px-4 py-4 text-lg text-ink transition-colors outline-none focus:border-gold focus:ring-3 focus:ring-gold/20",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: "",
                                        disabled: true,
                                        children: step.placeholder
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Funnel.tsx",
                                        lineNumber: 248,
                                        columnNumber: 17
                                    }, this),
                                    step.options.map({
                                        "Funnel.useMemo[body]": (option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: option.value,
                                                children: option.label
                                            }, option.value, false, {
                                                fileName: "[project]/src/components/Funnel.tsx",
                                                lineNumber: 252,
                                                columnNumber: 19
                                            }, this)
                                    }["Funnel.useMemo[body]"])
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Funnel.tsx",
                                lineNumber: 240,
                                columnNumber: 15
                            }, this) : step.kind === "consent" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: step.options.map({
                                    "Funnel.useMemo[body]": (option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "flex cursor-pointer items-start gap-3 rounded-lg border-2 border-paper-2 bg-white px-4 py-4 transition-colors hover:border-gold has-checked:border-gold",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    checked: checked.includes(option.value),
                                                    onChange: {
                                                        "Funnel.useMemo[body]": ()=>toggle(option.value)
                                                    }["Funnel.useMemo[body]"],
                                                    className: "mt-0.5 size-5 shrink-0 accent-gold"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Funnel.tsx",
                                                    lineNumber: 264,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-base font-medium text-ink",
                                                    children: option.label
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Funnel.tsx",
                                                    lineNumber: 270,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, option.value, true, {
                                            fileName: "[project]/src/components/Funnel.tsx",
                                            lineNumber: 260,
                                            columnNumber: 19
                                        }, this)
                                }["Funnel.useMemo[body]"])
                            }, void 0, false, {
                                fileName: "[project]/src/components/Funnel.tsx",
                                lineNumber: 258,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                ref: inputRef,
                                type: step.kind === "phone" ? "tel" : "text",
                                inputMode: step.kind === "phone" ? "tel" : "text",
                                autoComplete: step.kind === "phone" ? "tel-national" : step.kind === "name" ? "name" : "off",
                                value: draft,
                                placeholder: step.placeholder,
                                onChange: {
                                    "Funnel.useMemo[body]": (e)=>{
                                        const value = step.kind === "phone" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$input$2f$phone$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["maskPhone"])(e.target.value) : step.kind === "name" ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$input$2f$name$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["maskName"])(e.target.value) : e.target.value;
                                        setDraft(value);
                                        setError(null);
                                    }
                                }["Funnel.useMemo[body]"],
                                onKeyDown: {
                                    "Funnel.useMemo[body]": (e)=>{
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            submitInput();
                                        }
                                    }
                                }["Funnel.useMemo[body]"],
                                className: "w-full rounded-lg border-2 border-paper-2 bg-white px-4 py-4 text-lg text-ink transition-colors outline-none placeholder:text-slate-soft/60 focus:border-gold focus:ring-3 focus:ring-gold/20"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Funnel.tsx",
                                lineNumber: 277,
                                columnNumber: 15
                            }, this),
                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                role: "alert",
                                className: "mt-2 text-sm font-medium text-red-600",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/src/components/Funnel.tsx",
                                lineNumber: 311,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: submitInput,
                                className: "mt-5 inline-flex items-center gap-2 rounded-[3px] bg-gold px-7 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-3 focus-visible:ring-gold/40",
                                children: [
                                    step.kind === "text" && step.optional && !draft.trim() ? "Pular esta etapa" : "Continuar",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        "aria-hidden": true,
                                        children: "→"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Funnel.tsx",
                                        lineNumber: 324,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Funnel.tsx",
                                lineNumber: 316,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Funnel.tsx",
                        lineNumber: 238,
                        columnNumber: 11
                    }, this),
                    step.kind === "choice" && step.layout !== "grid" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-6 hidden text-xs text-slate-soft sm:block",
                        children: [
                            "Dica: use as teclas",
                            " ",
                            step.options.map({
                                "Funnel.useMemo[body]": (_, i)=>letter(i)
                            }["Funnel.useMemo[body]"]).join(", "),
                            " para responder mais rápido."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Funnel.tsx",
                        lineNumber: 330,
                        columnNumber: 11
                    }, this)
                ]
            }, currentId, true, {
                fileName: "[project]/src/components/Funnel.tsx",
                lineNumber: 200,
                columnNumber: 7
            }, this);
        }
    }["Funnel.useMemo[body]"], [
        alreadySubmitted,
        answer,
        answers,
        currentId,
        draft,
        ending,
        error,
        nurtureUrl,
        retry,
        screen,
        step,
        submitInput,
        whatsAppUrl
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "flex min-h-full flex-1 flex-col items-center justify-center px-4 py-8 sm:py-12",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-2xl shrink-0 overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/40",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "flex items-center justify-between border-b border-paper-2 px-6 py-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                src: "/logo-actum.png",
                                alt: "Actum Precatórios",
                                width: 178,
                                height: 160,
                                priority: true,
                                className: "h-10 w-auto"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Funnel.tsx",
                                lineNumber: 358,
                                columnNumber: 11
                            }, this),
                            canGoBack && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: goBack,
                                className: "rounded-lg px-3 py-1.5 text-sm font-medium text-slate-soft transition-colors hover:bg-paper hover:text-ink",
                                children: "← Voltar"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Funnel.tsx",
                                lineNumber: 367,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Funnel.tsx",
                        lineNumber: 357,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-1 bg-paper-2",
                        role: "progressbar",
                        "aria-valuenow": Math.round(progress),
                        "aria-valuemin": 0,
                        "aria-valuemax": 100,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-full bg-gold transition-[width] duration-400 ease-out",
                            style: {
                                width: `${progress}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/Funnel.tsx",
                            lineNumber: 384,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/Funnel.tsx",
                        lineNumber: 377,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-6 py-8 sm:px-10 sm:py-10",
                        children: body
                    }, void 0, false, {
                        fileName: "[project]/src/components/Funnel.tsx",
                        lineNumber: 390,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Funnel.tsx",
                lineNumber: 356,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "mt-6 shrink-0 text-center text-xs text-white/45",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SITE_URL"],
                        className: "hover:text-white/80",
                        children: "actumprecatorios.com.br"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Funnel.tsx",
                        lineNumber: 394,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "mx-2",
                        children: "·"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Funnel.tsx",
                        lineNumber: 397,
                        columnNumber: 9
                    }, this),
                    "Crédito judicial reconhecido"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Funnel.tsx",
                lineNumber: 393,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Funnel.tsx",
        lineNumber: 355,
        columnNumber: 5
    }, this);
}
_s(Funnel, "pk080Gsujmh/tfpc/KHaj9hNr0c=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$submission$2f$status$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useHasSubmitted"]
    ];
});
_c = Funnel;
function Intro({ onStart }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "animate-step-in text-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "flex items-center justify-center gap-2 text-xs font-bold tracking-[0.14em] text-gold-deep uppercase",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "inline-block h-0.5 w-6 bg-gold-deep"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Funnel.tsx",
                        lineNumber: 408,
                        columnNumber: 9
                    }, this),
                    "Simulação gratuita"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Funnel.tsx",
                lineNumber: 407,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "mt-4 text-2xl leading-tight font-bold text-ink sm:text-3xl",
                children: "Seu direito já foi reconhecido na Justiça?"
            }, void 0, false, {
                fileName: "[project]/src/components/Funnel.tsx",
                lineNumber: 412,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-5 text-base leading-relaxed text-slate",
                children: "Responda algumas perguntas rápidas e descubra se o seu crédito judicial tem condições de ser antecipado — sem compromisso."
            }, void 0, false, {
                fileName: "[project]/src/components/Funnel.tsx",
                lineNumber: 416,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: onStart,
                className: "mt-8 w-full rounded-[3px] bg-gold px-8 py-4 text-center text-lg font-semibold text-ink transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-3 focus-visible:ring-gold/40 sm:w-auto",
                children: [
                    "Quero saber se posso receber antes ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": true,
                        children: "→"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Funnel.tsx",
                        lineNumber: 426,
                        columnNumber: 44
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Funnel.tsx",
                lineNumber: 421,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-5 text-sm text-slate-soft",
                children: "Leva menos de 1 minuto · seus dados são protegidos pela LGPD"
            }, void 0, false, {
                fileName: "[project]/src/components/Funnel.tsx",
                lineNumber: 429,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Funnel.tsx",
        lineNumber: 406,
        columnNumber: 5
    }, this);
}
_c1 = Intro;
function EndingScreen({ ending, nurtureUrl, onRetry }) {
    _s1();
    const [optIn, setOptIn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "animate-step-in text-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-auto flex size-14 items-center justify-center rounded-full bg-paper text-2xl",
                children: ending.icon
            }, void 0, false, {
                fileName: "[project]/src/components/Funnel.tsx",
                lineNumber: 449,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "mt-5 text-xl font-bold text-ink sm:text-2xl",
                children: ending.title
            }, void 0, false, {
                fileName: "[project]/src/components/Funnel.tsx",
                lineNumber: 453,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-4 text-base leading-relaxed text-slate",
                children: ending.message
            }, void 0, false, {
                fileName: "[project]/src/components/Funnel.tsx",
                lineNumber: 457,
                columnNumber: 7
            }, this),
            ending.nurture && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6 rounded-lg border-2 border-paper-2 px-5 py-5 text-left",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "flex cursor-pointer items-start gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "checkbox",
                                checked: optIn,
                                onChange: (e)=>setOptIn(e.target.checked),
                                className: "mt-0.5 size-5 shrink-0 accent-gold"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Funnel.tsx",
                                lineNumber: 464,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-base font-medium text-ink",
                                children: "Aceito receber contato da Actum pelo WhatsApp."
                            }, void 0, false, {
                                fileName: "[project]/src/components/Funnel.tsx",
                                lineNumber: 470,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Funnel.tsx",
                        lineNumber: 463,
                        columnNumber: 11
                    }, this),
                    optIn ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: nurtureUrl,
                        className: "mt-5 inline-flex w-full items-center justify-center rounded-[3px] bg-gold px-7 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-3 focus-visible:ring-gold/40",
                        children: "Quero ser avisado pelo WhatsApp"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Funnel.tsx",
                        lineNumber: 476,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        disabled: true,
                        className: "mt-5 inline-flex w-full cursor-not-allowed items-center justify-center rounded-[3px] bg-paper-2 px-7 py-3.5 text-base font-semibold text-slate-soft",
                        children: "Quero ser avisado pelo WhatsApp"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Funnel.tsx",
                        lineNumber: 483,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Funnel.tsx",
                lineNumber: 462,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row",
                children: [
                    ending.retryStep && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onRetry,
                        className: "inline-flex items-center justify-center rounded-[3px] bg-gold px-7 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-3 focus-visible:ring-gold/40",
                        children: "Corrigir o valor informado"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Funnel.tsx",
                        lineNumber: 496,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SITE_URL"],
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "inline-flex items-center justify-center gap-2 rounded-[3px] border border-ink bg-transparent px-7 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-ink hover:text-white",
                        children: "Saiba mais sobre a Actum"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Funnel.tsx",
                        lineNumber: 504,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Funnel.tsx",
                lineNumber: 494,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Funnel.tsx",
        lineNumber: 448,
        columnNumber: 5
    }, this);
}
_s1(EndingScreen, "MLRGSr30R+BxQ6rom4XfilYPvAM=");
_c2 = EndingScreen;
function Done({ url }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "animate-step-in text-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-auto flex size-14 items-center justify-center rounded-full bg-sage/10 text-2xl",
                children: "✅"
            }, void 0, false, {
                fileName: "[project]/src/components/Funnel.tsx",
                lineNumber: 520,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "mt-5 text-xl font-bold text-ink sm:text-2xl",
                children: "Falta só um passo!"
            }, void 0, false, {
                fileName: "[project]/src/components/Funnel.tsx",
                lineNumber: 524,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6 rounded-lg border-2 border-gold bg-gold-light/30 px-5 py-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-lg leading-snug font-extrabold text-ink uppercase sm:text-xl",
                        children: "Envie a mensagem pronta na próxima tela do WhatsApp"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Funnel.tsx",
                        lineNumber: 529,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-3 text-sm leading-relaxed text-slate",
                        children: [
                            "Ela já vai estar escrita com os seus dados — é só apertar enviar.",
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                children: "Sem esse envio, a nossa equipe não recebe o seu caso."
                            }, void 0, false, {
                                fileName: "[project]/src/components/Funnel.tsx",
                                lineNumber: 534,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Funnel.tsx",
                        lineNumber: 532,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Funnel.tsx",
                lineNumber: 528,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: url,
                onClick: ()=>{
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tracking$2f$pixel$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["trackPixelEvent"])("Lead");
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$submission$2f$status$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["markSubmitted"])();
                },
                className: "mt-7 inline-flex w-full items-center justify-center rounded-[3px] bg-gold px-8 py-4 text-lg font-semibold text-ink transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-3 focus-visible:ring-gold/40 sm:w-auto",
                children: "Falar com a Actum agora"
            }, void 0, false, {
                fileName: "[project]/src/components/Funnel.tsx",
                lineNumber: 538,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-4 text-xs text-slate-soft",
                children: "Sua simulação é gratuita, sem compromisso e seus dados são protegidos pela LGPD."
            }, void 0, false, {
                fileName: "[project]/src/components/Funnel.tsx",
                lineNumber: 549,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Funnel.tsx",
        lineNumber: 519,
        columnNumber: 5
    }, this);
}
_c3 = Done;
function AlreadySubmitted() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "animate-step-in text-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-auto flex size-14 items-center justify-center rounded-full bg-sage/10 text-2xl",
                children: "🙏"
            }, void 0, false, {
                fileName: "[project]/src/components/Funnel.tsx",
                lineNumber: 560,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "mt-5 text-xl font-bold text-ink sm:text-2xl",
                children: "Agradecemos o seu contato!"
            }, void 0, false, {
                fileName: "[project]/src/components/Funnel.tsx",
                lineNumber: 564,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-4 text-base leading-relaxed text-slate",
                children: "Já recebemos as suas informações. Em breve, alguém da nossa equipe vai te chamar no WhatsApp para dar continuidade à análise do seu crédito."
            }, void 0, false, {
                fileName: "[project]/src/components/Funnel.tsx",
                lineNumber: 568,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SITE_URL"],
                target: "_blank",
                rel: "noopener noreferrer",
                className: "mt-8 inline-flex items-center justify-center gap-2 rounded-[3px] border border-ink bg-transparent px-7 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-ink hover:text-white",
                children: "Visitar o site da Actum"
            }, void 0, false, {
                fileName: "[project]/src/components/Funnel.tsx",
                lineNumber: 573,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Funnel.tsx",
        lineNumber: 559,
        columnNumber: 5
    }, this);
}
_c4 = AlreadySubmitted;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "Funnel");
__turbopack_context__.k.register(_c1, "Intro");
__turbopack_context__.k.register(_c2, "EndingScreen");
__turbopack_context__.k.register(_c3, "Done");
__turbopack_context__.k.register(_c4, "AlreadySubmitted");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_219wt2f._.js.map