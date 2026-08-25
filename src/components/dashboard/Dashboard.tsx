import type { GameState } from '../../types';
import {
  formatCurrency, formatWage, formatDate, moraleLabel, moraleColor,
  sortLeagueTable, getTopPerformer, squadMoraleAvg, injuredPlayers, abilityLabel,
} from '../../utils';
import './Dashboard.css';

interface Props {
  gameState: GameState;
  onSelectPlayer: (id: string) => void;
  onSelectClub: (id: string) => void;
}

export default function Dashboard({ gameState, onSelectPlayer, onSelectClub }: Props) {
  const club = gameState.clubs[gameState.playerClubId];
  if (!club) return <div className="placeholder-section"><p>No club loaded.</p></div>;

  const squadPlayers = club.playerIds.map((id) => gameState.players[id]).filter(Boolean);
  const topPerformer = getTopPerformer(squadPlayers);
  const avgMorale = squadMoraleAvg(squadPlayers);
  const injured = injuredPlayers(squadPlayers);
  const tableEntries = sortLeagueTable(Object.values(gameState.leagueTable));
  const myPos = tableEntries.findIndex((e) => e.clubId === gameState.playerClubId) + 1;
  const myEntry = gameState.leagueTable[gameState.playerClubId];
  const nextFixture = gameState.fixtures.find(
    (f) => !f.played && (f.homeClubId === gameState.playerClubId || f.awayClubId === gameState.playerClubId),
  );

  return (
    <div className="dashboard">
      {/* Club header */}
      <div className="dash-club-header card">
        <div className="dash-crest" style={{ background: club.colors.primary }}>
          <span>{club.shortName}</span>
        </div>
        <div className="dash-club-info">
          <h1>{club.name}</h1>
          <div className="dash-meta">
            <span>Manager: <strong>{club.manager.name}</strong></span>
            <span className="sep">·</span>
            <span>Season: <strong>{gameState.season}</strong></span>
            <span className="sep">·</span>
            <span>Date: <strong>{formatDate(gameState.currentDate)}</strong></span>
          </div>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid-4 mt-16">
        <div className="stat-tile">
          <div className="stat-tile-label">League Position</div>
          <div className="stat-tile-value" style={{ color: 'var(--accent)' }}>
            {myPos > 0 ? `#${myPos}` : '—'}
          </div>
          <div className="stat-tile-sub">
            {myEntry ? `${myEntry.points} pts · ${myEntry.played} played` : 'Season not started'}
          </div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile-label">Transfer Budget</div>
          <div className="stat-tile-value">{formatCurrency(club.finances.transferBudget)}</div>
          <div className="stat-tile-sub">Balance: {formatCurrency(club.finances.balance)}</div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile-label">Squad Morale</div>
          <div className="stat-tile-value" style={{ color: moraleColor(avgMorale) }}>
            {moraleLabel(avgMorale)}
          </div>
          <div className="stat-tile-sub">{avgMorale}/100 average</div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile-label">Injuries</div>
          <div className="stat-tile-value" style={{ color: injured.length > 0 ? 'var(--clr-poor)' : 'var(--clr-good)' }}>
            {injured.length}
          </div>
          <div className="stat-tile-sub">Players unavailable</div>
        </div>
      </div>

      <div className="dash-grid mt-16">
        {/* League table preview */}
        <div className="card dash-table-card">
          <div className="card-header">
            <h3>League Table</h3>
            <span className="text-muted text-sm">{gameState.competitions[gameState.clubs[gameState.playerClubId]?.competitionId]?.name}</span>
          </div>
          <div className="overflow-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Club</th>
                  <th>P</th>
                  <th>W</th>
                  <th>D</th>
                  <th>L</th>
                  <th>GD</th>
                  <th>Pts</th>
                </tr>
              </thead>
              <tbody>
                {tableEntries.map((e, i) => {
                  const c = gameState.clubs[e.clubId];
                  const isMe = e.clubId === gameState.playerClubId;
                  return (
                    <tr
                      key={e.clubId}
                      className={isMe ? 'selected' : ''}
                      onClick={() => onSelectClub(e.clubId)}
                    >
                      <td><span className="text-muted">{i + 1}</span></td>
                      <td>
                        <span className={isMe ? 'text-accent' : ''} style={{ fontWeight: isMe ? 600 : 400 }}>
                          {c?.shortName || '—'}
                        </span>
                      </td>
                      <td>{e.played}</td>
                      <td>{e.won}</td>
                      <td>{e.drawn}</td>
                      <td>{e.lost}</td>
                      <td style={{ color: e.goalDifference > 0 ? 'var(--clr-good)' : e.goalDifference < 0 ? 'var(--clr-poor)' : undefined }}>
                        {e.goalDifference > 0 ? `+${e.goalDifference}` : e.goalDifference}
                      </td>
                      <td><strong>{e.points}</strong></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dash-right-col">
          {/* Next fixture */}
          {nextFixture && (
            <div className="card">
              <div className="card-header"><h3>Next Fixture</h3></div>
              <div className="next-fixture">
                <div className="fixture-date">{formatDate(nextFixture.date)}</div>
                <div className="fixture-teams">
                  <span className={nextFixture.homeClubId === gameState.playerClubId ? 'text-accent' : ''}>
                    {gameState.clubs[nextFixture.homeClubId]?.name}
                  </span>
                  <span className="vs-label">vs</span>
                  <span className={nextFixture.awayClubId === gameState.playerClubId ? 'text-accent' : ''}>
                    {gameState.clubs[nextFixture.awayClubId]?.name}
                  </span>
                </div>
                <div className="fixture-venue text-muted text-sm">
                  {gameState.clubs[nextFixture.homeClubId]?.stadium}
                </div>
              </div>
            </div>
          )}

          {/* Top performer */}
          {topPerformer && (
            <div className="card mt-12">
              <div className="card-header"><h3>Top Performer</h3></div>
              <div className="top-performer" onClick={() => onSelectPlayer(topPerformer.id)} style={{ cursor: 'pointer' }}>
                <div className="tp-name">{topPerformer.name}</div>
                <div className="tp-info text-muted text-sm">
                  {topPerformer.position} · {topPerformer.nationality}
                </div>
                <div className="tp-ability mt-8">
                  <span className="badge badge-pos">{topPerformer.position}</span>
                  <span style={{ marginLeft: 8, fontWeight: 700, color: 'var(--clr-elite)' }}>
                    {topPerformer.currentAbility}
                  </span>
                  <span className="text-muted text-sm" style={{ marginLeft: 6 }}>
                    {abilityLabel(topPerformer.currentAbility)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Finances summary */}
          <div className="card mt-12">
            <div className="card-header"><h3>Finances</h3></div>
            <div className="flex-col gap-8">
              <div className="finance-row">
                <span className="text-muted">Balance</span>
                <span className="text-accent" style={{ fontWeight: 700 }}>{formatCurrency(club.finances.balance)}</span>
              </div>
              <div className="finance-row">
                <span className="text-muted">Transfer Budget</span>
                <span>{formatCurrency(club.finances.transferBudget)}</span>
              </div>
              <div className="finance-row">
                <span className="text-muted">Weekly Wages</span>
                <span>{formatWage(club.finances.weeklyWageBill)}</span>
              </div>
              <div className="finance-row">
                <span className="text-muted">Wage Budget</span>
                <span>{formatWage(club.finances.wageBudget)}</span>
              </div>
            </div>
          </div>

          {/* Injury report */}
          <div className="card mt-12">
            <div className="card-header"><h3>Injury Report</h3></div>
            {injured.length === 0 ? (
              <p className="text-muted text-sm">No injuries — full squad available.</p>
            ) : (
              <div className="flex-col gap-8">
                {injured.slice(0, 5).map((p) => (
                  <div key={p.id} className="injury-row" onClick={() => onSelectPlayer(p.id)}>
                    <span>{p.name}</span>
                    <span className="text-sm" style={{ color: 'var(--clr-poor)' }}>Injured</span>
                  </div>
                ))}
                {injured.length > 5 && (
                  <p className="text-muted text-sm">+{injured.length - 5} more</p>
                )}
              </div>
            )}
          </div>

          {/* News */}
          <div className="card mt-12">
            <div className="card-header"><h3>Latest News</h3></div>
            <div className="flex-col gap-12">
              {gameState.news.slice(0, 3).map((n) => (
                <div key={n.id} className="news-item">
                  <div className="news-headline">{n.headline}</div>
                  <div className="text-muted text-sm">{formatDate(n.date)} · {n.category}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
