import type { Messages } from './types';

export const en: Messages = {
  languageName: 'English',
  title: "Llama's Journey",
  chooseLanguage: 'Choose your language',
  creatorsTitle: 'Created by',
  intro:
    'Help the llama fly from Lima to Prague, Berlin or Tokyo. Pick a country, answer 5 questions and find out what Peru shares with it.',
  chooseCountry: 'Choose a country',
  back: 'Back',
  nextStop: 'Next stop',
  arrived: "We're here!",
  continueJourney: 'Continue',
  progress: (current, total) => `Question ${current} of ${total}`,
  score: (score) => `Score: ${score}`,
  correct: 'Correct!',
  wrong: 'Not quite',
  nextQuestion: 'Next question',
  seeResult: 'See my score',
  resultTitle: 'Journey complete!',
  result: (score, total) => `You got ${score} out of ${total} right.`,
  playAgain: 'Play again',
  otherCountries: 'Other countries',
  cities: { lima: 'Lima', prague: 'Prague', berlin: 'Berlin', tokyo: 'Tokyo' },
  countries: { czechia: 'Czech Republic', germany: 'Germany', japan: 'Japan' },
  showcase: {
    czechia: { landmark: 'Týn Church', things: ['Beer', 'Shoes', 'Dog food', 'Castles', 'Potatoes'] },
    germany: { landmark: 'Brandenburg Gate', things: ['Age limits', 'Explorers', 'Archaeology', 'Motorways', 'Beer'] },
    japan: { landmark: 'Tokyo Tower', things: ['Maki', 'Mochi', 'Mount Fuji', 'Cherry blossoms', 'Robots'] },
  },
};
