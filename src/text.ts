import { CanvasTextMetrics, Text, type TextStyleAlign } from 'pixi.js';
import { getLanguage, type Language } from './i18n';

const LATIN_FONT = ['Avenir Next', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'system-ui', 'sans-serif'];
// Named first because a generic fallback can pick Chinese glyph shapes for the same characters.
const JAPANESE_FONT = [
  'Hiragino Sans',
  'Hiragino Kaku Gothic ProN',
  'Yu Gothic',
  'Meiryo',
  'Noto Sans CJK JP',
  'Noto Sans JP',
  'sans-serif',
];
const MIN_FONT_SIZE = 20;

// Japanese has no spaces, so a line may end between almost any two characters. These
// are the exceptions (kinsoku): closing marks and small kana must not start a line,
// opening brackets must not end one.
const NO_LINE_START = new Set('、。，．・：；？！ー）］｝〕〉》」』】…‥々ゝゞぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮ');
const NO_LINE_END = new Set('（［｛〔〈《「『【');

// PixiJS only uses these two hooks for text with breakWords on, which createText sets
// just for Japanese. Without Intl.Segmenter on an old phone, it splits by character instead.
if (typeof Intl.Segmenter === 'function') {
  const japaneseWords = new Intl.Segmenter('ja', { granularity: 'word' });

  // Breaking between words reads better than the breaks that are merely allowed, as in ベルリ/ン.
  CanvasTextMetrics.wordWrapSplit = (token) =>
    Array.from(japaneseWords.segment(token), (part) => part.segment);
}

CanvasTextMetrics.canBreakChars = (before, after) =>
  !NO_LINE_START.has(after[0]) &&
  !NO_LINE_END.has(before[before.length - 1]) &&
  // Keeps a number together with its counter, as in 15問.
  !/[0-9]$/.test(before);

export interface TextOptions {
  text: string;
  size: number;
  fill: number;
  /** Text is wrapped at this width, then shrunk if a single long word still does not fit. */
  maxWidth: number;
  /** Text is shrunk if it wraps to more than this height. */
  maxHeight?: number;
  align?: TextStyleAlign;
  bold?: boolean;
  /** For text that stays in one language whatever is chosen, like a language's own name. */
  language?: Language;
}

/** Text in the right font and wrapping for its language, shrunk until it fits its box. */
export function createText(options: TextOptions): Text {
  const { text, fill, maxWidth, maxHeight = Infinity, align = 'center', bold = true } = options;
  const japanese = (options.language ?? getLanguage()) === 'ja';
  const lineSpacing = japanese ? 1.6 : 1.35;

  const label = new Text({
    text,
    style: {
      fontFamily: japanese ? JAPANESE_FONT : LATIN_FONT,
      fontSize: options.size,
      fontWeight: bold ? 'bold' : 'normal',
      lineHeight: options.size * lineSpacing,
      fill,
      align,
      wordWrap: true,
      wordWrapWidth: maxWidth,
      // Other languages only break at spaces, so a long German word is shrunk, never cut.
      breakWords: japanese,
    },
  });

  let size = options.size;

  while ((label.width > maxWidth || label.height > maxHeight) && size > MIN_FONT_SIZE) {
    size -= 2;
    label.style.fontSize = size;
    label.style.lineHeight = size * lineSpacing;
  }

  return label;
}
