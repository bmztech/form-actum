const BRL = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });

/** 97260 -> "R$ 97.260" */
export function formatReais(value: number): string {
  return `R$ ${BRL.format(value)}`;
}
