/**
 * Synthetic denial-queue data for the /dashboard workspace.
 * All payer names are fictional ("... Demonstration ..."). No PHI.
 *
 * Items whose `sampleId` matches a SAMPLE_DENIALS id are workable end-to-end
 * in the denial engine — the dashboard links them through to /denials.
 */

export type DenialQueueStatus = "new" | "in_progress" | "submitted" | "resolved";

export type DenialQueueItem = {
  id: string;
  claimId: string;
  patientLabel: string;
  payer: string;
  denialCode: string;
  category: string;
  /** Billed dollars at risk on the denied line(s). */
  amount: number;
  status: DenialQueueStatus;
  /** Days since the denial was received. */
  ageDays: number;
  /** Days until the payer's appeal deadline (negative = past due). */
  dueInDays: number;
  dateOfService: string;
  /** If set, this denial is workable in the engine at /denials?sample=<id>. */
  sampleId?: string;
};

export const DENIAL_QUEUE: DenialQueueItem[] = [
  {
    id: "q-44128",
    claimId: "ACME-2025-44128",
    patientLabel: "Patient A",
    payer: "Aetna Demonstration Health Plans",
    denialCode: "CO-16",
    category: "Missing information / modifier",
    amount: 218,
    status: "new",
    ageDays: 2,
    dueInDays: 28,
    dateOfService: "2025-04-12",
    sampleId: "co16-missing-mod",
  },
  {
    id: "q-77931",
    claimId: "MDM-2025-77931",
    patientLabel: "Patient B",
    payer: "Medicare Demonstration Administrative Contractor",
    denialCode: "CO-50",
    category: "Medical necessity (LCD)",
    amount: 642,
    status: "new",
    ageDays: 4,
    dueInDays: 116,
    dateOfService: "2025-03-22",
    sampleId: "co50-not-medically-necessary",
  },
  {
    id: "q-90214",
    claimId: "UHC-2025-90214",
    patientLabel: "Patient C",
    payer: "UnitedHealth Demonstration Group",
    denialCode: "CO-197",
    category: "Prior authorization",
    amount: 1180,
    status: "new",
    ageDays: 1,
    dueInDays: 29,
    dateOfService: "2025-05-08",
    sampleId: "co197-prior-auth",
  },
  {
    id: "q-51007",
    claimId: "ACME-2025-51007",
    patientLabel: "Patient D",
    payer: "Aetna Demonstration Health Plans",
    denialCode: "CO-97",
    category: "Bundled / inclusive service",
    amount: 96,
    status: "in_progress",
    ageDays: 6,
    dueInDays: 24,
    dateOfService: "2025-04-30",
  },
  {
    id: "q-33820",
    claimId: "CIG-2025-33820",
    patientLabel: "Patient E",
    payer: "Cigna Demonstration Network",
    denialCode: "CO-4",
    category: "Modifier inconsistent with procedure",
    amount: 304,
    status: "in_progress",
    ageDays: 9,
    dueInDays: 21,
    dateOfService: "2025-04-21",
  },
  {
    id: "q-12944",
    claimId: "BCD-2025-12944",
    patientLabel: "Patient F",
    payer: "BlueCross Demonstration of the Plains",
    denialCode: "CO-29",
    category: "Timely filing",
    amount: 410,
    status: "submitted",
    ageDays: 14,
    dueInDays: 9,
    dateOfService: "2025-03-05",
  },
  {
    id: "q-88105",
    claimId: "UHC-2025-88105",
    patientLabel: "Patient G",
    payer: "UnitedHealth Demonstration Group",
    denialCode: "CO-11",
    category: "Diagnosis inconsistent with procedure",
    amount: 175,
    status: "submitted",
    ageDays: 11,
    dueInDays: 17,
    dateOfService: "2025-04-02",
  },
  {
    id: "q-70233",
    claimId: "MDM-2025-70233",
    patientLabel: "Patient H",
    payer: "Medicare Demonstration Administrative Contractor",
    denialCode: "CO-18",
    category: "Duplicate claim",
    amount: 132,
    status: "resolved",
    ageDays: 19,
    dueInDays: 0,
    dateOfService: "2025-03-18",
  },
];

export const DENIAL_STATS = {
  /** Open = new + in_progress, the actionable backlog. */
  open: 5,
  submitted: 2,
  resolvedToday: 3,
  resolvedThisWeek: 17,
  /** Share of appealed denials overturned in the payer's favor (last 30d). */
  overturnRate: 71,
  /** Average days from denial received to appeal submitted. */
  avgTatDays: 2.4,
  /** Total billed dollars sitting in the open + submitted queue. */
  dollarsAtRisk: 3618,
  /** Recovered (paid-on-appeal) dollars in the last 7 days. */
  dollarsRecoveredWeek: 9240,
  /** Denials resolved per day, last 7 days (oldest → today). */
  dailyResolved: [4, 6, 3, 5, 2, 4, 3],
  topCategories: [
    { label: "Prior authorization", count: 9 },
    { label: "Medical necessity (LCD)", count: 7 },
    { label: "Missing info / modifier", count: 6 },
    { label: "Timely filing", count: 3 },
    { label: "Bundled / inclusive", count: 2 },
  ],
} as const;
