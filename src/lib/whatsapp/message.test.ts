import { describe, expect, it } from "vitest";
import { NURTURE_WHATSAPP_NUMBER, WHATSAPP_NUMBER } from "../config";
import type { Answers } from "../funnel/types";
import { buildHeadline, buildMessage, buildNurtureMessage, buildNurtureUrl, buildWhatsAppUrl } from "./message";

describe("buildHeadline", () => {
  it("resume devedor e valor", () => {
    expect(buildHeadline({ devedor: "inss", valor: "20k_60k" })).toBe(
      "Novo lead: devedor INSS, valor De R$ 20.000 a R$ 59.999",
    );
  });

  it("usa um texto genérico sem devedor ou valor", () => {
    expect(buildHeadline({})).toBe("Novo lead pelo formulário do site.");
  });
});

describe("buildMessage", () => {
  it("inclui as respostas com summaryLabel e omite campos vazios", () => {
    const answers: Answers = {
      situacao: "rpv_emitida",
      devedor: "inss",
      valor: "20k_60k",
      processo: "",
    };

    const message = buildMessage(answers, {});

    expect(message).toContain("Situação do processo:");
    expect(message).toContain("Devedor: INSS");
    expect(message).not.toContain("Nº do processo");
  });

  it("separa as duas opções de advogado", () => {
    expect(buildMessage({ relacao: "advogado_cliente" }, {})).toContain("crédito é do meu cliente");
    expect(buildMessage({ relacao: "advogado_honorarios" }, {})).toContain("dos meus honorários");
  });

  it("leva a status da habilitação de herdeiros", () => {
    const message = buildMessage({ relacao: "herdeiro", habilitacao: "nao" }, {});
    expect(message).toContain("Herdeiros habilitados: Ainda não");
  });

  it("etiqueta quem está ajudando o titular", () => {
    const message = buildMessage({ relacao: "ajudando" }, {});
    expect(message).toContain("— observações —");
    expect(message).toContain("Etiqueta: titular precisa assinar");
  });

  it("registra o valor informado antes da correção", () => {
    const message = buildMessage({ valor: "20k_60k", valor_anterior: "Até R$ 4.999" }, {});
    expect(message).toContain("Valor informado antes da correção: Até R$ 4.999");
  });

  it("omite o bloco de observações quando não há etiqueta", () => {
    expect(buildMessage({ relacao: "titular" }, {})).not.toContain("— observações —");
  });

  it("inclui o bloco de origem quando há UTMs com valor", () => {
    const message = buildMessage({}, { utm_source: "google", utm_medium: "cpc" });

    expect(message).toContain("— origem —");
    expect(message).toContain("utm_source: google");
  });

  it("omite o bloco de origem quando não há tracking", () => {
    expect(buildMessage({}, {})).not.toContain("— origem —");
  });
});

describe("buildWhatsAppUrl", () => {
  it("usa o WHATSAPP_NUMBER padrão quando nenhum número é informado", () => {
    const answers: Answers = {};
    const url = buildWhatsAppUrl(answers, {});
    expect(url).toBe(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage(answers, {}))}`,
    );
  });
});

describe("nutrição (Mensagem A)", () => {
  it("marca a mensagem como [NUTRIÇÃO] e leva a situação e a origem", () => {
    const message = buildNurtureMessage({ situacao: "recorreu" }, { utm_source: "facebook" });
    expect(message.startsWith("[NUTRIÇÃO]")).toBe(true);
    expect(message).toContain("Situação do processo: Ganhei, mas a outra parte recorreu");
    expect(message).toContain("utm_source: facebook");
  });

  it("vai para o NURTURE_WHATSAPP_NUMBER", () => {
    expect(buildNurtureUrl({}, {})).toMatch(new RegExp(`^https://wa.me/${NURTURE_WHATSAPP_NUMBER}\\?text=`));
  });
});
