const BLOCK_GAP = 4;
const COUNTRY_GAP = 20;

/**
 * Where a question's block sits on the road below the map, from the road's left end. The llama
 * stands at `left` while the question is open and walks to `right` once it is answered.
 */
export function roadBlock(
  question: number,
  total: number,
  perCountry: number,
  roadWidth: number,
): { left: number; right: number } {
  const countryGaps = Math.ceil(total / perCountry) - 1;
  const blockGaps = total - 1 - countryGaps;
  const width = (roadWidth - blockGaps * BLOCK_GAP - countryGaps * COUNTRY_GAP) / total;
  const countriesPassed = Math.floor(question / perCountry);
  const left = question * width + (question - countriesPassed) * BLOCK_GAP + countriesPassed * COUNTRY_GAP;

  return { left, right: left + width };
}
