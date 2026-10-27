import React from 'react';
import { MysteryGame } from '../types';
import {
  Sparkles,
  Crown,
  Users,
  Grid3X3,
  Vote,
  Printer,
  ChevronDown,
  Trash2,
  BookOpen,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'generator' | 'host' | 'characters' | 'logic' | 'verdict' | 'print';
  setActiveTab: (tab: 'generator' | 'host' | 'characters' | 'logic' | 'verdict' | 'print') => void;
  games: MysteryGame[];
  activeGame: MysteryGame;
  onSelectGame: (game: MysteryGame) => void;
  onDeleteGame: (id: string) => void;
  onOpenCreate: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  games,
  activeGame,
  onSelectGame,
  onDeleteGame,
  onOpenCreate,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'novice':
        return <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">Novice</span>;
      case 'detective':
        return <span className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono">Detective</span>;
      case 'master':
        return <span className="text-xs px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-mono font-semibold">Master Sleuth</span>;
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur border-b border-amber-900/30 text-amber-50">
      {/* Upper bar: Brand & Active Game Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600 via-amber-800 to-amber-950 flex items-center justify-center border border-amber-500/40 shadow-lg shadow-amber-950/50">
            <span className="text-xl font-serif font-black tracking-wider text-amber-200">NA</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-serif font-bold tracking-wide bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 bg-clip-text text-transparent">
                Noir &amp; Alibi
              </h1>
              <span className="hidden sm:inline-block text-[11px] uppercase tracking-widest text-amber-500 font-mono">
                Murder Mystery Dinner Kit
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              Logic Puzzle Dinner Parties for 4–6 Players
            </p>
          </div>
        </div>

        {/* Game selector & New Game Button */}
        <div className="flex items-center gap-2 relative">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-amber-900/40 text-xs text-amber-100 transition shadow-sm"
              title="Switch Current Mystery Game"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <div className="text-left max-w-[130px] sm:max-w-[200px] truncate">
                <span className="font-semibold block truncate">{activeGame.title}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-72 sm:w-80 bg-zinc-900 border border-amber-700/40 rounded-xl shadow-2xl py-2 z-50">
                <div className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-amber-500 border-b border-zinc-800 flex justify-between items-center">
                  <span>Available Mysteries ({games.length})</span>
                  <span>{activeGame.playerCount} Players</span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-zinc-800/60">
                  {games.map((g) => (
                    <div
                      key={g.id}
                      className={`flex items-center justify-between px-3 py-2 text-xs hover:bg-zinc-800/80 transition cursor-pointer ${
                        g.id === activeGame.id ? 'bg-amber-950/40 text-amber-200' : 'text-zinc-300'
                      }`}
                      onClick={() => {
                        onSelectGame(g);
                        setDropdownOpen(false);
                      }}
                    >
                      <div className="truncate pr-2">
                        <div className="font-semibold truncate">{g.title}</div>
                        <div className="text-[10px] text-zinc-400 flex items-center gap-2 mt-0.5">
                          <span>{g.playerCount} Players</span>
                          <span>•</span>
                          <span>{g.setting.era}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {getDifficultyBadge(g.difficulty)}
                        {games.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteGame(g.id);
                            }}
                            className="p-1 hover:text-red-400 text-zinc-500 transition"
                            title="Delete custom game"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onOpenCreate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-zinc-950 text-xs font-bold transition shadow-md shadow-amber-950/40 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Craft New Game</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 flex overflow-x-auto no-scrollbar border-t border-zinc-800/80">
        <button
          onClick={() => setActiveTab('host')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition ${
            activeTab === 'host'
              ? 'border-amber-400 text-amber-300 bg-amber-950/20'
              : 'border-transparent text-zinc-400 hover:text-amber-100 hover:border-zinc-700'
          }`}
        >
          <Crown className="w-4 h-4 text-amber-400" />
          <span>Host Console</span>
        </button>

        <button
          onClick={() => setActiveTab('characters')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition ${
            activeTab === 'characters'
              ? 'border-amber-400 text-amber-300 bg-amber-950/20'
              : 'border-transparent text-zinc-400 hover:text-amber-100 hover:border-zinc-700'
          }`}
        >
          <Users className="w-4 h-4 text-sky-400" />
          <span>Suspect Dossiers</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-800 text-zinc-400">
            {activeGame.characters.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('logic')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition ${
            activeTab === 'logic'
              ? 'border-amber-400 text-amber-300 bg-amber-950/20'
              : 'border-transparent text-zinc-400 hover:text-amber-100 hover:border-zinc-700'
          }`}
        >
          <Grid3X3 className="w-4 h-4 text-emerald-400" />
          <span>Logic Grid &amp; Clues</span>
        </button>

        <button
          onClick={() => setActiveTab('verdict')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition ${
            activeTab === 'verdict'
              ? 'border-amber-400 text-amber-300 bg-amber-950/20'
              : 'border-transparent text-zinc-400 hover:text-amber-100 hover:border-zinc-700'
          }`}
        >
          <Vote className="w-4 h-4 text-rose-400" />
          <span>Ballots &amp; Unmasking</span>
        </button>

        <button
          onClick={() => setActiveTab('print')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition ${
            activeTab === 'print'
              ? 'border-amber-400 text-amber-300 bg-amber-950/20'
              : 'border-transparent text-zinc-400 hover:text-amber-100 hover:border-zinc-700'
          }`}
        >
          <Printer className="w-4 h-4 text-violet-400" />
          <span>Print Party Kit</span>
        </button>

        <button
          onClick={() => setActiveTab('generator')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition ${
            activeTab === 'generator'
              ? 'border-amber-400 text-amber-300 bg-amber-950/20'
              : 'border-transparent text-zinc-400 hover:text-amber-100 hover:border-zinc-700'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Generator Studio</span>
        </button>
      </div>
    </header>
  );
};
