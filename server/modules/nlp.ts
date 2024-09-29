// As a user, when I enter the text "over fifty four" to the input field,
// I want see all payments with amount greater than $54

// As a user, when I enter the text "equal two thousand and forty five" to the input field,
// I want see all payments with amount equal to $2045

// As a user, when I enter the text "under three million one hundred thousand and ninety" to the input field,
// I want see all payments with amount lower than $3100090

// As a user, when I enter the text "asdasd" to the input field,
// I want see an error: "Incorrect input"

// As a user, when I enter the text "one one" to the input field,
// I want see an error: "Incorrect input"

// Requirements:
// The max number should be 999 999 999. The minimum number is 0.

// We need to handle only over , under and equal phrases and numbers expressed in text

// -------------------------------
// Focus on:
// equal two thousand and forty five
// equal to $2045
// under three million one hundred thousand and ninety
// asdasd -> Incorrect input
// one one -> Incorrect input

import { directory, sequence, multipliers, normalize } from "./nlp.dictionary";

const th = (msg: string) => new Error(`nlp.ts error: ${msg}`);

const extractComparisonTermTh = (msg: string) => new Error(`tlp.js:extractComparisonTerm error: ${msg}`);

const extractNumbersAndScalesTh = (msg: string) => new Error(`tlp.js:extractNumbersAndScales error: ${msg}`);

const numberTest = /^\d+$/;

type NumbersOrStringsType = string | number;

type ComparisonOptonsType = "over" | "under" | "equal";
const matchComparison: ComparisonOptonsType[] = ["over", "under", "equal"];
type ExtractComparisonTermReturnType = {
  comparison: ComparisonOptonsType;
  words: string[];
};

/**
 * one one -> Incorrect input
 *
 * Just iterates and maybe throws an exception
 */
export function deduplicate(list: NumbersOrStringsType[]): void {
  let last: NumbersOrStringsType | null = null;

  for (const word of list) {
    if (last && word === last) {
      throw new Error(`tlp.js:deduplicateDuplicated error: consecutive word ${word}`);
    }
    last = word;
  }
}

/**
 * hundreds -> hundred
 * thousands -> thousand
 * millions -> million
 *
 * Modifies in place
 */
export function normalizeScales(list: string[]): void {
  for (let i = 0, l = list.length; i < l; i += 1) {
    const word = list[i];
    if (normalize.has(word)) {
      list[i] = normalize.get(word) as string;
    }
  }
}
/**
 * filters out words: over & equal & under
 *
 * and then returns first found of those with the rest of the words
 *
 * Throwing exceptions along the way
 */
export function extractComparisonTerm(list: string[]): ExtractComparisonTermReturnType {
  const comp: ComparisonOptonsType[] = [];

  const words: string[] = [];

  for (let i = 0, l = list.length; i < l; i += 1) {
    const word = list[i] as ComparisonOptonsType;
    if (matchComparison.includes(word)) {
      comp.push(word);
    } else {
      words.push(word);
    }
  }

  if (comp.length < 1) {
    throw extractComparisonTermTh(`No comparison term found`);
  }

  if (words.length < 1) {
    throw extractComparisonTermTh(`No numeric words found beyond comparison terms`);
  }

  return {
    comparison: comp[0],
    words,
  };
}

/**
 * filters out words for numbers (one two three ...) and scales (thousand million etc..)
 *
 * and returns them
 *
 * Throws exception if nothing found
 */
export function extractNumbersAndScales(list: string[]): NumbersOrStringsType[] {
  const buffer: NumbersOrStringsType[] = [];

  for (let i = 0, l = list.length; i < l; i += 1) {
    const word = list[i];
    if (numberTest.test(word)) {
      buffer.push(parseInt(word, 10));
    } else {
      if (directory.has(word)) {
        if (multipliers.has(word)) {
          buffer.push(word);
        } else {
          buffer.push(directory.get(word) as number);
        }
      } 
    }
  }

  if (buffer.length === 0) {
    throw extractNumbersAndScalesTh(`No numeric words found`);
  }

  return buffer;
}

export default function nlp(phrase: string) {
  if (typeof phrase !== "string") {
    throw th(`Phrase ${phrase} should be a string`);
  }

  const normalize = phrase.toLowerCase().replace(/\s+/g, " ").trim();

  let words = normalize.split(" ");

  if (words.length < 2) {
    throw th(`At least two words are expected`);
  }

  let comparison;

  ({ comparison, words } = extractComparisonTerm(words));

  normalizeScales(words);

  const numbersAndScales = extractNumbersAndScales(words);

  deduplicate(numbersAndScales);

  //   words =
}
