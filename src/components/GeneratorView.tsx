import React, { useState } from 'react';
import { MysteryGame, Difficulty } from '../types';
import { generateProceduralMystery } from '../utils/proceduralGenerator';
import { soundFX } from '../utils/audio';
import {
  Sparkles,
  Wand2,
  Dice5,
  ShieldAlert,
  HelpCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Sliders,
  Compass,
} from 'lucide-react';

interface GeneratorViewProps {
  onGameCreated: (game: MysteryGame) => void;
  onCancel?: () => void;
}

const PRESET_THEMES = [
  {
    name: '1920s Yorkshire Country Manor',
    era: 'Autumn 1926 (British Golden Age)',
    tone: 'Classic Agatha Christie Whodunit with dry wit and class tension',
    scenario: 'Ravenscroft Hall during the formal unsealing of an altered will.',
    victim: 'Lord Alistair Ravenscroft (Aristocratic Patriarch)',
    twist: 'The victim was poisoned in a locked study with two glasses on the table.',
  },
  {
    name: '1980s Miami Neon Penthouse',
    era: 'August 1986 (Neon Synthwave Noir)',
    tone: 'High-energy, stylish, double-crossing crime thriller with synthesizer ambiance',
    scenario: 'Club Velvet 40th floor VIP lounge during a platinum album release.',
    victim: 'Marcus "The Flash" Vance (Shady record producer)',
    twist: 'The soundproof recording booth had an acoustic frequency digital lock.',
  },
  {
    name: '1934 Snowbound Alpine Express',
    era: 'Winter 1934 (Continental Railway)',
    tone: 'Claustrophobic, suspenseful espionage mystery suspended over a snowy gorge',
    scenario: 'Carriage 7 of the luxury sleeper train trapped by an alpine avalanche.',
    victim: 'Baroness Elenora von Hapsburg (Austrian diamond heiress)',
    twist: 'The compartment door was locked from the inside, and all passengers have mutual card-game alibis.',
  },
  {
    name: '1924 Chicago Speakeasy Vault',
    era: '1924 (Prohibition Gangster Era)',
    tone: 'Gritty, atmospheric, prohibition noir with jazz and mob feuds',
    scenario: 'The Lucky Clover underground speakeasy during a private high-stakes poker game.',
    victim: 'Salvatore "Big Sal" Marcone (Bootlegging syndicate boss)',
    twist: 'The safe was cracked from the inside and the lights went out during a jazz solo.',
  },
  {
    name: 'Modern Napa Valley Vineyard Gala',
    era: 'Contemporary Present (Napa Valley)',
    tone: 'Sophisticated modern drama filled with family rivalries, inheritances, and tech wealth',
    scenario: 'Estate Chateau during the annual premiere of the hundred-point Reserve Cabernet.',
    victim: 'Julian DeWitt (Renowned master winemaker & billionaire founder)',
    twist: 'The cellar temperature log recorded a 15-minute anomaly when the nitrogen gas valve tripped.',
  },
  {
    name: '1780 Venetian Carnivale Masquerade',
    era: 'Carnivale of 1780 (Venetian Gothic)',
    tone: 'Romantic, dark, operatic gothic mystery behind gilded porcelain masks',
    scenario: 'Palazzo Ducale along the Grand Canal during midnight masquerade fireworks.',
    victim: 'Doge Lorenzo Mocenigo (Ruler of the Venetian Republic)',
    twist: 'Every suspect wore identical harlequin masks, requiring forensic identification by rings and perfumes.',
  },
];

const ARCHETYPE_SUGGESTIONS: Record<number, string[][]> = {
  4: [
    ['The Grieving Second Wife', 'The Family Physician', 'The Estranged Bohemian Niece', 'The Loyal Butler'],
    ['The Ambitious Business Partner', 'The Relentless Investigative Reporter', 'The Chief Financial Officer', 'The Underpaid Private Secretary'],
    ['The Prodigal Son in Debt', 'The Stern Estate Lawyer', 'The Shady Art Appraiser', 'The Longtime Groundskeeper'],
  ],
  5: [
    ['The Chart-Topping Pop Diva', 'The High-Stakes Casino Fixer', 'The Acoustic Sound Engineer', 'The Disgruntled Ex-Bandmate', 'The European Syndicate Liaison'],
    ['The Charismatic Lead Actor', 'The Ruthless Film Director', 'The Glamorous Stunt Double', 'The Scandalous Gossip Columnist', 'The Studio Financier'],
    ['The Tech Startup CEO', 'The Cynical Venture Capitalist', 'The Fired Chief Scientist', 'The Mysterious Whistleblower', 'The High-Powered Defense Attorney'],
  ],
  6: [
    ['The Retired Parisian Inspector', 'The Dramatic Italian Soprano', 'The Swiss Lockmaker', 'The Aristocratic High-Roller', 'The Foreign Diplomat', 'The American Traveling Heiress'],
    ['The Daring Archaeologist', 'The Antiquities Black-Marketeer', 'The British Museum Curator', 'The Wealthy Expedition Sponsor', 'The Local Expedition Guide', 'The Disgraced University Professor'],
    ['The Brilliant Chess Grandmaster', 'The Cold War Cryptographer', 'The Enigmatic Hotel Concierge', 'The Exiled Royalty', 'The Calculating Spymaster', 'The Famous War Correspondent'],
  ],
};

export const GeneratorView: React.FC<GeneratorViewProps> = ({ onGameCreated, onCancel }) => {
  const [playerCount, setPlayerCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<Difficulty>('detective');
  const [scenario, setScenario] = useState<string>('1920s Speakeasy Masquerade in New York');
  const [era, setEra] = useState<string>('1920s Prohibition');
  const [tone, setTone] = useState<string>('Classic Agatha Christie whodunit with razor-sharp deduction and witty banter');
  const [customVictim, setCustomVictim] = useState<string>('Silas "The Ghost" Sterling (Bootlegging Tycoon)');
  const [specialTwist, setSpecialTwist] = useState<string>('A cipher lock was tampered with during the midnight jazz trumpet solo.');

  // Archetypes for the players
  const [archetypes, setArchetypes] = useState<string[]>([
    'The Glamorous Jazz Chanteuse',
    'The High-Stakes Card Sharp',
    'The Corrupt Police Inspector',
    'The Loyal Bootleg Distiller',
    'The Rival Syndicate Boss',
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync archetype slots when player count changes
  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    const sets = ARCHETYPE_SUGGESTIONS[count] || ARCHETYPE_SUGGESTIONS[5];
    setArchetypes([...sets[0]]);
  };

  const handleApplyPreset = (preset: typeof PRESET_THEMES[0]) => {
    setScenario(preset.scenario);
    setEra(preset.era);
    setTone(preset.tone);
    setCustomVictim(preset.victim);
    setSpecialTwist(preset.twist);
  };

  const handleRandomizeArchetypes = () => {
    const sets = ARCHETYPE_SUGGESTIONS[playerCount] || ARCHETYPE_SUGGESTIONS[5];
    const randIndex = Math.floor(Math.random() * sets.length);
    setArchetypes([...sets[randIndex]]);
  };

  const handleArchetypeChange = (idx: number, val: string) => {
    const next = [...archetypes];
    next[idx] = val;
    setArchetypes(next);
  };

  // Generate with Gemini AI via Server Endpoint
  const handleGenerateAI = async () => {
    setLoading(true);
    setErrorMsg(null);
    setLoadingStep('Consulting the master playwright (Gemini 3.8 Flash)...');
    soundFX.playDramaticSting();

    try {
      const response = await fetch('/api/generate-mystery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario,
          era,
          tone,
          difficulty,
          playerCount,
          archetypes,
          customVictim,
          specialTwist,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      setLoadingStep('Balancing deductive logic matrix and suspect alibis...');
      const data = await response.json();

      if (data.success && data.game) {
        soundFX.playUnlockSuccess();
        onGameCreated(data.game);
      } else {
        throw new Error('Invalid game format returned');
      }
    } catch (err: any) {
      console.warn('AI Generation encountered an issue; offering instant procedural fallback:', err);
      setErrorMsg(`AI generation note: ${err.message || 'Server timeout'}. You can instantly create the mystery using our built-in Procedural Logic Engine below!`);
    } finally {
      setLoading(false);
    }
  };

  // Instant Procedural Generation Fallback (Guaranteed to succeed instantly)
  const handleGenerateProcedural = () => {
    setLoading(true);
    setLoadingStep('Constructing logic grid and airtight alibis...');
    soundFX.playDramaticSting();

    setTimeout(() => {
      try {
        const game = generateProceduralMystery({
          scenario,
          era,
          tone,
          difficulty,
          playerCount,
          archetypes,
          customVictim,
          specialTwist,
        });
        soundFX.playUnlockSuccess();
        onGameCreated(game);
      } catch (e: any) {
        setErrorMsg('Failed to generate mystery: ' + e.message);
      } finally {
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-700/50 text-amber-300 text-xs font-mono uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Party Generator Studio</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-amber-100 tracking-tight">
          Craft a Playable Murder Mystery
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto mt-2 text-sm sm:text-base">
          Define your setting, player archetypes, and deductive difficulty to forge an airtight whodunit complete with suspect dossiers, interactive logic grids, clue drops, and dinner scripts.
        </p>
      </div>

      {/* Preset Inspiration Pills */}
      <div className="mb-8 bg-zinc-900/70 border border-zinc-800 rounded-xl p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3 text-xs font-mono uppercase tracking-wider text-amber-400">
          <Compass className="w-3.5 h-3.5" />
          <span>Quick Inspiration Presets (Click to load)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
          {PRESET_THEMES.map((theme, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleApplyPreset(theme)}
              className="text-left p-2.5 rounded-lg bg-zinc-950/80 hover:bg-amber-950/40 border border-zinc-800 hover:border-amber-700/60 transition group text-xs"
            >
              <div className="font-semibold text-zinc-200 group-hover:text-amber-200 truncate">
                {theme.name}
              </div>
              <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                {theme.era}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Configuration Form */}
      <div className="space-y-6 bg-zinc-900/90 border border-amber-900/30 rounded-2xl p-6 sm:p-8 shadow-2xl">
        {/* Core Parameters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Player Count */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-amber-400 mb-2">
              Number of Players (Dinner Guests)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[4, 5, 6].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => handlePlayerCountChange(count)}
                  className={`py-3 px-4 rounded-xl font-serif text-base font-bold border transition flex flex-col items-center justify-center gap-1 ${
                    playerCount === count
                      ? 'bg-amber-600 text-zinc-950 border-amber-400 shadow-lg shadow-amber-950/60'
                      : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-xl">{count}</span>
                  <span className="text-[10px] uppercase font-mono tracking-wider font-normal">
                    {count === 4 ? 'Intimate' : count === 5 ? 'Balanced' : 'Grand'}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-zinc-400 mt-1.5">
              Includes 1 secret murderer and {playerCount - 1} innocent suspects with suspicious dark secrets.
            </p>
          </div>

          {/* Difficulty Level */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-amber-400 mb-2">
              Deductive Difficulty &amp; Puzzle Depth
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['novice', 'detective', 'master'] as Difficulty[]).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition flex flex-col items-center justify-center text-center gap-1 ${
                    difficulty === diff
                      ? 'bg-amber-950/70 text-amber-200 border-amber-500 shadow-md'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <span className="font-bold capitalize">{diff === 'master' ? 'Master Sleuth' : diff}</span>
                  <span className="text-[10px] text-zinc-400">
                    {diff === 'novice' && 'Direct Alibis'}
                    {diff === 'detective' && 'False Alibis'}
                    {diff === 'master' && 'Logic Grid + Cipher'}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-zinc-400 mt-1.5">
              {difficulty === 'novice' && 'Great for casual dinner parties; straightforward clues and distinct timelines.'}
              {difficulty === 'detective' && 'Classic Golden Age complexity; cross-referencing timestamps and testimony is essential.'}
              {difficulty === 'master' && 'For hardcore mystery fans; requires solving embedded ciphers and an Einstein-style elimination matrix.'}
            </p>
          </div>
        </div>

        {/* Setting & Scenario Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-amber-400 mb-1.5">
              Scenario / Location &amp; Occasion
            </label>
            <input
              type="text"
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              placeholder="e.g. 1920s Speakeasy Masquerade, Alpine Chalet, Luxury Yacht Gala"
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm text-zinc-100 placeholder-zinc-500"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-amber-400 mb-1.5">
              Historical Era / Theme
            </label>
            <input
              type="text"
              value={era}
              onChange={(e) => setEra(e.target.value)}
              placeholder="e.g. Victorian 1890, Roaring 20s, 1980s Neon Synthwave, Cyberpunk 2088"
              className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm text-zinc-100 placeholder-zinc-500"
            />
          </div>
        </div>

        {/* Narrative Tone */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-amber-400 mb-1.5">
            Story Tone &amp; Dialogue Flavor
          </label>
          <input
            type="text"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            placeholder="e.g. Classic Agatha Christie whodunit, Dark gritty noir thriller, Campy comedic farce"
            className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm text-zinc-100 placeholder-zinc-500"
          />
        </div>

        {/* Suspect Archetypes (Dynamic based on Player Count) */}
        <div className="pt-2 border-t border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-amber-400">
                Suspect Archetypes ({playerCount} Guests)
              </label>
              <p className="text-xs text-zinc-400">
                Assign character roles for your dinner guests (or keep our recommended balanced mix).
              </p>
            </div>
            <button
              type="button"
              onClick={handleRandomizeArchetypes}
              className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800 hover:border-amber-700/50 transition"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Shuffle Archetypes</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: playerCount }).map((_, idx) => (
              <div key={idx} className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-1">
                  <span>Guest #{idx + 1}</span>
                  {idx === 0 && <span className="text-amber-500">Host / Lead</span>}
                </div>
                <input
                  type="text"
                  value={archetypes[idx] || `Archetype #${idx + 1}`}
                  onChange={(e) => handleArchetypeChange(idx, e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700/60 rounded text-xs text-zinc-200 focus:border-amber-500 font-medium"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Optional Victim & Plot Twist */}
        <div className="pt-2 border-t border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
              Victim Details (Optional)
            </label>
            <input
              type="text"
              value={customVictim}
              onChange={(e) => setCustomVictim(e.target.value)}
              placeholder="e.g. Lord Roderick Sterling (Wealthy Railroad Baron)"
              className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 placeholder-zinc-500"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
              Special Plot Twist / Mechanics (Optional)
            </label>
            <input
              type="text"
              value={specialTwist}
              onChange={(e) => setSpecialTwist(e.target.value)}
              placeholder="e.g. A cipher locked inside an antique pocket watch, blackout at 9:30 PM"
              className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 placeholder-zinc-500"
            />
          </div>
        </div>

        {/* Error message / Notice */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/80 text-amber-200 text-xs flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Generation Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-zinc-800">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-zinc-700 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 transition"
            >
              Cancel
            </button>
          )}

          {/* Instant Procedural Generation Option */}
          <button
            type="button"
            onClick={handleGenerateProcedural}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-amber-700/60 text-xs font-bold text-amber-300 bg-zinc-950 hover:bg-amber-950/40 transition flex items-center justify-center gap-2"
            title="Instant generation using local deductive algorithms (no API wait time)"
          >
            <Dice5 className="w-4 h-4 text-amber-400" />
            <span>Instant Procedural Build</span>
          </button>

          {/* AI Generation with Gemini 3.8 Flash */}
          <button
            type="button"
            onClick={handleGenerateAI}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-zinc-950 text-xs font-bold transition shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                <span>{loadingStep || 'Generating Mystery...'}</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Generate Mystery with Gemini AI</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
