import type { AssistantIntent } from '@/modules/assistant/domain/entities';
import type { ExpenseCategory } from '@/modules/finance/domain/entities';
import type { TaskPriority } from '@/modules/tasks/domain/entities';
import type {
  AssistantIntentProvider,
  AssistantIntentResult,
  DetectIntentOptions,
} from '@/modules/assistant/domain/providers';

const DEFAULT_MODEL = 'gemini-3.1-flash-lite';
const TIMEOUT_MS = 15000;

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'food',
  'transport',
  'entertainment',
  'shopping',
  'health',
  'bills',
  'education',
  'other',
  'custom',
];
const TASK_PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];

type GeminiResponse = {
  candidates?: {
    content?: { parts?: { text?: string }[] };
  }[];
};

const pad = (value: number) => `${value}`.padStart(2, '0');

const toDayKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const isDayKey = (value: unknown): value is string =>
  typeof value === 'string' &&
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(new Date(`${value}T00:00:00`).getTime());

const asRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null;

/**
 * Gemini-backed intent detection. Uses structured JSON output so the model
 * returns exactly the contract the app can execute; malformed answers throw so
 * the factory can fall back to the local parser.
 */
export class GeminiAssistantIntentProvider implements AssistantIntentProvider {
  private readonly endpoint: string;

  constructor(
    private readonly apiKey: string,
    model = process.env.EXPO_PUBLIC_GEMINI_MODEL?.trim() || DEFAULT_MODEL,
  ) {
    this.endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  }

  async detectIntent(
    text: string,
    options?: DetectIntentOptions,
  ): Promise<AssistantIntentResult> {
    const today = toDayKey(options?.now ?? new Date());
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.apiKey,
        },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: [
                    'You extract EVERY actionable item from a personal-assistant message.',
                    `Today is ${today}. Use it to resolve relative days such as "tomorrow" or "Friday".`,
                    'Return one "intents" entry for EACH separate thing the user wants to create.',
                    'Never merge several items into one title: "pay light and gas and collect medical results" is 3 separate tasks.',
                    'Use "expense" only for an already recorded/past payment with an amount.',
                    'Use "task" for pending actions and future payments.',
                    'If there is nothing actionable, return an empty "intents" array and a short friendly "reply" in the same language as the user (2 sentences max).',
                    'Never invent data or numbers you do not have.',
                    'Never claim anything was saved or created; drafts are only stored after the user confirms.',
                    `Valid expense categories: ${EXPENSE_CATEGORIES.join(', ')}.`,
                    `Valid task priorities: ${TASK_PRIORITIES.join(', ')}.`,
                    `Message: ${text}`,
                  ].join('\n'),
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0,
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties: {
                reply: { type: 'STRING' },
                intents: {
                  type: 'ARRAY',
                  items: {
                    type: 'OBJECT',
                    properties: {
                      kind: { type: 'STRING', enum: ['expense', 'task'] },
                      title: { type: 'STRING' },
                      amount: { type: 'NUMBER' },
                      category: { type: 'STRING', enum: EXPENSE_CATEGORIES },
                      date: { type: 'STRING' },
                      dueDate: { type: 'STRING' },
                      priority: { type: 'STRING', enum: TASK_PRIORITIES },
                    },
                    required: ['kind', 'title'],
                  },
                },
              },
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini request failed (${response.status})`);
      }

      const payload = (await response.json()) as GeminiResponse;
      const rawText = payload.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? '')
        .join('');

      if (!rawText) throw new Error('Gemini returned an empty response');

      const parsed = asRecord(JSON.parse(rawText));
      if (!parsed) throw new Error('Gemini returned a malformed payload');

      const rawIntents = Array.isArray(parsed.intents) ? parsed.intents : [];
      const intents = rawIntents
        .map((item) => this.toIntent(asRecord(item) ?? {}, today))
        .filter((intent): intent is AssistantIntent => intent !== null);

      const reply = typeof parsed.reply === 'string' ? parsed.reply.trim() : '';

      return {
        intents,
        reply: reply || null,
        source: 'ai',
        usedFallback: false,
      };
    } finally {
      clearTimeout(timeout);
    }
  }

  private toIntent(data: Record<string, unknown>, today: string): AssistantIntent | null {
    if (data.kind === 'expense') {
      const amount =
        typeof data.amount === 'number' ? data.amount : Number(data.amount ?? 0);
      if (!Number.isFinite(amount) || amount <= 0) return null;

      const category = EXPENSE_CATEGORIES.includes(data.category as ExpenseCategory)
        ? (data.category as ExpenseCategory)
        : 'other';

      return {
        kind: 'expense',
        title: typeof data.title === 'string' ? data.title.trim() : '',
        amount,
        category,
        date: isDayKey(data.date) ? data.date : today,
      };
    }

    if (data.kind === 'task') {
      const priority = TASK_PRIORITIES.includes(data.priority as TaskPriority)
        ? (data.priority as TaskPriority)
        : 'medium';

      return {
        kind: 'task',
        title: typeof data.title === 'string' ? data.title.trim() : '',
        priority,
        dueDate: isDayKey(data.dueDate) ? data.dueDate : today,
      };
    }

    return null;
  }
}
