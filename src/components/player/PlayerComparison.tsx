import type { GameState, Player } from '../../types';
import { abilityColor, abilityLabel, attrColor } from '../../utils';
import { formatValsorian } from '../../utils/calculations';
import './PlayerComparison.css';

interface Props {
  gameState: GameState;
  playerAId: string;
  playerBId: string;
  onClose: () => void;
}

function CompareAttr({ label, a, b }: { label: string; a: number; b: number }) {
  const aBetter = a > b;
  const bBetter = b > a;
  return (
    <div className="cmp-attr-row">
      <span className="cmp-attr-val" style={{ color: attrColor(a), fontWeight: aBetter ? 700 : 400 }}>{a}</span>
      <div className="cmp-attr-bars">
        <div className="cmp-bar-left">
          <div className="bar-fill" style={{ width: `${a}%`, background: aBetter ? 'var(--clr-good)' : 'var(--border)' }} />
        </div>
        <span className="cmp-attr-label">{label}</span>
        <div className="cmp-bar-right">
          <div className="bar-fill" style={{ width: `${b}%`, background: bBetter ? 'var(--clr-good)' : 'var(--border)' }} />
        </div>
      </div>
      <span className="cmp-attr-val" style={{ color: attrColor(b), fontWeight: bBetter ? 700 : 400 }}>{b}</span>
    </div>
  );
}

function PlayerHeader({ player, club }: { player: Player; club?: string }) {
  return (
    <div className="cmp-player-header">
      <div className="cmp-pos-badge">{player.position}</div>
      <div>
        <div className="cmp-player-name">{player.name}</div>
        <div className="text-muted text-sm">{player.nationality} · Age {player.age}</div>
        <div className="text-sm mt-4">{club || 'Free Agent'}</div>
      </div>
      <div className="cmp-ca" style={{ color: abilityColor(player.currentAbility) }}>
        {player.currentAbility}
        <small> {abilityLabel(player.currentAbility)}</small>
      </div>
    </div>
  );
}

export default function PlayerComparison({ gameState, playerAId, playerBId, onClose }: Props) {
  const a = gameState.players[playerAId];
  const b = gameState.players[playerBId];
  if (!a || !b) return null;

  const clubA = gameState.clubs[a.clubId]?.name;
  const clubB = gameState.clubs[b.clubId]?.name;

  const techRows: [string, number, number][] = [
    ['Passing', a.attributes.technical.passing, b.attributes.technical.passing],
    ['First Touch', a.attributes.technical.firstTouch, b.attributes.technical.firstTouch],
    ['Dribbling', a.attributes.technical.dribbling, b.attributes.technical.dribbling],
    ['Finishing', a.attributes.technical.finishing, b.attributes.technical.finishing],
    ['Crossing', a.attributes.technical.crossing, b.attributes.technical.crossing],
    ['Tackling', a.attributes.technical.tackling, b.attributes.technical.tackling],
    ['Marking', a.attributes.technical.marking, b.attributes.technical.marking],
    ['Heading', a.attributes.technical.heading, b.attributes.technical.heading],
    ['Long Shots', a.attributes.technical.longShots, b.attributes.technical.longShots],
    ['Technique', a.attributes.technical.technique, b.attributes.technical.technique],
  ];

  const mentalRows: [string, number, number][] = [
    ['Decisions', a.attributes.mental.decisions, b.attributes.mental.decisions],
    ['Vision', a.attributes.mental.vision, b.attributes.mental.vision],
    ['Composure', a.attributes.mental.composure, b.attributes.mental.composure],
    ['Anticipation', a.attributes.mental.anticipation, b.attributes.mental.anticipation],
    ['Positioning', a.attributes.mental.positioning, b.attributes.mental.positioning],
    ['Work Rate', a.attributes.mental.workRate, b.attributes.mental.workRate],
    ['Teamwork', a.attributes.mental.teamwork, b.attributes.mental.teamwork],
    ['Off the Ball', a.attributes.mental.offTheBall, b.attributes.mental.offTheBall],
  ];

  const physRows: [string, number, number][] = [
    ['Pace', a.attributes.physical.pace, b.attributes.physical.pace],
    ['Acceleration', a.attributes.physical.acceleration, b.attributes.physical.acceleration],
    ['Strength', a.attributes.physical.strength, b.attributes.physical.strength],
    ['Stamina', a.attributes.physical.stamina, b.attributes.physical.stamina],
    ['Agility', a.attributes.physical.agility, b.attributes.physical.agility],
    ['Balance', a.attributes.physical.balance, b.attributes.physical.balance],
    ['Jumping', a.attributes.physical.jumping, b.attributes.physical.jumping],
  ];

  const aWins = (techRows as [string, number, number][]).concat(mentalRows, physRows).filter(([, av, bv]) => av > bv).length;
  const bWins = (techRows as [string, number, number][]).concat(mentalRows, physRows).filter(([, av, bv]) => bv > av).length;

  return (
    <div className="player-comparison">
      <div className="cmp-toolbar">
        <h2>Player Comparison</h2>
        <button className="btn-ghost" onClick={onClose}>✕ Close</button>
      </div>

      {/* Summary header */}
      <div className="cmp-summary-row card mt-12">
        <PlayerHeader player={a} club={clubA} />
        <div className="cmp-vs-block">
          <div className="cmp-wins-label">{aWins}–{bWins}</div>
          <div className="text-muted text-sm">attributes won</div>
          {a.marketValue != null && b.marketValue != null && (
            <div className="cmp-values mt-8">
              <span style={{ color: 'var(--accent)' }}>{formatValsorian(a.marketValue)}</span>
              <span className="text-muted"> vs </span>
              <span style={{ color: 'var(--accent)' }}>{formatValsorian(b.marketValue)}</span>
            </div>
          )}
        </div>
        <PlayerHeader player={b} club={clubB} />
      </div>

      {/* Key stats */}
      <div className="grid-3 gap-12 mt-16">
        {[
          { label: 'Current Ability', aVal: `${a.currentAbility}`, bVal: `${b.currentAbility}`, aNum: a.currentAbility, bNum: b.currentAbility },
          { label: 'Potential', aVal: `${a.potentialAbility}`, bVal: `${b.potentialAbility}`, aNum: a.potentialAbility, bNum: b.potentialAbility },
          { label: 'Age', aVal: `${a.age}`, bVal: `${b.age}`, aNum: b.age, bNum: a.age },
        ].map(({ label, aVal, bVal, aNum, bNum }) => (
          <div key={label} className="stat-tile">
            <div className="stat-tile-label">{label}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: aNum >= bNum ? 'var(--clr-good)' : 'var(--txt-primary)' }}>{aVal}</span>
              <span className="text-muted text-sm">vs</span>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: bNum >= aNum ? 'var(--clr-good)' : 'var(--txt-primary)' }}>{bVal}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Attribute sections */}
      <div className="cmp-attr-section card mt-16">
        <h4 className="mb-12">Technical</h4>
        {techRows.map(([label, av, bv]) => <CompareAttr key={label} label={label} a={av} b={bv} />)}
      </div>
      <div className="cmp-attr-section card mt-12">
        <h4 className="mb-12">Mental</h4>
        {mentalRows.map(([label, av, bv]) => <CompareAttr key={label} label={label} a={av} b={bv} />)}
      </div>
      <div className="cmp-attr-section card mt-12">
        <h4 className="mb-12">Physical</h4>
        {physRows.map(([label, av, bv]) => <CompareAttr key={label} label={label} a={av} b={bv} />)}
      </div>
    </div>
  );
}
