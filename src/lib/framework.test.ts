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
});
