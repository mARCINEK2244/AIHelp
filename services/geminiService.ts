import { GoogleGenAI, Type } from "@google/genai";
import type { UserInfo, CravingDetails, Substance, CravingLog, AIResponse, FeedbackMemory } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not set. Using a placeholder. App may not function correctly.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_PROMPT = `Jesteś „AI Asystentem Wsparcia”. Twoja rola: motywacja, psychoedukacja, mikro-plany, analiza wzorców z historii i feedbacku użytkownika. 
Nie diagnozujesz, nie udzielasz porad medycznych. W kryzysie kieruj do profesjonalnej pomocy.

Używaj zgromadzonych danych (Profile, History, FeedbackMemory) do personalizacji: co działało/nie działało, typowe wyzwalacze, pory dnia, przebieg objawów, skuteczność strategii.

Po wygenerowaniu planu możesz zaproponować 1–2 krótkie PYTANIA UZUPEŁNIAJĄCE (wielokrotnego wyboru lub krótki input), które pomogą lepiej dopasować przyszłe porady. Pytania muszą być proste, jednoznaczne i zamknięte, z max 4 opcjami.

Wykrywaj niepokojące trendy (np. rosnąca suma objawów 3+ dni, piki wieczorne, strategia X przestała działać). W ostrzeżeniach bądź empatyczny i konkretny, zaproponuj korektę planu.

FORMAT ODPOWIEDZI (JSON):
{
  "language": "auto",
  "summary": "1-2 zdania o stanie",
  "insight": "konkretna obserwacja z historii/feedbacku",
  "plan": [
    {"step":"...", "duration":"...", "why":"krótkie uzasadnienie oparte o dane"}
  ],
  "if_trigger_then_strategy":[{"trigger":"...", "strategy":"..."}],
  "motivation":"1 zdanie",
  "reflect_question":"1 pytanie do autorefleksji",
  "followup_questions":[
    {
      "id":"fq_01",
      "type":"single|multi|text",
      "question":"...",
      "options":["A","B","C","D"]
    }
  ],
  "trend_warning":{
    "is_flagged": true|false,
    "message": "krótkie ostrzeżenie i wskazówka",
    "suggested_adjustment": "jedno zdanie, co zmienić"
  },
  "crisis":{
    "is_flagged": true|false,
    "message":"...",
    "hotlines":["116 123","112"]
  }
}
Zwracaj WYŁĄCZNIE poprawny JSON (bez markdown).`;

const responseSchema: any = {
    type: Type.OBJECT,
    properties: {
        language: { type: Type.STRING },
        summary: { type: Type.STRING },
        insight: { type: Type.STRING },
        plan: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    step: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    why: { type: Type.STRING, description: "Krótkie uzasadnienie oparte o dane" }
                },
                required: ['step', 'duration', 'why']
            }
        },
        if_trigger_then_strategy: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: { trigger: { type: Type.STRING }, strategy: { type: Type.STRING } },
                required: ['trigger', 'strategy']
            }
        },
        motivation: { type: Type.STRING },
        reflect_question: { type: Type.STRING },
        followup_questions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING },
                    type: { type: Type.STRING },
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['id', 'type', 'question']
            }
        },
        trend_warning: {
            type: Type.OBJECT,
            properties: {
                is_flagged: { type: Type.BOOLEAN },
                message: { type: Type.STRING },
                suggested_adjustment: { type: Type.STRING }
            },
            required: ['is_flagged', 'message', 'suggested_adjustment']
        },
        crisis: {
            type: Type.OBJECT,
            properties: { is_flagged: { type: Type.BOOLEAN }, message: { type: Type.STRING }, hotlines: { type: Type.ARRAY, items: { type: Type.STRING } } },
            required: ['is_flagged', 'message', 'hotlines']
        }
    },
    required: ['language', 'summary', 'insight', 'plan', 'if_trigger_then_strategy', 'motivation', 'reflect_question', 'followup_questions', 'trend_warning', 'crisis']
};

const defaultCrisisResponse: AIResponse = {
    language: "pl",
    summary: "Wykryto potencjalny kryzys. Skup się na swoim bezpieczeństwie.",
    insight: "To ważne, aby w trudnych chwilach sięgnąć po pomoc.",
    plan: [
        { step: "Zadzwoń teraz do zaufanej osoby i powiedz: 'Jest mi bardzo ciężko, potrzebuję rozmowy'.", duration: "3-5 min", why: "Kontakt z bliską osobą jest kluczowy w kryzysie." },
        { step: "Jeśli jesteś sam/a: weź telefon i wybierz 116 123 (pomoc kryzysowa) lub 112 w nagłym zagrożeniu.", duration: "2 min", why: "Specjaliści są dostępni, by Ci pomóc." }
    ],
    if_trigger_then_strategy: [],
    motivation: "Nie jesteś z tym sam/a. Sięganie po pomoc to akt siły i odwagi.",
    reflect_question: "Kto jest Twoją pierwszą osobą do kontaktu w trudnej sytuacji?",
    followup_questions: [],
    trend_warning: {
      is_flagged: false,
      message: "",
      suggested_adjustment: ""
    },
    crisis: {
        is_flagged: true,
        message: "Jeśli czujesz, że Twoje życie lub zdrowie jest zagrożone, natychmiast zadzwoń pod numer 112 lub 116 123. Możesz też porozmawiać z kimś bliskim. Twoje bezpieczeństwo jest najważniejsze.",
        hotlines: ["116 123 – Telefon zaufania dla osób dorosłych w kryzysie emocjonalnym", "112 – Numer alarmowy w nagłych sytuacjach"]
    }
};


const calculateAbstinenceDuration = (startDate: string): string => {
  const start = new Date(startDate);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m`;
};

export async function getCopingStrategies(
  substance: Substance,
  userInfo: UserInfo,
  cravingHistory: CravingLog[],
  currentCravingDetails: CravingDetails,
  currentTriggers: string[],
  feedbackMemory: FeedbackMemory
): Promise<AIResponse> {
  
  const abstinenceClock = calculateAbstinenceDuration(userInfo.abstinenceStart);

  const last14DaysHistory = cravingHistory.filter(log => {
      const logDate = new Date(log.timestamp);
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
      return logDate >= fourteenDaysAgo;
  });

  const developerPrompt = `
KONTEXT_APKI:
- Substance: "${substance.name}"
- AbstinenceClock: "${abstinenceClock}"
- TodayDiary: ${JSON.stringify(currentCravingDetails)}
- TodayTriggers: ${JSON.stringify(currentTriggers)}
- HistoryWindow14d: ${JSON.stringify(last14DaysHistory)}
- FeedbackMemory: ${JSON.stringify(feedbackMemory)}
- UserProfile: ${JSON.stringify(userInfo)}
- Locale: "pl-PL"

ZADANIE:
1) Oceń dzisiejszy stan vs. rolling averages (↑/↓).
2) Wygeneruj 1–2 kroki planu dostosowane do preferencji i skuteczności z FeedbackMemory (preferuj to, co działało).
3) Zmapuj 2+ wyzwalacze na strategie, unikaj strategii oznaczonych jako "not_effective".
4) Dodaj 1 refleksję, 1 zdanie motywacji.
5) Zaproponuj 1–2 followup_questions, które pomogą lepiej dobrać przyszłe interwencje (np. „Dlaczego dziś nie zadziałał spacer?” z opcjami).
6) Jeśli metryki trendów (dostarczone w HistoryWindow14d/FeedbackMemory) przekraczają progi – uzupełnij trend_warning.
7) W razie sygnałów kryzysowych ustaw crisis.is_flagged=true i podaj komunikat + numery.

Zachowaj format JSON z System Prompt.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: developerPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    // Basic validation to ensure the parsed object matches the expected structure
    if (result && result.crisis && Array.isArray(result.plan)) {
      return result as AIResponse;
    }

    console.error('Invalid JSON structure in AI response', result);
    return defaultCrisisResponse;

  } catch (error) {
    console.error("Error generating content from Gemini:", error);
    return defaultCrisisResponse;
  }
}