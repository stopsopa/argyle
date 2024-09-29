import nlp, { extractComparisonTerm, normalizeScales, deduplicate, extractNumbersAndScales } from "./nlp";

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
  describe("extractComparisonTerm", () => {
    it("find", (done) => {
      try {
        const result = extractComparisonTerm(["over", "equal", "under", "one"]);

        expect(result.comparison).toEqual("over");

        expect(result.words).toEqual(["one"]);

        done();
      } catch (e) {
        done(`Shouldn't throw an error >${e}<`);
      }
    });

    it("no comparison", (done) => {
      try {
        extractComparisonTerm(["xx", "ee", "hhg", "one"]);

        done(`Shouln't reach the end`);
      } catch (e) {
        expect(String(e)).toEqual("Error: tlp.js:extractComparisonTerm error: No comparison term found");

        done();
      }
    });
    it("no numeric", (done) => {
      try {
        extractComparisonTerm(["over"]);

        done(`Shouln't reach the end`);
      } catch (e) {
        expect(String(e)).toEqual(
          "Error: tlp.js:extractComparisonTerm error: No numeric words found beyond comparison terms",
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
});
