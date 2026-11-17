import { FallbackAssistantIntentProvider } from '@/modules/assistant/data/providers/FallbackAssistantIntentProvider';
import { GeminiAssistantIntentProvider } from '@/modules/assistant/data/providers/GeminiAssistantIntentProvider';
import { LocalAssistantIntentProvider } from '@/modules/assistant/data/providers/LocalAssistantIntentProvider';
import type { AssistantIntentProvider } from '@/modules/assistant/domain/providers';

const NOW = new Date(2026, 10, 16, 10, 0, 0);

const geminiResponse = (payload: Record<string, unknown>) =>
  ({
    ok: true,
    status: 200,
    json: async () => ({
      candidates: [{ content: { parts: [{ text: JSON.stringify(payload) }] } }],
    }),
  }) as unknown as Response;

describe('assistant intent providers', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('local provider parses intents without network', async () => {
    const provider = new LocalAssistantIntentProvider();
    const result = await provider.detectIntent('Recuérdame pagar el internet mañana', {
      now: NOW,
    });

    expect(result.source).toBe('local');
    expect(result.intents[0]).toMatchObject({
      kind: 'task',
      title: 'Pagar el internet',
      dueDate: '2026-11-17',
    });
  });

  it('gemini provider maps a structured task response', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue(
      geminiResponse({
        intents: [
          {
            kind: 'task',
            title: 'Pagar el internet',
            priority: 'high',
            dueDate: '2026-11-17',
          },
        ],
      }),
    );

    const provider = new GeminiAssistantIntentProvider('test-key');
    const result = await provider.detectIntent('recuérdame pagar el internet mañana', {
      now: NOW,
    });

    expect(result.source).toBe('ai');
    expect(result.intents).toEqual([
      {
        kind: 'task',
        title: 'Pagar el internet',
        priority: 'high',
        dueDate: '2026-11-17',
      },
    ]);
  });

  it('returns one intent per item found in a multi-task message', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue(
      geminiResponse({
        intents: [
          { kind: 'task', title: 'Pagar la luz', dueDate: '2026-11-20' },
          { kind: 'task', title: 'Pagar el gas', dueDate: '2026-11-20' },
          { kind: 'task', title: 'Reclamar los exámenes médicos', dueDate: '2026-11-20' },
        ],
      }),
    );

    const provider = new GeminiAssistantIntentProvider('test-key');
    const result = await provider.detectIntent(
      'ayúdame a crear para el viernes debo pagar la luz y el gas y reclamar los exámenes médicos',
      { now: NOW },
    );

    expect(result.intents).toHaveLength(3);
    expect(result.intents.map((intent) => intent.title)).toEqual([
      'Pagar la luz',
      'Pagar el gas',
      'Reclamar los exámenes médicos',
    ]);
  });

  it('falls back to the local parser when the AI request fails', async () => {
    jest.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));

    const primary: AssistantIntentProvider = {
      detectIntent: async () => {
        throw new Error('offline');
      },
    };
    const provider = new FallbackAssistantIntentProvider(
      primary,
      new LocalAssistantIntentProvider(),
    );
    const result = await provider.detectIntent('Gasté $180 en comida hoy', { now: NOW });

    expect(result.source).toBe('local');
    expect(result.usedFallback).toBe(true);
    expect(result.intents[0]).toMatchObject({
      kind: 'expense',
      amount: 180,
      category: 'food',
    });
  });
});
