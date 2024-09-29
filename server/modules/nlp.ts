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

// Choose Node framework of your preference for the implementation

// 87

// [
//     '503',
//     '590',
//     '398',
//     '540',

//    ]

type ComparisonOptonsType = "over" | "under" | "equal";
const matchComparison: ComparisonOptonsType[] = ["over", "under", "equal"];
type ExtractComparisonTermReturnType = {
  comparison: ComparisonOptonsType;
  words: string[];
};

const extractComparisonTermTh = (msg: string) => new Error(`extractComparisonTerm error: ${msg}`);
/**
 *  filters out words
 *
 * over equal under
 *
 * and then returns first found of those with the rest of the words
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

const th = (msg: string) => new Error(`nlp.ts error: ${msg}`);

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
}
