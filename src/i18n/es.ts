import type { Messages } from './types';

export const es: Messages = {
  languageName: 'Español',
  title: 'El viaje de la llama',
  chooseLanguage: 'Elige tu idioma',
  creatorsTitle: 'Creado por',
  intro:
    'Ayuda a la llama a volar de Lima a Praga, Berlín o Tokio. Elige un país, responde 5 preguntas y descubre qué comparte el Perú con él.',
  chooseCountry: 'Elige un país',
  back: 'Volver',
  nextStop: 'Próxima parada',
  arrived: '¡Ya llegamos!',
  continueJourney: 'Continuar',
  progress: (current, total) => `Pregunta ${current} de ${total}`,
  score: (score) => `Puntos: ${score}`,
  correct: '¡Correcto!',
  wrong: 'Incorrecto',
  nextQuestion: 'Siguiente pregunta',
  seeResult: 'Ver mi resultado',
  resultTitle: '¡Viaje completado!',
  result: (score, total) => `Acertaste ${score} de ${total} preguntas.`,
  playAgain: 'Jugar otra vez',
  otherCountries: 'Otros países',
  cities: { lima: 'Lima', prague: 'Praga', berlin: 'Berlín', tokyo: 'Tokio' },
  countries: { czechia: 'República Checa', germany: 'Alemania', japan: 'Japón' },
  showcase: {
    czechia: { landmark: 'Iglesia de Týn', things: ['Cerveza', 'Zapatos', 'Croquetas', 'Castillos', 'Papas'] },
    germany: { landmark: 'Puerta de Brandeburgo', things: ['Edad mínima', 'Exploradores', 'Arqueología', 'Autopistas', 'Cerveza'] },
    japan: { landmark: 'Torre de Tokio', things: ['Maki', 'Mochi', 'Monte Fuji', 'Cerezos en flor', 'Robots'] },
  },
};
