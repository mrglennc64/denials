import Link from "next/link";
import { Container } from "@/app/components/Container";

export default function HomePage() {
  return (
    <>
      <section className="border-b border-border">
        <Container className="py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[2.1fr_1.4fr] gap-10 lg:gap-12 items-start">
            <div>
              <p className="text-sm font-medium text-brand">
                Denial management · portfolio
              </p>
              <h1 className="mt-2 text-4xl lg:text-5xl font-semibold leading-tight tracking-tight text-text">
                From a denied claim to a corrected appeal — in minutes.
              </h1>
              <p className="mt-5 text-lg text-text-muted max-w-xl">
                Paste an EOB excerpt or denial letter. Get a structured denial
                analysis, a proposed corrected claim, and a payer-ready appeal
                packet — every step grounded in the original denial text.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/denials"
                  className="rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-hover"
                >
                  Try the denial engine →
                </Link>
                <Link
                  href="/dashboard"
                  className="rounded-md border border-border-strong px-4 py-2.5 text-sm font-medium text-text hover:bg-bg-soft"
                >
                  Open the worklist →
                </Link>
              </div>
              <p className="mt-6 text-sm text-text-subtle max-w-xl">
                A focused denial-correction workflow — structured, auditable
                outputs for billers and denial teams. Demo runs on synthetic
                denials; the production path is BAA-gated and described on the{" "}
                <Link href="/architecture" className="text-brand hover:underline">
                  architecture page
                </Link>
                .
              </p>
            </div>
            <SessionSnapshot />
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-14 lg:py-16 max-w-5xl">
          <h2 className="text-2xl font-semibold text-text">
            One workflow, three grounded steps.
          </h2>
          <p className="mt-3 text-text-muted max-w-2xl">
            When a payer rejects a claim, the work is the same every time: read
            the denial, figure out the correction, and write a defensible
            appeal. The engine does each step as an explicit, inspectable model
            call.
          </p>
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
            <StepCard
              n="1"
              title="Analyze"
              body="Parse the EOB or denial letter into a structured analysis: CARC/RARC code, category, payer, claim ID, the payer's stated reason, and a suggested root cause — with a confidence score."
            />
            <StepCard
              n="2"
              title="Correct"
              body="Propose the corrected claim: revised CPT/HCPCS, modifiers, and ICD-10-CM pointers — or flag it as a workflow issue (e.g. missing prior auth) when no coding change applies — with a written rationale."
            />
            <StepCard
              n="3"
              title="Appeal"
              body="Generate a payer-ready appeal letter with reusable, defensible language, a suggested-attachments list, and submission instructions. Export the whole case as one print-ready packet."
            />
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-bg-muted">
        <Container className="py-14 lg:py-16 max-w-5xl">
          <h2 className="text-2xl font-semibold text-text">Why this matters</h2>
          <p className="mt-3 text-text-muted max-w-2xl">
            Outpatient clinics and billing teams lose real revenue when denials
            are worked ad hoc — out of inboxes and one-off documents. Denial
            teams get a structured, inspectable system instead, with a record of
            what was changed and why.
          </p>
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
            <Card
              title="For denial teams"
              bullets={[
                "Standardize how denials are parsed and corrected.",
                "Generate consistent, payer-ready appeal letters.",
                "Keep a structured record of what was changed and why.",
              ]}
            />
            <Card
              title="For billing leadership"
              bullets={[
                "Track open, submitted, and resolved denials at a glance.",
                "See dollars at risk and dollars recovered on appeal.",
                "Move from improvised appeals to a repeatable process.",
              ]}
            />
          </div>
        </Container>
      </section>

      <section className="border-t border-border">
        <Container className="py-14 lg:py-16 max-w-5xl">
          <h2 className="text-2xl font-semibold text-text">Who it&apos;s for</h2>
          <p className="mt-3 text-text-muted max-w-2xl">
            Built for teams that live in outpatient denials and appeals — and
            need a system that reflects real workflows instead of screenshots.
          </p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card
              compact
              title="Outpatient clinics"
              bullets={[
                "Primary care, specialty, telehealth, urgent care.",
                "Work denials without new EHR integrations.",
              ]}
            />
            <Card
              compact
              title="Billing companies (RCM)"
              bullets={[
                "One denial-correction layer across multiple clinics.",
                "Standardize how denials are corrected and appealed.",
              ]}
            />
            <Card
              compact
              title="Telehealth & healthcare SaaS"
              bullets={[
                "Embed a denial workflow alongside existing tools.",
                "Exportable packets for internal or external review.",
              ]}
            />
            <Card
              compact
              title="Denial management teams"
              bullets={[
                "Move from ad-hoc appeals to a repeatable process.",
                "Structured record of each denial and response.",
              ]}
            />
            <Card
              compact
              title="Revenue-cycle leadership"
              bullets={[
                "Visibility into dollars at risk and overturn rates.",
                "A defensible, auditable appeal trail.",
              ]}
            />
            <Card
              compact
              title="Healthcare engineering teams"
              bullets={[
                "Working, inspectable architecture for denial handling.",
                "Reference implementation for a real-world workflow.",
              ]}
            />
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-bg-muted">
        <Container className="py-14 lg:py-16 max-w-5xl">
          <h2 className="text-2xl font-semibold text-text">What you get</h2>
          <p className="mt-3 text-text-muted max-w-2xl">
            A focused denial-correction tool with outputs that can be inspected,
            exported, and defended.
          </p>
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5">
            <Card
              title="Engine"
              bullets={[
                "Denial reason parsing into a structured analysis.",
                "Correction text for resubmission.",
                "Structured appeal-letter generation.",
                "One-click print-ready case packet (PDF).",
              ]}
            />
            <Card
              title="Worklist"
              bullets={[
                "Queue of open, submitted, and resolved denials.",
                "KPIs: open backlog, overturn rate, turnaround time.",
                "Dollars at risk and recovered on appeal.",
                "Top denial categories at a glance.",
              ]}
            />
          </div>
          <p className="mt-5 text-sm text-text-subtle max-w-2xl">
            HIPAA-aware architecture — no marketing claim of compliance, just an
            honest, documented production path with BAA-gated model serving,
            encryption, audit logging, and a Safe Harbor de-identification
            boundary. Details on the{" "}
            <Link href="/architecture" className="text-brand hover:underline">
              architecture page
            </Link>
            .
          </p>
        </Container>
      </section>

      <section className="border-t border-border">
        <Container className="py-14 lg:py-16 max-w-3xl">
          <h2 className="text-2xl font-semibold text-text">
            Start from a denied claim
          </h2>
          <p className="mt-3 text-text-muted">
            Paste a denial and walk it through analysis, correction, and appeal
            — or open the worklist to see how a denial team would triage a day&apos;s
            backlog.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/denials"
              className="rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-hover"
            >
              Try the denial engine →
            </Link>
            <Link
              href="/dashboard"
              className="rounded-md border border-border-strong px-4 py-2.5 text-sm font-medium text-text hover:bg-bg-soft"
            >
              Open the worklist →
            </Link>
          </div>
          <p className="mt-6 text-sm text-text-subtle">
            Available for remote contract or full-time work on healthcare-AI
            systems — denial automation, clinical NLP, RCM automation, EHR
            integration.{" "}
            <a
              href="mailto:mrglenncarter@gmail.com"
              className="text-brand hover:underline"
            >
              mrglenncarter@gmail.com
            </a>
            .
          </p>
        </Container>
      </section>
    </>
  );
}

function SessionSnapshot() {
  return (
    <div className="rounded-lg border border-border bg-bg p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-text-subtle uppercase tracking-wider">
          Example case
        </p>
        <span className="text-xs text-text-subtle font-mono">
          1 denial · 3 steps
        </span>
      </div>

      <div className="space-y-3">
        <SnapshotRow
          system="denial"
          code="CO-16"
          description="Claim lacks information / missing modifier"
          status="analyzed · root cause identified"
          tone="warn"
        />
        <SnapshotRow
          system="correct"
          code="25"
          description="Append modifier 25 to the E/M line"
          status="correction proposed"
          tone="ok"
        />
        <SnapshotRow
          system="appeal"
          code="—"
          description="Payer-ready appeal letter + attachments"
          status="packet generated"
          tone="brand"
        />
      </div>

      <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs">
        <span className="text-text-muted">Appeal packet</span>
        <span className="text-ok font-medium">Ready to export</span>
      </div>
    </div>
  );
}

function SnapshotRow({
  system,
  code,
  description,
  status,
  tone,
}: {
  system: string;
  code: string;
  description: string;
  status: string;
  tone: "ok" | "warn" | "brand";
}) {
  const border =
    tone === "ok" ? "border-ok" : tone === "warn" ? "border-warn" : "border-brand";
  const statusColor =
    tone === "ok" ? "text-ok" : tone === "warn" ? "text-warn" : "text-brand";

  return (
    <div className={`border-l-2 ${border} pl-3`}>
      <div className="flex items-baseline gap-2 text-sm">
        <span className="font-mono text-[10px] uppercase text-text-subtle tracking-wider">
          {system}
        </span>
        <span className="font-mono font-semibold text-text">{code}</span>
      </div>
      <p className="mt-0.5 text-xs text-text-muted">{description}</p>
      <p className={`mt-1 text-xs ${statusColor}`}>{status}</p>
    </div>
  );
}

function StepCard({
  n,
  title,
  body,
}: {
  n: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-bg p-6 flex flex-col">
      <span className="self-start text-[10px] font-semibold uppercase tracking-wider text-brand bg-brand-soft rounded px-2 py-0.5">
        Step {n}
      </span>
      <h3 className="mt-3 text-xl font-semibold text-text">{title}</h3>
      <p className="mt-3 text-sm text-text-muted">{body}</p>
    </div>
  );
}

function Card({
  title,
  bullets,
  compact,
}: {
  title: string;
  bullets: string[];
  compact?: boolean;
}) {
  return (
    <div className={`rounded-lg border border-border bg-bg ${compact ? "p-4" : "p-5"}`}>
      <h3 className={`font-semibold text-text ${compact ? "text-sm" : "text-base"}`}>
        {title}
      </h3>
      <ul className={`mt-2 space-y-1.5 ${compact ? "text-xs" : "text-sm"} text-text-muted`}>
        {bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="mt-1.5 inline-block h-1 w-1 rounded-full bg-brand shrink-0" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
