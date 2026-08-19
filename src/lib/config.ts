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

/** Site institucional (rodapé e CTA da tela de desqualificação). */
export const SITE_URL = "https://actumprecatorios.com.br/";

/**
 * ID do Pixel do Meta Ads (formulário Actum Precatórios).
 * Não é um dado sensível (fica visível no HTML de qualquer página) — o valor
 * padrão abaixo cobre quem não tiver NEXT_PUBLIC_META_PIXEL_ID no .env.local.
 */
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1605537040923542";

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
