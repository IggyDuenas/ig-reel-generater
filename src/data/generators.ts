import type {
  Player,
  PlayerAttributes,
  Position,
  SquadStatus,
  Foot,
  CareerStats,
} from '../types';

let _playerIdCounter = 1;
export function nextPlayerId(): string {
  return `player_${String(_playerIdCounter++).padStart(4, '0')}`;
}

function clamp(v: number, min = 1, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(v)));
}

function rng(base: number, spread: number): number {
  return clamp(base + (Math.random() - 0.5) * spread * 2);
}

// ─── Attribute template generators ───────────────────────────────────────────

function gkAttributes(quality: number): PlayerAttributes {
  const q = quality;
  return {
    technical: {
      passing: rng(q * 0.5, 8),
      firstTouch: rng(q * 0.6, 8),
      dribbling: rng(20, 6),
      finishing: rng(12, 5),
      crossing: rng(25, 8),
      tackling: rng(15, 5),
      marking: rng(20, 6),
      heading: rng(q * 0.4, 8),
      longShots: rng(15, 5),
      technique: rng(q * 0.5, 8),
    },
    mental: {
      decisions: rng(q * 0.85, 8),
      vision: rng(q * 0.7, 8),
      composure: rng(q * 0.85, 8),
      concentration: rng(q * 0.9, 8),
      anticipation: rng(q * 0.85, 8),
      positioning: rng(q * 0.9, 8),
      determination: rng(q * 0.8, 10),
      workRate: rng(q * 0.7, 10),
      teamwork: rng(q * 0.8, 8),
      leadership: rng(q * 0.7, 12),
      aggression: rng(30, 12),
    },
    physical: {
      pace: rng(55, 15),
      acceleration: rng(52, 15),
      strength: rng(q * 0.7, 10),
      stamina: rng(q * 0.7, 10),
      agility: rng(q * 0.75, 10),
      balance: rng(q * 0.75, 10),
      jumping: rng(q * 0.8, 10),
      naturalFitness: rng(q * 0.8, 8),
    },
    goalkeeper: {
      reflexes: rng(q * 0.95, 5),
      handling: rng(q * 0.9, 5),
      oneOnOnes: rng(q * 0.85, 8),
      gkPositioning: rng(q * 0.9, 5),
      aerialAbility: rng(q * 0.85, 8),
      kicking: rng(q * 0.75, 10),
      throwing: rng(q * 0.75, 10),
    },
  };
}

function cbAttributes(quality: number): PlayerAttributes {
  const q = quality;
  return {
    technical: {
      passing: rng(q * 0.65, 10),
      firstTouch: rng(q * 0.65, 10),
      dribbling: rng(q * 0.4, 10),
      finishing: rng(q * 0.25, 8),
      crossing: rng(q * 0.35, 10),
      tackling: rng(q * 0.92, 5),
      marking: rng(q * 0.92, 5),
      heading: rng(q * 0.88, 6),
      longShots: rng(q * 0.3, 10),
      technique: rng(q * 0.6, 10),
    },
    mental: {
      decisions: rng(q * 0.85, 8),
      vision: rng(q * 0.7, 8),
      composure: rng(q * 0.82, 8),
      concentration: rng(q * 0.9, 6),
      anticipation: rng(q * 0.88, 6),
      positioning: rng(q * 0.9, 6),
      determination: rng(q * 0.85, 8),
      workRate: rng(q * 0.82, 8),
      teamwork: rng(q * 0.85, 8),
      leadership: rng(q * 0.75, 12),
      aggression: rng(q * 0.75, 12),
    },
    physical: {
      pace: rng(q * 0.65, 14),
      acceleration: rng(q * 0.65, 14),
      strength: rng(q * 0.88, 8),
      stamina: rng(q * 0.8, 10),
      agility: rng(q * 0.65, 12),
      balance: rng(q * 0.7, 10),
      jumping: rng(q * 0.85, 8),
      naturalFitness: rng(q * 0.82, 8),
    },
    goalkeeper: {
      reflexes: rng(12, 5),
      handling: rng(10, 5),
      oneOnOnes: rng(8, 4),
      gkPositioning: rng(10, 5),
      aerialAbility: rng(12, 5),
      kicking: rng(q * 0.5, 12),
      throwing: rng(q * 0.4, 10),
    },
  };
}

function fbAttributes(quality: number): PlayerAttributes {
  const q = quality;
  return {
    technical: {
      passing: rng(q * 0.75, 10),
      firstTouch: rng(q * 0.75, 10),
      dribbling: rng(q * 0.65, 10),
      finishing: rng(q * 0.3, 10),
      crossing: rng(q * 0.82, 8),
      tackling: rng(q * 0.82, 8),
      marking: rng(q * 0.8, 8),
      heading: rng(q * 0.6, 12),
      longShots: rng(q * 0.3, 10),
      technique: rng(q * 0.72, 10),
    },
    mental: {
      decisions: rng(q * 0.82, 8),
      vision: rng(q * 0.75, 8),
      composure: rng(q * 0.78, 8),
      concentration: rng(q * 0.85, 6),
      anticipation: rng(q * 0.82, 6),
      positioning: rng(q * 0.85, 6),
      determination: rng(q * 0.82, 10),
      workRate: rng(q * 0.88, 8),
      teamwork: rng(q * 0.85, 8),
      leadership: rng(q * 0.65, 14),
      aggression: rng(q * 0.7, 12),
    },
    physical: {
      pace: rng(q * 0.82, 12),
      acceleration: rng(q * 0.84, 10),
      strength: rng(q * 0.72, 12),
      stamina: rng(q * 0.88, 8),
      agility: rng(q * 0.82, 10),
      balance: rng(q * 0.8, 10),
      jumping: rng(q * 0.68, 14),
      naturalFitness: rng(q * 0.85, 8),
    },
    goalkeeper: {
      reflexes: rng(10, 4),
      handling: rng(8, 4),
      oneOnOnes: rng(7, 3),
      gkPositioning: rng(8, 4),
      aerialAbility: rng(10, 4),
      kicking: rng(q * 0.55, 12),
      throwing: rng(q * 0.45, 10),
    },
  };
}

function dmAttributes(quality: number): PlayerAttributes {
  const q = quality;
  return {
    technical: {
      passing: rng(q * 0.82, 8),
      firstTouch: rng(q * 0.8, 8),
      dribbling: rng(q * 0.62, 12),
      finishing: rng(q * 0.35, 10),
      crossing: rng(q * 0.5, 12),
      tackling: rng(q * 0.88, 6),
      marking: rng(q * 0.85, 6),
      heading: rng(q * 0.68, 12),
      longShots: rng(q * 0.5, 12),
      technique: rng(q * 0.75, 10),
    },
    mental: {
      decisions: rng(q * 0.88, 6),
      vision: rng(q * 0.8, 8),
      composure: rng(q * 0.85, 6),
      concentration: rng(q * 0.88, 6),
      anticipation: rng(q * 0.88, 6),
      positioning: rng(q * 0.88, 6),
      determination: rng(q * 0.85, 8),
      workRate: rng(q * 0.9, 6),
      teamwork: rng(q * 0.88, 6),
      leadership: rng(q * 0.72, 14),
      aggression: rng(q * 0.75, 12),
    },
    physical: {
      pace: rng(q * 0.7, 14),
      acceleration: rng(q * 0.72, 12),
      strength: rng(q * 0.82, 10),
      stamina: rng(q * 0.9, 6),
      agility: rng(q * 0.72, 12),
      balance: rng(q * 0.75, 10),
      jumping: rng(q * 0.75, 12),
      naturalFitness: rng(q * 0.85, 8),
    },
    goalkeeper: {
      reflexes: rng(8, 3),
      handling: rng(7, 3),
      oneOnOnes: rng(6, 3),
      gkPositioning: rng(7, 3),
      aerialAbility: rng(8, 3),
      kicking: rng(q * 0.4, 12),
      throwing: rng(q * 0.35, 10),
    },
  };
}

function cmAttributes(quality: number): PlayerAttributes {
  const q = quality;
  return {
    technical: {
      passing: rng(q * 0.88, 6),
      firstTouch: rng(q * 0.85, 7),
      dribbling: rng(q * 0.72, 10),
      finishing: rng(q * 0.48, 12),
      crossing: rng(q * 0.6, 12),
      tackling: rng(q * 0.68, 12),
      marking: rng(q * 0.62, 12),
      heading: rng(q * 0.58, 14),
      longShots: rng(q * 0.6, 12),
      technique: rng(q * 0.85, 7),
    },
    mental: {
      decisions: rng(q * 0.9, 6),
      vision: rng(q * 0.88, 6),
      composure: rng(q * 0.85, 8),
      concentration: rng(q * 0.85, 8),
      anticipation: rng(q * 0.85, 8),
      positioning: rng(q * 0.8, 8),
      determination: rng(q * 0.85, 8),
      workRate: rng(q * 0.85, 8),
      teamwork: rng(q * 0.88, 6),
      leadership: rng(q * 0.72, 14),
      aggression: rng(q * 0.62, 14),
    },
    physical: {
      pace: rng(q * 0.72, 14),
      acceleration: rng(q * 0.74, 12),
      strength: rng(q * 0.72, 12),
      stamina: rng(q * 0.88, 6),
      agility: rng(q * 0.78, 10),
      balance: rng(q * 0.78, 10),
      jumping: rng(q * 0.68, 14),
      naturalFitness: rng(q * 0.85, 8),
    },
    goalkeeper: { reflexes: rng(7, 3), handling: rng(6, 3), oneOnOnes: rng(5, 3), gkPositioning: rng(6, 3), aerialAbility: rng(7, 3), kicking: rng(q * 0.38, 12), throwing: rng(q * 0.32, 10) },
  };
}

function amAttributes(quality: number): PlayerAttributes {
  const q = quality;
  return {
    technical: {
      passing: rng(q * 0.88, 6),
      firstTouch: rng(q * 0.9, 5),
      dribbling: rng(q * 0.85, 7),
      finishing: rng(q * 0.65, 10),
      crossing: rng(q * 0.65, 10),
      tackling: rng(q * 0.45, 14),
      marking: rng(q * 0.4, 14),
      heading: rng(q * 0.45, 14),
      longShots: rng(q * 0.7, 10),
      technique: rng(q * 0.9, 5),
    },
    mental: {
      decisions: rng(q * 0.88, 6),
      vision: rng(q * 0.92, 5),
      composure: rng(q * 0.85, 8),
      concentration: rng(q * 0.8, 8),
      anticipation: rng(q * 0.88, 6),
      positioning: rng(q * 0.82, 8),
      determination: rng(q * 0.82, 10),
      workRate: rng(q * 0.78, 10),
      teamwork: rng(q * 0.82, 8),
      leadership: rng(q * 0.68, 14),
      aggression: rng(q * 0.55, 14),
    },
    physical: {
      pace: rng(q * 0.8, 12),
      acceleration: rng(q * 0.82, 10),
      strength: rng(q * 0.62, 14),
      stamina: rng(q * 0.8, 10),
      agility: rng(q * 0.85, 8),
      balance: rng(q * 0.85, 8),
      jumping: rng(q * 0.58, 16),
      naturalFitness: rng(q * 0.82, 8),
    },
    goalkeeper: { reflexes: rng(6, 3), handling: rng(5, 3), oneOnOnes: rng(5, 3), gkPositioning: rng(5, 3), aerialAbility: rng(6, 3), kicking: rng(q * 0.35, 12), throwing: rng(q * 0.3, 10) },
  };
}

function wAttributes(quality: number): PlayerAttributes {
  const q = quality;
  return {
    technical: {
      passing: rng(q * 0.78, 8),
      firstTouch: rng(q * 0.85, 7),
      dribbling: rng(q * 0.92, 5),
      finishing: rng(q * 0.65, 10),
      crossing: rng(q * 0.82, 8),
      tackling: rng(q * 0.38, 14),
      marking: rng(q * 0.32, 14),
      heading: rng(q * 0.42, 14),
      longShots: rng(q * 0.62, 12),
      technique: rng(q * 0.88, 6),
    },
    mental: {
      decisions: rng(q * 0.82, 8),
      vision: rng(q * 0.85, 7),
      composure: rng(q * 0.8, 10),
      concentration: rng(q * 0.78, 10),
      anticipation: rng(q * 0.85, 8),
      positioning: rng(q * 0.78, 10),
      determination: rng(q * 0.82, 10),
      workRate: rng(q * 0.82, 10),
      teamwork: rng(q * 0.78, 10),
      leadership: rng(q * 0.62, 16),
      aggression: rng(q * 0.55, 14),
    },
    physical: {
      pace: rng(q * 0.92, 6),
      acceleration: rng(q * 0.92, 6),
      strength: rng(q * 0.6, 14),
      stamina: rng(q * 0.82, 8),
      agility: rng(q * 0.9, 6),
      balance: rng(q * 0.88, 7),
      jumping: rng(q * 0.55, 16),
      naturalFitness: rng(q * 0.82, 8),
    },
    goalkeeper: { reflexes: rng(6, 3), handling: rng(5, 3), oneOnOnes: rng(5, 3), gkPositioning: rng(5, 3), aerialAbility: rng(6, 3), kicking: rng(q * 0.35, 12), throwing: rng(q * 0.3, 10) },
  };
}

function stAttributes(quality: number): PlayerAttributes {
  const q = quality;
  return {
    technical: {
      passing: rng(q * 0.65, 12),
      firstTouch: rng(q * 0.85, 7),
      dribbling: rng(q * 0.75, 10),
      finishing: rng(q * 0.95, 4),
      crossing: rng(q * 0.45, 14),
      tackling: rng(q * 0.32, 14),
      marking: rng(q * 0.3, 14),
      heading: rng(q * 0.75, 10),
      longShots: rng(q * 0.68, 12),
      technique: rng(q * 0.82, 8),
    },
    mental: {
      decisions: rng(q * 0.85, 7),
      vision: rng(q * 0.78, 10),
      composure: rng(q * 0.88, 6),
      concentration: rng(q * 0.8, 8),
      anticipation: rng(q * 0.9, 5),
      positioning: rng(q * 0.92, 5),
      determination: rng(q * 0.88, 7),
      workRate: rng(q * 0.78, 10),
      teamwork: rng(q * 0.75, 12),
      leadership: rng(q * 0.68, 14),
      aggression: rng(q * 0.72, 12),
    },
    physical: {
      pace: rng(q * 0.8, 12),
      acceleration: rng(q * 0.82, 10),
      strength: rng(q * 0.8, 10),
      stamina: rng(q * 0.78, 12),
      agility: rng(q * 0.78, 10),
      balance: rng(q * 0.78, 10),
      jumping: rng(q * 0.78, 10),
      naturalFitness: rng(q * 0.82, 8),
    },
    goalkeeper: { reflexes: rng(6, 3), handling: rng(5, 3), oneOnOnes: rng(5, 3), gkPositioning: rng(5, 3), aerialAbility: rng(6, 3), kicking: rng(q * 0.35, 12), throwing: rng(q * 0.3, 10) },
  };
}

// ─── Player factory ───────────────────────────────────────────────────────────

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
];

const LAST_NAMES = [
  'Verlaine','Kovar','Brennan','Strader','Nolte','Visser','Dahl','Holm','Reiter','Faber',
  'Grun','Weiss','Baumann','Fischer','Hoffmann','Koch','Richter','Schreiber','Wagner','Wolff',
  'Petrov','Solov','Alves','Ferreira','Santos','Oliveira','Costa','Gomes','Carvalho','Lopes',
  'Müller','Bauer','Huber','Schneider','Zimmermann','Werner','Lehmann','Lang','Schulz','Braun',
  'Durand','Martin','Bernard','Thomas','Petit','Laurent','Simon','Michel','Lefebvre','Leroy',
  'Rossi','Romano','Esposito','Bianchi','Conti','De Luca','Mancini','Greco','Lombardi','Gallo',
];

function randomName(): string {
  return `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`;
}

function randomNationality(): string {
  return NATIONALITIES[Math.floor(Math.random() * NATIONALITIES.length)];
}

function randomFoot(): Foot {
  const r = Math.random();
  return r < 0.72 ? 'Right' : r < 0.94 ? 'Left' : 'Both';
}

function randomAge(minAge: number, maxAge: number): { age: number; dob: string } {
  const age = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;
  const today = new Date(2025, 6, 1); // game start date
  const dob = new Date(today.getFullYear() - age, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
  return { age, dob: dob.toISOString().split('T')[0] };
}

function squadStatus(quality: number): SquadStatus {
  if (quality >= 80) return 'Key Player';
  if (quality >= 68) return 'First Team';
  if (quality >= 55) return 'Rotation';
  if (quality >= 42) return 'Squad Player';
  return 'Reserve';
}

type AttrFn = (q: number) => PlayerAttributes;

const ATTR_FN_MAP: Record<string, AttrFn> = {
  GK: gkAttributes,
  CB: cbAttributes,
  LB: fbAttributes,
  RB: fbAttributes,
  LWB: fbAttributes,
  RWB: fbAttributes,
  DM: dmAttributes,
  CM: cmAttributes,
  LM: wAttributes,
  RM: wAttributes,
  AM: amAttributes,
  LW: wAttributes,
  RW: wAttributes,
  ST: stAttributes,
};

const SECONDARY_MAP: Record<Position, Position[]> = {
  GK: [],
  CB: ['DM', 'LB', 'RB'],
  LB: ['CB', 'LWB', 'LM'],
  RB: ['CB', 'RWB', 'RM'],
  LWB: ['LB', 'LM', 'LW'],
  RWB: ['RB', 'RM', 'RW'],
  DM: ['CM', 'CB'],
  CM: ['DM', 'AM'],
  LM: ['LW', 'LB', 'AM'],
  RM: ['RW', 'RB', 'AM'],
  AM: ['CM', 'ST'],
  LW: ['LM', 'AM', 'ST'],
  RW: ['RM', 'AM', 'ST'],
  ST: ['AM', 'LW', 'RW'],
};

export function makePlayer(
  pos: Position,
  quality: number,
  clubId: string,
  wageMultiplier = 1,
): Player {
  const id = nextPlayerId();
  const { age, dob } = randomAge(17, 35);
  const potential = clamp(quality + Math.floor(Math.random() * 15) + (age < 23 ? 8 : 0));
  const attrFn = ATTR_FN_MAP[pos] || cmAttributes;
  const attrs = attrFn(quality);
  const wage = Math.round((quality * quality * 0.4 + 500) * wageMultiplier);
  const contractYears = Math.floor(Math.random() * 3) + 1;
  const expiry = new Date(2025 + contractYears, 5, 30).toISOString().split('T')[0];
  const secondaries: Position[] = [];
  const pool = SECONDARY_MAP[pos] || [];
  if (pool.length > 0 && Math.random() > 0.35) {
    secondaries.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  const familiarity: Partial<Record<Position, number>> = { [pos]: 95 + Math.floor(Math.random() * 5) };
  secondaries.forEach((sp) => { familiarity[sp] = 55 + Math.floor(Math.random() * 30); });

  const careerStats: CareerStats = {
    appearances: Math.floor(age * 2.5 + Math.random() * 20),
    goals: pos === 'ST' ? Math.floor(Math.random() * 80 + 10) : pos === 'AM' || pos === 'LW' || pos === 'RW' ? Math.floor(Math.random() * 40) : Math.floor(Math.random() * 15),
    assists: pos === 'AM' || pos === 'LW' || pos === 'RW' ? Math.floor(Math.random() * 50 + 5) : Math.floor(Math.random() * 25),
    yellowCards: Math.floor(Math.random() * 30),
    redCards: Math.floor(Math.random() * 4),
    cleanSheets: pos === 'GK' ? Math.floor(Math.random() * 80 + 10) : 0,
  };

  return {
    id,
    name: randomName(),
    dateOfBirth: dob,
    age,
    nationality: randomNationality(),
    position: pos,
    secondaryPositions: secondaries,
    positionalFamiliarity: familiarity,
    attributes: attrs,
    currentAbility: clamp(quality),
    potentialAbility: clamp(potential),
    preferredFoot: randomFoot(),
    height: Math.floor(Math.random() * 30 + 165),
    weight: Math.floor(Math.random() * 25 + 65),
    contract: {
      wage,
      expiryDate: expiry,
      squadStatus: squadStatus(quality),
    },
    morale: clamp(60 + Math.floor(Math.random() * 30)),
    fitness: clamp(75 + Math.floor(Math.random() * 25)),
    matchSharpness: clamp(50 + Math.floor(Math.random() * 40)),
    reputation: clamp(quality * 0.85 + Math.random() * 15),
    clubId,
    isInjured: Math.random() < 0.06,
    injuryDaysRemaining: undefined,
    injuryType: undefined,
    careerStats,
  };
}

// Convenience squad builder
export function buildSquad(
  clubId: string,
  qualityBase: number,
  spread: number,
): { players: Player[]; playerIds: string[] } {
  const q = (extra = 0) => clamp(qualityBase + extra + (Math.random() - 0.5) * spread * 2);
  const roster: { pos: Position; n: number; qAdj: number }[] = [
    { pos: 'GK', n: 2, qAdj: 0 },
    { pos: 'CB', n: 4, qAdj: 0 },
    { pos: 'LB', n: 2, qAdj: -2 },
    { pos: 'RB', n: 2, qAdj: -2 },
    { pos: 'DM', n: 2, qAdj: -2 },
    { pos: 'CM', n: 4, qAdj: 0 },
    { pos: 'AM', n: 2, qAdj: 2 },
    { pos: 'LW', n: 2, qAdj: 2 },
    { pos: 'RW', n: 2, qAdj: 2 },
    { pos: 'ST', n: 2, qAdj: 4 },
  ];
  const players: Player[] = [];
  for (const { pos, n, qAdj } of roster) {
    for (let i = 0; i < n; i++) {
      players.push(makePlayer(pos, q(qAdj), clubId));
    }
  }
  return { players, playerIds: players.map((p) => p.id) };
}
