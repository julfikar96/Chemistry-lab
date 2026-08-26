import { ReactionRecord, ReactionType } from '../types';
import { VERIFIED_REACTIONS, evaluateReactionEngine, METAL_REACTIVITY_SERIES } from './reactionEngine';

export { VERIFIED_REACTIONS, evaluateReactionEngine, METAL_REACTIVITY_SERIES };

// Helper to look up a reaction by its ID
export function getReactionById(id: string): ReactionRecord | undefined {
  if (!id) return undefined;
  return VERIFIED_REACTIONS.find((r) => r.id.toLowerCase() === id.toLowerCase());
}

// Filter reactions by ReactionType
export function getReactionsByType(type: ReactionType | 'ALL'): ReactionRecord[] {
  if (type === 'ALL') return VERIFIED_REACTIONS;
  return VERIFIED_REACTIONS.filter((r) => r.reactionTypes.includes(type));
}

// Search reactions by term
export function searchReactions(query: string): ReactionRecord[] {
  if (!query || !query.trim()) return VERIFIED_REACTIONS;
  const q = query.toLowerCase().trim();
  return VERIFIED_REACTIONS.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      r.banglaName.toLowerCase().includes(q) ||
      r.equation.toLowerCase().includes(q) ||
      (r.wordEquationBangla && r.wordEquationBangla.toLowerCase().includes(q)) ||
      r.reactionTypes.some((t) => t.toLowerCase().includes(q))
  );
}
