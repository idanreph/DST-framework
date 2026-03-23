// dst-action.js — v4.5-final
// DST GitHub Action runner
//
// v4 additions (math-grounded output):
//   - Θ naming throughout (real remaining capacity)
//   - Observability gap: Θ vs apparent health
//   - σ_eff: effective stress after displacement
//   - κ saturation: displacement budget fill level
//   - dΘ/dt trajectory: rate + acceleration
//   - Regime prediction: sprints until next transition
//   - Rewrite signal: Proposition 5 trigger
//   - Three action lists: Fix κ_a / Mitigate κ_c / Accept κ_i
//
// DST Framework: ρ heals · κ hides · σ kills
// SSRN 6434119 · Idan Rephiah · 2026

const { runFullScan, runSelfScan } = require('./dst-scanner.js');
const https = require('https');

// ── CONSTANTS ─────────────────────────────────────────────────────────────
const FIX_MAP = {
  unvalidated_input: 'Validate and sanitize all input. Consider joi, zod, pydantic.',
  sql_concat:        'Use parameterized queries. Never concatenate user input into SQL.',
  hardcoded_secret:  'Move to environment variables. Rotate the exposed value immediately.',
};

// ── ENV ───────────────────────────────────────────────────────────────────
const GITHUB_TOKEN   = process.env.GITHUB_TOKEN;
const GITHUB_REPO    = process.env.GITHUB_REPOSITORY;
const PR_NUMBER      = process.env.PR_NUMBER;
const SCAN_DIR       = process.env.DST_SCAN_DIR    || '.';
const TEAM_SIZE      = parseInt(process.env.DST_TEAM_SIZE)     || 10;
const ENGINEER_COST  = parseInt(process.env.DST_ENGINEER_COST) || 150_000;
const FAIL_THRESHOLD = parseInt(process.env.DST_FAIL_SCORE)    || 0;
const FAIL_RISK      = parseInt(process.env.DST_FAIL_RISK)     || 0; // fail if risk score above this

// ── FORMATTERS ────────────────────────────────────────────────────────────
function scoreBar(score) {
  const filled = Math.round(score / 10);
  return `\`${'█'.repeat(filled)}${'░'.repeat(10-filled)}\` ${score}/100`;
}

function riskBar(score) {
  const filled = Math.round(score / 10);
  const color  = score >= 70 ? '🔴' : score >= 45 ? '🟠' : score >= 20 ? '🟡' : '🟢';
  return `${color} ${score}/100`;
}

function trendStr(trend) {
  if (!trend) return '— (first scan)';
  const sign   = trend.delta > 0 ? '+' : '';
  const phrase = trend.direction === 'improving' ? 'improving' :
                 trend.direction === 'worsening' ? 'worsening' : 'stable';
  let out = `${trend.arrow} ${sign}${trend.delta} pts vs last PR (${phrase})`;
  if (trend.avgDelta !== null) {
    const avgSign = trend.avgDelta > 0 ? '+' : '';
    out += ` · avg ${avgSign}${trend.avgDelta} pts over last ${trend.prCount} PRs`;
  }
  return out;
}

function formatMoney(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

function sevEmoji(s) {
  return { critical:'🔴', high:'🟠', medium:'🟡', low:'⚪', info:'ℹ️' }[s] || '⚪';
}

// ── PR COMMENT BUILDER (V4) ──────────────────────────────────────────────
function buildComment(result) {
  const {
    theta, regime, risk, warning, trend,
    kappaCount, sigmaCount, rhoCount, secCount,
    healing, roi, worstFiles, fileCount, allFindings, isIncremental,
    // V4
    dThetaDt, obsGap, sigmaEff, kappaSat, regimePred, rewriteSignal, actionLists,
  } = result;

  const regimeEmoji = { Elastic:'🟢', Plastic:'🟡', 'Late Plastic':'🟠', Residual:'🔴' }[regime.name]||'⚪';
  const holyLine = {
    'Elastic':     'It is stable — for now. What changes first?',
    'Plastic':     'The stability you see is not real — it is borrowed.',
    'Late Plastic':'It is still working — that is the problem.',
    'Residual':    'It is already failing — just not yet visible.',
  }[regime.name] || '';

  // ── 1. REWRITE SIGNAL (if triggered — show first, cannot be missed) ──────
  let c = '';
  if (rewriteSignal && rewriteSignal.triggered) {
    c += `## 🔴 STRUCTURAL REPLACEMENT INDICATED\n\n`;
    c += `> **${rewriteSignal.proposition}**\n\n`;
    c += `Θ = ${theta}/100 and declining at ${rewriteSignal.dThetaDt} pts/PR. `;
    c += `${rewriteSignal.message}\n\n`;
    if (rewriteSignal.criticalModules.length > 0) {
      c += `**Critical modules (Θ < ${30}):**\n`;
      rewriteSignal.criticalModules.forEach(m => {
        c += `- \`${m.file}\` — Θ ${m.score}/100, ${m.findings} findings\n`;
      });
      c += '\n';
    }
    c += `**${rewriteSignal.action}**\n\n---\n\n`;
  }

  // ── 2. HEADER ────────────────────────────────────────────────────────────
  c += `## DST Diagnostic ${regimeEmoji}${isIncremental ? ' *(changed files)*' : ''}\n\n`;
  c += `> *"${holyLine}"*\n\n`;

  // ── 3. CORE METRICS TABLE (Θ naming) ─────────────────────────────────────
  const trendStr = dThetaDt && dThetaDt.rate !== null
    ? `${dThetaDt.arrow} ${dThetaDt.rate > 0 ? '+' : ''}${dThetaDt.rate} pts/PR (${dThetaDt.direction})`
    : '— first scan';

  const predStr = regimePred
    ? `⚠️ **${regimePred.nextRegime}** in ~${regimePred.sprintsUntil} PRs [${regimePred.urgency}]`
    : '—';

  c += `| | |\n|---|---|\n`;
  c += `| **Θ (real capacity)** | \`${'█'.repeat(Math.round(theta/10))}${'░'.repeat(10-Math.round(theta/10))}\` ${theta}/100 |\n`;
  c += `| **Apparent health** | ${obsGap.apparent}/100 |\n`;
  c += `| **Observability gap** | ${obsGap.gap > 0 ? `⚠️ **${obsGap.gap} pts** — ${obsGap.message}` : '✓ Minimal'} |\n`;
  c += `| **Regime** | ${regimeEmoji} **${regime.name}** |\n`;
  c += `| **dΘ/dt** | ${trendStr} |\n`;
  c += `| **Prediction** | ${predStr} |\n`;
  c += `| **Risk score** | ${risk.score}/100 [${risk.level}] |\n`;
  c += `| **κ saturation** | ${kappaSat.saturation}% ${kappaSat.saturation >= 60 ? '⚠️' : '✓'} |\n`;
  c += `| **σ_eff** | ${sigmaEff.eff} (${sigmaEff.hidden > 0 ? `${sigmaEff.hidden} hidden by κ` : 'no masking'}) |\n`;
  c += `| **Files** | ${fileCount} · κ:${kappaCount} σ:${sigmaCount} ρ:${rhoCount} 🔒:${secCount} |\n\n`;

  // ── 4. REGIME WARNING ─────────────────────────────────────────────────────
  if (warning) {
    c += `---\n\n### ${warning.icon} ${warning.title}\n\n`;
    warning.lines.forEach(l => { c += `- ${l}\n`; });
    c += `\n**${warning.action}**\n\n`;
  }

  // ── 5. κ SATURATION WARNING ───────────────────────────────────────────────
  if (kappaSat.warning) {
    c += `---\n\n### 📊 κ Saturation\n\n`;
    c += `**${kappaSat.warning}**\n`;
    c += `${kappaSat.used} κ findings / ~${kappaSat.max} estimated capacity = **${kappaSat.saturation}% full**\n\n`;
  }

  // ── 6. THREE ACTION LISTS (V4.5) ───────────────────────────────────────
  const scaleEnv = process.env.DST_DATA_SCALE || 'medium';
  const scaleMultiplier = {small:0.5,medium:1,large:2,hyperscale:4}[scaleEnv] || 1;
  const scaleLabel = `${scaleEnv} (σ ×${scaleMultiplier})`;
  c += `---\n\n### Action Plan — κ Classification\n\n`;
  c += `*Scale: **${scaleLabel}** · σ amplifier weights adjusted for environment mass*\n\n`;

  if ((actionLists.expiredKappaICount || 0) > 0) {
    c += `> ⚠️ **${actionLists.expiredKappaICount} expired @dst-kappa-i annotation(s)** reclassified as κ_a (−15 pts each). Fix or renew.\n\n`;
  }

  if (actionLists.amplify.length > 0) {
    c += `#### 🔴 Resolve First — σ Amplifiers (${actionLists.amplifyTotal} total)\n`;
    c += `*Scale with load — ×${scaleMultiplier} weight in this environment.*\n\n`;
    actionLists.amplify.forEach((h, i) => {
      c += `**${i+1}. ${h.type.replace(/_/g,' ')}** — ${h.occurrences}x · ${h.scoreImpact} pts\n`;
      c += `*${h.fix}*\n\n`;
    });
  }

  if (actionLists.fix.length > 0) {
    c += `#### 🔴 Fix — κ_a Accumulated (${actionLists.fixTotal} total, showing top ${actionLists.fix.length})\n`;
    c += `*Fully reducible. Fix them.*\n\n`;
    actionLists.fix.forEach((h, i) => {
      const expTag = h.expiredKappaI ? ` ⚠️ *expired κ_i — was ${h.expiresDate}*` : '';
      c += `**${i+1}. ${h.type.replace(/_/g,' ')}** — ${h.occurrences}x · ${h.scoreImpact} pts${expTag}\n`;
      c += `*${h.fix}*\n\n`;
    });
    if (actionLists.fixTotal > actionLists.fix.length) {
      c += `*(+${actionLists.fixTotal - actionLists.fix.length} more — run full scan)*\n\n`;
    }
  }

  if (actionLists.mitigate.length > 0) {
    c += `#### 🟡 Mitigate — κ_c Conscripted (${actionLists.mitigateTotal} total)\n`;
    c += `*Domain constraints force these. Bound and instrument — do not eliminate.*\n\n`;
    actionLists.mitigate.forEach((h, i) => {
      c += `**${i+1}. ${h.type.replace(/_/g,' ')}** — ${h.occurrences}x\n`;
      c += `*Add explicit instrumentation. Accept the structural floor.*\n\n`;
    });
  }

  if ((actionLists.acceptTotal || 0) > 0) {
    c += `#### 🟢 Accept — κ_i Intentional (${actionLists.acceptTotal} active contracts)\n`;
    c += `*Documented tradeoffs with expiration dates. Review before they expire.*\n\n`;
    actionLists.accept.forEach((h, i) => {
      const daysLeft = Math.ceil((new Date(h.expiresDate) - new Date()) / 86400000);
      const urgency = daysLeft <= 14 ? ` 🔴 ${daysLeft}d left` : daysLeft <= 30 ? ` 🟡 ${daysLeft}d left` : ` (${daysLeft}d remaining)`;
      c += `**${i+1}.** expires **${h.expiresDate}**${urgency}\n`;
      c += `*${h.fix}*\n\n`;
    });
  }

  if (actionLists.fix.length === 0 && actionLists.amplify.length === 0) {
    c += `✅ No κ_a or σ findings. System is ρ-dominant.\n\n`;
  }

    // ── 7. WORST FILES ────────────────────────────────────────────────────────
  if (worstFiles.length > 0 && theta < 80) {
    c += `---\n\n### Files Needing Attention\n\n`;
    c += `| File | Θ | Findings | Lines |\n|---|---|---|---|\n`;
    worstFiles.slice(0,5).forEach(f => {
      const rel  = f.file.replace(process.cwd()+'/', '').replace(SCAN_DIR+'/', '');
      const fem  = f.score>=75?'🟢':f.score>=50?'🟡':f.score>=25?'🟠':'🔴';
      c += `| \`${rel}\` | ${fem} ${f.score}/100 | ${f.findings} | ${f.lines} |\n`;
    });
    c += '\n';
  }

  // ── 8. ROI ────────────────────────────────────────────────────────────────
  if (theta < 75) {
    c += `---\n\n### Annual Cost of κ\n\n`;
    c += `> ${TEAM_SIZE} engineers · ${formatMoney(roi.hourlyRate)}/hr`;
    if (process.env.DST_HOURS_RETRY) c += ` · custom multipliers`;
    c += `\n\n| Category | Annual |\n|---|---|\n`;
    if (roi.costs.retryManagement  > 0) c += `| Retry management | ${formatMoney(roi.costs.retryManagement)} |\n`;
    if (roi.costs.errorDebugging   > 0) c += `| Error debugging | ${formatMoney(roi.costs.errorDebugging)} |\n`;
    if (roi.costs.godObjectTax     > 0) c += `| God object tax | ${formatMoney(roi.costs.godObjectTax)} |\n`;
    if (roi.costs.stateDebugging   > 0) c += `| State debugging | ${formatMoney(roi.costs.stateDebugging)} |\n`;
    if (roi.costs.nPlusOneSlowness > 0) c += `| N+1 slowness | ${formatMoney(roi.costs.nPlusOneSlowness)} |\n`;
    c += `| Onboarding drain | ${formatMoney(roi.costs.onboardingDrain)} |\n`;
    c += `| Debt compounding | ${formatMoney(roi.costs.debtCompounding)} |\n`;
    c += `| **Total** | **${formatMoney(roi.totalAnnual)}** |\n\n`;
    c += `**Fix investment:** ${formatMoney(roi.refactorInvest)} · **Payback:** ${roi.paybackMonths}mo · **5yr ROI:** ${roi.fiveYearROI}%\n\n`;
  }

  // ── 9. SECURITY ───────────────────────────────────────────────────────────
  const secFindings = allFindings.filter(f => f.category === 'security');
  if (secFindings.length > 0) {
    c += `---\n\n### 🔒 Security Posture (Advisory)\n\n`;
    c += `> Advisory only — does not affect Θ score.\n\n`;
    const secGroups = {};
    secFindings.forEach(f => {
      if (!secGroups[f.type]) secGroups[f.type] = [];
      secGroups[f.type].push(f);
    });
    Object.entries(secGroups).forEach(([type, findings]) => {
      c += `**${sevEmoji(findings[0].severity)} ${type.replace(/_/g,' ')}** (${findings.length}x)\n`;
      c += `- *${FIX_MAP[type] || findings[0].fix}*\n`;
      findings.slice(0,2).forEach(f => { c += `  - Line ${f.line}: \`${f.code}\`\n`; });
      if (findings.length > 2) c += `  - *(+${findings.length-2} more)*\n`;
      c += '\n';
    });
  }

  // ── FOOTER ────────────────────────────────────────────────────────────────
  c += `---\n`;
  c += `*DST Framework v4 · [SSRN 6434119](https://ssrn.com/abstract=6434119) · `;
  c += `Idan Rephiah · ρ heals · κ hides · σ kills*\n`;
  c += `*[DST Theory](https://idanreph.github.io/dst--theory-/) · `;
  c += `[GitHub](https://github.com/idanreph/DST-framework)*`;

  // V4.5-final: self-diagnosis — scanner reports its own Θ
  if (process.env.DST_SELF_SCAN) {
    const self = runSelfScan();
    if (self) {
      c += `\n\n---\n*Scanner self-diagnosis: Θ = ${self.theta}/100 · ${self.regime} · AST: ${self.astActive ? 'active' : 'regex fallback'} · ${self.note}*`;
    }
  }

  return c;
}


// ── CONSOLE OUTPUT ────────────────────────────────────────────────────────
function buildConsoleOutput(result) {
  const { theta, regime, risk, warning, trend, kappaCount, sigmaCount,
          secCount, rhoCount, roi, worstFiles, allFindings,
          dThetaDt, obsGap, sigmaEff, kappaSat, regimePred, rewriteSignal, actionLists } = result;

  console.log('\n══════════════════════════════════════════════════');
  console.log('  DST DIAGNOSTIC — v4.5-final');
  console.log('══════════════════════════════════════════════════\n');

  // Rewrite signal — show first if triggered
  if (rewriteSignal && rewriteSignal.triggered) {
    console.log('  🔴 STRUCTURAL REPLACEMENT INDICATED');
    console.log(`     ${rewriteSignal.proposition}`);
    console.log(`     ${rewriteSignal.message}`);
    if (rewriteSignal.criticalModules.length > 0) {
      console.log('     Critical modules:');
      rewriteSignal.criticalModules.forEach(m => console.log(`       ${m.file} (Θ ${m.score})`));
    }
    console.log('');
  }

  console.log(`  Θ (real capacity):  ${theta}/100`);
  console.log(`  Apparent health:    ${obsGap.apparent}/100`);
  if (obsGap.gap > 0) console.log(`  Observability gap:  ⚠️  ${obsGap.gap} pts — ${obsGap.message}`);
  console.log(`  Regime:             ${regime.name}`);
  const dStr = dThetaDt && dThetaDt.rate !== null
    ? `${dThetaDt.arrow} ${dThetaDt.rate > 0 ? '+' : ''}${dThetaDt.rate} pts/PR`
    : 'first scan';
  console.log(`  dΘ/dt:              ${dStr}`);
  if (regimePred) console.log(`  Prediction:         ${regimePred.nextRegime} in ~${regimePred.sprintsUntil} PRs [${regimePred.urgency}]`);
  console.log(`  Risk:               ${risk.score}/100 [${risk.level}]`);
  console.log(`  κ saturation:       ${kappaSat.saturation}%`);
  console.log(`  σ_eff:              ${sigmaEff.eff} (${sigmaEff.note})`);
  console.log(`  Findings:           κ:${kappaCount} σ:${sigmaCount} ρ:${rhoCount} 🔒:${secCount}`);
  console.log('');

  if (warning) {
    console.log(`  ${warning.icon} ${warning.title}`);
    warning.lines.forEach(l => console.log(`    • ${l}`));
    console.log(`  → ${warning.action}\n`);
  }

  // Three action lists
  if (actionLists.amplify.length > 0) {
    console.log('  🔴 RESOLVE FIRST — σ amplifiers:');
    actionLists.amplify.forEach((h,i) => console.log(`     ${i+1}. ${h.type.replace(/_/g,' ')} (${h.occurrences}x)`));
    console.log('');
  }
  if (actionLists.fix.length > 0) {
    console.log(`  🔴 FIX — κ_a accumulated (${actionLists.fixTotal} total):`);
    actionLists.fix.forEach((h,i) => console.log(`     ${i+1}. ${h.type.replace(/_/g,' ')} (${h.occurrences}x · ${h.scoreImpact} pts)`));
    console.log('');
  }
  if (actionLists.mitigate.length > 0) {
    console.log(`  🟡 MITIGATE — κ_c conscripted (${actionLists.mitigateTotal} total):`);
    actionLists.mitigate.forEach((h,i) => console.log(`     ${i+1}. ${h.type.replace(/_/g,' ')} (${h.occurrences}x)`));
    console.log('');
  }

  if (worstFiles.length > 0 && theta < 80) {
    console.log('  WORST FILES:');
    worstFiles.slice(0,5).forEach(f => {
      const rel = f.file.replace(process.cwd()+'/', '');
      console.log(`  Θ${f.score}/100  ${rel}  (${f.findings} findings)`);
    });
    console.log('');
  }

  if (theta < 75) {
    console.log('  ANNUAL COST OF κ:');
    console.log(`  Total:     $${roi.totalAnnual.toLocaleString()}`);
    console.log(`  Payback:   ${roi.paybackMonths} months`);
    console.log(`  5yr ROI:   ${roi.fiveYearROI}%`);
    console.log('');
  }

  // V4.5-final: print structuredReport as JSON for pipeline consumers
  if (process.env.DST_JSON_OUTPUT) {
    console.log('\n── STRUCTURED REPORT (JSON) ───────────────────────────');
    console.log(JSON.stringify(result.structuredReport, null, 2));
    console.log('───────────────────────────────────────────────────────');
  }
  console.log('  ρ heals · κ hides · σ kills');
  console.log('  SSRN 6434119 · Idan Rephiah · 2026');
  console.log('══════════════════════════════════════════════════\n');
}

// ── GITHUB API ────────────────────────────────────────────────────────────
function postComment(body) {
  return new Promise((resolve) => {
    if (!GITHUB_TOKEN || !GITHUB_REPO || !PR_NUMBER) {
      console.log('No GitHub PR context — skipping comment');
      return resolve();
    }
    const [owner, repo] = GITHUB_REPO.split('/');
    const data = JSON.stringify({ body });
    const req = https.request({
      hostname: 'api.github.com',
      path:     `/repos/${owner}/${repo}/issues/${PR_NUMBER}/comments`,
      method:   'POST',
      headers:  {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type':  'application/json',
        'Content-Length': Buffer.byteLength(data),
        'User-Agent':    'dst-action/3.0',
      }
    }, (res) => {
      let b=''; res.on('data',d=>b+=d);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) console.log('✓ DST comment posted to PR');
        else console.error(`GitHub API error: ${res.statusCode}`);
        resolve();
      });
    });
    req.on('error', (e) => { console.error('Comment post error:', e.message); resolve(); });
    req.write(data); req.end();
  });
}

// ── MAIN ──────────────────────────────────────────────────────────────────
async function main() {
  const result = runFullScan(SCAN_DIR, { teamSize: TEAM_SIZE, engineerCost: ENGINEER_COST });

  buildConsoleOutput(result);

  if (PR_NUMBER) {
    const comment = buildComment(result);
    await postComment(comment);
  }

  // ── V4.5: THERMODYNAMIC CI GATES ─────────────────────────────────────
  // Gate 1: ΔΘ gate — cannot merge negative impact into Residual
  // Block because this PR makes it sicker — not because the system is sick.
  const prDelta = result.dThetaDt?.rate ?? 0;
  if (result.regime.name === 'Residual' && prDelta < 0) {
    console.error(`
❌ DST THERMODYNAMIC GATE TRIGGERED

System is in Residual regime (Θ = ${result.theta}/100).
This PR has a negative thermodynamic impact (ΔΘ = ${prDelta} pts/PR).

You cannot merge negative structural impact into a Residual system.
Required: Add at least one ρ healing pattern before merging.

DST Framework · Proposition 5 · SSRN 6434119 · Idan Rephiah · 2026`);
    process.exit(1);
  }

  // Gate 2: static Θ floor (legacy — still supported)
  if (FAIL_THRESHOLD > 0 && result.theta < FAIL_THRESHOLD) {
    console.error(`\nDST Θ ${result.theta} below threshold ${FAIL_THRESHOLD}. Failing CI.`);
    process.exit(1);
  }

  // Gate 3: risk score ceiling
  if (FAIL_RISK > 0 && result.risk.score > FAIL_RISK) {
    console.error(`\nDST risk score ${result.risk.score} above threshold ${FAIL_RISK}. Failing CI.`);
    process.exit(1);
  }

  // Gate 4: expired κ_i — warn, don't fail
  const expiredCount = result.actionLists?.expiredKappaICount || 0;
  if (expiredCount > 0) {
    console.warn(`\n⚠️  DST: ${expiredCount} expired @dst-kappa-i annotation(s) reclassified as κ_a. Fix or renew.`);
  }
}

main().catch(err => { console.error('DST Action error:', err); process.exit(1); });
