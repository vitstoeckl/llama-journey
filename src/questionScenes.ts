import { createBeerScene } from './beerScene';
import type { QuestionScene } from './sceneKit';
import { createPancakePan, createDogDinner, createSharedSeal, createShoeFactory } from './scenesCzechia';
import {
  createAutobahn,
  createBarrelCart,
  createDigSite,
  createPenguinCoast,
  createAgeSigns,
} from './scenesGermany';
import {
  createDroneSurvey,
  createNikkeiPlate,
  createQuakeScene,
  createTwoRolls,
  createMochiPair,
} from './scenesJapan';

/**
 * The picture for each question, shown in place of the map. A picture must not give the answer away
 * before the player has answered: what would spoil it appears only once `done` is true.
 * A question left out of this list shows the map.
 */
export const QUESTION_SCENES: Record<string, QuestionScene> = {
  'czechia-1': createBeerScene,
  'czechia-2': createShoeFactory,
  'czechia-3': createDogDinner,
  'czechia-4': createSharedSeal,
  'czechia-5': createPancakePan,
  'germany-1': createAgeSigns,
  'germany-2': createAutobahn,
  'germany-3': createPenguinCoast,
  'germany-4': createDigSite,
  'germany-5': createBarrelCart,
  'japan-1': createTwoRolls,
  'japan-2': createMochiPair,
  'japan-3': createNikkeiPlate,
  'japan-4': createQuakeScene,
  'japan-5': createDroneSurvey,
};
