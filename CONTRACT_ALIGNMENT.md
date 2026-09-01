# Frontend ↔ API_CONTRACT.md Alignment

Tracks gaps found comparing `frontend/` against `../API_CONTRACT.md` (root). Check items off as they're fixed. Re-verify against the contract when done, not just against this list — the contract is the source of truth.

Legend: **P0** = produces wrong data today, even mock-only · **P1** = contract-specified behavior missing · **P2** = half-built feature · **P3** = lower priority / needs a contract-side decision too.

---

## P0 — capacity not enforced

- [ ] **Approve doesn't check capacity before approving.**
  Contract: §3.2 — "Capacity is enforced server-side in `approve` (409 `RUN_FULL`)... never client-only."
  Where: `src/services/runService.ts` `applyApprove` (~L35-42); `src/components/RequestCard/RequestCard.tsx` (Approve button has no `isFull` awareness).
  Fix: guard `applyApprove` with `if (run.capacity !== null && run.goingCount >= run.capacity) return run` (or surface an error/toast); disable Approve in the UI when full.

- [ ] **Auto-approve on request-to-join doesn't check capacity.**
  Contract: §3.2 — "...and in the auto-approve path on create — never client-only."
  Where: `src/services/runService.ts` `applyRequestToJoin` (~L57-69).
  Fix: same capacity guard before setting `status: "approved"` on the auto-approve branch.

## P1 — contract-specified fields/behavior missing

- [ ] **Create-run form has no `city` field; every new run hardcodes `"SF"`.**
  Contract: §2 — `CreateRunRequest.city: "SF" | "OAK"` is required.
  Where: `src/models/CreateRunDraft.ts` (no `city` prop); `src/pages/CreateRun/CreateRunPage.tsx` (no input); `src/services/runService.ts` `applyPublish` (~L128, hardcodes `city: "SF"`).
  Fix: add `city: City` to `CreateRunDraft`, add a select to the form, thread it through `draftToRunFields`/`applyPublish`.

- [ ] **City toggle in the header is cosmetic — never filters Discover.**
  Contract: §3.1 — `GET /runs` supports `city` as an optional, combinable filter.
  Where: `src/components/Layout/RootLayout.tsx` (~L14-16, ~L55-62) — local state, comment admits it's decorative; `src/hooks/useRuns.ts` `DiscoverFilters` has no `city`.
  Fix: lift city selection into shared state (context or lifted to `useRuns`), filter `getDiscoverRuns` by it.

- [ ] **Timezone offset hardcoded to `-07:00` regardless of selected timezone.**
  Contract: §6 — `ZonedDateTimeString` must carry the *correct* UTC offset for its `timezone`, never naive/zone-less.
  Where: `src/services/runService.ts` `draftToRunFields` (~L86-87); `src/pages/CreateRun/CreateRunPage.tsx` timezone field is free-text with no validation (~L107).
  Fix: constrain timezone to a known set with a correct offset lookup, or compute the offset properly instead of hardcoding Pacific.

## P2 — half-built features

- [ ] **No decline-reason input — write path missing though read path exists.**
  Where: `src/hooks/useRunDetail.ts` `decline` hardcodes `reason: null` (~L25-34); `src/components/RequestCard/RequestCard.tsx` Decline button takes no input (~L36-38). Contrast with `src/mock/runs.ts` (~L68-70) which seeds a declined request *with* a reason, and `src/pages/EventDetail/EventDetailPage.tsx` (~L167) which renders it when present.
  Fix: add a reason textarea to the decline flow, thread through `useRunDetail.decline`.

- [ ] **Cover gradients are hand-picked per run, not hash-derived from `id`.**
  Contract: §6 — "covers/avatars are client-derived from hashing `id`"; `RunSummary.cover_seed = id`, FE hashes client-side. Confirmed pattern: `ui/figma-plugin/code.js`'s `fnv1a`/`coverPaint`/`avatarPaint`.
  Where: `src/models/Run.ts` (~L70-71, literal `coverGradient` string per run); `src/services/runService.ts` `applyPublish` (~L136, every new run gets the same hardcoded gradient regardless of id); `src/mock/profiles.ts` (hand-picked hex `color` per user, same issue for avatars).
  Fix: port an `fnv1a`-style hash → gradient/color function into `src/utils/`, seed it with `id`, compute at render/create time instead of storing static fixture values.

## P3 — needs a contract-side decision, not just a frontend fix

- [ ] **`distanceMiles` / distance filter has no contract counterpart.**
  Where: `src/models/Run.ts` `distanceMiles` (~L69); `src/pages/Discover/DiscoverPage.tsx` distance filter (~L37-48); `src/hooks/useRuns.ts` (~L41).
  Contract has no `distance_miles`/geo field on `RunSummary`/`RunDetail` and no distance param on `GET /runs` (§2, §3.1).
  Fix: either add `distance_miles` (or lat/lng) to the contract and a distance query param to `GET /runs`, or flag to product that this stays mock-only until backend geo support is designed.

- [ ] **No cursor pagination anywhere.**
  Contract: §6 — cursor pagination (`CursorPage<T>`) is explicitly asked for "even though the current mockup renders flat unpaginated lists — an intentional addition beyond the mockup's demo scope."
  Where: `src/services/runService.ts` `getDiscoverRuns`/`getHostingRuns`/`getMyRequests` all return plain arrays; none of `useRuns`/`useHosting`/`useMyRequests` model `next_cursor`.
  Fix: lower priority — decide whether to model pagination in the mock layer now (so hooks/components already expect a `CursorPage<T>` shape) or defer until a real backend exists.

---

## Already aligned (no action needed)

- `models/Run.ts`, `User.ts`, `JoinRequest.ts`, `HeaderCounts.ts` match §2 field-for-field (camelCase vs snake_case is a normal FE convention, not a gap).
- `RunFormat`/`RunVisibility`/`JoinRequestStatus` enums match exactly.
- `ViewerAction` trimmed 7→6 states (no `"signed_out"`) is correct and documented — there's no sign-in flow, so that state is unreachable by construction.
- `isAddressUnlocked` (`services/runService.ts` ~L26-29) correctly gates `exact_address` to host-or-approved.
- "No separate Attendee resource" rule (§1, §6) respected — `attendees` is derived from approved requests, not stored separately.
