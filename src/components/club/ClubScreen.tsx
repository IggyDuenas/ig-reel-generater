import type { GameState } from '../../types';
import { formatCurrency, formatWage } from '../../utils';
import './ClubScreen.css';

interface Props {
  gameState: GameState;
  clubId: string | null;
  onSelectPlayer: (id: string) => void;
}

function StarRating({ value }: { value: number }) {
  const stars = Math.round(value);
  return (
    <span className="star-rating">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < stars ? 'var(--clr-elite)' : 'var(--border)' }}>★</span>
      ))}
    </span>
  );
}

export default function ClubScreen({ gameState, clubId, onSelectPlayer }: Props) {
  const id = clubId || gameState.playerClubId;
  const club = gameState.clubs[id];
  if (!club) return <div className="placeholder-section"><p>Club not found.</p></div>;

  const isMyClub = id === gameState.playerClubId;
  const squadPlayers = club.playerIds.map((pid) => gameState.players[pid]).filter(Boolean);
  const topPlayer = squadPlayers.reduce((best, p) => (p.currentAbility > best.currentAbility ? p : best), squadPlayers[0]);

  return (
    <div className="club-screen">
      <div className="section-header">
        <h2 className="section-title">{isMyClub ? 'My Club' : 'Club Profile'}</h2>
      </div>

      {/* Club header */}
      <div className="club-header card">
        <div className="club-crest" style={{ background: club.colors.primary, border: `2px solid ${club.colors.secondary}` }}>
          <span>{club.shortName}</span>
        </div>
        <div className="club-header-info">
          <h1>{club.name}</h1>
          <div className="club-sub text-muted text-sm">
            {club.city} · {club.stadium} ({club.stadiumCapacity.toLocaleString()} capacity)
          </div>
          <div className="club-rep mt-8">
            <StarRating value={Math.round(club.reputation / 20)} />
            <span className="text-muted text-sm" style={{ marginLeft: 8 }}>Reputation: {club.reputation}/100</span>
          </div>
        </div>
      </div>

      <div className="club-content-grid mt-16">
        {/* Info & Finances */}
        <div className="flex-col gap-12">
          <div className="card">
            <h3 className="mb-12">Club Information</h3>
            <InfoRow label="City" value={club.city} />
            <InfoRow label="Stadium" value={club.stadium} />
            <InfoRow label="Capacity" value={club.stadiumCapacity.toLocaleString()} />
            <InfoRow label="Reputation" value={`${club.reputation}/100`} />
            <InfoRow label="Manager" value={club.manager.name} />
            <InfoRow label="Formation" value={club.manager.preferredFormation} />
          </div>

          <div className="card">
            <h3 className="mb-12">Finances</h3>
            <InfoRow label="Balance" value={formatCurrency(club.finances.balance)} highlight />
            <InfoRow label="Transfer Budget" value={formatCurrency(club.finances.transferBudget)} />
            <InfoRow label="Wage Budget" value={formatWage(club.finances.wageBudget)} />
            <InfoRow label="Weekly Wages" value={formatWage(club.finances.weeklyWageBill)} />
            <InfoRow label="Season Revenue" value={formatCurrency(club.finances.seasonRevenue)} />
            <InfoRow label="Season Expenditure" value={formatCurrency(club.finances.seasonExpenditure)} />
          </div>
        </div>

        <div className="flex-col gap-12">
          {/* Facilities */}
          <div className="card">
            <h3 className="mb-12">Facilities</h3>
            <FacilityRow label="Training Ground" value={club.facilities.trainingGround} />
            <FacilityRow label="Youth Academy" value={club.facilities.youthAcademy} />
            <FacilityRow label="Stadium" value={club.facilities.stadium} />
            <FacilityRow label="Medical Centre" value={club.facilities.medical} />
          </div>

          {/* Manager card */}
          <div className="card">
            <h3 className="mb-12">Manager</h3>
            <div className="manager-card">
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{club.manager.name}</div>
                <div className="text-muted text-sm">{club.manager.nationality} · Age {club.manager.age}</div>
                <div className="text-sm mt-4">Preferred: <strong>{club.manager.preferredFormation}</strong></div>
              </div>
              <div className="mgr-attributes">
                {Object.entries(club.manager.coachingAttributes).map(([k, v]) => (
                  <div key={k} className="mgr-attr-row">
                    <span className="text-muted text-sm" style={{ textTransform: 'capitalize' }}>{k}</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${v}%`, background: 'var(--accent)' }} />
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, width: 24, textAlign: 'right' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top player */}
          {topPlayer && (
            <div className="card">
              <h3 className="mb-12">Best Player</h3>
              <div className="top-player-row" onClick={() => onSelectPlayer(topPlayer.id)} style={{ cursor: 'pointer' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{topPlayer.name}</div>
                  <div className="text-muted text-sm">{topPlayer.position} · Age {topPlayer.age}</div>
                </div>
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--clr-elite)' }}>
                  {topPlayer.currentAbility}
                </span>
              </div>
              <p className="text-muted text-sm mt-8">Click to view full profile →</p>
            </div>
          )}
        </div>

        {/* Squad overview */}
        <div className="card club-squad-card">
          <h3 className="mb-12">Squad Overview ({squadPlayers.length} players)</h3>
          <div className="overflow-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Pos</th>
                  <th>Age</th>
                  <th>CA</th>
                </tr>
              </thead>
              <tbody>
                {[...squadPlayers]
                  .sort((a, b) => b.currentAbility - a.currentAbility)
                  .slice(0, 20)
                  .map((p) => (
                    <tr key={p.id} onClick={() => onSelectPlayer(p.id)}>
                      <td style={{ fontWeight: 500 }}>{p.name}</td>
                      <td><span className="badge badge-pos">{p.position}</span></td>
                      <td>{p.age}</td>
                      <td style={{ fontWeight: 700, color: 'var(--accent)' }}>{p.currentAbility}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="info-row" style={{ borderBottom: '1px solid var(--border-soft)', padding: '8px 0', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
      <span style={{ color: 'var(--txt-secondary)' }}>{label}</span>
      <span style={{ fontWeight: 600, color: highlight ? 'var(--accent)' : undefined }}>{value}</span>
    </div>
  );
}

function FacilityRow({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-soft)', fontSize: '0.85rem' }}>
      <span style={{ color: 'var(--txt-secondary)' }}>{label}</span>
      <span>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} style={{ color: i < value ? 'var(--clr-elite)' : 'var(--border)' }}>★</span>
        ))}
      </span>
    </div>
  );
}
