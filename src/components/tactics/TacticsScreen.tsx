import type { GameState } from '../../types';

interface Props { gameState: GameState }

export default function TacticsScreen({ gameState }: Props) {
  const club = gameState.clubs[gameState.playerClubId];
  return (
    <div style={{ padding: '20px 24px' }}>
      <div className="section-header">
        <h2 className="section-title">Tactics</h2>
        {club && <span className="text-muted text-sm">Current formation: <strong>{club.manager.preferredFormation}</strong></span>}
      </div>
      <div className="card">
        <div className="placeholder-section">
          <div className="ph-icon">🗂️</div>
          <h3>Tactics Board — Coming Soon</h3>
          <p>
            Formation editor, player positioning, roles, instructions, set pieces,
            and in-match tactical adjustments will be available in a future update.
          </p>
          <p style={{ marginTop: 8 }}>
            The architecture is designed so that tactics will feed directly into the match engine,
            affecting player performance, pressing intensity, and team shape.
          </p>
        </div>
      </div>
    </div>
  );
}
