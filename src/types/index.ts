// ─── Player Attributes ────────────────────────────────────────────────────────

export interface TechnicalAttributes {
  passing: number;
  firstTouch: number;
  dribbling: number;
  finishing: number;
  crossing: number;
  tackling: number;
  marking: number;
  heading: number;
  longShots: number;
  technique: number;
}

export interface MentalAttributes {
  decisions: number;
  vision: number;
  composure: number;
  concentration: number;
  anticipation: number;
  positioning: number;
  determination: number;
  workRate: number;
  teamwork: number;
  leadership: number;
  aggression: number;
}

export interface PhysicalAttributes {
  pace: number;
  acceleration: number;
  strength: number;
  stamina: number;
  agility: number;
  balance: number;
  jumping: number;
  naturalFitness: number;
}

export interface GoalkeeperAttributes {
  reflexes: number;
  handling: number;
  oneOnOnes: number;
  gkPositioning: number;
  aerialAbility: number;
  kicking: number;
  throwing: number;
}

export interface PlayerAttributes {
  technical: TechnicalAttributes;
  mental: MentalAttributes;
  physical: PhysicalAttributes;
  goalkeeper: GoalkeeperAttributes;
}

// ─── Position Types ───────────────────────────────────────────────────────────

export type Position =
  | 'GK'
  | 'CB'
  | 'LB'
  | 'RB'
  | 'LWB'
  | 'RWB'
  | 'DM'
  | 'CM'
  | 'LM'
  | 'RM'
  | 'AM'
  | 'LW'
  | 'RW'
  | 'ST';

export type PositionalFamiliarity = Record<Position, number>;

export type SquadStatus =
  | 'Key Player'
  | 'First Team'
  | 'Rotation'
  | 'Squad Player'
  | 'Reserve'
  | 'Youth';

export type Foot = 'Right' | 'Left' | 'Both';

// ─── Contract ─────────────────────────────────────────────────────────────────

export interface Contract {
  wage: number; // weekly wage in fictional currency units
  expiryDate: string; // ISO date string
  squadStatus: SquadStatus;
  bonuses?: {
    appearance?: number;
    goal?: number;
    clean_sheet?: number;
  };
}

// ─── Player ───────────────────────────────────────────────────────────────────

export interface Player {
  id: string;
  name: string;
  dateOfBirth: string; // ISO date
  age: number;
  nationality: string;
  position: Position;
  secondaryPositions: Position[];
  positionalFamiliarity: Partial<PositionalFamiliarity>;
  attributes: PlayerAttributes;
  currentAbility: number; // 1-100
  potentialAbility: number; // 1-100
  preferredFoot: Foot;
  height: number; // cm
  weight: number; // kg
  contract: Contract;
  morale: number; // 0-100
  fitness: number; // 0-100
  matchSharpness: number; // 0-100
  reputation: number; // 1-100
  clubId: string;
  isInjured: boolean;
  injuryDaysRemaining?: number;
  injuryType?: string;
  careerStats?: CareerStats;
}

export interface CareerStats {
  appearances: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  cleanSheets: number; // for GKs
}

// ─── Staff / Manager ──────────────────────────────────────────────────────────

export interface Manager {
  id: string;
  name: string;
  nationality: string;
  age: number;
  preferredFormation: string;
  coachingAttributes: {
    tactical: number;
    technical: number;
    mental: number;
    fitness: number;
    youth: number;
  };
  reputation: number;
  clubId: string;
}

// ─── Club ─────────────────────────────────────────────────────────────────────

export interface Club {
  id: string;
  name: string;
  shortName: string;
  city: string;
  stadium: string;
  stadiumCapacity: number;
  reputation: number; // 1-100
  colors: {
    primary: string;
    secondary: string;
  };
  finances: ClubFinances;
  manager: Manager;
  playerIds: string[];
  leagueId: string;
  facilities: Facilities;
}

export interface ClubFinances {
  balance: number;
  transferBudget: number;
  wageBudget: number;
  weeklyWageBill: number;
  seasonRevenue: number;
  seasonExpenditure: number;
}

export interface Facilities {
  trainingGround: number; // 1-5
  youthAcademy: number; // 1-5
  stadium: number; // 1-5
  medical: number; // 1-5
}

// ─── League ───────────────────────────────────────────────────────────────────

export interface League {
  id: string;
  name: string;
  country: string;
  division: number;
  clubIds: string[];
}

export interface LeagueTableEntry {
  clubId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: MatchOutcome[]; // last 5
}

export type MatchOutcome = 'W' | 'D' | 'L';

// ─── Fixture / Match ──────────────────────────────────────────────────────────

export interface Fixture {
  id: string;
  leagueId: string;
  homeClubId: string;
  awayClubId: string;
  date: string; // ISO date
  played: boolean;
  result?: MatchResult;
}

export interface MatchResult {
  homeGoals: number;
  awayGoals: number;
  scorers?: { playerId: string; minute: number }[];
  attendance?: number;
}

// ─── Game State ───────────────────────────────────────────────────────────────

export interface GameState {
  version: number;
  currentDate: string; // ISO date
  season: string;
  playerClubId: string;
  clubs: Record<string, Club>;
  players: Record<string, Player>;
  leagues: Record<string, League>;
  fixtures: Fixture[];
  leagueTable: Record<string, LeagueTableEntry>;
  news: NewsItem[];
  lastSaved: string;
}

export interface NewsItem {
  id: string;
  date: string;
  headline: string;
  body: string;
  category: 'Transfer' | 'Match' | 'Club' | 'Player' | 'General';
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export type NavSection =
  | 'dashboard'
  | 'squad'
  | 'tactics'
  | 'matches'
  | 'transfers'
  | 'training'
  | 'scouting'
  | 'club'
  | 'finances'
  | 'staff';
