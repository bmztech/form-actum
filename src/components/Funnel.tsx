"use client";

/**
 * Funil de qualificação de leads da Actum Precatórios.
 *
 * Roteiro (ver "Arquitetura do Formulário Actum"):
 *   situacao -> [em andamento: desqualifica]
 *            -> devedor -> relacao -> [herdeiro: inventario] -> valor
 *            -> objetivo -> nome -> telefone -> processo (opcional) -> WhatsApp
 *
 * Depois que o lead cai na tela de desqualificação, não dá pra reabrir o
 * funil a partir dali — só pode ir para o site institucional.
 */

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SITE_URL } from "@/lib/config";
import {
  FIRST_STEP,
  pathTotal,
  questionOf,
  resolveNext,
  stepById,
  type Answers,
  type Step,
} from "@/lib/form";
import { trackPixelEvent } from "@/lib/pixel";
import { markSubmitted, useHasSubmitted } from "@/lib/submission-status";
import {
  buildWhatsAppUrl,
  isValidName,
  isValidPhone,
  maskName,
  maskPhone,
  readTracking,
  type Tracking,
} from "@/lib/whatsapp";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

type Screen = "intro" | "question" | "disqualified" | "done";

export default function Funnel() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [currentId, setCurrentId] = useState<string>(FIRST_STEP);
  const [history, setHistory] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [whatsAppUrl, setWhatsAppUrl] = useState<string>("");

  const tracking = useRef<Tracking>({});
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    tracking.current = readTracking();
  }, []);

  const alreadySubmitted = useHasSubmitted();

  const step = stepById(currentId) as Step;
  const total = pathTotal(answers);
  const progress = screen === "question" ? Math.max(4, (history.length / total) * 100) : 0;

  useEffect(() => {
    if (screen === "question" && step?.kind !== "choice") {
      inputRef.current?.focus();
    }
  }, [screen, currentId, step?.kind]);

  const finish = useCallback((finalAnswers: Answers) => {
    setWhatsAppUrl(buildWhatsAppUrl(finalAnswers, tracking.current));
    setScreen("done");
  }, []);

  const goTo = useCallback(
    (nextId: string, fromId: string, nextAnswers: Answers) => {
      if (nextId === "disqualified") {
        setScreen("disqualified");
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

    if (step.kind === "phone") {
      if (!isValidPhone(value)) {
        setError("Digite um WhatsApp válido com DDD.");
        return;
      }
    } else if (step.kind === "name" && !isValidName(value)) {
      setError("Digite um nome válido.");
      return;
    } else if (step.kind === "text" && !step.optional && value.length < 2) {
      setError("Por favor, preencha este campo.");
      return;
    }

    answer(value);
  }, [answer, draft, step]);

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

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const index = LETTERS.indexOf(e.key.toUpperCase());
      const option = index >= 0 ? step.options[index] : undefined;
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
    if (screen === "intro") return <Intro onStart={() => setScreen("question")} />;
    if (screen === "disqualified") return <Disqualified />;
    if (screen === "done") return <Done url={whatsAppUrl} />;

    return (
      <div key={currentId} className="animate-step-in">
        <h2 className="text-xl leading-snug font-bold text-ink sm:text-2xl">
          {questionOf(step, answers)}
        </h2>

        {step.kind === "choice" ? (
          <div className="mt-8 space-y-3">
            {step.options.map((option, i) => (
              <button
                key={option.value}
                type="button"
                onClick={() => answer(option.value)}
                className="group flex w-full items-center gap-3 rounded-lg border-2 border-paper-2 bg-white px-4 py-4 text-left transition-all hover:-translate-y-0.5 hover:border-gold hover:shadow-md focus:outline-none focus-visible:border-gold focus-visible:ring-3 focus-visible:ring-gold/25"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-paper text-xs font-bold text-slate-soft transition-colors group-hover:bg-gold group-hover:text-white">
                  {LETTERS[i]}
                </span>
                <span className="text-base font-medium text-ink">{option.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <input
              ref={inputRef}
              type={step.kind === "phone" ? "tel" : "text"}
              inputMode={step.kind === "phone" ? "tel" : "text"}
              autoComplete={step.kind === "phone" ? "tel-national" : "name"}
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

            {step.helper && (
              <p className="mt-2 text-sm text-slate-soft">{step.helper}</p>
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
              {step.optional && !draft.trim() ? "Pular esta etapa" : "Continuar"}
              <span aria-hidden>→</span>
            </button>
          </div>
        )}

        {step.kind === "choice" && (
          <p className="mt-6 hidden text-xs text-slate-soft sm:block">
            Dica: use as teclas {step.options.map((_, i) => LETTERS[i]).join(", ")} para responder
            mais rápido.
          </p>
        )}
      </div>
    );
  }, [alreadySubmitted, answer, answers, currentId, draft, error, screen, step, submitInput, whatsAppUrl]);

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
        Responda algumas perguntas rápidas e descubra se o seu precatório tem
        condições de ser antecipado — sem compromisso.
      </p>

      <button
        type="button"
        onClick={onStart}
        className="mt-8 w-full rounded-[3px] bg-gold px-8 py-4 text-center text-lg font-semibold text-ink transition-colors hover:bg-gold-hover focus:outline-none focus-visible:ring-3 focus-visible:ring-gold/40 sm:w-auto"
      >
        Quero saber se posso receber antes <span aria-hidden>→</span>
      </button>

      <p className="mt-5 text-sm text-slate-soft">
        Leva menos de 1 minuto · protegido por sigilo bancário e LGPD
      </p>
    </div>
  );
}

function Disqualified() {
  return (
    <div className="animate-step-in text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-paper text-2xl">
        ⏳
      </div>

      <h2 className="mt-5 text-xl font-bold text-ink sm:text-2xl">
        Ainda não podemos antecipar seu crédito
      </h2>

      <p className="mt-4 text-base leading-relaxed text-slate">
        Pois o processo está em andamento. Para realizar a antecipação, é
        necessário que o crédito judicial esteja definido.
      </p>

      <a
        href={SITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-[3px] border border-ink bg-transparent px-7 py-3.5 text-base font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
      >
        Saiba mais sobre precatórios
      </a>
    </div>
  );
}

function Done({ url }: { url: string }) {
  return (
    <div className="animate-step-in text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-sage/10 text-2xl">
        ✅
      </div>

      <h2 className="mt-5 text-xl font-bold text-ink sm:text-2xl">Falta só um passo!</h2>

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
        Sua simulação é gratuita, sem compromisso e protegida por sigilo
        bancário e LGPD.
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

      <h2 className="mt-5 text-xl font-bold text-ink sm:text-2xl">Agradecemos o seu contato!</h2>

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
