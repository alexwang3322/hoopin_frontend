import type { UserSummary } from "../models/User";

/**
 * The shared profile directory — every avatar+name mention anywhere in the
 * app (card footers, host rows, requester rows, roster rows) looks a user up
 * here, ported 1:1 from html/index.html's `PROFILES` object.
 */
export const PROFILES: Record<string, UserSummary> = {
  u_jamie: {
    id: "u_jamie",
    name: "Jamie Tran",
    initials: "JT",
    color: "var(--accent)",
    bio: "Runs the Wednesday lunch crew · plays out of Kezar most weeks",
  },
  u_marcus: {
    id: "u_marcus",
    name: "Marcus Bell",
    initials: "MB",
    color: "var(--hardwood)",
    bio: "Hosts the Rosa Parks Sunday run",
  },
  u_priya: {
    id: "u_priya",
    name: "Priya Nair",
    initials: "PN",
    color: "#3E8161",
    bio: "Hosts Dolores Park 3v3",
  },
  u_deshawn: {
    id: "u_deshawn",
    name: "Deshawn Carter",
    initials: "DC",
    color: "#8C2F2F",
    bio: "West Oakland Tuesday night regular",
  },
  u_aiko: {
    id: "u_aiko",
    name: "Aiko Sato",
    initials: "AS",
    color: "#2E4A73",
    bio: "Point guard, plays Wednesdays",
  },
  u_noah: {
    id: "u_noah",
    name: "Noah Delgado",
    initials: "ND",
    color: "#8C2F2F",
    bio: "Runs a laid-back Sunday morning session at Bernal · brings the spare ball",
  },
  u_kai: {
    id: "u_kai",
    name: "Kai Fujimoto",
    initials: "KF",
    color: "#6B4C7A",
    bio: "Plays center, tall enough to prove it",
  },
  u_tyler: {
    id: "u_tyler",
    name: "Tyler Nguyen",
    initials: "TN",
    color: "#6B4C7A",
    bio: "Plays at the Presidio wall most weekends",
  },
  u_sam: {
    id: "u_sam",
    name: "Sam Okafor",
    initials: "SO",
    color: "#2E4A73",
    bio: "New to the city, ran pickup in Chicago",
  },
};
