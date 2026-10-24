// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: (props: { alt: string }) => <span>{props.alt}</span>,
}));

import Funnel from "./Funnel";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    root = createRoot(container);
    root.render(<Funnel />);
  });
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

const text = () => container.textContent ?? "";

function click(label: string) {
  const el = [...container.querySelectorAll<HTMLElement>("button, a, label")].find((b) =>
    b.textContent?.includes(label),
  );
  if (!el) throw new Error(`Não achei "${label}" em: ${text()}`);
  act(() => el.click());
}

function type(value: string) {
  const input = container.querySelector("input:not([type=checkbox])") as HTMLInputElement;
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
  act(() => {
    setter.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

function choose(value: string) {
  const select = container.querySelector("select") as HTMLSelectElement;
  const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value")!.set!;
  act(() => {
    setter.call(select, value);
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

const start = () => click("Quero saber se posso receber antes");

describe("Funnel", () => {
  it("encerra na Mensagem A com opt-in de nutrição", () => {
    start();
    click("outra parte recorreu");
    expect(text()).toContain("Ainda não conseguimos antecipar o seu crédito");
    expect(container.querySelector("a[href^='https://wa.me']")).toBeNull();
    click("Aceito receber contato da Actum pelo WhatsApp");
    const link = container.querySelector<HTMLAnchorElement>("a[href^='https://wa.me']");
    expect(decodeURIComponent(link!.href)).toContain("[NUTRIÇÃO]");
  });

  it("corrige o valor na Mensagem D e registra o valor anterior", () => {
    start();
    click("RPV) já foi emitida");
    click("INSS");
    click("Sou o titular do processo");
    click("Até R$ 4.999");
    expect(text()).toContain("Valor abaixo do mínimo");

    click("Corrigir o valor informado");
    expect(text()).toContain("Qual é o valor total aproximado");
    click("De R$ 20.000 a R$ 59.999");
    click("Preciso do dinheiro com urgência");

    type("Maria da Silva");
    click("Continuar");
    type("11999998888");
    click("Continuar");

    click("Continuar");
    expect(text()).toContain("Selecione uma opção.");
    choose("sp");
    click("Continuar");

    click("Pular esta etapa");

    click("Continuar");
    expect(text()).toContain("Marque todas as opções");
    click("Aceito receber contato da Actum pelo WhatsApp");
    click("Quero me conectar com um especialista");
    click("Continuar");

    const link = container.querySelector<HTMLAnchorElement>("a[href^='https://wa.me']");
    const message = decodeURIComponent(link!.href);
    expect(message).toContain("Valor informado antes da correção: Até R$ 4.999");
    expect(message).toContain("Estado: São Paulo (SP)");
    expect(message).toContain("Aceites: Aceito receber contato");
  });

  it("envia o lead ao BI uma vez só, no clique do WhatsApp", () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);
    // jsdom não navega para o wa.me; evita o aviso "Not implemented: navigation".
    container.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).closest("a")) e.preventDefault();
    });

    start();
    click("RPV) já foi emitida");
    click("INSS");
    click("Sou o titular do processo");
    click("De R$ 20.000 a R$ 59.999");
    click("Preciso do dinheiro com urgência");
    type("Maria da Silva");
    click("Continuar");
    type("11999998888");
    click("Continuar");
    choose("sp");
    click("Continuar");
    click("Pular esta etapa");
    click("Aceito receber contato da Actum pelo WhatsApp");
    click("Quero me conectar com um especialista");
    click("Continuar");
    expect(fetchMock).not.toHaveBeenCalled();

    click("Falar com a Actum agora");
    click("Falar com a Actum agora");

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/lead-webhook");
    const payload = JSON.parse(init.body);
    expect(payload).toMatchObject({
      form: "actum",
      nome: "Maria da Silva",
      telefone: "11999998888",
      respostas: { devedor: "inss", estado: "sp", aceites: "contato_whatsapp,especialista" },
    });
    expect(payload.mensagem).toContain("Novo lead: devedor INSS");
    expect(localStorage.getItem("actum_submitted")).toBe("1");
    vi.unstubAllGlobals();
  });

  it("encerra na Mensagem C para tutor e não deixa voltar ao funil", () => {
    start();
    click("Não tenho certeza");
    click("Não sei informar");
    click("tutor ou curador");
    expect(text()).toContain("não antecipa créditos de menores");
    expect(text()).not.toContain("Corrigir o valor informado");
    expect(text()).not.toContain("← Voltar");
  });

  it("abre a habilitação para cônjuge", () => {
    start();
    click("RPV) já foi emitida");
    click("INSS");
    click("Sou cônjuge ou companheiro");
    expect(text()).toContain("Os herdeiros já foram habilitados");
  });
});
