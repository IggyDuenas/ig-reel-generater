import type { GameState, Fixture } from '../../types';
import { formatDate } from '../../utils';
import './MatchesScreen.css';

interface Props {
  gameState: GameState;
}

function FixtureRow({ fixture, gameState, isMyGame }: { fixture: Fixture; gameState: GameState; isMyGame: boolean }) {
  const home = gameState.clubs[fixture.homeClubId];
  const away = gameState.clubs[fixture.awayClubId];

  return (
    <tr className={isMyGame ? 'selected' : ''}>
      <td className="text-muted text-sm">{formatDate(fixture.date)}</td>
      <td style={{ textAlign: 'right', fontWeight: isMyGame && fixture.homeClubId === gameState.playerClubId ? 700 : 400 }}>
        {home?.shortName || '?'}
      </td>
      <td style={{ textAlign: 'center', padding: '8px 6px' }}>
        {fixture.played && fixture.result ? (
          <span className="score-display">
            {fixture.result.homeGoals} – {fixture.result.awayGoals}
          </span>
        ) : (
          <span className="text-muted">vs</span>
        )}
      </td>
      <td style={{ fontWeight: isMyGame && fixture.awayClubId === gameState.playerClubId ? 700 : 400 }}>
        {away?.shortName || '?'}
      </td>
      <td className="text-muted text-sm">{home?.stadium || '—'}</td>
    </tr>
  );
}

export default function MatchesScreen({ gameState }: Props) {
  const playerClub = gameState.clubs[gameState.playerClubId];
  const playerComp = playerClub ? gameState.competitions[playerClub.competitionId] : null;

  const myFixtures = gameState.fixtures.filter(
    (f) => f.homeClubId === gameState.playerClubId || f.awayClubId === gameState.playerClubId,
  );
  const upcoming = myFixtures.filter((f) => !f.played).slice(0, 10);
  const played = myFixtures.filter((f) => f.played).slice(-10).reverse();

  const allUpcoming = gameState.fixtures.filter((f) => !f.played).slice(0, 20);

  // Competition overview (other competitions — metadata only)
  const otherComps = Object.values(gameState.competitions).filter(
    (c) => c.id !== playerClub?.competitionId,
  );

  return (
    <div className="matches-screen">
      <div className="section-header">
        <h2 className="section-title">Matches</h2>
        {playerComp && (
          <span className="text-muted text-sm">
            {playerComp.name} · Level {playerComp.level}
          </span>
        )}
      </div>

      <div className="matches-grid">
        <div>
          <div className="card mb-16">
            <div className="card-header"><h3>My Upcoming Fixtures</h3></div>
            <table className="data-table">
              <thead>
                <tr><th>Date</th><th style={{ textAlign: 'right' }}>Home</th><th style={{ textAlign: 'center' }}></th><th>Away</th><th>Venue</th></tr>
              </thead>
              <tbody>
                {upcoming.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--txt-muted)', padding: 20 }}>No upcoming fixtures</td></tr>
                ) : (
                  upcoming.map((f) => (
                    <FixtureRow key={f.id} fixture={f} gameState={gameState} isMyGame />
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="card">
            <div className="card-header"><h3>Recent Results</h3></div>
            {played.length === 0 ? (
              <p className="text-muted text-sm">No results yet — season hasn't started.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr><th>Date</th><th style={{ textAlign: 'right' }}>Home</th><th style={{ textAlign: 'center' }}></th><th>Away</th></tr>
                </thead>
                <tbody>
                  {played.map((f) => (
                    <FixtureRow key={f.id} fixture={f} gameState={gameState} isMyGame />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div>
          <div className="card mb-16">
            <div className="card-header"><h3>All Upcoming Fixtures</h3></div>
            <div className="overflow-auto">
              <table className="data-table">
                <thead>
                  <tr><th>Date</th><th style={{ textAlign: 'right' }}>Home</th><th style={{ textAlign: 'center' }}></th><th>Away</th></tr>
                </thead>
                <tbody>
                  {allUpcoming.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--txt-muted)', padding: 20 }}>No fixtures scheduled</td></tr>
                  ) : allUpcoming.map((f) => {
                    const isMyGame = f.homeClubId === gameState.playerClubId || f.awayClubId === gameState.playerClubId;
                    return <FixtureRow key={f.id} fixture={f} gameState={gameState} isMyGame={isMyGame} />;
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h3>Valsoria Football Pyramid</h3></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Object.values(gameState.competitions)
                .sort((a, b) => a.level - b.level)
                .map((comp) => {
                  const isMyComp = comp.id === playerClub?.competitionId;
                  return (
                    <div
                      key={comp.id}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 6,
                        background: isMyComp ? 'var(--accent-dim)' : 'var(--bg-card)',
                        border: `1px solid ${isMyComp ? 'var(--accent)' : 'var(--border)'}`,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: isMyComp ? 'var(--accent)' : 'var(--txt-primary)' }}>
                            {comp.name} {isMyComp && '★'}
                          </div>
                          <div className="text-muted text-sm">
                            Level {comp.level} · {comp.clubIds.length} clubs
                            {comp.promotionPlaces > 0 && ` · ↑ ${comp.promotionPlaces} up`}
                            {comp.playoffPlaces > 0 && ` + ${comp.playoffPlaces} playoff`}
                            {comp.relegationPlaces > 0 && ` · ↓ ${comp.relegationPlaces} down`}
                          </div>
                        </div>
                        <div className="text-muted text-sm" style={{ textAlign: 'right' }}>
                          Rep {comp.reputation}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {otherComps.length > 0 && (
            <div className="card mt-16">
              <div className="placeholder-section p-0" style={{ paddingTop: 28, paddingBottom: 24 }}>
                <div className="ph-icon">⚽</div>
                <h3>Match Engine</h3>
                <p>Full match simulation — including results for all four divisions — will be available in a future update.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
