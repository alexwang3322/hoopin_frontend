import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppState } from "../../context/AppStoreContext";
import { useCreateRun } from "../../hooks/useCreateRun";
import { BLANK_RUN_DRAFT, type CreateRunDraft } from "../../models/CreateRunDraft";
import type { Run } from "../../models/Run";
import { splitIsoDateTime } from "../../utils/time";
import styles from "./CreateRunPage.module.css";

function runToDraft(run: Run): CreateRunDraft {
  const start = splitIsoDateTime(run.startsAt);
  const end = splitIsoDateTime(run.endsAt);
  return {
    title: run.title,
    description: run.description,
    date: start.date,
    startTime: start.time,
    endTime: end.time,
    timezone: run.timezone,
    format: run.format,
    venueName: run.venueName,
    exactAddress: run.exactAddress,
    capacity: run.capacity === null ? "" : String(run.capacity),
    visibility: run.visibility,
    autoApprove: run.autoApprove,
  };
}

/** Reads which draft (if any) is being edited from the URL. Wraps the actual
 *  form in a component keyed on that identity so navigating between "fresh
 *  create" and "edit draft X" (e.g. clicking the topbar's "Host a run" while
 *  already editing a draft) remounts the form instead of leaving stale
 *  field values behind — the same route/component instance would otherwise
 *  persist whatever useState was initialized with on first mount. */
export function CreateRunPage() {
  const [searchParams] = useSearchParams();
  const draftRunId = searchParams.get("draft");
  const { runs } = useAppState();
  const editingRun = draftRunId ? runs.find((r) => r.id === draftRunId) : undefined;

  return <CreateRunForm key={draftRunId ?? "new"} editingRun={editingRun} />;
}

function CreateRunForm({ editingRun }: { editingRun: Run | undefined }) {
  const navigate = useNavigate();
  const { publish } = useCreateRun();
  const [form, setForm] = useState<CreateRunDraft>(() => (editingRun ? runToDraft(editingRun) : BLANK_RUN_DRAFT));
  const [busy, setBusy] = useState(false);

  const heading = editingRun ? "Edit draft" : "Host a run";
  const subtitle = editingRun
    ? "Finish filling this in, then publish when you're ready."
    : "You'll review each request to play before anyone gets the address.";

  const update = <K extends keyof CreateRunDraft>(key: K, value: CreateRunDraft[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const canPublish = useMemo(() => form.title.trim().length > 0, [form.title]);

  const handlePublish = async () => {
    setBusy(true);
    try {
      await publish(form, editingRun?.id ?? null);
      navigate("/hosting");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.pageHead}>
        <h1>{heading}</h1>
        <p>{subtitle}</p>
      </div>

      <div className={styles.form}>
        <label className={styles.field}>
          <span>Title</span>
          <input type="text" value={form.title} onChange={(e) => update("title", e.target.value)} />
        </label>

        <label className={styles.field}>
          <span>Description</span>
          <textarea rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} />
        </label>

        <div className={styles.fieldRow}>
          <label className={styles.field}>
            <span>Date</span>
            <input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} />
          </label>
          <label className={styles.field}>
            <span>Start</span>
            <input type="time" value={form.startTime} onChange={(e) => update("startTime", e.target.value)} />
          </label>
          <label className={styles.field}>
            <span>End</span>
            <input type="time" value={form.endTime} onChange={(e) => update("endTime", e.target.value)} />
          </label>
        </div>

        <label className={styles.field}>
          <span>
            Timezone <em className={styles.hint}>times always display in the run's zone</em>
          </span>
          <input type="text" value={form.timezone} onChange={(e) => update("timezone", e.target.value)} />
        </label>

        <label className={styles.field}>
          <span>Format</span>
          <select value={form.format} onChange={(e) => update("format", e.target.value as CreateRunDraft["format"])}>
            <option value="5v5_full_court">5v5 · Full court</option>
            <option value="3v3_half_court">3v3 · Half court</option>
          </select>
        </label>

        <label className={styles.field}>
          <span>
            Court name <em className={styles.hint}>public — shown on the feed</em>
          </span>
          <input type="text" value={form.venueName} onChange={(e) => update("venueName", e.target.value)} />
        </label>

        <label className={styles.field}>
          <span>
            Exact address <em className={styles.hint}>private — only approved players see this</em>
          </span>
          <input type="text" value={form.exactAddress} onChange={(e) => update("exactAddress", e.target.value)} />
        </label>

        <div className={styles.fieldRow}>
          <label className={styles.field}>
            <span>
              Capacity <em className={styles.hint}>blank = unlimited</em>
            </span>
            <input type="number" min={1} value={form.capacity} onChange={(e) => update("capacity", e.target.value)} />
          </label>
          <label className={styles.field}>
            <span>Visibility</span>
            <select
              value={form.visibility}
              onChange={(e) => update("visibility", e.target.value as CreateRunDraft["visibility"])}
            >
              <option value="public">Public — listed in Discover</option>
              <option value="private">Private — invite link only</option>
            </select>
          </label>
        </div>

        <label className={styles.checkboxRow}>
          <input type="checkbox" checked={form.autoApprove} onChange={(e) => update("autoApprove", e.target.checked)} />
          <span>
            <strong>Approve everyone automatically</strong>
            <span>Requests are accepted instantly instead of waiting on you.</span>
          </span>
        </label>

        <div className={styles.formActions}>
          <button type="button" className={styles.primaryBtn} disabled={busy || !canPublish} onClick={handlePublish}>
            {busy ? "Publishing…" : "Publish run"}
          </button>
          <button type="button" className={styles.ghostBtn} onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </div>
      <p className={styles.footnote}>Publishing adds this run to Hosting.</p>
    </div>
  );
}
