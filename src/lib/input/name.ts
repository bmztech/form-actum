/** Remove números e símbolos, mantendo letras (com acentos), espaços, apóstrofo e hífen. */
export function maskName(input: string): string {
  return input.replace(/[^\p{L}\s'-]/gu, "");
}

/** Exige ao menos 2 letras — bloqueia nomes vazios ou só com espaços/hífens. */
export function isValidName(input: string): boolean {
  return (input.match(/\p{L}/gu)?.length ?? 0) >= 2;
}
