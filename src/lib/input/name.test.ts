import { describe, expect, it } from "vitest";
import { isValidName, maskName } from "./name";

describe("maskName", () => {
  it("mantém letras com acento, espaços, apóstrofo e hífen", () => {
    expect(maskName("Maria José")).toBe("Maria José");
    expect(maskName("Ana-Clara")).toBe("Ana-Clara");
    expect(maskName("O'Brien")).toBe("O'Brien");
  });

  it("remove números e símbolos digitados", () => {
    expect(maskName("asd123aads")).toBe("asdaads");
    expect(maskName("João@Silva #1")).toBe("JoãoSilva ");
  });
});

describe("isValidName", () => {
  it("exige ao menos 2 letras", () => {
    expect(isValidName("Ana")).toBe(true);
    expect(isValidName("Jo")).toBe(true);
    expect(isValidName("A")).toBe(false);
    expect(isValidName("- '")).toBe(false);
    expect(isValidName("")).toBe(false);
  });
});
