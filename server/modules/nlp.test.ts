import nlp, {
  extractComparatorTerm,
  normalizeScales,
  deduplicate,
  extractNumbersAndScales,
  addJustNumbers,
  numberRegex,
  multiplyNumbers,
  finalAdd,
} from "./nlp";

describe("nlp", () => {
  it("not as string", (done) => {
    try {
      /* @ts-ignore */
      nlp(45);

      done(`Shouln't reach the end`);
    } catch (e) {
      expect(String(e)).toEqual("Error: nlp.ts error: Phrase 45 should be a string");

      done();
    }
  });
  it("one word", (done) => {
    try {
      nlp("one");

      done(`Shouln't reach the end`);
    } catch (e) {
      expect(String(e)).toEqual("Error: nlp.ts error: At least two words are expected");

      done();
    }
  });
  it("case 2", (done) => {
    try {
      const result = nlp("equal two thousand and forty five");

      expect(result).toEqual({
        comparator: "=",
        number: 2045,
        log: [[2, "thousand", 40, 5], [2, "thousand", 45], [2000, 45], [2045]],
      });

      done();
    } catch (e) {
      done(`Shouldn't throw an error >${e}<`);
    }
  });
  it("case 3", (done) => {
    try {
      const result = nlp("equal to $2045");

      expect(result).toEqual({
        comparator: "=",
        number: 2045,
        log: [[2045], [2045], [2045], [2045]],
      });

      done();
    } catch (e) {
      done(`Shouldn't throw an error >${e}<`);
    }
  });
  it("case 1", (done) => {
    try {
      const result = nlp("under three million one hundred thousand and ninety");

      expect(result).toEqual({
        comparator: "<",
        number: 3100090,
        log: [
          [3, "million", 1, "hundred", "thousand", 90],
          [3, "million", 1, "hundred", "thousand", 90],
          [3000000, 100000, 90],
          [3100090],
        ],
      });

      done();
    } catch (e) {
      done(`Shouldn't throw an error >${e}<`);
    }
  });
  it("case 4", (done) => {
    try {
      const result = nlp("over fifty four");

      expect(result).toEqual({
        comparator: ">",
        number: 54,
        log: [[50, 4], [54], [54], [54]],
      });

      done();
    } catch (e) {
      done(`Shouldn't throw an error >${e}<`);
    }
  });
  it("case 6", (done) => {
    try {
      nlp("asdasd");

      done(`Shouln't reach the end`);
    } catch (e) {
      expect(String(e)).toEqual("Error: nlp.ts error: At least two words are expected");

      done();
    }
  });
  describe("extractComparatorTerm", () => {
    it("find", (done) => {
      try {
        const result = extractComparatorTerm(["over", "equal", "under", "one"]);

        expect(result.comparator).toEqual("over");

        expect(result.words).toEqual(["one"]);

        done();
      } catch (e) {
        done(`Shouldn't throw an error >${e}<`);
      }
    });

    it("no comparator", (done) => {
      try {
        extractComparatorTerm(["xx", "ee", "hhg", "one"]);

        done(`Shouln't reach the end`);
      } catch (e) {
        expect(String(e)).toEqual("Error: tlp.js:extractComparatorTerm error: No comparator term found");

        done();
      }
    });
    it("no numeric", (done) => {
      try {
        extractComparatorTerm(["over"]);

        done(`Shouln't reach the end`);
      } catch (e) {
        expect(String(e)).toEqual(
          "Error: tlp.js:extractComparatorTerm error: No numeric words found beyond comparator terms",
        );

        done();
      }
    });
  });

  it("normalizeScales", (done) => {
    try {
      const seed = ["over", "millions", "under", "one"];

      normalizeScales(seed);

      expect(seed).toEqual(["over", "million", "under", "one"]);

      done();
    } catch (e) {
      done(`Shouldn't throw an error >${e}<`);
    }
  });

  it("deduplicate", (done) => {
    try {
      const seed = ["over", "four", "four", "one"];

      deduplicate(seed);

      done(`Shouln't reach the end`);
    } catch (e) {
      expect(String(e)).toEqual("Error: tlp.js:deduplicateDuplicated error: consecutive word four");

      done();
    }
  });
  describe("extractNumbersAndScales", () => {
    it("regular", (done) => {
      try {
        const seed = ["over", "four", "million", 8, "under", "67", "thousand", "one"];

        /* @ts-ignore */
        const result = extractNumbersAndScales(seed);

        expect(result).toEqual([4, "million", 8, 67, "thousand", 1]);

        done();
      } catch (e) {
        done(`Shouldn't throw an error >${e}<`);
      }
    });
    it("case 1", (done) => {
      try {
        // under three million one hundred thousand and ninety
        const seed = "under three million one hundred thousand and ninety".split(" ");

        /* @ts-ignore */
        const result = extractNumbersAndScales(seed);

        expect(result).toEqual([3, "million", 1, "hundred", "thousand", 90]);

        done();
      } catch (e) {
        done(`Shouldn't throw an error >${e}<`);
      }
    });
    it("case 1 - mod", (done) => {
      try {
        // under three million one hundred thousand and ninety -- modified
        const seed = "under twenty three million fifty one hundred thousand and ninety two".split(" ");

        /* @ts-ignore */
        const result = extractNumbersAndScales(seed);

        expect(result).toEqual([20, 3, "million", 50, 1, "hundred", "thousand", 90, 2]);

        done();
      } catch (e) {
        done(`Shouldn't throw an error >${e}<`);
      }
    });
    it("case 2", (done) => {
      try {
        // equal two thousand and forty five
        const seed = "two thousand and forty five".split(" ");

        /* @ts-ignore */
        const result = extractNumbersAndScales(seed);

        expect(result).toEqual([2, "thousand", 40, 5]);

        done();
      } catch (e) {
        done(`Shouldn't throw an error >${e}<`);
      }
    });
    it("throw", (done) => {
      try {
        const seed = ["over", "mildlion", "hungdred", "millifon", "under"];

        extractNumbersAndScales(seed);

        done(`Shouln't reach the end`);
      } catch (e) {
        expect(String(e)).toEqual("Error: tlp.js:extractNumbersAndScales error: No numeric words found");

        done();
      }
    });
  });

  describe("addJustNumbers", () => {
    it("regular", (done) => {
      try {
        const seed = [20, 3, "million", 50, 1, "hundred", "thousand", 90, 2];

        const result = addJustNumbers(seed);

        expect(result).toEqual([23, "million", 51, "hundred", "thousand", 92]);

        done();
      } catch (e) {
        done(`Shouldn't throw an error >${e}<`);
      }
    });
    it("regular 2", (done) => {
      try {
        const seed = [4, 17, "million", 3, 14, "hundred", "thousand", 6, 40];

        const result = addJustNumbers(seed);

        expect(result).toEqual([21, "million", 17, "hundred", "thousand", 46]);

        done();
      } catch (e) {
        done(`Shouldn't throw an error >${e}<`);
      }
    });
    it("regular 2", (done) => {
      try {
        const seed = [4, 17, "million", 3, 14, "hundred", "thousand"];

        const result = addJustNumbers(seed);

        expect(result).toEqual([21, "million", 17, "hundred", "thousand"]);

        done();
      } catch (e) {
        done(`Shouldn't throw an error >${e}<`);
      }
    });
    it("case 2", (done) => {
      try {
        // equal two thousand and forty five
        const seed = [2, "thousand", 40, 5];

        const result = addJustNumbers(seed);

        expect(result).toEqual([2, "thousand", 45]);

        done();
      } catch (e) {
        done(`Shouldn't throw an error >${e}<`);
      }
    });
  });

  describe("regex", () => {
    it("number", (done) => {
      const num = "123456";

      const match = numberRegex.test(num);

      expect(match).toEqual(true);

      const result = num.replace(numberRegex, "$1");

      expect(result).toEqual("123456");

      done();
    });
    it("end", (done) => {
      const num = "123456d";

      const match = numberRegex.test(num);

      expect(match).toEqual(true);

      const result = num.replace(numberRegex, "$1");

      expect(result).toEqual("123456");

      done();
    });
    it("begining", (done) => {
      const num = "g123456";

      const match = numberRegex.test(num);

      expect(match).toEqual(true);

      const result = num.replace(numberRegex, "$1");

      expect(result).toEqual("123456");

      done();
    });
    it("short", (done) => {
      const num = "6";

      const match = numberRegex.test(num);

      expect(match).toEqual(true);

      const result = num.replace(numberRegex, "$1");

      expect(result).toEqual("6");

      done();
    });
    it("empty", (done) => {
      // that will never happen because of normalization
      const num = "";

      const match = numberRegex.test(num);

      expect(match).toEqual(false);

      const result = num.replace(numberRegex, "$1");

      expect(result).toEqual("");

      done();
    });
  });

  describe("multiplyNumbers", () => {
    it("regular", (done) => {
      try {
        const seed = [21, "million", 17, "hundred", "thousand", 46];

        const result = multiplyNumbers(seed);

        expect(result).toEqual([21000000, 1700000, 46]);

        done();
      } catch (e) {
        done(`Shouldn't throw an error >${e}<`);
      }
    });
    it("no end", (done) => {
      try {
        const seed = [21, "million", 17, "hundred", "thousand"];

        const result = multiplyNumbers(seed);

        expect(result).toEqual([21000000, 1700000]);

        done();
      } catch (e) {
        done(`Shouldn't throw an error >${e}<`);
      }
    });
    it("no end", (done) => {
      try {
        const seed = ["million", 17, "hundred", "thousand"];

        const result = multiplyNumbers(seed);

        expect(result).toEqual([1000000, 1700000]);

        done();
      } catch (e) {
        done(`Shouldn't throw an error >${e}<`);
      }
    });
  });
  describe("finalAdd", () => {
    it("regular", (done) => {
      try {
        const seed = [21000000, 1700000, 46];

        const result = finalAdd(seed);

        expect(result).toEqual(22700046);

        done();
      } catch (e) {
        done(`Shouldn't throw an error >${e}<`);
      }
    });
    it("regular", (done) => {
      try {
        const seed: number[] = [];

        const result = finalAdd(seed);

        expect(result).toEqual(0);

        done();
      } catch (e) {
        done(`Shouldn't throw an error >${e}<`);
      }
    });
  });
});
