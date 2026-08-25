import type { Club, League, Player, Manager, GameState, LeagueTableEntry, Fixture, NewsItem } from '../types';
import { buildSquad } from './generators';

// ─── League ───────────────────────────────────────────────────────────────────

const LEAGUE_ID = 'league_valsoria';

const LEAGUE: League = {
  id: LEAGUE_ID,
  name: 'Valsoria Premier League',
  country: 'Valsoria',
  division: 1,
  clubIds: [],
};

// ─── Manager factory ──────────────────────────────────────────────────────────

function makeManager(name: string, clubId: string, nationality: string, age: number, reputation: number, formation: string): Manager {
  return {
    id: `mgr_${clubId}`,
    name,
    nationality,
    age,
    preferredFormation: formation,
    coachingAttributes: {
      tactical: Math.round(reputation * 0.85 + Math.random() * 12),
      technical: Math.round(reputation * 0.75 + Math.random() * 14),
      mental: Math.round(reputation * 0.8 + Math.random() * 12),
      fitness: Math.round(reputation * 0.7 + Math.random() * 16),
      youth: Math.round(reputation * 0.7 + Math.random() * 18),
    },
    reputation,
    clubId,
  };
}

// ─── Club definitions ─────────────────────────────────────────────────────────

interface ClubDef {
  id: string;
  name: string;
  shortName: string;
  city: string;
  stadium: string;
  capacity: number;
  reputation: number;
  balance: number;
  transferBudget: number;
  wageBudget: number;
  colors: { primary: string; secondary: string };
  managerName: string;
  managerNationality: string;
  managerAge: number;
  managerFormation: string;
  qualityBase: number;
  qualitySpread: number;
}

const CLUB_DEFS: ClubDef[] = [
  {
    id: 'club_ironvale',
    name: 'Ironvale FC',
    shortName: 'IFC',
    city: 'Ironvale',
    stadium: 'Crucible Arena',
    capacity: 52000,
    reputation: 94,
    balance: 142_000_000,
    transferBudget: 48_000_000,
    wageBudget: 1_800_000,
    colors: { primary: '#1a1a2e', secondary: '#e94560' },
    managerName: 'Drago Velko',
    managerNationality: 'Valmorian',
    managerAge: 52,
    managerFormation: '4-3-3',
    qualityBase: 84,
    qualitySpread: 8,
  },
  {
    id: 'club_solara',
    name: 'Solara City',
    shortName: 'SCY',
    city: 'Solara',
    stadium: 'Sunfield Stadium',
    capacity: 58000,
    reputation: 92,
    balance: 165_000_000,
    transferBudget: 60_000_000,
    wageBudget: 2_100_000,
    colors: { primary: '#0f3460', secondary: '#f5a623' },
    managerName: 'Marek Struben',
    managerNationality: 'Keldorian',
    managerAge: 48,
    managerFormation: '4-2-3-1',
    qualityBase: 86,
    qualitySpread: 7,
  },
  {
    id: 'club_redmoor',
    name: 'Redmoor Athletic',
    shortName: 'RMA',
    city: 'Redmoor',
    stadium: 'The Moorfield',
    capacity: 44000,
    reputation: 82,
    balance: 68_000_000,
    transferBudget: 22_000_000,
    wageBudget: 1_200_000,
    colors: { primary: '#8b0000', secondary: '#d4af37' },
    managerName: 'Gregor Fandt',
    managerNationality: 'Stravian',
    managerAge: 55,
    managerFormation: '4-4-2',
    qualityBase: 74,
    qualitySpread: 9,
  },
  {
    id: 'club_velthorn',
    name: 'Velthorn United',
    shortName: 'VTU',
    city: 'Velthorn',
    stadium: 'Thornfield Park',
    capacity: 41000,
    reputation: 78,
    balance: 52_000_000,
    transferBudget: 18_000_000,
    wageBudget: 1_050_000,
    colors: { primary: '#1b5e20', secondary: '#ffffff' },
    managerName: 'Soren Lund',
    managerNationality: 'Nordovian',
    managerAge: 44,
    managerFormation: '3-5-2',
    qualityBase: 70,
    qualitySpread: 10,
  },
  {
    id: 'club_portcrest',
    name: 'Portcrest Rovers',
    shortName: 'PCR',
    city: 'Portcrest',
    stadium: 'Harbour Ground',
    capacity: 36000,
    reputation: 72,
    balance: 38_000_000,
    transferBudget: 12_000_000,
    wageBudget: 850_000,
    colors: { primary: '#004d7a', secondary: '#00c6fb' },
    managerName: 'Nando Bressa',
    managerNationality: 'Calderian',
    managerAge: 47,
    managerFormation: '4-3-3',
    qualityBase: 64,
    qualitySpread: 10,
  },
  {
    id: 'club_greyvast',
    name: 'Greyvast Town',
    shortName: 'GVT',
    city: 'Greyvast',
    stadium: 'Stonegate Park',
    capacity: 28000,
    reputation: 65,
    balance: 24_000_000,
    transferBudget: 7_500_000,
    wageBudget: 620_000,
    colors: { primary: '#424242', secondary: '#9e9e9e' },
    managerName: 'Patrik Hren',
    managerNationality: 'Mirovan',
    managerAge: 50,
    managerFormation: '4-5-1',
    qualityBase: 58,
    qualitySpread: 11,
  },
  {
    id: 'club_dunmore',
    name: 'Dunmore City',
    shortName: 'DMC',
    city: 'Dunmore',
    stadium: 'Dunfield Bowl',
    capacity: 24000,
    reputation: 60,
    balance: 18_000_000,
    transferBudget: 5_000_000,
    wageBudget: 520_000,
    colors: { primary: '#4a148c', secondary: '#ce93d8' },
    managerName: 'Carlo Menta',
    managerNationality: 'Trebonian',
    managerAge: 42,
    managerFormation: '4-4-2',
    qualityBase: 53,
    qualitySpread: 12,
  },
  {
    id: 'club_fastbridge',
    name: 'Fastbridge FC',
    shortName: 'FBF',
    city: 'Fastbridge',
    stadium: 'Bridge Road Ground',
    capacity: 20000,
    reputation: 54,
    balance: 12_000_000,
    transferBudget: 3_000_000,
    wageBudget: 420_000,
    colors: { primary: '#bf360c', secondary: '#ffccbc' },
    managerName: 'Tom Wirren',
    managerNationality: 'Fastovian',
    managerAge: 38,
    managerFormation: '5-3-2',
    qualityBase: 48,
    qualitySpread: 12,
  },
  {
    id: 'club_grenzburg',
    name: 'Grenzburg Athletic',
    shortName: 'GBA',
    city: 'Grenzburg',
    stadium: 'Grenz Oval',
    capacity: 18000,
    reputation: 46,
    balance: 8_500_000,
    transferBudget: 2_000_000,
    wageBudget: 340_000,
    colors: { primary: '#006064', secondary: '#80deea' },
    managerName: 'Herr Bock',
    managerNationality: 'Grenzian',
    managerAge: 59,
    managerFormation: '4-4-2',
    qualityBase: 43,
    qualitySpread: 12,
  },
  {
    id: 'club_astorias',
    name: 'Astorias SC',
    shortName: 'ASC',
    city: 'Astorias',
    stadium: 'Costa Verde Arena',
    capacity: 16000,
    reputation: 40,
    balance: 6_000_000,
    transferBudget: 1_500_000,
    wageBudget: 280_000,
    colors: { primary: '#33691e', secondary: '#ccff90' },
    managerName: 'Emilio Varx',
    managerNationality: 'Astorian',
    managerAge: 45,
    managerFormation: '4-3-3',
    qualityBase: 38,
    qualitySpread: 11,
  },
];

// ─── Fixture generator ────────────────────────────────────────────────────────

function generateFixtures(clubIds: string[]): Fixture[] {
  const fixtures: Fixture[] = [];
  const n = clubIds.length;
  let fixtureId = 1;
  const gameweeks: [string, string][][] = [];

  // Round-robin both legs
  for (let round = 0; round < 2; round++) {
    const ids = [...clubIds];
    const numRounds = n - 1;
    const half = n / 2;
    for (let r = 0; r < numRounds; r++) {
      const matchday: [string, string][] = [];
      for (let m = 0; m < half; m++) {
        const home = round === 0 ? ids[m] : ids[n - 1 - m];
        const away = round === 0 ? ids[n - 1 - m] : ids[m];
        if (r % 2 === 1) matchday.push([away, home]);
        else matchday.push([home, away]);
      }
      gameweeks.push(matchday);
      // rotate
      const last = ids.pop()!;
      ids.splice(1, 0, last);
    }
  }

  const startDate = new Date(2025, 7, 9); // Aug 9
  gameweeks.forEach((gw, gwIdx) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + gwIdx * 7);
    gw.forEach(([h, a]) => {
      fixtures.push({
        id: `fix_${String(fixtureId++).padStart(4, '0')}`,
        leagueId: LEAGUE_ID,
        homeClubId: h,
        awayClubId: a,
        date: d.toISOString().split('T')[0],
        played: false,
      });
    });
  });
  return fixtures;
}

// ─── League table init ────────────────────────────────────────────────────────

function initLeagueTable(clubIds: string[]): Record<string, LeagueTableEntry> {
  const table: Record<string, LeagueTableEntry> = {};
  clubIds.forEach((id) => {
    table[id] = {
      clubId: id,
      played: 0, won: 0, drawn: 0, lost: 0,
      goalsFor: 0, goalsAgainst: 0, goalDifference: 0,
      points: 0, form: [],
    };
  });
  return table;
}

// ─── Seed news ────────────────────────────────────────────────────────────────

function seedNews(): NewsItem[] {
  return [
    {
      id: 'news_001',
      date: '2025-07-01',
      headline: 'Season Kickoff — Valsoria Premier League Preview',
      body: 'The new season is upon us. Ironvale FC and Solara City are once again tipped as title favourites, but can the mid-table clubs surprise?',
      category: 'General',
    },
    {
      id: 'news_002',
      date: '2025-07-03',
      headline: 'Pre-Season Friendlies Underway',
      body: 'Clubs across Valsoria are putting final touches on their squads ahead of the August season opener.',
      category: 'General',
    },
    {
      id: 'news_003',
      date: '2025-07-05',
      headline: 'Transfer Window Now Open',
      body: 'The summer transfer window has officially opened. Expect plenty of activity in the coming weeks.',
      category: 'Transfer',
    },
  ];
}

// ─── World builder ────────────────────────────────────────────────────────────

export function buildInitialWorld(playerClubId = 'club_redmoor'): GameState {
  const allPlayers: Record<string, Player> = {};
  const allClubs: Record<string, Club> = {};

  const clubIds = CLUB_DEFS.map((d) => d.id);
  LEAGUE.clubIds = clubIds;

  CLUB_DEFS.forEach((def) => {
    const { players, playerIds } = buildSquad(def.id, def.qualityBase, def.qualitySpread);
    players.forEach((p) => { allPlayers[p.id] = p; });

    const weeklyWageBill = players.reduce((sum, p) => sum + p.contract.wage, 0);

    const club: Club = {
      id: def.id,
      name: def.name,
      shortName: def.shortName,
      city: def.city,
      stadium: def.stadium,
      stadiumCapacity: def.capacity,
      reputation: def.reputation,
      colors: def.colors,
      finances: {
        balance: def.balance,
        transferBudget: def.transferBudget,
        wageBudget: def.wageBudget,
        weeklyWageBill,
        seasonRevenue: 0,
        seasonExpenditure: 0,
      },
      manager: makeManager(def.managerName, def.id, def.managerNationality, def.managerAge, def.reputation, def.managerFormation),
      playerIds,
      leagueId: LEAGUE_ID,
      facilities: {
        trainingGround: Math.round(def.reputation / 20),
        youthAcademy: Math.round(def.reputation / 22),
        stadium: Math.round(def.capacity / 12000),
        medical: Math.round(def.reputation / 22),
      },
    };
    allClubs[def.id] = club;
  });

  const fixtures = generateFixtures(clubIds);
  const leagueTable = initLeagueTable(clubIds);

  return {
    version: 1,
    currentDate: '2025-07-01',
    season: '2025/26',
    playerClubId,
    clubs: allClubs,
    players: allPlayers,
    leagues: { [LEAGUE_ID]: LEAGUE },
    fixtures,
    leagueTable,
    news: seedNews(),
    lastSaved: new Date().toISOString(),
  };
}
