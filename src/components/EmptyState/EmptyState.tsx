import styles from "./EmptyState.module.css";

export function EmptyState({ message = "There are no events now." }: { message?: string }) {
  return <p className={styles.empty}>{message}</p>;
}
