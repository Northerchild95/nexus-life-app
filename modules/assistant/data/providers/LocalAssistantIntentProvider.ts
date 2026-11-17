import { parseAssistantIntent } from '@/modules/assistant/domain/parsers';
import type {
  AssistantIntentProvider,
  AssistantIntentResult,
  DetectIntentOptions,
} from '@/modules/assistant/domain/providers';

/** On-device keyword parser. Always available, no network required. */
export class LocalAssistantIntentProvider implements AssistantIntentProvider {
  async detectIntent(
    text: string,
    options?: DetectIntentOptions,
  ): Promise<AssistantIntentResult> {
    const intent = parseAssistantIntent(text, { now: options?.now });

    return {
      intents: intent ? [intent] : [],
      reply: null,
      source: 'local',
      usedFallback: false,
    };
  }
}
