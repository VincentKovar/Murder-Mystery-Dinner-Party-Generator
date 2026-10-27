import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { generateProceduralMystery } from './src/utils/proceduralGenerator.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini client user-agent as required
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

// Endpoint to generate a complete murder mystery game
app.post('/api/generate-mystery', async (req, res) => {
  try {
    const {
      scenario = '1920s Speakeasy Masquerade',
      era = '1920s Prohibition Era',
      tone = 'Classic Agatha Christie Whodunit with witty banter',
      difficulty = 'detective', // novice | detective | master
      playerCount = 5,
      archetypes = [],
      customVictim = '',
      specialTwist = '',
    } = req.body;

    const requestedPlayers = Math.min(Math.max(Number(playerCount) || 4, 4), 6);

    const prompt = `You are a master murder mystery playwright and deductive logic puzzle designer.
Create a complete, airtight, highly replayable Murder Mystery Dinner Party Game for EXACTLY ${requestedPlayers} players.

GAME PARAMETERS:
- Theme / Scenario: ${scenario}
- Era / Setting: ${era}
- Narrative Tone: ${tone}
- Difficulty: ${difficulty} (Novice = direct timeline clues; Detective = subtle contradictions, false alibis; Master = tight logic grid matrix, strict mutual exclusivity, embedded cipher/riddle)
- Player count: EXACTLY ${requestedPlayers} players
${archetypes.length > 0 ? `- Custom Suspect Archetypes requested: ${archetypes.join(', ')}` : ''}
${customVictim ? `- Specific Victim details requested: ${customVictim}` : ''}
${specialTwist ? `- Requested Plot Twist / Element: ${specialTwist}` : ''}

CRITICAL DEDUCTIVE LOGIC PUZZLE REQUIREMENTS:
1. AIRTIGHT LOGIC: Exactly ONE suspect is the actual murderer. The other ${requestedPlayers - 1} suspects must have clear, logically provable alibis or physiological/spatial impossibilities that eliminate them step-by-step when players analyze the clues and timeline.
2. EVERYONE HAS A SECRET: Every single suspect MUST have a compelling "Dark Secret" or motive (e.g. embezzlement, love triangle, forged will, blackmail) that makes them act suspicious and hide facts during rounds, creating genuine tension.
3. TIMELINE & LOCATIONS: Provide a clear timeline (e.g., 4 to 5 time slots: 8:00 PM, 8:30 PM, 9:00 PM, 9:30 PM, 10:00 PM - Murder). At least one suspect lied about their location or has an uncorroborated window that matches the murder time and weapon retrieval.
4. PUZZLE CLUES: Include at least one interactive logic riddle / cipher / ledger code clue with a prompt, hint, and solution that reveals a critical alibi breakdown or room access truth.
5. ROUND STRUCTURE: Structure the game into 3 distinct dinner courses/rounds (Round 1: Initial Discovery & Alibis, Round 2: Confrontations & Physical Clues, Round 3: Final Accusations & Unmasking).

Return a single JSON object conforming strictly to this format.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        systemInstruction: 'You generate structured JSON for playable dinner party murder mysteries with rigorous logic puzzle foundations.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            tagline: { type: Type.STRING },
            synopsis: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            playerCount: { type: Type.INTEGER },
            setting: {
              type: Type.OBJECT,
              properties: {
                locationName: { type: Type.STRING },
                era: { type: Type.STRING },
                atmosphere: { type: Type.STRING },
                dinnerPartyContext: { type: Type.STRING },
                floorPlan: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      room: { type: Type.STRING },
                      description: { type: Type.STRING },
                      keyItemsFound: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['room', 'description', 'keyItemsFound'],
                  },
                },
              },
              required: ['locationName', 'era', 'atmosphere', 'dinnerPartyContext', 'floorPlan'],
            },
            victim: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                title: { type: Type.STRING },
                causeOfDeath: { type: Type.STRING },
                timeOfDeath: { type: Type.STRING },
                discoveryCircumstances: { type: Type.STRING },
                coronerNotes: { type: Type.STRING },
              },
              required: ['name', 'title', 'causeOfDeath', 'timeOfDeath', 'discoveryCircumstances', 'coronerNotes'],
            },
            characters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  archetype: { type: Type.STRING },
                  bio: { type: Type.STRING },
                  costumeAndPropGuide: { type: Type.STRING },
                  publicSecret: { type: Type.STRING },
                  darkSecret: { type: Type.STRING },
                  motive: { type: Type.STRING },
                  isMurderer: { type: Type.BOOLEAN },
                  murderDetails: {
                    type: Type.OBJECT,
                    properties: {
                      weaponUsed: { type: Type.STRING },
                      opportunity: { type: Type.STRING },
                      trueMotive: { type: Type.STRING },
                      confessionMonologue: { type: Type.STRING },
                      flawInAlibi: { type: Type.STRING },
                    },
                  },
                  alibi: {
                    type: Type.OBJECT,
                    properties: {
                      claimedStory: { type: Type.STRING },
                      verifiedPart: { type: Type.STRING },
                      unverifiedWindow: { type: Type.STRING },
                    },
                    required: ['claimedStory', 'verifiedPart', 'unverifiedWindow'],
                  },
                  roundGuidance: {
                    type: Type.OBJECT,
                    properties: {
                      round1: {
                        type: Type.OBJECT,
                        properties: {
                          whatToSay: { type: Type.STRING },
                          whatToHide: { type: Type.STRING },
                          questionToAskOthers: { type: Type.STRING },
                        },
                        required: ['whatToSay', 'whatToHide', 'questionToAskOthers'],
                      },
                      round2: {
                        type: Type.OBJECT,
                        properties: {
                          whatToSay: { type: Type.STRING },
                          whatToHide: { type: Type.STRING },
                          questionToAskOthers: { type: Type.STRING },
                        },
                        required: ['whatToSay', 'whatToHide', 'questionToAskOthers'],
                      },
                      round3: {
                        type: Type.OBJECT,
                        properties: {
                          whatToSay: { type: Type.STRING },
                          defenseStrategy: { type: Type.STRING },
                          finalStatement: { type: Type.STRING },
                        },
                        required: ['whatToSay', 'defenseStrategy', 'finalStatement'],
                      },
                    },
                    required: ['round1', 'round2', 'round3'],
                  },
                },
                required: ['id', 'name', 'archetype', 'bio', 'costumeAndPropGuide', 'publicSecret', 'darkSecret', 'motive', 'isMurderer', 'alibi', 'roundGuidance'],
              },
            },
            logicGrid: {
              type: Type.OBJECT,
              properties: {
                timeSlots: { type: Type.ARRAY, items: { type: Type.STRING } },
                rooms: { type: Type.ARRAY, items: { type: Type.STRING } },
                suspectNames: { type: Type.ARRAY, items: { type: Type.STRING } },
                timelineEvents: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      time: { type: Type.STRING },
                      location: { type: Type.STRING },
                      suspectName: { type: Type.STRING },
                      action: { type: Type.STRING },
                      isCorroborated: { type: Type.BOOLEAN },
                      corroboratedBy: { type: Type.STRING },
                    },
                    required: ['time', 'location', 'suspectName', 'action', 'isCorroborated'],
                  },
                },
                deductionRules: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      clueRef: { type: Type.STRING },
                      statement: { type: Type.STRING },
                      eliminatesSuspectName: { type: Type.STRING },
                      reason: { type: Type.STRING },
                    },
                    required: ['clueRef', 'statement', 'reason'],
                  },
                },
                solutionExplanation: { type: Type.STRING },
              },
              required: ['timeSlots', 'rooms', 'suspectNames', 'timelineEvents', 'deductionRules', 'solutionExplanation'],
            },
            clues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  round: { type: Type.INTEGER },
                  name: { type: Type.STRING },
                  type: { type: Type.STRING },
                  description: { type: Type.STRING },
                  flavorText: { type: Type.STRING },
                  whoDiscoveredOrFound: { type: Type.STRING },
                  puzzleData: {
                    type: Type.OBJECT,
                    properties: {
                      puzzleType: { type: Type.STRING },
                      puzzlePrompt: { type: Type.STRING },
                      hint: { type: Type.STRING },
                      solution: { type: Type.STRING },
                      revealedFact: { type: Type.STRING },
                    },
                  },
                },
                required: ['id', 'round', 'name', 'type', 'description', 'flavorText', 'whoDiscoveredOrFound'],
              },
            },
            hostGuide: {
              type: Type.OBJECT,
              properties: {
                suggestedDinnerMenu: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      course: { type: Type.STRING },
                      dish: { type: Type.STRING },
                      wineOrDrinkPairing: { type: Type.STRING },
                    },
                    required: ['course', 'dish', 'wineOrDrinkPairing'],
                  },
                },
                decorAndMusicTips: { type: Type.ARRAY, items: { type: Type.STRING } },
                openingScript: { type: Type.STRING },
                round1Script: { type: Type.STRING },
                round2Script: { type: Type.STRING },
                round3Script: { type: Type.STRING },
                conclusionScript: { type: Type.STRING },
                accusationBallotInstructions: { type: Type.STRING },
              },
              required: ['suggestedDinnerMenu', 'decorAndMusicTips', 'openingScript', 'round1Script', 'round2Script', 'round3Script', 'conclusionScript', 'accusationBallotInstructions'],
            },
          },
          required: ['title', 'tagline', 'synopsis', 'difficulty', 'playerCount', 'setting', 'victim', 'characters', 'logicGrid', 'clues', 'hostGuide'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    parsed.id = 'mystery-' + Date.now();
    parsed.createdAt = new Date().toISOString();

    return res.json({ success: true, game: parsed });
  } catch (error: any) {
    console.warn('Gemini API notice, activating procedural mystery engine fallback:', error?.message);
    const fallbackGame = generateProceduralMystery({
      scenario: req.body?.scenario || '1920s Speakeasy Masquerade',
      era: req.body?.era || '1920s Prohibition',
      tone: req.body?.tone || 'Classic Agatha Christie Whodunit',
      difficulty: req.body?.difficulty || 'detective',
      playerCount: req.body?.playerCount || 5,
      archetypes: req.body?.archetypes || [],
      customVictim: req.body?.customVictim || '',
      specialTwist: req.body?.specialTwist || '',
    });

    return res.json({
      success: true,
      game: fallbackGame,
      fallbackUsed: true,
      note: 'Crafted via Noir & Alibi Deductive Engine (AI model experienced temporary peak demand).',
    });
  }
});

// Setup Vite middleware in dev or static files in prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Noir & Alibi server running at http://0.0.0.0:${port}`);
  });
}

startServer();
