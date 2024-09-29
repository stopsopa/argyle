import formatNumber from "./formatNumber";

describe("formatNumber", () => {
  it("regular", (done) => {
    try {
      const result = formatNumber("123456.78");

      expect(result).toEqual("123,456.78");

      done();
    } catch (e) {
      done(`Shouldn't throw an error >${e}<`);
    }
  });
  it("two", (done) => {
    try {
      const result = formatNumber("12.78");

      expect(result).toEqual("12.78");

      done();
    } catch (e) {
      done(`Shouldn't throw an error >${e}<`);
    }
  });
  it("trhee", (done) => {
    try {
      const result = formatNumber("152.78");

      expect(result).toEqual("152.78");

      done();
    } catch (e) {
      done(`Shouldn't throw an error >${e}<`);
    }
  });
  it("four", (done) => {
    try {
      const result = formatNumber("7152.78");

      expect(result).toEqual("7,152.78");

      done();
    } catch (e) {
      done(`Shouldn't throw an error >${e}<`);
    }
  });
  it("six", (done) => {
    try {
      const result = formatNumber("637152.78");

      expect(result).toEqual("637,152.78");

      done();
    } catch (e) {
      done(`Shouldn't throw an error >${e}<`);
    }
  });
  it("seven", (done) => {
    try {
      const result = formatNumber("2637152.78");

      expect(result).toEqual("2,637,152.78");

      done();
    } catch (e) {
      done(`Shouldn't throw an error >${e}<`);
    }
  });
  it("throw", (done) => {
    try {
      formatNumber("12345678");

      done(`Shouldn't reach the end`);
    } catch (e) {
      expect(String(e)).toEqual("Error: formatNumber.ts error: Number 12345678 is not in correct format");

      done();
    }
  });
  it("throw 2", (done) => {
    try {
      /* @ts-ignore */
      formatNumber("123456.78", 7);

      done(`Shouldn't reach the end`);
    } catch (e) {
      expect(String(e)).toEqual("Error: formatNumber.ts error: Separator 7 shuld be a string");

      done();
    }
  });
  it("smallest", (done) => {
    try {
      const result = formatNumber("1.00");

      expect(result).toEqual("1.00");

      done();
    } catch (e) {
      done(`Shouldn't throw an error >${e}<`);
    }
  });
  it("custom separator", (done) => {
    try {
      const result = formatNumber("2637152.78", "xx");

      expect(result).toEqual("2xx637xx152.78");

      done();
    } catch (e) {
      done(`Shouldn't throw an error >${e}<`);
    }
  });
  it("space separator", (done) => {
    try {
      const result = formatNumber("2637152.78", " ");

      expect(result).toEqual("2 637 152.78");

      done();
    } catch (e) {
      done(`Shouldn't throw an error >${e}<`);
    }
  });
});
