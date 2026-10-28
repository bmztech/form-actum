/**
 * ---------------------------------------------------------------------------
 * CONFIGURAÇÃO — edite apenas este arquivo para trocar número, links e textos.
 * ---------------------------------------------------------------------------
 */

/**
 * Número que recebe os leads no WhatsApp.
 * Formato: código do país + DDD + número, apenas dígitos.
 * Ex.: (42) 6825-0720  ->  "554268250720"
 */
export const WHATSAPP_NUMBER = "554268250720";

/**
 * Número que recebe a lista de nutrição (Mensagem A: processo em andamento ou
 * com recurso). Esses contatos NÃO devem cair na fila comercial.
 * TODO: trocar pelo número da nutrição quando a Actum definir — até lá usa o
 * comercial, e a mensagem chega marcada com [NUTRIÇÃO].
 */
export const NURTURE_WHATSAPP_NUMBER = WHATSAPP_NUMBER;

/**
 * Faixa de valor aceita (Etapa 4). O teto é o da RPV federal: 60 salários
 * mínimos, calculado sobre o valor bruto.
 * ATUALIZAÇÃO ANUAL OBRIGATÓRIA: troque SALARIO_MINIMO todo mês de janeiro.
 * As opções da Pergunta 4 e a Mensagem E são geradas a partir destes valores.
 */
export const SALARIO_MINIMO = 1621; // 2026
export const RPV_TETO = 60 * SALARIO_MINIMO; // R$ 97.260 em 2026
export const VALOR_MINIMO = 5000;

/** Site institucional (rodapé e CTA das telas de encerramento). */
export const SITE_URL = "https://actumprecatorios.com.br/";

/**
 * ID do Pixel do Meta Ads (formulário Actum Precatórios).
 * Não é um dado sensível (fica visível no HTML de qualquer página) — o valor
 * padrão abaixo cobre quem não tiver NEXT_PUBLIC_META_PIXEL_ID no .env.local.
 */
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1747237356474748";

/** Parâmetros de rastreamento capturados da URL e enviados na mensagem. */
export const TRACKING_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
] as const;

export type TrackingParam = (typeof TRACKING_PARAMS)[number];
