const GREETING = /^\s*(?:hola|hey|hi|hello|buenos\s+días|buenas\s+tardes|buenas\s+noches|qué\s+tal|cómo\s+estás)[\s!¡?¿.,]*$/i;

/** Pure helper so presentation can pick a localized greeting without i18n in domain/data. */
export function isGreeting(text: string): boolean {
  return GREETING.test(text.trim());
}
