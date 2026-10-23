/**
 * Proxy do lead para o Banco de Leads (BI). Ver src/lib/lead-webhook.ts.
 *
 * Repassa o JSON recebido sem validar nem transformar, autenticando com
 * LEAD_WEBHOOK_TOKEN só no header X-Webhook-Token (nunca na URL). Responde
 * sempre 204 (o navegador já saiu para o WhatsApp), exceto corpo inválido (400).
 * Tenta mais uma vez em 5xx ou erro de rede: o BI deduplica por company + form
 * + telefone, então reenviar não duplica o lead. 401 e 422 não se repetem.
 * Os logs com o prefixo [lead-webhook] aparecem no log de runtime da GoDaddy.
 */

const LOG = "[lead-webhook]";
const TIMEOUT_MS = 8_000;
const MAX_ATTEMPTS = 2;
/** Limite do corpo de erro do BI no log (o 422 traz o motivo em "errors"). */
const ERROR_DETAIL_CHARS = 500;

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

/** Uma tentativa de envio. Devolve true quando vale tentar de novo. */
async function forward(target: URL, token: string, body: unknown): Promise<boolean> {
  try {
    const response = await fetch(target, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Token": token,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (response.ok) {
      console.log(`${LOG} lead encaminhado — BI respondeu ${response.status}`);
      return false;
    }
    const detail = (await response.text().catch(() => "")).slice(0, ERROR_DETAIL_CHARS);
    console.error(
      `${LOG} BI respondeu ${response.status} ${response.statusText}${detail ? `: ${detail}` : ""}`,
    );
    return response.status >= 500;
  } catch (error) {
    console.error(`${LOG} falha ao encaminhar o lead pro BI:`, error);
    return true;
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
  // O BI pediu o token só no header: remove um ?token= posto por engano na env.
  target.searchParams.delete("token");

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    if (attempt > 1) console.warn(`${LOG} nova tentativa (${attempt}/${MAX_ATTEMPTS})`);
    const retry = await forward(target, config.token, body);
    if (!retry) break;
  }

  return noContent();
}
