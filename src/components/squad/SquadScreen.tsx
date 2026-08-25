import { useState, useMemo } from 'react';
import type { GameState, Player, Position } from '../../types';
import { formatWage, contractStatus, abilityColor, moraleColor, fitnessColor } from '../../utils';
import './SquadScreen.css';

interface Props {
  gameState: GameState;
  onSelectPlayer: (id: string) => void;
  selectedPlayerId: string | null;
}

type SortKey = 'name' | 'age' | 'position' | 'currentAbility' | 'potentialAbility' | 'fitness' | 'morale' | 'wage';

const POSITIONS: Position[] = ['GK','CB','LB','RB','LWB','RWB','DM','CM','LM','RM','AM','LW','RW','ST'];

function sortPlayers(players: Player[], key: SortKey, dir: 1 | -1): Player[] {
  return [...players].sort((a, b) => {
    let av: string | number;
    let bv: string | number;
    if (key === 'wage') {
      av = a.contract.wage;
      bv = b.contract.wage;
    } else if (key === 'name') {
      av = a.name;
      bv = b.name;
    } else if (key === 'position') {
      av = a.position;
      bv = b.position;
    } else {
      av = a[key] as number;
      bv = b[key] as number;
    }
    if (av < bv) return -dir;
    if (av > bv) return dir;
    return 0;
  });
}

function BarCell({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-8">
      <span style={{ width: 28, textAlign: 'right', fontSize: '0.82rem' }}>{value}</span>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

export default function SquadScreen({ gameState, onSelectPlayer, selectedPlayerId }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('currentAbility');
  const [sortDir, setSortDir] = useState<1 | -1>(-1);
  const [filterPos, setFilterPos] = useState<string>('All');
  const [search, setSearch] = useState('');

  const club = gameState.clubs[gameState.playerClubId];
  const allPlayers = club.playerIds.map((id) => gameState.players[id]).filter(Boolean);

  const filtered = useMemo(() => {
    let ps = allPlayers;
    if (filterPos !== 'All') ps = ps.filter((p) => p.position === filterPos);
    if (search.trim()) {
      const q = search.toLowerCase();
      ps = ps.filter((p) => p.name.toLowerCase().includes(q));
    }
    return sortPlayers(ps, sortKey, sortDir);
  }, [allPlayers, filterPos, search, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 1 ? -1 : 1));
    else { setSortKey(key); setSortDir(-1); }
  }

  function sortIndicator(key: SortKey) {
    if (sortKey !== key) return ' ↕';
    return sortDir === -1 ? ' ↓' : ' ↑';
  }

  return (
    <div className="squad-screen">
      <div className="section-header">
        <h2 className="section-title">Squad</h2>
        <span className="text-muted text-sm">{allPlayers.length} players</span>
      </div>

      <div className="squad-toolbar">
        <input
          type="text"
          placeholder="Search players…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 200 }}
        />
        <select value={filterPos} onChange={(e) => setFilterPos(e.target.value)}>
          <option value="All">All Positions</option>
          {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <span className="text-muted text-sm">{filtered.length} results</span>
      </div>

      <div className="overflow-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => toggleSort('name')}>Name{sortIndicator('name')}</th>
              <th onClick={() => toggleSort('age')}>Age{sortIndicator('age')}</th>
              <th onClick={() => toggleSort('position')}>Pos{sortIndicator('position')}</th>
              <th onClick={() => toggleSort('currentAbility')}>CA{sortIndicator('currentAbility')}</th>
              <th onClick={() => toggleSort('potentialAbility')}>PA{sortIndicator('potentialAbility')}</th>
              <th onClick={() => toggleSort('fitness')}>Fit{sortIndicator('fitness')}</th>
              <th onClick={() => toggleSort('morale')}>Mor{sortIndicator('morale')}</th>
              <th onClick={() => toggleSort('wage')}>Wage{sortIndicator('wage')}</th>
              <th>Contract</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const cs = contractStatus(p.contract.expiryDate, gameState.currentDate);
              return (
                <tr
                  key={p.id}
                  className={selectedPlayerId === p.id ? 'selected' : ''}
                  onClick={() => onSelectPlayer(p.id)}
                >
                  <td>
                    <div className="player-name-cell">
                      {p.isInjured && <span className="inj-icon" title="Injured">🤕</span>}
                      <span style={{ fontWeight: 500 }}>{p.name}</span>
                    </div>
                  </td>
                  <td>{p.age}</td>
                  <td><span className="badge badge-pos">{p.position}</span></td>
                  <td>
                    <BarCell value={p.currentAbility} color={abilityColor(p.currentAbility)} />
                  </td>
                  <td>
                    <span style={{ color: abilityColor(p.potentialAbility), fontWeight: 600 }}>
                      {p.potentialAbility}
                    </span>
                  </td>
                  <td>
                    <BarCell value={p.fitness} color={fitnessColor(p.fitness)} />
                  </td>
                  <td>
                    <BarCell value={p.morale} color={moraleColor(p.morale)} />
                  </td>
                  <td className="text-sm">{formatWage(p.contract.wage)}</td>
                  <td>
                    <span style={{ color: cs.color, fontWeight: 600, fontSize: '0.8rem' }}>
                      {cs.label}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-status">{p.contract.squadStatus}</span>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={10} style={{ textAlign: 'center', color: 'var(--txt-muted)', padding: 24 }}>No players found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
