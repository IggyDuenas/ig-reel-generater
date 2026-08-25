import { useState } from 'react';
import { useGame } from './store/gameStore';
import StartScreen from './components/ui/StartScreen';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import Dashboard from './components/dashboard/Dashboard';
import SquadScreen from './components/squad/SquadScreen';
import PlayerProfile from './components/player/PlayerProfile';
import PlayerComparison from './components/player/PlayerComparison';
import ClubScreen from './components/club/ClubScreen';
import MatchesScreen from './components/matches/MatchesScreen';
import TransfersScreen from './components/transfers/TransfersScreen';
import TacticsScreen from './components/tactics/TacticsScreen';
import TrainingScreen from './components/training/TrainingScreen';
import ScoutingScreen from './components/scouting/ScoutingScreen';
import FinancesScreen from './components/finances/FinancesScreen';
import StaffScreen from './components/staff/StaffScreen';
import './App.css';

export default function App() {
  const game = useGame();
  const { gameState, activeSection, selectedPlayerId, selectedClubId, setActiveSection, selectPlayer, selectClub } = game;
  const [comparePlayerId, setComparePlayerId] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  if (!gameState) {
    return <StartScreen game={game} />;
  }

  function handleSelectPlayer(id: string) {
    selectPlayer(id);
    setShowComparison(false);
  }

  function handleComparePlayer(id: string) {
    if (comparePlayerId && comparePlayerId !== id) {
      // Second player selected — show comparison
      selectPlayer(id);
      setShowComparison(true);
    } else {
      setComparePlayerId(id === comparePlayerId ? null : id);
      setShowComparison(false);
    }
  }

  function handleSelectClub(id: string) {
    selectClub(id);
    setActiveSection('club');
  }

  function renderSection() {
    // Squad section: comparison > profile > list
    if (activeSection === 'squad' && showComparison && comparePlayerId && selectedPlayerId) {
      return (
        <PlayerComparison
          gameState={gameState!}
          playerAId={comparePlayerId}
          playerBId={selectedPlayerId}
          onClose={() => { setShowComparison(false); setComparePlayerId(null); selectPlayer(null); }}
        />
      );
    }

    if (activeSection === 'squad' && selectedPlayerId && !showComparison) {
      return (
        <PlayerProfile
          gameState={gameState!}
          playerId={selectedPlayerId}
          onBack={() => selectPlayer(null)}
        />
      );
    }

    switch (activeSection) {
      case 'dashboard':
        return (
          <Dashboard
            gameState={gameState!}
            onSelectPlayer={handleSelectPlayer}
            onSelectClub={handleSelectClub}
          />
        );
      case 'squad':
        return (
          <SquadScreen
            gameState={gameState!}
            onSelectPlayer={handleSelectPlayer}
            selectedPlayerId={selectedPlayerId}
            comparePlayerId={comparePlayerId}
            onCompare={handleComparePlayer}
          />
        );
      case 'tactics':
        return <TacticsScreen gameState={gameState!} />;
      case 'matches':
        return <MatchesScreen gameState={gameState!} />;
      case 'transfers':
        return <TransfersScreen gameState={gameState!} onSelectPlayer={handleSelectPlayer} />;
      case 'training':
        return <TrainingScreen />;
      case 'scouting':
        return <ScoutingScreen />;
      case 'club':
        return (
          <ClubScreen
            gameState={gameState!}
            clubId={selectedClubId}
            onSelectPlayer={handleSelectPlayer}
          />
        );
      case 'finances':
        return <FinancesScreen gameState={gameState!} />;
      case 'staff':
        return <StaffScreen gameState={gameState!} />;
      default:
        return null;
    }
  }

  return (
    <div className="app-shell">
      <Sidebar active={activeSection} onNav={setActiveSection} gameState={gameState} />
      <div className="app-main">
        <TopBar game={game} />
        <main className="app-content">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
