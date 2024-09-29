import nlp, { extractComparisonTerm } from "./nlp";

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
        const ret = extractComparisonTerm(["over", "equal", "under", "one"]);

        expect(ret.comparison).toEqual("over");

        expect(ret.words).toEqual(["one"]);

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
        expect(String(e)).toEqual("Error: extractComparisonTerm error: No comparison term found");

        done();
      }
    });
    it("no numeric", (done) => {
      try {
        extractComparisonTerm(["over"]);

        done(`Shouln't reach the end`);
      } catch (e) {
        expect(String(e)).toEqual("Error: extractComparisonTerm error: No numeric words found beyond comparison terms");

        done();
      }
    });
  });
});
