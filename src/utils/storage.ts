import { MysteryGame } from '../types';
import { DEFAULT_MYSTERIES } from '../data/defaultMysteries';

const STORAGE_KEY = 'noir_and_alibi_saved_mysteries';
const ACTIVE_GAME_KEY = 'noir_and_alibi_active_game_id';
const LOGIC_GRID_STATE_KEY = 'noir_and_alibi_grid_state_';

export function getStoredMysteries(): MysteryGame[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Initialize with default mysteries
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MYSTERIES));
      return DEFAULT_MYSTERIES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_MYSTERIES;
    }
    return parsed;
  } catch {
    return DEFAULT_MYSTERIES;
  }
}

export function saveMystery(game: MysteryGame): void {
  try {
    const list = getStoredMysteries();
    const existingIndex = list.findIndex((m) => m.id === game.id);
    if (existingIndex >= 0) {
      list[existingIndex] = game;
    } else {
      list.unshift(game);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save mystery to localStorage', e);
  }
}

export function deleteStoredMystery(id: string): MysteryGame[] {
  try {
    const list = getStoredMysteries();
    const filtered = list.filter((m) => m.id !== id);
    // Don't leave completely empty if possible
    const finalList = filtered.length > 0 ? filtered : DEFAULT_MYSTERIES;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalList));
    return finalList;
  } catch {
    return DEFAULT_MYSTERIES;
  }
}

export function getActiveGameId(): string {
  try {
    return localStorage.getItem(ACTIVE_GAME_KEY) || DEFAULT_MYSTERIES[0].id;
  } catch {
    return DEFAULT_MYSTERIES[0].id;
  }
}

export function setActiveGameId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_GAME_KEY, id);
  } catch (e) {
    console.error('Failed to set active game id', e);
  }
}

// Logic grid checkbox state helper: gameId -> cellKey -> 'empty' | 'yes' | 'no' | 'maybe'
export function getSavedGridState(gameId: string): Record<string, string> {
  try {
    const raw = localStorage.getItem(LOGIC_GRID_STATE_KEY + gameId);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveGridState(gameId: string, state: Record<string, string>): void {
  try {
    localStorage.setItem(LOGIC_GRID_STATE_KEY + gameId, JSON.stringify(state));
  } catch {}
}
