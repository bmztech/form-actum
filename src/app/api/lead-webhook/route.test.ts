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
  it("repassa o corpo ao BI com o token no header e na query", async () => {
    const response = await POST(request(JSON.stringify(lead)));

    expect(response.status).toBe(204);
    const [target, init] = fetchMock.mock.calls[0];
    expect(String(target)).toBe(`${URL_BI}?token=${TOKEN}`);
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({
      "Content-Type": "application/json",
      "X-Webhook-Token": TOKEN,
    });
    expect(JSON.parse(init.body)).toEqual(lead);
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it("não duplica o token quando a URL já traz um", async () => {
    vi.stubEnv("LEAD_WEBHOOK_URL", `${URL_BI}?token=${TOKEN}`);
    await POST(request(JSON.stringify(lead)));
    expect(String(fetchMock.mock.calls[0][0])).toBe(`${URL_BI}?token=${TOKEN}`);
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

  it("responde 204 e registra no log quando o BI falha", async () => {
    fetchMock.mockResolvedValue(
      new Response(null, { status: 500, statusText: "Internal Server Error" }),
    );
    expect((await POST(request(JSON.stringify(lead)))).status).toBe(204);
    expect(errorSpy.mock.calls[0][0]).toContain("BI respondeu 500 Internal Server Error");

    fetchMock.mockRejectedValue(new Error("timeout"));
    expect((await POST(request(JSON.stringify(lead)))).status).toBe(204);
    expect(errorSpy.mock.calls[1][0]).toContain("falha ao encaminhar o lead pro BI");
  });
});
