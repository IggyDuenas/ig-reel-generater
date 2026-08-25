import type {
  Club, Competition, Region, Rivalry, Player, Manager, GameState,
  LeagueTableEntry, Fixture, NewsItem, ClubIdentity,
} from '../types';
import { buildSquad, resetPlayerIdCounter } from './generators';

// ─── Regions ──────────────────────────────────────────────────────────────────

const REGIONS: Region[] = [
  { id: 'region_northern_coast', name: 'Northern Coast', description: 'Rugged coastal communities with a proud footballing tradition.' },
  { id: 'region_ironlands', name: 'The Ironlands', description: 'Industrial heartland; clubs built on working-class pride.' },
  { id: 'region_central_plains', name: 'Central Plains', description: 'Flat agricultural expanse producing technically skilled sides.' },
  { id: 'region_eastern_highlands', name: 'Eastern Highlands', description: 'Highland region where physical, direct football dominates.' },
  { id: 'region_western_marches', name: 'Western Marches', description: 'Border territories with fiercely competitive local derbies.' },
  { id: 'region_southern_coast', name: 'Southern Coast', description: 'Prosperous coastal cities with continental football influences.' },
  { id: 'region_capital_district', name: 'Capital District', description: 'The heart of Valsoria; home to the nation\'s biggest clubs.' },
  { id: 'region_lake_district', name: 'Lake District', description: 'Scenic inland region with disciplined, possession-minded clubs.' },
  { id: 'region_riverlands', name: 'The Riverlands', description: 'River valley communities renowned for hard-working team spirit.' },
  { id: 'region_southern_highlands', name: 'Southern Highlands', description: 'Remote southern hills where resilience defines the football culture.' },
];

// ─── Competition definitions ──────────────────────────────────────────────────

const COMP_VPL = 'comp_vpl';
const COMP_VC  = 'comp_vc';
const COMP_VNL = 'comp_vnl';
const COMP_VRL = 'comp_vrl';

const COMP_DEFS: Omit<Competition, 'clubIds'>[] = [
  { id: COMP_VPL, name: 'Valsoria Premier League', shortName: 'VPL', country: 'Valsoria', level: 1, type: 'league', reputation: 88, promotionPlaces: 0, playoffPlaces: 0, relegationPlaces: 3, prizeMoneyWinner: 15_000_000 },
  { id: COMP_VC,  name: 'Valsoria Championship',   shortName: 'VCh', country: 'Valsoria', level: 2, type: 'league', reputation: 62, promotionPlaces: 2, playoffPlaces: 4, relegationPlaces: 3, prizeMoneyWinner: 3_000_000 },
  { id: COMP_VNL, name: 'Valsoria National League', shortName: 'VNL', country: 'Valsoria', level: 3, type: 'league', reputation: 42, promotionPlaces: 1, playoffPlaces: 2, relegationPlaces: 4, prizeMoneyWinner: 500_000 },
  { id: COMP_VRL, name: 'Valsoria Regional League', shortName: 'VRL', country: 'Valsoria', level: 4, type: 'league', reputation: 22, promotionPlaces: 2, playoffPlaces: 2, relegationPlaces: 0, prizeMoneyWinner: 50_000 },
];

// ─── Club definitions ─────────────────────────────────────────────────────────

interface ClubDef {
  id: string; name: string; shortName: string; city: string;
  stadium: string; capacity: number; reputation: number;
  competitionId: string; regionId: string;
  colors: { primary: string; secondary: string };
  managerName: string; managerNationality: string; managerAge: number; managerFormation: string;
  qualityBase: number; qualitySpread: number;
  balance: number; transferBudget: number; wageBudget: number;
  identity: ClubIdentity;
}

const CLUB_DEFS: ClubDef[] = [
  // ── Valsoria Premier League ──────────────────────────────────────────────────
  {
    id: 'club_ironvale', name: 'Ironvale FC', shortName: 'IFC', city: 'Ironvale',
    stadium: 'Crucible Arena', capacity: 52000, reputation: 94,
    competitionId: COMP_VPL, regionId: 'region_ironlands',
    colors: { primary: '#1a1a2e', secondary: '#e94560' },
    managerName: 'Drago Velko', managerNationality: 'Valmorian', managerAge: 52, managerFormation: '4-3-3',
    qualityBase: 84, qualitySpread: 8,
    balance: 142_000_000, transferBudget: 48_000_000, wageBudget: 1_800_000,
    identity: { tacticalPhilosophy: 'High Pressing', squadBuildingPhilosophy: 'Galáctico Recruitment', youthFocus: 35, transferAggressiveness: 85, financialStrength: 95 },
  },
  {
    id: 'club_solara', name: 'Solara City', shortName: 'SCY', city: 'Solara',
    stadium: 'Sunfield Stadium', capacity: 58000, reputation: 92,
    competitionId: COMP_VPL, regionId: 'region_capital_district',
    colors: { primary: '#0f3460', secondary: '#f5a623' },
    managerName: 'Marek Struben', managerNationality: 'Keldorian', managerAge: 48, managerFormation: '4-2-3-1',
    qualityBase: 86, qualitySpread: 7,
    balance: 165_000_000, transferBudget: 60_000_000, wageBudget: 2_100_000,
    identity: { tacticalPhilosophy: 'Possession Football', squadBuildingPhilosophy: 'Balanced Approach', youthFocus: 45, transferAggressiveness: 75, financialStrength: 92 },
  },
  {
    id: 'club_redmoor', name: 'Redmoor Athletic', shortName: 'RMA', city: 'Redmoor',
    stadium: 'The Moorfield', capacity: 44000, reputation: 82,
    competitionId: COMP_VPL, regionId: 'region_western_marches',
    colors: { primary: '#8b0000', secondary: '#d4af37' },
    managerName: 'Gregor Fandt', managerNationality: 'Stravian', managerAge: 55, managerFormation: '4-4-2',
    qualityBase: 74, qualitySpread: 9,
    balance: 68_000_000, transferBudget: 22_000_000, wageBudget: 1_200_000,
    identity: { tacticalPhilosophy: 'Counter-Attack', squadBuildingPhilosophy: 'Balanced Recruitment', youthFocus: 55, transferAggressiveness: 55, financialStrength: 70 },
  },
  {
    id: 'club_thornwick', name: 'Thornwick FC', shortName: 'TFC', city: 'Thornwick',
    stadium: 'Thorngate Arena', capacity: 38000, reputation: 80,
    competitionId: COMP_VPL, regionId: 'region_northern_coast',
    colors: { primary: '#2c3e50', secondary: '#e67e22' },
    managerName: 'Lars Vorne', managerNationality: 'Nordovian', managerAge: 46, managerFormation: '4-3-3',
    qualityBase: 72, qualitySpread: 9,
    balance: 55_000_000, transferBudget: 20_000_000, wageBudget: 1_100_000,
    identity: { tacticalPhilosophy: 'Attacking Football', squadBuildingPhilosophy: 'Balanced Approach', youthFocus: 50, transferAggressiveness: 60, financialStrength: 63 },
  },
  {
    id: 'club_velthorn', name: 'Velthorn United', shortName: 'VTU', city: 'Velthorn',
    stadium: 'Thornfield Park', capacity: 41000, reputation: 78,
    competitionId: COMP_VPL, regionId: 'region_eastern_highlands',
    colors: { primary: '#1b5e20', secondary: '#ffffff' },
    managerName: 'Soren Lund', managerNationality: 'Nordovian', managerAge: 44, managerFormation: '3-5-2',
    qualityBase: 70, qualitySpread: 10,
    balance: 52_000_000, transferBudget: 18_000_000, wageBudget: 1_050_000,
    identity: { tacticalPhilosophy: 'Direct Play', squadBuildingPhilosophy: 'Youth Development', youthFocus: 75, transferAggressiveness: 45, financialStrength: 60 },
  },
  {
    id: 'club_valdenmere', name: 'FC Valdenmere', shortName: 'FVM', city: 'Valdenmere',
    stadium: 'Mere Park', capacity: 33000, reputation: 76,
    competitionId: COMP_VPL, regionId: 'region_lake_district',
    colors: { primary: '#1a237e', secondary: '#f57f17' },
    managerName: 'Piet Hakker', managerNationality: 'Keldorian', managerAge: 51, managerFormation: '4-4-2',
    qualityBase: 68, qualitySpread: 10,
    balance: 46_000_000, transferBudget: 16_000_000, wageBudget: 980_000,
    identity: { tacticalPhilosophy: 'Counter-Attack', squadBuildingPhilosophy: 'Experience & Stability', youthFocus: 40, transferAggressiveness: 55, financialStrength: 58 },
  },
  {
    id: 'club_kressen', name: 'Kressen City', shortName: 'KRC', city: 'Kressen',
    stadium: 'Kressenfield', capacity: 30000, reputation: 73,
    competitionId: COMP_VPL, regionId: 'region_central_plains',
    colors: { primary: '#b71c1c', secondary: '#ffeb3b' },
    managerName: 'Mikko Haara', managerNationality: 'Mirovan', managerAge: 43, managerFormation: '4-2-3-1',
    qualityBase: 65, qualitySpread: 10,
    balance: 38_000_000, transferBudget: 13_000_000, wageBudget: 880_000,
    identity: { tacticalPhilosophy: 'High Pressing', squadBuildingPhilosophy: 'Balanced Approach', youthFocus: 55, transferAggressiveness: 65, financialStrength: 55 },
  },
  {
    id: 'club_portcrest', name: 'Portcrest Rovers', shortName: 'PCR', city: 'Portcrest',
    stadium: 'Harbour Ground', capacity: 36000, reputation: 72,
    competitionId: COMP_VPL, regionId: 'region_southern_coast',
    colors: { primary: '#004d7a', secondary: '#00c6fb' },
    managerName: 'Nando Bressa', managerNationality: 'Calderian', managerAge: 47, managerFormation: '4-3-3',
    qualityBase: 64, qualitySpread: 10,
    balance: 38_000_000, transferBudget: 12_000_000, wageBudget: 850_000,
    identity: { tacticalPhilosophy: 'Pragmatic Defence', squadBuildingPhilosophy: 'Experience & Stability', youthFocus: 40, transferAggressiveness: 50, financialStrength: 55 },
  },
  {
    id: 'club_brackmore', name: 'Brackmore United', shortName: 'BRU', city: 'Brackmore',
    stadium: 'Brack End Ground', capacity: 26000, reputation: 68,
    competitionId: COMP_VPL, regionId: 'region_riverlands',
    colors: { primary: '#4e342e', secondary: '#a5d6a7' },
    managerName: 'Clem Turst', managerNationality: 'Trebonian', managerAge: 49, managerFormation: '5-3-2',
    qualityBase: 60, qualitySpread: 11,
    balance: 28_000_000, transferBudget: 9_000_000, wageBudget: 720_000,
    identity: { tacticalPhilosophy: 'Pragmatic Defence', squadBuildingPhilosophy: 'Bargain Hunting', youthFocus: 60, transferAggressiveness: 40, financialStrength: 48 },
  },
  {
    id: 'club_greyvast', name: 'Greyvast Town', shortName: 'GVT', city: 'Greyvast',
    stadium: 'Stonegate Park', capacity: 28000, reputation: 65,
    competitionId: COMP_VPL, regionId: 'region_western_marches',
    colors: { primary: '#424242', secondary: '#9e9e9e' },
    managerName: 'Patrik Hren', managerNationality: 'Mirovan', managerAge: 50, managerFormation: '4-5-1',
    qualityBase: 58, qualitySpread: 11,
    balance: 24_000_000, transferBudget: 7_500_000, wageBudget: 620_000,
    identity: { tacticalPhilosophy: 'Compact Defending', squadBuildingPhilosophy: 'Bargain Hunting', youthFocus: 60, transferAggressiveness: 40, financialStrength: 45 },
  },
  {
    id: 'club_ostford', name: 'Ostford FC', shortName: 'OFC', city: 'Ostford',
    stadium: 'Ostfield Stadium', capacity: 22000, reputation: 62,
    competitionId: COMP_VPL, regionId: 'region_central_plains',
    colors: { primary: '#0d47a1', secondary: '#ffffff' },
    managerName: 'Damo Veth', managerNationality: 'Valmorian', managerAge: 41, managerFormation: '4-4-2',
    qualityBase: 54, qualitySpread: 11,
    balance: 20_000_000, transferBudget: 6_000_000, wageBudget: 580_000,
    identity: { tacticalPhilosophy: 'Direct Play', squadBuildingPhilosophy: 'Youth Development', youthFocus: 65, transferAggressiveness: 45, financialStrength: 40 },
  },
  {
    id: 'club_dunmore', name: 'Dunmore City', shortName: 'DMC', city: 'Dunmore',
    stadium: 'Dunfield Bowl', capacity: 24000, reputation: 62,
    competitionId: COMP_VPL, regionId: 'region_northern_coast',
    colors: { primary: '#4a148c', secondary: '#ce93d8' },
    managerName: 'Carlo Menta', managerNationality: 'Trebonian', managerAge: 42, managerFormation: '4-4-2',
    qualityBase: 53, qualitySpread: 12,
    balance: 18_000_000, transferBudget: 5_000_000, wageBudget: 520_000,
    identity: { tacticalPhilosophy: 'Attacking Football', squadBuildingPhilosophy: 'Local Talent Focus', youthFocus: 70, transferAggressiveness: 35, financialStrength: 38 },
  },
  {
    id: 'club_havengate', name: 'Havengate Athletic', shortName: 'HGA', city: 'Havengate',
    stadium: 'Bay Stadium', capacity: 20000, reputation: 59,
    competitionId: COMP_VPL, regionId: 'region_southern_coast',
    colors: { primary: '#00695c', secondary: '#ffffff' },
    managerName: 'Berto Solano', managerNationality: 'Calderian', managerAge: 37, managerFormation: '4-3-3',
    qualityBase: 51, qualitySpread: 12,
    balance: 16_000_000, transferBudget: 4_500_000, wageBudget: 480_000,
    identity: { tacticalPhilosophy: 'Attacking Football', squadBuildingPhilosophy: 'Local Talent Focus', youthFocus: 70, transferAggressiveness: 40, financialStrength: 35 },
  },
  {
    id: 'club_fastbridge', name: 'Fastbridge FC', shortName: 'FBF', city: 'Fastbridge',
    stadium: 'Bridge Road Ground', capacity: 20000, reputation: 57,
    competitionId: COMP_VPL, regionId: 'region_riverlands',
    colors: { primary: '#bf360c', secondary: '#ffccbc' },
    managerName: 'Tom Wirren', managerNationality: 'Fastovian', managerAge: 38, managerFormation: '5-3-2',
    qualityBase: 48, qualitySpread: 12,
    balance: 12_000_000, transferBudget: 3_000_000, wageBudget: 420_000,
    identity: { tacticalPhilosophy: 'Defensive Block', squadBuildingPhilosophy: 'Survival First', youthFocus: 50, transferAggressiveness: 30, financialStrength: 30 },
  },
  {
    id: 'club_strandvik', name: 'Strandvik FC', shortName: 'SVK', city: 'Strandvik',
    stadium: 'Strand Oval', capacity: 18000, reputation: 56,
    competitionId: COMP_VPL, regionId: 'region_northern_coast',
    colors: { primary: '#37474f', secondary: '#80cbc4' },
    managerName: 'Erik Dahl', managerNationality: 'Nordovian', managerAge: 50, managerFormation: '4-5-1',
    qualityBase: 48, qualitySpread: 12,
    balance: 13_000_000, transferBudget: 3_500_000, wageBudget: 430_000,
    identity: { tacticalPhilosophy: 'Defensive Block', squadBuildingPhilosophy: 'Survival First', youthFocus: 50, transferAggressiveness: 35, financialStrength: 30 },
  },
  {
    id: 'club_grenzburg', name: 'Grenzburg Athletic', shortName: 'GBA', city: 'Grenzburg',
    stadium: 'Grenz Oval', capacity: 18000, reputation: 56,
    competitionId: COMP_VPL, regionId: 'region_eastern_highlands',
    colors: { primary: '#006064', secondary: '#80deea' },
    managerName: 'Herr Bock', managerNationality: 'Grenzian', managerAge: 59, managerFormation: '4-4-2',
    qualityBase: 47, qualitySpread: 12,
    balance: 10_000_000, transferBudget: 2_500_000, wageBudget: 380_000,
    identity: { tacticalPhilosophy: 'Long Ball', squadBuildingPhilosophy: 'Free Transfers Only', youthFocus: 45, transferAggressiveness: 25, financialStrength: 28 },
  },
  {
    id: 'club_elmhaven', name: 'Elmhaven Town', shortName: 'EHT', city: 'Elmhaven',
    stadium: 'Haven Park', capacity: 16500, reputation: 55,
    competitionId: COMP_VPL, regionId: 'region_lake_district',
    colors: { primary: '#2e7d32', secondary: '#f9a825' },
    managerName: 'Will Crane', managerNationality: 'Fastovian', managerAge: 45, managerFormation: '4-4-2',
    qualityBase: 46, qualitySpread: 12,
    balance: 11_000_000, transferBudget: 2_800_000, wageBudget: 380_000,
    identity: { tacticalPhilosophy: 'Counter-Attack', squadBuildingPhilosophy: 'Bargain Hunting', youthFocus: 55, transferAggressiveness: 30, financialStrength: 28 },
  },
  {
    id: 'club_astorias', name: 'Astorias SC', shortName: 'ASC', city: 'Astorias',
    stadium: 'Costa Verde Arena', capacity: 16000, reputation: 55,
    competitionId: COMP_VPL, regionId: 'region_southern_coast',
    colors: { primary: '#33691e', secondary: '#ccff90' },
    managerName: 'Emilio Varx', managerNationality: 'Astorian', managerAge: 45, managerFormation: '4-3-3',
    qualityBase: 46, qualitySpread: 11,
    balance: 9_000_000, transferBudget: 2_000_000, wageBudget: 340_000,
    identity: { tacticalPhilosophy: 'Possession-Based', squadBuildingPhilosophy: 'Academy-First', youthFocus: 80, transferAggressiveness: 20, financialStrength: 22 },
  },

  // ── Valsoria Championship ────────────────────────────────────────────────────
  {
    id: 'club_moorfield', name: 'Moorfield Town', shortName: 'MFT', city: 'Moorfield',
    stadium: 'Moor End Park', capacity: 22000, reputation: 68,
    competitionId: COMP_VC, regionId: 'region_central_plains',
    colors: { primary: '#5d4037', secondary: '#ffca28' },
    managerName: 'Aiden Rusk', managerNationality: 'Valmorian', managerAge: 48, managerFormation: '4-4-2',
    qualityBase: 57, qualitySpread: 10,
    balance: 28_000_000, transferBudget: 5_000_000, wageBudget: 320_000,
    identity: { tacticalPhilosophy: 'Direct Play', squadBuildingPhilosophy: 'Balanced Approach', youthFocus: 50, transferAggressiveness: 55, financialStrength: 50 },
  },
  {
    id: 'club_caldera', name: 'Caldera FC', shortName: 'CAL', city: 'Caldera',
    stadium: 'Summit Arena', capacity: 19000, reputation: 65,
    competitionId: COMP_VC, regionId: 'region_southern_highlands',
    colors: { primary: '#880e4f', secondary: '#f8bbd0' },
    managerName: 'Riva Serrano', managerNationality: 'Calderian', managerAge: 44, managerFormation: '4-3-3',
    qualityBase: 55, qualitySpread: 10,
    balance: 22_000_000, transferBudget: 4_000_000, wageBudget: 280_000,
    identity: { tacticalPhilosophy: 'Attacking Football', squadBuildingPhilosophy: 'Youth Development', youthFocus: 65, transferAggressiveness: 50, financialStrength: 45 },
  },
  {
    id: 'club_westburn', name: 'Westburn Rangers', shortName: 'WBR', city: 'Westburn',
    stadium: 'Ranger Park', capacity: 17000, reputation: 63,
    competitionId: COMP_VC, regionId: 'region_western_marches',
    colors: { primary: '#1565c0', secondary: '#e53935' },
    managerName: 'Conn Fallon', managerNationality: 'Velmorian', managerAge: 52, managerFormation: '4-4-2',
    qualityBase: 54, qualitySpread: 10,
    balance: 18_000_000, transferBudget: 3_500_000, wageBudget: 250_000,
    identity: { tacticalPhilosophy: 'Counter-Attack', squadBuildingPhilosophy: 'Experience & Stability', youthFocus: 40, transferAggressiveness: 45, financialStrength: 42 },
  },
  {
    id: 'club_halcroft', name: 'Halcroft City', shortName: 'HCC', city: 'Halcroft',
    stadium: 'Halcroft Dome', capacity: 16000, reputation: 61,
    competitionId: COMP_VC, regionId: 'region_northern_coast',
    colors: { primary: '#004d40', secondary: '#e0f2f1' },
    managerName: 'Dag Moen', managerNationality: 'Nordovian', managerAge: 47, managerFormation: '3-5-2',
    qualityBase: 52, qualitySpread: 11,
    balance: 15_000_000, transferBudget: 3_000_000, wageBudget: 220_000,
    identity: { tacticalPhilosophy: 'Compact Defending', squadBuildingPhilosophy: 'Bargain Hunting', youthFocus: 55, transferAggressiveness: 40, financialStrength: 40 },
  },
  {
    id: 'club_aldenmoor', name: 'Aldenmoor Athletic', shortName: 'ADA', city: 'Aldenmoor',
    stadium: 'The Alden Ground', capacity: 15000, reputation: 60,
    competitionId: COMP_VC, regionId: 'region_central_plains',
    colors: { primary: '#e65100', secondary: '#fff9c4' },
    managerName: 'Pav Korin', managerNationality: 'Stravian', managerAge: 39, managerFormation: '4-2-3-1',
    qualityBase: 52, qualitySpread: 11,
    balance: 14_000_000, transferBudget: 2_800_000, wageBudget: 210_000,
    identity: { tacticalPhilosophy: 'High Pressing', squadBuildingPhilosophy: 'Balanced Approach', youthFocus: 60, transferAggressiveness: 50, financialStrength: 38 },
  },
  {
    id: 'club_duskport', name: 'Duskport FC', shortName: 'DPF', city: 'Duskport',
    stadium: 'Dusk Bay Arena', capacity: 14000, reputation: 58,
    competitionId: COMP_VC, regionId: 'region_southern_coast',
    colors: { primary: '#4527a0', secondary: '#ede7f6' },
    managerName: 'Marco Pelli', managerNationality: 'Trebonian', managerAge: 43, managerFormation: '4-4-2',
    qualityBase: 50, qualitySpread: 11,
    balance: 12_000_000, transferBudget: 2_200_000, wageBudget: 190_000,
    identity: { tacticalPhilosophy: 'Possession Football', squadBuildingPhilosophy: 'Local Talent Focus', youthFocus: 65, transferAggressiveness: 35, financialStrength: 35 },
  },
  {
    id: 'club_tarvik', name: 'Tarvik United', shortName: 'TAR', city: 'Tarvik',
    stadium: 'Tarvik Vale', capacity: 13000, reputation: 57,
    competitionId: COMP_VC, regionId: 'region_eastern_highlands',
    colors: { primary: '#558b2f', secondary: '#f9fbe7' },
    managerName: 'Olav Skar', managerNationality: 'Nordovian', managerAge: 54, managerFormation: '4-5-1',
    qualityBase: 50, qualitySpread: 12,
    balance: 10_000_000, transferBudget: 1_800_000, wageBudget: 170_000,
    identity: { tacticalPhilosophy: 'Pragmatic Defence', squadBuildingPhilosophy: 'Bargain Hunting', youthFocus: 55, transferAggressiveness: 30, financialStrength: 33 },
  },
  {
    id: 'club_brynholm', name: 'Brynholm City', shortName: 'BHC', city: 'Brynholm',
    stadium: 'Bryn End Stadium', capacity: 12000, reputation: 55,
    competitionId: COMP_VC, regionId: 'region_lake_district',
    colors: { primary: '#006064', secondary: '#e0f7fa' },
    managerName: 'Fran Dosta', managerNationality: 'Brackian', managerAge: 40, managerFormation: '4-4-2',
    qualityBase: 48, qualitySpread: 12,
    balance: 8_000_000, transferBudget: 1_400_000, wageBudget: 150_000,
    identity: { tacticalPhilosophy: 'Counter-Attack', squadBuildingPhilosophy: 'Youth Development', youthFocus: 70, transferAggressiveness: 35, financialStrength: 30 },
  },
  {
    id: 'club_kelsworth', name: 'Kelsworth FC', shortName: 'KEL', city: 'Kelsworth',
    stadium: 'Kelsworth Park', capacity: 11500, reputation: 53,
    competitionId: COMP_VC, regionId: 'region_ironlands',
    colors: { primary: '#bf360c', secondary: '#fbe9e7' },
    managerName: 'Bern Holler', managerNationality: 'Grenzian', managerAge: 46, managerFormation: '4-4-2',
    qualityBase: 47, qualitySpread: 12,
    balance: 7_000_000, transferBudget: 1_100_000, wageBudget: 135_000,
    identity: { tacticalPhilosophy: 'Direct Play', squadBuildingPhilosophy: 'Bargain Hunting', youthFocus: 45, transferAggressiveness: 30, financialStrength: 28 },
  },
  {
    id: 'club_penrose', name: 'Penrose Athletic', shortName: 'PNA', city: 'Penrose',
    stadium: 'Penrose End', capacity: 11000, reputation: 52,
    competitionId: COMP_VC, regionId: 'region_riverlands',
    colors: { primary: '#1a237e', secondary: '#c5cae9' },
    managerName: 'Stu Croft', managerNationality: 'Valmorian', managerAge: 35, managerFormation: '4-3-3',
    qualityBase: 46, qualitySpread: 12,
    balance: 6_500_000, transferBudget: 1_000_000, wageBudget: 125_000,
    identity: { tacticalPhilosophy: 'Attacking Football', squadBuildingPhilosophy: 'Youth Development', youthFocus: 68, transferAggressiveness: 38, financialStrength: 26 },
  },
  {
    id: 'club_silverton', name: 'Silverton FC', shortName: 'SIL', city: 'Silverton',
    stadium: 'Silver Dome', capacity: 10500, reputation: 51,
    competitionId: COMP_VC, regionId: 'region_capital_district',
    colors: { primary: '#9e9e9e', secondary: '#ffffff' },
    managerName: 'Pat Valli', managerNationality: 'Velmorian', managerAge: 42, managerFormation: '4-4-2',
    qualityBase: 45, qualitySpread: 12,
    balance: 6_000_000, transferBudget: 900_000, wageBudget: 115_000,
    identity: { tacticalPhilosophy: 'Compact Defending', squadBuildingPhilosophy: 'Experience & Stability', youthFocus: 42, transferAggressiveness: 35, financialStrength: 25 },
  },
  {
    id: 'club_ravenmere', name: 'Ravenmere FC', shortName: 'RVM', city: 'Ravenmere',
    stadium: 'Ravens Nest', capacity: 10000, reputation: 50,
    competitionId: COMP_VC, regionId: 'region_eastern_highlands',
    colors: { primary: '#212121', secondary: '#9c27b0' },
    managerName: 'Glen Marsh', managerNationality: 'Stravian', managerAge: 49, managerFormation: '5-4-1',
    qualityBase: 45, qualitySpread: 12,
    balance: 5_500_000, transferBudget: 800_000, wageBudget: 110_000,
    identity: { tacticalPhilosophy: 'Defensive Block', squadBuildingPhilosophy: 'Bargain Hunting', youthFocus: 50, transferAggressiveness: 28, financialStrength: 24 },
  },
  {
    id: 'club_holwick', name: 'Holwick Town', shortName: 'HOL', city: 'Holwick',
    stadium: 'Holwick Ground', capacity: 9500, reputation: 49,
    competitionId: COMP_VC, regionId: 'region_western_marches',
    colors: { primary: '#33691e', secondary: '#dcedc8' },
    managerName: 'Mal Donn', managerNationality: 'Olverian', managerAge: 56, managerFormation: '4-4-2',
    qualityBase: 44, qualitySpread: 12,
    balance: 4_800_000, transferBudget: 700_000, wageBudget: 100_000,
    identity: { tacticalPhilosophy: 'Long Ball', squadBuildingPhilosophy: 'Bargain Hunting', youthFocus: 48, transferAggressiveness: 25, financialStrength: 22 },
  },
  {
    id: 'club_sundale', name: 'Sundale FC', shortName: 'SND', city: 'Sundale',
    stadium: 'Sundale Park', capacity: 9000, reputation: 47,
    competitionId: COMP_VC, regionId: 'region_southern_coast',
    colors: { primary: '#f57f17', secondary: '#0d47a1' },
    managerName: 'Aldo Farren', managerNationality: 'Sundevian', managerAge: 38, managerFormation: '4-3-3',
    qualityBase: 43, qualitySpread: 13,
    balance: 4_000_000, transferBudget: 600_000, wageBudget: 90_000,
    identity: { tacticalPhilosophy: 'Attacking Football', squadBuildingPhilosophy: 'Local Talent Focus', youthFocus: 70, transferAggressiveness: 30, financialStrength: 20 },
  },
  {
    id: 'club_glenvore', name: 'Glenvore Rangers', shortName: 'GVR', city: 'Glenvore',
    stadium: 'Glen End Park', capacity: 8500, reputation: 46,
    competitionId: COMP_VC, regionId: 'region_lake_district',
    colors: { primary: '#3e2723', secondary: '#bcaaa4' },
    managerName: 'Ryle Dorne', managerNationality: 'Doranian', managerAge: 44, managerFormation: '4-4-2',
    qualityBase: 42, qualitySpread: 13,
    balance: 3_500_000, transferBudget: 500_000, wageBudget: 80_000,
    identity: { tacticalPhilosophy: 'Pragmatic Defence', squadBuildingPhilosophy: 'Bargain Hunting', youthFocus: 60, transferAggressiveness: 22, financialStrength: 18 },
  },
  {
    id: 'club_kelverton', name: 'Kelverton City', shortName: 'KVC', city: 'Kelverton',
    stadium: 'The Kelvert', capacity: 8000, reputation: 44,
    competitionId: COMP_VC, regionId: 'region_ironlands',
    colors: { primary: '#006064', secondary: '#b2ebf2' },
    managerName: 'Wil Breck', managerNationality: 'Valmorian', managerAge: 51, managerFormation: '4-5-1',
    qualityBase: 40, qualitySpread: 13,
    balance: 3_000_000, transferBudget: 420_000, wageBudget: 70_000,
    identity: { tacticalPhilosophy: 'Compact Defending', squadBuildingPhilosophy: 'Free Transfers Only', youthFocus: 48, transferAggressiveness: 18, financialStrength: 16 },
  },
  {
    id: 'club_dawnbridge', name: 'Dawnbridge FC', shortName: 'DWB', city: 'Dawnbridge',
    stadium: 'Dawn End', capacity: 7500, reputation: 42,
    competitionId: COMP_VC, regionId: 'region_riverlands',
    colors: { primary: '#880e4f', secondary: '#fce4ec' },
    managerName: 'Tess Morrin', managerNationality: 'Velmorian', managerAge: 36, managerFormation: '4-4-2',
    qualityBase: 39, qualitySpread: 13,
    balance: 2_500_000, transferBudget: 350_000, wageBudget: 60_000,
    identity: { tacticalPhilosophy: 'Direct Play', squadBuildingPhilosophy: 'Youth Development', youthFocus: 65, transferAggressiveness: 22, financialStrength: 14 },
  },
  {
    id: 'club_crestmoor', name: 'Crestmoor United', shortName: 'CRU', city: 'Crestmoor',
    stadium: 'Crest Park', capacity: 7000, reputation: 40,
    competitionId: COMP_VC, regionId: 'region_northern_coast',
    colors: { primary: '#37474f', secondary: '#cfd8dc' },
    managerName: 'Owen Fall', managerNationality: 'Brackian', managerAge: 53, managerFormation: '5-3-2',
    qualityBase: 37, qualitySpread: 13,
    balance: 2_000_000, transferBudget: 280_000, wageBudget: 50_000,
    identity: { tacticalPhilosophy: 'Defensive Block', squadBuildingPhilosophy: 'Survival First', youthFocus: 45, transferAggressiveness: 18, financialStrength: 12 },
  },

  // ── Valsoria National League ─────────────────────────────────────────────────
  {
    id: 'club_ashvale', name: 'Ashvale FC', shortName: 'AVF', city: 'Ashvale',
    stadium: 'Ashvale Rec', capacity: 8500, reputation: 52,
    competitionId: COMP_VNL, regionId: 'region_southern_highlands',
    colors: { primary: '#37474f', secondary: '#ff8f00' },
    managerName: 'Kel Horan', managerNationality: 'Astorian', managerAge: 44, managerFormation: '4-4-2',
    qualityBase: 34, qualitySpread: 11,
    balance: 1_800_000, transferBudget: 300_000, wageBudget: 40_000,
    identity: { tacticalPhilosophy: 'Counter-Attack', squadBuildingPhilosophy: 'Bargain Hunting', youthFocus: 55, transferAggressiveness: 30, financialStrength: 22 },
  },
  {
    id: 'club_helmcroft', name: 'Helmcroft Town', shortName: 'HLT', city: 'Helmcroft',
    stadium: 'Helm Ground', capacity: 7500, reputation: 50,
    competitionId: COMP_VNL, regionId: 'region_western_marches',
    colors: { primary: '#1b5e20', secondary: '#a5d6a7' },
    managerName: 'Brett Wilder', managerNationality: 'Olverian', managerAge: 40, managerFormation: '4-4-2',
    qualityBase: 33, qualitySpread: 11,
    balance: 1_500_000, transferBudget: 250_000, wageBudget: 35_000,
    identity: { tacticalPhilosophy: 'Direct Play', squadBuildingPhilosophy: 'Youth Development', youthFocus: 65, transferAggressiveness: 25, financialStrength: 20 },
  },
  {
    id: 'club_irongate', name: 'Irongate FC', shortName: 'IRG', city: 'Irongate',
    stadium: 'Irongate Park', capacity: 7000, reputation: 48,
    competitionId: COMP_VNL, regionId: 'region_ironlands',
    colors: { primary: '#b71c1c', secondary: '#212121' },
    managerName: 'Frank Dull', managerNationality: 'Grenzian', managerAge: 58, managerFormation: '4-4-2',
    qualityBase: 32, qualitySpread: 11,
    balance: 1_200_000, transferBudget: 200_000, wageBudget: 30_000,
    identity: { tacticalPhilosophy: 'Long Ball', squadBuildingPhilosophy: 'Free Transfers Only', youthFocus: 42, transferAggressiveness: 20, financialStrength: 18 },
  },
  {
    id: 'club_bluewater', name: 'Bluewater FC', shortName: 'BWF', city: 'Bluewater',
    stadium: 'Bluewater Bay', capacity: 6500, reputation: 47,
    competitionId: COMP_VNL, regionId: 'region_southern_coast',
    colors: { primary: '#0288d1', secondary: '#b3e5fc' },
    managerName: 'Liam Cordes', managerNationality: 'Calderian', managerAge: 36, managerFormation: '4-3-3',
    qualityBase: 31, qualitySpread: 11,
    balance: 1_100_000, transferBudget: 180_000, wageBudget: 28_000,
    identity: { tacticalPhilosophy: 'Attacking Football', squadBuildingPhilosophy: 'Youth Development', youthFocus: 68, transferAggressiveness: 28, financialStrength: 16 },
  },
  {
    id: 'club_harfield', name: 'Harfield United', shortName: 'HAR', city: 'Harfield',
    stadium: 'Harfield End', capacity: 6000, reputation: 45,
    competitionId: COMP_VNL, regionId: 'region_central_plains',
    colors: { primary: '#0d47a1', secondary: '#ffeb3b' },
    managerName: 'Noel Banks', managerNationality: 'Valmorian', managerAge: 47, managerFormation: '4-4-2',
    qualityBase: 30, qualitySpread: 12,
    balance: 900_000, transferBudget: 150_000, wageBudget: 24_000,
    identity: { tacticalPhilosophy: 'Pragmatic Defence', squadBuildingPhilosophy: 'Bargain Hunting', youthFocus: 50, transferAggressiveness: 22, financialStrength: 14 },
  },
  {
    id: 'club_norwick', name: 'Norwick FC', shortName: 'NWF', city: 'Norwick',
    stadium: 'Norwick Arena', capacity: 5500, reputation: 44,
    competitionId: COMP_VNL, regionId: 'region_northern_coast',
    colors: { primary: '#f9a825', secondary: '#004d40' },
    managerName: 'Hans Borg', managerNationality: 'Nordovian', managerAge: 50, managerFormation: '4-5-1',
    qualityBase: 30, qualitySpread: 12,
    balance: 800_000, transferBudget: 130_000, wageBudget: 22_000,
    identity: { tacticalPhilosophy: 'Counter-Attack', squadBuildingPhilosophy: 'Local Talent Focus', youthFocus: 62, transferAggressiveness: 20, financialStrength: 13 },
  },
  {
    id: 'club_tildenmere', name: 'Tildenmere Town', shortName: 'TLT', city: 'Tildenmere',
    stadium: 'Tilde Park', capacity: 5000, reputation: 42,
    competitionId: COMP_VNL, regionId: 'region_lake_district',
    colors: { primary: '#5d4037', secondary: '#efebe9' },
    managerName: 'Jay Holt', managerNationality: 'Mirovan', managerAge: 41, managerFormation: '4-4-2',
    qualityBase: 29, qualitySpread: 12,
    balance: 700_000, transferBudget: 110_000, wageBudget: 20_000,
    identity: { tacticalPhilosophy: 'Compact Defending', squadBuildingPhilosophy: 'Bargain Hunting', youthFocus: 55, transferAggressiveness: 18, financialStrength: 12 },
  },
  {
    id: 'club_castlemoor', name: 'Castlemoor FC', shortName: 'CSM', city: 'Castlemoor',
    stadium: 'Castle Ground', capacity: 4800, reputation: 40,
    competitionId: COMP_VNL, regionId: 'region_eastern_highlands',
    colors: { primary: '#4a148c', secondary: '#e1bee7' },
    managerName: 'Dave Kell', managerNationality: 'Stravian', managerAge: 45, managerFormation: '4-4-2',
    qualityBase: 28, qualitySpread: 12,
    balance: 600_000, transferBudget: 90_000, wageBudget: 18_000,
    identity: { tacticalPhilosophy: 'Direct Play', squadBuildingPhilosophy: 'Free Transfers Only', youthFocus: 45, transferAggressiveness: 15, financialStrength: 11 },
  },
  {
    id: 'club_portsdown', name: 'Portsdown FC', shortName: 'PDN', city: 'Portsdown',
    stadium: 'Port End', capacity: 4500, reputation: 39,
    competitionId: COMP_VNL, regionId: 'region_southern_coast',
    colors: { primary: '#006064', secondary: '#cfd8dc' },
    managerName: 'Roy Sterne', managerNationality: 'Sundevian', managerAge: 53, managerFormation: '5-4-1',
    qualityBase: 27, qualitySpread: 12,
    balance: 550_000, transferBudget: 80_000, wageBudget: 16_000,
    identity: { tacticalPhilosophy: 'Defensive Block', squadBuildingPhilosophy: 'Survival First', youthFocus: 40, transferAggressiveness: 12, financialStrength: 10 },
  },
  {
    id: 'club_fernside', name: 'Fernside FC', shortName: 'FNS', city: 'Fernside',
    stadium: 'Fern Park', capacity: 4200, reputation: 38,
    competitionId: COMP_VNL, regionId: 'region_riverlands',
    colors: { primary: '#2e7d32', secondary: '#dcedc8' },
    managerName: 'Clive Nash', managerNationality: 'Olverian', managerAge: 46, managerFormation: '4-4-2',
    qualityBase: 27, qualitySpread: 12,
    balance: 480_000, transferBudget: 70_000, wageBudget: 14_000,
    identity: { tacticalPhilosophy: 'Compact Defending', squadBuildingPhilosophy: 'Bargain Hunting', youthFocus: 58, transferAggressiveness: 18, financialStrength: 9 },
  },
  {
    id: 'club_brackhill', name: 'Brackhill United', shortName: 'BKH', city: 'Brackhill',
    stadium: 'Brackhall Ground', capacity: 4000, reputation: 36,
    competitionId: COMP_VNL, regionId: 'region_riverlands',
    colors: { primary: '#e65100', secondary: '#fff3e0' },
    managerName: 'Al Prent', managerNationality: 'Trebonian', managerAge: 39, managerFormation: '4-4-2',
    qualityBase: 26, qualitySpread: 12,
    balance: 420_000, transferBudget: 60_000, wageBudget: 12_000,
    identity: { tacticalPhilosophy: 'Direct Play', squadBuildingPhilosophy: 'Youth Development', youthFocus: 62, transferAggressiveness: 20, financialStrength: 9 },
  },
  {
    id: 'club_coldwater', name: 'Coldwater Town', shortName: 'CWT', city: 'Coldwater',
    stadium: 'Cold End', capacity: 3800, reputation: 35,
    competitionId: COMP_VNL, regionId: 'region_northern_coast',
    colors: { primary: '#b0bec5', secondary: '#1a237e' },
    managerName: 'Ed Frost', managerNationality: 'Nordovian', managerAge: 43, managerFormation: '4-5-1',
    qualityBase: 25, qualitySpread: 12,
    balance: 380_000, transferBudget: 55_000, wageBudget: 11_000,
    identity: { tacticalPhilosophy: 'Long Ball', squadBuildingPhilosophy: 'Free Transfers Only', youthFocus: 45, transferAggressiveness: 15, financialStrength: 8 },
  },
  {
    id: 'club_veldmoor', name: 'Veldmoor FC', shortName: 'VLM', city: 'Veldmoor',
    stadium: 'Veld Park', capacity: 3500, reputation: 34,
    competitionId: COMP_VNL, regionId: 'region_central_plains',
    colors: { primary: '#4caf50', secondary: '#1b5e20' },
    managerName: 'Ivan Greet', managerNationality: 'Mirovan', managerAge: 37, managerFormation: '4-4-2',
    qualityBase: 25, qualitySpread: 13,
    balance: 340_000, transferBudget: 48_000, wageBudget: 10_000,
    identity: { tacticalPhilosophy: 'Counter-Attack', squadBuildingPhilosophy: 'Bargain Hunting', youthFocus: 52, transferAggressiveness: 18, financialStrength: 8 },
  },
  {
    id: 'club_sunbridge', name: 'Sunbridge City', shortName: 'SBC', city: 'Sunbridge',
    stadium: 'Sunbridge Arena', capacity: 3500, reputation: 33,
    competitionId: COMP_VNL, regionId: 'region_southern_coast',
    colors: { primary: '#fbc02d', secondary: '#212121' },
    managerName: 'Paco Vells', managerNationality: 'Calderian', managerAge: 41, managerFormation: '4-3-3',
    qualityBase: 24, qualitySpread: 13,
    balance: 310_000, transferBudget: 42_000, wageBudget: 9_000,
    identity: { tacticalPhilosophy: 'Attacking Football', squadBuildingPhilosophy: 'Youth Development', youthFocus: 65, transferAggressiveness: 20, financialStrength: 8 },
  },
  {
    id: 'club_haldergate', name: 'Haldergate FC', shortName: 'HDG', city: 'Haldergate',
    stadium: 'Haldergate Ground', capacity: 3200, reputation: 32,
    competitionId: COMP_VNL, regionId: 'region_capital_district',
    colors: { primary: '#9c27b0', secondary: '#e1bee7' },
    managerName: 'Rich Lowe', managerNationality: 'Valmorian', managerAge: 34, managerFormation: '4-4-2',
    qualityBase: 24, qualitySpread: 13,
    balance: 280_000, transferBudget: 38_000, wageBudget: 8_500,
    identity: { tacticalPhilosophy: 'Compact Defending', squadBuildingPhilosophy: 'Local Talent Focus', youthFocus: 60, transferAggressiveness: 15, financialStrength: 7 },
  },
  {
    id: 'club_thorngate', name: 'Thorngate Town', shortName: 'TGT', city: 'Thorngate',
    stadium: 'Thorn End', capacity: 3000, reputation: 31,
    competitionId: COMP_VNL, regionId: 'region_eastern_highlands',
    colors: { primary: '#795548', secondary: '#ffccbc' },
    managerName: 'Sam Durn', managerNationality: 'Brackian', managerAge: 48, managerFormation: '4-4-2',
    qualityBase: 23, qualitySpread: 13,
    balance: 250_000, transferBudget: 34_000, wageBudget: 8_000,
    identity: { tacticalPhilosophy: 'Direct Play', squadBuildingPhilosophy: 'Free Transfers Only', youthFocus: 45, transferAggressiveness: 15, financialStrength: 7 },
  },
  {
    id: 'club_stormhaven', name: 'Stormhaven FC', shortName: 'STH', city: 'Stormhaven',
    stadium: 'Storm Oval', capacity: 2800, reputation: 29,
    competitionId: COMP_VNL, regionId: 'region_northern_coast',
    colors: { primary: '#37474f', secondary: '#eceff1' },
    managerName: 'Karl Nord', managerNationality: 'Nordovian', managerAge: 55, managerFormation: '5-4-1',
    qualityBase: 22, qualitySpread: 13,
    balance: 220_000, transferBudget: 28_000, wageBudget: 7_000,
    identity: { tacticalPhilosophy: 'Defensive Block', squadBuildingPhilosophy: 'Survival First', youthFocus: 40, transferAggressiveness: 12, financialStrength: 6 },
  },
  {
    id: 'club_whitecliff', name: 'Whitecliff Town', shortName: 'WCT', city: 'Whitecliff',
    stadium: 'Cliff Top Park', capacity: 2600, reputation: 28,
    competitionId: COMP_VNL, regionId: 'region_western_marches',
    colors: { primary: '#ffffff', secondary: '#0d47a1' },
    managerName: 'Dan Crow', managerNationality: 'Olverian', managerAge: 44, managerFormation: '4-4-2',
    qualityBase: 22, qualitySpread: 13,
    balance: 200_000, transferBudget: 25_000, wageBudget: 6_500,
    identity: { tacticalPhilosophy: 'Pragmatic Defence', squadBuildingPhilosophy: 'Free Transfers Only', youthFocus: 48, transferAggressiveness: 12, financialStrength: 6 },
  },
  {
    id: 'club_dalworth', name: 'Dalworth FC', shortName: 'DLW', city: 'Dalworth',
    stadium: 'Dalworth End', capacity: 2400, reputation: 27,
    competitionId: COMP_VNL, regionId: 'region_ironlands',
    colors: { primary: '#455a64', secondary: '#ff6f00' },
    managerName: 'Pete Marsh', managerNationality: 'Grenzian', managerAge: 51, managerFormation: '4-4-2',
    qualityBase: 21, qualitySpread: 13,
    balance: 180_000, transferBudget: 22_000, wageBudget: 6_000,
    identity: { tacticalPhilosophy: 'Long Ball', squadBuildingPhilosophy: 'Free Transfers Only', youthFocus: 40, transferAggressiveness: 12, financialStrength: 6 },
  },
  {
    id: 'club_morwick', name: 'Morwick Town', shortName: 'MWT', city: 'Morwick',
    stadium: 'Morwick Ground', capacity: 2200, reputation: 25,
    competitionId: COMP_VNL, regionId: 'region_southern_highlands',
    colors: { primary: '#1a237e', secondary: '#e8eaf6' },
    managerName: 'Les Grout', managerNationality: 'Doranian', managerAge: 49, managerFormation: '4-5-1',
    qualityBase: 20, qualitySpread: 13,
    balance: 150_000, transferBudget: 18_000, wageBudget: 5_500,
    identity: { tacticalPhilosophy: 'Compact Defending', squadBuildingPhilosophy: 'Free Transfers Only', youthFocus: 42, transferAggressiveness: 10, financialStrength: 5 },
  },

  // ── Valsoria Regional League ─────────────────────────────────────────────────
  {
    id: 'club_dunwick', name: 'Dunwick FC', shortName: 'DWK', city: 'Dunwick',
    stadium: 'Dunwick Park', capacity: 3500, reputation: 38,
    competitionId: COMP_VRL, regionId: 'region_northern_coast',
    colors: { primary: '#880e4f', secondary: '#fce4ec' },
    managerName: 'Rob Sill', managerNationality: 'Valmorian', managerAge: 38, managerFormation: '4-4-2',
    qualityBase: 20, qualitySpread: 11,
    balance: 280_000, transferBudget: 40_000, wageBudget: 6_000,
    identity: { tacticalPhilosophy: 'Direct Play', squadBuildingPhilosophy: 'Youth Development', youthFocus: 60, transferAggressiveness: 22, financialStrength: 8 },
  },
  {
    id: 'club_hartfield', name: 'Hartfield Town', shortName: 'HTF', city: 'Hartfield',
    stadium: 'Hart End', capacity: 3200, reputation: 36,
    competitionId: COMP_VRL, regionId: 'region_central_plains',
    colors: { primary: '#1b5e20', secondary: '#ffffff' },
    managerName: 'Alan Spry', managerNationality: 'Olverian', managerAge: 42, managerFormation: '4-4-2',
    qualityBase: 19, qualitySpread: 11,
    balance: 240_000, transferBudget: 35_000, wageBudget: 5_500,
    identity: { tacticalPhilosophy: 'Pragmatic Defence', squadBuildingPhilosophy: 'Local Talent Focus', youthFocus: 65, transferAggressiveness: 18, financialStrength: 8 },
  },
  {
    id: 'club_sterngate', name: 'Sterngate FC', shortName: 'STG', city: 'Sterngate',
    stadium: 'Stern Park', capacity: 3000, reputation: 35,
    competitionId: COMP_VRL, regionId: 'region_capital_district',
    colors: { primary: '#0d47a1', secondary: '#b3e5fc' },
    managerName: 'Barry Colt', managerNationality: 'Velmorian', managerAge: 45, managerFormation: '4-4-2',
    qualityBase: 19, qualitySpread: 11,
    balance: 220_000, transferBudget: 32_000, wageBudget: 5_200,
    identity: { tacticalPhilosophy: 'Counter-Attack', squadBuildingPhilosophy: 'Bargain Hunting', youthFocus: 55, transferAggressiveness: 18, financialStrength: 7 },
  },
  {
    id: 'club_millport', name: 'Millport United', shortName: 'MLP', city: 'Millport',
    stadium: 'Mill End', capacity: 2800, reputation: 34,
    competitionId: COMP_VRL, regionId: 'region_southern_coast',
    colors: { primary: '#bf360c', secondary: '#fbe9e7' },
    managerName: 'Vic Ames', managerNationality: 'Calderian', managerAge: 39, managerFormation: '4-4-2',
    qualityBase: 18, qualitySpread: 11,
    balance: 200_000, transferBudget: 28_000, wageBudget: 5_000,
    identity: { tacticalPhilosophy: 'Compact Defending', squadBuildingPhilosophy: 'Local Talent Focus', youthFocus: 60, transferAggressiveness: 15, financialStrength: 7 },
  },
  {
    id: 'club_coldmere', name: 'Coldmere Town', shortName: 'CLM', city: 'Coldmere',
    stadium: 'Cold End Ground', capacity: 2500, reputation: 32,
    competitionId: COMP_VRL, regionId: 'region_eastern_highlands',
    colors: { primary: '#455a64', secondary: '#cfd8dc' },
    managerName: 'Roy Hassel', managerNationality: 'Grenzian', managerAge: 52, managerFormation: '4-5-1',
    qualityBase: 17, qualitySpread: 11,
    balance: 175_000, transferBudget: 24_000, wageBudget: 4_500,
    identity: { tacticalPhilosophy: 'Defensive Block', squadBuildingPhilosophy: 'Free Transfers Only', youthFocus: 42, transferAggressiveness: 12, financialStrength: 6 },
  },
  {
    id: 'club_ashgate', name: 'Ashgate Town', shortName: 'AGT', city: 'Ashgate',
    stadium: 'Ash Park', capacity: 2400, reputation: 31,
    competitionId: COMP_VRL, regionId: 'region_southern_highlands',
    colors: { primary: '#33691e', secondary: '#f1f8e9' },
    managerName: 'Kevin Lamb', managerNationality: 'Astorian', managerAge: 44, managerFormation: '4-4-2',
    qualityBase: 17, qualitySpread: 12,
    balance: 160_000, transferBudget: 22_000, wageBudget: 4_200,
    identity: { tacticalPhilosophy: 'Long Ball', squadBuildingPhilosophy: 'Free Transfers Only', youthFocus: 48, transferAggressiveness: 12, financialStrength: 6 },
  },
  {
    id: 'club_elmswick', name: 'Elmswick FC', shortName: 'ELW', city: 'Elmswick',
    stadium: 'Elm Ground', capacity: 2200, reputation: 30,
    competitionId: COMP_VRL, regionId: 'region_western_marches',
    colors: { primary: '#4e342e', secondary: '#d7ccc8' },
    managerName: 'Neil Brace', managerNationality: 'Mirovan', managerAge: 47, managerFormation: '4-4-2',
    qualityBase: 17, qualitySpread: 12,
    balance: 145_000, transferBudget: 20_000, wageBudget: 4_000,
    identity: { tacticalPhilosophy: 'Counter-Attack', squadBuildingPhilosophy: 'Youth Development', youthFocus: 58, transferAggressiveness: 15, financialStrength: 6 },
  },
  {
    id: 'club_rockfield', name: 'Rockfield FC', shortName: 'RKF', city: 'Rockfield',
    stadium: 'Rock End', capacity: 2000, reputation: 29,
    competitionId: COMP_VRL, regionId: 'region_ironlands',
    colors: { primary: '#212121', secondary: '#e53935' },
    managerName: 'Joe Stoner', managerNationality: 'Valmorian', managerAge: 36, managerFormation: '4-4-2',
    qualityBase: 16, qualitySpread: 12,
    balance: 130_000, transferBudget: 18_000, wageBudget: 3_800,
    identity: { tacticalPhilosophy: 'Direct Play', squadBuildingPhilosophy: 'Free Transfers Only', youthFocus: 45, transferAggressiveness: 12, financialStrength: 5 },
  },
  {
    id: 'club_thistledown', name: 'Thistledown Town', shortName: 'TDT', city: 'Thistledown',
    stadium: 'Thistle Park', capacity: 1900, reputation: 28,
    competitionId: COMP_VRL, regionId: 'region_lake_district',
    colors: { primary: '#7b1fa2', secondary: '#e1bee7' },
    managerName: 'Don Reece', managerNationality: 'Stravian', managerAge: 50, managerFormation: '4-5-1',
    qualityBase: 16, qualitySpread: 12,
    balance: 115_000, transferBudget: 16_000, wageBudget: 3_500,
    identity: { tacticalPhilosophy: 'Compact Defending', squadBuildingPhilosophy: 'Bargain Hunting', youthFocus: 55, transferAggressiveness: 12, financialStrength: 5 },
  },
  {
    id: 'club_holtwick', name: 'Holtwick United', shortName: 'HWU', city: 'Holtwick',
    stadium: 'Holt End', capacity: 1800, reputation: 27,
    competitionId: COMP_VRL, regionId: 'region_riverlands',
    colors: { primary: '#006064', secondary: '#e0f7fa' },
    managerName: 'Simon Velt', managerNationality: 'Brackian', managerAge: 43, managerFormation: '4-4-2',
    qualityBase: 15, qualitySpread: 12,
    balance: 100_000, transferBudget: 14_000, wageBudget: 3_200,
    identity: { tacticalPhilosophy: 'Pragmatic Defence', squadBuildingPhilosophy: 'Free Transfers Only', youthFocus: 48, transferAggressiveness: 10, financialStrength: 5 },
  },
  {
    id: 'club_greenmere', name: 'Greenmere FC', shortName: 'GRM', city: 'Greenmere',
    stadium: 'Green Park', capacity: 1700, reputation: 26,
    competitionId: COMP_VRL, regionId: 'region_central_plains',
    colors: { primary: '#388e3c', secondary: '#c8e6c9' },
    managerName: 'Ian Fell', managerNationality: 'Olverian', managerAge: 40, managerFormation: '4-4-2',
    qualityBase: 15, qualitySpread: 12,
    balance: 90_000, transferBudget: 12_000, wageBudget: 3_000,
    identity: { tacticalPhilosophy: 'Attacking Football', squadBuildingPhilosophy: 'Youth Development', youthFocus: 65, transferAggressiveness: 12, financialStrength: 5 },
  },
  {
    id: 'club_brandwick', name: 'Brandwick Town', shortName: 'BRW', city: 'Brandwick',
    stadium: 'Brand End', capacity: 1600, reputation: 25,
    competitionId: COMP_VRL, regionId: 'region_northern_coast',
    colors: { primary: '#e65100', secondary: '#fff3e0' },
    managerName: 'Tom Wren', managerNationality: 'Nordovian', managerAge: 46, managerFormation: '4-4-2',
    qualityBase: 15, qualitySpread: 12,
    balance: 82_000, transferBudget: 11_000, wageBudget: 2_800,
    identity: { tacticalPhilosophy: 'Long Ball', squadBuildingPhilosophy: 'Free Transfers Only', youthFocus: 42, transferAggressiveness: 10, financialStrength: 4 },
  },
  {
    id: 'club_stonegate', name: 'Stonegate City', shortName: 'SNG', city: 'Stonegate',
    stadium: 'Stone End', capacity: 1500, reputation: 24,
    competitionId: COMP_VRL, regionId: 'region_capital_district',
    colors: { primary: '#9e9e9e', secondary: '#212121' },
    managerName: 'Lee Frost', managerNationality: 'Velmorian', managerAge: 34, managerFormation: '4-4-2',
    qualityBase: 14, qualitySpread: 12,
    balance: 75_000, transferBudget: 10_000, wageBudget: 2_600,
    identity: { tacticalPhilosophy: 'Counter-Attack', squadBuildingPhilosophy: 'Bargain Hunting', youthFocus: 55, transferAggressiveness: 10, financialStrength: 4 },
  },
  {
    id: 'club_fernwick', name: 'Fernwick FC', shortName: 'FWK', city: 'Fernwick',
    stadium: 'Fern End', capacity: 1400, reputation: 23,
    competitionId: COMP_VRL, regionId: 'region_riverlands',
    colors: { primary: '#558b2f', secondary: '#f9fbe7' },
    managerName: 'Bob Hale', managerNationality: 'Mirovan', managerAge: 48, managerFormation: '4-5-1',
    qualityBase: 14, qualitySpread: 12,
    balance: 68_000, transferBudget: 9_000, wageBudget: 2_400,
    identity: { tacticalPhilosophy: 'Direct Play', squadBuildingPhilosophy: 'Free Transfers Only', youthFocus: 45, transferAggressiveness: 10, financialStrength: 4 },
  },
  {
    id: 'club_saltmere', name: 'Saltmere Town', shortName: 'SLM', city: 'Saltmere',
    stadium: 'Salt Park', capacity: 1300, reputation: 22,
    competitionId: COMP_VRL, regionId: 'region_southern_coast',
    colors: { primary: '#0288d1', secondary: '#e1f5fe' },
    managerName: 'Ray Caine', managerNationality: 'Calderian', managerAge: 41, managerFormation: '4-4-2',
    qualityBase: 13, qualitySpread: 12,
    balance: 60_000, transferBudget: 8_000, wageBudget: 2_200,
    identity: { tacticalPhilosophy: 'Compact Defending', squadBuildingPhilosophy: 'Local Talent Focus', youthFocus: 60, transferAggressiveness: 8, financialStrength: 4 },
  },
  {
    id: 'club_denmoor', name: 'Denmoor FC', shortName: 'DNM', city: 'Denmoor',
    stadium: 'Den End', capacity: 1200, reputation: 21,
    competitionId: COMP_VRL, regionId: 'region_eastern_highlands',
    colors: { primary: '#795548', secondary: '#efebe9' },
    managerName: 'Chris Helm', managerNationality: 'Grenzian', managerAge: 55, managerFormation: '4-4-2',
    qualityBase: 13, qualitySpread: 12,
    balance: 52_000, transferBudget: 7_000, wageBudget: 2_000,
    identity: { tacticalPhilosophy: 'Long Ball', squadBuildingPhilosophy: 'Free Transfers Only', youthFocus: 40, transferAggressiveness: 8, financialStrength: 3 },
  },
  {
    id: 'club_coldgate', name: 'Coldgate Town', shortName: 'CGT', city: 'Coldgate',
    stadium: 'Cold Park', capacity: 1100, reputation: 20,
    competitionId: COMP_VRL, regionId: 'region_northern_coast',
    colors: { primary: '#b0bec5', secondary: '#546e7a' },
    managerName: 'Phil Wick', managerNationality: 'Nordovian', managerAge: 49, managerFormation: '4-5-1',
    qualityBase: 13, qualitySpread: 12,
    balance: 45_000, transferBudget: 6_500, wageBudget: 1_800,
    identity: { tacticalPhilosophy: 'Defensive Block', squadBuildingPhilosophy: 'Free Transfers Only', youthFocus: 42, transferAggressiveness: 8, financialStrength: 3 },
  },
  {
    id: 'club_brookwick', name: 'Brookwick United', shortName: 'BWU', city: 'Brookwick',
    stadium: 'Brook Park', capacity: 1000, reputation: 19,
    competitionId: COMP_VRL, regionId: 'region_lake_district',
    colors: { primary: '#4a148c', secondary: '#f3e5f5' },
    managerName: 'Karl Deane', managerNationality: 'Stravian', managerAge: 37, managerFormation: '4-4-2',
    qualityBase: 12, qualitySpread: 12,
    balance: 38_000, transferBudget: 5_500, wageBudget: 1_600,
    identity: { tacticalPhilosophy: 'Counter-Attack', squadBuildingPhilosophy: 'Youth Development', youthFocus: 62, transferAggressiveness: 8, financialStrength: 3 },
  },
  {
    id: 'club_ironside', name: 'Ironside FC', shortName: 'IRS', city: 'Ironside',
    stadium: 'Iron End', capacity: 950, reputation: 18,
    competitionId: COMP_VRL, regionId: 'region_ironlands',
    colors: { primary: '#37474f', secondary: '#ff5722' },
    managerName: 'Pete Oller', managerNationality: 'Valmorian', managerAge: 44, managerFormation: '4-4-2',
    qualityBase: 12, qualitySpread: 12,
    balance: 32_000, transferBudget: 5_000, wageBudget: 1_400,
    identity: { tacticalPhilosophy: 'Direct Play', squadBuildingPhilosophy: 'Free Transfers Only', youthFocus: 42, transferAggressiveness: 8, financialStrength: 3 },
  },
  {
    id: 'club_ashmore', name: 'Ashmore Town', shortName: 'AMT', city: 'Ashmore',
    stadium: 'Ash End', capacity: 900, reputation: 17,
    competitionId: COMP_VRL, regionId: 'region_southern_highlands',
    colors: { primary: '#33691e', secondary: '#dcedc8' },
    managerName: 'Ray Dove', managerNationality: 'Doranian', managerAge: 51, managerFormation: '4-5-1',
    qualityBase: 11, qualitySpread: 11,
    balance: 26_000, transferBudget: 4_000, wageBudget: 1_200,
    identity: { tacticalPhilosophy: 'Compact Defending', squadBuildingPhilosophy: 'Free Transfers Only', youthFocus: 40, transferAggressiveness: 6, financialStrength: 3 },
  },
  {
    id: 'club_holtmere', name: 'Holtmere FC', shortName: 'HLM', city: 'Holtmere',
    stadium: 'Holt Park', capacity: 850, reputation: 16,
    competitionId: COMP_VRL, regionId: 'region_western_marches',
    colors: { primary: '#006064', secondary: '#a7ffeb' },
    managerName: 'Eric Page', managerNationality: 'Olverian', managerAge: 38, managerFormation: '4-4-2',
    qualityBase: 11, qualitySpread: 11,
    balance: 22_000, transferBudget: 3_500, wageBudget: 1_000,
    identity: { tacticalPhilosophy: 'Long Ball', squadBuildingPhilosophy: 'Free Transfers Only', youthFocus: 38, transferAggressiveness: 6, financialStrength: 2 },
  },
  {
    id: 'club_westgate', name: 'Westgate Town', shortName: 'WGT', city: 'Westgate',
    stadium: 'West End', capacity: 800, reputation: 15,
    competitionId: COMP_VRL, regionId: 'region_western_marches',
    colors: { primary: '#880e4f', secondary: '#fce4ec' },
    managerName: 'Cal Brent', managerNationality: 'Mirovan', managerAge: 46, managerFormation: '4-4-2',
    qualityBase: 11, qualitySpread: 11,
    balance: 18_000, transferBudget: 3_000, wageBudget: 900,
    identity: { tacticalPhilosophy: 'Direct Play', squadBuildingPhilosophy: 'Youth Development', youthFocus: 60, transferAggressiveness: 6, financialStrength: 2 },
  },
  {
    id: 'club_stonewick', name: 'Stonewick FC', shortName: 'SWK', city: 'Stonewick',
    stadium: 'Stone Park', capacity: 700, reputation: 12,
    competitionId: COMP_VRL, regionId: 'region_eastern_highlands',
    colors: { primary: '#9e9e9e', secondary: '#616161' },
    managerName: 'Bert Sloane', managerNationality: 'Grenzian', managerAge: 57, managerFormation: '4-5-1',
    qualityBase: 10, qualitySpread: 10,
    balance: 14_000, transferBudget: 2_500, wageBudget: 700,
    identity: { tacticalPhilosophy: 'Defensive Block', squadBuildingPhilosophy: 'Free Transfers Only', youthFocus: 38, transferAggressiveness: 5, financialStrength: 2 },
  },
  {
    id: 'club_frostwick', name: 'Frostwick Town', shortName: 'FWT', city: 'Frostwick',
    stadium: 'Frost End', capacity: 600, reputation: 10,
    competitionId: COMP_VRL, regionId: 'region_northern_coast',
    colors: { primary: '#b0bec5', secondary: '#ffffff' },
    managerName: 'Reg Wint', managerNationality: 'Nordovian', managerAge: 60, managerFormation: '4-4-2',
    qualityBase: 9, qualitySpread: 10,
    balance: 10_000, transferBudget: 2_000, wageBudget: 500,
    identity: { tacticalPhilosophy: 'Long Ball', squadBuildingPhilosophy: 'Free Transfers Only', youthFocus: 35, transferAggressiveness: 5, financialStrength: 1 },
  },
];

// ─── Club Catalog (for StartScreen — no gameState required) ──────────────────

export interface ClubCatalogEntry {
  id: string;
  name: string;
  shortName: string;
  city: string;
  colors: { primary: string; secondary: string };
  reputation: number;
  competitionId: string;
  competitionName: string;
  competitionLevel: number;
  regionId: string;
  regionName: string;
}

const COMP_NAME_MAP: Record<string, { name: string; level: number }> = {
  [COMP_VPL]: { name: 'Valsoria Premier League', level: 1 },
  [COMP_VC]:  { name: 'Valsoria Championship',   level: 2 },
  [COMP_VNL]: { name: 'Valsoria National League', level: 3 },
  [COMP_VRL]: { name: 'Valsoria Regional League', level: 4 },
};

const REGION_NAME_MAP: Record<string, string> = Object.fromEntries(
  REGIONS.map((r) => [r.id, r.name]),
);

export const CLUB_CATALOG: ClubCatalogEntry[] = CLUB_DEFS.map((d) => ({
  id: d.id,
  name: d.name,
  shortName: d.shortName,
  city: d.city,
  colors: d.colors,
  reputation: d.reputation,
  competitionId: d.competitionId,
  competitionName: COMP_NAME_MAP[d.competitionId].name,
  competitionLevel: COMP_NAME_MAP[d.competitionId].level,
  regionId: d.regionId,
  regionName: REGION_NAME_MAP[d.regionId],
}));

// ─── Rivalries ────────────────────────────────────────────────────────────────

const RIVALRIES: Rivalry[] = [
  { clubAId: 'club_ironvale',  clubBId: 'club_solara',    intensity: 96, type: 'historical' },
  { clubAId: 'club_redmoor',   clubBId: 'club_greyvast',  intensity: 82, type: 'local' },
  { clubAId: 'club_portcrest', clubBId: 'club_havengate', intensity: 78, type: 'local' },
  { clubAId: 'club_portcrest', clubBId: 'club_astorias',  intensity: 72, type: 'local' },
  { clubAId: 'club_velthorn',  clubBId: 'club_grenzburg', intensity: 75, type: 'local' },
  { clubAId: 'club_dunmore',   clubBId: 'club_strandvik', intensity: 68, type: 'local' },
  { clubAId: 'club_fastbridge',clubBId: 'club_brackmore', intensity: 65, type: 'local' },
  { clubAId: 'club_ironvale',  clubBId: 'club_kressen',   intensity: 70, type: 'local' },
  { clubAId: 'club_solara',    clubBId: 'club_silverton', intensity: 60, type: 'ambition' },
  { clubAId: 'club_westburn',  clubBId: 'club_holwick',   intensity: 74, type: 'local' },
  { clubAId: 'club_caldera',   clubBId: 'club_ashvale',   intensity: 70, type: 'local' },
  { clubAId: 'club_moorfield', clubBId: 'club_aldenmoor', intensity: 68, type: 'local' },
];

// ─── Manager factory ──────────────────────────────────────────────────────────

function makeManager(name: string, clubId: string, nationality: string, age: number, reputation: number, formation: string): Manager {
  return {
    id: `mgr_${clubId}`,
    name,
    nationality,
    age,
    preferredFormation: formation,
    coachingAttributes: {
      tactical: Math.max(1, Math.min(99, Math.round(reputation * 0.85 + Math.random() * 12))),
      technical: Math.max(1, Math.min(99, Math.round(reputation * 0.75 + Math.random() * 14))),
      mental: Math.max(1, Math.min(99, Math.round(reputation * 0.80 + Math.random() * 12))),
      fitness: Math.max(1, Math.min(99, Math.round(reputation * 0.70 + Math.random() * 16))),
      youth: Math.max(1, Math.min(99, Math.round(reputation * 0.70 + Math.random() * 18))),
    },
    reputation,
    clubId,
  };
}

// ─── Fixture generator (for one competition) ──────────────────────────────────

function generateFixtures(clubIds: string[], competitionId: string): Fixture[] {
  const fixtures: Fixture[] = [];
  const n = clubIds.length;
  let fixtureId = 1;
  const gameweeks: [string, string][][] = [];

  for (let round = 0; round < 2; round++) {
    const ids = [...clubIds];
    const numRounds = n - 1;
    const half = Math.floor(n / 2);
    for (let r = 0; r < numRounds; r++) {
      const matchday: [string, string][] = [];
      for (let m = 0; m < half; m++) {
        const home = round === 0 ? ids[m] : ids[n - 1 - m];
        const away = round === 0 ? ids[n - 1 - m] : ids[m];
        if (r % 2 === 1) matchday.push([away, home]);
        else matchday.push([home, away]);
      }
      gameweeks.push(matchday);
      const last = ids.pop()!;
      ids.splice(1, 0, last);
    }
  }

  const startDate = new Date(2025, 7, 9); // Aug 9
  gameweeks.forEach((gw, gwIdx) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + gwIdx * 7);
    const dateStr = d.toISOString().split('T')[0];
    gw.forEach(([h, a]) => {
      fixtures.push({
        id: `fix_${String(fixtureId++).padStart(4, '0')}`,
        competitionId,
        homeClubId: h,
        awayClubId: a,
        date: dateStr,
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
    table[id] = { clubId: id, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0, form: [] };
  });
  return table;
}

// ─── Seed news ────────────────────────────────────────────────────────────────

function seedNews(): NewsItem[] {
  return [
    { id: 'news_001', date: '2025-07-01', headline: 'Valsoria Football Pyramid Launches New Era', body: 'The Valsoria football pyramid now spans four divisions with 80 clubs from across the nation ready to compete.', category: 'General' },
    { id: 'news_002', date: '2025-07-03', headline: 'Pre-Season Training Underway Across All Divisions', body: 'Clubs from the Premier League to the Regional League are putting final touches on their squads ahead of the August opener.', category: 'General' },
    { id: 'news_003', date: '2025-07-05', headline: 'Transfer Window Open — Activity Expected at Every Level', body: 'The summer transfer window is officially open. Expect significant movement across all four divisions of Valsoria football.', category: 'Transfer' },
    { id: 'news_004', date: '2025-07-08', headline: 'Rivalry Week: Derbies to Watch This Season', body: 'Ironvale vs Solara, Redmoor vs Greyvast, Velthorn vs Grenzburg — the regional derbies that will define this season.', category: 'General' },
  ];
}

// ─── World builder ────────────────────────────────────────────────────────────

export function buildInitialWorld(playerClubId = 'club_redmoor'): GameState {
  resetPlayerIdCounter();

  const allPlayers: Record<string, Player> = {};
  const allClubs: Record<string, Club> = {};

  // Build competition club ID lists
  const compClubIds: Record<string, string[]> = {
    [COMP_VPL]: [], [COMP_VC]: [], [COMP_VNL]: [], [COMP_VRL]: [],
  };
  for (const def of CLUB_DEFS) {
    compClubIds[def.competitionId].push(def.id);
  }

  // Build competitions record
  const competitions: Record<string, Competition> = {};
  for (const def of COMP_DEFS) {
    competitions[def.id] = { ...def, clubIds: compClubIds[def.id] };
  }

  // Build regions record
  const regions: Record<string, Region> = {};
  for (const r of REGIONS) {
    regions[r.id] = r;
  }

  // Build clubs and players
  for (const def of CLUB_DEFS) {
    const { players, playerIds } = buildSquad(def.id, def.qualityBase, def.qualitySpread, def.reputation);
    for (const p of players) { allPlayers[p.id] = p; }

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
      competitionId: def.competitionId,
      regionId: def.regionId,
      facilities: {
        trainingGround: Math.max(1, Math.min(5, Math.floor(def.reputation / 20))),
        youthAcademy: Math.max(1, Math.min(5, Math.floor(def.reputation / 22))),
        stadium: Math.max(1, Math.min(5, Math.floor(def.capacity / 12000))),
        medical: Math.max(1, Math.min(5, Math.floor(def.reputation / 22))),
      },
      identity: def.identity,
    };
    allClubs[def.id] = club;
  }

  // Find player's competition and generate fixtures for it only
  const playerClub = allClubs[playerClubId] || allClubs['club_redmoor'];
  const playerCompId = playerClub.competitionId;
  const playerCompClubIds = compClubIds[playerCompId];
  const fixtures = generateFixtures(playerCompClubIds, playerCompId);
  const leagueTable = initLeagueTable(playerCompClubIds);

  return {
    version: 3,
    currentDate: '2025-07-01',
    season: '2025/26',
    playerClubId: playerClub.id,
    clubs: allClubs,
    players: allPlayers,
    competitions,
    regions,
    rivalries: RIVALRIES,
    fixtures,
    leagueTable,
    news: seedNews(),
    lastSaved: new Date().toISOString(),
  };
}
