import type {
  Player, PlayerAttributes, Position, SquadStatus, Foot,
  CareerStats, HiddenCharacteristics,
  PreferredRole,
} from '../types';
import {
  calculateAllPositionAbilities,
  calculatePositionAbility,
  calculatePotentialAbility,
  calculateMarketValue,
  calculateReputation,
  derivePersonality,
  calculateDevelopmentRate,
} from '../utils/calculations';

// ─── Seeded-style ID counter ──────────────────────────────────────────────────

let _playerIdCounter = 1;
export function nextPlayerId(): string {
  return `player_${String(_playerIdCounter++).padStart(4, '0')}`;
}
export function resetPlayerIdCounter(): void { _playerIdCounter = 1; }

// ─── Math helpers ─────────────────────────────────────────────────────────────

function clamp(v: number, min = 1, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(v)));
}

function gauss(mean: number, stddev: number): number {
  // Box-Muller approximation
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return mean + z * stddev;
}

function rng(base: number, spread: number): number {
  return clamp(gauss(base, spread));
}

// ─── Archetype definitions ────────────────────────────────────────────────────
// Each archetype defines multipliers applied to the base quality for each attribute.
// 1.0 = attribute tracks quality exactly; 1.15 = stronger; 0.5 = much weaker.

type AttrMultipliers = {
  // Technical
  passing?: number; firstTouch?: number; dribbling?: number; finishing?: number;
  crossing?: number; tackling?: number; marking?: number; heading?: number;
  longShots?: number; technique?: number; freeKicks?: number; corners?: number; penalties?: number;
  // Mental
  decisions?: number; vision?: number; composure?: number; concentration?: number;
  anticipation?: number; positioning?: number; determination?: number; workRate?: number;
  teamwork?: number; leadership?: number; aggression?: number; offTheBall?: number;
  // Physical
  pace?: number; acceleration?: number; strength?: number; stamina?: number;
  agility?: number; balance?: number; jumping?: number; naturalFitness?: number;
  // GK
  reflexes?: number; handling?: number; oneOnOnes?: number; gkPositioning?: number;
  aerialAbility?: number; kicking?: number; throwing?: number; communication?: number; sweeperAbility?: number;
};

interface Archetype {
  role: PreferredRole;
  mults: AttrMultipliers;
}


function getDefaultMult(key: string): number {
  const gkKeys = ['reflexes','handling','oneOnOnes','gkPositioning','aerialAbility','kicking','throwing','communication','sweeperAbility'];
  const physKeys = ['pace','acceleration','strength','stamina','agility','balance','jumping','naturalFitness'];
  const mentalKeys = ['decisions','vision','composure','concentration','anticipation','positioning','determination','workRate','teamwork','leadership','aggression','offTheBall'];
  if (gkKeys.includes(key)) return 0.18;
  if (physKeys.includes(key)) return 0.65;
  if (mentalKeys.includes(key)) return 0.68;
  return 0.50;
}

const ARCHETYPES: Record<Position, Archetype[]> = {
  GK: [
    {
      role: 'Traditional Goalkeeper',
      mults: { reflexes: 1.15, handling: 1.10, gkPositioning: 1.10, oneOnOnes: 1.05,
                aerialAbility: 1.0, communication: 0.95, sweeperAbility: 0.80,
                kicking: 0.85, throwing: 0.85, decisions: 1.0, composure: 0.95 },
    },
    {
      role: 'Sweeper Keeper',
      mults: { reflexes: 1.05, handling: 1.00, gkPositioning: 1.05, oneOnOnes: 1.10,
                aerialAbility: 0.95, communication: 1.05, sweeperAbility: 1.20,
                kicking: 1.10, throwing: 1.05, pace: 0.75, decisions: 1.05 },
    },
  ],
  CB: [
    {
      role: 'No-Nonsense Defender',
      mults: { tackling: 1.15, marking: 1.12, heading: 1.12, strength: 1.10, jumping: 1.10,
                concentration: 1.08, positioning: 1.05, anticipation: 1.02,
                aggression: 1.05, passing: 0.60, technique: 0.55, vision: 0.50, pace: 0.75 },
    },
    {
      role: 'Ball-Playing Defender',
      mults: { tackling: 1.05, marking: 1.00, heading: 0.95, passing: 1.10, technique: 1.08,
                vision: 1.05, composure: 1.08, decisions: 1.05, firstTouch: 1.05,
                strength: 0.90, jumping: 0.90, concentration: 1.05, positioning: 1.05 },
    },
    {
      role: 'Ball-Playing Defender',
      mults: { anticipation: 1.12, positioning: 1.12, pace: 1.00, acceleration: 1.00,
                tackling: 1.02, marking: 0.98, heading: 1.00, concentration: 1.08,
                composure: 1.08, decisions: 1.08, passing: 1.05, technique: 1.05, vision: 1.00 },
    },
  ],
  LB: [
    {
      role: 'Defensive Full Back',
      mults: { tackling: 1.10, marking: 1.08, crossing: 0.85, pace: 1.00, acceleration: 1.00,
                stamina: 1.05, positioning: 1.05, workRate: 1.08, concentration: 1.05,
                passing: 0.80, dribbling: 0.70, offTheBall: 0.75 },
    },
    {
      role: 'Attacking Full Back',
      mults: { crossing: 1.15, pace: 1.08, acceleration: 1.08, stamina: 1.05,
                dribbling: 1.00, passing: 1.00, offTheBall: 1.05, agility: 1.05,
                tackling: 0.88, marking: 0.85, workRate: 1.05 },
    },
  ],
  RB: [
    {
      role: 'Defensive Full Back',
      mults: { tackling: 1.10, marking: 1.08, crossing: 0.85, pace: 1.00, acceleration: 1.00,
                stamina: 1.05, positioning: 1.05, workRate: 1.08, concentration: 1.05,
                passing: 0.80, dribbling: 0.70, offTheBall: 0.75 },
    },
    {
      role: 'Attacking Full Back',
      mults: { crossing: 1.15, pace: 1.08, acceleration: 1.08, stamina: 1.05,
                dribbling: 1.00, passing: 1.00, offTheBall: 1.05, agility: 1.05,
                tackling: 0.88, marking: 0.85, workRate: 1.05 },
    },
  ],
  LWB: [
    {
      role: 'Attacking Full Back',
      mults: { crossing: 1.15, pace: 1.10, acceleration: 1.10, dribbling: 1.05,
                stamina: 1.08, offTheBall: 1.05, agility: 1.08, passing: 0.95,
                tackling: 0.88, marking: 0.82, workRate: 1.08 },
    },
  ],
  RWB: [
    {
      role: 'Attacking Full Back',
      mults: { crossing: 1.15, pace: 1.10, acceleration: 1.10, dribbling: 1.05,
                stamina: 1.08, offTheBall: 1.05, agility: 1.08, passing: 0.95,
                tackling: 0.88, marking: 0.82, workRate: 1.08 },
    },
  ],
  DM: [
    {
      role: 'Ball-Winning Midfielder',
      mults: { tackling: 1.15, marking: 1.10, aggression: 1.08, strength: 1.08,
                workRate: 1.10, concentration: 1.08, positioning: 1.05, stamina: 1.08,
                passing: 0.80, vision: 0.72, dribbling: 0.70, technique: 0.75 },
    },
    {
      role: 'Defensive Midfielder',
      mults: { tackling: 1.05, marking: 1.00, positioning: 1.12, concentration: 1.10,
                teamwork: 1.08, passing: 1.05, decisions: 1.08, composure: 1.05,
                workRate: 1.05, stamina: 1.05, vision: 0.90 },
    },
  ],
  CM: [
    {
      role: 'Box-to-Box Midfielder',
      mults: { stamina: 1.12, workRate: 1.10, passing: 1.05, teamwork: 1.08,
                offTheBall: 1.08, decisions: 1.05, tackling: 0.95, finishing: 0.85,
                vision: 0.95, technique: 1.00, naturalFitness: 1.10 },
    },
    {
      role: 'Deep-Lying Playmaker',
      mults: { passing: 1.15, vision: 1.12, technique: 1.10, decisions: 1.10,
                firstTouch: 1.08, composure: 1.08, teamwork: 1.05, longShots: 1.00,
                freeKicks: 1.05, tackling: 0.78, stamina: 0.90, workRate: 0.85 },
    },
  ],
  LM: [
    {
      role: 'Wide Midfielder',
      mults: { crossing: 1.12, dribbling: 1.05, pace: 1.08, acceleration: 1.08,
                technique: 1.05, offTheBall: 1.05, stamina: 1.08, workRate: 1.05,
                passing: 1.00, finishing: 0.80, tackling: 0.78 },
    },
  ],
  RM: [
    {
      role: 'Wide Midfielder',
      mults: { crossing: 1.12, dribbling: 1.05, pace: 1.08, acceleration: 1.08,
                technique: 1.05, offTheBall: 1.05, stamina: 1.08, workRate: 1.05,
                passing: 1.00, finishing: 0.80, tackling: 0.78 },
    },
  ],
  AM: [
    {
      role: 'Advanced Playmaker',
      mults: { vision: 1.15, passing: 1.12, technique: 1.10, decisions: 1.10,
                offTheBall: 1.08, dribbling: 1.05, firstTouch: 1.08, composure: 1.05,
                freeKicks: 1.05, finishing: 0.88, tackling: 0.62, workRate: 0.85 },
    },
    {
      role: 'Inside Forward',
      mults: { dribbling: 1.12, finishing: 1.10, pace: 1.08, acceleration: 1.08,
                technique: 1.05, agility: 1.08, offTheBall: 1.05, composure: 1.05,
                longShots: 1.05, vision: 0.90, passing: 0.90, workRate: 0.85 },
    },
  ],
  LW: [
    {
      role: 'Winger',
      mults: { pace: 1.15, acceleration: 1.15, dribbling: 1.12, agility: 1.10,
                crossing: 1.08, technique: 1.05, offTheBall: 1.05, balance: 1.10,
                finishing: 0.88, passing: 0.85, workRate: 0.90, tackling: 0.55 },
    },
    {
      role: 'Inside Forward',
      mults: { dribbling: 1.10, finishing: 1.12, pace: 1.10, acceleration: 1.08,
                technique: 1.08, composure: 1.05, longShots: 1.08, agility: 1.05,
                crossing: 0.80, workRate: 0.88, tackling: 0.55 },
    },
  ],
  RW: [
    {
      role: 'Winger',
      mults: { pace: 1.15, acceleration: 1.15, dribbling: 1.12, agility: 1.10,
                crossing: 1.08, technique: 1.05, offTheBall: 1.05, balance: 1.10,
                finishing: 0.88, passing: 0.85, workRate: 0.90, tackling: 0.55 },
    },
    {
      role: 'Inside Forward',
      mults: { dribbling: 1.10, finishing: 1.12, pace: 1.10, acceleration: 1.08,
                technique: 1.08, composure: 1.05, longShots: 1.08, agility: 1.05,
                crossing: 0.80, workRate: 0.88, tackling: 0.55 },
    },
  ],
  ST: [
    {
      role: 'Complete Forward',
      mults: { finishing: 1.15, composure: 1.12, offTheBall: 1.10, firstTouch: 1.08,
                technique: 1.05, acceleration: 1.05, anticipation: 1.08,
                dribbling: 1.00, heading: 0.95, strength: 0.95, longShots: 0.95, penalties: 1.05 },
    },
    {
      role: 'Poacher',
      mults: { finishing: 1.20, offTheBall: 1.15, anticipation: 1.12, composure: 1.10,
                acceleration: 1.08, penalties: 1.10, firstTouch: 1.00,
                strength: 0.80, heading: 0.80, dribbling: 0.80, workRate: 0.75, passing: 0.65 },
    },
    {
      role: 'Target Man',
      mults: { heading: 1.18, strength: 1.15, jumping: 1.15, finishing: 1.00,
                composure: 1.00, firstTouch: 1.00, offTheBall: 1.05, aggression: 1.05,
                pace: 0.78, acceleration: 0.78, dribbling: 0.80, technique: 0.85 },
    },
    {
      role: 'Deep-Lying Forward',
      mults: { passing: 1.10, vision: 1.08, technique: 1.08, firstTouch: 1.10,
                offTheBall: 1.05, decisions: 1.08, composure: 1.05, finishing: 0.92,
                strength: 0.90, pace: 0.90, heading: 0.80 },
    },
  ],
};

// ─── Attribute generation from archetype ─────────────────────────────────────

function buildAttrs(quality: number, archetype: Archetype): PlayerAttributes {
  const m = archetype.mults;
  const q = quality;

  function a(key: string, extraSpread = 5): number {
    const mult = (m as Record<string, number>)[key] ?? getDefaultMult(key);
    return rng(q * mult, extraSpread);
  }

  return {
    technical: {
      passing:    a('passing'),
      firstTouch: a('firstTouch'),
      dribbling:  a('dribbling'),
      finishing:  a('finishing'),
      crossing:   a('crossing'),
      tackling:   a('tackling'),
      marking:    a('marking'),
      heading:    a('heading'),
      longShots:  a('longShots'),
      technique:  a('technique'),
      freeKicks:  a('freeKicks'),
      corners:    a('corners'),
      penalties:  a('penalties'),
    },
    mental: {
      decisions:     a('decisions'),
      vision:        a('vision'),
      composure:     a('composure'),
      concentration: a('concentration'),
      anticipation:  a('anticipation'),
      positioning:   a('positioning'),
      determination: a('determination', 8),
      workRate:      a('workRate', 8),
      teamwork:      a('teamwork', 6),
      leadership:    a('leadership', 10),
      aggression:    a('aggression', 10),
      offTheBall:    a('offTheBall'),
    },
    physical: {
      pace:           a('pace', 8),
      acceleration:   a('acceleration', 8),
      strength:       a('strength', 8),
      stamina:        a('stamina', 6),
      agility:        a('agility', 7),
      balance:        a('balance', 7),
      jumping:        a('jumping', 8),
      naturalFitness: a('naturalFitness', 6),
    },
    goalkeeper: {
      reflexes:      a('reflexes'),
      handling:      a('handling'),
      oneOnOnes:     a('oneOnOnes'),
      gkPositioning: a('gkPositioning'),
      aerialAbility: a('aerialAbility'),
      kicking:       a('kicking'),
      throwing:      a('throwing'),
      communication: a('communication'),
      sweeperAbility: a('sweeperAbility'),
    },
  };
}

// ─── Hidden characteristics ───────────────────────────────────────────────────

function generateHidden(quality: number): HiddenCharacteristics {
  const hi = (mean: number, spread = 14) => clamp(gauss(mean, spread));
  return {
    professionalism:   hi(50 + quality * 0.2),
    consistency:       hi(40 + quality * 0.25),
    adaptability:      hi(55),
    injuryProneness:   hi(35, 18),
    ambition:          hi(55),
    loyalty:           hi(50),
    pressureHandling:  hi(45 + quality * 0.15),
    learningSpeed:     hi(50),
    bigMatchMentality: hi(45 + quality * 0.15),
  };
}

// ─── Name pools ───────────────────────────────────────────────────────────────

const NATIONALITIES = [
  'Valmorian', 'Keldorian', 'Stravian', 'Nordovian', 'Calderian',
  'Mirovan', 'Trebonian', 'Fastovian', 'Grenzian', 'Astorian',
  'Velmorian', 'Brackian', 'Sundevian', 'Olverian', 'Doranian',
];

const FIRST_NAMES = [
  'Marco','Luca','Felix','Jarek','Sven','Dario','Emil','Niko','Tomas','Aran',
  'Ciro','Vito','Petar','Goran','Oskar','Rafa','Ivan','Bruno','Andre','Milan',
  'Luka','Milo','Bran','Stefan','Tobias','Arlo','Curt','Dom','Eric','Fede',
  'Glen','Hato','Igor','Jens','Klas','Lars','Marc','Nils','Otto','Paco',
  'Quinn','Rico','Samu','Tibo','Uwe','Vico','Wulf','Xavi','Yari','Zeno',
  'Adrian','Boris','Carlo','Davide','Enrico','Franco','Gianni','Hans','Ian','Josef',
  'Karel','Lukas','Maren','Nevio','Pascal','Rokas','Simun','Taavi','Uldis','Vano',
];

const LAST_NAMES = [
  'Verlaine','Kovar','Brennan','Strader','Nolte','Visser','Dahl','Holm','Reiter','Faber',
  'Grun','Weiss','Baumann','Fischer','Hoffmann','Koch','Richter','Schreiber','Wagner','Wolff',
  'Petrov','Solov','Alves','Ferreira','Santos','Oliveira','Costa','Gomes','Carvalho','Lopes',
  'Müller','Bauer','Huber','Schneider','Zimmermann','Werner','Lehmann','Lang','Schulz','Braun',
  'Durand','Martin','Bernard','Thomas','Petit','Laurent','Simon','Michel','Lefebvre','Leroy',
  'Rossi','Romano','Esposito','Bianchi','Conti','De Luca','Mancini','Greco','Lombardi','Gallo',
  'Karas','Novak','Vlcek','Blum','Krüger','Hartmann','Ritter','Kühn','Böhm','Schumacher',
];

function randomName(): string {
  return `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`;
}
function randomNat(): string {
  return NATIONALITIES[Math.floor(Math.random() * NATIONALITIES.length)];
}
function randomFoot(): Foot {
  const r = Math.random();
  return r < 0.70 ? 'Right' : r < 0.94 ? 'Left' : 'Both';
}

// ─── Age distribution ─────────────────────────────────────────────────────────

type AgeGroup = { min: number; max: number; weight: number };

function pickAge(groups: AgeGroup[]): number {
  const totalW = groups.reduce((s, g) => s + g.weight, 0);
  let r = Math.random() * totalW;
  for (const g of groups) {
    r -= g.weight;
    if (r <= 0) return Math.floor(Math.random() * (g.max - g.min + 1)) + g.min;
  }
  return groups[groups.length - 1].min;
}

// Age profile for a balanced realistic squad
const STANDARD_AGE_GROUPS: AgeGroup[] = [
  { min: 17, max: 19, weight: 0.12 },
  { min: 20, max: 22, weight: 0.20 },
  { min: 23, max: 26, weight: 0.30 },
  { min: 27, max: 29, weight: 0.22 },
  { min: 30, max: 33, weight: 0.12 },
  { min: 34, max: 37, weight: 0.04 },
];

function ageToQualityAdj(age: number): number {
  // Young players may be raw, peak at 24-28, veterans decline
  if (age <= 18) return -12;
  if (age <= 20) return -6;
  if (age <= 23) return -2;
  if (age <= 27) return 0;
  if (age <= 30) return -3;
  if (age <= 33) return -8;
  return -16;
}

function makeDoB(age: number, referenceDate = '2025-07-01'): string {
  const ref = new Date(referenceDate);
  const birthYear = ref.getFullYear() - age;
  const birthMonth = Math.floor(Math.random() * 12);
  const birthDay = Math.floor(Math.random() * 28) + 1;
  return new Date(birthYear, birthMonth, birthDay).toISOString().split('T')[0];
}

// ─── Secondary positions ──────────────────────────────────────────────────────

const SECONDARY_MAP: Partial<Record<Position, Position[]>> = {
  CB: ['DM', 'LB', 'RB'],
  LB: ['CB', 'LWB', 'LM'],
  RB: ['CB', 'RWB', 'RM'],
  LWB: ['LB', 'LM', 'LW'],
  RWB: ['RB', 'RM', 'RW'],
  DM: ['CM', 'CB'],
  CM: ['DM', 'AM'],
  LM: ['LW', 'AM', 'LB'],
  RM: ['RW', 'AM', 'RB'],
  AM: ['CM', 'LW', 'RW'],
  LW: ['LM', 'AM', 'ST'],
  RW: ['RM', 'AM', 'ST'],
  ST: ['AM', 'LW', 'RW'],
};

// ─── Squad status from quality ────────────────────────────────────────────────

function squadStatus(quality: number): SquadStatus {
  if (quality >= 80) return 'Key Player';
  if (quality >= 68) return 'First Team';
  if (quality >= 55) return 'Rotation';
  if (quality >= 42) return 'Squad Player';
  if (quality >= 32) return 'Reserve';
  return 'Youth';
}

// ─── Career stats seed ────────────────────────────────────────────────────────

function seedCareerStats(pos: Position, age: number): CareerStats {
  const careerLength = Math.max(0, age - 17);
  const appsPerYear = pos === 'GK' ? 28 : 30;
  const apps = Math.floor(careerLength * appsPerYear * (0.6 + Math.random() * 0.4));
  const goalRate = pos === 'ST' ? 0.40 : ['LW','RW','AM'].includes(pos) ? 0.18 : pos === 'CM' ? 0.06 : 0.02;
  const assistRate = ['AM','LW','RW','CM'].includes(pos) ? 0.22 : pos === 'ST' ? 0.12 : 0.05;
  return {
    appearances: apps,
    goals: Math.floor(apps * goalRate * (0.5 + Math.random() * 1.0)),
    assists: Math.floor(apps * assistRate * (0.5 + Math.random() * 1.0)),
    yellowCards: Math.floor(apps * 0.08 * Math.random() * 2),
    redCards: Math.floor(Math.random() * 3),
    cleanSheets: pos === 'GK' ? Math.floor(apps * 0.30 * (0.5 + Math.random() * 1.0)) : 0,
    averageRating: Math.round((6.0 + Math.random() * 2.0) * 10) / 10,
    history: [],
  };
}

// ─── Main player factory ──────────────────────────────────────────────────────

export function makePlayer(
  pos: Position,
  rawQuality: number,
  clubId: string,
  clubReputation = 60,
  ageOverride?: number,
): Player {
  const id = nextPlayerId();
  const archetypePool = ARCHETYPES[pos] || ARCHETYPES.CM;
  const archetype = archetypePool[Math.floor(Math.random() * archetypePool.length)];

  const age = ageOverride ?? pickAge(STANDARD_AGE_GROUPS);
  const quality = clamp(rawQuality + ageToQualityAdj(age), 15, 97);
  const dob = makeDoB(age);

  const attrs = buildAttrs(quality, archetype);
  const hidden = generateHidden(quality);
  const personality = derivePersonality(hidden);

  const positionAbilities = calculateAllPositionAbilities(attrs);
  const currentAbility = calculatePositionAbility(attrs, pos);
  const potentialAbility = calculatePotentialAbility(currentAbility, age, hidden);

  const rep = calculateReputation(currentAbility, age, clubReputation);
  const devRate = calculateDevelopmentRate(hidden, age);

  const contractYears = Math.floor(Math.random() * 3) + 1;
  const expiryDate = new Date(2025 + contractYears, 5, 30).toISOString().split('T')[0];
  const wage = Math.round((currentAbility * currentAbility * 0.35 + 400) * (clubReputation / 60));

  const secondaries: Position[] = [];
  const pool = SECONDARY_MAP[pos] || [];
  if (pool.length > 0 && Math.random() > 0.38) {
    secondaries.push(pool[Math.floor(Math.random() * pool.length)]);
  }

  const familiarity: Partial<Record<Position, number>> = { [pos]: clamp(90 + Math.floor(Math.random() * 10)) };
  secondaries.forEach(sp => { familiarity[sp] = clamp(50 + Math.floor(Math.random() * 35)); });

  const player: Player = {
    id,
    name: randomName(),
    dateOfBirth: dob,
    age,
    nationality: randomNat(),
    position: pos,
    secondaryPositions: secondaries,
    positionalFamiliarity: familiarity,
    attributes: attrs,
    currentAbility,
    potentialAbility,
    positionAbilities,
    preferredFoot: randomFoot(),
    height: Math.floor(gauss(178, 8)),
    weight: Math.floor(gauss(75, 7)),
    contract: {
      wage,
      expiryDate,
      squadStatus: squadStatus(currentAbility),
    },
    morale: clamp(gauss(72, 12)),
    fitness: clamp(gauss(82, 10)),
    matchSharpness: clamp(gauss(60, 15)),
    reputation: rep,
    marketValue: 0, // filled after player is constructed
    clubId,
    isInjured: Math.random() < 0.05,
    hiddenCharacteristics: hidden,
    preferences: {
      preferredFoot: randomFoot(),
      preferredRole: archetype.role,
      prefersAttacking: ['ST','LW','RW','AM','LM','RM'].includes(pos),
      prefersLargeClub: rep > 65,
    },
    personality,
    developmentRate: devRate,
    injuryProneness: hidden.injuryProneness,
    careerStats: seedCareerStats(pos, age),
    _v: 2,
  };

  // Calculate market value now that the player object exists
  player.marketValue = calculateMarketValue(player);
  return player;
}

// ─── Squad builder ────────────────────────────────────────────────────────────

interface SlotDef { pos: Position; n: number; qAdj: number; ageGroup?: AgeGroup[] }

const SQUAD_TEMPLATE: SlotDef[] = [
  { pos: 'GK',  n: 2, qAdj: 0,   ageGroup: [{ min: 22, max: 34, weight: 1 }] },
  { pos: 'CB',  n: 4, qAdj: 0 },
  { pos: 'LB',  n: 2, qAdj: -3 },
  { pos: 'RB',  n: 2, qAdj: -3 },
  { pos: 'DM',  n: 2, qAdj: -2 },
  { pos: 'CM',  n: 4, qAdj: 0 },
  { pos: 'AM',  n: 2, qAdj: 2 },
  { pos: 'LW',  n: 2, qAdj: 2 },
  { pos: 'RW',  n: 2, qAdj: 2 },
  { pos: 'ST',  n: 2, qAdj: 4 },
];

export function buildSquad(
  clubId: string,
  qualityBase: number,
  spread: number,
  clubReputation = 60,
): { players: Player[]; playerIds: string[] } {
  const players: Player[] = [];

  for (const slot of SQUAD_TEMPLATE) {
    for (let i = 0; i < slot.n; i++) {
      const q = clamp(qualityBase + slot.qAdj + (Math.random() - 0.5) * spread * 2);
      const age = slot.ageGroup ? pickAge(slot.ageGroup) : undefined;
      players.push(makePlayer(slot.pos, q, clubId, clubReputation, age));
    }
  }

  // Occasionally add a gem: high PA but low CA youth player
  if (Math.random() < 0.4) {
    const gemPos: Position = (['CM','LW','ST','CB'] as Position[])[Math.floor(Math.random() * 4)];
    const gemQ = clamp(qualityBase - 18 + Math.random() * 10);
    const gemAge = 17 + Math.floor(Math.random() * 3);
    players.push(makePlayer(gemPos, gemQ, clubId, clubReputation, gemAge));
  }

  return { players, playerIds: players.map(p => p.id) };
}
