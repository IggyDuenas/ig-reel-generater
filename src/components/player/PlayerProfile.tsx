import { useState } from 'react';
import type { GameState } from '../../types';
import { formatDate, formatWage, contractStatus, abilityLabel, abilityColor, moraleLabel, moraleColor, fitnessColor, attrColor } from '../../utils';
import { formatValsorian } from '../../utils/calculations';
import './PlayerProfile.css';

interface Props {
  gameState: GameState;
  playerId: string;
  onBack: () => void;
}

type Tab = 'overview' | 'attributes' | 'positions' | 'contract' | 'career';

function AttrRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="attr-row">
      <span className="attr-label">{label}</span>
      <div className="attr-bar-wrap">
        <div className="bar-track" style={{ width: '100%' }}>
          <div className="bar-fill" style={{ width: `${value}%`, background: attrColor(value) }} />
        </div>
        <span className="attr-val" style={{ color: attrColor(value) }}>{value}</span>
      </div>
    </div>
  );
}

function AttrGroup({ title, attrs }: { title: string; attrs: [string, number][] }) {
  return (
    <div className="attr-group">
      <h4>{title}</h4>
      <div className="attr-list">
        {attrs.map(([label, value]) => (
          <AttrRow key={label} label={label} value={value} />
        ))}
      </div>
    </div>
  );
}

export default function PlayerProfile({ gameState, playerId, onBack }: Props) {
  const [tab, setTab] = useState<Tab>('overview');
  const player = gameState.players[playerId];
  if (!player) return <div className="placeholder-section"><p>Player not found.</p></div>;

  const club = gameState.clubs[player.clubId];
  const cs = contractStatus(player.contract.expiryDate, gameState.currentDate);
  const { attributes: a } = player;

  const techAttrs: [string, number][] = [
    ['Passing', a.technical.passing],
    ['First Touch', a.technical.firstTouch],
    ['Dribbling', a.technical.dribbling],
    ['Finishing', a.technical.finishing],
    ['Crossing', a.technical.crossing],
    ['Tackling', a.technical.tackling],
    ['Marking', a.technical.marking],
    ['Heading', a.technical.heading],
    ['Long Shots', a.technical.longShots],
    ['Technique', a.technical.technique],
    ['Free Kicks', a.technical.freeKicks],
    ['Corners', a.technical.corners],
    ['Penalties', a.technical.penalties],
  ];

  const mentalAttrs: [string, number][] = [
    ['Decisions', a.mental.decisions],
    ['Vision', a.mental.vision],
    ['Composure', a.mental.composure],
    ['Concentration', a.mental.concentration],
    ['Anticipation', a.mental.anticipation],
    ['Positioning', a.mental.positioning],
    ['Determination', a.mental.determination],
    ['Work Rate', a.mental.workRate],
    ['Teamwork', a.mental.teamwork],
    ['Leadership', a.mental.leadership],
    ['Aggression', a.mental.aggression],
    ['Off the Ball', a.mental.offTheBall],
  ];

  const physAttrs: [string, number][] = [
    ['Pace', a.physical.pace],
    ['Acceleration', a.physical.acceleration],
    ['Strength', a.physical.strength],
    ['Stamina', a.physical.stamina],
    ['Agility', a.physical.agility],
    ['Balance', a.physical.balance],
    ['Jumping', a.physical.jumping],
    ['Natural Fitness', a.physical.naturalFitness],
  ];

  const gkAttrs: [string, number][] = [
    ['Reflexes', a.goalkeeper.reflexes],
    ['Handling', a.goalkeeper.handling],
    ['One-on-Ones', a.goalkeeper.oneOnOnes],
    ['Positioning', a.goalkeeper.gkPositioning],
    ['Aerial Ability', a.goalkeeper.aerialAbility],
    ['Kicking', a.goalkeeper.kicking],
    ['Throwing', a.goalkeeper.throwing],
    ['Communication', a.goalkeeper.communication],
    ['Sweeper Ability', a.goalkeeper.sweeperAbility],
  ];

  return (
    <div className="player-profile">
      <button className="btn-ghost back-btn" onClick={onBack}>← Back to Squad</button>

      {/* Header */}
      <div className="pp-header card mt-12">
        <div className="pp-header-main">
          <div className="pp-pos-badge" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
            {player.position}
          </div>
          <div>
            <h1>{player.name}</h1>
            <div className="pp-sub-info">
              <span>{player.nationality}</span>
              <span className="sep">·</span>
              <span>Age {player.age}</span>
              <span className="sep">·</span>
              <span>{player.height}cm / {player.weight}kg</span>
              <span className="sep">·</span>
              <span>{player.preferredFoot} foot</span>
              {player.isInjured && (
                <><span className="sep">·</span><span style={{ color: 'var(--clr-poor)' }}>🤕 Injured</span></>
              )}
            </div>
          </div>
        </div>
        <div className="pp-header-stats">
          <div className="pp-stat">
            <span className="pp-stat-label">Club</span>
            <span className="pp-stat-val text-accent">{club?.name || 'Free Agent'}</span>
          </div>
          <div className="pp-stat">
            <span className="pp-stat-label">Current Ability</span>
            <span className="pp-stat-val" style={{ color: abilityColor(player.currentAbility) }}>
              {player.currentAbility} <small>({abilityLabel(player.currentAbility)})</small>
            </span>
          </div>
          <div className="pp-stat">
            <span className="pp-stat-label">Potential</span>
            <span className="pp-stat-val" style={{ color: abilityColor(player.potentialAbility) }}>
              {player.potentialAbility}
            </span>
          </div>
          <div className="pp-stat">
            <span className="pp-stat-label">Reputation</span>
            <span className="pp-stat-val">{player.reputation}</span>
          </div>
          {player.marketValue != null && (
            <div className="pp-stat">
              <span className="pp-stat-label">Market Value</span>
              <span className="pp-stat-val text-accent">{formatValsorian(player.marketValue)}</span>
            </div>
          )}
          {player.personality && (
            <div className="pp-stat">
              <span className="pp-stat-label">Personality</span>
              <span className="pp-stat-val">{player.personality}</span>
            </div>
          )}
        </div>
      </div>

      {/* Condition strip */}
      <div className="pp-condition-strip mt-12 grid-3">
        <div className="stat-tile">
          <div className="stat-tile-label">Fitness</div>
          <div className="stat-tile-value" style={{ color: fitnessColor(player.fitness) }}>
            {player.fitness}%
          </div>
          <div className="bar-track" style={{ width: '100%', marginTop: 6 }}>
            <div className="bar-fill" style={{ width: `${player.fitness}%`, background: fitnessColor(player.fitness) }} />
          </div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile-label">Match Sharpness</div>
          <div className="stat-tile-value" style={{ color: fitnessColor(player.matchSharpness) }}>
            {player.matchSharpness}%
          </div>
          <div className="bar-track" style={{ width: '100%', marginTop: 6 }}>
            <div className="bar-fill" style={{ width: `${player.matchSharpness}%`, background: fitnessColor(player.matchSharpness) }} />
          </div>
        </div>
        <div className="stat-tile">
          <div className="stat-tile-label">Morale</div>
          <div className="stat-tile-value" style={{ color: moraleColor(player.morale) }}>
            {moraleLabel(player.morale)}
          </div>
          <div className="bar-track" style={{ width: '100%', marginTop: 6 }}>
            <div className="bar-fill" style={{ width: `${player.morale}%`, background: moraleColor(player.morale) }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-bar mt-16">
        {(['overview','attributes','positions','contract','career'] as Tab[]).map((t) => (
          <button key={t} className={`tab-btn${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
            {t === 'positions' ? 'Positions' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview' && (
        <div className="grid-2 gap-16">
          <div className="card">
            <h3 className="mb-12">Personal Info</h3>
            <div className="info-rows">
              <InfoRow label="Full Name" value={player.name} />
              <InfoRow label="Date of Birth" value={formatDate(player.dateOfBirth)} />
              <InfoRow label="Age" value={`${player.age} years`} />
              <InfoRow label="Nationality" value={player.nationality} />
              <InfoRow label="Height" value={`${player.height} cm`} />
              <InfoRow label="Weight" value={`${player.weight} kg`} />
              <InfoRow label="Preferred Foot" value={player.preferredFoot} />
              {player.personality && <InfoRow label="Personality" value={player.personality} />}
            </div>
          </div>
          <div className="card">
            <h3 className="mb-12">Playing Details</h3>
            <div className="info-rows">
              <InfoRow label="Position" value={player.position} />
              <InfoRow label="Secondary Positions" value={player.secondaryPositions.join(', ') || 'None'} />
              {player.preferences?.preferredRole && <InfoRow label="Preferred Role" value={player.preferences.preferredRole} />}
              <InfoRow label="Squad Status" value={player.contract.squadStatus} />
              <InfoRow label="Current Ability" value={`${player.currentAbility} (${abilityLabel(player.currentAbility)})`} />
              <InfoRow label="Potential Ability" value={`${player.potentialAbility}`} />
              {player.marketValue != null && <InfoRow label="Market Value" value={formatValsorian(player.marketValue)} />}
              <InfoRow label="Club" value={club?.name || 'Free Agent'} />
            </div>
          </div>
        </div>
      )}

      {tab === 'attributes' && (
        <div className="attrs-grid">
          <AttrGroup title="Technical" attrs={techAttrs} />
          <AttrGroup title="Mental" attrs={mentalAttrs} />
          <AttrGroup title="Physical" attrs={physAttrs} />
          {player.position === 'GK' && <AttrGroup title="Goalkeeping" attrs={gkAttrs} />}
        </div>
      )}

      {tab === 'positions' && (
        <div className="card" style={{ maxWidth: 480 }}>
          <h3 className="mb-12">Position Abilities</h3>
          {player.positionAbilities && Object.keys(player.positionAbilities).length > 0 ? (
            <div>
              {(Object.entries(player.positionAbilities) as [string, number][])
                .sort((a, b) => b[1] - a[1])
                .map(([pos, ca]) => (
                  <div key={pos} className="attr-row" style={{ marginBottom: 8 }}>
                    <span className="attr-label" style={{ width: 56, fontWeight: pos === player.position ? 700 : 400, color: pos === player.position ? 'var(--accent)' : undefined }}>{pos}</span>
                    <div className="attr-bar-wrap">
                      <div className="bar-track" style={{ width: '100%' }}>
                        <div className="bar-fill" style={{ width: `${ca}%`, background: abilityColor(ca) }} />
                      </div>
                      <span className="attr-val" style={{ color: abilityColor(ca) }}>{ca}</span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-muted text-sm">Position ability data not available.</p>
          )}
        </div>
      )}

      {tab === 'contract' && (
        <div className="card" style={{ maxWidth: 480 }}>
          <h3 className="mb-12">Contract Details</h3>
          <div className="info-rows">
            <InfoRow label="Club" value={club?.name || 'Free Agent'} />
            <InfoRow label="Weekly Wage" value={formatWage(player.contract.wage)} />
            <InfoRow label="Contract Expiry" value={formatDate(player.contract.expiryDate)} />
            <InfoRow label="Time Remaining" value={cs.label} valueColor={cs.color} />
            <InfoRow label="Squad Status" value={player.contract.squadStatus} />
          </div>
        </div>
      )}

      {tab === 'career' && (
        <div className="flex-col gap-16">
          <div className="card">
            <h3 className="mb-12">Career Statistics</h3>
            {player.careerStats ? (
              <div className="info-rows">
                <InfoRow label="Appearances" value={`${player.careerStats.appearances}`} />
                <InfoRow label="Goals" value={`${player.careerStats.goals}`} />
                <InfoRow label="Assists" value={`${player.careerStats.assists}`} />
                <InfoRow label="Yellow Cards" value={`${player.careerStats.yellowCards}`} />
                <InfoRow label="Red Cards" value={`${player.careerStats.redCards}`} />
                {player.position === 'GK' && (
                  <InfoRow label="Clean Sheets" value={`${player.careerStats.cleanSheets}`} />
                )}
              </div>
            ) : (
              <p className="text-muted text-sm">No career data available.</p>
            )}
          </div>
          {player.careerStats?.history && player.careerStats.history.length > 0 && (
            <div className="card">
              <h3 className="mb-12">Club History</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Club</th>
                    <th>Season</th>
                    <th>Apps</th>
                    <th>Gls</th>
                    <th>Ast</th>
                    <th>Rat</th>
                  </tr>
                </thead>
                <tbody>
                  {player.careerStats.history.map((h, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 500 }}>{h.clubName}</td>
                      <td className="text-muted">{h.seasonStart}/{h.seasonEnd.slice(2)}</td>
                      <td>{h.appearances}</td>
                      <td>{h.goals}</td>
                      <td>{h.assists}</td>
                      <td style={{ color: h.averageRating >= 7 ? 'var(--clr-good)' : h.averageRating >= 6 ? 'var(--clr-avg)' : 'var(--clr-poor)' }}>{h.averageRating.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className="info-value" style={{ color: valueColor }}>{value}</span>
    </div>
  );
}
