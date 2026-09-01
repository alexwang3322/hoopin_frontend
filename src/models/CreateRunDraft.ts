import type { City, RunFormat, RunVisibility } from "./Run";

/** Host-a-run form state — field-for-field the same as html/index.html's
 *  #screen-create inputs (mirrors API_CONTRACT.md's CreateRunRequest, split
 *  into local date/start/end/timezone the way the form itself is laid out).
 *  `city` was missing here until the backend actually required it
 *  (CreateRunRequest.city is non-optional) — see frontend/CONTRACT_ALIGNMENT.md. */
export interface CreateRunDraft {
  title: string;
  description: string;
  date: string; // "2026-09-24"
  startTime: string; // "19:00"
  endTime: string; // "21:00"
  timezone: string;
  format: RunFormat;
  venueName: string;
  exactAddress: string;
  city: City;
  capacity: string; // kept as the raw input string; "" = unlimited
  visibility: RunVisibility;
  autoApprove: boolean;
}

export const BLANK_RUN_DRAFT: CreateRunDraft = {
  title: "Thursday Night Full Court",
  description:
    "Casual full-court run, all levels welcome. Bring a light and dark shirt — we split teams by colour.",
  date: "2026-09-24",
  startTime: "19:00",
  endTime: "21:00",
  timezone: "America/Los_Angeles",
  format: "5v5_full_court",
  venueName: "Kezar Pavilion, San Francisco",
  exactAddress: "755 Frederick St, San Francisco, CA 94117",
  city: "SF",
  capacity: "10",
  visibility: "public",
  autoApprove: true,
};
