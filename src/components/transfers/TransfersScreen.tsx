import type { GameState } from '../../types';
import { abilityColor, formatCurrency, formatWage } from '../../utils';

interface Props { gameState: GameState; onSelectPlayer: (id: string) => void }

export default function TransfersScreen({ gameState, onSelectPlayer }: Props) {
  // Show all players not in player's club, sorted by ability — preview of transfer market
  const myClub = gameState.clubs[gameState.playerClubId];
  const allPlayers = Object.values(gameState.players)
    .filter((p) => p.clubId !== gameState.playerClubId)
    .sort((a, b) => b.currentAbility - a.currentAbility)
    .slice(0, 80);

  return (
    <div style={{ padding: '20px 24px' }}>
      <div className="section-header">
        <h2 className="section-title">Transfers</h2>
        <span className="text-muted text-sm">Transfer Budget: <strong style={{ color: 'var(--accent)' }}>{formatCurrency(myClub?.finances.transferBudget || 0)}</strong></span>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="placeholder-section p-0" style={{ paddingTop: 24, paddingBottom: 20, textAlign: 'left', alignItems: 'flex-start' }}>
            <h3>Transfer Market — Preview</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--txt-secondary)' }}>
              Full transfer negotiation, bidding, contract offers, and player interest system will be available in a future update. Below is a preview of players in the league.
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="mb-12">Available Players (League)</h3>
        <div className="overflow-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th><th>Club</th><th>Pos</th><th>Age</th><th>CA</th><th>PA</th><th>Wage</th>
              </tr>
            </thead>
            <tbody>
              {allPlayers.map((p) => {
                const c = gameState.clubs[p.clubId];
                return (
                  <tr key={p.id} onClick={() => onSelectPlayer(p.id)}>
                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                    <td className="text-sm text-muted">{c?.shortName || '—'}</td>
                    <td><span className="badge badge-pos">{p.position}</span></td>
                    <td>{p.age}</td>
                    <td style={{ fontWeight: 700, color: abilityColor(p.currentAbility) }}>{p.currentAbility}</td>
                    <td style={{ color: abilityColor(p.potentialAbility) }}>{p.potentialAbility}</td>
                    <td className="text-sm">{formatWage(p.contract.wage)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
