import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/app/components/Container";
import {
  DENIAL_QUEUE,
  DENIAL_STATS,
  type DenialQueueItem,
  type DenialQueueStatus,
} from "@/lib/denial/dashboardData";

export const metadata: Metadata = {
  title: "Dashboard — Denial workspace",
  description:
    "Denial-management workspace: KPI strip, a worklist of open denials awaiting appeal, recovery throughput, and the top denial categories.",
};

export default function DashboardPage() {
  const open = DENIAL_QUEUE.filter(
    (d) => d.status === "new" || d.status === "in_progress",
  );
  const submitted = DENIAL_QUEUE.filter((d) => d.status === "submitted");

  return (
    <div className="bg-bg-muted">
      <Container className="py-8 lg:py-10">
        <header className="mb-6">
          <p className="text-sm font-medium text-brand">Denial workspace</p>
          <h1 className="mt-1 text-2xl lg:text-3xl font-semibold text-text">
            Today&apos;s denial worklist
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            What a denial-management specialist sees on log-in. KPIs are
            last-7-day aggregates; the worklist is hand-built sample data — pick
            a denial to open it in the engine and generate a correction and
            appeal.
          </p>
        </header>

        <KpiStrip
          open={open.length}
          submitted={submitted.length}
          resolvedToday={DENIAL_STATS.resolvedToday}
          overturnRate={DENIAL_STATS.overturnRate}
          avgTatDays={DENIAL_STATS.avgTatDays}
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          <Worklist open={open} submitted={submitted} />
          <Sidebar />
        </div>
      </Container>
    </div>
  );
}

function KpiStrip({
  open,
  submitted,
  resolvedToday,
  overturnRate,
  avgTatDays,
}: {
  open: number;
  submitted: number;
  resolvedToday: number;
  overturnRate: number;
  avgTatDays: number;
}) {
  const items: { label: string; value: string; tone?: "ok" | "warn" }[] = [
    { label: "Open", value: String(open), tone: open > 0 ? "warn" : undefined },
    { label: "Submitted", value: String(submitted) },
    { label: "Resolved today", value: String(resolvedToday), tone: "ok" },
    { label: "Overturn rate (30d)", value: `${overturnRate}%`, tone: "ok" },
    { label: "Avg TAT", value: `${avgTatDays}d` },
  ];
  return (
    <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 lg:gap-3">
      {items.map((it) => (
        <div
          key={it.label}
          className="rounded-lg border border-border bg-bg px-3 py-3"
        >
          <dt className="text-[10px] uppercase tracking-wide text-text-subtle">
            {it.label}
          </dt>
          <dd
            className={
              "mt-1 text-2xl font-semibold tabular-nums " +
              (it.tone === "ok"
                ? "text-ok"
                : it.tone === "warn"
                ? "text-warn"
                : "text-text")
            }
          >
            {it.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Worklist({
  open,
  submitted,
}: {
  open: DenialQueueItem[];
  submitted: DenialQueueItem[];
}) {
  return (
    <section
      aria-label="Denial worklist"
      className="rounded-lg border border-border bg-bg overflow-hidden"
    >
      <header className="flex items-baseline justify-between px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-text">
          Worklist{" "}
          <span className="text-text-subtle font-normal">
            ({open.length + submitted.length})
          </span>
        </h2>
        <span className="text-xs text-text-subtle">
          click a denial to work it
        </span>
      </header>
      <ul className="divide-y divide-border">
        {[...open, ...submitted].map((d) => (
          <DenialRow key={d.id} denial={d} />
        ))}
      </ul>
    </section>
  );
}

function DenialRow({ denial }: { denial: DenialQueueItem }) {
  const href = denial.sampleId
    ? `/denials?sample=${denial.sampleId}`
    : "/denials";
  const dueTone =
    denial.dueInDays <= 10
      ? "text-bad"
      : denial.dueInDays <= 20
      ? "text-warn"
      : "text-text-subtle";

  return (
    <li>
      <Link href={href} className="block px-4 py-3 hover:bg-bg-soft transition">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-mono text-xs text-text-subtle">
            {denial.claimId}
          </span>
          <CodeBadge code={denial.denialCode} />
          <StatusBadge status={denial.status} />
          <span className="ml-auto font-mono text-sm tabular-nums text-text">
            ${denial.amount.toLocaleString()}
          </span>
        </div>
        <p className="mt-1 text-sm text-text-muted line-clamp-1">
          {denial.payer} · {denial.category}
        </p>
        <div className="mt-1.5 flex items-center gap-3 text-xs text-text-subtle">
          <span>DOS {denial.dateOfService}</span>
          <span aria-hidden>·</span>
          <span>{denial.ageDays}d in queue</span>
          <span aria-hidden>·</span>
          <span className={dueTone}>
            {denial.dueInDays <= 0
              ? "appeal due"
              : `${denial.dueInDays}d to deadline`}
          </span>
          {denial.sampleId && (
            <>
              <span aria-hidden>·</span>
              <span className="text-brand">workable in engine</span>
            </>
          )}
        </div>
      </Link>
    </li>
  );
}

function CodeBadge({ code }: { code: string }) {
  return (
    <span className="rounded bg-brand-soft text-brand-hover px-1.5 py-0.5 text-[10px] font-mono font-semibold">
      {code}
    </span>
  );
}

function StatusBadge({ status }: { status: DenialQueueStatus }) {
  const cfg =
    status === "new"
      ? { label: "New", cls: "bg-bg-soft text-text-muted" }
      : status === "in_progress"
      ? { label: "In progress", cls: "bg-warn/10 text-warn" }
      : status === "submitted"
      ? { label: "Submitted", cls: "bg-brand-soft text-brand-hover" }
      : { label: "Resolved", cls: "bg-ok/10 text-ok" };
  return (
    <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

function Sidebar() {
  const peak = Math.max(...DENIAL_STATS.dailyResolved);
  return (
    <aside className="space-y-4">
      <section className="rounded-lg border border-border bg-bg p-4">
        <h3 className="text-sm font-semibold text-text">Recovered · 7d</h3>
        <p className="mt-0.5 text-2xl font-semibold tabular-nums text-ok">
          ${DENIAL_STATS.dollarsRecoveredWeek.toLocaleString()}
        </p>
        <p className="mt-1 text-xs text-text-subtle">
          paid on appeal · ${DENIAL_STATS.dollarsAtRisk.toLocaleString()} still
          at risk
        </p>
      </section>

      <section className="rounded-lg border border-border bg-bg p-4">
        <h3 className="text-sm font-semibold text-text">Resolved · 7d</h3>
        <p className="mt-0.5 text-xs text-text-subtle">denials closed per day</p>
        <div className="mt-3 flex items-end gap-1.5 h-20">
          {DENIAL_STATS.dailyResolved.map((v, i) => {
            const h = Math.max(8, Math.round((v / peak) * 72));
            const isToday = i === DENIAL_STATS.dailyResolved.length - 1;
            return (
              <div
                key={i}
                className={`flex-1 rounded-t ${isToday ? "bg-brand" : "bg-brand-soft"}`}
                style={{ height: `${h}px` }}
                title={`${v} denials`}
                aria-label={`Day ${i + 1}: ${v} denials`}
              />
            );
          })}
        </div>
        <p className="mt-2 text-xs text-text-subtle">
          {DENIAL_STATS.resolvedThisWeek} this week · peak {peak}/day
        </p>
      </section>

      <section className="rounded-lg border border-border bg-bg p-4">
        <h3 className="text-sm font-semibold text-text">Top categories · 30d</h3>
        <ul className="mt-2 space-y-1.5">
          {DENIAL_STATS.topCategories.map((c) => (
            <li
              key={c.label}
              className="flex items-baseline justify-between text-xs"
            >
              <span className="text-text-muted">{c.label}</span>
              <span className="font-mono tabular-nums text-text">{c.count}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-border bg-bg-muted p-4 text-xs text-text-muted">
        All data is synthetic — no PHI.{" "}
        <Link href="/architecture" className="text-brand hover:underline">
          See the production architecture →
        </Link>
      </section>
    </aside>
  );
}
