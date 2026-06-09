import type { Metadata } from "next";
import { Container } from "@/app/components/Container";
import { DataFlowDiagram } from "./DataFlowDiagram";

export const metadata: Metadata = {
  title: "Architecture — HIPAA-aware denial management",
  description:
    "Production architecture for a denial-correction service: data flow from payer denial to a corrected claim and appeal, BAA-gated model serving, encryption, audit logging, and honest limitations.",
};

export default function ArchitecturePage() {
  return (
    <Container className="py-10 lg:py-14 max-w-3xl">
      <header className="mb-8">
        <p className="text-sm font-medium text-brand">Architecture · v2</p>
        <h1 className="mt-1 text-3xl font-semibold text-text">
          HIPAA-aware denial management
        </h1>
        <p className="mt-3 text-text-muted">
          The portfolio demo runs on synthetic denials so it never breaks and
          never touches PHI. Below is the production path it stands in for — the
          choices a real deployment would make to handle protected health
          information legally and safely. <em>HIPAA-aware</em>, not{" "}
          <em>HIPAA-certified</em>: there is no such certification body, and any
          real claim of compliance comes from signed BAAs and SOC 2 / HITRUST
          audits, not a marketing label.
        </p>

        <div className="mt-5 rounded-md border-l-4 border-brand bg-bg-muted p-4">
          <p className="text-sm font-semibold text-text">
            Rule 0: PHI never leaves a BAA-covered endpoint.
          </p>
          <p className="mt-1 text-sm text-text-muted">
            No pasting denial letters, EOBs, or claim context into public
            ChatGPT, Gemini, Grok, or Claude.ai. If a tool that touches the
            request body doesn&apos;t have a signed BAA, the only thing that can
            reach it is data run through the Safe Harbor de-identification step
            first.
          </p>
        </div>
      </header>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-text mb-4">Data flow</h2>
        <DataFlowDiagram />
        <ol className="mt-4 space-y-2 text-sm text-text-muted list-decimal list-inside">
          <li>
            <strong className="text-text">Denial intake.</strong> A denial
            arrives as an 835 electronic remittance from the clearinghouse, a
            scanned EOB / paper denial letter, or a payer-portal export. The
            payload carries CARC/RARC codes, the payer&apos;s stated reason, and
            enough claim context to identify the original submission.
          </li>
          <li>
            <strong className="text-text">Ingest gateway.</strong> Receives the
            denial inside the customer-tenanted VPC, validates payload, stamps a
            correlation ID, writes an immutable audit record, and stores the raw
            denial encrypted at rest (AES-256, customer-managed KMS key).
          </li>
          <li>
            <strong className="text-text">PHI minimization.</strong> Strip the
            18 Safe Harbor identifiers (§164.514(b)(2)) before the prompt:
            member names and IDs, geographic subdivisions smaller than state,
            dates more precise than year, phone, fax, email, SSN, MRN, account,
            plan number, device identifiers, URLs, IPs, biometric IDs, photos,
            and any other unique identifying number. The model sees the denial
            reason, the CARC/RARC codes, and the de-identified claim context —
            not the patient or subscriber identity.
          </li>
          <li>
            <strong className="text-text">Model serving (BAA gate).</strong>{" "}
            Calls go to a foundation model under a signed BAA — Gemini via{" "}
            <strong>Google Vertex AI</strong> (HIPAA-eligible under a Google
            Cloud BAA), Claude via <strong>AWS Bedrock</strong>, GPT-class via{" "}
            <strong>Azure OpenAI Service</strong>, or a self-hosted open model
            (Llama-3, Mistral) inside the VPC. The public Google AI Studio /
            Anthropic / OpenAI APIs without a BAA are <strong>not</strong> a
            permissible path. The demo on this site uses Google AI Studio
            because its inputs are synthetic; the only change to run in
            production is the SDK endpoint and a signed BAA.
          </li>
          <li>
            <strong className="text-text">Policy &amp; rule engine.</strong> The
            three model steps (analyze → correct → appeal) propose a root cause,
            a corrected claim, and an appeal letter; a deterministic
            post-processor validates suggested CPT / ICD-10-CM / HCPCS against
            current catalogs, checks the CARC/RARC interpretation against the
            payer&apos;s published policy and the relevant LCD, and confirms the
            appeal respects the payer&apos;s filing deadline. Rule violations
            become flags shown to the human reviewer.
          </li>
          <li>
            <strong className="text-text">Human-in-the-loop review.</strong>{" "}
            Every AI-suggested correction and appeal is validated by a certified
            coder or denial specialist before anything is submitted — AI
            proposes, a human decides. The reviewer sees the supporting evidence
            from the denial text and chooses to <code>accept</code>,{" "}
            <code>edit</code>, or <code>reject</code> the suggestion. Rejected
            suggestions are logged back to the vendor for accuracy tuning.
          </li>
          <li>
            <strong className="text-text">Submit correction / appeal.</strong>{" "}
            The corrected claim posts back through the clearinghouse as a
            resubmission, or the appeal packet routes to the payer&apos;s appeals
            channel (portal upload, fax, or mail). The denial status updates and
            the case is tracked to resolution. Every read, write, decision, and
            outbound call is in the audit log.
          </li>
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-text mb-4">
          The HIPAA controls that actually matter
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CONTROLS.map((c) => (
            <div
              key={c.title}
              className="rounded-md border border-border bg-bg-muted p-4"
            >
              <h3 className="text-sm font-semibold text-text">{c.title}</h3>
              <p className="mt-1 text-sm text-text-muted">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-text mb-4">
          BAA: the clauses that actually matter
        </h2>
        <p className="text-sm text-text-muted mb-3">
          &ldquo;HIPAA-eligible&rdquo; is a vendor checkbox. The BAA is where the
          eligibility is enforced. Four clauses I look for before signing:
        </p>
        <ul className="space-y-2 text-sm text-text-muted list-disc list-inside">
          <li>
            <strong className="text-text">No training on PHI.</strong> The vendor
            cannot use customer prompts, completions, or any payload-derived data
            to train, fine-tune, or evaluate models — for this customer or any
            other.
          </li>
          <li>
            <strong className="text-text">No retention after task completion.</strong>{" "}
            PHI is held only as long as needed to return the response, then
            deleted. Any cache (prompt cache, KV cache, batch buffer) is scoped to
            the request and purged.
          </li>
          <li>
            <strong className="text-text">No commingling across tenants.</strong>{" "}
            Tenant data is logically isolated; no shared embeddings store, no
            shared evaluation set, no &ldquo;learn from all customers&rdquo;
            feature.
          </li>
          <li>
            <strong className="text-text">No PHI in vendor logs.</strong> Whatever
            the vendor logs for debugging, abuse detection, or analytics excludes
            request/response bodies — or hashes them. PHI in a log line is still
            a breach.
          </li>
        </ul>
        <p className="mt-3 text-sm text-text-muted">
          If a vendor won&apos;t put these in writing, the tool is for synthetic
          or de-identified data only. That covers prototyping; it does not cover
          production.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-text mb-4">
          Ongoing compliance
        </h2>
        <ul className="space-y-2 text-sm text-text-muted list-disc list-inside">
          <li>
            <strong className="text-text">Annual security risk assessment.</strong>{" "}
            Per §164.308(a)(1)(ii)(A), the SRA runs at minimum yearly — re-map
            data flows, re-check access controls, re-verify that every PHI hop
            still ends at a BAA-covered endpoint.
          </li>
          <li>
            <strong className="text-text">Re-assess when a vendor turns on an AI feature.</strong>{" "}
            A denial or billing tool that adds an &ldquo;AI assist&rdquo; toggle
            six months after contract signing is a new data flow, even if the
            vendor calls it an &ldquo;enhancement.&rdquo; Trigger an
            out-of-cycle SRA and confirm the BAA still covers the new processing
            path.
          </li>
          <li>
            <strong className="text-text">BAA refresh on vendor change.</strong>{" "}
            Sub-processor list changes, new AI capabilities, new data residency
            — any of these require revisiting the agreement, not waiting for the
            renewal date.
          </li>
          <li>
            <strong className="text-text">Reject-flag feedback loop.</strong>{" "}
            Reviewer rejections and edits feed back to the vendor as accuracy
            signal — without sending the underlying PHI. The signal is
            &ldquo;this correction was wrong in context Y,&rdquo; not the denial
            letter.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-text mb-4">
          From this public demo to a private BAA testbed
        </h2>
        <p className="text-sm text-text-muted mb-3">
          The site you&apos;re reading is a public demo on synthetic data. If a
          prospect signs a BAA and wants to evaluate against real denials, the
          live data does <em>not</em> go through{" "}
          <code>denials.usesmpt.com</code>. The codebase deploys a second time
          into a private environment with different config. The deltas:
        </p>
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full text-sm">
            <thead className="bg-bg-muted text-text">
              <tr>
                <th className="text-left font-semibold px-3 py-2 border-b border-border">
                  Concern
                </th>
                <th className="text-left font-semibold px-3 py-2 border-b border-border">
                  Public demo (this URL)
                </th>
                <th className="text-left font-semibold px-3 py-2 border-b border-border">
                  Private testbed (post-BAA)
                </th>
              </tr>
            </thead>
            <tbody className="text-text-muted">
              {TESTBED_DELTAS.map((row, i) => (
                <tr key={row.concern} className={i % 2 ? "bg-bg-muted/40" : ""}>
                  <td className="px-3 py-2 align-top font-medium text-text">
                    {row.concern}
                  </td>
                  <td className="px-3 py-2 align-top">{row.publicDemo}</td>
                  <td className="px-3 py-2 align-top">{row.privateTestbed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-text-muted mt-3">
          The codebase is one deploy target; the surrounding infrastructure is
          what changes. Standing up the private testbed is a config swap and a
          DNS record, not a rewrite — typically a one-day setup after BAA
          execution.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-text mb-4">
          Honest limitations of this prototype
        </h2>
        <ul className="space-y-2 text-sm text-text-muted list-disc list-inside">
          <li>
            <strong className="text-text">No live payer integration.</strong>{" "}
            Nothing is submitted anywhere. The corrected claim and appeal packet
            are generated for inspection, not transmission. A production build
            would post resubmissions through a clearinghouse and route appeals to
            each payer&apos;s channel.
          </li>
          <li>
            <strong className="text-text">No live catalog / policy lookup.</strong>{" "}
            Suggested CPT and ICD-10 codes are not validated against current
            AMA/CMS catalogs here, and CARC/RARC interpretation isn&apos;t checked
            against live payer policy or LCD tables. That deterministic layer is
            the next step.
          </li>
          <li>
            <strong className="text-text">Synthetic denials only.</strong> All
            sample EOB excerpts and claim contexts were written for this demo.
            No real payer correspondence and no PHI is, has been, or will be
            processed by this app.
          </li>
          <li>
            <strong className="text-text">Three single-shot calls, no agent loop.</strong>{" "}
            Each step is one model call with the prior step&apos;s result as
            input. No retry beyond transient-error backoff, no critic pass, no
            tool use. Deliberate simplicity for v1.
          </li>
          <li>
            <strong className="text-text">Outpatient scope.</strong> The samples
            model outpatient professional-claim denials. Facility, DME, and
            specialty-specific denial patterns each need their own evaluation.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-text mb-4">What this demonstrates</h2>
        <p className="text-sm text-text-muted">
          The model can call APIs — that&apos;s the easy part. What separates a
          credible build from a demo screenshot is: a denial workflow broken into
          explicit, inspectable steps (analyze → correct → appeal), output
          grounded in the actual denial text rather than invented, an exportable
          case packet a human can defend, and an architecture that names{" "}
          <em>where the PHI goes</em> at every hop. That&apos;s the gap I&apos;m
          optimizing the demo and this page to close.
        </p>
      </section>
    </Container>
  );
}

const TESTBED_DELTAS: {
  concern: string;
  publicDemo: string;
  privateTestbed: string;
}[] = [
  {
    concern: "Host",
    publicDemo: "Hostinger shared VPS — no HIPAA BAA available",
    privateTestbed: "AWS / GCP / Azure region under a signed BAA",
  },
  {
    concern: "Model endpoint",
    publicDemo: "Public Gemini API (not BAA-eligible)",
    privateTestbed: "Vertex AI, Bedrock, or Azure OpenAI under BAA",
  },
  {
    concern: "PHI guard",
    publicDemo: "Safe Harbor detector blocks submission",
    privateTestbed: "Detector still runs, but as audit-only logging — PHI is permitted",
  },
  {
    concern: "Banner",
    publicDemo: "“Synthetic data only — no PHI”",
    privateTestbed: "“Authorized BAA testing · Client: ⟨name⟩ · Engagement: ⟨id⟩”",
  },
  {
    concern: "Access",
    publicDemo: "Open to the public internet",
    privateTestbed: "IP allow-list, basic auth or SSO, optionally mTLS",
  },
  {
    concern: "Audit log",
    publicDemo: "Dev-only console output",
    privateTestbed:
      "Append-only log: timestamp, user, hashed correlation ID, outcome — never the denial body",
  },
  {
    concern: "Data retention",
    publicDemo: "No persistence — request-scoped",
    privateTestbed:
      "Configurable per engagement (default: no persistence; opt-in encrypted store for QA review)",
  },
  {
    concern: "URL",
    publicDemo: "denials.usesmpt.com",
    privateTestbed: "denials-private.⟨client⟩.usesmpt.com or per-client subdomain",
  },
];

const CONTROLS: { title: string; body: string }[] = [
  {
    title: "Business Associate Agreement",
    body:
      "Signed BAA with the covered entity before any PHI moves; cascading BAAs with the cloud provider and the model provider. A vendor that won't sign is disqualified — full stop.",
  },
  {
    title: "Encryption in transit & at rest",
    body:
      "TLS 1.2+ everywhere, AES-256 at rest with customer-managed KMS keys. Object-level keys for denial storage so a breach radius is one record, not a bucket.",
  },
  {
    title: "Access controls & audit logs",
    body:
      "RBAC with MFA, least-privilege IAM. Every PHI read/write/decision logged with user, timestamp, and correlation ID — but log records reference a hashed correlation ID, never the denial body. Logs themselves write-once, append-only.",
  },
  {
    title: "BAA-gated model serving",
    body:
      "Inference goes to Bedrock / Azure OpenAI under BAA, or a self-hosted model in a HIPAA-eligible VPC. Public Anthropic / OpenAI APIs are off-limits for PHI.",
  },
  {
    title: "Data minimization",
    body:
      "Send only the denial reason, CARC/RARC codes, and de-identified claim context. Strip member ID, MRN, and account numbers before the prompt. The model never needs the patient's identity to correct a claim.",
  },
  {
    title: "SOC 2 Type II + HITRUST",
    body:
      "Self-attested HIPAA + third-party audited security controls. Penetration testing, employee training, breach notification procedures. The paperwork is the moat.",
  },
];
