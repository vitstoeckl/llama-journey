import type { Messages } from './types';

export const ja: Messages = {
  languageName: '日本語',
  title: 'リャマの旅',
  chooseLanguage: '言語を選んでください',
  creatorsTitle: '制作',
  intro:
    'リャマがリマからプラハ、ベルリン、東京のどこかへ飛ぶのを手伝いましょう。国を選んで4問に答え、ペルーとの共通点を見つけましょう。',
  chooseCountry: '国を選んでください',
  back: '戻る',
  nextStop: '次の目的地',
  arrived: '到着！',
  continueJourney: '次へ',
  progress: (current, total) => `第${current}問（全${total}問）`,
  score: (score) => `得点：${score}`,
  correct: '正解！',
  wrong: '不正解',
  nextQuestion: '次の問題へ',
  seeResult: '結果を見る',
  resultTitle: '旅が終わりました！',
  result: (score, total) => `${total}問中${score}問正解しました。`,
  playAgain: 'もう一度遊ぶ',
  otherCountries: 'ほかの国',
  cities: { lima: 'リマ', prague: 'プラハ', berlin: 'ベルリン', tokyo: '東京' },
  countries: { czechia: 'チェコ', germany: 'ドイツ', japan: '日本' },
  showcase: {
    czechia: { landmark: 'ティーン教会', things: ['ビール', '靴', 'ドッグフード', '城', 'じゃがいも'] },
    germany: { landmark: 'ブランデンブルク門', things: ['年齢制限', '探検家', '考古学', 'アウトバーン', 'ビール'] },
    japan: { landmark: '東京タワー', things: ['巻き寿司', '餅', '富士山', '桜', 'ロボット'] },
  },
};
