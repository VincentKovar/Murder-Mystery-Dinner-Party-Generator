import React, { useState } from 'react';
import { MysteryGame, GameClue } from '../types';
import { soundFX } from '../utils/audio';
import {
  Crown,
  Bell,
  Volume2,
  Clock,
  Utensils,
  MapPin,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  Eye,
  EyeOff,
  Copy,
  Lightbulb,
} from 'lucide-react';

interface HostConsoleProps {
  game: MysteryGame;
  onClueToggle: (clueId: string, revealed: boolean) => void;
  revealedClueIds: string[];
  currentRound: number;
  setCurrentRound: (r: number) => void;
}

export const HostConsole: React.FC<HostConsoleProps> = ({
  game,
  onClueToggle,
  revealedClueIds,
  currentRound,
  setCurrentRound,
}) => {
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  const PHASES = [
    {
      id: 0,
      title: 'Phase 0: Guest Arrival & Dossier Handout',
      course: 'Welcome Drink / Reception',
      script: game.hostGuide.openingScript,
      instructions: [
        'Pour welcome drinks and welcome your dinner guests in character.',
        'Direct each player to the "Suspect Dossiers" tab or hand them their printed character sheet.',
        'Remind everyone: "Keep your Dark Secret hidden at all costs!"',
      ],
    },
    {
      id: 1,
      title: 'Phase 1: Appetizer & The Tragic Discovery',
      course: game.hostGuide.suggestedDinnerMenu[1]?.dish || 'First Course',
      script: game.hostGuide.round1Script,
      instructions: [
        'Serve the first course.',
        'Ring the dinner bell and read the Phase 1 script aloud with dramatic flair!',
        'Reveal the Round 1 physical clues to the dinner table.',
        'Each suspect takes turns declaring where they claim they were when the clock struck.',
      ],
    },
    {
      id: 2,
      title: 'Phase 2: Entrée & Cross-Examinations',
      course: game.hostGuide.suggestedDinnerMenu[2]?.dish || 'Main Course',
      script: game.hostGuide.round2Script,
      instructions: [
        'Serve the main entrée.',
        'Ring the bell and announce that new forensic evidence and puzzle clues have emerged!',
        'Encourage guests to ask each other their Round 2 designated confrontation questions.',
        'Work together or in secret to solve the cipher / riddle clue in the Logic Grid tab.',
      ],
    },
    {
      id: 3,
      title: 'Phase 3: Dessert & Final Accusations',
      course: game.hostGuide.suggestedDinnerMenu[3]?.dish || 'Dessert Course',
      script: game.hostGuide.round3Script,
      instructions: [
        'Serve dessert and coffee/tea.',
        'Read the final confrontation script.',
        'Instruct all players to open the "Ballots & Unmasking" tab (or hand out paper voting slips).',
        'Collect all secret votes: Who is the killer? What was the weapon? What was the motive?',
      ],
    },
    {
      id: 4,
      title: 'Epilogue: The Grand Unmasking & Confession',
      course: 'Digestif & Celebration',
      script: game.hostGuide.conclusionScript,
      instructions: [
        'Call the room to silence. Hit the Gavel button!',
        'Read the official verdict from the Conclusion Script.',
        'Ask the unmasked murderer to stand and deliver their dramatic Confession Monologue from their dossier!',
        'Award honors for "Master Sleuth MVP" and "Most Deceptive Suspect"!',
      ],
    },
  ];

  const currentPhase = PHASES[currentRound] || PHASES[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(id);
    setTimeout(() => setCopiedScript(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-zinc-900 to-zinc-950 border border-amber-800/40 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400">
            <Crown className="w-4 h-4" />
            <span>Master Game Host Console</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
            {game.title}
          </h2>
          <p className="text-sm text-zinc-300">
            {game.setting.dinnerPartyContext}
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-zinc-400">
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-200">
              {game.playerCount} Guests
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-200">
              {game.setting.locationName}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-amber-300 font-mono">
              Victim: {game.victim.name}
            </span>
          </div>
        </div>

        {/* Audio FX & Host Controls */}
        <div className="flex flex-wrap items-center gap-2.5 bg-zinc-950/80 p-3 rounded-xl border border-zinc-800">
          <button
            type="button"
            onClick={() => soundFX.playChime()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-zinc-950 text-xs font-bold transition shadow"
            title="Play parlor bell chime to gather guests' attention"
          >
            <Bell className="w-4 h-4" />
            <span>Ring Dinner Bell</span>
          </button>
          <button
            type="button"
            onClick={() => soundFX.playDramaticSting()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition border border-zinc-700"
            title="Play suspense sting for discovery"
          >
            <Volume2 className="w-4 h-4 text-rose-400" />
            <span>Suspense Sting</span>
          </button>
          <button
            type="button"
            onClick={() => soundFX.playGavel()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition border border-zinc-700"
            title="Strike gavel for verdict"
          >
            <span>⚖️ Gavel</span>
          </button>
        </div>
      </div>

      {/* Dinner Party Timeline Navigation */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Dinner Party Progression</span>
          </span>
          <span className="text-xs text-zinc-400">
            Step {currentRound + 1} of {PHASES.length}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {PHASES.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => {
                setCurrentRound(idx);
                soundFX.playChime();
              }}
              className={`p-3 rounded-xl text-left border transition relative ${
                currentRound === idx
                  ? 'bg-amber-950/60 border-amber-500 text-amber-200 shadow-lg'
                  : currentRound > idx
                  ? 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  : 'bg-zinc-950/30 border-zinc-900 text-zinc-600 hover:border-zinc-800'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span>Phase {idx}</span>
                {currentRound > idx && <Check className="w-3 h-3 text-emerald-400" />}
              </div>
              <div className="text-xs font-bold truncate">
                {idx === 0 && 'Arrival & Briefing'}
                {idx === 1 && 'Course 1 & Crime'}
                {idx === 2 && 'Course 2 & Clues'}
                {idx === 3 && 'Course 3 & Ballots'}
                {idx === 4 && 'The Reveal'}
              </div>
              <div className="text-[10px] text-zinc-400 truncate mt-0.5">
                {p.course}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Phase Host Guide & Script */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Script & Host Instructions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-amber-900/30 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-lg font-serif font-bold text-amber-200">
                  {currentPhase.title}
                </h3>
                <p className="text-xs text-zinc-400">
                  Course accompaniment: <span className="text-zinc-200">{currentPhase.course}</span>
                </p>
              </div>
              <button
                onClick={() => handleCopy(currentPhase.script, `script-${currentRound}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 transition"
              >
                {copiedScript === `script-${currentRound}` ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Copy Script</span>
                  </>
                )}
              </button>
            </div>

            {/* Read Aloud Script Box */}
            <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-5 relative">
              <div className="text-[11px] font-mono uppercase tracking-widest text-amber-400 mb-2 flex items-center gap-2">
                <Volume2 className="w-3.5 h-3.5" />
                <span>Host: Read Aloud to Dinner Guests</span>
              </div>
              <p className="font-serif text-amber-50 text-base sm:text-lg leading-relaxed italic">
                "{currentPhase.script}"
              </p>
            </div>

            {/* Instructions for Host */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Host Action Items for this Phase:
              </h4>
              <ul className="space-y-2 text-xs text-zinc-300">
                {currentPhase.instructions.map((inst, i) => (
                  <li key={i} className="flex items-start gap-2 bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/80">
                    <span className="w-4 h-4 rounded-full bg-amber-950 text-amber-400 text-[10px] font-mono flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{inst}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Phase Forward/Back Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  if (currentRound > 0) setCurrentRound(currentRound - 1);
                }}
                disabled={currentRound === 0}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-xs font-semibold text-zinc-300 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Phase</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (currentRound < PHASES.length - 1) {
                    setCurrentRound(currentRound + 1);
                    soundFX.playChime();
                  }
                }}
                disabled={currentRound === PHASES.length - 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-xs font-bold text-zinc-950 transition shadow"
              >
                <span>Advance to Next Phase</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Clue Distributor Panel */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif font-bold text-amber-200">
                  Clue &amp; Evidence Distributor
                </h3>
                <p className="text-xs text-zinc-400">
                  Toggle which clues are officially revealed to dinner guests on their logic notebooks.
                </p>
              </div>
              <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-800/60">
                {revealedClueIds.length} / {game.clues.length} Revealed
              </span>
            </div>

            <div className="space-y-2.5">
              {game.clues.map((clue: GameClue) => {
                const isRevealed = revealedClueIds.includes(clue.id);
                return (
                  <div
                    key={clue.id}
                    className={`p-3.5 rounded-xl border transition flex items-start justify-between gap-4 ${
                      isRevealed
                        ? 'bg-zinc-950 border-amber-700/60'
                        : 'bg-zinc-950/40 border-zinc-800/80 opacity-70'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-amber-300">
                          Round {clue.round}
                        </span>
                        <span className="text-xs font-bold text-zinc-100">{clue.name}</span>
                        <span className="text-[10px] text-zinc-500 uppercase font-mono">({clue.type})</span>
                      </div>
                      <p className="text-xs text-zinc-300">{clue.description}</p>
                      {clue.puzzleData && (
                        <div className="text-[11px] text-amber-400/90 font-mono flex items-center gap-1 mt-1">
                          <Lightbulb className="w-3 h-3 text-amber-400" />
                          <span>Interactive Puzzle embedded ({clue.puzzleData.puzzleType})</span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onClueToggle(clue.id, !isRevealed)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                        isRevealed
                          ? 'bg-amber-950/70 border border-amber-700 text-amber-200 hover:bg-amber-900/60'
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      {isRevealed ? (
                        <>
                          <Eye className="w-3.5 h-3.5 text-amber-400" />
                          <span>Revealed</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Reveal Clue</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar: Menu Pairings & Floor Plan */}
        <div className="space-y-6">
          {/* Dinner Menu Card */}
          <div className="bg-zinc-900 border border-amber-900/30 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
              <Utensils className="w-4 h-4" />
              <span>Suggested Dinner Menu</span>
            </div>

            <div className="space-y-3 divide-y divide-zinc-800/80">
              {game.hostGuide.suggestedDinnerMenu.map((m, idx) => (
                <div key={idx} className="pt-2.5 first:pt-0">
                  <div className="text-[11px] font-mono text-amber-500 uppercase">
                    {m.course}
                  </div>
                  <div className="text-xs font-bold text-zinc-100 mt-0.5">
                    {m.dish}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5 italic">
                    🍷 Pairing: {m.wineOrDrinkPairing}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decor & Atmosphere Tips */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>Atmosphere &amp; Music Tips</span>
            </div>
            <ul className="space-y-2 text-xs text-zinc-300">
              {game.hostGuide.decorAndMusicTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Floor Plan & Crime Scene Overview */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
              <MapPin className="w-4 h-4" />
              <span>Estate Floor Plan ({game.setting.floorPlan.length} Rooms)</span>
            </div>

            <div className="space-y-2.5">
              {game.setting.floorPlan.map((room, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs">
                  <div className="font-bold text-amber-200">{room.room}</div>
                  <p className="text-[11px] text-zinc-400 mt-1">{room.description}</p>
                  <div className="mt-2 text-[10px] text-zinc-500">
                    <span className="font-semibold text-zinc-400">Key Items: </span>
                    {room.keyItemsFound.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
