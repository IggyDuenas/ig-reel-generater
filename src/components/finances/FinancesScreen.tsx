import type { GameState } from '../../types';
import { formatCurrency, formatWage } from '../../utils';

interface Props { gameState: GameState }

export default function FinancesScreen({ gameState }: Props) {
  const club = gameState.clubs[gameState.playerClubId];
  if (!club) return null;
  const { finances } = club;
  const players = club.playerIds.map((id) => gameState.players[id]).filter(Boolean);
  const sortedByWage = [...players].sort((a, b) => b.contract.wage - a.contract.wage);
  const totalWage = players.reduce((s, p) => s + p.contract.wage, 0);

  return (
    <div style={{ padding: '20px 24px' }}>
      <div className="section-header">
        <h2 className="section-title">Finances</h2>
      </div>

      <div className="grid-4 mb-16">
        <div className="stat-tile">
          <div className="stat-tile-label">Club Balance</div>
          <div className="stat-tile-value" style={{ color: 'var(--clr-good)' }}>{formatCurrency(finances.balance)}</div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile-label">Transfer Budget</div>
          <div className="stat-tile-value">{formatCurrency(finances.transferBudget)}</div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile-label">Wage Budget</div>
          <div className="stat-tile-value">{formatWage(finances.wageBudget)}</div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile-label">Weekly Wages</div>
          <div className="stat-tile-value" style={{ color: totalWage > finances.wageBudget ? 'var(--clr-poor)' : undefined }}>
            {formatWage(totalWage)}
          </div>
          <div className="stat-tile-sub">
            {Math.round((totalWage / finances.wageBudget) * 100)}% of budget
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 16 }}>
        <div className="card">
          <h3 className="mb-12">Wage Bill — Top Earners</h3>
          <table className="data-table">
            <thead>
              <tr><th>Player</th><th>Position</th><th>Weekly Wage</th><th>Status</th></tr>
            </thead>
            <tbody>
              {sortedByWage.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 500 }}>{p.name}</td>
                  <td><span className="badge badge-pos">{p.position}</span></td>
                  <td style={{ fontWeight: 600 }}>{formatWage(p.contract.wage)}</td>
                  <td className="text-sm text-muted">{p.contract.squadStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="placeholder-section p-0" style={{ paddingTop: 40, paddingBottom: 40 }}>
            <div className="ph-icon">📊</div>
            <h3>Financial Reports</h3>
            <p>Season revenue breakdowns, transfer income/expenditure, prize money, and financial forecasts will be available in a future update.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
