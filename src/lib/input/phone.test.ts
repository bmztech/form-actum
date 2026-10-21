import { describe, expect, it } from "vitest";
import { isValidPhone, maskPhone } from "./phone";

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
