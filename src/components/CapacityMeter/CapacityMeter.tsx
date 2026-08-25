import styles from "./CapacityMeter.module.css";

interface CapacityMeterProps {
  going: number;
  capacity: number | null;
}

export function CapacityMeter({ going, capacity }: CapacityMeterProps) {
  const text = capacity === null ? `${going} going · unlimited` : `${going} going of ${capacity}`;
  const pct = capacity ? Math.min(100, Math.round((going / capacity) * 100)) : 0;
  return (
    <div>
      <span className={`${styles.capText} num`}>{text}</span>
      {capacity !== null && (
        <div className={styles.meter}>
          <div className={styles.fill} style={{ width: `${pct}%` }} />
        </div>
      )}
    </div>
  );
}
