import type { Messages } from './types';

export const de: Messages = {
  languageName: 'Deutsch',
  title: 'Die Reise des Lamas',
  chooseLanguage: 'Wähle deine Sprache',
  creatorsTitle: 'Erstellt von',
  intro:
    'Hilf dem Lama, von Lima nach Prag, Berlin oder Tokio zu fliegen. Wähle ein Land, beantworte 5 Fragen und entdecke, was Peru mit ihm verbindet.',
  chooseCountry: 'Wähle ein Land',
  back: 'Zurück',
  nextStop: 'Nächster Halt',
  arrived: 'Angekommen!',
  continueJourney: 'Weiter',
  progress: (current, total) => `Frage ${current} von ${total}`,
  score: (score) => `Punkte: ${score}`,
  correct: 'Richtig!',
  wrong: 'Leider falsch',
  nextQuestion: 'Nächste Frage',
  seeResult: 'Ergebnis ansehen',
  resultTitle: 'Reise geschafft!',
  result: (score, total) => `Du hast ${score} von ${total} Fragen richtig beantwortet.`,
  playAgain: 'Noch einmal spielen',
  otherCountries: 'Andere Länder',
  cities: { lima: 'Lima', prague: 'Prag', berlin: 'Berlin', tokyo: 'Tokio' },
  countries: { czechia: 'Tschechien', germany: 'Deutschland', japan: 'Japan' },
  showcase: {
    czechia: { landmark: 'Teynkirche', things: ['Bier', 'Schuhe', 'Hundefutter', 'Burgen', 'Kartoffeln'] },
    germany: { landmark: 'Brandenburger Tor', things: ['Altersgrenzen', 'Entdecker', 'Archäologie', 'Autobahnen', 'Bier'] },
    japan: { landmark: 'Tokyo Tower', things: ['Maki', 'Mochi', 'Berg Fuji', 'Kirschblüten', 'Roboter'] },
  },
};
