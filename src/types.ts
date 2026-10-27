export type Difficulty = 'novice' | 'detective' | 'master';

export interface FloorRoom {
  room: string;
  description: string;
  keyItemsFound: string[];
}

export interface VictimInfo {
  name: string;
  title: string;
  causeOfDeath: string;
  timeOfDeath: string;
  discoveryCircumstances: string;
  coronerNotes: string;
}

export interface SuspectCharacter {
  id: string;
  name: string;
  archetype: string;
  bio: string;
  costumeAndPropGuide: string;
  publicSecret: string;
  darkSecret: string;
  motive: string;
  isMurderer: boolean;
  murderDetails?: {
    weaponUsed: string;
    opportunity: string;
    trueMotive: string;
    confessionMonologue: string;
    flawInAlibi: string;
  };
  alibi: {
    claimedStory: string;
    verifiedPart: string;
    unverifiedWindow: string;
  };
  roundGuidance: {
    round1: { whatToSay: string; whatToHide: string; questionToAskOthers: string };
    round2: { whatToSay: string; whatToHide: string; questionToAskOthers: string };
    round3: { whatToSay: string; defenseStrategy: string; finalStatement: string };
  };
}

export interface TimelineEvent {
  time: string;
  location: string;
  suspectName: string;
  action: string;
  isCorroborated: boolean;
  corroboratedBy?: string;
}

export interface DeductionRule {
  clueRef: string;
  statement: string;
  eliminatesSuspectName?: string;
  reason: string;
}

export interface LogicGridData {
  timeSlots: string[];
  rooms: string[];
  suspectNames: string[];
  timelineEvents: TimelineEvent[];
  deductionRules: DeductionRule[];
  solutionExplanation: string;
}

export interface PuzzleData {
  puzzleType: string;
  puzzlePrompt: string;
  hint: string;
  solution: string;
  revealedFact: string;
}

export interface GameClue {
  id: string;
  round: number; // 1, 2, or 3
  name: string;
  type: string;
  description: string;
  flavorText: string;
  whoDiscoveredOrFound: string;
  puzzleData?: PuzzleData;
  revealed?: boolean;
}

export interface DinnerMenuCourse {
  course: string;
  dish: string;
  wineOrDrinkPairing: string;
}

export interface HostGuide {
  suggestedDinnerMenu: DinnerMenuCourse[];
  decorAndMusicTips: string[];
  openingScript: string;
  round1Script: string;
  round2Script: string;
  round3Script: string;
  conclusionScript: string;
  accusationBallotInstructions: string;
}

export interface MysteryGame {
  id: string;
  createdAt: string;
  title: string;
  tagline: string;
  synopsis: string;
  difficulty: Difficulty;
  playerCount: number;
  setting: {
    locationName: string;
    era: string;
    atmosphere: string;
    dinnerPartyContext: string;
    floorPlan: FloorRoom[];
  };
  victim: VictimInfo;
  characters: SuspectCharacter[];
  logicGrid: LogicGridData;
  clues: GameClue[];
  hostGuide: HostGuide;
}

export interface AccusationSubmission {
  playerName: string;
  accusedSuspect: string;
  motiveTheory: string;
  weaponTheory: string;
  isCorrect?: boolean;
}
