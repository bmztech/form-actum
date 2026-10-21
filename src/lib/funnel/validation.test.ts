import { describe, expect, it } from "vitest";

import { stepById } from "./navigation";
import type { Step } from "./types";
import { validateStep } from "./validation";

const step = (id: string) => stepById(id) as Step;

describe("validateStep", () => {
  it("exige um estado da lista", () => {
    expect(validateStep(step("estado"), "")).not.toBeNull();
    expect(validateStep(step("estado"), "xx")).not.toBeNull();
    expect(validateStep(step("estado"), "pr")).toBeNull();
  });

  it("exige os dois aceites marcados", () => {
    expect(validateStep(step("aceites"), "")).not.toBeNull();
    expect(validateStep(step("aceites"), "contato_whatsapp")).not.toBeNull();
    expect(validateStep(step("aceites"), "especialista,contato_whatsapp")).toBeNull();
  });

  it("deixa o processo em branco por ser opcional", () => {
    expect(validateStep(step("processo"), "")).toBeNull();
  });

  it("valida nome e telefone", () => {
    expect(validateStep(step("nome"), "A")).not.toBeNull();
    expect(validateStep(step("nome"), "Ana")).toBeNull();
    expect(validateStep(step("telefone"), "1199")).not.toBeNull();
    expect(validateStep(step("telefone"), "(11) 99999-9999")).toBeNull();
  });
});
