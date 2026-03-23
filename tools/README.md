[dst-tools-readme.md](https://github.com/user-attachments/files/26186214/dst-tools-readme.md)
# Tools

The DST structural intelligence engine. Three files. Runs on every PR automatically.

---

## Quick Start — 60 Seconds

```bash
# Copy to your repo root
cp tools/dst-scanner.js ./
cp tools/dst-action.js ./

# Create the workflow
mkdir -p .github/workflows
cp .github/workflows/dst-diagnostic.yml .github/workflows/

# Push — DST runs on the next PR automatically
git add . && git commit -m "Add DST diagnostic" && git push
```

Next PR → full structural analysis posted as a comment.

---

## What You Get On Every PR

```
Θ (real capacity):     42/100
Apparent health:       71/100
Observability gap:     ⚠️ 29 pts — Metrics are significantly misleading
Regime:                🟠 Late Plastic
dΘ/dt:                 ↓ −2.3 pts/PR (declining)
Prediction:            ⚠️ Residual in ~8 PRs [HIGH]
Risk score:            67/100 [HIGH]
κ saturation:          61% ⚠️

Action Plan — κ Classification:
🔴 Fix κ_a (12 findings):     error_swallowing, implicit_state, god_function
🟡 Mitigate κ_c (3 findings): domain-forced patterns — instrument, don't eliminate
🟢 Accept κ_i (2 findings):   documented tradeoffs — verify expiration

Annual cost of κ:   $2.1M · Payback: 0.8 months · 5yr ROI: 2,430%
```

---

## The Three Files

### `dst-scanner.js` — V4 structural engine
923 lines. Nine mathematical functions.

Detects three pattern categories across `.js`, `.ts`, `.jsx`, `.tsx`, `.py`:

**κ (displacement — hides damage):**
- `error_swallowing` — silent catches that make failure invisible
- `implicit_state` — mutations callers cannot predict
- `retry_loop` — hiding instability behind retries
- `god_function` — too many responsibilities in one place
- `todo_comment` — untracked structural debt
- `any_type` — type system bypassed
- `deep_nesting` — complexity hidden in indentation
- `large_file` — single responsibility violated at file level

**σ (stress amplifiers — scale with load):**
- `n_plus_one` — queries inside loops that explode at scale
- `unbounded_growth` — collections with no size limit or eviction

**ρ (healing — structural health signals):**
- Typed interfaces, explicit error throws, immutable declarations, pure functions

**V4 outputs:**
- `Θ` — real remaining capacity (not just "score")
- Observability gap — how much your metrics are lying
- `σ_eff` — effective stress after κ displacement
- κ saturation — how full the displacement budget is
- `dΘ/dt` — trajectory from trend history
- Regime prediction — sprints until next transition
- Rewrite signal — Proposition 5 trigger (when local fixes stop working)
- Three action lists — Fix κ_a / Mitigate κ_c / Accept κ_i

### `dst-action.js` — GitHub Action runner
Posts the full structural report as a PR comment. Handles incremental scanning (changed files only), trend artifact management, security findings (advisory, separate from Θ score), and ROI calculation.

### `.github/workflows/dst-diagnostic.yml` — The workflow
Runs on every PR and push to main. Downloads previous trend artifact for `dΘ/dt` calculation. Saves updated trend for next run.

---

## Configuration

Set these in: **repo → Settings → Secrets and variables → Actions → Variables**

| Variable | Default | Description |
|---|---|---|
| `DST_TEAM_SIZE` | 10 | Number of engineers (affects ROI calculation) |
| `DST_ENGINEER_COST` | 150000 | Annual fully-loaded cost per engineer USD |
| `DST_SCAN_DIR` | `.` | Directory to scan (`.` = whole repo) |
| `DST_FAIL_SCORE` | 0 | Fail CI if Θ drops below this (0 = never) |
| `DST_FAIL_RISK` | 0 | Fail CI if risk score exceeds this (0 = never) |
| `DST_HOURS_RETRY` | 4 | ROI multiplier: hours per retry incident |
| `DST_HOURS_ERROR` | 6 | ROI multiplier: hours per error debugging session |
| `DST_HOURS_GOD` | 8 | ROI multiplier: hours per god function navigation |

---

## Run Locally

```bash
# Scan a directory
node dst-scanner.js path/to/your/code

# Scan with team context
DST_TEAM_SIZE=15 DST_ENGINEER_COST=180000 node dst-scanner.js ./src

# Run the demo
node dst-scanner.js demo/bad-code-test.js
```

---

## DST Compass

The interactive 15-question structural diagnostic tool. No code scanning — pure DST reasoning from system description.

**Location:** `tools/compass/dst-compass.html`

Open in any browser. Answer 15 questions about your system. Get regime classification, observability gap estimate, and intervention recommendations.

Built for: CTOs doing pre-investment diligence, engineering managers assessing team health, architects evaluating architectural decisions.

---

## Regime Reference

| Θ | Regime | Reality |
|---|---|---|
| 75–100 | 🟢 Elastic | Real health. Features are fast to add. |
| 50–74 | 🟡 Plastic | Working via masking. Capacity declining. |
| 25–49 | 🟠 Late Plastic | Significant κ. Each feature costs more than the last. |
| 0–24 | 🔴 Residual | Delayed failure. Fix before adding anything. |

---

## Real-World Results

The scanner has been run on some of the most-used codebases on the internet:

| Repository | Stars | Θ | Regime | Key finding |
|---|---|---|---|---|
| facebook/react | 228k | 100 | Elastic | Inverted gap — metrics understate capacity |
| vercel/next.js | 130k | 65 | Plastic | Knife-edge balance — 35pt ρ vs κ margin |
| expressjs/express | 65k | 0 | Residual | 15yr accumulation — test files worse than library |
| mlc-ai/web-llm-chat | — | 0 | Residual | 100pt gap — demo pressure, rewrite signal |
| apache/log4j2 (pre-CVE) | — | 8 | Residual | 84pt gap — structure predicted $10B disaster |

Zero domain knowledge used on any of them. Same scanner. Same version. Same equation.

→ [Full case studies](../docs/examples/)

---

## The Math Behind The Scanner

The scanner implements DST V4 equations directly:

```
Θ = 100 + Σ(κ_impacts) + Σ(σ_impacts) + Σ(ρ_bonuses)
σ_eff = σ_raw − min(κ × 0.3, σ_raw × 0.8)
Gap = max(0, Apparent − Θ)
κ_saturation = κ_used / κ_max   where κ_max ≈ √(files) × (team/5) × 8
```

Rewrite signal triggers when: `Θ < 30 AND (dΘ/dt < −2 OR Θ ≤ 10)`

This is Proposition 5 — Rewrite Inevitability — from [`docs/math/proofs.md`](../docs/math/proofs.md).

→ [Full mathematical foundation](../docs/math/)

---

*DST Framework V4 · SSRN 6434119 · Idan Rephiah · 2026*
*ρ heals · κ hides · σ kills*
