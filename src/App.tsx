import React, { useState, useEffect } from 'react';
import { MysteryGame } from './types';
import {
  getStoredMysteries,
  saveMystery,
  deleteStoredMystery,
  getActiveGameId,
  setActiveGameId,
} from './utils/storage';
import { DEFAULT_MYSTERIES } from './data/defaultMysteries';
import { Navbar } from './components/Navbar';
import { HostConsole } from './components/HostConsole';
import { PlayerPortal } from './components/PlayerPortal';
import { LogicNotebook } from './components/LogicNotebook';
import { BallotAndVerdict } from './components/BallotAndVerdict';
import { PrintKit } from './components/PrintKit';
import { GeneratorView } from './components/GeneratorView';
import { soundFX } from './utils/audio';
import {
  Sparkles,
  Crown,
  Users,
  Grid3X3,
  Vote,
  Printer,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

export default function App() {
  const [games, setGames] = useState<MysteryGame[]>(() => getStoredMysteries());
  const [activeGameId, setActiveId] = useState<string>(() => getActiveGameId());
  const [activeTab, setActiveTab] = useState<'generator' | 'host' | 'characters' | 'logic' | 'verdict' | 'print'>('host');
  const [currentRound, setCurrentRound] = useState<number>(0);

  // Active game reference
  const activeGame = games.find((g) => g.id === activeGameId) || games[0] || DEFAULT_MYSTERIES[0];

  // Track revealed clues per game (default: round 1 clues visible)
  const [revealedClueIds, setRevealedClueIds] = useState<string[]>(() => {
    return activeGame.clues.filter((c) => c.round === 1).map((c) => c.id);
  });

  // When active game changes, update revealed clues to default round 1
  useEffect(() => {
    setActiveGameId(activeGame.id);
    setRevealedClueIds(activeGame.clues.filter((c) => c.round === 1).map((c) => c.id));
    setCurrentRound(0);
  }, [activeGame.id]);

  const handleSelectGame = (game: MysteryGame) => {
    setActiveId(game.id);
  };

  const handleDeleteGame = (id: string) => {
    const updated = deleteStoredMystery(id);
    setGames(updated);
    if (activeGameId === id) {
      setActiveId(updated[0]?.id || DEFAULT_MYSTERIES[0].id);
    }
  };

  const handleGameCreated = (newGame: MysteryGame) => {
    saveMystery(newGame);
    setGames(getStoredMysteries());
    setActiveId(newGame.id);
    setActiveTab('host');
    setCurrentRound(0);
  };

  const handleClueToggle = (clueId: string, revealed: boolean) => {
    if (revealed) {
      soundFX.playDramaticSting();
      setRevealedClueIds((prev) => [...prev, clueId]);
    } else {
      setRevealedClueIds((prev) => prev.filter((id) => id !== clueId));
    }
  };

  const handleImportGame = (importedGame: MysteryGame) => {
    saveMystery(importedGame);
    setGames(getStoredMysteries());
    setActiveId(importedGame.id);
    setActiveTab('host');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-zinc-950">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        games={games}
        activeGame={activeGame}
        onSelectGame={handleSelectGame}
        onDeleteGame={handleDeleteGame}
        onOpenCreate={() => setActiveTab('generator')}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'host' && (
          <HostConsole
            game={activeGame}
            revealedClueIds={revealedClueIds}
            onClueToggle={handleClueToggle}
            currentRound={currentRound}
            setCurrentRound={setCurrentRound}
          />
        )}

        {activeTab === 'characters' && (
          <PlayerPortal game={activeGame} />
        )}

        {activeTab === 'logic' && (
          <LogicNotebook
            game={activeGame}
            revealedClueIds={revealedClueIds}
          />
        )}

        {activeTab === 'verdict' && (
          <BallotAndVerdict game={activeGame} />
        )}

        {activeTab === 'print' && (
          <PrintKit
            game={activeGame}
            onImportGame={handleImportGame}
          />
        )}

        {activeTab === 'generator' && (
          <GeneratorView
            onGameCreated={handleGameCreated}
            onCancel={() => setActiveTab('host')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 px-4 text-center text-xs text-zinc-500 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-amber-400">Noir &amp; Alibi</span>
            <span>—</span>
            <span>Playable Murder Mystery Dinner Party Game Generator for 4–6 Players</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>Airtight Logic Grids</span>
            <span>•</span>
            <span>Suspect Dossiers</span>
            <span>•</span>
            <span>Interactive Clue Ciphers</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
