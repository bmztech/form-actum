import { afterEach, describe, expect, it, vi } from "vitest";
import { WHATSAPP_NUMBER } from "./config";
import { buildLeadPayload, phoneDigits, sendLeadWebhook } from "./lead-webhook";
import { buildMessage } from "./whatsapp/message";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("phoneDigits", () => {
  it("deixa só os dígitos, sem acrescentar o 55", () => {
    expect(phoneDigits("(41) 99999-0003")).toBe("41999990003");
  });

  it("devolve null quando não há telefone", () => {
    expect(phoneDigits(undefined)).toBeNull();
    expect(phoneDigits("")).toBeNull();
  });
});

describe("buildLeadPayload", () => {
  const answers = {
    situacao: "rpv_emitida",
    devedor: "inss",
    nome: "  Maria da Silva ",
    telefone: "(11) 99999-8888",
    aceites: "contato_whatsapp,especialista",
  };
  const tracking = { utm_source: "facebook", landing_page: "http://localhost/" };

  it("monta o contrato do BI com form actum", () => {
    const payload = buildLeadPayload(
      answers,
      tracking,
      "http://localhost/?utm_source=facebook",
      "2026-10-23T14:02:11.123Z",
    );

    expect(payload).toEqual({
      form: "actum",
      pagina: "http://localhost/?utm_source=facebook",
      clicadoEm: "2026-10-23T14:02:11.123Z",
      nome: "Maria da Silva",
      telefone: "11999998888",
      whatsappDestino: WHATSAPP_NUMBER,
      mensagem: buildMessage(answers, tracking),
      respostas: answers,
      tracking,
    });
  });

  it("manda nome e telefone como null quando faltam", () => {
    const payload = buildLeadPayload({ nome: "  " }, {}, "http://localhost/");
    expect(payload.nome).toBeNull();
    expect(payload.telefone).toBeNull();
  });
});

describe("sendLeadWebhook", () => {
  it("envia para a rota local com keepalive", () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);
    const payload = buildLeadPayload({ nome: "Maria" }, {}, "http://localhost/");

    sendLeadWebhook(payload);

    expect(fetchMock).toHaveBeenCalledWith("/api/lead-webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  });

  it("ignora falha de rede", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    expect(() =>
      sendLeadWebhook(buildLeadPayload({}, {}, "http://localhost/")),
    ).not.toThrow();
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
});
