import type {
  AssistantIntentProvider,
  AssistantIntentResult,
  DetectIntentOptions,
} from '@/modules/assistant/domain/providers';

/** Tries the AI provider first and silently degrades to the local parser. */
export class FallbackAssistantIntentProvider implements AssistantIntentProvider {
  constructor(
    private readonly primary: AssistantIntentProvider,
    private readonly fallback: AssistantIntentProvider,
  ) {}

  async detectIntent(
    text: string,
    options?: DetectIntentOptions,
  ): Promise<AssistantIntentResult> {
    try {
      return await this.primary.detectIntent(text, options);
    } catch {
      return {
        ...(await this.fallback.detectIntent(text, options)),
        usedFallback: true,
      };
    }
  }
}
