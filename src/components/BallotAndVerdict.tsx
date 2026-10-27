import React, { useState } from 'react';
import { MysteryGame, AccusationSubmission, SuspectCharacter } from '../types';
import { soundFX } from '../utils/audio';
import {
  Vote,
  Skull,
  Trophy,
  CheckCircle,
  XCircle,
  HelpCircle,
  Award,
  Sparkles,
  Lock,
  Unlock,
  Volume2,
} from 'lucide-react';

interface BallotAndVerdictProps {
  game: MysteryGame;
}

export const BallotAndVerdict: React.FC<BallotAndVerdictProps> = ({ game }) => {
  const [ballots, setBallots] = useState<AccusationSubmission[]>([]);
  const [voterName, setVoterName] = useState<string>('');
  const [selectedSuspect, setSelectedSuspect] = useState<string>('');
  const [weaponTheory, setWeaponTheory] = useState<string>('');
  const [motiveTheory, setMotiveTheory] = useState<string>('');
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  const murderer = game.characters.find((c) => c.isMurderer) || game.characters[0];

  const handleSubmitBallot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voterName || !selectedSuspect) {
      alert('Please enter your name and select the suspect you are accusing.');
      return;
    }

    const isCorrect = selectedSuspect === murderer.name;
    const newSubmission: AccusationSubmission = {
      playerName: voterName,
      accusedSuspect: selectedSuspect,
      weaponTheory,
      motiveTheory,
      isCorrect,
    };

    setBallots([...ballots, newSubmission]);
    soundFX.playChime();

    // Reset inputs for next player
    setVoterName('');
    setSelectedSuspect('');
    setWeaponTheory('');
    setMotiveTheory('');
  };

  const handleTriggerReveal = () => {
    if (ballots.length === 0) {
      if (!confirm('No ballots have been submitted yet. Are you sure you want to reveal the truth now?')) {
        return;
      }
    }
    soundFX.playGavel();
    setTimeout(() => soundFX.playDramaticSting(), 300);
    setIsRevealed(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs font-mono uppercase tracking-widest">
          <Vote className="w-3.5 h-3.5" />
          <span>The Final Accusation &amp; Unmasking</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-amber-100">
          Cast Your Accusation Ballot
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto">
          Every guest casts one secret ballot naming the culprit, the murder weapon, and the true motive before the host breaks the seal on the truth!
        </p>
      </div>

      {/* Two Column Layout: Voting Form + Ballots Tally */}
      {!isRevealed && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Voting Ballot Form */}
          <div className="lg:col-span-2 bg-zinc-900 border border-amber-900/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
            <h3 className="text-lg font-serif font-bold text-amber-200 border-b border-zinc-800 pb-3">
              Confidential Accusation Slip
            </h3>

            <form onSubmit={handleSubmitBallot} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-amber-400 mb-1.5">
                  Your Real Name or Character Name:
                </label>
                <input
                  type="text"
                  value={voterName}
                  onChange={(e) => setVoterName(e.target.value)}
                  placeholder="e.g. Detective Sarah or Lady Victoria"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-amber-400 mb-1.5">
                  Who Do You Accuse as the Murderer?
                </label>
                <select
                  value={selectedSuspect}
                  onChange={(e) => setSelectedSuspect(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:border-amber-500"
                  required
                >
                  <option value="">Select a suspect...</option>
                  {game.characters.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.archetype})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                  How Was It Done? (Weapon &amp; Opportunity)
                </label>
                <input
                  type="text"
                  value={weaponTheory}
                  onChange={(e) => setWeaponTheory(e.target.value)}
                  placeholder="e.g. Poison in the port decanter via the terrace door"
                  className="w-full px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                  What Was the True Motive?
                </label>
                <input
                  type="text"
                  value={motiveTheory}
                  onChange={(e) => setMotiveTheory(e.target.value)}
                  placeholder="e.g. Lord Ravenscroft uncovered the embezzlement audit"
                  className="w-full px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-950/60"
              >
                Submit Secret Ballot
              </button>
            </form>
          </div>

          {/* Submitted Ballots Box */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
                  Ballot Box
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  {ballots.length} / {game.playerCount} Cast
                </span>
              </div>

              {ballots.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 text-xs italic">
                  No votes deposited yet. Have each player step up to submit their secret vote!
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {ballots.map((b, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs flex items-center justify-between"
                    >
                      <span className="font-semibold text-zinc-200">{b.playerName}</span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                        Voted ✓
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Host Unmask Button */}
            <div className="pt-4 border-t border-zinc-800 space-y-2">
              <p className="text-[11px] text-zinc-400 text-center">
                Once all ballots are collected, the host triggers the reveal!
              </p>
              <button
                type="button"
                onClick={handleTriggerReveal}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-700 via-rose-600 to-rose-700 hover:from-rose-600 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-widest transition shadow-xl shadow-rose-950/70 flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                <span>Reveal The Culprit &amp; Verdict</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* THE GRAND UNMASKING REVEAL (Rendered when Host triggers reveal) */}
      {isRevealed && (
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
          {/* Killer Announcement Banner */}
          <div className="bg-gradient-to-br from-rose-950 via-zinc-900 to-zinc-950 border-2 border-rose-600/80 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-900/40 pb-4">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-rose-400 font-bold">
                <Skull className="w-5 h-5 text-rose-500" />
                <span>The Unmasking of the Murderer</span>
              </div>
              <button
                type="button"
                onClick={() => setIsRevealed(false)}
                className="text-xs text-zinc-400 hover:text-zinc-200 underline"
              >
                Hide / Back to Ballots
              </button>
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
                Guilty as Charged:
              </span>
              <h3 className="text-3xl sm:text-5xl font-serif font-black text-rose-100 tracking-wide">
                {murderer.name}
              </h3>
              <p className="text-sm font-serif text-amber-200">
                "{murderer.archetype}"
              </p>
            </div>

            {/* Confession Monologue */}
            {murderer.murderDetails && (
              <div className="bg-zinc-950/80 border border-rose-900/60 rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-rose-400 font-bold">
                  <Volume2 className="w-4 h-4" />
                  <span>The Murderer’s Dramatic Confession (Read Aloud by {murderer.name}):</span>
                </div>
                <blockquote className="font-serif italic text-base sm:text-xl text-zinc-200 leading-relaxed border-l-4 border-rose-600 pl-4 py-1">
                  "{murderer.murderDetails.confessionMonologue}"
                </blockquote>
              </div>
            )}

            {/* Crime Breakdown Grid */}
            {murderer.murderDetails && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="font-mono text-rose-400 uppercase text-[10px] block">
                    Weapon Used
                  </span>
                  <p className="text-zinc-200">{murderer.murderDetails.weaponUsed}</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="font-mono text-rose-400 uppercase text-[10px] block">
                    How Opportunity Was Seized
                  </span>
                  <p className="text-zinc-200">{murderer.murderDetails.opportunity}</p>
                </div>
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                  <span className="font-mono text-rose-400 uppercase text-[10px] block">
                    The Fatal Flaw in Their Alibi
                  </span>
                  <p className="text-zinc-200">{murderer.murderDetails.flawInAlibi}</p>
                </div>
              </div>
            )}

            {/* Airtight Logical Proof */}
            <div className="p-5 rounded-2xl bg-zinc-950 border border-amber-900/40 space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                Step-by-Step Deductive Proof of Solution:
              </h4>
              <p className="text-xs text-zinc-300 whitespace-pre-line leading-relaxed font-mono">
                {game.logicGrid.solutionExplanation}
              </p>
            </div>
          </div>

          {/* Detective Scoreboard */}
          {ballots.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Detective Scoreboard &amp; Honors</span>
              </div>

              <div className="divide-y divide-zinc-800">
                {ballots.map((b, i) => {
                  const isCorrect = b.accusedSuspect === murderer.name;
                  return (
                    <div key={i} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-zinc-100 flex items-center gap-2">
                          <span>{b.playerName}</span>
                          {isCorrect ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              <span>Solved the Mystery!</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 text-[10px] font-mono flex items-center gap-1">
                              <XCircle className="w-3 h-3" />
                              <span>Deceived by Alibis</span>
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-1">
                          Accused: <span className="text-zinc-200">{b.accusedSuspect}</span>
                          {b.weaponTheory && <span> • Theory: {b.weaponTheory}</span>}
                        </div>
                      </div>

                      <div className="text-right font-mono text-xs font-bold text-amber-400">
                        {isCorrect ? '+100 Pts' : '0 Pts'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
