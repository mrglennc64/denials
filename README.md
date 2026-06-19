# Denial Correction Engine — Portfolio Demo

A working outpatient denial-management assistant by **Glenn Carter** ([@mrglennc64](https://github.com/mrglennc64)).
Built as a portfolio piece for healthcare-AI engineering work.

- **Live demo:** https://usedenialfix.com
- **Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Gemini
- **Status:** v1 — three sequential live model calls over synthetic denials

## What it does

From a denied claim to a corrected appeal, in three grounded steps:

1. **Analyze** — paste an EOB excerpt or denial letter; get a structured analysis (CARC/RARC code, category, payer, claim ID, the payer's stated reason, suggested root cause, confidence).
2. **Correct** — propose the corrected claim (CPT/HCPCS, modifiers, ICD-10-CM pointers) or flag it as a workflow issue, with a written rationale.
3. **Appeal** — generate a payer-ready appeal letter, a suggested-attachments list, and submission instructions. Export the whole case as one print-ready packet (PDF).

A `/dashboard` worklist shows how a denial team would triage a day's backlog — open/submitted/resolved queue, overturn rate, turnaround time, dollars at risk and recovered.

## Pages

| Route | Purpose |
|---|---|
| `/` | Landing — what this is, who built it, links to the rest |
| `/dashboard` | Denial worklist (queue + KPIs) |
| `/denials` | The interactive denial engine (analyze → correct → appeal) |
| `/architecture` | One-page HIPAA-aware production architecture |

`/dashboard` rows that are workable end-to-end link into the engine via `/denials?sample=<id>`.

## Run locally

```bash
npm install
cp .env.local.example .env.local   # add your GOOGLE_API_KEY
npm run dev
```

Open <http://localhost:4005>.

```bash
npm run build && npm start
```

The model calls use Google AI Studio (free tier). Get a key at <https://aistudio.google.com/apikey>.

## What this is NOT

- **Not HIPAA-compliant.** It is HIPAA-_aware_ (the architecture page documents the production path). No PHI is processed, transmitted, or stored.
- **Not a live payer integration.** Nothing is submitted anywhere — the corrected claim and appeal packet are generated for inspection, not transmission.
- **Synthetic denials only.** Sample EOB excerpts and claim contexts were written for the demo. No real payer correspondence.
- **Not legal, billing, or coding advice.** Output needs a certified coder and the payer-specific policy in front of them before any production claim is corrected or appealed.

## Project layout

```
app/
  page.tsx                  Landing
  layout.tsx                Root layout (header, footer, fonts, metadata)
  globals.css               Tailwind 4 @theme tokens (teal / slate palette)
  components/
    Container.tsx
    Header.tsx
    Footer.tsx
  dashboard/
    page.tsx                Denial worklist (queue + KPIs)
  denials/
    page.tsx                Engine entry (server component, reads ?sample=)
    DenialWorkspace.tsx      Client orchestrator + PDF packet export
  api/denial/
    analyze/route.ts        Step 1 — denial -> structured analysis
    correct/route.ts        Step 2 — analysis -> corrected claim
    appeal/route.ts         Step 3 — correction -> appeal packet
  architecture/
    page.tsx                HIPAA-aware production architecture
    DataFlowDiagram.tsx     SVG diagram (payer -> ingest -> minimize -> model -> rules -> reviewer -> payer)

lib/
  denial/
    sampleDenials.ts        Synthetic EOB excerpts + claim contexts
    dashboardData.ts        Synthetic worklist + KPI data
    schemas.ts              Zod schemas for each step's output
    prompts.ts              Prompts for analyze / correct / appeal
  geminiRetry.ts            Transient-error backoff around Gemini calls
```

## Roadmap (not promises)

- [ ] Deterministic catalog validation (CPT / ICD-10 / NCCI) over the suggested correction
- [ ] CARC/RARC interpretation checked against live payer policy and LCD tables
- [ ] Clearinghouse resubmission + payer appeals-channel routing (production path)
- [ ] Persistence + status tracking for the dashboard worklist

## Contact

Glenn Carter · [mrglenncarter@gmail.com](mailto:mrglenncarter@gmail.com) · [github.com/mrglennc64](https://github.com/mrglennc64)
