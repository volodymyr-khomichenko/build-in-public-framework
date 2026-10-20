# Build in Public Framework scorecard: spec + Grok prompt

Prepared 20.10.2026 (Kyiv, UTC+3). This is the brief for a new Grok project that builds the scorecard web app.

- **Part 1** is the spec, for review.
- **Part 2** is the ready-to-paste prompt. It is self-contained and repeats everything the builder needs.
- **Sources:**
  - `sources/book-reference-sections-verbatim.md`: book pp. 118–126, the Transparency Audit, the Anti-Patterns and the Casebook format;
  - `sources/book-passport.md`;
  - the live reference app https://revenue-multiplier-framework.khomichenko.com/ (v0.16), whose HTML/CSS I inspected 20.10.2026.
- **Labels used in this file:**
  - **[BOOK p.N]** = verbatim from the book;
  - **[DECISION]** = decided 20.10.2026;
  - **[DESIGN]** = my design choice.

---

## PART 1 — SPEC

### 1. Product
- **Name:** Build in Public Framework
- **Subdomain:** build-in-public-framework.khomichenko.com, a Vercel project in the same style as `revenue-multiplier-framework`
- **Build:** single static page, one `index.html` with inline CSS and JS, no framework or build step
- **Optional extras:** `api/subscribe.js` (Vercel serverless) for MailerLite, and `og.png`
- **Audience:** founders and makers deciding how much of their business to build in the open; secondarily, the marketers and operators who advise them [passport]
- **Promise:** "What is your openness actually multiplying — and in which direction?" [BOOK p.13/118]
- **Must not show any number, multiplier, score or "return"**:
  - "It does not measure magnitude. Every 'how much' question … is unanswered, and the book says so." [passport]
  - Ratings are words, Casebook style [DECISION 2].
  - The only numbers allowed are progress counts (e.g. "12/31 answered").

### 2. Look and feel: copy the reference app exactly
Taken from the reference app's CSS:
- **Fonts:** Google Fonts **Fraunces** (serif headings: opsz 9..144, wght 400/500/600), **Inter** (UI: 400–800), **Space Mono** (labels and mono: 400/700)
- **CSS variables:** `--ink:#141922; --muted:#616b7a; --line:#e3e7ec; --paper:#eef1f5; --card:#ffffff; --blue:#2563eb; --blue-bright:#5b8bff; --gray-mark:#c3cbd6; --warn:#3a4150`
- **Layout:**
  - `.wrap` max-width 1120px;
  - top **book banner** card (radius 14px) with a serif glyph on the left and the text "This is the framework from the book **"Build in Public"** by Volodymyr Khomichenko. To understand the full logic behind your result, I recommend reading the book. **About the book →**", linking to https://khomichenko.com/build-in-public;
  - eyebrow "**×** The Framework" (11px, 0.2em tracking, uppercase, blue);
  - H1 serif (clamp 24–36px) with one word in italic blue;
  - subhead in muted 15px;
  - two-column `.stage` (0.94fr / 1.06fr) with a sticky left column of 2 cards (radius 22px) and a right column of pill **tabs** above a **panel card**;
  - **footer** with a top border, left "Build in Public Framework · <span class=tag>v0.1</span>" and right "Build in Public — Volodymyr Khomichenko".
- **Components to reuse (same class styling):**
  - tabs: pill shape; active = ink background; result tab = blue outline; a dot when a round is complete;
  - step eyebrow "Round **n** of N" plus an answered-count pill;
  - serif `.block-name` heading with a small badge, and a `.block-mean` explainer;
  - question rows `.q` with a bottom divider;
  - the toggle group (here **3 buttons**);
  - nav "← Back" (ghost) / "Next →" (ink) / final "See my reading →" (primary blue);
  - result: `.final-arche` eyebrow, serif `.final-title`, `.final-line`, a `.disclaimer` box, `.recs` with a `.rec-badge` ("STOP" in `--warn`), a "Read the full analysis ↓" expandable section, `.email-cta` box, and "← Edit answers".
- **Breakpoints (same as reference):**
  - ≤840px: one column, left column becomes static;
  - ≤520px: compact padding, question rows stack, buttons go full-width, tabs bleed to the edges.
- **Embed auto-height:** same as the reference. If inside an iframe, `postMessage({type:"bip-framework-height", height})` on resize, on load and every 700ms.
- **Book glyph:** the reference uses "×". Keep "×" for family resemblance [DECISION 6].

**Left column (replaces the reference's "shapes + multiplier" cards) [DESIGN]:**
- **Card 1, "Your formula":** three tiles in a row, "Base × Coefficient × Sign".
  - Each tile shows its current word rating (see §5), styled blue (positive/in place), gray (`--gray-mark`, not yet / unknown) or dark `--warn` (zero/negative).
  - Under Base: four small pillar chips (Substance · Market that pays · Monetization · Distribution) coloured the same way.
  - Progress bar plus "**n**/31 answered" and "Tap a tile to jump".
- **Card 2, "Outcome":** the live Outcome phrase (see §5) in a serif title, plus one muted line.
  - Before any answers: "Answer the rounds — the reading builds as you go."
  - Never a number.

### 3. Flow
**Answer scale** [DECISION 1]: every question has three buttons, **Clear answer** · **Vague** · **No answer**.
- Clicking the selected button again clears it (same as the reference).
- Rationale: the audit says "Write the answers down; the vague ones are the diagnosis." [BOOK p.125]
- Where a question's wording needs interpreting, show a small muted helper line under it (given below). Helpers are [DESIGN].

**Round intro line** (shown under the round title): "Answer honestly. You don't need to type anything — but if you can't say it in a sentence, choose *Vague*."

**Total:** 24 questions in 7 rounds + 7 symptoms = **31** answers.

**Round 1 — Is there a base?** (tab "Base") [BOOK p.125, Part one]
1. What specific problem do I solve, and for whom — in one sentence, without adjectives? → pillar **Substance**
2. Who has already paid me for it? If nobody, who pays for something comparable today? → pillar **A market that pays**
3. Is this a market that structurally pays, or one that expects things like mine to be free? What is the free alternative my customer would reach for first? → pillar **A market that pays**. Helper: "Clear answer = you know it structurally pays, and you can name the free alternative."
4. How do I collect the money, and is the price right for the customer I actually want? What kind of customer does my current price attract? → pillar **Monetization**
5. If I published nothing for six months, how would anyone new find me? Name the mechanism, not the hope. → pillar **Distribution**

Round explainer (`.block-mean`): "A viable business stands on four things. Transparency acts on them; it never replaces them." [BOOK p.118]

**Round 2 — Which openness fits me?** (tab "Openness") [BOOK p.125, Part two]
1. Where does trust live in my business: in numbers, in code, in expertise, in my personality, or in how the company behaves?
   - Extra **optional** chips, multi-select: Numbers · Code · Expertise · My personality · How the company behaves.
2. Am I willing to be a public face for years — or would I rather the company be open while I stay in the background?
   - Extra **optional** chips, single-select: Public face · Background.
3. Where is the conversation about my problem already happening, and would I read there even if I never published?
4. What can I give away for free that would make someone more likely, rather than less likely, to pay me? → feeds the amplifier **Integration**
5. **[Added, from Chapter 8]** Can I make openness a part of the product itself or the channel itself, rather than an add-on off to the side? → feeds **Integration**. Small label "From Chapter 8". Source: [BOOK pp.47–48]: "The question is deeper: can I make openness a part of the product itself or the channel itself, rather than an add-on off to the side?"

Round explainer: "The right flavor is the one that grows naturally out of your business, your source of trust, and your nature." [BOOK p.73]

**Round 3 — The gates** (tab "Gates") [BOOK p.126, Part three]
1. Is every number I plan to publish one I would stand behind if a journalist, a former employee and a customer all checked it? → **Truth gate**
2. Am I presenting a peak as if it were typical, or a pilot as if it were a partnership? → **Truth gate**. Helper: "Clear answer = you can say plainly that you are not."
3. Is there something real underneath this, or am I about to amplify a hope? → **Substance gate**. Helper: "Clear answer = you can name what's real underneath."

Explainer: "A gate is a yes-or-no condition: pass it, and the multiplier can work for you; fail it, and no amount of shine will save you." [BOOK p.35]

**Round 4 — The costly question** (tab "Costly") [BOOK p.126, Part four] → amplifier **Costly honesty**
1. What could I honestly say or do that would cost me something in the short term — and prove to a customer that I'm on their side?
2. What flaw in my own product would I rather a competitor didn't name first?
3. When did I last tell a customer not to buy something?

Explainer: "Openness against your own interest is the one trust signal a liar cannot copy." [passport]

**Round 5 — Before you launch & the sign** (tab "Audience & sign"), the two added questions [DECISION 3]. Label: "From the chapters". The UI must show these are not part of the book's audit.
1. What am I accumulating today that will one day make my launch instant? → amplifier **Accumulated distribution**.
   - Source: [BOOK p.52, Ch. 9]: 'Not "how do I go off," but "what am I accumulating today that will one day make my launch instant."'
   - Helper: "Clear answer = you can name the audience, trust or reputation already in place — built over years or carried over from a previous project."
2. Am I prepared to hold a public persona that adds rather than subtracts? → **Sign**.
   - Source: [BOOK p.19, Ch. 2]: "And am I prepared to hold a public persona that adds rather than subtracts?"

Explainer: "Accumulated distribution — the audience, trust and reputation gathered before you launch. … When you are the channel, your conduct decides whether the whole equation comes out positive or negative." [BOOK p.119]

**Round 6 — The dial** (tab "Dial") [BOOK p.126, Part five]
1. If a competitor read everything I published this month, what could they take and use tomorrow?
2. Which of my disclosures is inspiration — my story, my lessons, my reasoning — and which is mechanics: the exact channel, the tactic, the niche?
3. Have my numbers become large enough to be a map rather than a magnet?
   - Extra optional chips: "Still a magnet" · "Now a map".

Explainer: "Openness is not a switch set to maximum." [BOOK p.120]

**Round 7 — The person** (tab "Person") [BOOK p.126, Part six]
1. What rhythm can I honestly hold for a year — not a week, not a month?
2. Who in my life doesn't need me to be content?
3. Am I sharing this from the scar or from the open wound? Helper: "Clear answer = from the scar."

Explainer: "Everything in this book requires you to still be there when the compounding starts." [BOOK p.124]

**Final round — Symptoms** (tab "⚑ Symptoms") [BOOK pp.121–124, Anti-Patterns]
- Heading: "What are you experiencing?" Sub: "Seven ways this goes wrong, arranged by symptom. Find what you're experiencing, then read what's actually broken."
- Two buttons per row: **That's me** (⚑, `--warn` when on) / **Not me**.
- Symptom texts, verbatim:
  1. Attention is growing, conversations are happening, investors are interested — and sales aren't moving.
  2. A number you published once is no longer quite true, and correcting it now would be awkward.
  3. The product is good, the people who use it love it, you're open about everything — and growth is flat.
  4. The community is growing, the messages are warm, people say they'd be lost without you — and revenue doesn't move.
  5. The product hasn't changed, the numbers were fine, and people are quietly leaving anyway.
  6. Clones of your product, your pricing, or your exact tactic appear within weeks of your posting about them.
  7. The metrics are fine and you can't make yourself post. Comparison stings. Criticism lingers for days.
- Primary button: "See my reading →".

The result can be opened at any time from the "★ Result" tab, same as the reference. Unanswered questions count as unknown.

### 4. Answer values [DESIGN]
- Values: `clear` = C, `vague` = V, `none` (No answer) = N, unanswered = U.
- **Item state:** C → ok · V → vague · N → missing · U → unknown.
- **Group state** (pillar, gate or amplifier, over its items):
  - any N → **missing**;
  - else any V → **vague**;
  - else any U → **unknown**;
  - else all C → **in place**.

### 5. Ratings (words only) and the book's rules

**Pillars** (Base):
- Substance = R1Q1
- A market that pays = R1Q2 + R1Q3
- Monetization = R1Q4
- Distribution = R1Q5
- Words: in place → "In place" · vague → "Vague" · missing → "Missing" · unknown → "Not answered"

**Base** — rule [BOOK p.119]: "If any pillar is zero, the outcome is zero".
- any pillar missing → **"Zero — missing: <pillar names>"**
- else any vague → **"Unproven — vague on: <pillar names>"**. Book: "If any of these answers is vague, that is your next month's work — not transparency." [p.125]
- else any unknown → **"Incomplete"**
- else → **"Complete"**. Casebook uses "Complete" [p.130 etc.]

**Gates:**
- Truth gate (R3Q1 + R3Q2 + symptom 2):
  - symptom 2 = That's me, or any N → **Failed**
  - V → **Unchecked**
  - all C → **Passed**
- Substance gate (R3Q3 + Substance pillar + symptom 1):
  - symptom 1 = That's me, or R3Q3 = N, or Substance pillar = missing → **Failed**
  - V → **Unchecked**
  - C → **Passed**

**Amplifiers:**
- Integration = R2Q4 + R2Q5
- Accumulated distribution = R5Q1
- Costly honesty = R4Q1–3, with a special rule: if **none** of the three is C → **"The cheap kind"**. [BOOK p.126] "If you have no answer to any of these three, your transparency is currently the cheap kind."
- Amplifier words: in place → "Present" · vague → "Forming" · missing → "Absent"

**Coefficient** (word):
- Truth gate Failed → **"Negative — the truth gate is failing"** (book: "the coefficient has turned negative and is compounding" [p.121])
- else Substance gate Failed → **"Nothing to multiply — the substance gate is failing"**
- else, by the count of amplifiers that are Present:
  - 3 → **"Very high"**
  - 2 → **"High"**
  - 1 → **"Moderate"**
  - 0 → **"Low"**
  - append " · gates passed" if both gates Passed, or " · gates unchecked" otherwise
  - if Costly honesty = "The cheap kind", add the line "Your transparency is currently the cheap kind." [BOOK p.126]
- These words are the Casebook's own vocabulary ("Very high", "High", "Moderate") [Casebook pp.127–183]. Mapping counts to words is [DESIGN].
- Always show the boundary line under Coefficient: "The coefficient acts on trust, reach and adoption — never on a market's willingness to pay." [BOOK p.119]

**Sign:**
- symptom 5 = That's me → **"Negative"**
- else if R2Q2 chip = Background → **"Less exposed — your openness doesn't run through one persona"** [DESIGN wording]. Basis: Casebook GitLab: "When transparency is institutional, the company does not ride on one person's mood." [p.149]
- else, by R5Q2: C → **"Positive"** · V or N → **"At risk"** · U → **"Not answered"**
- Note under Sign when Public face is chosen: "The more the company fuses with you, the higher the ceiling and the lower the floor." [BOOK p.120]

**Outcome** — evaluate in this order; first match wins. Rule from the book: "two failures don't cancel into a success. Either one alone is enough to turn the outcome against you." [p.17–18] Never let two negatives produce a positive.
1. Truth gate Failed → **"Negative — a lie multiplied by reach."** Line: "A lie multiplied by reach detonates in proportion to the trust it built." [p.119]
2. Sign Negative → **"Negative — the sign has flipped."** Line: "A polarizing persona can flip a strong base and a powerful coefficient into decline, without a single thing changing about the product." [p.119–120]
3. Base Zero or Substance gate Failed → **"Zero — a loud, public, well-documented zero."** [p.119]
4. Base Unproven → **"Not yet — that is your next month's work, not transparency."** [p.125]
5. Anything Not answered / Incomplete / Unchecked → **"Unclear — answer the remaining questions."**
6. Otherwise (Base Complete, gates Passed, Sign Positive or Less exposed) → **"Positive — multiplying what you've built."** Line: "In the winners, all three parts are positive and large." [p.18]
   - If the coefficient is Low or The cheap kind, append: "The base is there; the coefficient is still small."

### 6. Result screen
Same layout as the reference result card.

1. **Eyebrow:** "Your reading · Base × Coefficient × Sign"
2. **Title = archetype**, chosen in this priority order:
   - **Symptom-based** (if any symptom = That's me; first match in the order 2, 1, 5, 4, 3, 6, 7): the anti-pattern name verbatim — "The public lie" · "Empty publicity" · "The negative sign" · "The Love Trap" · "Honest, and going nowhere" · "Eroded moat" · "The founder runs out".
   - **Else answer-based "risk of" archetype** [DESIGN]:
     - Truth gate Failed → "At risk of: The public lie"
     - Substance Missing or Substance gate Failed → "At risk of: Empty publicity"
     - Market that pays Missing/Vague → "At risk of: The Love Trap"
     - Distribution Missing/Vague → "At risk of: Honest, and going nowhere"
     - Sign At risk while Public face is chosen → "At risk of: The negative sign"
     - R6Q3 chip = "Now a map" and R6Q1/R6Q2 not C → "At risk of: Eroded moat"
     - any R7 = N → "At risk of: The founder runs out"
   - **Else** → "Multiplying in the right direction" [DESIGN].
3. **Line:** the Outcome phrase plus its line.
4. **Disclaimer box:** "A lens for your own decision, not a prescription — and not a measurement. The book does not answer 'how much', and neither does this." [BOOK p.11 + passport]
5. **"Fix this first"** (one item, `.rec`; badge "STOP" if the reason is a symptom or a failed gate, otherwise the badge shows the pillar or area short name). Pick the first that applies, following the book's order "base before publicity, truth before reach, patience before scale, and a persona you can hold for a decade" [p.82]:
   - **a)** any symptom = That's me (same priority as the archetype) → name + "What to do" verbatim:
     1. Empty publicity — "Stop asking whether people are talking about you and ask whether anyone is buying. If the answer is no, fix that before publishing anything else."
     2. The public lie — "Correct it now, publicly and plainly. The cost today is a fraction of the cost later."
     3. Honest, and going nowhere — "Treat distribution as a separate job with its own hours, not as something that happens after the product is ready."
     4. The Love Trap — "Run the two columns separately. Not 'how many people love this' but 'how many paid, and how many paid again.' If the second column stays empty while the first fills, you are in the wrong market, not the wrong marketing."
     5. The negative sign — "Separate your worst impulses from your channel. When you most want to hit send, wait an hour. Consider how much of the company should be attached to you at all."
     6. Eroded moat — "Separate inspiration from mechanics. Keep giving away the story, the lessons and the why. Be careful with the exact channel, the precise tactic and the profitable niche. And say plainly that you're narrowing — an audience forgives the change and doesn't forgive being quietly dropped."
     7. The founder runs out — "Set a rhythm you can hold for a year, not a week. Keep a circle of people off-screen who don't need you to be content. Share from the scar, not the open wound. And if the weight is genuinely heavy, treat that as a signal to stop and get real support — that isn't a break in the plan, it is the plan."
   - **b)** Base pillar Missing or Vague (first in the order Substance, Market, Monetization, Distribution) → "<Pillar>." + "If any of these answers is vague, that is your next month's work — not transparency." [p.125] + the pillar's line from p.118–119:
     - Substance: "real value that solves a real problem. Missing it, the multiplier inflates emptiness."
     - A market that pays: "not an audience that loves you, but people structurally willing to hand over money."
     - Monetization: "a working way to collect that money. Same product, same market, wrong price, no business."
     - Distribution: "a path by which people find out you exist."
   - **c)** Truth gate not Passed → "Truth gate." + "Never show a number in public that you aren't prepared to stand behind when people start checking it." [p.42]
   - **d)** Costly honesty = The cheap kind → "Costly honesty." + "Your transparency is currently the cheap kind." + "What can I honestly show or do that will cost me something in the moment — but prove that I'm on the customer's side?" [p.57]
   - **e)** Sign At risk → anti-pattern 5's What to do.
   - **f)** any R7 = N/V → anti-pattern 7's What to do.
   - **g)** else → "Build this next:" the weakest amplifier with its p.119 line.
6. **"The dial"** advice (one `.rec`, always shown) [BOOK p.120, Ch.14]:
   - symptom 6 = That's me, or R6Q3 chip "Now a map" → **"Narrow the mechanics."** "Later, when your numbers become a map for competitors, narrow the mechanics while keeping the story, the lessons and the honesty." + "Ghost mode is a response to a specific risk, not a stage everyone reaches." (passport)
   - else if R6Q1 or R6Q2 = V/N → **"Sort inspiration from mechanics."** "Story and lessons are safe to publish; the exact channel and tactic are a map for a competitor." (passport) + test: "if a competitor read this tomorrow morning, would it cost me anything?" [p.76]
   - else → **"Open wide."** "Early, when you have nothing to lose, open wide." [p.120]
7. **"Read the full analysis ↓"** (expandable):
   - **"The formula applied to you"**: four Casebook-style lines, bold label then text, as in the Casebook [p.128]:
     - **Base.** <rating> + pillar list with states
     - **Coefficient.** <rating>; gates: Truth <state>, Substance <state>; amplifiers: Integration <Present/Forming/Absent>, Accumulated distribution <…>, Costly honesty <…>; boundary line
     - **Sign.** <rating> (+ note)
     - **Outcome.** <phrase>
   - **"Your flavor"** (if R2Q1/R2Q2 chips were chosen), mapped from Ch.13 [DESIGN mapping; flavor names from passport]:
     - Numbers → open metrics
     - Code → open source
     - Expertise → teaching
     - My personality → solo narration
     - How the company behaves → public philosophy / institutional honesty
     - Background chosen → also add the line "the open-source and institutional flavors exist precisely so that the company can be transparent while you stay in the background." [p.72–73]
     - Line: "These flavors aren't mutually exclusive — the strongest founders often blend two or three." [p.73]
   - **"Symptoms you marked"**: each with its "What's broken" verbatim [pp.121–124].
   - **"The person"**: if any R7 = N/V, show anti-pattern 7's What to do. If R7Q3 = N, add the line "If the emotional weight of being public becomes genuinely heavy … stop and lean on real support, including professional support." [p.98] Keep the tone calm.
   - **Email box** (§8).
8. **CTA row** (`.final-cta`):
   - primary "Get the book" → https://khomichenko.com/build-in-public
   - ghost "Listen to half the book free" → https://youtu.be/VFHsPbn17bM (new tab)
   - ghost "← Edit answers"

### 7. Copy (top of page)
- `<title>`: "Build in Public Framework — What is your openness actually multiplying?"
- Meta description: "The framework from the book "Build in Public" by Volodymyr Khomichenko. Answer the book's Transparency Audit and see your Base, Coefficient and Sign — in words, the way the book reads every founder."
- OG: title "Build in Public Framework"; url https://build-in-public-framework.khomichenko.com/; image `/og.png` (1200×630, generate a simple card in the palette: "Base × Coefficient × Sign").
- Eyebrow: "× The Framework"
- H1: "What is your openness actually *multiplying*?"
- Subhead: "Six parts of the book's **Transparency Audit**, two questions from the chapters, then the **symptoms**. Answer *Clear*, *Vague* or *No answer* — the vague ones are the diagnosis."

### 8. Email result form ⚠ placeholder, not live
- Same UI as the reference: title "Want this reading in your inbox?", sub "We'll email your Base, Coefficient and Sign and the chapters to read next."
- Email input, consent checkbox: "I agree to receive this analysis and occasional updates about *Build in Public*. Unsubscribe anytime."
- Button disabled until the email is valid and the box is ticked.
- `const SUBSCRIBE_ENDPOINT = "";` → **demo mode**: show success and "(Demo mode — connect MailerLite to send for real.)". Nothing is sent and no third-party calls are made.
- Optional `api/subscribe.js` (Vercel Node function):
  - POST JSON → MailerLite API `POST https://connect.mailerlite.com/api/subscribers` with `Authorization: Bearer ${process.env.MAILERLITE_API_KEY}`, `groups:[process.env.MAILERLITE_GROUP_ID]`, `fields` (archetype, outcome, base, coefficient, sign);
  - validate the email server-side; return 200/4xx;
  - never expose the key client-side.
  - ⚠ Flag: API key, group and field names must be set up by the owner. The reference app also still runs in demo mode.
- Payload: `{email, consent:true, archetype, outcome, base, coefficient, sign, missingPillars:[…], symptoms:[…], flavor:[…]}`

### 9. Accessibility and quality
- **Answer buttons:** each question's three buttons are a `role="radiogroup"` with `aria-label` = question text. Buttons are `role="radio"` with `aria-checked`, arrow-key navigation, visible `:focus-visible` outline (2px blue, as in the reference), and min height 46px (touch).
- **Live updates:** formula tiles and Outcome have `aria-live="polite"`. Colour is never the only signal (each tile shows a word).
- **Tabs:** `role="tablist"`/`tab` with `aria-selected`. Focus moves to the panel heading on step change.
- **Contrast and motion:** contrast ≥ WCAG AA for muted text on paper (#616b7a on #eef1f5 passes). Respect `prefers-reduced-motion`.
- **Language and behaviour:**
  - `lang="en"`;
  - works without the network after load (fonts may fall back);
  - no tracking scripts;
  - state in memory only (optional: `localStorage` "bip-answers-v1" with a "Start over" link).
- **Performance:** single file < 120 KB excluding fonts. Lighthouse a11y ≥ 95 and performance ≥ 90 on mobile.

### 10. Deploy (same as the reference)
- **Repo:** static `index.html` at root, `og.png`, optional `api/subscribe.js`, `vercel.json` not required.
- **Vercel:** project `build-in-public-framework`, so it's also reachable at build-in-public-framework.vercel.app.
- **Domain:** custom domain `build-in-public-framework.khomichenko.com` (CNAME `cname.vercel-dns.com`, set by the domain owner).
- **Version label** in the footer starts at `v0.1` and is bumped on each release.

### 11. Acceptance checklist
- [ ] Visual match with revenue-multiplier-framework.khomichenko.com: same fonts, palette, banner, eyebrow, H1 style, two columns, tabs, cards, buttons, footer with version tag. Side-by-side screenshots at 1280px and 390px.
- [ ] Banner "About the book →" and the "Get the book" CTA open https://khomichenko.com/build-in-public. "Listen to half the book free" opens https://youtu.be/VFHsPbn17bM.
- [ ] 7 rounds with exactly 5+5+3+3+2+3+3 = 24 questions plus 7 symptoms. Question and symptom texts match this spec character-for-character. The two "From the chapters" questions and the Chapter 8 question are labelled as such.
- [ ] Every question has exactly three options: Clear answer / Vague / No answer. Re-clicking clears.
- [ ] No number, score, multiplier, percentage or currency appears anywhere except "n/31 answered".
- [ ] Rule tests:
  - (a) any Base question = No answer → Base "Zero…", Outcome "Zero — a loud, public, well-documented zero."
  - (b) truth-gate question = No answer, or symptom 2 = That's me → Coefficient "Negative…", Outcome "Negative — a lie multiplied by reach.", even if everything else is Clear.
  - (c) symptom 5 → Sign "Negative", Outcome "Negative — the sign has flipped."
  - (d) truth gate failed AND sign negative → still Negative (never positive).
  - (e) all Clear, no symptoms, Public face → Base Complete, Coefficient "Very high · gates passed", Sign Positive, Outcome Positive, archetype "Multiplying in the right direction", dial "Open wide".
  - (f) all three costly questions ≠ Clear → "The cheap kind" line shown.
  - (g) one Base question Vague → Outcome "Not yet — that is your next month's work, not transparency."
- [ ] Each symptom produces its archetype and its verbatim "What to do" in Fix this first. Priority order is respected.
- [ ] The four cautionary cases are never named. The app shouldn't mention any case names at all.
- [ ] Email form is disabled until valid email + consent. With an empty endpoint it shows demo mode and makes no network request.
- [ ] Keyboard-only run-through possible. Screen reader announces question, options and state. Focus is visible.
- [ ] Mobile 360–390px: no horizontal scroll (except tabs), buttons full width, readable.
- [ ] Embedded in an iframe, it posts its height (`bip-framework-height`).
- [ ] Footer: "Build in Public Framework · v0.1" | "Build in Public — Volodymyr Khomichenko".

---

## PART 2 — READY-TO-PASTE PROMPT FOR GROK

```
You are building a single-page web app: "Build in Public Framework", a scorecard for the book "Build in Public" by Volodymyr Khomichenko. Deliver: index.html (all CSS and JS inline, no frameworks, no build step), og.png (1200×630), and an optional api/subscribe.js (Vercel serverless). It will be deployed on Vercel as project "build-in-public-framework" with the custom domain build-in-public-framework.khomichenko.com.

1) MATCH THE EXISTING SISTER APP
Open https://revenue-multiplier-framework.khomichenko.com/ and match its look, feel and UX exactly (it is the scorecard for the author's previous book). Concretely:
- Google Fonts: Fraunces (opsz 9..144, wght 400;500;600) for headings, Inter (400–800) for UI, Space Mono (400;700) for small mono labels.
- CSS variables: --ink:#141922; --muted:#616b7a; --line:#e3e7ec; --paper:#eef1f5; --card:#ffffff; --blue:#2563eb; --blue-bright:#5b8bff; --gray-mark:#c3cbd6; --warn:#3a4150. Page background --paper.
- .wrap max-width 1120px. Top "book banner" card (radius 14px, serif "×" glyph in blue): This is the framework from the book <b>"Build in Public"</b> by Volodymyr Khomichenko. To understand the full logic behind your result, I recommend reading the book. <a href="https://khomichenko.com/build-in-public">About the book →</a>
- Eyebrow "× The Framework" (11px, letter-spacing .2em, uppercase, blue). H1 in Fraunces 500, clamp(24px,3.3vw,36px): What is your openness actually <em>multiplying</em>? (em = italic blue). Subhead (muted, 15px): Six parts of the book's <b>Transparency Audit</b>, two questions from the chapters, then the <b>symptoms</b>. Answer <i>Clear</i>, <i>Vague</i> or <i>No answer</i> — the vague ones are the diagnosis.
- Two-column stage (0.94fr / 1.06fr); left column sticky with two white cards (radius 22px, soft shadow); right column: horizontally scrolling pill tabs above a panel card (radius 22px). Same tab, button, question-row, nav, result, expandable "Read the full analysis ↓", email box and footer styles as the sister app. Breakpoints: ≤840px single column (left not sticky); ≤520px compact, question rows stack, answer buttons full width, nav buttons full width.
- Footer (top border): left "Build in Public Framework · <span class="tag">v0.1</span>" (tag blue), right "Build in Public — Volodymyr Khomichenko".
- If embedded in an iframe, postMessage({type:"bip-framework-height", height: document.documentElement.scrollHeight}, "*") on resize, on load and every 700ms (as the sister app does).

2) HARD RULE: NO NUMBERS
The book "does not measure magnitude". Never show a score, multiplier, percentage, currency or "return". All ratings are WORDS. The only numbers allowed are progress counts ("12/31 answered", "Round 3 of 7").

3) LEFT COLUMN
Card 1 "Your formula": three tiles "Base × Coefficient × Sign", each showing its current word rating; colour: blue = positive/in place, gray (--gray-mark) = not yet/unknown, dark (--warn) = zero/negative (the word is always shown, so colour is never the only signal). Under Base, four chips: Substance · Market that pays · Monetization · Distribution, coloured by state. Progress bar (blue gradient) + "<b>n</b>/31 answered" + "Tap a tile to jump" (tiles jump to the relevant round). Card 2 "Outcome": the live Outcome phrase in Fraunces + one muted line; initially "Answer the rounds — the reading builds as you go." Both have aria-live="polite".

4) ANSWERS
Every question has three buttons: "Clear answer" · "Vague" · "No answer" (values C / V / N; unanswered = U). Re-clicking the selected one clears it. Implement each as role="radiogroup" (aria-label = question), buttons role="radio" with aria-checked, arrow-key navigation, :focus-visible 2px blue outline, min-height 46px. Selected styles: Clear = blue fill; Vague = --gray-mark fill with ink text; No answer = --ink fill. Show an optional small muted helper line under a question where given. Under each round title show the explainer (.block-mean) and, once, the intro line: "Answer honestly. You don't need to type anything — but if you can't say it in a sentence, choose Vague."

5) ROUNDS (texts are verbatim from the book — copy character-for-character)
Tabs: Base · Openness · Gates · Costly · Audience & sign · Dial · Person · ⚑ Symptoms · ★ Result

Round 1 "Is there a base?" — explainer: A viable business stands on four things. Transparency acts on them; it never replaces them.
 R1Q1 [pillar Substance] What specific problem do I solve, and for whom — in one sentence, without adjectives?
 R1Q2 [pillar Market] Who has already paid me for it? If nobody, who pays for something comparable today?
 R1Q3 [pillar Market] Is this a market that structurally pays, or one that expects things like mine to be free? What is the free alternative my customer would reach for first?  (helper: Clear answer = you know it structurally pays, and you can name the free alternative.)
 R1Q4 [pillar Monetization] How do I collect the money, and is the price right for the customer I actually want? What kind of customer does my current price attract?
 R1Q5 [pillar Distribution] If I published nothing for six months, how would anyone new find me? Name the mechanism, not the hope.

Round 2 "Which openness fits me?" — explainer: The right flavor is the one that grows naturally out of your business, your source of trust, and your nature.
 R2Q1 Where does trust live in my business: in numbers, in code, in expertise, in my personality, or in how the company behaves?  (+ optional multi-select chips: Numbers · Code · Expertise · My personality · How the company behaves)
 R2Q2 Am I willing to be a public face for years — or would I rather the company be open while I stay in the background?  (+ optional single-select chips: Public face · Background)
 R2Q3 Where is the conversation about my problem already happening, and would I read there even if I never published?
 R2Q4 [amplifier Integration] What can I give away for free that would make someone more likely, rather than less likely, to pay me?
 R2Q5 [amplifier Integration; label "From Chapter 8"] Can I make openness a part of the product itself or the channel itself, rather than an add-on off to the side?

Round 3 "The gates" — explainer: A gate is a yes-or-no condition: pass it, and the multiplier can work for you; fail it, and no amount of shine will save you.
 R3Q1 [Truth gate] Is every number I plan to publish one I would stand behind if a journalist, a former employee and a customer all checked it?
 R3Q2 [Truth gate] Am I presenting a peak as if it were typical, or a pilot as if it were a partnership?  (helper: Clear answer = you can say plainly that you are not.)
 R3Q3 [Substance gate] Is there something real underneath this, or am I about to amplify a hope?  (helper: Clear answer = you can name what's real underneath.)

Round 4 "The costly question" — explainer: Openness against your own interest is the one trust signal a liar cannot copy.
 R4Q1 [Costly honesty] What could I honestly say or do that would cost me something in the short term — and prove to a customer that I'm on their side?
 R4Q2 [Costly honesty] What flaw in my own product would I rather a competitor didn't name first?
 R4Q3 [Costly honesty] When did I last tell a customer not to buy something?

Round 5 "Before you launch & the sign" — label "From the chapters" (make clear these two are not part of the book's audit) — explainer: Accumulated distribution — the audience, trust and reputation gathered before you launch. When you are the channel, your conduct decides whether the whole equation comes out positive or negative.
 R5Q1 [amplifier Accumulated distribution; "Chapter 9"] What am I accumulating today that will one day make my launch instant?  (helper: Clear answer = you can name the audience, trust or reputation already in place — built over years or carried over from a previous project.)
 R5Q2 [Sign; "Chapter 2"] Am I prepared to hold a public persona that adds rather than subtracts?

Round 6 "The dial" — explainer: Openness is not a switch set to maximum.
 R6Q1 If a competitor read everything I published this month, what could they take and use tomorrow?
 R6Q2 Which of my disclosures is inspiration — my story, my lessons, my reasoning — and which is mechanics: the exact channel, the tactic, the niche?
 R6Q3 Have my numbers become large enough to be a map rather than a magnet?  (+ optional chips: Still a magnet · Now a map)

Round 7 "The person" — explainer: Everything in this book requires you to still be there when the compounding starts.
 R7Q1 What rhythm can I honestly hold for a year — not a week, not a month?
 R7Q2 Who in my life doesn't need me to be content?
 R7Q3 Am I sharing this from the scar or from the open wound?  (helper: Clear answer = from the scar.)

Final round "⚑ Symptoms" — heading: What are you experiencing? — sub: Seven ways this goes wrong, arranged by symptom. Find what you're experiencing, then read what's actually broken. Two buttons per row: "That's me" (⚑, --warn fill when on) / "Not me" (blue when on).
 S1 Attention is growing, conversations are happening, investors are interested — and sales aren't moving.
 S2 A number you published once is no longer quite true, and correcting it now would be awkward.
 S3 The product is good, the people who use it love it, you're open about everything — and growth is flat.
 S4 The community is growing, the messages are warm, people say they'd be lost without you — and revenue doesn't move.
 S5 The product hasn't changed, the numbers were fine, and people are quietly leaving anyway.
 S6 Clones of your product, your pricing, or your exact tactic appear within weeks of your posting about them.
 S7 The metrics are fine and you can't make yourself post. Comparison stings. Criticism lingers for days.
 Primary button: "See my reading →". The ★ Result tab is reachable at any time.

6) STATES AND RATINGS
Group state over its items: any N → missing; else any V → vague; else any U → unknown; else → in place.
Pillars: Substance = R1Q1; Market that pays = R1Q2+R1Q3; Monetization = R1Q4; Distribution = R1Q5. Words: In place / Vague / Missing / Not answered.
BASE: any pillar missing → "Zero — missing: <names>"; else any vague → "Unproven — vague on: <names>"; else any unknown → "Incomplete"; else "Complete".
TRUTH GATE (R3Q1, R3Q2, S2): S2 = That's me OR any N → Failed; else any V → Unchecked; else any U → Not answered; else Passed.
SUBSTANCE GATE (R3Q3, Substance pillar, S1): S1 = That's me OR R3Q3 = N OR Substance missing → Failed; else V → Unchecked; else U → Not answered; else Passed.
AMPLIFIERS: Integration = R2Q4+R2Q5; Accumulated distribution = R5Q1; Costly honesty = R4Q1–3. Words: in place → Present, vague → Forming, missing → Absent, unknown → Not answered. Special: if none of R4Q1–3 is C (and all three are answered) → Costly honesty = "The cheap kind".
COEFFICIENT: Truth gate Failed → "Negative — the truth gate is failing"; else Substance gate Failed → "Nothing to multiply — the substance gate is failing"; else by number of Present amplifiers: 3 "Very high", 2 "High", 1 "Moderate", 0 "Low"; append " · gates passed" if both gates Passed else " · gates unchecked". If Costly honesty is "The cheap kind" add the line: Your transparency is currently the cheap kind. Always show under Coefficient: The coefficient acts on trust, reach and adoption — never on a market's willingness to pay.
SIGN: S5 = That's me → "Negative"; else if R2Q2 chip = Background → "Less exposed — your openness doesn't run through one persona"; else R5Q2: C → "Positive", V or N → "At risk", U → "Not answered". If chip = Public face, add note: The more the company fuses with you, the higher the ceiling and the lower the floor.
OUTCOME (first match wins; two negatives must never produce a positive):
 1 Truth gate Failed → "Negative — a lie multiplied by reach." / line: A lie multiplied by reach detonates in proportion to the trust it built.
 2 Sign Negative → "Negative — the sign has flipped." / line: A polarizing persona can flip a strong base and a powerful coefficient into decline, without a single thing changing about the product.
 3 Base Zero OR Substance gate Failed → "Zero — a loud, public, well-documented zero." / line: If any pillar is zero, the outcome is zero.
 4 Base Unproven → "Not yet — that is your next month's work, not transparency." / line: If any of these answers is vague, that is your next month's work — not transparency.
 5 anything still Not answered / Incomplete / Unchecked → "Unclear — answer the remaining questions."
 6 else → "Positive — multiplying what you've built." / line: In the winners, all three parts are positive and large. If Coefficient is Low or Costly honesty is The cheap kind, append: The base is there; the coefficient is still small.

7) RESULT SCREEN (same structure/styles as the sister app's result)
- Eyebrow: "Your reading · Base × Coefficient × Sign".
- Title (archetype): if any symptom is "That's me", first match in order S2, S1, S5, S4, S3, S6, S7 → its name: S1 "Empty publicity", S2 "The public lie", S3 "Honest, and going nowhere", S4 "The Love Trap", S5 "The negative sign", S6 "Eroded moat", S7 "The founder runs out". Else first matching risk: Truth gate Failed → "At risk of: The public lie"; Substance missing or Substance gate Failed → "At risk of: Empty publicity"; Market missing/vague → "At risk of: The Love Trap"; Distribution missing/vague → "At risk of: Honest, and going nowhere"; Sign At risk with chip Public face → "At risk of: The negative sign"; R6Q3 chip "Now a map" and R6Q1 or R6Q2 not C → "At risk of: Eroded moat"; any R7 = N → "At risk of: The founder runs out". Else "Multiplying in the right direction".
- Line: the Outcome phrase + its line.
- Disclaimer box: A lens for your own decision, not a prescription — and not a measurement. The book does not answer "how much", and neither does this.
- "Fix this first" (one item; badge "STOP" in --warn for a symptom or failed gate, otherwise a short area label), first that applies:
  a) a marked symptom (same priority) → name + this text:
   S1 Stop asking whether people are talking about you and ask whether anyone is buying. If the answer is no, fix that before publishing anything else.
   S2 Correct it now, publicly and plainly. The cost today is a fraction of the cost later.
   S3 Treat distribution as a separate job with its own hours, not as something that happens after the product is ready.
   S4 Run the two columns separately. Not "how many people love this" but "how many paid, and how many paid again." If the second column stays empty while the first fills, you are in the wrong market, not the wrong marketing.
   S5 Separate your worst impulses from your channel. When you most want to hit send, wait an hour. Consider how much of the company should be attached to you at all.
   S6 Separate inspiration from mechanics. Keep giving away the story, the lessons and the why. Be careful with the exact channel, the precise tactic and the profitable niche. And say plainly that you're narrowing — an audience forgives the change and doesn't forgive being quietly dropped.
   S7 Set a rhythm you can hold for a year, not a week. Keep a circle of people off-screen who don't need you to be content. Share from the scar, not the open wound. And if the weight is genuinely heavy, treat that as a signal to stop and get real support — that isn't a break in the plan, it is the plan.
  b) first pillar missing/vague (order Substance, Market, Monetization, Distribution) → "<Pillar>." + If any of these answers is vague, that is your next month's work — not transparency. + pillar line: Substance — real value that solves a real problem. Missing it, the multiplier inflates emptiness. / A market that pays — not an audience that loves you, but people structurally willing to hand over money. / Monetization — a working way to collect that money. Same product, same market, wrong price, no business. / Distribution — a path by which people find out you exist.
  c) Truth gate not Passed → "Truth gate." + Never show a number in public that you aren't prepared to stand behind when people start checking it.
  d) Costly honesty = The cheap kind → "Costly honesty." + Your transparency is currently the cheap kind. What can I honestly show or do that will cost me something in the moment — but prove that I'm on the customer's side?
  e) Sign At risk → S5 text. f) any R7 = N or V → S7 text.
  g) else "Build this next:" weakest amplifier + its line: Integration — openness woven into the product or the channel (open source, teaching, demonstration) rather than bolted on beside it. / Accumulated distribution — the audience, trust and reputation gathered before you launch. It can be built over years or transferred from a previous project, but it never appears instantly. / Costly honesty — openness that works against your own short-term interest.
- "The dial" (always one item): S6 = That's me OR R6Q3 chip "Now a map" → "Narrow the mechanics." Later, when your numbers become a map for competitors, narrow the mechanics while keeping the story, the lessons and the honesty. Ghost mode is a response to a specific risk, not a stage everyone reaches. — else if R6Q1 or R6Q2 is V or N → "Sort inspiration from mechanics." Story and lessons are safe to publish; the exact channel and tactic are a map for a competitor. Before you publish, ask: if a competitor read this tomorrow morning, would it cost me anything? — else → "Open wide." Early, when you have nothing to lose, open wide.
- Button "Read the full analysis ↓" expands:
  · "The formula applied to you" — four lines in the book's Casebook style, bold label then text: Base. <rating; each pillar with its state> · Coefficient. <rating; Truth gate <state>, Substance gate <state>; Integration / Accumulated distribution / Costly honesty with their words; boundary line> · Sign. <rating + note> · Outcome. <phrase>.
  · "Your flavor" (only if chips chosen): Numbers → open metrics; Code → open source; Expertise → teaching; My personality → solo narration; How the company behaves → public philosophy / institutional honesty. If Background chosen add: the open-source and institutional flavors exist precisely so that the company can be transparent while you stay in the background. Always add: These flavors aren't mutually exclusive — the strongest founders often blend two or three.
  · "Symptoms you marked" — each with "What's broken": S1 the substance gate. You have a coefficient without a base. / S2 the truth gate. The coefficient has turned negative and is compounding. / S3 the distribution pillar. There is nothing wrong with your transparency; there is no channel for it to amplify. / S4 the paying-market pillar. The coefficient is working perfectly on the wrong variable. / S5 the sign. Your public conduct is being multiplied across everything else. / S6 nothing, yet — but the dose of openness no longer matches the stage. / S7 the person operating the multiplier.
  · If R7Q3 = N add, calmly: If the emotional weight of being public becomes genuinely heavy, that's a signal not to grit your teeth and keep posting, but to stop and lean on real support, including professional support.
  · Email box (below).
- CTA row: primary "Get the book" → https://khomichenko.com/build-in-public ; ghost "Listen to half the book free" → https://youtu.be/VFHsPbn17bM (target=_blank rel=noopener) ; ghost "← Edit answers" (back to round 1, answers kept).
- Never mention any company or person names in the app.

8) EMAIL FORM (placeholder — must stay in demo mode until the owner connects MailerLite)
Title "Want this reading in your inbox?"; sub "We'll email your Base, Coefficient and Sign and the chapters to read next."; email input; consent checkbox "I agree to receive this analysis and occasional updates about <em>Build in Public</em>. Unsubscribe anytime."; button "Send it to me" disabled until valid email + consent. const SUBSCRIBE_ENDPOINT = ""; — if empty: show "✓ Done — your reading is on its way to <b>email</b>." plus "(Demo mode — connect MailerLite to send for real.)" and make NO network request. If set: POST JSON {email, consent:true, archetype, outcome, base, coefficient, sign, missingPillars, symptoms, flavor}; on error show "That didn't go through — please try again in a moment."
Also provide api/subscribe.js (Vercel Node): validate email; POST to https://connect.mailerlite.com/api/subscribers with header Authorization: Bearer process.env.MAILERLITE_API_KEY, body {email, groups:[process.env.MAILERLITE_GROUP_ID], fields:{...}}; return 200 or 4xx; never expose the key. Add a README note: set MAILERLITE_API_KEY and MAILERLITE_GROUP_ID in Vercel, then set SUBSCRIBE_ENDPOINT="/api/subscribe".

9) META
<html lang="en">; <title>Build in Public Framework — What is your openness actually multiplying?</title>; meta description: The framework from the book "Build in Public" by Volodymyr Khomichenko. Answer the book's Transparency Audit and see your Base, Coefficient and Sign — in words, the way the book reads every founder. OG/Twitter: title "Build in Public Framework", url https://build-in-public-framework.khomichenko.com/, image /og.png (simple card in the palette with "Base × Coefficient × Sign" in Fraunces), summary_large_image. No analytics or tracking scripts. Respect prefers-reduced-motion. Tabs use role="tablist"/"tab"/aria-selected; on step change move focus to the panel heading. WCAG AA contrast. Optional: persist answers in localStorage key "bip-answers-v1" with a "Start over" link.

10) ACCEPTANCE TESTS (make them pass and list results)
- All texts above appear verbatim; 24 questions + 7 symptoms; progress shows n/31.
- No numeric score/multiplier/percent/currency anywhere.
- Any Base question = No answer → Base "Zero — missing: …" and Outcome "Zero — a loud, public, well-documented zero."
- R3Q1 = No answer (or S2 marked) with everything else Clear → Coefficient "Negative — the truth gate is failing", Outcome "Negative — a lie multiplied by reach."
- S5 marked → Sign "Negative", Outcome "Negative — the sign has flipped." Truth gate failed + S5 → still Negative.
- All Clear, no symptoms, chip Public face → Base Complete; Coefficient "Very high · gates passed"; Sign Positive; Outcome Positive; title "Multiplying in the right direction"; dial "Open wide."
- R4Q1–3 all not Clear → "Your transparency is currently the cheap kind." shown.
- One Base question Vague (rest Clear) → Outcome "Not yet — that is your next month's work, not transparency."
- Each single symptom → matching title and Fix-this-first text.
- Keyboard-only usable; visible focus; screen reader reads options and state; no horizontal scroll at 360px except tabs; iframe height messages sent.
- Visual side-by-side with https://revenue-multiplier-framework.khomichenko.com/ at 1280px and 390px looks like the same family.
- Footer shows "Build in Public Framework · v0.1".
```
