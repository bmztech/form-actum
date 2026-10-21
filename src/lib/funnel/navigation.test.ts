import { describe, expect, it } from "vitest";

import { RPV_TETO, VALOR_MINIMO } from "../config";
import { formatReais } from "../format/currency";
import { endingId, endingOf, ENDINGS } from "./endings";
import { labelFor, pathTotal, resolveNext, stepById } from "./navigation";
import { STEPS } from "./steps";
import type { Step } from "./types";

const step = (id: string) => stepById(id) as Step;
const next = (id: string, value: string) => resolveNext(step(id), value);

describe("Etapa 1 — situação do processo", () => {
  it("segue com RPV emitida, aguardando emissão e incerto", () => {
    for (const v of ["rpv_emitida", "aguardando", "incerto"]) {
      expect(next("situacao", v)).toBe("devedor");
    }
  });

  it("encerra na Mensagem A quando há recurso ou o processo está em andamento", () => {
    expect(next("situacao", "recorreu")).toBe(endingId("A"));
    expect(next("situacao", "andamento")).toBe(endingId("A"));
  });

  it("encerra na Mensagem F quando o valor já foi recebido", () => {
    expect(next("situacao", "recebido")).toBe(endingId("F"));
  });
});

describe("Etapa 2 — devedor", () => {
  it("segue com INSS, órgão federal e não sei", () => {
    for (const v of ["inss", "federal", "incerto"]) {
      expect(next("devedor", v)).toBe("relacao");
    }
  });

  it("encerra na Mensagem B para Estado, Prefeitura, banco ou empresa", () => {
    for (const v of ["estadual", "municipal", "empresa"]) {
      expect(next("devedor", v)).toBe(endingId("B"));
    }
  });
});

describe("Etapa 3 — relação com o crédito", () => {
  it("abre a habilitação para herdeiro e cônjuge", () => {
    expect(next("relacao", "herdeiro")).toBe("habilitacao");
    expect(next("relacao", "conjuge")).toBe("habilitacao");
    expect(next("habilitacao", "nao_sei")).toBe("valor");
  });

  it("encerra na Mensagem C para tutor ou curador", () => {
    expect(next("relacao", "tutor")).toBe(endingId("C"));
  });

  it("vai direto ao valor para titular, quem ajuda e advogados", () => {
    for (const v of ["titular", "ajudando", "advogado_cliente", "advogado_honorarios"]) {
      expect(next("relacao", v)).toBe("valor");
    }
  });
});

describe("Etapa 4 — faixa de valor", () => {
  it("encerra em D abaixo do mínimo e em E acima do teto, ambas com correção", () => {
    expect(next("valor", "abaixo_minimo")).toBe(endingId("D"));
    expect(next("valor", "acima_teto")).toBe(endingId("E"));
    expect(ENDINGS.D.retryStep).toBe("valor");
    expect(ENDINGS.E.retryStep).toBe("valor");
  });

  it("segue nas faixas dentro do limite e em não sei", () => {
    for (const v of ["5k_20k", "20k_60k", "60k_teto", "nao_sei"]) {
      expect(next("valor", v)).toBe("objetivo");
    }
  });

  it("monta os rótulos a partir do mínimo e do teto da RPV", () => {
    expect(labelFor(step("valor"), "abaixo_minimo")).toBe(`Até ${formatReais(VALOR_MINIMO - 1)}`);
    expect(labelFor(step("valor"), "acima_teto")).toBe(`Acima de ${formatReais(RPV_TETO)}`);
    expect(ENDINGS.E.message).toContain(`${formatReais(RPV_TETO)},00`);
  });
});

describe("Etapa 6 — contato", () => {
  it("segue a ordem nome, telefone, estado, processo, aceites", () => {
    expect(next("objetivo", "urgencia")).toBe("nome");
    expect(next("nome", "Ana")).toBe("telefone");
    expect(next("telefone", "11999999999")).toBe("estado");
    expect(next("estado", "sp")).toBe("processo");
    expect(next("processo", "")).toBe("aceites");
    expect(next("aceites", "contato_whatsapp,especialista")).toBe("submit");
  });

  it("lista os 26 estados e o DF", () => {
    const estado = step("estado");
    expect(estado.kind === "select" && estado.options).toHaveLength(27);
    expect(labelFor(estado, "sp")).toBe("São Paulo (SP)");
  });

  it("rotula os aceites marcados", () => {
    expect(labelFor(step("aceites"), "contato_whatsapp,especialista")).toBe(
      "Aceito receber contato da Actum pelo WhatsApp · Quero me conectar com um especialista",
    );
  });
});

describe("endings", () => {
  it("todo endingId usado em STEPS aponta para uma tela existente", () => {
    for (const key of Object.keys(ENDINGS) as (keyof typeof ENDINGS)[]) {
      expect(endingOf(endingId(key))).toBe(ENDINGS[key]);
    }
    expect(endingOf("valor")).toBeUndefined();
  });

  it("só a Mensagem A oferece a nutrição", () => {
    const withNurture = Object.entries(ENDINGS).filter(([, e]) => "nurture" in e && e.nurture);
    expect(withNurture.map(([k]) => k)).toEqual(["A"]);
  });
});

describe("pathTotal", () => {
  it("conta a habilitação só para herdeiro e cônjuge", () => {
    const base = pathTotal({});
    expect(base).toBe(STEPS.length - 1);
    expect(pathTotal({ relacao: "titular" })).toBe(base);
    expect(pathTotal({ relacao: "herdeiro" })).toBe(base + 1);
    expect(pathTotal({ relacao: "conjuge" })).toBe(base + 1);
  });
});
