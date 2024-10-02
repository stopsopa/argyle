const th = (msg: string) => new Error(`formatNumber.ts error: ${msg}`);

const reg = /^\d+\.\d{2}$/;

/**
 * Simple lib for specific case.
 * Just format decimal straight from database
 *
 * So decimals are returned from db as strings and have pretty regular and simple structure
 *
 * [\d+].[\d{2}]
 *
 * that's all
 *
 * So it is not a great challenge to just handle this ourself
 */
export default function formatNumber(num: string, separator: string = ","): string {
  if (!reg.test(num)) {
    throw th(`Number ${num} is not in correct format`);
  }

  if (typeof separator !== "string") {
    throw th(`Separator ${separator} shuld be a string`);
  }

  const parts = num.split(".");

  const numbers = parts[0].split("");

  numbers.reverse();

  const buffer: string[][] = [];

  do {
    buffer.push(numbers.splice(0, 3));
  } while (numbers.length > 0);

  const result: string[] = [];

  for (let i = buffer.length - 1; i >= 0; i -= 1) {
    buffer[i].reverse();

    result.push(buffer[i].join(""));
  }

  return `${result.join(separator)}.${parts[1]}`;
}
