import type { Country } from '../questions';

/** All interface text. Each language file must provide every entry. */
export interface Messages {
  /** The language's name in that language, shown on its button. */
  languageName: string;
  /** The game's name, also used as the browser tab title. */
  title: string;
  chooseLanguage: string;
  /** The heading above the creators on the final screen. */
  creatorsTitle: string;
  /** On the home screen: what the game is and how to play. */
  intro: string;
  /** Above the three country buttons on the home screen. */
  chooseCountry: string;
  /** Leaves the settings screen. */
  back: string;
  /** Above the city's name while the llama walks there. */
  nextStop: string;
  /** Replaces nextStop when the llama gets there. */
  arrived: string;
  continueJourney: string;
  /** For example "Question 3 of 15". */
  progress: (current: number, total: number) => string;
  /** The running score during the game. */
  score: (score: number) => string;
  correct: string;
  wrong: string;
  nextQuestion: string;
  /** Replaces nextQuestion on the last question. */
  seeResult: string;
  resultTitle: string;
  /** The final score, for example "You got 11 out of 15 right." */
  result: (score: number, total: number) => string;
  playAgain: string;
  /** On the final screen: back home to pick another country. */
  otherCountries: string;
  cities: {
    lima: string;
    prague: string;
    berlin: string;
    tokyo: string;
  };
  countries: Record<Country, string>;
  /** Shown on arrival: the landmark's name and five things the country is known for. */
  showcase: Record<Country, { landmark: string; things: [string, string, string, string, string] }>;
}
