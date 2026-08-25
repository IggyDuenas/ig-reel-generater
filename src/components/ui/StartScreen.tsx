import { useState } from 'react';
import type { UseGameReturn } from '../../store/gameStore';
import './StartScreen.css';

const SELECTABLE_CLUBS = [
  { id: 'club_ironvale', name: 'Ironvale FC', reputation: 94, city: 'Ironvale', colors: { primary: '#1a1a2e', secondary: '#e94560' } },
  { id: 'club_solara', name: 'Solara City', reputation: 92, city: 'Solara', colors: { primary: '#0f3460', secondary: '#f5a623' } },
  { id: 'club_redmoor', name: 'Redmoor Athletic', reputation: 82, city: 'Redmoor', colors: { primary: '#8b0000', secondary: '#d4af37' } },
  { id: 'club_velthorn', name: 'Velthorn United', reputation: 78, city: 'Velthorn', colors: { primary: '#1b5e20', secondary: '#ffffff' } },
  { id: 'club_portcrest', name: 'Portcrest Rovers', reputation: 72, city: 'Portcrest', colors: { primary: '#004d7a', secondary: '#00c6fb' } },
  { id: 'club_greyvast', name: 'Greyvast Town', reputation: 65, city: 'Greyvast', colors: { primary: '#424242', secondary: '#9e9e9e' } },
  { id: 'club_dunmore', name: 'Dunmore City', reputation: 60, city: 'Dunmore', colors: { primary: '#4a148c', secondary: '#ce93d8' } },
  { id: 'club_fastbridge', name: 'Fastbridge FC', reputation: 54, city: 'Fastbridge', colors: { primary: '#bf360c', secondary: '#ffccbc' } },
  { id: 'club_grenzburg', name: 'Grenzburg Athletic', reputation: 46, city: 'Grenzburg', colors: { primary: '#006064', secondary: '#80deea' } },
  { id: 'club_astorias', name: 'Astorias SC', reputation: 40, city: 'Astorias', colors: { primary: '#33691e', secondary: '#ccff90' } },
];

function StarBar({ rep }: { rep: number }) {
  const stars = Math.round(rep / 20);
  return (
    <span>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < stars ? '#f5c842' : '#2a3048' }}>★</span>
      ))}
    </span>
  );
}

interface Props { game: UseGameReturn }

export default function StartScreen({ game }: Props) {
  const [selectedClub, setSelectedClub] = useState<string>('club_redmoor');
  const [view, setView] = useState<'main' | 'newgame'>('main');

  if (view === 'newgame') {
    return (
      <div className="start-screen">
        <div className="start-inner">
          <h1 className="start-title">Choose Your Club</h1>
          <p className="start-sub">Select the club you want to manage in the Valsoria Premier League</p>

          <div className="club-grid">
            {SELECTABLE_CLUBS.map((c) => (
              <button
                key={c.id}
                className={`club-card${selectedClub === c.id ? ' selected' : ''}`}
                onClick={() => setSelectedClub(c.id)}
              >
                <div className="club-card-crest" style={{ background: c.colors.primary, border: `2px solid ${c.colors.secondary}` }}>
                  {c.name.split(' ').map(w => w[0]).join('').slice(0, 3)}
                </div>
                <div className="club-card-name">{c.name}</div>
                <div className="club-card-city">{c.city}</div>
                <StarBar rep={c.reputation} />
              </button>
            ))}
          </div>

          <div className="start-actions">
            <button className="btn-secondary" onClick={() => setView('main')}>← Back</button>
            <button
              className="btn-primary"
              style={{ padding: '12px 36px', fontSize: '1rem' }}
              onClick={() => game.newGame(selectedClub)}
            >
              Start Season →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="start-screen">
      <div className="start-inner">
        <div className="start-logo">⚽</div>
        <h1 className="start-title">Football Manager</h1>
        <h2 className="start-league">Valsoria Premier League · 2025/26</h2>
        <p className="start-sub">
          Take control of a club in the fictional Valsoria Premier League. Build your squad, set tactics, and lead your team to glory.
        </p>

        <div className="start-actions" style={{ flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <button
            className="btn-primary start-main-btn"
            onClick={() => setView('newgame')}
          >
            New Game
          </button>
          {game.hasSave && (
            <button className="btn-secondary start-main-btn" onClick={game.loadGame}>
              Continue Game
            </button>
          )}
          {game.hasSave && (
            <button className="btn-ghost" onClick={() => {
              if (window.confirm('Reset all saved data and start fresh?')) game.resetGame();
            }}>
              Reset All Data
            </button>
          )}
        </div>

        <div className="start-credits">
          A browser-based football management simulation
        </div>
      </div>
    </div>
  );
}
