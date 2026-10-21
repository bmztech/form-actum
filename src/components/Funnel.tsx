"use client";

/**
 * Funil de qualificação de leads da Actum Precatórios.
 *
 * Roteiro (ver docs/perguntas.md):
 *   situacao -> [andamento/recurso: A] [já recebeu: F]
 *            -> devedor -> [Estado/Prefeitura/empresa: B]
 *            -> relacao -> [herdeiro/cônjuge: habilitacao] [tutor: C]
 *            -> valor -> [abaixo do mínimo: D] [acima do teto: E]
 *            -> objetivo -> nome -> telefone -> estado
 *            -> processo (opcional) -> aceites -> WhatsApp
 *
 * As telas de encerramento (A–F) ficam em lib/funnel/endings.ts. Só D e E
 * deixam voltar ao funil, pelo botão "Corrigir o valor informado".
 */

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SITE_URL } from "@/lib/config";
import { endingOf } from "@/lib/funnel/endings";
import {
  CONSENT_SEPARATOR,
  labelFor,
  pathTotal,
  questionOf,
  resolveNext,
  stepById,
} from "@/lib/funnel/navigation";
import { FIRST_STEP } from "@/lib/funnel/steps";
import type { Answers, Ending, Step } from "@/lib/funnel/types";
import { validateStep } from "@/lib/funnel/validation";
import { maskName } from "@/lib/input/name";
import { maskPhone } from "@/lib/input/phone";
import { markSubmitted, useHasSubmitted } from "@/lib/submission/status";
import { trackPixelEvent } from "@/lib/tracking/pixel";
import { readTracking, type Tracking } from "@/lib/tracking/utm";
import { buildNurtureUrl, buildWhatsAppUrl } from "@/lib/whatsapp/message";

/** Atalho de teclado da opção i: A, B, C… */
const letter = (i: number) => String.fromCharCode(65 + i);

type Screen = "intro" | "question" | "ending" | "done";

export default function Funnel() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [currentId, setCurrentId] = useState<string>(FIRST_STEP);
  const [history, setHistory] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [whatsAppUrl, setWhatsAppUrl] = useState<string>("");
  const [ending, setEnding] = useState<Ending | null>(null);
  const [nurtureUrl, setNurtureUrl] = useState<string>("");

  const tracking = useRef<Tracking>({});
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    tracking.current = readTracking();
  }, []);

  const alreadySubmitted = useHasSubmitted();

  const step = stepById(currentId) as Step;
  const total = pathTotal(answers);
  const progress =
    screen === "question" ? Math.max(4, (history.length / total) * 100) : 0;

  useEffect(() => {
    if (
      screen === "question" &&
      (step?.kind === "text" || step?.kind === "name" || step?.kind === "phone")
    ) {
      inputRef.current?.focus();
    }
  }, [screen, currentId, step?.kind]);

  const finish = useCallback((finalAnswers: Answers) => {
    setWhatsAppUrl(buildWhatsAppUrl(finalAnswers, tracking.current));
    setScreen("done");
  }, []);

  const goTo = useCallback(
    (nextId: string, fromId: string, nextAnswers: Answers) => {
      const reached = endingOf(nextId);
      if (reached) {
        if (reached.nurture)
          setNurtureUrl(buildNurtureUrl(nextAnswers, tracking.current));
        setEnding(reached);
        setScreen("ending");
        return;
      }
      if (nextId === "submit") {
        finish(nextAnswers);
        return;
      }
      setHistory((h) => [...h, fromId]);
      setCurrentId(nextId);
      setDraft(nextAnswers[nextId] ?? "");
      setError(null);
    },
    [finish],
  );

  const answer = useCallback(
    (value: string) => {
      const nextAnswers = { ...answers, [step.id]: value };
      setAnswers(nextAnswers);
      goTo(resolveNext(step, value), step.id, nextAnswers);
    },
    [answers, goTo, step],
  );

  const submitInput = useCallback(() => {
    const value = draft.trim();
    const problem = validateStep(step, value);
    if (problem) {
      setError(problem);
      return;
    }
    answer(value);
  }, [answer, draft, step]);

  /**
   * "Corrigir o valor informado" (Mensagens D e E): volta para a pergunta,
   * mantém as outras respostas e guarda o valor anterior para a Pré-análise.
   */
  const retry = useCallback(() => {
    const retryStep = ending?.retryStep;
    if (!retryStep) return;
    const previous = answers[retryStep];
    if (previous) {
      const label = labelFor(stepById(retryStep) as Step, previous);
      const before = answers.valor_anterior?.split(", ") ?? [];
      const valorAnterior = before.includes(label)
        ? before
        : [...before, label];
      setAnswers({ ...answers, valor_anterior: valorAnterior.join(", ") });
    }
    setCurrentId(retryStep);
    setDraft("");
    setError(null);
    setEnding(null);
    setScreen("question");
  }, [answers, ending]);

  const goBack = useCallback(() => {
    if (history.length === 0) {
      setScreen("intro");
      return;
    }
    const previous = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setCurrentId(previous);
    setDraft(answers[previous] ?? "");
    setError(null);
  }, [answers, history]);

  useEffect(() => {
    if (screen !== "question" || step?.kind !== "choice") return;
    if (step.layout === "grid") return;

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1) return;
      const option = step.options[e.key.toUpperCase().charCodeAt(0) - 65];
      if (option) {
        e.preventDefault();
        answer(option.value);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answer, screen, step]);

  const canGoBack = screen === "question";

  const body = useMemo(() => {
    if (screen === "intro" && alreadySubmitted) return <AlreadySubmitted />;
    if (screen === "intro")
      return <Intro onStart={() => setScreen("question")} />;
    if (screen === "ending" && ending) {
      return (
        <EndingScreen ending={ending} nurtureUrl={nurtureUrl} onRetry={retry} />
      );
    }
    if (screen === "done") return <Done url={whatsAppUrl} />;

    const checked = draft ? draft.split(CONSENT_SEPARATOR) : [];
    const toggle = (value: string) => {
      const next = checked.includes(value)
        ? checked.filter((v) => v !== value)
        : [...checked, value];
      setDraft(next.join(CONSENT_SEPARATOR));
      setError(null);
    };

    return (
      <div key={currentId} className="animate-step-in">
        <h2 className="text-xl leading-snug font-bold text-ink sm:text-2xl">
          {questionOf(step, answers)}
        </h2>

        {step.helper && (
          <p className="mt-3 text-sm leading-relaxed text-slate-soft">
            {step.helper}
          </p>
        )}

        {step.kind === "choice" ? (
          <div
            className={
              step.layout === "grid"
                ? "mt-8 grid gap-3 sm:grid-cols-2"
                : "mt-8 space-y-3"
            }
          >
            {step.options.map((option, i) => (
              <button
                key={option.value}
                type="button"
                onClick={() => answer(option.value)}
                className="group flex w-full items-center gap-3 rounded-lg border-2 border-paper-2 bg-white px-4 py-4 text-left transition-all hover:-translate-y-0.5 hover:border-gold hover:shadow-md focus:outline-none focus-visible:border-gold focus-visible:ring-3 focus-visible:ring-gold/25"
              >
                {step.layout !== "grid" && (
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-paper text-xs font-bold text-slate-soft transition-colors group-hover:bg-gold group-hover:text-white">
                    {letter(i)}
                  </span>
                )}
                <span className="text-base font-medium text-ink">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-8">
            {step.kind === "select" ? (
              <select
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  setError(null);
                }}
                className="w-full rounded-lg border-2 border-paper-2 bg-white px-4 py-4 text-lg text-ink transition-colors outline-none focus:border-gold focus:ring-3 focus:ring-gold/20"
              >
                <option value="" disabled>
                  {step.placeholder}
                </option>
                {step.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : step.kind === "consent" ? (
              <div className="space-y-3">
                {step.options.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border-2 border-paper-2 bg-white px-4 py-4 transition-colors hover:border-gold has-checked:border-gold"
                  >
                    <input
                      type="checkbox"
                      checked={checked.includes(option.value)}
                      onChange={() => toggle(option.value)}
                      className="mt-0.5 size-5 shrink-0 accent-gold"
                    />
                    <span className="text-base font-medium text-ink">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <input
                ref={inputRef}
                type={step.kind === "phone" ? "tel" : "text"}
                inputMode={step.kind === "phone" ? "tel" : "text"}
                autoComplete={
                  step.kind === "phone"
                    ? "tel-national"
                    : step.kind === "name"
                      ? "name"
                      : "off"
                }
                value={draft}
                placeholder={step.placeholder}
                onChange={(e) => {
                  const value =
                    step.kind === "phone"
                      ? maskPhone(e.target.value)
                      : step.kind === "name"
                        ? maskName(e.target.value)
                        : e.target.value;
                  setDraft(value);
                  setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    submitInput();
                  }
                }}
                className="w-full rounded-lg border-2 border-paper-2 bg-white px-4 py-4 text-lg text-ink transition-colors outline-none placeholder:text-slate-soft/60 focus:border-gold focus:ring-3 focus:ring-gold/20"
              />
            )}

            {error && (
              <p role="alert" className="mt-2 text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={submitInput}
              className="mt-5 inline-flex items-center gap-2 rounded-[3px] bg-gold px-7 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-3 focus-visible:ring-gold/40"
            >
              {step.kind === "text" && step.optional && !draft.trim()
                ? "Pular esta etapa"
                : "Continuar"}
              <span aria-hidden>→</span>
            </button>
          </div>
        )}

        {step.kind === "choice" && step.layout !== "grid" && (
          <p className="mt-6 hidden text-xs text-slate-soft sm:block">
            Dica: use as teclas{" "}
            {step.options.map((_, i) => letter(i)).join(", ")} para responder
            mais rápido.
          </p>
        )}
      </div>
    );
  }, [
    alreadySubmitted,
    answer,
    answers,
    currentId,
    draft,
    ending,
    error,
    nurtureUrl,
    retry,
    screen,
    step,
    submitInput,
    whatsAppUrl,
  ]);

  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-2xl shrink-0 overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/40">
        <header className="flex items-center justify-between border-b border-paper-2 px-6 py-4">
          <Image
            src="/logo-actum.png"
            alt="Actum Precatórios"
            width={178}
            height={160}
            priority
            className="h-10 w-auto"
          />
          {canGoBack && (
            <button
              type="button"
              onClick={goBack}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-soft transition-colors hover:bg-paper hover:text-ink"
            >
              ← Voltar
            </button>
          )}
        </header>

        <div
          className="h-1 bg-paper-2"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-gold transition-[width] duration-400 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="px-6 py-8 sm:px-10 sm:py-10">{body}</div>
      </div>

      <footer className="mt-6 shrink-0 text-center text-xs text-white/45">
        <a href={SITE_URL} className="hover:text-white/80">
          actumprecatorios.com.br
        </a>
        <span className="mx-2">·</span>
        Crédito judicial reconhecido
      </footer>
    </main>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div className="animate-step-in text-center">
      <p className="flex items-center justify-center gap-2 text-xs font-bold tracking-[0.14em] text-gold-deep uppercase">
        <span className="inline-block h-0.5 w-6 bg-gold-deep" />
        Simulação gratuita
      </p>

      <h1 className="mt-4 text-2xl leading-tight font-bold text-ink sm:text-3xl">
        Seu direito já foi reconhecido na Justiça?
      </h1>

      <p className="mt-5 text-base leading-relaxed text-slate">
        Responda algumas perguntas rápidas e descubra se o seu crédito judicial
        tem condições de ser antecipado — sem compromisso.
      </p>

      <button
        type="button"
        onClick={onStart}
        className="mt-8 w-full rounded-[3px] bg-gold px-8 py-4 text-center text-lg font-semibold text-ink transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-3 focus-visible:ring-gold/40 sm:w-auto"
      >
        Quero saber se posso receber antes <span aria-hidden>→</span>
      </button>

      <p className="mt-5 text-sm text-slate-soft">
        Leva menos de 1 minuto · seus dados são protegidos pela LGPD
      </p>
    </div>
  );
}

function EndingScreen({
  ending,
  nurtureUrl,
  onRetry,
}: {
  ending: Ending;
  nurtureUrl: string;
  onRetry: () => void;
}) {
  const [optIn, setOptIn] = useState(false);

  return (
    <div className="animate-step-in text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-paper text-2xl">
        {ending.icon}
      </div>

      <h2 className="mt-5 text-xl font-bold text-ink sm:text-2xl">
        {ending.title}
      </h2>

      <p className="mt-4 text-base leading-relaxed text-slate">
        {ending.message}
      </p>

      {ending.nurture && (
        <div className="mt-6 rounded-lg border-2 border-paper-2 px-5 py-5 text-left">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={optIn}
              onChange={(e) => setOptIn(e.target.checked)}
              className="mt-0.5 size-5 shrink-0 accent-gold"
            />
            <span className="text-base font-medium text-ink">
              Aceito receber contato da Actum pelo WhatsApp.
            </span>
          </label>

          {optIn ? (
            <a
              href={nurtureUrl}
              className="mt-5 inline-flex w-full items-center justify-center rounded-[3px] bg-gold px-7 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-3 focus-visible:ring-gold/40"
            >
              Quero ser avisado pelo WhatsApp
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="mt-5 inline-flex w-full cursor-not-allowed items-center justify-center rounded-[3px] bg-paper-2 px-7 py-3.5 text-base font-semibold text-slate-soft"
            >
              Quero ser avisado pelo WhatsApp
            </button>
          )}
        </div>
      )}

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {ending.retryStep && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center rounded-[3px] bg-gold px-7 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-3 focus-visible:ring-gold/40"
          >
            Corrigir o valor informado
          </button>
        )}
        <a
          href={SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-[3px] border border-ink bg-transparent px-7 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
        >
          Saiba mais sobre a Actum
        </a>
      </div>
    </div>
  );
}

function Done({ url }: { url: string }) {
  return (
    <div className="animate-step-in text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-sage/10 text-2xl">
        ✅
      </div>

      <h2 className="mt-5 text-xl font-bold text-ink sm:text-2xl">
        Falta só um passo!
      </h2>

      <div className="mt-6 rounded-lg border-2 border-gold bg-gold-light/30 px-5 py-5">
        <p className="text-lg leading-snug font-extrabold text-ink uppercase sm:text-xl">
          Envie a mensagem pronta na próxima tela do WhatsApp
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate">
          Ela já vai estar escrita com os seus dados — é só apertar enviar.{" "}
          <strong>Sem esse envio, a nossa equipe não recebe o seu caso.</strong>
        </p>
      </div>

      <a
        href={url}
        onClick={() => {
          trackPixelEvent("Lead");
          markSubmitted();
        }}
        className="mt-7 inline-flex w-full items-center justify-center rounded-[3px] bg-gold px-8 py-4 text-lg font-semibold text-ink transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-3 focus-visible:ring-gold/40 sm:w-auto"
      >
        Falar com a Actum agora
      </a>

      <p className="mt-4 text-xs text-slate-soft">
        Sua simulação é gratuita, sem compromisso e seus dados são protegidos
        pela LGPD.
      </p>
    </div>
  );
}

function AlreadySubmitted() {
  return (
    <div className="animate-step-in text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-sage/10 text-2xl">
        🙏
      </div>

      <h2 className="mt-5 text-xl font-bold text-ink sm:text-2xl">
        Agradecemos o seu contato!
      </h2>

      <p className="mt-4 text-base leading-relaxed text-slate">
        Já recebemos as suas informações. Em breve, alguém da nossa equipe vai
        te chamar no WhatsApp para dar continuidade à análise do seu crédito.
      </p>

      <a
        href={SITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-[3px] border border-ink bg-transparent px-7 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
      >
        Visitar o site da Actum
      </a>
    </div>
  );
}
