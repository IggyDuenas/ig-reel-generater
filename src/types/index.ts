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
  freeKicks: number;
  corners: number;
  penalties: number;
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
  offTheBall: number;
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
  communication: number;
  sweeperAbility: number;
}

export interface PlayerAttributes {
  technical: TechnicalAttributes;
  mental: MentalAttributes;
  physical: PhysicalAttributes;
  goalkeeper: GoalkeeperAttributes;
}

// ─── Hidden characteristics (not fully exposed to player) ────────────────────

export interface HiddenCharacteristics {
  professionalism: number;   // 1-100 — training dedication, punctuality
  consistency: number;       // 1-100 — performance variance match-to-match
  adaptability: number;      // 1-100 — how quickly they settle at new clubs
  injuryProneness: number;   // 1-100 — susceptibility to injury (higher = more prone)
  ambition: number;          // 1-100 — desire to win trophies and improve
  loyalty: number;           // 1-100 — tendency to stay at a club
  pressureHandling: number;  // 1-100 — performance in high-stakes situations
  learningSpeed: number;     // 1-100 — how fast they develop from training
  bigMatchMentality: number; // 1-100 — raises when match importance is high
}

// ─── Personality (derived from hidden characteristics) ───────────────────────

export type PersonalityLabel =
  | 'Professional'
  | 'Driven'
  | 'Ambitious'
  | 'Determined'
  | 'Balanced'
  | 'Laid Back'
  | 'Team Player'
  | 'Competitive'
  | 'Resolute'
  | 'Maverick'
  | 'Loyal';

// ─── Preferred Role ───────────────────────────────────────────────────────────

export type PreferredRole =
  | 'Complete Forward'
  | 'Poacher'
  | 'Target Man'
  | 'Deep-Lying Forward'
  | 'Winger'
  | 'Inside Forward'
  | 'Advanced Playmaker'
  | 'Deep-Lying Playmaker'
  | 'Box-to-Box Midfielder'
  | 'Ball-Winning Midfielder'
  | 'Defensive Midfielder'
  | 'Wide Midfielder'
  | 'Attacking Full Back'
  | 'Defensive Full Back'
  | 'Ball-Playing Defender'
  | 'No-Nonsense Defender'
  | 'Sweeper Keeper'
  | 'Traditional Goalkeeper';

// ─── Player Preferences ───────────────────────────────────────────────────────

export interface PlayerPreferences {
  preferredFoot: Foot;
  preferredRole: PreferredRole;
  prefersAttacking: boolean;
  prefersLargeClub: boolean;
}

// ─── Career History ───────────────────────────────────────────────────────────

export interface CareerHistoryEntry {
  clubId: string;
  clubName: string;
  seasonStart: string;
  seasonEnd: string;
  appearances: number;
  goals: number;
  assists: number;
  averageRating: number;
}

export interface CareerStats {
  appearances: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  cleanSheets: number;
  averageRating: number;
  history: CareerHistoryEntry[];
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
  wage: number; // weekly wage in Valsorian Francs
  expiryDate: string;
  squadStatus: SquadStatus;
  bonuses?: { appearance?: number; goal?: number; clean_sheet?: number };
}

// ─── Player ───────────────────────────────────────────────────────────────────

export interface Player {
  id: string;
  name: string;
  dateOfBirth: string;
  age: number;
  nationality: string;
  position: Position;
  secondaryPositions: Position[];
  positionalFamiliarity: Partial<PositionalFamiliarity>;
  attributes: PlayerAttributes;
  currentAbility: number;      // derived: position-weighted attr score (1-100)
  potentialAbility: number;    // ceiling under ideal development
  positionAbilities: Partial<Record<Position, number>>; // CA per position
  preferredFoot: Foot;
  height: number;
  weight: number;
  contract: Contract;
  morale: number;
  fitness: number;
  matchSharpness: number;
  reputation: number;
  marketValue: number;         // in Valsorian Francs (₣)
  clubId: string;
  isInjured: boolean;
  injuryDaysRemaining?: number;
  injuryType?: string;
  hiddenCharacteristics: HiddenCharacteristics;
  preferences: PlayerPreferences;
  personality: PersonalityLabel;
  developmentRate: number;     // hidden — used by future training system
  injuryProneness: number;     // hidden — mirrors hidden.injuryProneness
  careerStats: CareerStats;
  // Step 1 compat — optional version marker
  _v?: number;
}

// ─── Club Identity ────────────────────────────────────────────────────────────

export interface ClubIdentity {
  tacticalPhilosophy: string;
  squadBuildingPhilosophy: string;
  youthFocus: number;            // 1-100
  transferAggressiveness: number; // 1-100
  financialStrength: number;     // 1-100
}

// ─── Squad Metrics (computed, not stored) ────────────────────────────────────

export interface SquadMetrics {
  averageAbility: number;
  averagePotential: number;
  averageAge: number;
  squadDepth: number;
  goalkeeperStrength: number;
  defensiveStrength: number;
  midfieldStrength: number;
  attackingStrength: number;
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
  reputation: number;
  colors: { primary: string; secondary: string };
  finances: ClubFinances;
  manager: Manager;
  playerIds: string[];
  leagueId: string;
  facilities: Facilities;
  identity: ClubIdentity;
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
  youthAcademy: number;
  stadium: number;
  medical: number;
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
  form: MatchOutcome[];
}

export type MatchOutcome = 'W' | 'D' | 'L';

// ─── Fixture / Match ──────────────────────────────────────────────────────────

export interface Fixture {
  id: string;
  leagueId: string;
  homeClubId: string;
  awayClubId: string;
  date: string;
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
  currentDate: string;
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
