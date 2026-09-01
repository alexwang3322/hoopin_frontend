/**
 * Deterministic id -> value hashing so covers/avatars are client-computed,
 * never stored or sent by the server (API_CONTRACT.md §6: "covers/avatars
 * are client-derived from hashing id"; `RunSummary.cover_seed = id`, "FE
 * hashes this client-side for the gradient cover"). A from-scratch fnv1a
 * matching that design intent — not required to match backend/src/lib/viewer.ts's
 * hash byte-for-byte (each client only needs to be internally consistent
 * with itself), and not a port of ui/figma-plugin/code.js's specific
 * fnv1a/coverPaint/avatarPaint functions.
 */
function fnv1a(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

const COVER_GRADIENTS = [
  "linear-gradient(120deg,#F0793A,#7A2E12)",
  "linear-gradient(115deg,#D9A05C,#6B4423)",
  "linear-gradient(125deg,#3E8161,#163A29)",
  "linear-gradient(110deg,#A4453D,#3D1414)",
  "linear-gradient(130deg,#3B4F70,#101820)",
  "linear-gradient(122deg,#6B4C7A,#241830)",
  "linear-gradient(118deg,#E0954B,#5C3A17)",
  "linear-gradient(128deg,#2E4A73,#101828)",
];

export function coverGradientFor(seed: string): string {
  return COVER_GRADIENTS[fnv1a(seed) % COVER_GRADIENTS.length]!;
}

export function avatarColorFor(seed: string): string {
  const hue = fnv1a(`avatar:${seed}`) % 360;
  return `hsl(${hue}, 45%, 42%)`;
}
