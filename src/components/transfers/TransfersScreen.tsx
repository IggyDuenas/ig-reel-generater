import { useState, useMemo } from 'react';
import type { GameState, Player, Position } from '../../types';
import { abilityColor, formatCurrency, formatWage } from '../../utils';
import { formatValsorian } from '../../utils/calculations';

interface Props { gameState: GameState; onSelectPlayer: (id: string) => void }

const POSITIONS: Position[] = ['GK','CB','LB','RB','LWB','RWB','DM','CM','LM','RM','AM','LW','RW','ST'];

export default function TransfersScreen({ gameState, onSelectPlayer }: Props) {
  const myClub = gameState.clubs[gameState.playerClubId];

  const [filterComp, setFilterComp] = useState<string>('all');
  const [filterPos, setFilterPos] = useState<string>('all');
  const [filterMinCA, setFilterMinCA] = useState<number>(0);
  const [filterMaxAge, setFilterMaxAge] = useState<number>(99);
  const [sortKey, setSortKey] = useState<'ca' | 'pa' | 'age' | 'value' | 'wage'>('ca');
  const [search, setSearch] = useState('');

  const competitions = Object.values(gameState.competitions).sort((a, b) => a.level - b.level);

  const filtered = useMemo(() => {
    let players = Object.values(gameState.players)
      .filter((p) => p.clubId !== gameState.playerClubId);

    if (filterComp !== 'all') {
      const clubIds = new Set(gameState.competitions[filterComp]?.clubIds ?? []);
      players = players.filter((p) => clubIds.has(p.clubId));
    }
    if (filterPos !== 'all') {
      players = players.filter((p) => p.position === filterPos);
    }
    if (filterMinCA > 0) {
      players = players.filter((p) => p.currentAbility >= filterMinCA);
    }
    if (filterMaxAge < 99) {
      players = players.filter((p) => p.age <= filterMaxAge);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      players = players.filter(
        (p) => p.name.toLowerCase().includes(q) || gameState.clubs[p.clubId]?.name.toLowerCase().includes(q),
      );
    }

    players.sort((a, b) => {
      if (sortKey === 'ca') return b.currentAbility - a.currentAbility;
      if (sortKey === 'pa') return b.potentialAbility - a.potentialAbility;
      if (sortKey === 'age') return a.age - b.age;
      if (sortKey === 'value') return b.marketValue - a.marketValue;
      if (sortKey === 'wage') return b.contract.wage - a.contract.wage;
      return 0;
    });

    return players.slice(0, 100);
  }, [gameState.players, gameState.playerClubId, gameState.competitions, filterComp, filterPos, filterMinCA, filterMaxAge, sortKey, search]);

  function clubCompName(p: Player) {
    const club = gameState.clubs[p.clubId];
    if (!club) return '—';
    const comp = gameState.competitions[club.competitionId];
    return comp ? comp.shortName : '—';
  }

  return (
    <div style={{ padding: '20px 24px' }}>
      <div className="section-header">
        <h2 className="section-title">Transfers</h2>
        <span className="text-muted text-sm">
          Budget: <strong style={{ color: 'var(--accent)' }}>{formatCurrency(myClub?.finances.transferBudget || 0)}</strong>
        </span>
      </div>

      <div className="card mb-16">
        <div style={{ paddingTop: 16, paddingBottom: 12, textAlign: 'left' }}>
          <h3 style={{ marginBottom: 4 }}>Transfer Market — Preview</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--txt-secondary)' }}>
            Browse players across all four divisions of Valsoria football. Full transfer negotiation and bidding will be available in a future update.
          </p>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Search player or club…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 180 }}
          />
          <select value={filterComp} onChange={(e) => setFilterComp(e.target.value)}>
            <option value="all">All Divisions</option>
            {competitions.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select value={filterPos} onChange={(e) => setFilterPos(e.target.value)}>
            <option value="all">All Positions</option>
            {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={filterMinCA} onChange={(e) => setFilterMinCA(Number(e.target.value))}>
            <option value={0}>Min CA: Any</option>
            <option value={20}>20+</option>
            <option value={30}>30+</option>
            <option value={40}>40+</option>
            <option value={50}>50+</option>
            <option value={60}>60+</option>
            <option value={70}>70+</option>
            <option value={80}>80+</option>
          </select>
          <select value={filterMaxAge} onChange={(e) => setFilterMaxAge(Number(e.target.value))}>
            <option value={99}>Max Age: Any</option>
            <option value={21}>U21</option>
            <option value={23}>U23</option>
            <option value={25}>U25</option>
            <option value={28}>U28</option>
          </select>
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value as typeof sortKey)}>
            <option value="ca">Sort: CA</option>
            <option value="pa">Sort: PA</option>
            <option value="age">Sort: Age</option>
            <option value="value">Sort: Value</option>
            <option value="wage">Sort: Wage</option>
          </select>
          <span className="text-muted text-sm" style={{ alignSelf: 'center' }}>{filtered.length} players</span>
        </div>

        <div className="overflow-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th><th>Club</th><th>Div</th><th>Pos</th><th>Age</th>
                <th>CA</th><th>PA</th><th>Value</th><th>Wage</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const c = gameState.clubs[p.clubId];
                return (
                  <tr key={p.id} onClick={() => onSelectPlayer(p.id)} style={{ cursor: 'pointer' }}>
                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                    <td className="text-sm text-muted">{c?.shortName || '—'}</td>
                    <td className="text-sm text-muted">{clubCompName(p)}</td>
                    <td><span className="badge badge-pos">{p.position}</span></td>
                    <td>{p.age}</td>
                    <td style={{ fontWeight: 700, color: abilityColor(p.currentAbility) }}>{p.currentAbility}</td>
                    <td style={{ color: abilityColor(p.potentialAbility) }}>{p.potentialAbility}</td>
                    <td className="text-sm">{formatValsorian(p.marketValue)}</td>
                    <td className="text-sm">{formatWage(p.contract.wage)}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--txt-muted)', padding: 24 }}>No players match your filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
