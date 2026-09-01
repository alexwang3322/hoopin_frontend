# Frontend ↔ API_CONTRACT.md Alignment

Tracks gaps found comparing `frontend/` against `../API_CONTRACT.md` (root). Check items off as they're fixed. Re-verify against the contract when done, not just against this list — the contract is the source of truth.

**Status:** as of wiring `frontend/` to the live `backend/` (Hono/D1), all data now round-trips through the real API — the backend enforces business rules server-side, and the mock layer (`src/mock/runs.ts`, `src/mock/profiles.ts`, `src/services/runService.ts`) has been deleted. Most items below are resolved as a direct consequence; the few still open are noted.

Legend: **P0** = produces wrong data today · **P1** = contract-specified behavior missing · **P2** = half-built feature · **P3** = lower priority / needs a contract-side decision too.

---

## P0 — capacity not enforced

- [x] **Approve doesn't check capacity before approving.**
  Fixed server-side: `backend/src/routes/requests.ts`'s `approve` handler checks `going_count >= capacity` and returns 409 `RUN_FULL` before approving. Frontend no longer has any local approve logic to be wrong.

- [x] **Auto-approve on request-to-join doesn't check capacity.**
  Fixed server-side: `backend/src/routes/requests.ts`'s create-request handler checks capacity on the auto-approve path too.

## P1 — contract-specified fields/behavior missing

- [x] **Create-run form has no `city` field.**
  Added `city: City` to `models/CreateRunDraft.ts` and a select to `pages/CreateRun/CreateRunPage.tsx`; threaded through `services/mappers.ts`'s `draftToWireRun`.

- [x] **City toggle in the header is cosmetic — never filters Discover.**
  Lifted into `context/AppStoreContext.tsx` (shared `city` state); `hooks/useRuns.ts` now sends it as `GET /runs?city=`, a real server-side filter.

- [x] **Timezone offset hardcoded to `-07:00`.**
  Resolved by construction: the frontend no longer computes `starts_at`/`ends_at` at all — it sends `date`/`start_time`/`end_time`/`timezone` to the API, and `backend/src/lib/time.ts` computes the correct offset via `Intl.DateTimeFormat`.

## P2 — half-built features

- [x] **No decline-reason input.**
  Added an inline reason field to `components/RequestCard/RequestCard.tsx`'s decline flow, threaded through `hooks/useRunDetail.ts`'s `decline(requestId, reason)` to `POST .../decline`'s `decline_reason` body field.

- [x] **Cover gradients/avatar colors hand-picked, not hash-derived from `id`.**
  `utils/hash.ts` (fnv1a-based, ported conceptually from the same idea backend/src/lib/viewer.ts uses) now computes `coverGradient`/`color` client-side from the server's `cover_seed`/`id` in `services/mappers.ts` — including for newly created runs, which previously all got the same hardcoded gradient.

## P3 — needs a contract-side decision, not just a frontend fix

- [x] **`distanceMiles` / distance filter had no contract counterpart.**
  Removed rather than backed — there was never a real data source for it (mock-only random numbers), and the contract still has no geo field/param. If a real "near me" feature is wanted, that needs a contract change (add `distance_miles` or lat/lng to `RunSummary`, a distance param to `GET /runs`) before it's worth re-adding here.

- [ ] **No cursor pagination in the UI.**
  The API returns proper `CursorPage<T>` (`next_cursor`) on every list now, and `services/wireTypes.ts`/`apiClient.ts` are fully typed for it — but no hook follows `next_cursor` yet (all lists just render the first page, default `limit=20`). Not a problem yet: total seed data is well under one page. Add "load more" to `useRuns`/`useHosting`/`useMyRequests` if/when a list grows past 20 items.

- [ ] **`useHosting`'s per-run pending count is an N+1.**
  New item, not in the original audit: `GET /me/hosting` returns `RunSummary[]`, which has no per-run pending-request count (only `HeaderCounts.hosting_pending_requests`, a single sum across all hosted runs, exists at summary level). `hooks/useHosting.ts` works around this by fetching each hosted run's detail in parallel to read `pending_requests.pending_count`. Fine at this project's scale (a handful of hosted runs); if the contract ever adds a dedicated summary field for this, switch to it instead.

---

## Already aligned (no action needed)

- `models/Run.ts`, `User.ts`, `JoinRequest.ts`, `HeaderCounts.ts` match §2 field-for-field (camelCase vs snake_case is a normal FE convention, not a gap). `Run` now also carries the detail-only fields (`exactAddress`, `pendingRequests`, `viewerRequest`, `viewerAction`) as truly-optional keys, mirroring the contract's own "absent key is meaningful" design for `RunDetail`.
- `RunFormat`/`RunVisibility`/`JoinRequestStatus` enums match exactly.
- `ViewerAction` now includes all 7 states from the contract (previously trimmed to 6, dropping `"signed_out"`, since there was no way to produce it against mock data) — still practically unreachable today since there's no sign-in flow and every request sends the dev-auth bearer token, but the type is honest now.
- Server-side `exact_address`/`pending_requests` gating (§6) is real now — enforced in `backend/src/lib/viewer.ts`, not just computed client-side.
- "No separate Attendee resource" rule (§1, §6) respected — `attendees` is derived from approved requests, not stored separately.

## Known follow-up (not a contract gap): real auth

Auth is still `backend/src/lib/auth.ts`'s local-dev-only `Bearer dev:<userId>` stub, sent by `services/apiClient.ts` — matches the contract's transport (§5) but not a real issuer. Wiring Clerk (or another issuer) is tracked separately, not in this file.
