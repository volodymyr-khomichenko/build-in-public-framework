import { useEffect, useId, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import {
  BOUNDARY,
  BLEND_LINE,
  BACKGROUND_LINE,
  INTRO,
  ROUNDS,
  SUBSCRIBE_ENDPOINT,
  SUPPORT_LINE,
  SYMPTOMS,
  TOTAL,
  clearState,
  emailPayload,
  emptyState,
  evaluate,
  loadState,
  pillarTone,
  roundAnswered,
  roundComplete,
  saveState,
  symptomsComplete,
  type Ans,
  type FrameworkState,
  type Qid,
  type Question,
  type SymptomAns,
} from "@/lib/framework";

const BOOK = "https://khomichenko.com/build-in-public/";
const AUDIO = "https://youtu.be/VFHsPbn17bM";

const ANSWER_OPTIONS: { value: Ans; label: string; cls: string }[] = [
  { value: "C", label: "Clear answer", cls: "yes" },
  { value: "V", label: "Vague", cls: "vague" },
  { value: "N", label: "No answer", cls: "no" },
];

const SYMPTOM_OPTIONS: { value: SymptomAns; label: string; cls: string }[] = [
  { value: "me", label: "That's me", cls: "yes" },
  { value: "not", label: "Not me", cls: "no" },
];

function AnswerGroup<T extends string>({
  label,
  value,
  options,
  onToggle,
  onPick,
  warn,
  flag,
}: {
  label: string;
  value: T | null;
  options: { value: T; label: string; cls: string }[];
  onToggle: (next: T) => void;
  onPick: (next: T) => void;
  warn?: boolean;
  flag?: boolean;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  function onKey(e: KeyboardEvent) {
    const i = options.findIndex((o) => o.value === value);
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = i < 0 ? 0 : (i + 1) % options.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
      next = i < 0 ? options.length - 1 : (i - 1 + options.length) % options.length;
    else return;
    e.preventDefault();
    onPick(options[next].value);
    refs.current[next]?.focus();
  }
  return (
    <div
      className={warn ? "toggle rf" : "toggle"}
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKey}
    >
      {options.map((o, idx) => {
        const on = value === o.value;
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[idx] = el;
            }}
            type="button"
            role="radio"
            aria-checked={on}
            className={on ? `${o.cls} on` : o.cls}
            onClick={() => onToggle(o.value)}
          >
            {flag && o.value === "me" ? <span aria-hidden="true">⚑</span> : null}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Chips({
  q,
  state,
  onChange,
}: {
  q: Question;
  state: FrameworkState;
  onChange: (next: FrameworkState) => void;
}) {
  if (!q.chips) return null;
  const { chips } = q;
  return (
    <div className="chips">
      <span className="chip-k">Optional</span>
      {chips.options.map((opt) => {
        const on =
          chips.key === "trust"
            ? state.chips.trust.includes(opt.id)
            : chips.key === "face"
              ? state.chips.face === opt.id
              : state.chips.dial === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            className={on ? "chip on" : "chip"}
            aria-pressed={on}
            onClick={() => {
              const next: FrameworkState = {
                ...state,
                chips: { ...state.chips, trust: [...state.chips.trust] },
              };
              if (chips.key === "trust") {
                next.chips.trust = on
                  ? next.chips.trust.filter((id) => id !== opt.id)
                  : [...next.chips.trust, opt.id];
              } else if (chips.key === "face") {
                next.chips.face = on ? null : (opt.id as "public" | "background");
              } else {
                next.chips.dial = on ? null : (opt.id as "magnet" | "map");
              }
              onChange(next);
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function FrameworkApp() {
  const [state, setState] = useState<FrameworkState>(emptyState);
  const [step, setStep] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [openFull, setOpenFull] = useState(false);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [armClear, setArmClear] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  const reactId = useId();

  const reading = evaluate(state);

  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setState(saved.state);
      setStep(Math.min(8, Math.max(0, saved.step)));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveState(state, step);
  }, [state, step, hydrated]);

  useEffect(() => {
    if (!moved.current) return;
    headingRef.current?.focus();
  }, [step]);

  useEffect(() => {
    const post = () => {
      if (window.parent === window) return;
      window.parent.postMessage(
        { type: "bip-framework-height", height: document.documentElement.scrollHeight },
        "*",
      );
    };
    post();
    window.addEventListener("resize", post);
    const id = window.setInterval(post, 700);
    return () => {
      window.removeEventListener("resize", post);
      window.clearInterval(id);
    };
  }, [step, state, openFull, sentTo]);

  function go(next: number) {
    moved.current = true;
    setStep(next);
    setOpenFull(false);
  }

  function setAnswer(id: Qid, value: Ans) {
    setState((prev) => ({ ...prev, answers: { ...prev.answers, [id]: value } }));
  }

  function setSymptom(id: (typeof SYMPTOMS)[number]["id"], value: SymptomAns) {
    setState((prev) => ({ ...prev, symptoms: { ...prev.symptoms, [id]: value } }));
  }

  function startOver() {
    if (!armClear) {
      setArmClear(true);
      return;
    }
    clearState();
    setState(emptyState());
    setSentTo(null);
    setEmail("");
    setConsent(false);
    setArmClear(false);
    go(0);
  }

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && consent;

  async function sendEmail() {
    if (!validEmail || sending) return;
    setEmailErr(false);
    const payload = { ...emailPayload(state, reading), email: email.trim() };
    if (!SUBSCRIBE_ENDPOINT) {
      setSentTo(email.trim());
      return;
    }
    setSending(true);
    try {
      const res = await fetch(SUBSCRIBE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("bad status");
      setSentTo(email.trim());
    } catch {
      setEmailErr(true);
    } finally {
      setSending(false);
    }
  }

  const outcomeTone =
    reading.answered === 0
      ? ""
      : reading.outcome.text.startsWith("Positive")
        ? "pos"
        : reading.outcome.text.startsWith("Negative") || reading.outcome.text.startsWith("Zero")
          ? "bad"
          : "";

  const symptomAnswered = SYMPTOMS.filter((s) => state.symptoms[s.id] != null).length;

  return (
    <div className="bip">
      <div className="wrap">
        <div className="book-banner">
          <div className="bx" aria-hidden="true">
            ×
          </div>
          <div>
            This is the framework from the book <b>"Build in Public"</b> by Volodymyr
            Khomichenko. To understand the full logic behind your result, I recommend reading the
            book.{" "}
            <a href={BOOK}>About the book →</a>
          </div>
        </div>

        <div className="eyebrow">
          <span className="x" aria-hidden="true">
            ×
          </span>
          The Framework
        </div>
        <h1 className="headline">
          What is your openness actually <em>multiplying</em>?
        </h1>
        <p className="subhead">
          Six parts of the book's <b>Transparency Audit</b>, two questions from the chapters,
          then the <b>symptoms</b>. Answer <i>Clear</i>, <i>Vague</i> or <i>No answer</i> — the
          vague ones are the diagnosis.
        </p>

        <div className="stage">
          <div className="left">
            <section className="shapes-card" aria-label="Your formula">
              <div className="bh-lbl">Your formula</div>
              <div className="formula">
                <FormulaTile
                  k="Base"
                  word={reading.base.text}
                  tone={reading.tone.base}
                  onClick={() => go(0)}
                />
                <span className="times" aria-hidden="true">
                  ×
                </span>
                <FormulaTile
                  k="Coefficient"
                  word={reading.coefficient.text}
                  tone={reading.tone.coefficient}
                  onClick={() => go(2)}
                />
                <span className="times" aria-hidden="true">
                  ×
                </span>
                <FormulaTile
                  k="Sign"
                  word={reading.sign.text}
                  tone={reading.tone.sign}
                  onClick={() => go(4)}
                />
              </div>
              <div className="pchips">
                {reading.pillars.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    className={`pchip ${pillarTone(p.state)}`}
                    onClick={() => go(0)}
                  >
                    {p.state === "inplace" ? (
                      <span className="pmark" aria-hidden="true">
                        ✓
                      </span>
                    ) : p.state === "vague" ? (
                      <span className="pmark" aria-hidden="true">
                        ~
                      </span>
                    ) : p.state === "missing" ? (
                      <span className="pmark" aria-hidden="true">
                        ×
                      </span>
                    ) : null}
                    {p.name === "A market that pays" ? "Market that pays" : p.name}
                    <span className="sr">: {p.word}</span>
                  </button>
                ))}
              </div>
              <div className="progress-track" aria-hidden="true">
                <span style={{ width: `${(reading.answered / TOTAL) * 100}%` }} />
              </div>
              <div className="progress-meta">
                <span>
                  <b>{reading.answered}</b>/{TOTAL} answered
                </span>
                <span>Tap a tile to jump</span>
              </div>
              <p className="boundary">{BOUNDARY}</p>
              {reading.coefficient.cheapLine ? (
                <p className="cheap-note">{reading.coefficient.cheapLine}</p>
              ) : null}
            </section>

            <section className="mult-card" aria-live="polite">
              <div className="mult-cap">Outcome</div>
              {reading.answered === 0 ? (
                <>
                  <div className="outcome-title">Answer the rounds — the reading builds as you go.</div>
                  <p className="mult-note">Words only. The book does not measure how much.</p>
                </>
              ) : (
                <>
                  <div className={`outcome-title ${outcomeTone}`}>{reading.outcome.text}</div>
                  <p className="mult-note">{reading.outcome.line}</p>
                </>
              )}
            </section>
          </div>

          <div className="rcol">
            <div className="tabs" role="tablist" aria-label="Audit rounds">
              {ROUNDS.map((round, i) => (
                <button
                  key={round.id}
                  type="button"
                  role="tab"
                  id={`${reactId}-tab-${i}`}
                  aria-selected={step === i}
                  aria-controls={`${reactId}-panel`}
                  className={step === i ? "tab active" : "tab"}
                  onClick={() => go(i)}
                >
                  {round.tab}
                  {roundComplete(state, round) ? <span className="dot" aria-hidden="true" /> : null}
                </button>
              ))}
              <button
                type="button"
                role="tab"
                id={`${reactId}-tab-7`}
                aria-selected={step === 7}
                aria-controls={`${reactId}-panel`}
                className={step === 7 ? "tab active" : "tab"}
                onClick={() => go(7)}
              >
                ⚑ Symptoms
                {symptomsComplete(state) ? <span className="dot" aria-hidden="true" /> : null}
              </button>
              <button
                type="button"
                role="tab"
                id={`${reactId}-tab-8`}
                aria-selected={step === 8}
                aria-controls={`${reactId}-panel`}
                className={step === 8 ? "tab result active" : "tab result"}
                onClick={() => go(8)}
              >
                ★ Result
              </button>
            </div>

            <div
              className="panel"
              role="tabpanel"
              id={`${reactId}-panel`}
              aria-labelledby={`${reactId}-tab-${step}`}
            >
              {step < 7 ? (
                <RoundPanel
                  index={step}
                  state={state}
                  headingRef={headingRef}
                  onAnswer={(id, value, current) => setAnswer(id, current === value ? null : value)}
                  onPick={(id, value) => setAnswer(id, value)}
                  onChips={setState}
                  onBack={() => go(step - 1)}
                  onNext={() => go(step + 1)}
                />
              ) : null}
              {step === 7 ? (
                <SymptomPanel
                  state={state}
                  answered={symptomAnswered}
                  headingRef={headingRef}
                  onToggle={(id, value) =>
                    setSymptom(id, state.symptoms[id] === value ? null : value)
                  }
                  onPick={(id, value) => setSymptom(id, value)}
                  onBack={() => go(6)}
                  onNext={() => go(8)}
                />
              ) : null}
              {step === 8 ? (
                <ResultPanel
                  headingRef={headingRef}
                  reading={reading}
                  openFull={openFull}
                  onToggleFull={() => setOpenFull((v) => !v)}
                  email={email}
                  consent={consent}
                  validEmail={validEmail}
                  sentTo={sentTo}
                  sending={sending}
                  emailErr={emailErr}
                  onEmail={setEmail}
                  onConsent={setConsent}
                  onSend={sendEmail}
                  onEdit={() => go(0)}
                />
              ) : null}
            </div>
          </div>
        </div>

        <footer className="foot">
          <div>
            Build in Public Framework · <span className="tag">v0.2</span>
            {" · "}
            <button type="button" className="linkish" onClick={startOver}>
              {armClear ? "Clear answers?" : "Start over"}
            </button>
          </div>
          <div>Build in Public — Volodymyr Khomichenko</div>
        </footer>
      </div>
    </div>
  );
}

function FormulaTile({
  k,
  word,
  tone,
  onClick,
}: {
  k: string;
  word: string;
  tone: "pos" | "muted" | "bad";
  onClick: () => void;
}) {
  return (
    <button type="button" className={`tile ${tone}`} onClick={onClick} aria-live="polite">
      <span className="tile-k">{k}</span>
      <span className="tile-word">{word}</span>
    </button>
  );
}

function RoundPanel({
  index,
  state,
  headingRef,
  onAnswer,
  onPick,
  onChips,
  onBack,
  onNext,
}: {
  index: number;
  state: FrameworkState;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onAnswer: (id: Qid, value: NonNullable<Ans>, current: Ans) => void;
  onPick: (id: Qid, value: NonNullable<Ans>) => void;
  onChips: (next: FrameworkState) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const round = ROUNDS[index];
  const count = roundAnswered(state, round);
  return (
    <div className="card">
      <div className="step-eyebrow">
        <span className="st">
          Round <b>{index + 1}</b> of 7
        </span>
        <span className="pill-count">
          {count.n}/{count.total} answered
        </span>
      </div>
      <h2 className="block-name" tabIndex={-1} ref={headingRef}>
        {round.title}
        <span className="num">{round.badge}</span>
      </h2>
      {round.note ? <div className="from-note">{round.note}</div> : null}
      <p className="block-mean">{round.explainer}</p>
      <p className="intro">
        Answer honestly. You don't need to type anything — but if you can't say it in a
        sentence, choose <i>Vague</i>.
      </p>
      {round.questions.map((q) => (
        <div className="q" key={q.id}>
          <div className="q-text">
            {q.label ? <div className="q-label">{q.label}</div> : null}
            {q.text}
            {q.helper ? <div className="q-help">{q.helper}</div> : null}
            <Chips q={q} state={state} onChange={onChips} />
          </div>
          <AnswerGroup
            label={q.text}
            value={state.answers[q.id]}
            options={ANSWER_OPTIONS.filter((o): o is { value: NonNullable<Ans>; label: string; cls: string } => o.value != null)}
            onToggle={(v) => onAnswer(q.id, v, state.answers[q.id])}
            onPick={(v) => onPick(q.id, v)}
          />
        </div>
      ))}
      <div className="nav">
        <button type="button" className="btn ghost" onClick={onBack} disabled={index === 0}>
          ← Back
        </button>
        <button type="button" className="btn" onClick={onNext}>
          Next →
        </button>
      </div>
      <span className="sr">{INTRO}</span>
    </div>
  );
}

function SymptomPanel({
  state,
  answered,
  headingRef,
  onToggle,
  onPick,
  onBack,
  onNext,
}: {
  state: FrameworkState;
  answered: number;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onToggle: (id: (typeof SYMPTOMS)[number]["id"], value: NonNullable<SymptomAns>) => void;
  onPick: (id: (typeof SYMPTOMS)[number]["id"], value: NonNullable<SymptomAns>) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="card">
      <div className="step-eyebrow">
        <span className="st">Symptoms</span>
        <span className="pill-count">
          {answered}/7 answered
        </span>
      </div>
      <h2 className="block-name" tabIndex={-1} ref={headingRef}>
        What are you experiencing?
        <span className="num rf">⚑</span>
      </h2>
      <p className="block-mean">
        Seven ways this goes wrong, arranged by symptom. Find what you're experiencing, then
        read what's actually broken.
      </p>
      {SYMPTOMS.map((s) => (
        <div className="q" key={s.id}>
          <div className="q-text">{s.text}</div>
          <AnswerGroup
            label={s.text}
            value={state.symptoms[s.id]}
            options={SYMPTOM_OPTIONS.filter(
              (o): o is { value: NonNullable<SymptomAns>; label: string; cls: string } => o.value != null,
            )}
            warn
            flag
            onToggle={(v) => onToggle(s.id, v)}
            onPick={(v) => onPick(s.id, v)}
          />
        </div>
      ))}
      <div className="nav">
        <button type="button" className="btn ghost" onClick={onBack}>
          ← Back
        </button>
        <button type="button" className="btn primary" onClick={onNext}>
          See my reading →
        </button>
      </div>
    </div>
  );
}

function ResultPanel({
  headingRef,
  reading,
  openFull,
  onToggleFull,
  email,
  consent,
  validEmail,
  sentTo,
  sending,
  emailErr,
  onEmail,
  onConsent,
  onSend,
  onEdit,
}: {
  headingRef: RefObject<HTMLHeadingElement | null>;
  reading: ReturnType<typeof evaluate>;
  openFull: boolean;
  onToggleFull: () => void;
  email: string;
  consent: boolean;
  validEmail: boolean;
  sentTo: string | null;
  sending: boolean;
  emailErr: boolean;
  onEmail: (v: string) => void;
  onConsent: (v: boolean) => void;
  onSend: () => void;
  onEdit: () => void;
}) {
  const showCheap =
    Boolean(reading.coefficient.cheapLine) && !reading.fix.text.includes("cheap kind");
  const pillarLine = reading.pillars.map((p) => `${p.name}: ${p.word}`).join("; ");
  return (
    <div className="card">
      <div className="final-arche">Your reading · Base × Coefficient × Sign</div>
      <h2 className="final-title" tabIndex={-1} ref={headingRef}>
        {reading.archetype}
      </h2>
      <p className="final-line">
        <b>{reading.outcome.text}</b> {reading.outcome.line}
      </p>
      {showCheap ? <p className="cheap-note">{reading.coefficient.cheapLine}</p> : null}
      <div className="disclaimer">
        A lens for your own decision, not a prescription — and not a measurement. The book does not
        answer "how much", and neither does this.
      </div>

      <div className="recs">
        <h3>{reading.fix.heading}</h3>
        <div className="rec">
          <span className={reading.fix.stop ? "rec-badge stop" : "rec-badge"}>{reading.fix.badge}</span>
          <span>
            <span className="rec-name">{reading.fix.title}</span>{" "}
            <span className="rec-play">{reading.fix.text}</span>
          </span>
        </div>
      </div>
      <div className="recs">
        <h3>The dial</h3>
        <div className="rec">
          <span className="rec-badge">Dial</span>
          <span>
            <span className="rec-name">{reading.dial.title}</span>{" "}
            <span className="rec-play">{reading.dial.text}</span>
          </span>
        </div>
      </div>

      <button type="button" className="more-btn" aria-expanded={openFull} onClick={onToggleFull}>
        {openFull ? "Hide the full analysis ↑" : "Read the full analysis ↓"}
      </button>
      <div className={openFull ? "full open" : "full"} id="full">
        <div className="full-inner">
          <div className="rep-h3">The formula applied to you</div>
          <p className="mm">
            <b>Base.</b> {reading.base.text}. {pillarLine}.
          </p>
          <p className="mm">
            <b>Coefficient.</b> {reading.coefficient.text}. Truth gate {reading.truth}. Substance
            gate {reading.substanceGate}. Integration {reading.integration}. Accumulated
            distribution {reading.accumulated}. Costly honesty {reading.costly}. {BOUNDARY}
            {reading.coefficient.cheapLine ? ` ${reading.coefficient.cheapLine}` : ""}
          </p>
          <p className="mm">
            <b>Sign.</b> {reading.sign.text}
            {reading.sign.note ? `. ${reading.sign.note}` : ""}
          </p>
          <p className="mm">
            <b>Outcome.</b> {reading.outcome.text} {reading.outcome.line}
          </p>

          {reading.flavors.length > 0 || reading.background ? (
            <>
              <div className="rep-h3">Your flavor</div>
              {reading.flavors.length > 0 ? (
                <p className="mm">
                  {reading.flavors.join("; ")}. {BLEND_LINE}
                </p>
              ) : (
                <p className="mm">{BLEND_LINE}</p>
              )}
              {reading.background ? <p className="mm">{BACKGROUND_LINE}</p> : null}
            </>
          ) : null}

          {reading.marked.length > 0 ? (
            <>
              <div className="rep-h3">Symptoms you marked</div>
              {reading.marked.map((s) => (
                <div className="fix" key={s.id}>
                  <span className="fix-ic" aria-hidden="true">
                    ⚑
                  </span>
                  <span>
                    <b>{s.name}.</b> <span className="f2">What's broken: {s.broken}</span>
                  </span>
                </div>
              ))}
            </>
          ) : null}

          {reading.personHeavy ? (
            <>
              <div className="rep-h3">The person</div>
              <p className="mm">{SYMPTOMS.find((s) => s.id === "s7")!.todo}</p>
              {reading.support ? <p className="mm">{SUPPORT_LINE}</p> : null}
            </>
          ) : null}

          <div className="email-cta" id="emailCta">
            {sentTo ? (
              <>
                <div className="ec-done">
                  ✓ Done — your reading is on its way to <b>{sentTo}</b>.
                </div>
                {!SUBSCRIBE_ENDPOINT ? (
                  <div className="ec-sub">(Demo mode — connect MailerLite to send for real.)</div>
                ) : null}
              </>
            ) : (
              <>
                <div className="ec-title">Want this reading in your inbox?</div>
                <div className="ec-sub">
                  We'll email your Base, Coefficient and Sign and the chapters to read next.
                </div>
                <div className="ec-row">
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    aria-label="Email"
                    value={email}
                    onChange={(e) => onEmail(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn primary"
                    disabled={!validEmail || sending}
                    onClick={onSend}
                  >
                    {sending ? "Sending…" : "Send it to me"}
                  </button>
                </div>
                <label className="ec-consent">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => onConsent(e.target.checked)}
                  />
                  <span>
                    I agree to receive this analysis and occasional updates about{" "}
                    <em>Build in Public</em>. Unsubscribe anytime.
                  </span>
                </label>
                {emailErr ? (
                  <div className="ec-sub ec-err">
                    That didn't go through — please try again in a moment.
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="final-cta">
        <a className="btn primary" href={BOOK}>
          Get the book
        </a>
        <a className="btn ghost" href={AUDIO} target="_blank" rel="noopener noreferrer">
          Listen to half the book free
        </a>
        <button type="button" className="btn ghost" onClick={onEdit}>
          ← Edit answers
        </button>
      </div>
    </div>
  );
}
