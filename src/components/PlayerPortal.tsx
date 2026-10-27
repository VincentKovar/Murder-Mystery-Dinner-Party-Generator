import React, { useState } from 'react';
import { MysteryGame, SuspectCharacter } from '../types';
import { soundFX } from '../utils/audio';
import {
  Users,
  Eye,
  EyeOff,
  Skull,
  Shield,
  MessageSquare,
  HelpCircle,
  AlertTriangle,
  Shirt,
  Sparkles,
} from 'lucide-react';

interface PlayerPortalProps {
  game: MysteryGame;
}

export const PlayerPortal: React.FC<PlayerPortalProps> = ({ game }) => {
  const [selectedCharId, setSelectedCharId] = useState<string>(game.characters[0]?.id || '');
  const [revealed, setRevealed] = useState<boolean>(false);
  const [currentRoundTab, setCurrentRoundTab] = useState<'round1' | 'round2' | 'round3'>('round1');

  const character = game.characters.find((c) => c.id === selectedCharId) || game.characters[0];

  const handleToggleReveal = () => {
    if (!revealed) {
      soundFX.playDramaticSting();
    }
    setRevealed(!revealed);
  };

  const handleSelectCharacter = (id: string) => {
    setSelectedCharId(id);
    setRevealed(false); // Conceal by default when switching characters
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Character Selector Pills */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5">
        <label className="block text-xs font-mono uppercase tracking-wider text-amber-400 mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>Select Your Assigned Character</span>
          </span>
          <span className="text-[11px] text-zinc-400 normal-case">
            Pass the device or open on your own phone
          </span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {game.characters.map((c: SuspectCharacter) => {
            const isSelected = c.id === selectedCharId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSelectCharacter(c.id)}
                className={`p-2.5 rounded-xl text-left border transition ${
                  isSelected
                    ? 'bg-amber-950/70 border-amber-500 text-amber-100 shadow-md'
                    : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <div className="font-bold text-xs truncate">{c.name}</div>
                <div className="text-[10px] text-zinc-400 truncate mt-0.5">{c.archetype}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Confidential Dossier Card */}
      <div className="bg-zinc-900 border border-amber-900/30 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header Ribbon */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-zinc-950 via-zinc-900 to-amber-950/40 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-700/60 text-amber-300 text-[11px] font-mono uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3" />
              <span>{character.archetype}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
              {character.name}
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl">
              {character.bio}
            </p>
          </div>

          {/* Privacy Curtain Toggle Button */}
          <button
            type="button"
            onClick={handleToggleReveal}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-xs transition shrink-0 shadow-lg ${
              revealed
                ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-zinc-950 animate-pulse'
            }`}
          >
            {revealed ? (
              <>
                <EyeOff className="w-4 h-4" />
                <span>Hide Confidential Dossier</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span>Reveal Confidential Dossier</span>
              </>
            )}
          </button>
        </div>

        {/* Costume & Prop Guide (Visible to all for setup) */}
        <div className="p-4 sm:px-8 bg-zinc-950/60 border-b border-zinc-800/80 flex items-start gap-3 text-xs">
          <Shirt className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-mono text-amber-400 uppercase tracking-wider text-[11px] font-bold">
              Costume &amp; Dinner Prop Ideas:{' '}
            </span>
            <span className="text-zinc-300">{character.costumeAndPropGuide}</span>
          </div>
        </div>

        {/* Privacy Guard Notice when Hidden */}
        {!revealed ? (
          <div className="p-8 sm:p-16 text-center space-y-4 bg-zinc-950/40">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-amber-900/40 flex items-center justify-center mx-auto text-amber-500 shadow-inner">
              <Shield className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-serif font-bold text-amber-200">
                Confidential Dossier for {character.name}
              </h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Ensure no other players are looking at your screen before tapping "Reveal Confidential Dossier" above.
              </p>
            </div>
          </div>
        ) : (
          /* Revealed Confidential Dossier Content */
          <div className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
            {/* If Killer: Secret Murderer Directive */}
            {character.isMurderer && (
              <div className="p-5 rounded-xl bg-gradient-to-r from-rose-950/80 to-zinc-950 border border-rose-600/70 space-y-3 shadow-lg">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-rose-400 font-bold">
                  <Skull className="w-4 h-4 text-rose-500" />
                  <span>TOP SECRET: YOU ARE THE MURDERER!</span>
                </div>
                <p className="text-xs text-zinc-200 leading-relaxed">
                  You committed the crime! Your objective is to deflect suspicion, steer attention to other suspects, and bluff your way to dessert. Only if you are definitively unmasked during the final verdict will you deliver your confession!
                </p>
                {character.murderDetails && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-rose-900/60">
                      <span className="font-mono text-rose-400 text-[10px] uppercase block">Weapon Used:</span>
                      <span className="text-zinc-200">{character.murderDetails.weaponUsed}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-zinc-950/80 border border-rose-900/60">
                      <span className="font-mono text-rose-400 text-[10px] uppercase block">Flaw in Your Alibi:</span>
                      <span className="text-zinc-200">{character.murderDetails.flawInAlibi}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Public Secret vs Dark Secret */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                  <span>Public Rumor / What Others Suspect</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {character.publicSecret}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/50 space-y-1.5">
                <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Your Dark Secret (Skeleton in the Closet)</span>
                </div>
                <p className="text-xs text-zinc-200 leading-relaxed">
                  {character.darkSecret}
                </p>
                <div className="text-[10px] text-amber-500/80 italic mt-1">
                  Keep this hidden unless another guest confronts you with undeniable proof!
                </div>
              </div>
            </div>

            {/* Motive & Alibi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  Why You Could Be Suspected (Motive)
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {character.motive}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  Your Claimed Alibi
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {character.alibi.claimedStory}
                </p>
                <div className="text-[11px] text-zinc-400 border-t border-zinc-800/80 pt-1.5 mt-1">
                  <span className="font-semibold text-zinc-300">Unverified Window: </span>
                  {character.alibi.unverifiedWindow}
                </div>
              </div>
            </div>

            {/* Round-by-Round Playbook */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="text-xs font-mono uppercase tracking-wider text-amber-400">
                  Your Round-by-Round Playbook
                </div>
                <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setCurrentRoundTab('round1')}
                    className={`px-3 py-1 rounded text-xs font-semibold transition ${
                      currentRoundTab === 'round1'
                        ? 'bg-amber-600 text-zinc-950'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Round 1
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentRoundTab('round2')}
                    className={`px-3 py-1 rounded text-xs font-semibold transition ${
                      currentRoundTab === 'round2'
                        ? 'bg-amber-600 text-zinc-950'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Round 2
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentRoundTab('round3')}
                    className={`px-3 py-1 rounded text-xs font-semibold transition ${
                      currentRoundTab === 'round3'
                        ? 'bg-amber-600 text-zinc-950'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Round 3
                  </button>
                </div>
              </div>

              {/* Round 1 Instructions */}
              {currentRoundTab === 'round1' && (
                <div className="space-y-3 text-xs animate-in fade-in duration-200">
                  <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40">
                    <span className="font-mono text-emerald-400 uppercase text-[10px] block mb-1">
                      What to Say to the Room:
                    </span>
                    <p className="text-zinc-200">{character.roundGuidance.round1.whatToSay}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-800/40">
                    <span className="font-mono text-rose-400 uppercase text-[10px] block mb-1">
                      What to Hide:
                    </span>
                    <p className="text-zinc-200">{character.roundGuidance.round1.whatToHide}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/40">
                    <span className="font-mono text-amber-400 uppercase text-[10px] block mb-1">
                      Question to Ask Others:
                    </span>
                    <p className="text-zinc-200 font-serif italic">"{character.roundGuidance.round1.questionToAskOthers}"</p>
                  </div>
                </div>
              )}

              {/* Round 2 Instructions */}
              {currentRoundTab === 'round2' && (
                <div className="space-y-3 text-xs animate-in fade-in duration-200">
                  <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40">
                    <span className="font-mono text-emerald-400 uppercase text-[10px] block mb-1">
                      What to Say to the Room:
                    </span>
                    <p className="text-zinc-200">{character.roundGuidance.round2.whatToSay}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-800/40">
                    <span className="font-mono text-rose-400 uppercase text-[10px] block mb-1">
                      What to Hide:
                    </span>
                    <p className="text-zinc-200">{character.roundGuidance.round2.whatToHide}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/40">
                    <span className="font-mono text-amber-400 uppercase text-[10px] block mb-1">
                      Confrontation Question to Ask:
                    </span>
                    <p className="text-zinc-200 font-serif italic">"{character.roundGuidance.round2.questionToAskOthers}"</p>
                  </div>
                </div>
              )}

              {/* Round 3 Instructions */}
              {currentRoundTab === 'round3' && (
                <div className="space-y-3 text-xs animate-in fade-in duration-200">
                  <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40">
                    <span className="font-mono text-emerald-400 uppercase text-[10px] block mb-1">
                      Final Statement Before Ballots:
                    </span>
                    <p className="text-zinc-200">{character.roundGuidance.round3.whatToSay}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/40">
                    <span className="font-mono text-amber-400 uppercase text-[10px] block mb-1">
                      Defense Strategy:
                    </span>
                    <p className="text-zinc-200">{character.roundGuidance.round3.defenseStrategy}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-700/60">
                    <span className="font-mono text-zinc-400 uppercase text-[10px] block mb-1">
                      Closing Defense Plea:
                    </span>
                    <p className="text-zinc-200 font-serif italic">"{character.roundGuidance.round3.finalStatement}"</p>
                  </div>
                </div>
              )}
            </div>

            {/* Confession Monologue (Only visible to the killer for the final dramatic scene) */}
            {character.isMurderer && character.murderDetails && (
              <div className="p-4 rounded-xl bg-zinc-950 border border-rose-900/60 space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-rose-400 font-bold block">
                  Your Epilogue Confession Monologue (To be read aloud ONLY if unmasked in the finale):
                </span>
                <p className="text-sm font-serif italic text-zinc-300 leading-relaxed bg-zinc-900/80 p-3.5 rounded-lg border border-zinc-800">
                  "{character.murderDetails.confessionMonologue}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
