export type SourceRef = { section: string; title: string; url: string; lastChecked: string };

export type Answer = {
  questionId: number | null;
  mode: "ai" | "no-ai" | "not-covered";
  covered: boolean;
  verdict: "likely_yes" | "likely_no" | "unclear";
  verdictSummary: string;
  rules: { rule: string; source: SourceRef }[];
  whatYouNeed: string[];
  mistakes: string[];
  contact: { office: "construction" | "zoning" | "both"; reason: string };
  reminder: string;
  sources: SourceRef[];
  notAddedYet: { section: string; title: string }[];
};

export type PrecheckProject = {
  type: string;
  zone: string;
  size: string;
  height: string;
  front: string;
  side: string;
  rear: string;
  details: string;
};

export type PrecheckItem = {
  status: "ok" | "warn" | "missing";
  title: string;
  detail: string;
  source: SourceRef | null;
};

export type PrecheckResult = {
  mode: "ai" | "no-ai";
  summary: string;
  items: PrecheckItem[];
  sources: SourceRef[];
  notAddedYet: { section: string; title: string }[];
  checkedAt: string;
};
