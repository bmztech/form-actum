import { beforeEach, describe, expect, it, vi } from "vitest";
import { TRACKING_PARAMS, WHATSAPP_NUMBER } from "./config";
import type { Answers } from "./form";
import {
  buildMessage,
  buildWhatsAppUrl,
  isValidPhone,
  maskPhone,
  readTracking,
} from "./whatsapp";

function setUrl(url: string) {
  window.history.pushState({}, "", url);
}

beforeEach(() => {
  sessionStorage.clear();
  setUrl("http://localhost/");
});

describe("readTracking", () => {
  it("captura todos os campos utm_* presentes na URL", () => {
    setUrl(
      "http://localhost/?utm_source=google&utm_medium=cpc&utm_campaign=promo&utm_content=banner&utm_term=precatorio",
    );

    const tracking = readTracking();

    expect(tracking.utm_source).toBe("google");
    expect(tracking.utm_medium).toBe("cpc");
    expect(tracking.utm_campaign).toBe("promo");
  });

  it("cobre todos os parâmetros declarados em TRACKING_PARAMS", () => {
    const query = TRACKING_PARAMS.map((param) => `${param}=valor-${param}`).join("&");
    setUrl(`http://localhost/?${query}`);

    const tracking = readTracking();

    for (const param of TRACKING_PARAMS) {
      expect(tracking[param]).toBe(`valor-${param}`);
    }
  });

  it("não lança erro quando o sessionStorage está indisponível", () => {
    const setItemSpy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new DOMException("QuotaExceededError");
      });

    setUrl("http://localhost/?utm_source=google");
    expect(() => readTracking()).not.toThrow();

    setItemSpy.mockRestore();
  });
});

describe("buildMessage", () => {
  it("inclui as respostas com summaryLabel e omite campos vazios", () => {
    const answers: Answers = {
      situacao: "expedido",
      devedor: "federal",
      valor: "acima_500k",
      processo: "",
    };

    const message = buildMessage(answers, {});

    expect(message).toContain("Situação do direito judicial:");
    expect(message).toContain("Devedor:");
    expect(message).not.toContain("Nº do processo");
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

describe("maskPhone", () => {
  it("formata progressivamente até 11 dígitos", () => {
    expect(maskPhone("42")).toBe("42");
    expect(maskPhone("4268250")).toBe("(42) 6825-0");
    expect(maskPhone("42998887766")).toBe("(42) 99888-7766");
  });
});

describe("isValidPhone", () => {
  it("aceita fixo (10) e celular (11 dígitos)", () => {
    expect(isValidPhone("4268250720")).toBe(true);
    expect(isValidPhone("42998887766")).toBe(true);
    expect(isValidPhone("4299888")).toBe(false);
  });
});
