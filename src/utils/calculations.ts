import type {
  Player, Position, HiddenCharacteristics, PersonalityLabel,
  PlayerAttributes, SquadMetrics,
} from '../types';

// ─── Flat attribute accessor ──────────────────────────────────────────────────
// Maps a string key to its nested location in PlayerAttributes

type AttrKey =
  // Technical
  | 'passing' | 'firstTouch' | 'dribbling' | 'finishing' | 'crossing'
  | 'tackling' | 'marking' | 'heading' | 'longShots' | 'technique'
  | 'freeKicks' | 'corners' | 'penalties'
  // Mental
  | 'decisions' | 'vision' | 'composure' | 'concentration' | 'anticipation'
  | 'positioning' | 'determination' | 'workRate' | 'teamwork' | 'leadership'
  | 'aggression' | 'offTheBall'
  // Physical
  | 'pace' | 'acceleration' | 'strength' | 'stamina' | 'agility'
  | 'balance' | 'jumping' | 'naturalFitness'
  // Goalkeeper
  | 'reflexes' | 'handling' | 'oneOnOnes' | 'gkPositioning' | 'aerialAbility'
  | 'kicking' | 'throwing' | 'communication' | 'sweeperAbility';

export function getAttr(attrs: PlayerAttributes, key: AttrKey): number {
  const t = attrs.technical as unknown as Record<string, number>;
  const m = attrs.mental as unknown as Record<string, number>;
  const p = attrs.physical as unknown as Record<string, number>;
  const g = attrs.goalkeeper as unknown as Record<string, number>;
  if (key in t) return t[key] ?? 1;
  if (key in m) return m[key] ?? 1;
  if (key in p) return p[key] ?? 1;
  if (key in g) return g[key] ?? 1;
  return 1;
}

// ─── Position weight tables ───────────────────────────────────────────────────
// Weights must sum to 1.0 per position.

type WeightMap = Partial<Record<AttrKey, number>>;

const POSITION_WEIGHTS: Record<Position, WeightMap> = {
  GK: {
    reflexes: 0.18, handling: 0.14, gkPositioning: 0.14, oneOnOnes: 0.10,
    aerialAbility: 0.10, communication: 0.08, sweeperAbility: 0.08,
    kicking: 0.06, throwing: 0.06, decisions: 0.06,
  },
  CB: {
    tackling: 0.14, marking: 0.14, heading: 0.12, positioning: 0.10,
    anticipation: 0.10, concentration: 0.10, strength: 0.08, jumping: 0.08,
    composure: 0.06, passing: 0.04, decisions: 0.04,
  },
  LB: {
    tackling: 0.11, marking: 0.09, crossing: 0.12, pace: 0.10,
    acceleration: 0.08, stamina: 0.10, positioning: 0.08,
    passing: 0.08, workRate: 0.08, agility: 0.06, firstTouch: 0.05, decisions: 0.05,
  },
  RB: {
    tackling: 0.11, marking: 0.09, crossing: 0.12, pace: 0.10,
    acceleration: 0.08, stamina: 0.10, positioning: 0.08,
    passing: 0.08, workRate: 0.08, agility: 0.06, firstTouch: 0.05, decisions: 0.05,
  },
  LWB: {
    crossing: 0.13, pace: 0.11, acceleration: 0.09, stamina: 0.10,
    dribbling: 0.08, tackling: 0.09, marking: 0.07, workRate: 0.09,
    passing: 0.08, agility: 0.07, offTheBall: 0.05, decisions: 0.04,
  },
  RWB: {
    crossing: 0.13, pace: 0.11, acceleration: 0.09, stamina: 0.10,
    dribbling: 0.08, tackling: 0.09, marking: 0.07, workRate: 0.09,
    passing: 0.08, agility: 0.07, offTheBall: 0.05, decisions: 0.04,
  },
  DM: {
    tackling: 0.13, marking: 0.11, positioning: 0.12, concentration: 0.10,
    workRate: 0.10, teamwork: 0.08, passing: 0.10, composure: 0.06,
    strength: 0.08, stamina: 0.08, decisions: 0.04,
  },
  CM: {
    passing: 0.14, firstTouch: 0.09, decisions: 0.10, stamina: 0.10,
    workRate: 0.08, teamwork: 0.08, vision: 0.08, technique: 0.08,
    offTheBall: 0.08, composure: 0.06, tackling: 0.06, concentration: 0.05,
  },
  LM: {
    crossing: 0.12, dribbling: 0.11, pace: 0.11, acceleration: 0.09,
    technique: 0.09, offTheBall: 0.08, passing: 0.08, firstTouch: 0.08,
    workRate: 0.08, stamina: 0.07, decisions: 0.05, finishing: 0.04,
  },
  RM: {
    crossing: 0.12, dribbling: 0.11, pace: 0.11, acceleration: 0.09,
    technique: 0.09, offTheBall: 0.08, passing: 0.08, firstTouch: 0.08,
    workRate: 0.08, stamina: 0.07, decisions: 0.05, finishing: 0.04,
  },
  AM: {
    vision: 0.13, passing: 0.11, technique: 0.10, decisions: 0.10,
    offTheBall: 0.10, dribbling: 0.09, finishing: 0.08, composure: 0.08,
    firstTouch: 0.08, anticipation: 0.07, longShots: 0.06,
  },
  LW: {
    pace: 0.12, acceleration: 0.10, dribbling: 0.12, technique: 0.09,
    offTheBall: 0.09, agility: 0.08, crossing: 0.08, finishing: 0.09,
    composure: 0.07, vision: 0.06, firstTouch: 0.05, decisions: 0.05,
  },
  RW: {
    pace: 0.12, acceleration: 0.10, dribbling: 0.12, technique: 0.09,
    offTheBall: 0.09, agility: 0.08, crossing: 0.08, finishing: 0.09,
    composure: 0.07, vision: 0.06, firstTouch: 0.05, decisions: 0.05,
  },
  ST: {
    finishing: 0.17, composure: 0.12, offTheBall: 0.12, firstTouch: 0.10,
    technique: 0.08, acceleration: 0.08, anticipation: 0.08,
    heading: 0.07, strength: 0.06, dribbling: 0.06, longShots: 0.06,
  },
};

// ─── Position ability calculation ─────────────────────────────────────────────

export function calculatePositionAbility(attrs: PlayerAttributes, pos: Position): number {
  const weights = POSITION_WEIGHTS[pos];
  let total = 0;
  let weightSum = 0;
  for (const [key, weight] of Object.entries(weights)) {
    const val = getAttr(attrs, key as AttrKey);
    total += val * weight;
    weightSum += weight;
  }
  if (weightSum === 0) return 50;
  const raw = total / weightSum;
  // Apply a slight upward curve so "high in all weighted attrs" results in near-100
  const curved = Math.pow(raw / 100, 0.92) * 100;
  return Math.max(1, Math.min(100, Math.round(curved)));
}

export function calculateAllPositionAbilities(attrs: PlayerAttributes): Partial<Record<Position, number>> {
  const all: Partial<Record<Position, number>> = {};
  const positions: Position[] = ['GK','CB','LB','RB','LWB','RWB','DM','CM','LM','RM','AM','LW','RW','ST'];
  for (const pos of positions) {
    all[pos] = calculatePositionAbility(attrs, pos);
  }
  return all;
}

// ─── Potential ability ────────────────────────────────────────────────────────

export function calculatePotentialAbility(
  ca: number,
  age: number,
  hidden: HiddenCharacteristics,
): number {
  // Young players have more headroom; older players are near their ceiling
  const maxHeadroom = age <= 18 ? 35
    : age <= 20 ? 28
    : age <= 22 ? 20
    : age <= 25 ? 12
    : age <= 28 ? 6
    : 3;

  // Natural talent factor from hidden characteristics
  const talentFactor = (hidden.learningSpeed * 0.5 + hidden.professionalism * 0.3 + hidden.ambition * 0.2) / 100;
  const headroom = Math.round(maxHeadroom * (0.4 + talentFactor * 0.6));

  const raw = ca + headroom;
  return Math.max(ca, Math.min(99, raw));
}

// ─── Market value ─────────────────────────────────────────────────────────────
// Returns value in Valsorian Francs (₣)

export function calculateMarketValue(
  player: Player,
  currentDate = '2025-07-01',
): number {
  const { currentAbility: ca, potentialAbility: pa, age, reputation } = player;

  // Exponential base: calibrated so CA=90 ≈ ₣35M, CA=70 ≈ ₣8M, CA=50 ≈ ₣1M
  const BASE_K = 3_738;
  const BASE_C = 0.1016;
  const baseValue = BASE_K * Math.exp(ca * BASE_C);

  // Age multiplier — peaks 23-26
  const ageMult =
    age <= 17 ? 0.45
    : age <= 19 ? 0.65
    : age <= 22 ? 0.85
    : age <= 26 ? 1.00
    : age <= 29 ? 0.82
    : age <= 32 ? 0.60
    : 0.35;

  // Potential premium for young players
  const potGap = Math.max(0, pa - ca);
  const youthFactor = age <= 20 ? 1.5 : age <= 23 ? 1.0 : age <= 25 ? 0.5 : 0;
  const potPremium = potGap * 120_000 * youthFactor;

  // Contract multiplier
  const expiry = new Date(player.contract.expiryDate + 'T00:00:00');
  const now = new Date(currentDate + 'T00:00:00');
  const monthsLeft = Math.max(0, (expiry.getTime() - now.getTime()) / (30 * 24 * 3600 * 1000));
  const contractMult =
    monthsLeft < 6 ? 0.50
    : monthsLeft < 12 ? 0.68
    : monthsLeft < 24 ? 0.85
    : 1.00;

  // Reputation modifier
  const repMult = 0.72 + (reputation / 100) * 0.28;

  const raw = (baseValue * ageMult * contractMult * repMult) + potPremium;
  // Round to nearest ₣50K for values > 1M, else nearest ₣5K
  if (raw >= 1_000_000) return Math.round(raw / 50_000) * 50_000;
  return Math.round(raw / 5_000) * 5_000;
}

// ─── Reputation ───────────────────────────────────────────────────────────────

export function calculateReputation(ca: number, age: number, clubReputation: number): number {
  // Career exposure builds over time — young players have lower rep than ability suggests
  const experienceFactor = Math.min(1.0, (age - 16) / 14);
  // Ability contribution
  const abilityContrib = ca * 0.55;
  // Age/experience contribution
  const experienceContrib = experienceFactor * 25;
  // Club association
  const clubContrib = clubReputation * 0.20;
  // Raw
  const raw = abilityContrib + experienceContrib + clubContrib;
  return Math.max(1, Math.min(99, Math.round(raw)));
}

// ─── Personality derivation ───────────────────────────────────────────────────

export function derivePersonality(h: HiddenCharacteristics): PersonalityLabel {
  const scores: [PersonalityLabel, number][] = [
    ['Professional', h.professionalism * 0.7 + h.ambition * 0.3],
    ['Driven', h.ambition * 0.5 + h.professionalism * 0.3 + h.learningSpeed * 0.2],
    ['Ambitious', h.ambition * 0.7 + (100 - h.loyalty) * 0.3],
    ['Team Player', h.loyalty * 0.6 + h.adaptability * 0.4],
    ['Resolute', h.pressureHandling * 0.5 + h.bigMatchMentality * 0.5],
    ['Competitive', h.bigMatchMentality * 0.5 + h.ambition * 0.3 + h.pressureHandling * 0.2],
    ['Loyal', h.loyalty * 0.8 + h.adaptability * 0.2],
    ['Maverick', (100 - h.professionalism) * 0.6 + (100 - h.consistency) * 0.4],
    ['Laid Back', (100 - h.ambition) * 0.55 + (100 - h.professionalism) * 0.45],
    ['Balanced', 100 - (Math.abs(h.professionalism - 55) + Math.abs(h.ambition - 55) + Math.abs(h.loyalty - 55)) / 3 * 0.8],
    ['Determined', h.professionalism * 0.5 + h.pressureHandling * 0.3 + h.ambition * 0.2],
  ];

  scores.sort((a, b) => b[1] - a[1]);
  return scores[0][0];
}

// ─── Development rate ─────────────────────────────────────────────────────────

export function calculateDevelopmentRate(h: HiddenCharacteristics, age: number): number {
  const ageFactor = age <= 19 ? 1.0 : age <= 22 ? 0.85 : age <= 25 ? 0.65 : age <= 28 ? 0.40 : 0.20;
  const raw = (h.professionalism * 0.35 + h.learningSpeed * 0.40 + h.adaptability * 0.15 + h.ambition * 0.10) * ageFactor;
  return Math.max(1, Math.min(100, Math.round(raw)));
}

// ─── Squad metrics ────────────────────────────────────────────────────────────

export function calculateSquadMetrics(players: Player[]): SquadMetrics {
  if (!players.length) {
    return { averageAbility: 0, averagePotential: 0, averageAge: 0, squadDepth: 0, goalkeeperStrength: 0, defensiveStrength: 0, midfieldStrength: 0, attackingStrength: 0 };
  }

  const avg = (arr: number[]) => arr.length ? Math.round(arr.reduce((s, v) => s + v, 0) / arr.length) : 0;

  const gks = players.filter(p => p.position === 'GK');
  const defs = players.filter(p => ['CB','LB','RB','LWB','RWB'].includes(p.position));
  const mids = players.filter(p => ['DM','CM','LM','RM','AM'].includes(p.position));
  const atts = players.filter(p => ['LW','RW','ST'].includes(p.position));

  return {
    averageAbility: avg(players.map(p => p.currentAbility)),
    averagePotential: avg(players.map(p => p.potentialAbility)),
    averageAge: avg(players.map(p => p.age)),
    squadDepth: Math.min(100, Math.round(players.length * 4.5)),
    goalkeeperStrength: avg(gks.map(p => p.currentAbility)) || 0,
    defensiveStrength: avg(defs.map(p => p.currentAbility)) || 0,
    midfieldStrength: avg(mids.map(p => p.currentAbility)) || 0,
    attackingStrength: avg(atts.map(p => p.currentAbility)) || 0,
  };
}

// ─── Formatting ───────────────────────────────────────────────────────────────

export function formatValsorian(amount: number): string {
  if (amount >= 1_000_000) return `₣${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₣${(amount / 1_000).toFixed(0)}K`;
  return `₣${amount.toFixed(0)}`;
}
