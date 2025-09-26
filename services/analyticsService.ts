import type { AnonymousFeedbackData } from '../types';

const ANALYTICS_ID_KEY = 'addiction_support_anonymous_id';

/**
 * Generates a Version 4 UUID.
 * @returns A new UUID string.
 */
function generateUUID(): string {
    // A simple, browser-compatible UUID generator
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Retrieves or creates a persistent anonymous ID for analytics.
 * This ID is stored in localStorage and is not linked to user account data.
 * @returns The anonymous user ID.
 */
export function getAnonymousId(): string {
    let anonymousId = localStorage.getItem(ANALYTICS_ID_KEY);
    if (!anonymousId) {
        anonymousId = `anon_${generateUUID()}`;
        localStorage.setItem(ANALYTICS_ID_KEY, anonymousId);
    }
    return anonymousId;
}


/**
 * Simulates sending anonymous feedback data to a secure analytics endpoint.
 * In a real application, this would be an HTTP POST request to a server
 * responsible for collecting and processing this data for model training.
 * 
 * @param data - The anonymized feedback data package.
 */
export async function shareAnonymousFeedback(data: AnonymousFeedbackData): Promise<void> {
  console.log("--- Sending Anonymous Feedback for AI Improvement ---");
  console.log("This data packet is completely anonymous and contains no PII.");
  console.log(JSON.stringify(data, null, 2));
  console.log("-----------------------------------------------------");

  // In a real-world scenario, you would have something like:
  // await fetch('https://api.your-analytics-service.com/feedback', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });
  
  return Promise.resolve();
}
