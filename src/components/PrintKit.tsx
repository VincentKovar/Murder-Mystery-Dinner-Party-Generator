import React from 'react';
import { MysteryGame } from '../types';
import {
  Printer,
  Download,
  Upload,
  FileText,
  Scissors,
  Check,
  Copy,
} from 'lucide-react';

interface PrintKitProps {
  game: MysteryGame;
  onImportGame: (game: MysteryGame) => void;
}

export const PrintKit: React.FC<PrintKitProps> = ({ game, onImportGame }) => {
  const [copiedJson, setCopiedJson] = React.useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(game, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${game.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_party_kit.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(game, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && parsed.title && parsed.characters) {
            onImportGame(parsed);
            alert('Murder mystery game imported successfully!');
          } else {
            alert('File does not appear to be a valid Noir & Alibi party kit.');
          }
        } catch {
          alert('Failed to parse JSON file.');
        }
      };
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Action Header (Hidden during actual print) */}
      <div className="print:hidden bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
            <Printer className="w-4 h-4" />
            <span>Printable Physical Dinner Party Kit</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
            Print Character Booklets &amp; Clue Cards
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
            Want to play without phones at the dinner table? Print this complete kit! It formats character cards, fold-over secret dossiers, cut-out clue cards, and voting ballots.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-zinc-950 text-xs font-bold transition shadow-lg shadow-amber-950/60"
          >
            <Printer className="w-4 h-4" />
            <span>Print Party Kit Now</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadJSON}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition border border-zinc-700"
            title="Download party kit as JSON file"
          >
            <Download className="w-4 h-4" />
            <span>Download JSON</span>
          </button>
          <label className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition border border-zinc-700 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Import JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* PRINTABLE PREVIEW CONTAINER */}
      <div className="space-y-12 bg-white text-zinc-900 p-8 sm:p-12 rounded-2xl shadow-2xl print:p-0 print:shadow-none print:m-0 print:bg-white print:text-black">
        {/* Cover Sheet */}
        <div className="border-b-4 border-zinc-900 pb-8 text-center space-y-4">
          <div className="text-xs uppercase font-mono tracking-widest text-zinc-500">
            Noir &amp; Alibi Dinner Party Kit • {game.playerCount} Players • {game.setting.era}
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-black tracking-tight text-zinc-950">
            {game.title}
          </h1>
          <p className="text-base font-serif italic text-zinc-700 max-w-2xl mx-auto">
            "{game.tagline}"
          </p>
          <div className="text-xs font-serif text-zinc-600 max-w-2xl mx-auto text-left pt-2 leading-relaxed">
            <strong className="block text-zinc-900 not-italic uppercase font-mono text-[10px] mb-1">Incident Synopsis:</strong>
            {game.synopsis}
          </div>
        </div>

        {/* SECTION 1: PRINTABLE HOST GUIDE & DINNER MENU */}
        <div className="space-y-6 pt-4 page-break-after">
          <div className="border-b-2 border-zinc-800 pb-2 flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold uppercase tracking-wider text-zinc-900">
              Host Master Guide &amp; Dinner Menu
            </h2>
            <span className="text-xs font-mono text-zinc-500">Host Eyes Only</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            {game.hostGuide.suggestedDinnerMenu.map((m, i) => (
              <div key={i} className="p-3 border border-zinc-300 rounded bg-zinc-50">
                <span className="font-mono uppercase text-[10px] text-zinc-500 block">{m.course}</span>
                <span className="font-bold text-zinc-900 text-sm block mt-0.5">{m.dish}</span>
                <span className="text-zinc-600 italic block mt-0.5">Pairing: {m.wineOrDrinkPairing}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 border border-zinc-300 rounded">
              <strong className="font-mono uppercase text-[10px] text-zinc-600 block mb-1">Host Opening Speech (Phase 1):</strong>
              <p className="font-serif italic text-zinc-800">"{game.hostGuide.openingScript}"</p>
            </div>
            <div className="p-3 border border-zinc-300 rounded">
              <strong className="font-mono uppercase text-[10px] text-zinc-600 block mb-1">Crime Announcement Speech (Phase 2):</strong>
              <p className="font-serif italic text-zinc-800">"{game.hostGuide.round1Script}"</p>
            </div>
            <div className="p-3 border border-zinc-300 rounded">
              <strong className="font-mono uppercase text-[10px] text-zinc-600 block mb-1">Final Confrontation Speech (Phase 3):</strong>
              <p className="font-serif italic text-zinc-800">"{game.hostGuide.round2Script}"</p>
            </div>
          </div>
        </div>

        {/* SECTION 2: INDIVIDUAL CHARACTER DOSSIERS (Page Break per character) */}
        <div className="space-y-8 pt-6">
          <div className="border-b-2 border-zinc-800 pb-2">
            <h2 className="text-xl font-serif font-bold uppercase tracking-wider text-zinc-900">
              Player Character Dossiers ({game.characters.length} Booklets)
            </h2>
            <p className="text-xs text-zinc-600">
              Print and place inside sealed envelopes at each seat. Players must keep secrets hidden until instructed!
            </p>
          </div>

          <div className="space-y-8">
            {game.characters.map((char) => (
              <div key={char.id} className="border-2 border-zinc-800 p-6 rounded-lg space-y-4 break-inside-avoid">
                <div className="border-b border-zinc-400 pb-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                      Confidential Character Booklet
                    </span>
                    <h3 className="text-2xl font-serif font-black text-zinc-950">
                      {char.name}
                    </h3>
                    <span className="text-xs font-serif italic text-zinc-700">
                      Archetype: {char.archetype}
                    </span>
                  </div>
                  <div className="text-right text-[10px] font-mono text-zinc-500">
                    <div>{game.title}</div>
                    <div>Seat #{char.id}</div>
                  </div>
                </div>

                <div className="text-xs space-y-2">
                  <p><strong>Biography:</strong> {char.bio}</p>
                  <p><strong>Costume / Prop Ideas:</strong> {char.costumeAndPropGuide}</p>
                  <p><strong>Public Reputation:</strong> {char.publicSecret}</p>
                </div>

                {/* Secret Fold Line Box */}
                <div className="border-2 border-dashed border-zinc-600 p-4 rounded bg-zinc-50 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-zinc-800 font-bold">
                    <Scissors className="w-3.5 h-3.5" />
                    <span>FOLD HERE TO CONCEAL SECRET DOSSIER FROM OTHER GUESTS</span>
                  </div>

                  <p className="text-zinc-900">
                    <strong>Dark Secret:</strong> {char.darkSecret}
                  </p>
                  <p className="text-zinc-900">
                    <strong>Claimed Alibi:</strong> {char.alibi.claimedStory} (Unverified window: {char.alibi.unverifiedWindow})
                  </p>

                  {char.isMurderer && (
                    <div className="p-2 border border-red-500 bg-red-50 text-red-950 text-xs rounded font-semibold">
                      ⚠️ TOP SECRET: YOU ARE THE MURDERER! Deflect suspicion. Confess only if unmasked at dessert!
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-300 text-[11px]">
                    <div>
                      <strong className="block font-mono text-[9px] uppercase text-zinc-600">Round 1 Line:</strong>
                      <span className="italic">"{char.roundGuidance.round1.whatToSay}"</span>
                    </div>
                    <div>
                      <strong className="block font-mono text-[9px] uppercase text-zinc-600">Round 2 Line:</strong>
                      <span className="italic">"{char.roundGuidance.round2.whatToSay}"</span>
                    </div>
                    <div>
                      <strong className="block font-mono text-[9px] uppercase text-zinc-600">Round 3 Defense:</strong>
                      <span className="italic">"{char.roundGuidance.round3.whatToSay}"</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: CUT-OUT CLUE CARDS */}
        <div className="space-y-6 pt-6">
          <div className="border-b-2 border-zinc-800 pb-2 flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold uppercase tracking-wider text-zinc-900">
              Cut-Out Physical Clue Cards
            </h2>
            <span className="text-xs font-mono text-zinc-500 flex items-center gap-1">
              <Scissors className="w-3.5 h-3.5" />
              <span>Cut along dashed lines</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {game.clues.map((clue) => (
              <div
                key={clue.id}
                className="border-2 border-dashed border-zinc-700 p-4 rounded-lg space-y-2 bg-zinc-50 break-inside-avoid text-xs"
              >
                <div className="flex items-center justify-between font-mono text-[10px] text-zinc-600">
                  <span>ROUND {clue.round} EVIDENCE</span>
                  <span className="uppercase">{clue.type}</span>
                </div>
                <h4 className="font-serif font-bold text-base text-zinc-950">
                  {clue.name}
                </h4>
                <p className="text-zinc-800 leading-relaxed">
                  {clue.description}
                </p>
                <div className="italic text-zinc-600 border-t border-zinc-200 pt-1 text-[11px]">
                  {clue.flavorText}
                </div>
                {clue.puzzleData && (
                  <div className="p-2 border border-zinc-300 rounded bg-white text-[10px] font-mono">
                    <strong>PUZZLE: </strong>{clue.puzzleData.puzzlePrompt}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: CUT-OUT ACCUSATION BALLOTS */}
        <div className="space-y-6 pt-6">
          <div className="border-b-2 border-zinc-800 pb-2">
            <h2 className="text-xl font-serif font-bold uppercase tracking-wider text-zinc-900">
              Official Secret Accusation Ballots
            </h2>
            <p className="text-xs text-zinc-600">
              Cut and distribute to guests at dessert before the host reveals the true murderer.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: game.playerCount }).map((_, idx) => (
              <div
                key={idx}
                className="border-2 border-dashed border-zinc-700 p-4 rounded-lg space-y-3 bg-zinc-50 break-inside-avoid text-xs"
              >
                <div className="flex justify-between items-center font-mono text-[10px] text-zinc-600">
                  <span>ACCUSATION BALLOT #{idx + 1}</span>
                  <span>NOIR &amp; ALIBI</span>
                </div>
                <div className="space-y-2">
                  <div className="border-b border-zinc-300 pb-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">My Name:</span>
                    <span className="inline-block w-40 border-b border-zinc-400 ml-2"></span>
                  </div>
                  <div className="border-b border-zinc-300 pb-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">I Accuse:</span>
                    <span className="inline-block w-40 border-b border-zinc-400 ml-2"></span>
                  </div>
                  <div className="border-b border-zinc-300 pb-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Weapon / Means:</span>
                    <span className="inline-block w-36 border-b border-zinc-400 ml-2"></span>
                  </div>
                  <div className="border-b border-zinc-300 pb-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Motive Theory:</span>
                    <span className="inline-block w-36 border-b border-zinc-400 ml-2"></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
