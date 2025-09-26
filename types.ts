// Fix: Removed circular import of AIResponse. The type is defined and exported within this file.

export interface Substance {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  symptoms: string[];
}

export interface CravingDetails {
  [symptomKey: string]: number; // Intensity from 1 to 10
}

export interface CravingLog {
  timestamp: string;
  details: CravingDetails;
  triggers: string[];
  totalIntensity: number; 
}

export interface UserInfo {
  age: number;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  abstinenceStart: string; // ISO date string
  allowAnonymousCollection: boolean; // Added for v3.2
  triggers: string[];
}

// Represents the currently logged-in user
export interface AuthUser {
    id: string;
    email: string;
}

// ---- Data Schemas for AI Memory & Feedback v3.1 ----

export interface StrategyEffectiveness {
    [strategyName: string]: {
        uses: number;
        avg_help: number;
        last_used?: string;
        tag?: 'not_effective';
    }
}

export interface TriggerMap {
    [triggerName: string]: {
        count: number;
        top_strategy: string;
    }
}

export interface TimeHeatmap {
    [timeSlot: string]: number;
}

export interface RollingAverages {
    craving_3d_avg: number;
    craving_7d_avg: number;
    slope_3d: number;
    evening_peak_ratio: number;
}

export interface FeedbackMemory {
    strategy_effectiveness: StrategyEffectiveness;
    trigger_map: TriggerMap;
    time_heatmap: TimeHeatmap;
    rolling: RollingAverages;
    last_updated: string;
}

// Represents the data structure for a single user's app state
export interface UserAppData {
    selectedSubstance: Substance | null;
    userInfo: UserInfo | null;
    cravingLogs: CravingLog[];
    feedbackMemory?: FeedbackMemory; // Added for v3.1
}

// ---- AI Response Types v3.1 ----

export interface FollowupQuestion {
  id: string;
  type: 'single' | 'multi' | 'text';
  question: string;
  options?: string[];
}

export interface TrendWarning {
  is_flagged: boolean;
  message: string;
  suggested_adjustment: string;
}

export interface AIPlanStep {
  step: string;
  duration: string;
  why: string;
}

export interface AITriggerStrategy {
  trigger: string;
  strategy: string;
}

export interface AICrisisInfo {
  is_flagged: boolean;
  message: string;
  hotlines: string[];
}

export interface AIResponse {
  language: string;
  summary: string;
  insight: string;
  plan: AIPlanStep[];
  if_trigger_then_strategy: AITriggerStrategy[];
  motivation: string;
  reflect_question: string;
  followup_questions: FollowupQuestion[];
  trend_warning: TrendWarning;
  crisis: AICrisisInfo;
}

// --- Analytics Types v3.2 ---

/**
 * Defines the structure for an anonymous feedback data packet.
 * This packet contains the user's problem, the AI's proposed solution,
 * and the user's feedback, with all PII removed.
 */
export interface AnonymousFeedbackData {
  anonymousUserId: string;
  timestamp: string;
  problem: {
    substanceId: string;
    cravingDetails: CravingDetails;
    cravingTriggers: string[];
    cravingTotalIntensity: number;
  };
  solution: AIResponse | null;
  feedback: {
    followupAnswers: { [key: string]: string | string[] };
  };
}