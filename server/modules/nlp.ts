// As a user, when I enter the text "over fifty four" to the input field, -- case 4
// I want see all payments with amount greater than $54

// As a user, when I enter the text "equal two thousand and forty five" to the input field, -- case 2
// I want see all payments with amount equal to $2045

// As a user, when I enter the text "under three million one hundred thousand and ninety" to the input field, - case 1
// I want see all payments with amount lower than $3100090

// As a user, when I enter the text "asdasd" to the input field, -- case 6
// I want see an error: "Incorrect input"

// As a user, when I enter the text "one one" to the input field,
// I want see an error: "Incorrect input"

// Requirements:
// The max number should be 999 999 999. The minimum number is 0.

// We need to handle only over , under and equal phrases and numbers expressed in text

// -------------------------------
// Focus on:
// equal two thousand and forty five      -   case 2
// equal to $2045  - case 3
// under three million one hundred thousand and ninety  -> [3, "million", 1, "hundred", "thousand", 90] - case 1
// asdasd -> Incorrect input
// one one -> Incorrect input

// interesting cases
// under twenty three million fifty one hundred thousand and ninety two
//      -> [20, 3, "million", 50, 1, "hundred", "thousand", 90, 2]

import { directory, multipliers, normalize } from "./nlp.dictionary";

const th = (msg: string) => new Error(`nlp.ts error: ${msg}`);

const extractComparatorTermTh = (msg: string) => new Error(`tlp.js:extractComparatorTerm error: ${msg}`);

const extractNumbersAndScalesTh = (msg: string) => new Error(`tlp.js:extractNumbersAndScales error: ${msg}`);

export const numberRegex = /^.*?(\d+).*$/;

type NumbersOrStringsType = string | number;

type ComparatorOptonsType = "over" | "under" | "equal";
type ComparatorOptonsMysqlType = ">" | "<" | "=";
const matchComparator: ComparatorOptonsType[] = ["over", "under", "equal"];
type ExtractComparatorTermReturnType = {
  comparator: ComparatorOptonsType;
  words: string[];
};
export type NlpReturnType = {
  comparator: ComparatorOptonsMysqlType;
  number: number;
  stages: NumbersOrStringsType[][];
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
export function extractComparatorTerm(list: string[]): ExtractComparatorTermReturnType {
  const comp: ComparatorOptonsType[] = [];

  const words: string[] = [];

  for (let i = 0, l = list.length; i < l; i += 1) {
    const word = list[i] as ComparatorOptonsType;
    if (matchComparator.includes(word)) {
      comp.push(word);
    } else {
      words.push(word);
    }
  }

  if (comp.length < 1) {
    throw extractComparatorTermTh(`No comparator term found`);
  }

  if (words.length < 1) {
    throw extractComparatorTermTh(`No numeric words found beyond comparator terms`);
  }

  return {
    comparator: comp[0],
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
    const word = String(list[i]);
    if (numberRegex.test(word)) {
      buffer.push(parseInt(word.replace(numberRegex, "$1"), 10));
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

/**
 * [20, 3, "million", 50, 1, "hundred", "thousand", 90, 2]
 * transforms to
 * [23, "million", 51, "hundred", "thousand", 92]
 *
 * here is weird case but I will pretend nothing happen and just proceed with adding
 * I could throw exceptions here refusing to process, but let's make it more lenient
 * [4, 17, "million", 3, 14, "hundred", "thousand", 6, 40]
 * [21, "million", 17, "hundred", "thousand", 46]
 */
export function addJustNumbers(list: NumbersOrStringsType[]): NumbersOrStringsType[] {
  const buffer: NumbersOrStringsType[] = [];

  let nbuff: number = 0;

  for (let i = 0, l = list.length; i < l; i += 1) {
    const number = list[i];

    if (typeof number === "number") {
      nbuff += number;
    } else {
      if (nbuff > 0) {
        buffer.push(nbuff);
        nbuff = 0;
      }
      buffer.push(number);
    }
  }

  if (nbuff > 0) {
    buffer.push(nbuff);
  }

  return buffer;
}

/**
 * [21, "million", 17, "hundred", "thousand", 46]
 * transforms to
 * [21000000, 1700000, 46]
 */
export function multiplyNumbers(list: NumbersOrStringsType[]): number[] {
  const buffer: number[] = [];

  let num: number = 0;

  for (let i = 0, l = list.length; i < l; i += 1) {
    const word = list[i];
    if (typeof word === "number") {
      if (num === 0) {
        num = word;
      } else {
        buffer.push(num);

        num = word;
      }
    } else {
      const mul = directory.get(word) as number;

      if (num === 0) {
        buffer.push(mul);
      } else {
        num *= mul;
      }
    }
  }

  if (num !== 0) {
    buffer.push(num);
  }

  return buffer;
}

export function finalAdd(list: number[]): number {
  return list.reduce((acc, val) => acc + val, 0);
}

export default function nlp(phrase: string): NlpReturnType {
  if (typeof phrase !== "string") {
    throw th(`Phrase ${phrase} should be a string`);
  }

  const normalize = phrase.toLowerCase().replace(/\s+/g, " ").trim();

  let words = normalize.split(" ");

  if (words.length < 2) {
    throw th(`At least two words are expected`);
  }

  let comparator;

  ({ comparator, words } = extractComparatorTerm(words));

  normalizeScales(words);

  let numbersAndScales = extractNumbersAndScales(words);

  deduplicate(numbersAndScales);

  const stages: NumbersOrStringsType[][] = [];

  stages.push([...numbersAndScales]);

  numbersAndScales = addJustNumbers(numbersAndScales);

  stages.push([...numbersAndScales]);

  const numbers = multiplyNumbers(numbersAndScales);

  stages.push([...numbers]);

  const number = finalAdd(numbers);

  stages.push([number]);

  let mysql: ComparatorOptonsMysqlType = "=";

  if (comparator === "over") {
    mysql = ">";
  }
  if (comparator === "under") {
    mysql = "<";
  }

  return {
    comparator: mysql,
    number,
    stages,
  };
}
