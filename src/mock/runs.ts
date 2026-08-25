import type { Run } from "../models/Run";
import type { JoinRequest } from "../models/JoinRequest";
import { PROFILES } from "./profiles";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const now = () => Date.now();
const ago = (ms: number) => new Date(now() - ms).toISOString();

function joinRequest(
  id: string,
  runId: string,
  requesterId: string,
  status: JoinRequest["status"],
  createdAgoMs: number,
  opts: { message?: string | null; declineReason?: string | null; decidedAgoMs?: number } = {},
): JoinRequest {
  return {
    id,
    runId,
    requester: PROFILES[requesterId],
    message: opts.message ?? null,
    status,
    createdAt: ago(createdAgoMs),
    decidedAt: opts.decidedAgoMs !== undefined ? ago(opts.decidedAgoMs) : status === "pending" ? null : ago(createdAgoMs / 2),
    declineReason: opts.declineReason ?? null,
  };
}

// -------------------------------------------------------------------------
// Kezar Pavilion Lunch Run — the one run the viewer (Jamie Tran) hosts, and
// the only one with a live pending-requests queue + roster in
// html/index.html's original markup. Ported from KEZAR_DEFAULT + the
// pendingList/whoList fixture rows.
// -------------------------------------------------------------------------
const kezarRequests: JoinRequest[] = [
  // Pending — the requests-to-play queue.
  joinRequest("req_tyler", "ev_kezar_lunch", "u_tyler", "pending", 4 * HOUR, {
    message:
      "Looking for a lunch run closer to my office — used to run at the Presidio on weekends but the commute's rough midweek.",
  }),
  joinRequest("req_sam", "ev_kezar_lunch", "u_sam", "pending", 1 * DAY, {
    message:
      "Just moved from Chicago, used to run at the park district gyms there. Can vouch I show up on time and pass the ball.",
  }),
  // Approved — "Who's playing" roster (host, Jamie, isn't a JoinRequest; the
  // roster is exactly the approved-request set, per API_CONTRACT.md's "an
  // approved JoinRequest IS roster membership" rule).
  joinRequest("req_marcus_kezar", "ev_kezar_lunch", "u_marcus", "approved", 6 * DAY),
  joinRequest("req_aiko_kezar", "ev_kezar_lunch", "u_aiko", "approved", 5 * DAY),
  joinRequest("req_priya_kezar", "ev_kezar_lunch", "u_priya", "approved", 5 * DAY),
  joinRequest("req_noah_kezar", "ev_kezar_lunch", "u_noah", "approved", 4 * DAY),
  joinRequest("req_kai_kezar", "ev_kezar_lunch", "u_kai", "approved", 3 * DAY),
];

// The viewer's own outgoing requests against other hosts' runs — these back
// the My Runs screen. Unlike the original prototype (a hardcoded 3-row list
// that silently omits an "approved" Presidio relationship its own
// RUN_DETAIL fixture implies), My Runs here is derived from this same
// request data, so all four show up.
const rosaParksRequests: JoinRequest[] = [
  joinRequest("req_jamie_rosa", "ev_rosa_parks", "u_jamie", "approved", 10 * DAY, { decidedAgoMs: 9 * DAY }),
];
const doloresRequests: JoinRequest[] = [
  joinRequest("req_jamie_dolores", "ev_dolores_3v3", "u_jamie", "pending", 2 * DAY),
];
const westOaklandRequests: JoinRequest[] = [
  joinRequest("req_jamie_westoak", "ev_west_oakland", "u_jamie", "declined", 14 * DAY, {
    declineReason: "Full this month — try the October run.",
    decidedAgoMs: 13 * DAY,
  }),
];
const presidioRequests: JoinRequest[] = [
  joinRequest("req_jamie_presidio", "ev_presidio", "u_jamie", "approved", 9 * DAY, { decidedAgoMs: 8 * DAY }),
];

function attendeesOf(requests: JoinRequest[]): Run["attendees"] {
  return requests.filter((r) => r.status === "approved").map((r) => r.requester);
}

export const INITIAL_RUNS: Run[] = [
  {
    id: "ev_rosa_parks",
    title: "Rosa Parks Sunday Run",
    description:
      "Full-court Sunday morning run, coffee after for whoever's still got legs. Casual pace, all levels welcome.",
    startsAt: "2026-09-06T08:00:00-07:00",
    endsAt: "2026-09-06T10:00:00-07:00",
    timezone: "America/Los_Angeles",
    format: "5v5_full_court",
    venueName: "Rosa Parks Fields, San Francisco",
    exactAddress: "600 John F Shelley Dr, San Francisco, CA 94134",
    city: "SF",
    host: PROFILES.u_marcus,
    capacity: 10,
    baseGoingCount: 7, // host + 6 unnamed attendees; the 8th is Jamie's approved request below
    goingCount: 8,
    isFull: false,
    isDraft: false,
    visibility: "public",
    autoApprove: false,
    createdAt: ago(20 * DAY),
    distanceMiles: 1.2,
    coverGradient: "linear-gradient(120deg,#F0793A,#7A2E12)",
    attendees: attendeesOf(rosaParksRequests),
    requests: rosaParksRequests,
  },
  {
    id: "ev_dolores_3v3",
    title: "Dolores Park 3v3",
    description:
      "Half-court 3v3 at the Dolores Park courts. Winners stay on, losers grab water for the next game.",
    startsAt: "2026-09-07T18:00:00-07:00",
    endsAt: "2026-09-07T20:00:00-07:00",
    timezone: "America/Los_Angeles",
    format: "3v3_half_court",
    venueName: "Dolores Park Courts, San Francisco",
    exactAddress: "19th & Dolores St, San Francisco, CA 94114",
    city: "SF",
    host: PROFILES.u_priya,
    capacity: 6,
    baseGoingCount: 4, // host + 3 unnamed attendees; Jamie's request is still pending, not counted
    goingCount: 4,
    isFull: false,
    isDraft: false,
    visibility: "public",
    autoApprove: false,
    createdAt: ago(15 * DAY),
    distanceMiles: 2.8,
    coverGradient: "linear-gradient(115deg,#D9A05C,#6B4423)",
    attendees: attendeesOf(doloresRequests),
    requests: doloresRequests,
  },
  {
    id: "ev_kezar_lunch",
    title: "Kezar Pavilion Lunch Run",
    description:
      "Full-court, next-basket-wins, call your own fouls. Bring a light shirt and a dark shirt — we split teams by colour when everyone's in. Doors unlock 15 minutes early.",
    startsAt: "2026-09-09T12:00:00-07:00",
    endsAt: "2026-09-09T13:00:00-07:00",
    timezone: "America/Los_Angeles",
    format: "5v5_full_court",
    venueName: "Kezar Pavilion, San Francisco",
    exactAddress: "755 Frederick St, San Francisco, CA 94117",
    city: "SF",
    host: PROFILES.u_jamie,
    capacity: 10,
    baseGoingCount: 1, // the host counts as the 6th, per the original's own comment
    goingCount: 6,
    isFull: false,
    isDraft: false,
    visibility: "public",
    autoApprove: false,
    createdAt: ago(25 * DAY),
    distanceMiles: 3.5,
    coverGradient: "linear-gradient(125deg,#3E8161,#163A29)",
    attendees: attendeesOf(kezarRequests),
    requests: kezarRequests,
  },
  {
    id: "ev_west_oakland",
    title: "West Oakland Tuesday Run",
    description:
      "Full-court Tuesday night run at DeFremery. Regulars fill this one fast — it's already at capacity.",
    startsAt: "2026-09-15T18:30:00-07:00",
    endsAt: "2026-09-15T20:30:00-07:00",
    timezone: "America/Los_Angeles",
    format: "5v5_full_court",
    venueName: "DeFremery Park, West Oakland",
    exactAddress: "1651 Adeline St, Oakland, CA 94607",
    city: "OAK",
    host: PROFILES.u_deshawn,
    capacity: 10,
    baseGoingCount: 10, // host + 9 unnamed attendees — already full
    goingCount: 10,
    isFull: true,
    isDraft: false,
    visibility: "public",
    autoApprove: false,
    createdAt: ago(30 * DAY),
    distanceMiles: 9.6,
    coverGradient: "linear-gradient(110deg,#A4453D,#3D1414)",
    attendees: attendeesOf(westOaklandRequests),
    requests: westOaklandRequests,
  },
  {
    id: "ev_presidio",
    title: "Presidio Wednesday Pickup",
    description:
      "Half-court wall-ball at the Presidio courts. Small group, high rep count — good for getting shots up.",
    startsAt: "2026-09-16T18:00:00-07:00",
    endsAt: "2026-09-16T19:30:00-07:00",
    timezone: "America/Los_Angeles",
    format: "3v3_half_court",
    venueName: "Presidio Wall Courts, San Francisco",
    exactAddress: "Presidio Blvd & Anza St, San Francisco, CA 94129",
    city: "SF",
    host: PROFILES.u_aiko,
    capacity: 6,
    baseGoingCount: 2, // host + 1 unnamed attendee; the 3rd is Jamie's approved request below
    goingCount: 3,
    isFull: false,
    isDraft: false,
    visibility: "public",
    autoApprove: false,
    createdAt: ago(12 * DAY),
    distanceMiles: 5.1,
    coverGradient: "linear-gradient(130deg,#3B4F70,#101820)",
    attendees: attendeesOf(presidioRequests),
    requests: presidioRequests,
  },
  {
    id: "ev_bernal",
    title: "Bernal Rec Center Run",
    description:
      "Full-court Sunday morning run at Bernal. New run, still finding its regulars — come early to grab a side.",
    startsAt: "2026-09-20T09:00:00-07:00",
    endsAt: "2026-09-20T11:00:00-07:00",
    timezone: "America/Los_Angeles",
    format: "5v5_full_court",
    venueName: "Bernal Heights Rec Center, San Francisco",
    exactAddress: "500 Cortland Ave, San Francisco, CA 94110",
    city: "SF",
    host: PROFILES.u_noah,
    capacity: 10,
    baseGoingCount: 2, // host + 1 unnamed attendee
    goingCount: 2,
    isFull: false,
    isDraft: false,
    visibility: "public",
    autoApprove: false,
    createdAt: ago(3 * DAY),
    distanceMiles: 4.0,
    coverGradient: "linear-gradient(122deg,#6B4C7A,#241830)",
    attendees: [],
    requests: [],
  },
  // A draft the viewer is hosting — never listed in Discover (drafts are
  // excluded from the discover feed everywhere, including the original).
  {
    id: "ev_sunday_skills_draft",
    title: "Sunday Skills Clinic",
    description: "Ball-handling and shooting drills before the run — still figuring out logistics.",
    startsAt: "2026-10-04T10:00:00-07:00",
    endsAt: "2026-10-04T10:00:00-07:00",
    timezone: "America/Los_Angeles",
    format: "5v5_full_court",
    venueName: "",
    exactAddress: "",
    city: "SF",
    host: PROFILES.u_jamie,
    capacity: null,
    baseGoingCount: 0,
    goingCount: 0,
    isFull: false,
    isDraft: true,
    visibility: "public",
    autoApprove: false,
    createdAt: ago(2 * DAY),
    distanceMiles: 0,
    coverGradient: "linear-gradient(118deg,#E0954B,#5C3A17)",
    attendees: [],
    requests: [],
  },
];
