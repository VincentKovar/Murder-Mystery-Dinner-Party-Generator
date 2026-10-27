import { MysteryGame, SuspectCharacter, Difficulty } from '../types';

interface GenerationOptions {
  scenario: string;
  era: string;
  tone: string;
  difficulty: Difficulty;
  playerCount: number;
  archetypes: string[];
  customVictim: string;
  specialTwist: string;
}

const DEFAULT_ARCHETYPES_BY_COUNT: Record<number, string[]> = {
  4: [
    'The Wealthy Beneficiary',
    'The Trusted Confidant / Doctor',
    'The Bitter Estranged Relative',
    'The Long-Serving Household Butler',
  ],
  5: [
    'The Glamorous Starlet / Performer',
    'The Shrewd Financier / Fixer',
    'The Brilliant Technician / Scholar',
    'The Disgruntled Former Partner',
    'The Secret Investigator / Auditor',
  ],
  6: [
    'The Renowned Senior Detective',
    'The Impoverished Aristocrat',
    'The Cunning Locksmith / Artificer',
    'The High-Stakes Gambler',
    'The Foreign Diplomat',
    'The Ambitious Journalist / Heiress',
  ],
};

export function generateProceduralMystery(opts: GenerationOptions): MysteryGame {
  const count = Math.min(Math.max(Number(opts.playerCount) || 5, 4), 6);
  const titleWords = opts.scenario.split(' ').slice(0, 4).join(' ');
  const title = `The Enigma of ${titleWords || 'Shadow Manor'}`;
  const victimName = opts.customVictim || 'Lord Roderick Sterling';

  // Build character list
  const chosenArchetypes = opts.archetypes.length >= count
    ? opts.archetypes.slice(0, count)
    : [...opts.archetypes, ...DEFAULT_ARCHETYPES_BY_COUNT[count]].slice(0, count);

  const suspectNames = [
    'Vivian Delacroix',
    'Dr. Alistair Finch',
    'Morgan Vance',
    'Eleanor Wright',
    'Sebastian Cross',
    'Cassandra Drake',
  ].slice(0, count);

  // Pick index 1 or 2 as murderer
  const murdererIndex = 1;

  const characters: SuspectCharacter[] = chosenArchetypes.map((arch, idx) => {
    const isKiller = idx === murdererIndex;
    const name = suspectNames[idx];
    return {
      id: `char-${idx + 1}`,
      name,
      archetype: arch,
      bio: `A prominent figure within ${opts.scenario}. Known for exceptional discretion, sharp intellect, and a complicated history with ${victimName}.`,
      costumeAndPropGuide: `Period-appropriate attire for ${opts.era || 'a luxury dinner party'}, featuring an accessory such as vintage spectacles, formal gloves, pocket ledger, or silk scarf.`,
      publicSecret: `Was overheard engaged in a heated argument with ${victimName} regarding private affairs right before the main course.`,
      darkSecret: isKiller
        ? `Lied about their whereabouts during the critical 15-minute murder window; possessed the key to the private study.`
        : `Secretly intercepted and burned a personal letter from ${victimName} earlier this evening to protect their family reputation.`,
      motive: isKiller
        ? `Facing imminent financial ruin and criminal exposure if ${victimName} lived to expose their falsified records tomorrow morning.`
        : `Resented ${victimName} for broken promises regarding family inheritance and commercial shares.`,
      isMurderer: isKiller,
      murderDetails: isKiller
        ? {
            weaponUsed: 'An antique Damascus steel letter opener coated with concentrated digitalis extract.',
            opportunity: 'Slipped away during the lightning blackout at 9:30 PM, entered via the balcony, and struck silently before relocking the door.',
            trueMotive: `To permanently eliminate ${victimName} before the revised contract was placed in the morning courier dispatch.`,
            confessionMonologue: `They thought they could ruin me! Thirty years of building this legacy, and ${victimName} was going to wipe it away with a single signature! I did what anyone backed into a corner would do. And I would do it again!`,
            flawInAlibi: 'Claimed to be reading in the library, but the mantel clock was stopped 20 minutes prior, and a broken cufflink was found near the scene.',
          }
        : undefined,
      alibi: {
        claimedStory: `Was in the reception parlor speaking with guests and reviewing notes between 9:20 PM and 9:45 PM.`,
        verifiedPart: `Seen by the household staff at 9:20 PM pouring tea.`,
        unverifiedWindow: isKiller
          ? `Between 9:28 PM and 9:38 PM, no other guest can verify their location.`
          : `Between 9:32 PM and 9:35 PM, stepped into the conservatory to catch fresh air, where another guest witnessed them.`,
      },
      roundGuidance: {
        round1: {
          whatToSay: `Express profound shock at the discovery of ${victimName}. State that you were enjoying dinner and had no reason to wish them harm.`,
          whatToHide: isKiller
            ? `Never mention entering the private corridor or having the antique key.`
            : `Do not mention the burned correspondence in the hearth.`,
          questionToAskOthers: `Ask who had the master key to the locked east wing door.`,
        },
        round2: {
          whatToSay: `Clarify your movements: you stepped away only briefly, and multiple guests can vouch for your presence during the toast.`,
          whatToHide: isKiller
            ? `Do not let anyone inspect your left cuff or notice the missing silver button.`
            : `Keep quiet about your financial disputes with the victim.`,
          questionToAskOthers: `Ask why the library balcony latch was unlocked during the storm.`,
        },
        round3: {
          whatToSay: isKiller
            ? `Argue fiercely that a physical struggle would require someone with heavy brute strength, deflecting suspicion elsewhere.`
            : `Point out the chronological contradiction in the murderer's claimed timeline!`,
          defenseStrategy: `Focus on the forensic evidence: trace residue proves the real killer had access to the private desk.`,
          finalStatement: isKiller
            ? `I came here as an invited guest! To accuse me without seeing the full ledger is slander!`
            : `I may have had disagreements with ${victimName}, but I settled them with words, not cold steel!`,
        },
      },
    };
  });

  return {
    id: 'custom-' + Date.now(),
    createdAt: new Date().toISOString(),
    title,
    tagline: `A custom whodunit for ${count} players in ${opts.scenario}.`,
    synopsis: `Amidst the grandeur of ${opts.scenario}, an opulent gathering is shattered when ${victimName} is discovered murdered in cold blood. As torrential weather or locked gates seal the venue, the ${count} remaining guests must cross-examine alibis, analyze physical clues, and reconstruct an airtight logic grid to identify the true culprit before the final toast.`,
    difficulty: opts.difficulty || 'detective',
    playerCount: count,
    setting: {
      locationName: opts.scenario || 'The Highcliff Estate',
      era: opts.era || 'Early 20th Century Glamour',
      atmosphere: `Opulent, claustrophobic, and suspenseful. ${opts.tone || 'A classic whodunit with razor-sharp deduction'}.`,
      dinnerPartyContext: 'A celebratory formal multi-course dinner convened to celebrate an auspicious milestone, ended by a sudden demise.',
      floorPlan: [
        {
          room: 'The Private Study (Crime Scene)',
          description: 'A wood-paneled sanctum with a locked safe, antique desk, velvet armchairs, and a shattered glass.',
          keyItemsFound: ['Ornate letter opener with dark residue', 'Scattered ledger balance sheets', 'Fallen cufflink near the curtain'],
        },
        {
          room: 'The Grand Dining Room',
          description: 'An expansive table laid with fine china, crystal stemware, and silver candelabras.',
          keyItemsFound: ['Handwritten place cards', 'Vintage wine bottle half-empty'],
        },
        {
          room: 'The Library & Gallery',
          description: 'Soaring shelves lined with rare first editions, deep leather wingback chairs, and a grand stone fireplace.',
          keyItemsFound: ['Half-burned telegram fragment in the hearth', 'Stopped grandfather clock at 9:30 PM'],
        },
        {
          room: 'The Garden Conservatory',
          description: 'A glass greenhouse with exotic palms, fragrant night jasmine, and stone benches overlooking the terrace.',
          keyItemsFound: ['Muddy boot footprint near the rear glass door', 'Dropped silk handkerchief'],
        },
      ],
    },
    victim: {
      name: victimName,
      title: 'Wealthy Patron & Host of the Evening',
      causeOfDeath: 'Direct puncture wound with a venomous coating from an antique letter opener.',
      timeOfDeath: 'Between 9:28 PM and 9:36 PM',
      discoveryCircumstances: `Discovered by the butler when bringing in the dessert tray at 9:45 PM.`,
      coronerNotes: 'Death was swift. Forensic marks confirm the perpetrator approached from behind while the victim was examining papers at the desk.',
    },
    characters,
    logicGrid: {
      timeSlots: ['9:00 PM (Dinner Served)', '9:20 PM (Toast Given)', '9:30 PM (Blackout Window)', '9:35 PM (Chime Strikes)', '9:45 PM (Alarm Raised)'],
      rooms: ['The Study', 'The Dining Room', 'The Library', 'The Conservatory'],
      suspectNames: characters.map((c) => c.name),
      timelineEvents: [
        { time: '9:00 PM', location: 'The Dining Room', suspectName: 'All Guests', action: 'Seated together for the first course.', isCorroborated: true, corroboratedBy: 'Everyone' },
        { time: '9:20 PM', location: 'The Dining Room', suspectName: characters[0].name, action: 'Pouring tea and speaking with companions.', isCorroborated: true, corroboratedBy: characters[2].name },
        { time: '9:30 PM', location: 'The Study', suspectName: characters[murdererIndex].name, action: 'Entered during brief lighting flicker and committed the act.', isCorroborated: false },
        { time: '9:32 PM', location: 'The Conservatory', suspectName: characters[2]?.name || 'Guest', action: 'Taking fresh air by the stone fountain.', isCorroborated: true, corroboratedBy: 'Staff witness' },
        { time: '9:45 PM', location: 'The Study', suspectName: 'Butler', action: 'Discovered victim and alerted the dinner party.', isCorroborated: true, corroboratedBy: 'All Guests' },
      ],
      deductionRules: [
        {
          clueRef: 'Clue #1: The Mutual Dining Room Alibi',
          statement: `During the 9:28-9:36 PM murder window, ${characters[0].name} and ${characters[2]?.name || 'the third guest'} were engaged in conversation witnessed by staff.`,
          eliminatesSuspectName: `${characters[0].name}`,
          reason: 'Verified presence in the dining room eliminates them from entering the locked study.',
        },
        {
          clueRef: 'Clue #2: The Stopped Clock & The Broken Cufflink',
          statement: 'The clock in the study was struck at 9:32 PM, and the silver cufflink left at the scene matches the set worn by the second suspect.',
          reason: `Directly links ${characters[murdererIndex].name} to the interior of the study at the fatal moment.`,
        },
      ],
      solutionExplanation: `STEP 1: The crime took place between 9:28 PM and 9:35 PM in the locked study.\nSTEP 2: Guests who remained in the dining room have continuous corroboration from each other and the serving staff.\nSTEP 3: Only ${characters[murdererIndex].name} had an unaccounted window, possessed the missing key to the study, and left behind the matching cufflink near the desk!`,
    },
    clues: [
      {
        id: 'clue-1',
        round: 1,
        name: 'The Antique Damascene Letter Opener',
        type: 'physical',
        description: 'A curved ceremonial blade taken from the desk display, wiped clean of fingerprints except for a faint residue of digitalis oil.',
        flavorText: '"Kept under lock and key in the collector cabinet until tonight."',
        whoDiscoveredOrFound: 'Found on the study carpet beside the victim.',
      },
      {
        id: 'clue-2',
        round: 1,
        name: 'The Stamped Study Safe Receipt',
        type: 'document',
        description: 'A receipt for a newly altered trust deed naming charity as the sole heir, scheduled to be finalized tomorrow.',
        flavorText: 'Someone wanted this paper permanently destroyed.',
        whoDiscoveredOrFound: 'Retrieved from the top drawer of the rolltop desk.',
      },
      {
        id: 'clue-3',
        round: 2,
        name: 'The Broken Silver Monogram Cufflink',
        type: 'physical',
        description: 'A hand-engraved silver cufflink discovered beneath the velvet curtain near the balcony french doors.',
        flavorText: 'Bearing a distinctive geometric heraldic pattern.',
        whoDiscoveredOrFound: 'Discovered during the second room search.',
      },
      {
        id: 'clue-4',
        round: 2,
        name: 'The Encrypted Balcony Lock Riddle',
        type: 'cipher_puzzle',
        description: 'A scrap of paper found by the door with a numeric riddle for the antique brass tumbler lock.',
        flavorText: 'Left by the intruder during their hasty exit.',
        whoDiscoveredOrFound: 'Found caught in the door hinge.',
        puzzleData: {
          puzzleType: 'logic_riddle',
          puzzlePrompt: 'Solve the lock combination: "I am the square of 6 plus 4 (two digits: _ _)."',
          hint: '6 squared is 36. Add 4 to reach the answer.',
          solution: '40',
          revealedFact: `The lock was opened at 9:30 PM using combination 40, which only ${characters[murdererIndex].name} was recorded knowing!`,
        },
      },
      {
        id: 'clue-5',
        round: 3,
        name: 'The Damp Terrace Shoe Cast',
        type: 'physical',
        description: 'A crisp impression in the soft soil outside the balcony window, matching formal evening dress oxfords with a worn outer heel.',
        flavorText: 'Proves the killer fled across the balcony immediately following the act.',
        whoDiscoveredOrFound: 'Logged by the investigating host.',
      },
    ],
    hostGuide: {
      suggestedDinnerMenu: [
        { course: 'Welcome Cocktail', dish: 'The Midnight Alibi (Blackberry Gin Fizz)', wineOrDrinkPairing: 'Dry Prosecco with Rosemary Sprig' },
        { course: 'First Course (The Discovery)', dish: 'Truffled Wild Mushroom Velouté with Herb Croutons', wineOrDrinkPairing: 'Unoaked Chardonnay' },
        { course: 'Main Course (The Interrogation)', dish: 'Herb-Crusted Rack of Lamb or Portobello Wellington with Roasted Root Vegetables', wineOrDrinkPairing: 'Vintage Cabernet Sauvignon' },
        { course: 'Dessert (The Unmasking)', dish: 'Espresso Chocolate Mousse with Raspberry Dust', wineOrDrinkPairing: 'Late Harvest Port' },
      ],
      decorAndMusicTips: [
        'Place candles and dim ambient lighting across the dining table.',
        'Play classical or noir acoustic jazz playlist on low volume.',
        'Print individual character packets and place them at each seat in sealed envelopes.',
      ],
      openingScript: `Welcome, honored guests. Tonight we gather for an evening of elegance and celebration in ${opts.scenario}. But do not let the pleasant music fool you—hidden rivalries run deep. Please inspect your secret dossiers in private!`,
      round1Script: `Tragedy has struck our gathering! ${victimName} has been discovered dead in the private study! The doors are sealed until authorities arrive. Every one of us is under suspicion. Speak now: state your whereabouts during dinner!`,
      round2Script: `The room searches have yielded critical evidence: the murder weapon, the safe receipt, and a locked balcony entry. The killer is among us. Confront your fellow guests and demand the truth!`,
      round3Script: `The hour of reckoning is here! With the discovery of the broken cufflink and the terrace shoe prints, the net has closed. Make your final defenses before ballots are cast!`,
      conclusionScript: `The mystery is resolved! Step forward, ${characters[murdererIndex].name}! The broken cufflink, the uncorroborated timeline, and the combination to the balcony lock seal your guilt! What do you have to say?!`,
      accusationBallotInstructions: 'Mark your ballot in secret: 1) The Culprit, 2) The Weapon, 3) The True Motive.',
    },
  };
}
