import type { ExpenseCategory } from '@/modules/finance/domain/entities';
import type { TaskPriority } from '@/modules/tasks/domain/entities';

import type { AssistantIntent } from '../entities';

export type AssistantIntentParserOptions = {
  /** Injectable clock so the parser is deterministic in tests. */
  now?: Date;
};

type CategoryRule = {
  category: ExpenseCategory;
  keywords: string[];
};

type WeekdayRule = {
  day: number;
  keywords: string[];
};

const WORD_START = '(^|[^a-záéíóúüñ])';
const WORD_END = '(?=$|[^a-záéíóúüñ])';

const EXPENSE_HINT = new RegExp(
  `${WORD_START}(?:spent|spend|bought|buy|purchased?|paid|gast[eé]|gastar|compr[eé]|comprar|pagu[eé]|pagar|cost[oó]|cost)${WORD_END}`,
  'i',
);

const TASK_HINT = new RegExp(
  `${WORD_START}(?:task|tarea|remind|reminder|recu[eé]rdame|recordar|to-?do|pendiente|need to|have to|tengo que|debo|necesito)${WORD_END}`,
  'i',
);

const ACTION_REQUEST_HINT = new RegExp(
  `${WORD_START}(?:buy|purchase|pay|call|send|book|finish|review|clean|study|prepare|schedule|comprar|pagar|llamar|enviar|reservar|terminar|revisar|limpiar|estudiar|preparar|agendar)${WORD_END}`,
  'i',
);

const CATEGORY_RULES: CategoryRule[] = [
  {
    category: 'food',
    keywords: [
      'food',
      'lunch',
      'dinner',
      'breakfast',
      'coffee',
      'restaurant',
      'groceries',
      'supermarket',
      'pizza',
      'burger',
      'comida',
      'almuerzo',
      'cena',
      'desayuno',
      'café',
      'cafe',
      'restaurante',
      'supermercado',
      'mercado',
      'comida rápida',
    ],
  },
  {
    category: 'transport',
    keywords: [
      'transport',
      'transportation',
      'uber',
      'taxi',
      'bus',
      'metro',
      'subway',
      'train',
      'flight',
      'fuel',
      'gas',
      'gasoline',
      'parking',
      'transporte',
      'tren',
      'vuelo',
      'gasolina',
      'combustible',
      'estacionamiento',
    ],
  },
  {
    category: 'bills',
    keywords: [
      'bill',
      'rent',
      'internet',
      'electricity',
      'water',
      'phone',
      'subscription',
      'insurance',
      'factura',
      'alquiler',
      'electricidad',
      'luz',
      'agua',
      'teléfono',
      'telefono',
      'suscripción',
      'suscripcion',
      'seguro',
      'servicios',
    ],
  },
  {
    category: 'entertainment',
    keywords: [
      'movie',
      'cinema',
      'netflix',
      'spotify',
      'game',
      'concert',
      'drinks',
      'entertainment',
      'cine',
      'juego',
      'concierto',
      'copas',
      'ocio',
    ],
  },
  {
    category: 'shopping',
    keywords: [
      'shopping',
      'shop',
      'clothes',
      'shoes',
      'amazon',
      'gift',
      'compras',
      'ropa',
      'zapatos',
      'regalo',
      'tienda',
    ],
  },
  {
    category: 'health',
    keywords: [
      'health',
      'pharmacy',
      'doctor',
      'medicine',
      'dentist',
      'gym',
      'salud',
      'farmacia',
      'médico',
      'medico',
      'medicina',
      'dentista',
      'gimnasio',
    ],
  },
  {
    category: 'education',
    keywords: [
      'course',
      'book',
      'education',
      'school',
      'university',
      'tuition',
      'curso',
      'libro',
      'educación',
      'educacion',
      'escuela',
      'universidad',
      'matrícula',
      'matricula',
    ],
  },
];

const WEEKDAY_RULES: WeekdayRule[] = [
  { day: 1, keywords: ['monday', 'lunes'] },
  { day: 2, keywords: ['tuesday', 'martes'] },
  { day: 3, keywords: ['wednesday', 'miércoles', 'miercoles'] },
  { day: 4, keywords: ['thursday', 'jueves'] },
  { day: 5, keywords: ['friday', 'viernes'] },
  { day: 6, keywords: ['saturday', 'sábado', 'sabado'] },
  { day: 0, keywords: ['sunday', 'domingo'] },
];

const DATE_EXPRESSIONS: RegExp[] = [
  /\b(?:today|tomorrow|tonight|yesterday|the day after tomorrow)\b/gi,
  /\b(?:hoy|mañana|ayer|anteayer|pasado mañana|esta semana|esta tarde|esta noche|pr[oó]xima semana)\b/gi,
  /\b(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi,
  /\b(?:lunes|martes|mi[eé]rcoles|jueves|viernes|s[aá]bado|domingo)\b/gi,
  /\b\d{4}-\d{1,2}-\d{1,2}\b/gi,
  /\b\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?\b/gi,
  /\b(?:in|dentro de)\s+\d{1,2}\s+(?:days?|d[ií]as?)\b/gi,
  /\b(?:next|this)\s+week\b/gi,
];

const TASK_PREFIXES: RegExp[] = [
  /^\s*(?:please\s+)?remind\s+me(?:\s+to)?\s+/i,
  /^\s*(?:please\s+)?remember\s+to\s+/i,
  /^\s*recu[eé]rdame(?:\s+que)?\s+/i,
  /^\s*recordar(?:\s+que)?\s+/i,
  /^\s*(?:please\s+)?(?:add|create|make)\s+(?:a\s+|an\s+|the\s+)?(?:(?:high|medium|low)\s+priority\s+)?(?:task|to-?do|reminder)\s*(?:to\s+|for\s+|about\s+)?/i,
  /^\s*(?:please\s+)?new\s+(?:task|to-?do|reminder)\s*(?:to\s+|for\s+|about\s+)?/i,
  /^\s*(?:agrega|a[ñn]ade|crea|crear)\s+(?:una\s+|un\s+|la\s+)?(?:tarea|pendiente|recordatorio)\s*(?:de\s+|para\s+|que\s+)?/i,
  /^\s*nueva\s+tarea\s*(?:de\s+|para\s+|que\s+)?/i,
  /^\s*(?:tengo\s+que|debo|necesito)\s+/i,
  /^\s*(?:task|tarea)\s*[:\-]\s*/i,
];

const PRIORITY_HIGH =
  /\b(?:urgent|urgente|asap|high priority|prioridad alta|alta prioridad|important|importante|critical|cr[ií]tico)\b/i;
const PRIORITY_LOW =
  /\b(?:low priority|prioridad baja|baja prioridad|whenever|cuando pueda|someday|alg[uú]n d[ií]a|no rush|sin prisa)\b/i;

const AMOUNT_CANDIDATE = /(?:[$€£]\s*)?\d[\d.,]*(?:\s*(?:usd|eur|mxn|pesos?|d[oó]lares?|euros?))?/gi;

const LEADING_EXPENSE_VERB = new RegExp(
  `^\\s*(?:please\\s+)?(?:i\\s+)?(?:spent|spend|paid|pay|bought|buy|purchased?|gast[eé]|gastar|compr[eé]|comprar|pagu[eé]|pagar)${WORD_END}\\s*`,
  'i',
);

const pad = (value: number) => `${value}`.padStart(2, '0');

const toDayKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const matchesWord = (text: string, keyword: string) =>
  new RegExp(`${WORD_START}${escapeRegExp(keyword)}${WORD_END}`, 'i').test(text);

const capitalize = (value: string) =>
  value.length > 0 ? `${value[0].toUpperCase()}${value.slice(1)}` : value;

const detectCategory = (text: string): ExpenseCategory =>
  CATEGORY_RULES.find(({ keywords }) => keywords.some((keyword) => matchesWord(text, keyword)))
    ?.category ?? 'other';

const detectPriority = (text: string): TaskPriority => {
  if (PRIORITY_HIGH.test(text)) return 'high';
  if (PRIORITY_LOW.test(text)) return 'low';
  return 'medium';
};

const parseAmount = (raw: string) => {
  let value = raw.replace(/[^\d.,]/g, '').replace(/[.,]+$/, '');
  if (!value) return 0;

  const lastDot = value.lastIndexOf('.');
  const lastComma = value.lastIndexOf(',');

  if (lastDot !== -1 && lastComma !== -1) {
    const decimalSeparator = lastDot > lastComma ? '.' : ',';
    const thousandsSeparator = decimalSeparator === '.' ? ',' : '.';
    value = value.split(thousandsSeparator).join('');
    value = value.split(decimalSeparator).join('.');
  } else if (lastDot !== -1 || lastComma !== -1) {
    const separator = lastDot !== -1 ? '.' : ',';
    const parts = value.split(separator);

    if (parts.length > 2) {
      const decimals = parts.pop() ?? '';
      value = parts.join('') + (decimals.length <= 2 ? `.${decimals}` : decimals);
    } else if (parts[1]?.length === 3) {
      value = parts.join('');
    } else {
      value = parts.join('.');
    }
  }

  const amount = Number.parseFloat(value);
  return Number.isFinite(amount) ? amount : 0;
};

const extractAmount = (text: string) => {
  AMOUNT_CANDIDATE.lastIndex = 0;
  const matches = Array.from(text.matchAll(AMOUNT_CANDIDATE));
  if (matches.length === 0) return 0;

  const currencyMatches = matches.filter((match) =>
    /[$€£]|usd|eur|mxn|pesos?|d[oó]lares?|euros?/i.test(match[0]),
  );
  const candidates = (currencyMatches.length > 0 ? currencyMatches : matches)
    .map((match) => parseAmount(match[0]))
    .filter((amount) => amount > 0);

  if (candidates.length === 0) return 0;

  // When no currency marker is present, the largest number is usually the
  // transaction amount (e.g. "2 coffees for 10").
  return currencyMatches.length > 0 ? candidates[0] : Math.max(...candidates);
};

const buildDate = (year: number, month: number, day: number) => {
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
};

const resolveWeekday = (text: string, now: Date) => {
  const rule = WEEKDAY_RULES.find(({ keywords }) =>
    keywords.some((keyword) => matchesWord(text, keyword)),
  );
  if (!rule) return null;

  let diff = (rule.day - now.getDay() + 7) % 7;
  if (diff === 0) diff = 7;
  return addDays(now, diff);
};

const resolveDate = (text: string, now: Date): Date | null => {
  const isoMatch = text.match(/(?:^|[^\d])(\d{4})-(\d{1,2})-(\d{1,2})(?=$|[^\d])/);
  if (isoMatch) {
    return buildDate(Number(isoMatch[1]), Number(isoMatch[2]), Number(isoMatch[3]));
  }

  const numericMatch = text.match(
    /(?:^|[^\d])(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2,4}))?(?=$|[^\d])/,
  );
  if (numericMatch) {
    const yearPart = numericMatch[3];
    const year = yearPart
      ? yearPart.length === 2
        ? 2000 + Number(yearPart)
        : Number(yearPart)
      : now.getFullYear();
    const parsed = buildDate(year, Number(numericMatch[2]), Number(numericMatch[1]));
    if (parsed) return parsed;
  }

  if (matchesWord(text, 'pasado mañana') || matchesWord(text, 'day after tomorrow')) {
    return addDays(now, 2);
  }
  if (matchesWord(text, 'anteayer')) return addDays(now, -2);
  if (matchesWord(text, 'mañana') || matchesWord(text, 'tomorrow')) {
    return addDays(now, 1);
  }
  if (matchesWord(text, 'ayer') || matchesWord(text, 'yesterday')) {
    return addDays(now, -1);
  }
  if (matchesWord(text, 'hoy') || matchesWord(text, 'today')) return new Date(now);

  const relativeDays = text.match(/\b(?:in|dentro de)\s+(\d{1,2})\s+(?:days?|d[ií]as?)\b/i);
  if (relativeDays) return addDays(now, Number(relativeDays[1]));

  if (
    matchesWord(text, 'próxima semana') ||
    matchesWord(text, 'proxima semana') ||
    matchesWord(text, 'next week')
  ) {
    return addDays(now, 7);
  }

  return resolveWeekday(text, now);
};

const stripDateExpressions = (text: string) =>
  DATE_EXPRESSIONS.reduce((result, pattern) => result.replace(pattern, ' '), text);

const stripExpenseTitle = (text: string) => {
  let title = text.replace(LEADING_EXPENSE_VERB, '');
  AMOUNT_CANDIDATE.lastIndex = 0;
  title = title.replace(AMOUNT_CANDIDATE, ' ');
  title = stripDateExpressions(title);
  title = title.replace(/\b(?:please|por favor)\b/gi, ' ');
  title = title.replace(/\s+/g, ' ').trim();

  for (let index = 0; index < 2; index += 1) {
    title = title.replace(
      /^(?:on|in|for|at|en|por|de|con|a|an|the|el|la|los|las|un|una)\s+/i,
      '',
    );
  }

  title = title.replace(
    /\s+(?:on|in|for|at|en|por|de|con|to|para|the|el|la|los|las)$/i,
    '',
  );
  title = title.replace(/^[^a-záéíóúüñ0-9]+/i, '');
  title = title.replace(/[.,;:!?]+$/g, '').trim();

  return title ? capitalize(title) : '';
};

const stripTaskTitle = (text: string) => {
  let title = text;

  for (let pass = 0; pass < 2; pass += 1) {
    for (const prefix of TASK_PREFIXES) {
      title = title.replace(prefix, '');
    }
  }

  title = title.replace(PRIORITY_HIGH, ' ');
  title = title.replace(PRIORITY_LOW, ' ');
  title = stripDateExpressions(title);
  title = title.replace(/\b(?:please|por favor)\b/gi, ' ');
  title = title.replace(/\s+/g, ' ').trim();

  for (let index = 0; index < 2; index += 1) {
    title = title.replace(/^(?:to|for|about|para|de|que|a|an|the)\s+/i, '');
  }

  title = title.replace(
    /\s+(?:on|in|for|at|en|por|de|con|to|para|the|el|la|los|las)$/i,
    '',
  );
  title = title.replace(/^[^a-záéíóúüñ0-9]+/i, '');
  title = title.replace(/[.,;:!?]+$/g, '').trim();

  return title ? capitalize(title) : '';
};

const parseExpenseIntent = (text: string, now: Date): AssistantIntent | null => {
  const amount = extractAmount(text);
  if (amount <= 0) return null;

  return {
    kind: 'expense',
    title: stripExpenseTitle(text),
    amount: Math.round(amount * 100) / 100,
    category: detectCategory(text),
    date: toDayKey(resolveDate(text, now) ?? now),
  };
};

const parseTaskIntent = (text: string, now: Date): AssistantIntent | null => {
  const title = stripTaskTitle(text);
  if (!title) return null;

  return {
    kind: 'task',
    title,
    priority: detectPriority(text),
    dueDate: toDayKey(resolveDate(text, now) ?? now),
  };
};

/**
 * Local, rule-based intent parser. It runs fully on-device and only emits
 * actions that can be executed with the existing finance/tasks use cases.
 */
export function parseAssistantIntent(
  text: string,
  options: AssistantIntentParserOptions = {},
): AssistantIntent | null {
  const normalized = text.trim();
  if (!normalized) return null;

  const now = options.now ?? new Date();

  // Explicit task/reminder phrasing wins over expense keywords so that
  // "remind me to pay the internet" is a task, not an expense.
  if (TASK_HINT.test(normalized)) {
    return parseTaskIntent(normalized, now);
  }

  const amount = extractAmount(normalized);
  const category = detectCategory(normalized);

  if (amount > 0 && (EXPENSE_HINT.test(normalized) || category !== 'other')) {
    return parseExpenseIntent(normalized, now);
  }

  if (ACTION_REQUEST_HINT.test(normalized)) {
    return parseTaskIntent(normalized, now);
  }

  return null;
}
