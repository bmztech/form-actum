import { beforeEach, describe, expect, it, vi } from "vitest";
import { TRACKING_PARAMS } from "../config";
import { readTracking } from "./utm";

function setUrl(url: string) {
  window.history.pushState({}, "", url);
}

beforeEach(() => {
  sessionStorage.clear();
  setUrl("http://localhost/");
});

describe("readTracking", () => {
  it("captura todos os campos utm_* presentes na URL", () => {
    setUrl(
      "http://localhost/?utm_source=google&utm_medium=cpc&utm_campaign=promo&utm_content=banner&utm_term=precatorio",
    );

    const tracking = readTracking();

    expect(tracking.utm_source).toBe("google");
    expect(tracking.utm_medium).toBe("cpc");
    expect(tracking.utm_campaign).toBe("promo");
  });

  it("cobre todos os parâmetros declarados em TRACKING_PARAMS", () => {
    const query = TRACKING_PARAMS.map((param) => `${param}=valor-${param}`).join("&");
    setUrl(`http://localhost/?${query}`);

    const tracking = readTracking();

    for (const param of TRACKING_PARAMS) {
      expect(tracking[param]).toBe(`valor-${param}`);
    }
  });

  it("não lança erro quando o sessionStorage está indisponível", () => {
    const setItemSpy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new DOMException("QuotaExceededError");
      });

    setUrl("http://localhost/?utm_source=google");
    expect(() => readTracking()).not.toThrow();

    setItemSpy.mockRestore();
  });
});
