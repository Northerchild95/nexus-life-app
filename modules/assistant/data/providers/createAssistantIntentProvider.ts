import type { AssistantIntentProvider } from '@/modules/assistant/domain/providers';

import { FallbackAssistantIntentProvider } from './FallbackAssistantIntentProvider';
import { GeminiAssistantIntentProvider } from './GeminiAssistantIntentProvider';
import { LocalAssistantIntentProvider } from './LocalAssistantIntentProvider';

/**
 * EXPO_PUBLIC_* values are inlined into the app bundle. This is acceptable for
 * a personal project; a production app should proxy Gemini through a backend
 * so the API key is never shipped to clients.
 */
export function createAssistantIntentProvider(): AssistantIntentProvider {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY?.trim();
  const local = new LocalAssistantIntentProvider();

  if (!apiKey) return local;

  return new FallbackAssistantIntentProvider(
    new GeminiAssistantIntentProvider(apiKey),
    local,
  );
}
