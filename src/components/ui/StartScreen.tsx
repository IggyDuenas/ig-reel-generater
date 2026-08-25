import { useState, useMemo } from 'react';
import type { UseGameReturn } from '../../store/gameStore';
import { CLUB_CATALOG, type ClubCatalogEntry } from '../../data/worldData';
import './StartScreen.css';

const ALL_COMPS = [
  { id: 'all', name: 'All Divisions' },
  { id: 'comp_vpl', name: 'Premier League' },
  { id: 'comp_vc',  name: 'Championship' },
  { id: 'comp_vnl', name: 'National League' },
  { id: 'comp_vrl', name: 'Regional League' },
];

const ALL_REGIONS = [
  { id: 'all', name: 'All Regions' },
  { id: 'region_northern_coast',    name: 'Northern Coast' },
  { id: 'region_ironlands',         name: 'The Ironlands' },
  { id: 'region_central_plains',    name: 'Central Plains' },
  { id: 'region_eastern_highlands', name: 'Eastern Highlands' },
  { id: 'region_western_marches',   name: 'Western Marches' },
  { id: 'region_southern_coast',    name: 'Southern Coast' },
  { id: 'region_capital_district',  name: 'Capital District' },
  { id: 'region_lake_district',     name: 'Lake District' },
  { id: 'region_riverlands',        name: 'The Riverlands' },
  { id: 'region_southern_highlands',name: 'Southern Highlands' },
];

const LEVEL_LABEL: Record<number, string> = {
  1: 'Premier League',
  2: 'Championship',
  3: 'National League',
  4: 'Regional League',
};

const LEVEL_COLOR: Record<number, string> = {
  1: '#f5c842',
  2: '#4fc3f7',
  3: '#81c784',
  4: '#ce93d8',
};

function StarBar({ rep }: { rep: number }) {
  const stars = Math.max(1, Math.round(rep / 20));
  return (
    <span>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < stars ? '#f5c842' : '#2a3048', fontSize: '0.8rem' }}>★</span>
      ))}
    </span>
  );
}

function ClubCard({ club, selected, onClick }: { club: ClubCatalogEntry; selected: boolean; onClick: () => void }) {
  return (
    <button
      className={`club-card${selected ? ' selected' : ''}`}
      onClick={onClick}
    >
      <div
        className="club-card-crest"
        style={{ background: club.colors.primary, border: `2px solid ${club.colors.secondary}` }}
      >
        {club.name.split(' ').map((w) => w[0]).join('').slice(0, 3)}
      </div>
      <div className="club-card-name">{club.name}</div>
      <div className="club-card-city" style={{ fontSize: '0.72rem', color: 'var(--txt-muted)', marginBottom: 2 }}>{club.city}</div>
      <div style={{ marginBottom: 4 }}>
        <StarBar rep={club.reputation} />
      </div>
      <div style={{
        fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.02em',
        color: LEVEL_COLOR[club.competitionLevel], opacity: 0.9,
      }}>
        {LEVEL_LABEL[club.competitionLevel]}
      </div>
      <div style={{ fontSize: '0.62rem', color: 'var(--txt-muted)', marginTop: 2 }}>
        {club.regionName}
      </div>
    </button>
  );
}

interface Props { game: UseGameReturn }

export default function StartScreen({ game }: Props) {
  const [selectedClub, setSelectedClub] = useState<string>('club_redmoor');
  const [view, setView] = useState<'main' | 'newgame'>('main');
  const [filterComp, setFilterComp] = useState<string>('all');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let clubs = CLUB_CATALOG;
    if (filterComp !== 'all') clubs = clubs.filter((c) => c.competitionId === filterComp);
    if (filterRegion !== 'all') clubs = clubs.filter((c) => c.regionId === filterRegion);
    if (search.trim()) {
      const q = search.toLowerCase();
      clubs = clubs.filter((c) => c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q));
    }
    return clubs;
  }, [filterComp, filterRegion, search]);

  const selectedEntry = CLUB_CATALOG.find((c) => c.id === selectedClub);

  if (view === 'newgame') {
    return (
      <div className="start-screen">
        <div className="start-inner" style={{ maxWidth: 1100 }}>
          <h1 className="start-title">Choose Your Club</h1>
          <p className="start-sub">
            Select a club from any of Valsoria's four divisions
          </p>

          {selectedEntry && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20,
              padding: '12px 20px', background: 'var(--accent-dim)', borderRadius: 8,
              border: '1px solid var(--accent)',
            }}>
              <div
                style={{
                  width: 44, height: 44, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: selectedEntry.colors.primary, border: `2px solid ${selectedEntry.colors.secondary}`,
                  fontWeight: 700, fontSize: '0.8rem', color: '#fff', flexShrink: 0,
                }}
              >
                {selectedEntry.name.split(' ').map((w) => w[0]).join('').slice(0, 3)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--accent)' }}>{selectedEntry.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--txt-secondary)' }}>
                  {selectedEntry.city} · {selectedEntry.competitionName} · {selectedEntry.regionName}
                </div>
              </div>
              <StarBar rep={selectedEntry.reputation} />
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
            <input
              type="text"
              placeholder="Search clubs…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: 160 }}
            />
            <select value={filterComp} onChange={(e) => setFilterComp(e.target.value)}>
              {ALL_COMPS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)}>
              {ALL_REGIONS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <span className="text-muted text-sm" style={{ alignSelf: 'center' }}>{filtered.length} clubs</span>
          </div>

          <div className="club-grid" style={{ maxHeight: 480, overflowY: 'auto', paddingRight: 4 }}>
            {filtered.map((c) => (
              <ClubCard
                key={c.id}
                club={c}
                selected={selectedClub === c.id}
                onClick={() => setSelectedClub(c.id)}
              />
            ))}
            {filtered.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: 'var(--txt-muted)' }}>
                No clubs match your filters
              </div>
            )}
          </div>

          <div className="start-actions" style={{ marginTop: 20 }}>
            <button className="btn-secondary" onClick={() => setView('main')}>← Back</button>
            <button
              className="btn-primary"
              style={{ padding: '12px 36px', fontSize: '1rem' }}
              onClick={() => game.newGame(selectedClub)}
            >
              Start Season →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="start-screen">
      <div className="start-inner">
        <div className="start-logo">⚽</div>
        <h1 className="start-title">Football Manager</h1>
        <h2 className="start-league">Valsoria · 2025/26</h2>
        <p className="start-sub">
          Take control of a club across four divisions of Valsoria football — from the Premier League to the Regional League. Build your squad, set tactics, and lead your club to glory.
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 12, fontSize: '0.8rem' }}>
          {[
            { label: 'Premier League', color: LEVEL_COLOR[1], clubs: 18 },
            { label: 'Championship',   color: LEVEL_COLOR[2], clubs: 18 },
            { label: 'National Lg',    color: LEVEL_COLOR[3], clubs: 20 },
            { label: 'Regional Lg',    color: LEVEL_COLOR[4], clubs: 24 },
          ].map((d) => (
            <span key={d.label} style={{
              padding: '4px 12px', borderRadius: 20,
              background: 'var(--bg-card)', border: `1px solid ${d.color}`,
              color: d.color, fontWeight: 600,
            }}>
              {d.label} · {d.clubs} clubs
            </span>
          ))}
        </div>

        <div className="start-actions" style={{ flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <button
            className="btn-primary start-main-btn"
            onClick={() => setView('newgame')}
          >
            New Game
          </button>
          {game.hasSave && (
            <button className="btn-secondary start-main-btn" onClick={game.loadGame}>
              Continue Game
            </button>
          )}
          {game.hasSave && (
            <button className="btn-ghost" onClick={() => {
              if (window.confirm('Reset all saved data and start fresh?')) game.resetGame();
            }}>
              Reset All Data
            </button>
          )}
        </div>

        <div className="start-credits">
          A browser-based football management simulation · 80 clubs · 4 divisions
        </div>
      </div>
    </div>
  );
}
