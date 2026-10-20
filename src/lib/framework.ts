/** Build in Public Framework — word ratings only. No magnitude. */

export type Ans = "C" | "V" | "N" | null;
export type SymptomAns = "me" | "not" | null;
export type Group = "missing" | "vague" | "unknown" | "inplace";
export type GateWord = "Failed" | "Unchecked" | "Not answered" | "Passed";

export const QIDS = [
  "r1q1",
  "r1q2",
  "r1q3",
  "r1q4",
  "r1q5",
  "r2q1",
  "r2q2",
  "r2q3",
  "r2q4",
  "r2q5",
  "r3q1",
  "r3q2",
  "r3q3",
  "r4q1",
  "r4q2",
  "r4q3",
  "r5q1",
  "r5q2",
  "r6q1",
  "r6q2",
  "r6q3",
  "r7q1",
  "r7q2",
  "r7q3",
] as const;

export const SIDS = ["s1", "s2", "s3", "s4", "s5", "s6", "s7"] as const;

export type Qid = (typeof QIDS)[number];
export type Sid = (typeof SIDS)[number];

export const TOTAL = QIDS.length + SIDS.length;

export interface ChipOption {
  id: string;
  label: string;
}

export interface Question {
  id: Qid;
  text: string;
  helper?: string;
  label?: string;
  chips?: {
    mode: "multi" | "single";
    key: "trust" | "face" | "dial";
    options: ChipOption[];
  };
}

export interface Round {
  id: string;
  tab: string;
  title: string;
  badge: string;
  explainer: string;
  note?: string;
  questions: Question[];
}

const TRUST_CHIPS: ChipOption[] = [
  { id: "numbers", label: "Numbers" },
  { id: "code", label: "Code" },
  { id: "expertise", label: "Expertise" },
  { id: "personality", label: "My personality" },
  { id: "behaves", label: "How the company behaves" },
];

export const ROUNDS: Round[] = [
  {
    id: "base",
    tab: "Base",
    title: "Is there a base?",
    badge: "Base",
    explainer:
      "A viable business stands on four things. Transparency acts on them; it never replaces them.",
    questions: [
      {
        id: "r1q1",
        text: "What specific problem do I solve, and for whom — in one sentence, without adjectives?",
      },
      {
        id: "r1q2",
        text: "Who has already paid me for it? If nobody, who pays for something comparable today?",
      },
      {
        id: "r1q3",
        text: "Is this a market that structurally pays, or one that expects things like mine to be free? What is the free alternative my customer would reach for first?",
        helper:
          "Clear answer = you know it structurally pays, and you can name the free alternative.",
      },
      {
        id: "r1q4",
        text: "How do I collect the money, and is the price right for the customer I actually want? What kind of customer does my current price attract?",
      },
      {
        id: "r1q5",
        text: "If I published nothing for six months, how would anyone new find me? Name the mechanism, not the hope.",
      },
    ],
  },
  {
    id: "openness",
    tab: "Openness",
    title: "Which openness fits me?",
    badge: "Fit",
    explainer:
      "The right flavor is the one that grows naturally out of your business, your source of trust, and your nature.",
    questions: [
      {
        id: "r2q1",
        text: "Where does trust live in my business: in numbers, in code, in expertise, in my personality, or in how the company behaves?",
        chips: { mode: "multi", key: "trust", options: TRUST_CHIPS },
      },
      {
        id: "r2q2",
        text: "Am I willing to be a public face for years — or would I rather the company be open while I stay in the background?",
        chips: {
          mode: "single",
          key: "face",
          options: [
            { id: "public", label: "Public face" },
            { id: "background", label: "Background" },
          ],
        },
      },
      {
        id: "r2q3",
        text: "Where is the conversation about my problem already happening, and would I read there even if I never published?",
      },
      {
        id: "r2q4",
        text: "What can I give away for free that would make someone more likely, rather than less likely, to pay me?",
      },
      {
        id: "r2q5",
        label: "From Chapter 8",
        text: "Can I make openness a part of the product itself or the channel itself, rather than an add-on off to the side?",
      },
    ],
  },
  {
    id: "gates",
    tab: "Gates",
    title: "The gates",
    badge: "Gates",
    explainer:
      "A gate is a yes-or-no condition: pass it, and the multiplier can work for you; fail it, and no amount of shine will save you.",
    questions: [
      {
        id: "r3q1",
        text: "Is every number I plan to publish one I would stand behind if a journalist, a former employee and a customer all checked it?",
      },
      {
        id: "r3q2",
        text: "Am I presenting a peak as if it were typical, or a pilot as if it were a partnership?",
        helper: "Clear answer = you can say plainly that you are not.",
      },
      {
        id: "r3q3",
        text: "Is there something real underneath this, or am I about to amplify a hope?",
        helper: "Clear answer = you can name what's real underneath.",
      },
    ],
  },
  {
    id: "costly",
    tab: "Costly",
    title: "The costly question",
    badge: "Cost",
    explainer:
      "Openness against your own interest is the one trust signal a liar cannot copy.",
    questions: [
      {
        id: "r4q1",
        text: "What could I honestly say or do that would cost me something in the short term — and prove to a customer that I'm on their side?",
      },
      {
        id: "r4q2",
        text: "What flaw in my own product would I rather a competitor didn't name first?",
      },
      {
        id: "r4q3",
        text: "When did I last tell a customer not to buy something?",
      },
    ],
  },
  {
    id: "sign",
    tab: "Audience & sign",
    title: "Before you launch & the sign",
    badge: "Chapters",
    note: "From the chapters — these two are not part of the book's Transparency Audit.",
    explainer:
      "Accumulated distribution — the audience, trust and reputation gathered before you launch. When you are the channel, your conduct decides whether the whole equation comes out positive or negative.",
    questions: [
      {
        id: "r5q1",
        label: "Chapter 9",
        text: "What am I accumulating today that will one day make my launch instant?",
        helper:
          "Clear answer = you can name the audience, trust or reputation already in place — built over years or carried over from a previous project.",
      },
      {
        id: "r5q2",
        label: "Chapter 2",
        text: "Am I prepared to hold a public persona that adds rather than subtracts?",
      },
    ],
  },
  {
    id: "dial",
    tab: "Dial",
    title: "The dial",
    badge: "Dial",
    explainer: "Openness is not a switch set to maximum.",
    questions: [
      {
        id: "r6q1",
        text: "If a competitor read everything I published this month, what could they take and use tomorrow?",
      },
      {
        id: "r6q2",
        text: "Which of my disclosures is inspiration — my story, my lessons, my reasoning — and which is mechanics: the exact channel, the tactic, the niche?",
      },
      {
        id: "r6q3",
        text: "Have my numbers become large enough to be a map rather than a magnet?",
        chips: {
          mode: "single",
          key: "dial",
          options: [
            { id: "magnet", label: "Still a magnet" },
            { id: "map", label: "Now a map" },
          ],
        },
      },
    ],
  },
  {
    id: "person",
    tab: "Person",
    title: "The person",
    badge: "Person",
    explainer:
      "Everything in this book requires you to still be there when the compounding starts.",
    questions: [
      {
        id: "r7q1",
        text: "What rhythm can I honestly hold for a year — not a week, not a month?",
      },
      {
        id: "r7q2",
        text: "Who in my life doesn't need me to be content?",
      },
      {
        id: "r7q3",
        text: "Am I sharing this from the scar or from the open wound?",
        helper: "Clear answer = from the scar.",
      },
    ],
  },
];

export const SYMPTOMS: {
  id: Sid;
  name: string;
  text: string;
  todo: string;
  broken: string;
}[] = [
  {
    id: "s1",
    name: "Empty publicity",
    text: "Attention is growing, conversations are happening, investors are interested — and sales aren't moving.",
    todo: "Stop asking whether people are talking about you and ask whether anyone is buying. If the answer is no, fix that before publishing anything else.",
    broken: "the substance gate. You have a coefficient without a base.",
  },
  {
    id: "s2",
    name: "The public lie",
    text: "A number you published once is no longer quite true, and correcting it now would be awkward.",
    todo: "Correct it now, publicly and plainly. The cost today is a fraction of the cost later.",
    broken:
      "the truth gate. The coefficient has turned negative and is compounding.",
  },
  {
    id: "s3",
    name: "Honest, and going nowhere",
    text: "The product is good, the people who use it love it, you're open about everything — and growth is flat.",
    todo: "Treat distribution as a separate job with its own hours, not as something that happens after the product is ready.",
    broken:
      "the distribution pillar. There is nothing wrong with your transparency; there is no channel for it to amplify.",
  },
  {
    id: "s4",
    name: "The Love Trap",
    text: "The community is growing, the messages are warm, people say they'd be lost without you — and revenue doesn't move.",
    todo: "Run the two columns separately. Not \"how many people love this\" but \"how many paid, and how many paid again.\" If the second column stays empty while the first fills, you are in the wrong market, not the wrong marketing.",
    broken:
      "the paying-market pillar. The coefficient is working perfectly on the wrong variable.",
  },
  {
    id: "s5",
    name: "The negative sign",
    text: "The product hasn't changed, the numbers were fine, and people are quietly leaving anyway.",
    todo: "Separate your worst impulses from your channel. When you most want to hit send, wait an hour. Consider how much of the company should be attached to you at all.",
    broken:
      "the sign. Your public conduct is being multiplied across everything else.",
  },
  {
    id: "s6",
    name: "Eroded moat",
    text: "Clones of your product, your pricing, or your exact tactic appear within weeks of your posting about them.",
    todo: "Separate inspiration from mechanics. Keep giving away the story, the lessons and the why. Be careful with the exact channel, the precise tactic and the profitable niche. And say plainly that you're narrowing — an audience forgives the change and doesn't forgive being quietly dropped.",
    broken:
      "nothing, yet — but the dose of openness no longer matches the stage.",
  },
  {
    id: "s7",
    name: "The founder runs out",
    text: "The metrics are fine and you can't make yourself post. Comparison stings. Criticism lingers for days.",
    todo: "Set a rhythm you can hold for a year, not a week. Keep a circle of people off-screen who don't need you to be content. Share from the scar, not the open wound. And if the weight is genuinely heavy, treat that as a signal to stop and get real support — that isn't a break in the plan, it is the plan.",
    broken: "the person operating the multiplier.",
  },
];

/** Symptom priority for archetype and "fix this first": 2, 1, 5, 4, 3, 6, 7. */
export const SYMPTOM_PRIORITY: Sid[] = ["s2", "s1", "s5", "s4", "s3", "s6", "s7"];

export const INTRO =
  "Answer honestly. You don't need to type anything — but if you can't say it in a sentence, choose Vague.";

export const VAGUE_WORK =
  "If any of these answers is vague, that is your next month's work — not transparency.";

export const BOUNDARY =
  "The coefficient acts on trust, reach and adoption — never on a market's willingness to pay.";

export const FUSE_NOTE =
  "The more the company fuses with you, the higher the ceiling and the lower the floor.";

export const CHEAP_LINE = "Your transparency is currently the cheap kind.";

export const SUPPORT_LINE =
  "If the emotional weight of being public becomes genuinely heavy, that's a signal not to grit your teeth and keep posting, but to stop and lean on real support, including professional support.";

export const BLEND_LINE =
  "These flavors aren't mutually exclusive — the strongest founders often blend two or three.";

export const BACKGROUND_LINE =
  "The open-source and institutional flavors exist precisely so that the company can be transparent while you stay in the background.";

const PILLAR_LINES = {
  substance: "real value that solves a real problem. Missing it, the multiplier inflates emptiness.",
  market:
    "not an audience that loves you, but people structurally willing to hand over money.",
  monetization:
    "a working way to collect that money. Same product, same market, wrong price, no business.",
  distribution: "a path by which people find out you exist.",
} as const;

const AMP_LINES = {
  integration:
    "openness woven into the product or the channel (open source, teaching, demonstration) rather than bolted on beside it.",
  accumulated:
    "the audience, trust and reputation gathered before you launch. It can be built over years or transferred from a previous project, but it never appears instantly.",
  costly: "openness that works against your own short-term interest.",
} as const;

const FLAVOR_MAP: Record<string, string> = {
  numbers: "open metrics",
  code: "open source",
  expertise: "teaching",
  personality: "solo narration",
  behaves: "public philosophy / institutional honesty",
};

export interface Chips {
  trust: string[];
  face: "public" | "background" | null;
  dial: "magnet" | "map" | null;
}

export interface FrameworkState {
  answers: Record<Qid, Ans>;
  symptoms: Record<Sid, SymptomAns>;
  chips: Chips;
}

export function emptyState(): FrameworkState {
  const answers = {} as Record<Qid, Ans>;
  for (const id of QIDS) answers[id] = null;
  const symptoms = {} as Record<Sid, SymptomAns>;
  for (const id of SIDS) symptoms[id] = null;
  return { answers, symptoms, chips: { trust: [], face: null, dial: null } };
}

export function answeredCount(state: FrameworkState): number {
  let n = 0;
  for (const id of QIDS) if (state.answers[id] != null) n += 1;
  for (const id of SIDS) if (state.symptoms[id] != null) n += 1;
  return n;
}

export function groupOf(items: Ans[]): Group {
  if (items.some((a) => a === "N")) return "missing";
  if (items.some((a) => a === "V")) return "vague";
  if (items.some((a) => a == null)) return "unknown";
  return "inplace";
}

export function pillarWord(g: Group): string {
  if (g === "inplace") return "In place";
  if (g === "vague") return "Vague";
  if (g === "missing") return "Missing";
  return "Not answered";
}

function ampWord(g: Group): string {
  if (g === "inplace") return "Present";
  if (g === "vague") return "Forming";
  if (g === "missing") return "Absent";
  return "Not answered";
}

function truthGate(q1: Ans, q2: Ans, s2: SymptomAns): GateWord {
  if (s2 === "me" || q1 === "N" || q2 === "N") return "Failed";
  if (q1 === "V" || q2 === "V") return "Unchecked";
  if (q1 == null || q2 == null) return "Not answered";
  return "Passed";
}

function substanceGate(q3: Ans, substance: Group, s1: SymptomAns): GateWord {
  if (s1 === "me" || q3 === "N" || substance === "missing") return "Failed";
  if (q3 === "V" || substance === "vague") return "Unchecked";
  if (q3 == null || substance === "unknown") return "Not answered";
  return "Passed";
}

export interface PillarView {
  key: "substance" | "market" | "monetization" | "distribution";
  name: string;
  short: string;
  state: Group;
  word: string;
  line: string;
}

export interface FixView {
  heading: string;
  badge: string;
  stop: boolean;
  title: string;
  text: string;
}

export interface DialView {
  title: string;
  text: string;
}

export interface Reading {
  answered: number;
  pillars: PillarView[];
  base: { kind: "zero" | "unproven" | "incomplete" | "complete"; text: string };
  truth: GateWord;
  substanceGate: GateWord;
  integration: string;
  accumulated: string;
  costly: string;
  cheap: boolean;
  coefficient: { text: string; cheapLine?: string };
  sign: { text: string; note?: string };
  outcome: { text: string; line: string };
  archetype: string;
  fix: FixView;
  dial: DialView;
  flavors: string[];
  background: boolean;
  marked: { id: Sid; name: string; broken: string }[];
  personHeavy: boolean;
  support: boolean;
  missingPillars: string[];
  tone: { base: Tone; coefficient: Tone; sign: Tone };
}

export type Tone = "pos" | "muted" | "bad";

function baseTone(kind: Reading["base"]["kind"]): Tone {
  if (kind === "complete") return "pos";
  if (kind === "zero") return "bad";
  return "muted";
}

function coefTone(text: string): Tone {
  if (text.startsWith("Negative") || text.startsWith("Nothing")) return "bad";
  if (text.startsWith("Very high") || text.startsWith("High")) return "pos";
  if (text.startsWith("Moderate") && text.includes("gates passed")) return "pos";
  return "muted";
}

function signTone(text: string): Tone {
  if (text === "Positive" || text.startsWith("Less exposed")) return "pos";
  if (text === "Negative" || text === "At risk") return "bad";
  return "muted";
}

export function pillarTone(g: Group): Tone {
  if (g === "inplace") return "pos";
  if (g === "missing") return "bad";
  return "muted";
}

function symptomById(id: Sid) {
  return SYMPTOMS.find((s) => s.id === id)!;
}

export function evaluate(state: FrameworkState): Reading {
  const a = state.answers;
  const pillars: PillarView[] = [
    {
      key: "substance",
      name: "Substance",
      short: "Substance",
      state: groupOf([a.r1q1]),
      word: "",
      line: PILLAR_LINES.substance,
    },
    {
      key: "market",
      name: "A market that pays",
      short: "Market",
      state: groupOf([a.r1q2, a.r1q3]),
      word: "",
      line: PILLAR_LINES.market,
    },
    {
      key: "monetization",
      name: "Monetization",
      short: "Monetization",
      state: groupOf([a.r1q4]),
      word: "",
      line: PILLAR_LINES.monetization,
    },
    {
      key: "distribution",
      name: "Distribution",
      short: "Distribution",
      state: groupOf([a.r1q5]),
      word: "",
      line: PILLAR_LINES.distribution,
    },
  ];
  for (const p of pillars) p.word = pillarWord(p.state);

  const missing = pillars.filter((p) => p.state === "missing");
  const vague = pillars.filter((p) => p.state === "vague");
  let base: Reading["base"];
  if (missing.length) {
    base = {
      kind: "zero",
      text: "Zero — missing: " + missing.map((p) => p.name).join(", "),
    };
  } else if (vague.length) {
    base = {
      kind: "unproven",
      text: "Unproven — vague on: " + vague.map((p) => p.name).join(", "),
    };
  } else if (pillars.some((p) => p.state === "unknown")) {
    base = { kind: "incomplete", text: "Incomplete" };
  } else {
    base = { kind: "complete", text: "Complete" };
  }

  const truth = truthGate(a.r3q1, a.r3q2, state.symptoms.s2);
  const subGate = substanceGate(a.r3q3, pillars[0].state, state.symptoms.s1);

  const integration = ampWord(groupOf([a.r2q4, a.r2q5]));
  const accumulated = ampWord(groupOf([a.r5q1]));
  const costlyItems: Ans[] = [a.r4q1, a.r4q2, a.r4q3];
  const cheap = costlyItems.every((x) => x != null) && costlyItems.every((x) => x !== "C");
  const costly = cheap ? "The cheap kind" : ampWord(groupOf(costlyItems));

  const ampLabels = [integration, accumulated, costly];
  let coefText: string;
  const untouched =
    truth === "Not answered" &&
    subGate === "Not answered" &&
    ampLabels.every((w) => w === "Not answered");
  if (untouched) {
    coefText = "Not answered";
  } else if (truth === "Failed") {
    coefText = "Negative — the truth gate is failing";
  } else if (subGate === "Failed") {
    coefText = "Nothing to multiply — the substance gate is failing";
  } else {
    const n = ampLabels.filter((w) => w === "Present").length;
    const word = n === 3 ? "Very high" : n === 2 ? "High" : n === 1 ? "Moderate" : "Low";
    const passed = truth === "Passed" && subGate === "Passed";
    coefText = `${word} · ${passed ? "gates passed" : "gates unchecked"}`;
  }

  let signText: string;
  let signNote: string | undefined;
  if (state.symptoms.s5 === "me") signText = "Negative";
  else if (state.chips.face === "background")
    signText = "Less exposed — your openness doesn't run through one persona";
  else if (a.r5q2 === "C") signText = "Positive";
  else if (a.r5q2 === "V" || a.r5q2 === "N") signText = "At risk";
  else signText = "Not answered";
  if (state.chips.face === "public") signNote = FUSE_NOTE;

  let outcome: Reading["outcome"];
  if (truth === "Failed") {
    outcome = {
      text: "Negative — a lie multiplied by reach.",
      line: "A lie multiplied by reach detonates in proportion to the trust it built.",
    };
  } else if (signText === "Negative") {
    outcome = {
      text: "Negative — the sign has flipped.",
      line: "A polarizing persona can flip a strong base and a powerful coefficient into decline, without a single thing changing about the product.",
    };
  } else if (base.kind === "zero" || subGate === "Failed") {
    outcome = {
      text: "Zero — a loud, public, well-documented zero.",
      line: "If any pillar is zero, the outcome is zero.",
    };
  } else if (base.kind === "unproven") {
    outcome = {
      text: "Not yet — that is your next month's work, not transparency.",
      line: VAGUE_WORK,
    };
  } else if (
    base.kind === "incomplete" ||
    truth === "Not answered" ||
    truth === "Unchecked" ||
    subGate === "Not answered" ||
    subGate === "Unchecked" ||
    signText === "Not answered" ||
    ampLabels.some((w) => w === "Not answered")
  ) {
    outcome = {
      text: "Unclear — answer the remaining questions.",
      line: "Unanswered questions count as unknown.",
    };
  } else {
    let line = "In the winners, all three parts are positive and large.";
    if (coefText.startsWith("Low") || cheap) {
      line += " The base is there; the coefficient is still small.";
    }
    outcome = { text: "Positive — multiplying what you've built.", line };
  }

  const marked = SYMPTOMS.filter((s) => state.symptoms[s.id] === "me").map((s) => ({
    id: s.id,
    name: s.name,
    broken: s.broken,
  }));

  let archetype = "Multiplying in the right direction";
  const priorityHit = SYMPTOM_PRIORITY.find((id) => state.symptoms[id] === "me");
  if (priorityHit) archetype = symptomById(priorityHit).name;
  else if (truth === "Failed") archetype = "At risk of: The public lie";
  else if (pillars[0].state === "missing" || subGate === "Failed")
    archetype = "At risk of: Empty publicity";
  else if (pillars[1].state === "missing" || pillars[1].state === "vague")
    archetype = "At risk of: The Love Trap";
  else if (pillars[3].state === "missing" || pillars[3].state === "vague")
    archetype = "At risk of: Honest, and going nowhere";
  else if (signText === "At risk" && state.chips.face === "public")
    archetype = "At risk of: The negative sign";
  else if (state.chips.dial === "map" && (a.r6q1 !== "C" || a.r6q2 !== "C"))
    archetype = "At risk of: Eroded moat";
  else if (a.r7q1 === "N" || a.r7q2 === "N" || a.r7q3 === "N")
    archetype = "At risk of: The founder runs out";

  const fix = pickFix(state, pillars, truth, cheap, signText);
  const dial = pickDial(state);

  const flavors = state.chips.trust
    .map((id) => FLAVOR_MAP[id])
    .filter((x): x is string => Boolean(x));

  const personHeavy = (["r7q1", "r7q2", "r7q3"] as Qid[]).some(
    (id) => a[id] === "N" || a[id] === "V",
  );

  return {
    answered: answeredCount(state),
    pillars,
    base,
    truth,
    substanceGate: subGate,
    integration,
    accumulated,
    costly,
    cheap,
    coefficient: { text: coefText, cheapLine: cheap ? CHEAP_LINE : undefined },
    sign: { text: signText, note: signNote },
    outcome,
    archetype,
    fix,
    dial,
    flavors,
    background: state.chips.face === "background",
    marked,
    personHeavy,
    support: a.r7q3 === "N",
    missingPillars: missing.map((p) => p.name),
    tone: {
      base: baseTone(base.kind),
      coefficient: coefTone(coefText),
      sign: signTone(signText),
    },
  };
}

function pickFix(
  state: FrameworkState,
  pillars: PillarView[],
  truth: GateWord,
  cheap: boolean,
  signText: string,
): FixView {
  const hit = SYMPTOM_PRIORITY.find((id) => state.symptoms[id] === "me");
  if (hit) {
    const s = symptomById(hit);
    return {
      heading: "Fix this first",
      badge: "STOP",
      stop: true,
      title: s.name,
      text: s.todo,
    };
  }
  const weak = pillars.find((p) => p.state === "missing" || p.state === "vague");
  if (weak) {
    return {
      heading: "Fix this first",
      badge: weak.short,
      stop: false,
      title: weak.name + ".",
      text: VAGUE_WORK + " " + weak.line,
    };
  }
  if (truth !== "Passed") {
    return {
      heading: "Fix this first",
      badge: truth === "Failed" ? "STOP" : "Truth",
      stop: truth === "Failed",
      title: "Truth gate.",
      text: "Never show a number in public that you aren't prepared to stand behind when people start checking it.",
    };
  }
  if (cheap) {
    return {
      heading: "Fix this first",
      badge: "Honesty",
      stop: false,
      title: "Costly honesty.",
      text:
        CHEAP_LINE +
        " What can I honestly show or do that will cost me something in the moment — but prove that I'm on the customer's side?",
    };
  }
  if (signText === "At risk") {
    const s = symptomById("s5");
    return {
      heading: "Fix this first",
      badge: "Sign",
      stop: false,
      title: s.name,
      text: s.todo,
    };
  }
  const r7 = (["r7q1", "r7q2", "r7q3"] as Qid[]).some(
    (id) => state.answers[id] === "N" || state.answers[id] === "V",
  );
  if (r7) {
    const s = symptomById("s7");
    return {
      heading: "Fix this first",
      badge: "Person",
      stop: false,
      title: s.name,
      text: s.todo,
    };
  }
  const amps: { name: string; short: string; word: string; line: string }[] = [
    {
      name: "Integration",
      short: "Integration",
      word: ampWord(groupOf([state.answers.r2q4, state.answers.r2q5])),
      line: AMP_LINES.integration,
    },
    {
      name: "Accumulated distribution",
      short: "Audience",
      word: ampWord(groupOf([state.answers.r5q1])),
      line: AMP_LINES.accumulated,
    },
    {
      name: "Costly honesty",
      short: "Honesty",
      word: state.answers.r4q1 && state.answers.r4q2 && state.answers.r4q3 &&
        [state.answers.r4q1, state.answers.r4q2, state.answers.r4q3].every((x) => x !== "C")
        ? "The cheap kind"
        : ampWord(groupOf([state.answers.r4q1, state.answers.r4q2, state.answers.r4q3])),
      line: AMP_LINES.costly,
    },
  ];
  const rank = (w: string) =>
    w === "Absent" || w === "The cheap kind" ? 0 : w === "Forming" ? 1 : w === "Not answered" ? 2 : 3;
  let best = amps[0];
  for (const amp of amps) if (rank(amp.word) < rank(best.word)) best = amp;
  return {
    heading: "Build this next",
    badge: best.short,
    stop: false,
    title: "Build this next: " + best.name + ".",
    text: best.line,
  };
}

function pickDial(state: FrameworkState): DialView {
  if (state.symptoms.s6 === "me" || state.chips.dial === "map") {
    return {
      title: "Narrow the mechanics.",
      text: "Later, when your numbers become a map for competitors, narrow the mechanics while keeping the story, the lessons and the honesty. Ghost mode is a response to a specific risk, not a stage everyone reaches.",
    };
  }
  const q1 = state.answers.r6q1;
  const q2 = state.answers.r6q2;
  if (q1 === "V" || q1 === "N" || q2 === "V" || q2 === "N") {
    return {
      title: "Sort inspiration from mechanics.",
      text: "Story and lessons are safe to publish; the exact channel and tactic are a map for a competitor. Before you publish, ask: if a competitor read this tomorrow morning, would it cost me anything?",
    };
  }
  return {
    title: "Open wide.",
    text: "Early, when you have nothing to lose, open wide.",
  };
}

export function roundAnswered(state: FrameworkState, round: Round): { n: number; total: number } {
  const total = round.questions.length;
  const n = round.questions.filter((q) => state.answers[q.id] != null).length;
  return { n, total };
}

export function roundComplete(state: FrameworkState, round: Round): boolean {
  return round.questions.every((q) => state.answers[q.id] != null);
}

export function symptomsComplete(state: FrameworkState): boolean {
  return SIDS.every((id) => state.symptoms[id] != null);
}

const STORE_KEY = "bip-answers-v1";

export function loadState(): { state: FrameworkState; step: number } | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as {
      answers?: Partial<Record<Qid, Ans>>;
      symptoms?: Partial<Record<Sid, SymptomAns>>;
      chips?: Partial<Chips>;
      step?: number;
    };
    const state = emptyState();
    for (const id of QIDS) {
      const v = data.answers?.[id];
      if (v === "C" || v === "V" || v === "N") state.answers[id] = v;
    }
    for (const id of SIDS) {
      const v = data.symptoms?.[id];
      if (v === "me" || v === "not") state.symptoms[id] = v;
    }
    if (Array.isArray(data.chips?.trust)) {
      state.chips.trust = data.chips.trust.filter((id) => id in FLAVOR_MAP);
    }
    if (data.chips?.face === "public" || data.chips?.face === "background") {
      state.chips.face = data.chips.face;
    }
    if (data.chips?.dial === "magnet" || data.chips?.dial === "map") {
      state.chips.dial = data.chips.dial;
    }
    const step = typeof data.step === "number" ? data.step : 0;
    return { state, step };
  } catch {
    return null;
  }
}

export function saveState(state: FrameworkState, step: number) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({ answers: state.answers, symptoms: state.symptoms, chips: state.chips, step }));
  } catch {
    /* ignore quota */
  }
}

export function clearState() {
  try {
    localStorage.removeItem(STORE_KEY);
  } catch {
    /* ignore */
  }
}

/** Empty until the owner sets MailerLite env vars and points this at /api/subscribe. */
export const SUBSCRIBE_ENDPOINT = "";

export function emailPayload(state: FrameworkState, reading: Reading) {
  return {
    email: "",
    consent: true as const,
    archetype: reading.archetype,
    outcome: reading.outcome.text,
    base: reading.base.text,
    coefficient: reading.coefficient.text,
    sign: reading.sign.text,
    missingPillars: reading.missingPillars,
    symptoms: reading.marked.map((m) => m.name),
    flavor: reading.flavors,
  };
}
