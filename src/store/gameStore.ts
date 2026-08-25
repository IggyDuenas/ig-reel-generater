import { useState, useCallback, useEffect } from 'react';
import type { GameState, NavSection } from '../types';
import { buildInitialWorld } from '../data/worldData';

const SAVE_KEY = 'fm_game_save_v3';
const SAVE_VERSION = 3;

// ─── Persistence helpers ──────────────────────────────────────────────────────

export function saveToStorage(state: GameState): void {
  try {
    const data = { ...state, lastSaved: new Date().toISOString() };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Save failed', e);
  }
}

export function loadFromStorage(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as GameState;
    if (data.version !== SAVE_VERSION) return null;
    return data;
  } catch {
    return null;
  }
}

export function clearStorage(): void {
  localStorage.removeItem(SAVE_KEY);
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

function advanceDateBy(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

// ─── Core hook ────────────────────────────────────────────────────────────────

export interface UseGameReturn {
  gameState: GameState | null;
  activeSection: NavSection;
  selectedPlayerId: string | null;
  selectedClubId: string | null;
  isSaving: boolean;
  newGame: (clubId?: string) => void;
  saveGame: () => void;
  loadGame: () => void;
  resetGame: () => void;
  advanceDay: () => void;
  advanceWeek: () => void;
  setActiveSection: (s: NavSection) => void;
  selectPlayer: (id: string | null) => void;
  selectClub: (id: string | null) => void;
  hasSave: boolean;
}

export function useGame(): UseGameReturn {
  const [gameState, setGameState] = useState<GameState | null>(() => loadFromStorage());
  const [activeSection, setActiveSection] = useState<NavSection>('dashboard');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSave, setHasSave] = useState(() => localStorage.getItem(SAVE_KEY) !== null);

  // Auto-save whenever state changes
  useEffect(() => {
    if (gameState) {
      saveToStorage(gameState);
      setHasSave(true);
    }
  }, [gameState]);

  const newGame = useCallback((clubId?: string) => {
    const world = buildInitialWorld(clubId);
    setGameState(world);
    setActiveSection('dashboard');
    setSelectedPlayerId(null);
    setSelectedClubId(null);
  }, []);

  const saveGame = useCallback(() => {
    if (!gameState) return;
    setIsSaving(true);
    saveToStorage(gameState);
    setHasSave(true);
    setTimeout(() => setIsSaving(false), 600);
  }, [gameState]);

  const loadGame = useCallback(() => {
    const saved = loadFromStorage();
    if (saved) {
      setGameState(saved);
      setActiveSection('dashboard');
      setSelectedPlayerId(null);
      setSelectedClubId(null);
    }
  }, []);

  const resetGame = useCallback(() => {
    clearStorage();
    setGameState(null);
    setHasSave(false);
    setActiveSection('dashboard');
    setSelectedPlayerId(null);
    setSelectedClubId(null);
  }, []);

  const advanceDay = useCallback(() => {
    setGameState((prev) => {
      if (!prev) return prev;
      return { ...prev, currentDate: advanceDateBy(prev.currentDate, 1) };
    });
  }, []);

  const advanceWeek = useCallback(() => {
    setGameState((prev) => {
      if (!prev) return prev;
      return { ...prev, currentDate: advanceDateBy(prev.currentDate, 7) };
    });
  }, []);

  const selectPlayer = useCallback((id: string | null) => {
    setSelectedPlayerId(id);
    if (id) setActiveSection('squad');
  }, []);

  const selectClub = useCallback((id: string | null) => {
    setSelectedClubId(id);
    if (id) setActiveSection('club');
  }, []);

  return {
    gameState,
    activeSection,
    selectedPlayerId,
    selectedClubId,
    isSaving,
    newGame,
    saveGame,
    loadGame,
    resetGame,
    advanceDay,
    advanceWeek,
    setActiveSection,
    selectPlayer,
    selectClub,
    hasSave,
  };
}
