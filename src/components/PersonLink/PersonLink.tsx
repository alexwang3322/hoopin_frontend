import type { UserSummary } from "../../models/User";
import { Avatar } from "../Avatar/Avatar";
import { usePersonNavigate } from "../../hooks/usePersonNavigate";
import styles from "./PersonLink.module.css";

interface PersonLinkProps {
  user: UserSummary;
  subtitle?: string;
  size?: "sm" | "md" | "lg";
}

/** The single reusable "avatar + name" link used everywhere a person is
 *  mentioned — card footers, host rows, requester rows, roster rows.
 *  Routes to Account when the person is the viewer, Profile otherwise. */
export function PersonLink({ user, subtitle, size = "sm" }: PersonLinkProps) {
  const goToPerson = usePersonNavigate();
  return (
    <button type="button" className={styles.link} onClick={() => goToPerson(user.id)}>
      <Avatar initials={user.initials} color={user.color} size={size} />
      <span className={styles.text}>
        <span className={styles.name}>{user.name}</span>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </span>
    </button>
  );
}
