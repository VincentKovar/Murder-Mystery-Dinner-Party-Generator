import React, { useState, useEffect } from 'react';
import { MysteryGame, GameClue } from '../types';
import { getSavedGridState, saveGridState } from '../utils/storage';
import { soundFX } from '../utils/audio';
import {
  Grid3X3,
  Clock,
  Key,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Search,
  RotateCcw,
  Sparkles,
  Unlock,
  AlertCircle,
} from 'lucide-react';

interface LogicNotebookProps {
  game: MysteryGame;
  revealedClueIds: string[];
}

export const LogicNotebook: React.FC<LogicNotebookProps> = ({ game, revealedClueIds }) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'timeline' | 'clues'>('matrix');
  const [gridState, setGridState] = useState<Record<string, string>>({});
  const [puzzleAnswers, setPuzzleAnswers] = useState<Record<string, string>>({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});
  const [solvedPuzzles, setSolvedPuzzles] = useState<Record<string, boolean>>({});

  // Load saved grid state for this game
  useEffect(() => {
    setGridState(getSavedGridState(game.id));
  }, [game.id]);

  // Toggle cell state: '' -> 'yes' -> 'no' -> 'maybe' -> ''
  const handleCellClick = (cellKey: string) => {
    const current = gridState[cellKey] || '';
    let next = '';
    if (current === '') next = 'yes';
    else if (current === 'yes') next = 'no';
    else if (current === 'no') next = 'maybe';
    else next = '';

    const updated = { ...gridState, [cellKey]: next };
    setGridState(updated);
    saveGridState(game.id, updated);
  };

  const handleResetGrid = () => {
    if (confirm('Clear all checkmarks and deductive notes on this logic grid?')) {
      setGridState({});
      saveGridState(game.id, {});
    }
  };

  const handleCheckPuzzleAnswer = (clueId: string, expectedSolution: string) => {
    const userAttempt = (puzzleAnswers[clueId] || '').trim().toLowerCase();
    const cleanExpected = expectedSolution.trim().toLowerCase();

    if (userAttempt === cleanExpected || userAttempt.includes(cleanExpected) || cleanExpected.includes(userAttempt)) {
      soundFX.playUnlockSuccess();
      setSolvedPuzzles({ ...solvedPuzzles, [clueId]: true });
    } else {
      alert('That does not match the cipher or puzzle solution yet. Keep examining the clues or check the hint!');
    }
  };

  const visibleClues = game.clues.filter((c) => revealedClueIds.includes(c.id));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Subnav Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-100 flex items-center gap-2">
            <Search className="w-5 h-5 text-amber-400" />
            <span>Detective Notebook &amp; Logic Matrix</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Cross-reference timestamps, eliminate false alibis, and solve embedded ciphers.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-800/80">
          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'matrix'
                ? 'bg-amber-600 text-zinc-950'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            <span>Deduction Matrix</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'timeline'
                ? 'bg-amber-600 text-zinc-950'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Timeline Tracker</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('clues')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'clues'
                ? 'bg-amber-600 text-zinc-950'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Clues &amp; Ciphers ({visibleClues.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DEDUCTION LOGIC MATRIX */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-amber-900/30 rounded-2xl p-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-zinc-800">
              <div>
                <h3 className="text-base font-serif font-bold text-amber-200">
                  Interactive Elimination Grid
                </h3>
                <p className="text-xs text-zinc-400">
                  Click any cell to mark: <span className="text-emerald-400 font-bold">✓ (Match)</span>, <span className="text-rose-400 font-bold">✗ (Eliminated)</span>, or <span className="text-amber-400 font-bold">? (Suspicious)</span>.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetGrid}
                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded bg-zinc-950 border border-zinc-800 transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Grid</span>
              </button>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto pb-2">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-950 text-zinc-400 font-mono text-[11px]">
                    <th className="p-3 text-left border border-zinc-800">Suspect Name</th>
                    {game.setting.floorPlan.map((r, i) => (
                      <th key={i} className="p-3 text-center border border-zinc-800 min-w-[90px]">
                        {r.room.replace(/\(.*?\)/g, '')}
                      </th>
                    ))}
                    {game.logicGrid.timeSlots.map((t, i) => (
                      <th key={i} className="p-3 text-center border border-zinc-800 min-w-[95px] text-amber-400/90">
                        {t.split(' ')[0]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {game.characters.map((char) => (
                    <tr key={char.id} className="hover:bg-zinc-800/40 transition">
                      <td className="p-3 border border-zinc-800 font-semibold text-zinc-200 bg-zinc-950/80">
                        <div className="font-bold">{char.name}</div>
                        <div className="text-[10px] text-zinc-500 font-normal">{char.archetype}</div>
                      </td>

                      {/* Rooms checkboxes */}
                      {game.setting.floorPlan.map((room, rIdx) => {
                        const cellKey = `${char.id}_room_${rIdx}`;
                        const val = gridState[cellKey];
                        return (
                          <td
                            key={rIdx}
                            onClick={() => handleCellClick(cellKey)}
                            className="p-3 border border-zinc-800 text-center cursor-pointer hover:bg-zinc-800/80 transition"
                          >
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded">
                              {val === 'yes' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                              {val === 'no' && <XCircle className="w-5 h-5 text-rose-500" />}
                              {val === 'maybe' && <AlertCircle className="w-5 h-5 text-amber-400" />}
                              {!val && <span className="text-zinc-700 hover:text-zinc-500">•</span>}
                            </span>
                          </td>
                        );
                      })}

                      {/* Time Slots checkboxes */}
                      {game.logicGrid.timeSlots.map((slot, tIdx) => {
                        const cellKey = `${char.id}_time_${tIdx}`;
                        const val = gridState[cellKey];
                        return (
                          <td
                            key={tIdx}
                            onClick={() => handleCellClick(cellKey)}
                            className="p-3 border border-zinc-800 text-center cursor-pointer hover:bg-zinc-800/80 transition"
                          >
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded">
                              {val === 'yes' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                              {val === 'no' && <XCircle className="w-5 h-5 text-rose-500" />}
                              {val === 'maybe' && <AlertCircle className="w-5 h-5 text-amber-400" />}
                              {!val && <span className="text-zinc-700 hover:text-zinc-500">•</span>}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Deduction Rules Summary Box */}
            <div className="mt-6 pt-5 border-t border-zinc-800 space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Known Deductive Rules &amp; Elimination Leads</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {game.logicGrid.deductionRules.map((rule, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1 text-xs">
                    <div className="font-mono text-amber-500 text-[11px] font-bold">
                      {rule.clueRef}
                    </div>
                    <p className="text-zinc-200">{rule.statement}</p>
                    {rule.eliminatesSuspectName && (
                      <div className="text-[11px] text-rose-400 font-semibold pt-1 border-t border-zinc-800/60 mt-1">
                        → Eliminates: {rule.eliminatesSuspectName}
                      </div>
                    )}
                    <div className="text-[10px] text-zinc-400 italic">
                      Reason: {rule.reason}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TIMELINE TRACKER */}
      {activeTab === 'timeline' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-serif font-bold text-amber-200">
              Evening Timeline Reconstruction
            </h3>
            <p className="text-xs text-zinc-400">
              Corroborated movements have two or more witnesses; uncorroborated windows represent potential criminal opportunities.
            </p>
          </div>

          <div className="relative border-l-2 border-amber-900/40 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-6">
            {game.logicGrid.timelineEvents.map((ev, i) => (
              <div key={i} className="relative group">
                {/* Node marker */}
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 ${
                    ev.isCorroborated
                      ? 'bg-emerald-950 border-emerald-500'
                      : 'bg-rose-950 border-rose-500 animate-pulse'
                  }`}
                />

                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-1.5 text-xs shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-amber-400 text-xs font-bold">
                      {ev.time} — {ev.location}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        ev.isCorroborated
                          ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                          : 'bg-rose-950/70 text-rose-300 border border-rose-800/60'
                      }`}
                    >
                      {ev.isCorroborated ? 'Corroborated by Witness' : '⚠️ Unverified Opportunity'}
                    </span>
                  </div>

                  <div className="text-zinc-200 font-medium">
                    <span className="text-amber-200 font-semibold">{ev.suspectName}: </span>
                    {ev.action}
                  </div>

                  {ev.corroboratedBy && (
                    <div className="text-[11px] text-zinc-400 italic">
                      Witness: {ev.corroboratedBy}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CLUES & CIPHERS */}
      {activeTab === 'clues' && (
        <div className="space-y-6">
          {visibleClues.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center space-y-3">
              <Key className="w-10 h-10 text-zinc-600 mx-auto" />
              <h3 className="text-base font-serif font-bold text-zinc-300">
                No Clues Revealed Yet
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                The Game Host reveals clues as each dinner course begins. Switch to the Host Console to drop Round 1 clues!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visibleClues.map((clue: GameClue) => {
                const isSolved = solvedPuzzles[clue.id];
                const hintVisible = showHint[clue.id];

                return (
                  <div
                    key={clue.id}
                    className="bg-zinc-900 border border-amber-900/40 rounded-2xl p-5 space-y-3 shadow-lg flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-amber-300">
                          Round {clue.round} Clue
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">
                          {clue.type}
                        </span>
                      </div>

                      <h4 className="text-base font-serif font-bold text-amber-100">
                        {clue.name}
                      </h4>

                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {clue.description}
                      </p>

                      <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800/80 text-[11px] font-serif italic text-amber-200/90">
                        {clue.flavorText}
                      </div>

                      <div className="text-[10px] text-zinc-500">
                        <span className="text-zinc-400 font-semibold">Found by: </span>
                        {clue.whoDiscoveredOrFound}
                      </div>
                    </div>

                    {/* Interactive Puzzle Box if clue contains cipher/riddle */}
                    {clue.puzzleData && (
                      <div className="pt-3 border-t border-zinc-800/80 space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono text-amber-400 font-bold">
                          <span className="flex items-center gap-1.5">
                            <Lightbulb className="w-3.5 h-3.5" />
                            <span>Interactive Challenge: {clue.puzzleData.puzzleType}</span>
                          </span>
                          {isSolved && (
                            <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
                              <Unlock className="w-3 h-3" />
                              <span>Solved!</span>
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-mono bg-zinc-950 p-2.5 rounded border border-zinc-800 text-amber-100">
                          {clue.puzzleData.puzzlePrompt}
                        </p>

                        {!isSolved ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={puzzleAnswers[clue.id] || ''}
                                onChange={(e) =>
                                  setPuzzleAnswers({ ...puzzleAnswers, [clue.id]: e.target.value })
                                }
                                placeholder="Enter solved code or word..."
                                className="flex-1 px-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded text-xs text-zinc-100 uppercase font-mono"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleCheckPuzzleAnswer(clue.id, clue.puzzleData!.solution)
                                }
                                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold text-xs rounded transition"
                              >
                                Solve
                              </button>
                            </div>

                            <div className="flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() =>
                                  setShowHint({ ...showHint, [clue.id]: !hintVisible })
                                }
                                className="text-[10px] text-amber-500 hover:underline flex items-center gap-1"
                              >
                                <HelpCircle className="w-3 h-3" />
                                <span>{hintVisible ? 'Hide Hint' : 'Need a Hint?'}</span>
                              </button>
                            </div>

                            {hintVisible && (
                              <div className="text-[11px] text-zinc-400 bg-zinc-950/80 p-2 rounded border border-zinc-800 italic">
                                💡 Hint: {clue.puzzleData.hint}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-700/60 text-xs text-emerald-200 space-y-1">
                            <div className="font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Decrypted Fact Revealed:</span>
                            </div>
                            <p className="text-[11px] leading-relaxed">
                              {clue.puzzleData.revealedFact}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
