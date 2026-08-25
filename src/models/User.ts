/** Public profile — safe to embed anywhere (host row, who's-playing, requester info). */
export interface UserSummary {
  id: string;
  name: string;
  initials: string;
  bio: string | null;
  /** CSS color value (hex or var()) used for the avatar background. Presentation
   *  detail carried on the fixture data, mirroring html/index.html's per-person
   *  hand-picked avatar colors. */
  color: string;
}
