import { createBeerScene } from './beerScene';
import type { QuestionScene } from './sceneKit';
import { createPancakePan, createSharedSeal, createShoeFactory } from './scenesCzechia';
import {
  createAutobahn,
  createBarrelCart,
  createPenguinCoast,
  createAgeSigns,
} from './scenesGermany';
import {
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
  'czechia-3': createSharedSeal,
  'czechia-4': createPancakePan,
  'germany-1': createAgeSigns,
  'germany-2': createAutobahn,
  'germany-3': createPenguinCoast,
  'germany-4': createBarrelCart,
  'japan-1': createTwoRolls,
  'japan-2': createMochiPair,
  'japan-3': createNikkeiPlate,
  'japan-4': createQuakeScene,
};
