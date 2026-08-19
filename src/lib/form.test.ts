import { describe, expect, it } from "vitest";

import { labelFor, pathTotal, resolveNext, stepById, type Step } from "./form";

const step = (id: string) => stepById(id) as Step;

describe("ramificação do estado", () => {
  it("vai direto para o nome quando o estado está na lista", () => {
    expect(resolveNext(step("objetivo"), "urgencia")).toBe("estado");
    expect(resolveNext(step("estado"), "pr")).toBe("nome");
  });

  it("abre a sub-pergunta de estado quando a resposta é \"outro\"", () => {
    expect(resolveNext(step("estado"), "outro")).toBe("estado_outro");
    expect(resolveNext(step("estado_outro"), "Amazonas")).toBe("nome");
  });

  it("usa o rótulo completo do estado no resumo da mensagem", () => {
    expect(labelFor(step("estado"), "sp")).toBe("São Paulo (SP)");
  });
});

describe("pathTotal", () => {
  it("conta apenas as perguntas do caminho percorrido", () => {
    const base = pathTotal({});
    expect(pathTotal({ relacao: "titular", estado: "pr" })).toBe(base);
    expect(pathTotal({ relacao: "herdeiro", estado: "pr" })).toBe(base + 1);
    expect(pathTotal({ relacao: "titular", estado: "outro" })).toBe(base + 1);
    expect(pathTotal({ relacao: "herdeiro", estado: "outro" })).toBe(base + 2);
  });
});
