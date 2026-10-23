/**
 * Proxy do lead para o Banco de Leads (BI). Ver src/lib/lead-webhook.ts.
 *
 * Repassa o JSON recebido sem validar nem transformar, autenticando com
 * LEAD_WEBHOOK_TOKEN no header X-Webhook-Token e na query ?token=. Responde
 * sempre 204 (o navegador já saiu para o WhatsApp), exceto corpo inválido (400).
 * Os logs com o prefixo [lead-webhook] aparecem no log de runtime da GoDaddy.
 */

const LOG = "[lead-webhook]";
const TIMEOUT_MS = 8_000;

const noContent = () => new Response(null, { status: 204 });

/** Lidas a cada requisição, para valerem sem rebuild. Sem fallback no código. */
function readConfig(): { url: string; token: string } | null {
  const url = process.env.LEAD_WEBHOOK_URL;
  const token = process.env.LEAD_WEBHOOK_TOKEN;
  if (url && token) return { url, token };

  console.error(
    `${LOG} config ausente, lead não encaminhado (LEAD_WEBHOOK_URL=${url ? "visível" : "AUSENTE"} LEAD_WEBHOOK_TOKEN=${token ? "visível" : "AUSENTE"})`,
  );
  return null;
}

/** Só registra no log o que veio faltando; o lead segue para o BI mesmo assim. */
function warnMissingFields(body: unknown): void {
  if (typeof body !== "object" || body === null) {
    console.warn(`${LOG} corpo não é um objeto JSON`);
    return;
  }
  const record = body as Record<string, unknown>;
  const missing = ["form", "nome", "telefone"].filter((key) => !record[key]);
  if (missing.length > 0) {
    console.warn(`${LOG} lead sem ${missing.join(", ")} (form=${String(record.form)})`);
  }
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    console.warn(`${LOG} corpo inválido, não é JSON`);
    return new Response(null, { status: 400 });
  }

  warnMissingFields(body);

  const config = readConfig();
  if (!config) return noContent();

  let target: URL;
  try {
    target = new URL(config.url);
  } catch {
    console.error(`${LOG} LEAD_WEBHOOK_URL não é uma URL válida`);
    return noContent();
  }
  target.searchParams.set("token", config.token);

  try {
    const response = await fetch(target, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Token": config.token,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (response.ok) {
      console.log(`${LOG} lead encaminhado — BI respondeu ${response.status}`);
    } else {
      console.error(`${LOG} BI respondeu ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(`${LOG} falha ao encaminhar o lead pro BI:`, error);
  }

  return noContent();
}
