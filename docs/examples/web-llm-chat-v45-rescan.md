# DST v4.5 Rescan — mlc-ai/web-llm-chat

**DST V4.5 Diagnostic — Live Scan Results**  
*Scanned March 2026 · DST Framework v4.5-final · SSRN 6434119*  
*Repository: mlc-ai/web-llm-chat · 71 TypeScript/JavaScript source files*

---

> *"The stability you see is not real — it is borrowed."*  
> *(Residual regime. Θ=0. The maximum observability gap in the dataset.)*

---

## Overview

This is the second DST scan of mlc-ai/web-llm-chat. The V4 scan ran in early March 2026 on the full codebase (71 TS/JS source files) and found **Θ=0/100 (Residual)** with an observability gap of 100 points — the most extreme gap of any codebase in the DST scan series. V4.5 runs the same codebase through the three new capabilities introduced since V4.

DST v4.5 adds three capabilities on top of v4:
1. **κ_i expiration contracts** — `@dst-kappa-i: expires YYYY-MM-DD` annotations tracked and enforced by CI
2. **σ environment scaling** — `DST_DATA_SCALE` scales σ amplifier weight: `small ×0.5 · medium ×1.0 · large ×2.0 · hyperscale ×4.0`
3. **AST parallel engine** — Babel-powered N+1 and silent-catch detection runs alongside regex when `@babel/parser` is available

The V4 scan confirmed the structural verdict: Θ=0, Residual, rewrite signal triggered on three modules (`chat.tsx`, `chat.ts`, `utils.ts`). V4.5 runs the same codebase through the new capabilities to answer: what changes, what doesn't, and what the new features mean for a Residual-regime codebase at the absolute floor.

---

## Run 1 — Standard (DST_DATA_SCALE=medium, default)

```
DST_SCAN_DIR=/tmp/web-llm-chat-scan node tools/dst-action.js
```

*(Internally: `DST_DATA_SCALE=medium` — σ scale ×1.0, default)*

```
══════════════════════════════════════════════════
  DST DIAGNOSTIC — v4.5-final
══════════════════════════════════════════════════

  🔴 STRUCTURAL REPLACEMENT INDICATED
     Proposition 5 — Rewrite Inevitability
     Local modification is becoming infeasible.
     Structural replacement of these modules is the
     mathematically indicated intervention.
     Critical modules:
       app/components/chat.tsx (Θ 0)
       app/store/chat.ts (Θ 0)
       app/utils.ts (Θ 0)

  Θ (real capacity):  0/100
  Apparent health:    100/100
  Observability gap:  ⚠️⚠️⚠️ 100 pts — CRITICAL DIVERGENCE
  Regime:             Residual
  dΘ/dt:              first scan
  Risk:               100/100 [CRITICAL]
  κ saturation:       100%
  σ_eff:              0 (0 stress units hidden by κ)
  Findings:           κ:179 σ:0 ρ:230 🔒:0

  🔴 CRITICAL: RESIDUAL REGIME — STRUCTURAL FAILURE EMBEDDED
    • κ is exhausted — masking has reached structural limits
    • Θ → 0: the system is in delayed failure mode
    • New features will accelerate cascade, not delay it
  → STOP adding features. Initiate structural repair immediately.
    The next incident will not be gradual.

  🔴 FIX — κ_a accumulated (7 types, 179 total):
     1. implicit state (80x · -720 pts)
     2. any type (59x · -236 pts)
     3. deep nesting (22x · -132 pts)
     4. god function (7x · -70 pts)
     5. large file (8x · -48 pts)

  🟡 MITIGATE — κ_c conscripted (0 auto-detected)
     [WebGPU initialization chains and incomplete upstream types present — see V4 case study]

  WORST FILES:
  Θ0/100   app/components/chat.tsx    (19 findings, 1,481 lines)
  Θ0/100   app/store/chat.ts          (29 findings, 706 lines)
  Θ0/100   app/utils.ts               (20 findings, 305 lines)

  ANNUAL COST OF κ:
  Team: 8 engineers @ $180,000/yr ($87/hr)
  Total:     $404,308/year
  Fix investment:    $55,385
  Payback:           1.6 months
  5yr ROI:           3,775%

  ρ heals · κ hides · σ kills
  SSRN 6434119 · Idan Rephiah · 2026
══════════════════════════════════════════════════
```

---

## Run 2 — Hyperscale (DST_DATA_SCALE=hyperscale, σ × 4.0)

```
DST_DATA_SCALE=hyperscale DST_SCAN_DIR=/tmp/web-llm-chat-scan node tools/dst-action.js
```

```
══════════════════════════════════════════════════
  DST DIAGNOSTIC — v4.5-final
══════════════════════════════════════════════════

  🔴 STRUCTURAL REPLACEMENT INDICATED
     Proposition 5 — Rewrite Inevitability
     Local modification is becoming infeasible.
     Structural replacement of these modules is the
     mathematically indicated intervention.
     Critical modules:
       app/components/chat.tsx (Θ 0)
       app/store/chat.ts (Θ 0)
       app/utils.ts (Θ 0)

  Θ (real capacity):  0/100
  Apparent health:    100/100
  Observability gap:  ⚠️⚠️⚠️ 100 pts — CRITICAL DIVERGENCE
  Regime:             Residual
  dΘ/dt:              first scan
  Risk:               100/100 [CRITICAL]
  κ saturation:       100%
  σ_eff:              0 (0 stress units hidden by κ)
  Findings:           κ:179 σ:0 ρ:230 🔒:0

  🔴 CRITICAL: RESIDUAL REGIME — STRUCTURAL FAILURE EMBEDDED
    • κ is exhausted — masking has reached structural limits
    • Θ → 0: the system is in delayed failure mode
  → STOP adding features. Initiate structural repair immediately.

  🔴 FIX — κ_a accumulated (unchanged at hyperscale):
     1. implicit state (80x · -720 pts)
     2. any type (59x · -236 pts)
     3. deep nesting (22x · -132 pts)
     4. god function (7x · -70 pts)
     5. large file (8x · -48 pts)

  ρ heals · κ hides · σ kills
  SSRN 6434119 · Idan Rephiah · 2026
══════════════════════════════════════════════════
```

### Why hyperscale produces identical output — and why that is the correct result

The two runs are identical because web-llm-chat has **0 σ findings**. The `DST_DATA_SCALE` multiplier applies exclusively to σ finding weights. With no σ findings to scale, hyperscale has nothing to amplify.

| Scale | σ findings | σ total impact | Change |
|-------|-----------|----------------|--------|
| medium (×1.0) | 0 | 0 pts | — |
| hyperscale (×4.0) | 0 | 0 pts | No change |

**Why 0 σ findings at Θ=0:** This is the structural paradox of web-llm-chat. The codebase is in Residual regime not because it amplifies stress through σ patterns, but because it masks structural capacity through pervasive κ_a. The 179 κ findings — 80 implicit state mutations, 59 `any` type deferrals, 22 deep nesting patterns — have consumed all available capacity without any explicit stress amplification.

**The apparent health stays at 100:** Apparent health is computed from σ findings and ρ signals only. With σ=0, apparent health is entirely determined by the 230 ρ signals. `100 + 0×σ_impact = 100`, regardless of scale. The κ_a findings are invisible to surface metrics — that is what makes them masking patterns. The apparent health of 100 is structurally correct under the observability model: it is what any test suite, benchmark, or observer not using DST would see.

**The 100-point gap is permanent under σ scaling:** Because web-llm-chat's structural problem is pure κ_a (no σ amplifiers), σ scaling cannot close the gap. The gap remains 100 points at all scale settings. This is the structural signature of a demo-pressure codebase: speed-of-development choices (state mutations, `any` types) create maximum observability gap with no stress amplification. The system looks maximally healthy because nothing is amplifying stress — the stress is simply hidden.

---

## V4 vs V4.5 Comparison Table

| Metric | V4 (March 2026, current main) | V4.5 (March 2026, current main) | Change |
|--------|------------------------------|----------------------------------|--------|
| Files scanned | 71 | 71 | Unchanged |
| Θ (real capacity) | 0/100 | 0/100 | Unchanged |
| Regime | Residual | Residual | Unchanged |
| κ findings | 179 | 179 | Unchanged |
| σ findings | 0 | 0 | Unchanged |
| ρ findings | 230 | 230 | Unchanged |
| Security findings | 0 | 0 | Unchanged |
| Risk score | 100/100 CRITICAL | 100/100 CRITICAL | Unchanged |
| κ saturation | 100% | 100% | Unchanged |
| σ_eff | 0 | 0 | Unchanged |
| Observability gap | 100 pts | 100 pts | Unchanged |
| Annual cost of κ | $404,308 | $404,308 | Unchanged |
| Rewrite signal | chat.tsx, chat.ts, utils.ts | chat.tsx, chat.ts, utils.ts | Unchanged |
| κ_i annotations | n/a (v4 feature) | 0 found | New capability — none present |
| AST engine | not available | not available | `@babel/parser` not installed in scan env |
| σ scale (medium) | n/a | ×1.0 | New explicit scale — same output (0 σ findings) |
| σ scale (hyperscale) | n/a | ×4.0 | No change (0 σ findings to scale) |
| ΔΘ gate | n/a | Triggered: Condition 1 met | Residual regime — any negative PR blocked |

**Key v4.5 finding:** The structural verdict is completely stable between V4 and V4.5. Web-llm-chat is unique in the dataset: it is the only codebase where hyperscale scaling has zero effect (0 σ findings), and the only codebase where the 100-point observability gap is entirely κ_a-driven. V4.5 adds no new structural discoveries — and the absence of change is itself informative. The observability gap is not a scale artifact. It is a structural constant.

---

## @dst-kappa-i Annotations

**Result: zero annotations found.**

```
$ grep -r "@dst-kappa-i" /tmp/web-llm-chat-scan/
(no output)
```

There are no `@dst-kappa-i: expires YYYY-MM-DD` annotations anywhere in the web-llm-chat repository. This is expected — the team does not use DST Framework annotations. But for this specific codebase, the absence is structurally significant in a different way than Express or Log4j.

**The κ_c fraction matters for web-llm-chat:** The V4 case study identified a meaningful portion of web-llm-chat's κ findings as structurally κ_c — conscripted masking forced by domain constraints:

| Pattern | Count (approx.) | Type | Annotation if using DST |
|---------|-----------------|------|------------------------|
| WebGPU initialization chains | ~8 | κ_c | `@dst-kappa-c: webgpu-async-chain — sequential API required by WebGPU spec` |
| Incomplete `@webgpu/types` deferrals | ~12 | κ_c | `@dst-kappa-c: upstream-types — @webgpu/types missing definitions, track issue #XXXX` |
| Streaming token callback nesting | ~6 | κ_c | `@dst-kappa-c: streaming-api-shape — WebLLM streaming API requires this callback depth` |
| State mutation during model load | ~15 | κ_i | `@dst-kappa-i: expires 2026-09-01 — model init mutation, refactor to reducer after v1.0` |

If these 41 structural findings were properly classified and annotated:
- The κ_c findings would be accepted at their structural floor (no fix possible locally)
- The κ_i findings would appear in the "Accept" action list with expiration dates
- The remaining pure κ_a findings (approximately 138) would be the actual fix target

This distinction matters for the recovery path. Without DST v4.5 annotations, all 179 findings look identical — equally κ_a, equally requiring a fix. With proper annotation, the team would know that approximately 41 findings are either domain-forced (fix upstream) or intentional (fix by expiration date), and the 138 κ_a findings are the genuine refactoring target. The rewrite signal on `chat.ts` and `chat.tsx` might clear significantly faster with that distinction made explicit.

---

## AST Engine: Detected vs Regex

**Result: AST engine unavailable in this scan environment — all detections are regex.**

```
$ node -e "require('@babel/parser')"
Error: Cannot find module '@babel/parser'
```

`@babel/parser` and `@babel/traverse` are not installed in the scan environment. The v4.5 scanner detects this at startup and falls back to regex-only mode — zero regression risk, all existing patterns still fire.

| Detection rule | Engine used | Notes |
|---------------|-------------|-------|
| N+1 (await inside loop) | **regex** | `loopHead` + `dbCall` pattern combo |
| Silent catch (empty CatchClause) | **regex** | `catchOpen` + `realHandler` absence |
| All other κ, σ, ρ patterns | **regex** | Unchanged from v4 |

**For web-llm-chat specifically:** The AST engine's two proof-of-concept rules are less relevant here than in other codebases. Web-llm-chat has 0 σ findings and 0 N+1 patterns. The dominant structural damage (implicit state mutation and `any` types) is detected correctly by the regex engine.

However, the AST engine would provide a meaningful improvement in one area: the 22 deep nesting findings. Several of these are WebGPU initialization chains (κ_c) that the regex engine cannot distinguish from application-layer nesting (κ_a). The AST engine, with structural understanding of callback depth and function scope, could separate WebGPU adapter initialization chains from accumulated event handler nesting — reducing the κ_c misclassification risk and giving a cleaner κ_a target list.

To enable AST mode in a future scan:

```bash
npm install --no-save @babel/parser @babel/traverse
DST_SCAN_DIR=/tmp/web-llm-chat-scan node tools/dst-action.js
```

---

## ΔΘ Gate Status

**Web-llm-chat WOULD trigger the ΔΘ gate on any PR with a negative structural impact.**

The ΔΘ gate logic (from `tools/dst-action.js`):

```js
// Gate 1: ΔΘ gate — cannot merge negative impact into Residual
const prDelta = result.dThetaDt?.rate ?? 0;
if (result.regime.name === 'Residual' && prDelta < 0) {
  // block the PR
  process.exit(1);
}
```

Web-llm-chat's current state:

| Gate condition | web-llm-chat's value | Gate triggered? |
|---------------|----------------------|-----------------|
| Regime is Residual? | **Yes** — regime is Residual (Θ = 0) | ✅ Condition 1 met |
| dΘ/dt < 0? | No — first scan, rate = 0 | ❌ No (first scan only) |
| **ΔΘ gate triggered?** | **Not on first scan** | ⚠️ **Will trigger on second scan if PR adds κ** |

**The context:** Web-llm-chat's κ saturation is already at 100% — the displacement budget is completely exhausted. There is no room in the structural model for additional κ_a accumulation. Any PR that adds even one implicit state mutation, one `any` type, or one god function adds to a structure that is already at carrying capacity.

On the second scan, if a PR contributed any κ_a, `dΘ/dt` would show as negative (structural decay) and the gate would block it. This is not a theoretical risk for a demo-pressure project with active development — it is the expected trajectory.

**Comparison with Express:**

Both web-llm-chat and Express are in Residual regime with the ΔΘ gate's Condition 1 permanently met. The structural difference:

| | web-llm-chat (Residual, Θ=0) | Express (Residual, Θ=0) |
|---|---|---|
| σ findings | 0 | 8 |
| κ findings | 179 | 150 |
| ρ findings | 230 | 133 |
| κ saturation | 100% | 79% |
| Primary damage type | κ_a dominant (demo pressure) | κ_a + σ_eff (middleware model) |
| Hyperscale σ effect | None (0 σ findings) | Apparent drops 20→0 |
| Recovery path | Reducer extraction, file splitting | Structural repair + σ resolution |

Web-llm-chat is in deeper structural saturation (100% vs 79% κ saturation) but has less σ risk. Express has unbounded growth patterns that create production-scale stress amplification. Web-llm-chat has none — its structural damage is pure accumulated κ_a with no amplification. That makes the recovery path cleaner: there are no σ amplifiers to resolve first, just κ_a to progressively reduce through the V4 three-sprint plan.

---

## The 100-Point Gap — What V4.5 Confirms

The V4 scan established the most extreme observability gap in the DST dataset: Θ=0, Apparent=100, Gap=100. V4.5 confirms every dimension of that finding:

- **σ scaling cannot close the gap** — because the gap is entirely κ_a-driven, not σ-driven
- **κ_i contracts would clarify the fix target** — distinguishing κ_c (WebGPU API constraints), κ_i (accepted shortcuts), and κ_a (genuine fix targets) from the 179 total findings
- **ΔΘ gate is active** — any new PR adding κ to a 100%-saturated codebase will show negative dΘ/dt and be blocked
- **AST engine would improve κ_c classification** — separating WebGPU initialization nesting from application-layer nesting

**The structural interpretation of a 100-point gap with 0 σ findings:**

This combination — maximum observability gap, zero stress amplifiers — is the structural signature of pure speed-of-development pressure. The team built quickly, used state mutations and `any` types as velocity tools, and produced working software. The κ accumulated not because the team was bad at engineering, but because demo-mode priorities favor `it works now` over `it remains changeable`. The 230 ρ signals confirm the team knows how to write clean code — they just didn't have the structural framework to know when the accumulated shortcuts had crossed the structural threshold.

That is exactly what the 100-point observability gap measures: the distance between "this looks fine" (Apparent=100) and "this has no remaining capacity" (Θ=0). The team built something that works. DST measures how easy it is to continue building it. At Θ=0, the answer is: not easy, and getting harder with every PR.

---

## Summary

Web-llm-chat v4.5 scan confirms the v4 conclusion: **Θ = 0, Residual, 100-point observability gap, rewrite signal active on three modules**. Same codebase, same 71 files. V4.5 adds no new structural findings — and the stability of the structural verdict under all three new capabilities is itself the finding.

- **κ_i contracts:** none present — WebGPU κ_c, upstream type κ_c, and demo-pressure κ_i are the classification candidates; proper annotation would reduce the pure κ_a fix target from 179 to approximately 138
- **AST engine:** unavailable in this environment; would improve κ_c classification for WebGPU initialization nesting
- **σ hyperscale:** no effect (0 σ findings) — the 100-point gap is σ-independent; it exists at every scale setting and cannot be closed by σ scaling alone
- **ΔΘ gate:** Condition 1 permanently met — any second scan showing PR-induced κ increase will block the merge

The complete five-codebase comparison with v4.5 hyperscale responses:

| | React (Elastic) | Next.js (Plastic) | Express (Residual) | Log4j pre-CVE (Residual) | web-llm-chat (Residual) |
|---|---|---|---|---|---|
| Θ | 100 | 65 | 0 | 8 | 0 |
| σ findings | 24 | 2 | 8 | 8 | **0** |
| Hyperscale effect | No change (ρ absorbs) | Apparent 80→20 | Apparent 20→0 | Θ 8→0 | **No change (no σ to scale)** |
| Observability gap | −85 inverted | +15 | +20 | +84 | **+100 (maximum)** |
| Gap source | ρ dominance | κ balance | κ + σ | κ + σ=∞ chains | **Pure κ_a** |
| ΔΘ gate | Never triggers | Not active | Triggers on negative PRs | Would have triggered since 2013 | Triggers on negative PRs |

Web-llm-chat is the structural extreme: maximum observability gap, zero σ amplification, pure κ_a accumulation. It is the clearest demonstration of Axiom VI — observable state systematically decoupled from real capacity — in the dataset.

> *ρ heals · κ hides · σ kills*  
> DST Framework · SSRN 6434119 · Idan Rephiah · 2026
