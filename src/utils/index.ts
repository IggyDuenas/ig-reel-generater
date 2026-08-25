import type { Player, LeagueTableEntry } from '../types';

export function formatCurrency(amount: number): string {
  if (Math.abs(amount) >= 1_000_000) {
    return `₣${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `₣${(amount / 1_000).toFixed(0)}K`;
  }
  return `₣${amount.toFixed(0)}`;
}

export function formatWage(wage: number): string {
  return `₣${wage.toLocaleString()}/wk`;
}

export function formatValsorian(amount: number): string {
  return formatCurrency(amount);
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function abilityLabel(ca: number): string {
  if (ca >= 88) return 'World Class';
  if (ca >= 78) return 'Continental';
  if (ca >= 68) return 'National';
  if (ca >= 55) return 'Regional';
  if (ca >= 42) return 'Amateur+';
  return 'Amateur';
}

export function abilityColor(ca: number): string {
  if (ca >= 85) return 'var(--clr-elite)';
  if (ca >= 75) return 'var(--clr-great)';
  if (ca >= 62) return 'var(--clr-good)';
  if (ca >= 48) return 'var(--clr-avg)';
  return 'var(--clr-poor)';
}

export function moraleColor(morale: number): string {
  if (morale >= 80) return 'var(--clr-good)';
  if (morale >= 60) return 'var(--clr-avg)';
  return 'var(--clr-poor)';
}

export function fitnessColor(fitness: number): string {
  if (fitness >= 80) return 'var(--clr-good)';
  if (fitness >= 60) return 'var(--clr-avg)';
  return 'var(--clr-poor)';
}

export function moraleLabel(morale: number): string {
  if (morale >= 90) return 'Excellent';
  if (morale >= 75) return 'Good';
  if (morale >= 60) return 'Okay';
  if (morale >= 40) return 'Low';
  return 'Poor';
}

export function playerAge(dob: string, currentDate: string): number {
  const d = new Date(dob);
  const now = new Date(currentDate);
  let age = now.getFullYear() - d.getFullYear();
  if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) age--;
  return age;
}

export function sortLeagueTable(entries: LeagueTableEntry[]): LeagueTableEntry[] {
  return [...entries].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });
}

export function getTopPerformer(players: Player[]): Player | null {
  if (!players.length) return null;
  return players.reduce((best, p) => (p.currentAbility > best.currentAbility ? p : best), players[0]);
}

export function squadMoraleAvg(players: Player[]): number {
  if (!players.length) return 0;
  return Math.round(players.reduce((s, p) => s + p.morale, 0) / players.length);
}

export function injuredPlayers(players: Player[]): Player[] {
  return players.filter((p) => p.isInjured);
}

export function attributeBar(value: number): string {
  // Returns a width percentage string for progress bars
  return `${Math.min(100, value)}%`;
}

export function attrColor(v: number): string {
  if (v >= 85) return 'var(--clr-elite)';
  if (v >= 70) return 'var(--clr-great)';
  if (v >= 55) return 'var(--clr-good)';
  if (v >= 40) return 'var(--clr-avg)';
  return 'var(--clr-poor)';
}

export function contractStatus(expiry: string, currentDate: string): { label: string; color: string } {
  const exp = new Date(expiry);
  const now = new Date(currentDate);
  const diffMs = exp.getTime() - now.getTime();
  const diffMonths = diffMs / (1000 * 60 * 60 * 24 * 30);
  if (diffMonths <= 0) return { label: 'Expired', color: 'var(--clr-poor)' };
  if (diffMonths <= 6) return { label: `${Math.round(diffMonths)}mo`, color: 'var(--clr-poor)' };
  if (diffMonths <= 12) return { label: `${Math.round(diffMonths)}mo`, color: 'var(--clr-avg)' };
  const years = (diffMonths / 12).toFixed(1);
  return { label: `${years}yr`, color: 'var(--clr-good)' };
}
