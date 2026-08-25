import type { UseGameReturn } from '../../store/gameStore';
import { formatDate } from '../../utils';
import './TopBar.css';

interface Props {
  game: UseGameReturn;
}

export default function TopBar({ game }: Props) {
  const { gameState, advanceDay, advanceWeek, saveGame, isSaving } = game;
  if (!gameState) return null;
  const club = gameState.clubs[gameState.playerClubId];

  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="topbar-club">{club?.name}</span>
        <span className="topbar-sep">·</span>
        <span className="topbar-date">{formatDate(gameState.currentDate)}</span>
      </div>

      <div className="topbar-actions">
        <button className="btn-secondary topbar-btn" onClick={advanceDay}>
          +1 Day
        </button>
        <button className="btn-secondary topbar-btn" onClick={advanceWeek}>
          +1 Week
        </button>
        <button className="btn-primary topbar-btn" onClick={saveGame} disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </header>
  );
}
