import { useToast } from "../../context/ToastContext";
import styles from "./ToastHost.module.css";

export function ToastHost() {
  const { message } = useToast();
  return (
    <div className={`${styles.toast} ${message ? styles.show : ""}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}
