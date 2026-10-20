import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CHEAP_LINE,
  QIDS,
  SIDS,
  SYMPTOMS,
  TOTAL,
  emptyState,
  evaluate,
  type Ans,
  type FrameworkState,
  type Qid,
} from "./framework.ts";

function allClear(extra?: (s: FrameworkState) => void): FrameworkState {
  const s = emptyState();
  for (const id of QIDS) s.answers[id] = "C";
  extra?.(s);
  return s;
}

function setAns(s: FrameworkState, id: Qid, v: Ans) {
  s.answers[id] = v;
}

describe("Build in Public Framework ratings", () => {
  it("counts 24 questions and 7 symptoms", () => {
    assert.equal(QIDS.length, 24);
    assert.equal(SIDS.length, 7);
    assert.equal(TOTAL, 31);
    assert.equal(SYMPTOMS.length, 7);
  });

  it("(a) any base No answer makes Base zero and Outcome zero", () => {
    for (const id of ["r1q1", "r1q2", "r1q3", "r1q4", "r1q5"] as Qid[]) {
      const s = allClear();
      setAns(s, id, "N");
      const r = evaluate(s);
      assert.match(r.base.text, /^Zero — missing: /);
      assert.equal(r.outcome.text, "Zero — a loud, public, well-documented zero.");
    }
  });

  it("(b) truth-gate No answer turns the coefficient and outcome negative", () => {
    const s = allClear();
    setAns(s, "r3q1", "N");
    const r = evaluate(s);
    assert.equal(r.coefficient.text, "Negative — the truth gate is failing");
    assert.equal(r.outcome.text, "Negative — a lie multiplied by reach.");
    assert.equal(r.truth, "Failed");
  });

  it("(b2) symptom 2 marked fails the truth gate even if answers are clear", () => {
    const s = allClear();
    s.symptoms.s2 = "me";
    const r = evaluate(s);
    assert.equal(r.coefficient.text, "Negative — the truth gate is failing");
    assert.equal(r.outcome.text, "Negative — a lie multiplied by reach.");
    assert.equal(r.archetype, "The public lie");
    assert.equal(r.fix.badge, "STOP");
    assert.match(r.fix.text, /^Correct it now/);
  });

  it("(c) symptom 5 flips the sign", () => {
    const s = allClear();
    s.symptoms.s5 = "me";
    const r = evaluate(s);
    assert.equal(r.sign.text, "Negative");
    assert.equal(r.outcome.text, "Negative — the sign has flipped.");
    assert.equal(r.archetype, "The negative sign");
  });

  it("(d) truth failed and sign negative stays negative, never positive", () => {
    const s = allClear();
    setAns(s, "r3q1", "N");
    s.symptoms.s5 = "me";
    const r = evaluate(s);
    assert.match(r.outcome.text, /^Negative/);
    assert.notEqual(r.outcome.text, "Positive — multiplying what you've built.");
    assert.equal(r.outcome.text, "Negative — a lie multiplied by reach.");
  });

  it("(e) all clear, no symptoms, public face multiplies in the right direction", () => {
    const s = allClear((st) => {
      st.chips.face = "public";
    });
    const r = evaluate(s);
    assert.equal(r.base.text, "Complete");
    assert.equal(r.coefficient.text, "Very high · gates passed");
    assert.equal(r.sign.text, "Positive");
    assert.match(r.sign.note ?? "", /higher the ceiling/);
    assert.match(r.outcome.text, /^Positive/);
    assert.match(r.outcome.line, /all three parts are positive and large/);
    assert.equal(r.archetype, "Multiplying in the right direction");
    assert.equal(r.fix.heading, "Fix this first");
    assert.equal(r.fix.badge, "Order");
    assert.equal(r.fix.title, "Keep the order.");
    assert.match(r.fix.text, /^Base before publicity/);
    assert.equal(r.dial.title, "Open wide.");
    assert.equal(r.truth, "Passed");
    assert.equal(r.substanceGate, "Passed");
  });

  it("(f) no clear costly answer is the cheap kind", () => {
    for (const fill of ["V", "N"] as Ans[]) {
      const s = allClear();
      setAns(s, "r4q1", fill);
      setAns(s, "r4q2", "V");
      setAns(s, "r4q3", "N");
      const r = evaluate(s);
      assert.equal(r.costly, "The cheap kind");
      assert.equal(r.coefficient.cheapLine, CHEAP_LINE);
      assert.match(r.fix.text, /cheap kind/);
    }
  });

  it("(g) one vague base answer is next month's work, not transparency", () => {
    const s = allClear();
    setAns(s, "r1q4", "V");
    const r = evaluate(s);
    assert.match(r.base.text, /^Unproven — vague on: Monetization$/);
    assert.equal(
      r.outcome.text,
      "Not yet — that is your next month's work, not transparency.",
    );
  });

  it("each single symptom sets its archetype and verbatim what-to-do", () => {
    for (const symptom of SYMPTOMS) {
      const s = allClear();
      s.symptoms[symptom.id] = "me";
      const r = evaluate(s);
      assert.equal(r.archetype, symptom.name);
      assert.equal(r.fix.text, symptom.todo);
      assert.equal(r.fix.badge, "STOP");
    }
  });

  it("symptom priority is public lie before empty publicity", () => {
    const s = allClear();
    s.symptoms.s1 = "me";
    s.symptoms.s2 = "me";
    const r = evaluate(s);
    assert.equal(r.archetype, "The public lie");
  });

  it("background face is less exposed and can still be a positive outcome", () => {
    const s = allClear((st) => {
      st.chips.face = "background";
    });
    const r = evaluate(s);
    assert.match(r.sign.text, /^Less exposed/);
    assert.match(r.outcome.text, /^Positive/);
  });

  it("market vague risks the love trap; distribution vague risks going nowhere", () => {
    const market = allClear();
    setAns(market, "r1q2", "V");
    assert.equal(evaluate(market).archetype, "At risk of: The Love Trap");

    const dist = allClear();
    setAns(dist, "r1q5", "V");
    assert.equal(evaluate(dist).archetype, "At risk of: Honest, and going nowhere");
  });

  it("map chip without a clear dial answer risks an eroded moat", () => {
    const s = allClear((st) => {
      st.chips.dial = "map";
    });
    setAns(s, "r6q1", "V");
    assert.equal(evaluate(s).archetype, "At risk of: Eroded moat");
    assert.equal(evaluate(s).dial.title, "Narrow the mechanics.");
  });

  it("a No answer on the person round risks the founder running out", () => {
    const s = allClear();
    setAns(s, "r7q2", "N");
    const r = evaluate(s);
    assert.equal(r.archetype, "At risk of: The founder runs out");
    assert.match(r.fix.text, /rhythm you can hold for a year/);
  });

  it("does not invent a numeric multiplier", () => {
    const r = evaluate(allClear());
    const blob = JSON.stringify(r);
    assert.doesNotMatch(blob, /\b\d+(\.\d+)?x\b/i);
    assert.doesNotMatch(blob, /%/);
    assert.doesNotMatch(blob, /\$/);
  });

  it("a vague sign with a public face is at risk, never positive", () => {
    const s = allClear((st) => {
      st.chips.face = "public";
    });
    setAns(s, "r5q2", "V");
    const r = evaluate(s);
    assert.equal(r.sign.text, "At risk");
    assert.equal(r.outcome.text, "At risk — the sign could still flip.");
    assert.match(r.outcome.line, /conduct decides/);
    assert.equal(r.archetype, "At risk of: The negative sign");
    assert.equal(r.fix.heading, "Fix this first");
    assert.equal(r.fix.title, "The negative sign");
    assert.notEqual(r.outcome.text, "Positive — multiplying what you've built.");
  });

  it("symptom 3 weakens an in-place distribution pillar", () => {
    const s = allClear();
    s.symptoms.s3 = "me";
    const r = evaluate(s);
    assert.equal(r.pillars[3].word, "Vague");
    assert.equal(r.base.text, "Unproven — vague on: Distribution");
    assert.equal(r.outcome.text, "Not yet — that is your next month's work, not transparency.");
    assert.equal(r.archetype, "Honest, and going nowhere");
    assert.equal(r.fix.badge, "STOP");
  });

  it("symptom 4 weakens an in-place paying market", () => {
    const s = allClear();
    s.symptoms.s4 = "me";
    const r = evaluate(s);
    assert.equal(r.pillars[1].word, "Vague");
    assert.equal(r.base.text, "Unproven — vague on: A market that pays");
    assert.equal(r.outcome.text, "Not yet — that is your next month's work, not transparency.");
    assert.equal(r.archetype, "The Love Trap");
  });

  it("a missing pillar stays missing when the matching symptom is marked", () => {
    const s = allClear();
    setAns(s, "r1q5", "N");
    s.symptoms.s3 = "me";
    const r = evaluate(s);
    assert.equal(r.pillars[3].word, "Missing");
    assert.match(r.base.text, /^Zero — missing: Distribution$/);
  });

  it("a vague pillar recommendation capitalises the pillar line", () => {
    const s = allClear();
    setAns(s, "r1q1", "V");
    const r = evaluate(s);
    assert.equal(r.fix.title, "Substance.");
    assert.equal(
      r.fix.text,
      "Real value that solves a real problem. Missing it, the multiplier inflates emptiness. If any of these answers is vague, that is your next month's work — not transparency.",
    );
  });

  it("a forming amplifier is named once, with a capitalised line", () => {
    const s = allClear();
    setAns(s, "r2q4", "V");
    const r = evaluate(s);
    assert.equal(r.fix.heading, "Build this next");
    assert.equal(r.fix.title, "Integration.");
    assert.match(r.fix.text, /^Openness woven into the product/);
    assert.doesNotMatch(r.fix.title, /Build this next/);
  });

  it("v0.3 titles follow the outcome when no at-risk rule matches", () => {
    const monetizationMissing = allClear();
    setAns(monetizationMissing, "r1q4", "N");
    const missing = evaluate(monetizationMissing);
    assert.equal(missing.outcome.text, "Zero — a loud, public, well-documented zero.");
    assert.equal(missing.archetype, "Not multiplying yet");

    const monetizationVague = allClear();
    setAns(monetizationVague, "r1q4", "V");
    const vague = evaluate(monetizationVague);
    assert.match(vague.outcome.text, /^Not yet/);
    assert.equal(vague.archetype, "Not multiplying yet");

    const substanceVague = allClear();
    setAns(substanceVague, "r1q1", "V");
    assert.equal(evaluate(substanceVague).archetype, "At risk of: Empty publicity");

    const substanceMissing = allClear();
    setAns(substanceMissing, "r1q1", "N");
    assert.equal(evaluate(substanceMissing).archetype, "At risk of: Empty publicity");

    const onlySubstance = emptyState();
    setAns(onlySubstance, "r1q1", "C");
    const partial = evaluate(onlySubstance);
    assert.match(partial.outcome.text, /^Unclear/);
    assert.equal(partial.archetype, "Your reading is still forming");

    const signVague = allClear();
    setAns(signVague, "r5q2", "V");
    assert.equal(signVague.chips.face, null);
    const flipped = evaluate(signVague);
    assert.equal(flipped.sign.text, "At risk");
    assert.equal(flipped.outcome.text, "At risk — the sign could still flip.");
    assert.equal(flipped.archetype, "At risk of: The negative sign");

    const samples = [
      allClear((st) => {
        st.chips.face = "public";
      }),
      monetizationMissing,
      monetizationVague,
      substanceVague,
      onlySubstance,
      signVague,
      emptyState(),
    ];
    for (const sample of samples) {
      const reading = evaluate(sample);
      if (reading.archetype === "Multiplying in the right direction") {
        assert.match(reading.outcome.text, /^Positive/);
      }
    }
    const positive = evaluate(
      allClear((st) => {
        st.chips.face = "public";
      }),
    );
    assert.match(positive.outcome.text, /^Positive/);
    assert.equal(positive.archetype, "Multiplying in the right direction");
  });
});
