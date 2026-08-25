import type { GameState } from '../../types';

interface Props { gameState: GameState }

export default function StaffScreen({ gameState }: Props) {
  const club = gameState.clubs[gameState.playerClubId];
  const mgr = club?.manager;
  return (
    <div style={{ padding: '20px 24px' }}>
      <div className="section-header"><h2 className="section-title">Staff</h2></div>

      {mgr && (
        <div className="card mb-16" style={{ maxWidth: 500 }}>
          <h3 className="mb-12">Management Staff</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              ['Manager', `${mgr.name} (${mgr.nationality})`],
              ['Age', `${mgr.age}`],
              ['Formation', mgr.preferredFormation],
              ['Reputation', `${mgr.reputation}/100`],
            ].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border-soft)', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--txt-secondary)' }}>{l}</span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <div className="placeholder-section">
          <div className="ph-icon">🧑‍💼</div>
          <h3>Staff Management — Coming Soon</h3>
          <p>Assistant managers, coaches, scouts, physios, analysts, and backroom staff hiring/firing will be available in a future update.</p>
        </div>
      </div>
    </div>
  );
}
