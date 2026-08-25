import type { NavSection } from '../../types';
import type { GameState } from '../../types';
import { formatDate } from '../../utils';
import './Sidebar.css';

interface Props {
  active: NavSection;
  onNav: (s: NavSection) => void;
  gameState: GameState;
}

const NAV_ITEMS: { id: NavSection; label: string; icon: string }[] = [
  { id: 'dashboard',  label: 'Dashboard',  icon: '⬛' },
  { id: 'squad',      label: 'Squad',      icon: '👥' },
  { id: 'tactics',    label: 'Tactics',    icon: '🗂️' },
  { id: 'matches',    label: 'Matches',    icon: '⚽' },
  { id: 'transfers',  label: 'Transfers',  icon: '🔄' },
  { id: 'training',   label: 'Training',   icon: '🏃' },
  { id: 'scouting',   label: 'Scouting',   icon: '🔭' },
  { id: 'club',       label: 'Club',       icon: '🏟️' },
  { id: 'finances',   label: 'Finances',   icon: '💰' },
  { id: 'staff',      label: 'Staff',      icon: '🧑‍💼' },
];

export default function Sidebar({ active, onNav, gameState }: Props) {
  const club = gameState.clubs[gameState.playerClubId];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-crest" style={{ background: club?.colors?.primary || '#1a1e29' }}>
          <span>{club?.shortName || 'FC'}</span>
        </div>
        <div className="brand-info">
          <div className="brand-name">{club?.name || 'Your Club'}</div>
          <div className="brand-season">{gameState.season}</div>
        </div>
      </div>

      <div className="sidebar-date">
        <span className="date-label">Current Date</span>
        <span className="date-value">{formatDate(gameState.currentDate)}</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-item${active === item.id ? ' active' : ''}`}
            onClick={() => onNav(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
