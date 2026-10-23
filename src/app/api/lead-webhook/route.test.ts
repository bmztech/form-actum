// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const URL_BI = "https://bi.example/api/webhooks/leads/form";
const TOKEN = "token-de-teste";

const lead = { form: "actum", nome: "Maria", telefone: "11999998888", respostas: {} };

function request(body: string) {
  return new Request("http://localhost/api/lead-webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}

let fetchMock: ReturnType<typeof vi.fn>;
let errorSpy: ReturnType<typeof vi.spyOn>;
let warnSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.stubEnv("LEAD_WEBHOOK_URL", URL_BI);
  vi.stubEnv("LEAD_WEBHOOK_TOKEN", TOKEN);
  fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 201 }));
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "log").mockImplementation(() => {});
  errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /api/lead-webhook", () => {
  it("repassa o corpo ao BI com o token só no header", async () => {
    const response = await POST(request(JSON.stringify(lead)));

    expect(response.status).toBe(204);
    const [target, init] = fetchMock.mock.calls[0];
    expect(String(target)).toBe(URL_BI);
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({
      "Content-Type": "application/json",
      "X-Webhook-Token": TOKEN,
    });
    expect(JSON.parse(init.body)).toEqual(lead);
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it("tira o token da URL quando a env traz um ?token=", async () => {
    vi.stubEnv("LEAD_WEBHOOK_URL", `${URL_BI}?token=${TOKEN}`);
    await POST(request(JSON.stringify(lead)));
    expect(String(fetchMock.mock.calls[0][0])).toBe(URL_BI);
  });

  it("devolve 400 quando o corpo não é JSON", async () => {
    const response = await POST(request("não é json"));
    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("não envia e registra no log quando falta variável de ambiente", async () => {
    vi.stubEnv("LEAD_WEBHOOK_TOKEN", "");

    const response = await POST(request(JSON.stringify(lead)));

    expect(response.status).toBe(204);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(errorSpy.mock.calls[0][0]).toContain(
      "LEAD_WEBHOOK_URL=visível LEAD_WEBHOOK_TOKEN=AUSENTE",
    );
  });

  it("encaminha mesmo sem nome e telefone, mas registra no log", async () => {
    await POST(request(JSON.stringify({ form: "actum", nome: null, telefone: null })));

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(warnSpy.mock.calls[0][0]).toContain("lead sem nome, telefone");
  });

  it("registra o motivo do 422 e não tenta de novo", async () => {
    const motivo = JSON.stringify({
      message: "O form informado não é aceito para esta empresa.",
      errors: { form: ["O form informado não é aceito para esta empresa."] },
    });
    fetchMock.mockResolvedValue(
      new Response(motivo, { status: 422, statusText: "Unprocessable Entity" }),
    );

    expect((await POST(request(JSON.stringify(lead)))).status).toBe(204);

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(errorSpy.mock.calls[0][0]).toBe(
      `[lead-webhook] BI respondeu 422 Unprocessable Entity: ${motivo}`,
    );
  });

  it("não tenta de novo em 401", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 401, statusText: "Unauthorized" }));
    await POST(request(JSON.stringify(lead)));
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(errorSpy.mock.calls[0][0]).toBe("[lead-webhook] BI respondeu 401 Unauthorized");
  });

  it("tenta mais uma vez em 5xx e para quando o BI aceita", async () => {
    fetchMock
      .mockResolvedValueOnce(new Response("erro", { status: 503, statusText: "Service Unavailable" }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }));

    expect((await POST(request(JSON.stringify(lead)))).status).toBe(204);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(errorSpy.mock.calls[0][0]).toContain("BI respondeu 503 Service Unavailable: erro");
    expect(warnSpy.mock.calls.at(-1)![0]).toContain("nova tentativa (2/2)");
  });

  it("desiste depois de duas falhas de rede e responde 204", async () => {
    fetchMock.mockRejectedValue(new Error("timeout"));

    expect((await POST(request(JSON.stringify(lead)))).status).toBe(204);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(errorSpy).toHaveBeenCalledTimes(2);
    expect(errorSpy.mock.calls[1][0]).toContain("falha ao encaminhar o lead pro BI");
  });
});
