import { cs } from './cs';
import { de } from './de';
import { en } from './en';
import { es } from './es';
import { ja } from './ja';
import { LANGUAGES, type Language } from './languages';
import type { Messages } from './types';

export { LANGUAGES, type Language };

const MESSAGES: Record<Language, Messages> = { es, cs, en, de, ja };
/** The class is taught in Spanish, so the game always opens in Spanish, whatever the phone's language. */
const DEFAULT_LANGUAGE: Language = 'es';

let current: Language = DEFAULT_LANGUAGE;
applyToPage();

/** The interface text in the current language. */
export function t(): Messages {
  return MESSAGES[current];
}

export function getLanguage(): Language {
  return current;
}

/** The name a language's button shows, in that language. */
export function languageName(language: Language): string {
  return MESSAGES[language].languageName;
}

/** Switches the language until the game is closed. Screens read it when they are built. */
export function setLanguage(language: Language): void {
  current = language;
  applyToPage();
}

function applyToPage(): void {
  document.documentElement.lang = current;
  document.title = t().title;
}
