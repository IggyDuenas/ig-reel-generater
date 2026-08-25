import type { GameState, Player, Club } from '../types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

function clampCheck(v: number, name: string, min = 1, max = 100, errors: string[]) {
  if (v < min || v > max) errors.push(`${name} out of range: ${v} (expected ${min}–${max})`);
}

export function validatePlayer(p: Player, clubs: Record<string, Club>): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!p.id) errors.push('Player missing ID');
  if (!p.name) errors.push('Player missing name');
  if (p.age < 15 || p.age > 45) errors.push(`Unlikely age: ${p.age}`);

  clampCheck(p.currentAbility, 'currentAbility', 1, 100, errors);
  clampCheck(p.potentialAbility, 'potentialAbility', 1, 100, warnings);
  if (p.potentialAbility < p.currentAbility) {
    warnings.push(`Potential (${p.potentialAbility}) below current ability (${p.currentAbility})`);
  }

  // Attribute range checks
  const t = p.attributes.technical;
  const m = p.attributes.mental;
  const ph = p.attributes.physical;
  const g = p.attributes.goalkeeper;
  const allAttrs: [string, number][] = [
    ...Object.entries(t), ...Object.entries(m), ...Object.entries(ph), ...Object.entries(g),
  ];
  for (const [name, val] of allAttrs) {
    if (val < 1 || val > 100) errors.push(`Attr ${name}=${val} out of 1-100`);
  }

  if (!p.clubId || !clubs[p.clubId]) {
    errors.push(`Player ${p.name} belongs to invalid club: ${p.clubId}`);
  }

  if (!p.contract?.expiryDate) errors.push('Missing contract expiry');

  return { valid: errors.length === 0, errors, warnings };
}

export function validateClub(club: Club, players: Record<string, Player>): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!club.id) errors.push('Club missing ID');
  if (!club.name) errors.push('Club missing name');

  const seen = new Set<string>();
  for (const pid of club.playerIds) {
    if (seen.has(pid)) errors.push(`Duplicate player ID in squad: ${pid}`);
    seen.add(pid);
    if (!players[pid]) errors.push(`Squad contains unknown player: ${pid}`);
  }

  if (club.playerIds.length < 11) warnings.push(`Small squad: ${club.playerIds.length} players`);

  return { valid: errors.length === 0, errors, warnings };
}

export function validateGameState(state: GameState): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Unique player IDs
  const playerIds = Object.keys(state.players);
  const uniqueIds = new Set(playerIds);
  if (uniqueIds.size !== playerIds.length) errors.push('Duplicate player IDs detected');

  for (const player of Object.values(state.players)) {
    const r = validatePlayer(player, state.clubs);
    errors.push(...r.errors.map(e => `[${player.name}] ${e}`));
    warnings.push(...r.warnings.map(w => `[${player.name}] ${w}`));
  }

  for (const club of Object.values(state.clubs)) {
    const r = validateClub(club, state.players);
    errors.push(...r.errors.map(e => `[${club.name}] ${e}`));
    warnings.push(...r.warnings.map(w => `[${club.name}] ${w}`));
  }

  return { valid: errors.length === 0, errors, warnings };
}
