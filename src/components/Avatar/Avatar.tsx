import styles from "./Avatar.module.css";

interface AvatarProps {
  initials: string;
  color: string;
  size?: "sm" | "md" | "lg";
}

export function Avatar({ initials, color, size = "md" }: AvatarProps) {
  return (
    <span className={`${styles.avatar} ${styles[size]}`} style={{ background: color }} aria-hidden="true">
      {initials}
    </span>
  );
}
