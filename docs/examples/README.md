# Examples

Conceptual walkthroughs of DST applied to real codebases and systems.

These are **explanations** — not runnable code.
For runnable demos, see [/demo](../../demo/).

## Contents

| File | Description |
|------|-------------|
| `express-codebase.md` | DST analysis of a Node.js/Express codebase |
| `real-world.md` | 🔥 Real-world repo analyzed — before/after DST |
| `web-llm-chat-case-study.md` | mlc-ai/web-llm-chat · Residual regime (Θ 0/100) · observability gap 100 pts |
| `facebook-react-case-study.md` | ⭐ facebook/react · 228k stars · Elastic regime (Θ 100/100) · inverted observability gap · lane system κ_c analysis |

## How to read these

Each example follows the same structure:

1. **System described** — what the codebase does
2. **DST scan** — κ, σ, ρ, Θ values measured
3. **Before** — the stress pattern identified
4. **After** — what changed when DST was applied
5. **ROI** — measurable outcome

> Start with [real-world.md](./real-world.md) — it's the fastest way to understand DST.
