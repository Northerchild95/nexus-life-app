import type { AssistantIntent } from '../entities';

export type AssistantIntentSource = 'ai' | 'local';

export type DetectIntentOptions = {
  /** Injectable clock so providers resolve relative dates deterministically. */
  now?: Date;
};

export type AssistantIntentResult = {
  /** One entry per actionable item found in the message (can be several). */
  intents: AssistantIntent[];
  /** Conversational answer for messages that don't map to an action. */
  reply?: string | null;
  /** Which provider produced the result, useful for UI/debug diagnostics. */
  source: AssistantIntentSource;
  /** True when the AI provider failed and the local parser answered instead. */
  usedFallback: boolean;
};

/**
 * Abstracts intent detection so the presentation layer doesn't know whether a
 * remote LLM or the on-device keyword parser answered.
 */
export interface AssistantIntentProvider {
  detectIntent(
    text: string,
    options?: DetectIntentOptions,
  ): Promise<AssistantIntentResult>;
}
