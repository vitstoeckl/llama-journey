import { cs } from './cs';
import { de } from './de';
import { en } from './en';
import { es } from './es';
import { ja } from './ja';
import { LANGUAGES, type Language } from './languages';
import type { Messages } from './types';

export { LANGUAGES, type Language };

const MESSAGES: Record<Language, Messages> = { es, cs, en, de, ja };
const STORAGE_KEY = 'llama-journey.language';
/** The class is taught in Spanish, so it is the fallback for any other phone language. */
const DEFAULT_LANGUAGE: Language = 'es';

let current = loadLanguage();
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

/** Switches the language and remembers it on this phone. Screens read it when they are built. */
export function setLanguage(language: Language): void {
  current = language;
  applyToPage();

  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Storage can be blocked, as in some private tabs. The game still works, it just forgets.
  }
}

function loadLanguage(): Language {
  return readStoredLanguage() ?? matchPhoneLanguage() ?? DEFAULT_LANGUAGE;
}

function readStoredLanguage(): Language | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    return isLanguage(stored) ? stored : null;
  } catch {
    return null;
  }
}

function matchPhoneLanguage(): Language | null {
  for (const tag of navigator.languages) {
    const primary = tag.split('-')[0].toLowerCase();

    if (isLanguage(primary)) {
      return primary;
    }
  }

  return null;
}

function isLanguage(value: string | null): value is Language {
  return LANGUAGES.includes(value as Language);
}

function applyToPage(): void {
  document.documentElement.lang = current;
  document.title = t().title;
}
