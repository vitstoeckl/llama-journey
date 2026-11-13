import type { Messages } from './types';

export const cs: Messages = {
  languageName: 'Čeština',
  title: 'Putování lamy',
  chooseLanguage: 'Vyber si jazyk',
  creatorsTitle: 'Autoři',
  intro:
    'Pomoz lamě doletět z Limy do Prahy, Berlína nebo Tokia. Vyber si zemi, odpověz na 5 otázek a zjisti, co má společného s Peru.',
  chooseCountry: 'Vyber si zemi',
  back: 'Zpět',
  nextStop: 'Další zastávka',
  arrived: 'Jsme tady!',
  continueJourney: 'Pokračovat',
  progress: (current, total) => `Otázka ${current} z ${total}`,
  score: (score) => `Body: ${score}`,
  correct: 'Správně!',
  wrong: 'Bohužel ne',
  nextQuestion: 'Další otázka',
  seeResult: 'Zobrazit výsledek',
  resultTitle: 'Cesta je u konce!',
  result: (score, total) => `Správné odpovědi: ${score} z ${total}.`,
  playAgain: 'Hrát znovu',
  otherCountries: 'Jiné země',
  cities: { lima: 'Lima', prague: 'Praha', berlin: 'Berlín', tokyo: 'Tokio' },
  countries: { czechia: 'Česko', germany: 'Německo', japan: 'Japonsko' },
  showcase: {
    czechia: { landmark: 'Týnský chrám', things: ['Pivo', 'Boty', 'Granule', 'Hrady', 'Brambory'] },
    germany: { landmark: 'Braniborská brána', things: ['Věková hranice', 'Cestovatelé', 'Archeologie', 'Dálnice', 'Pivo'] },
    japan: { landmark: 'Tokijská věž', things: ['Maki', 'Mochi', 'Hora Fudži', 'Sakury', 'Roboti'] },
  },
};
