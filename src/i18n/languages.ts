export const LANGUAGES = ['es', 'cs', 'en', 'de', 'ja'] as const;
export type Language = (typeof LANGUAGES)[number];
