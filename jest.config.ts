import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["html", "text"],
  collectCoverageFrom: ["server/**/*.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};

export default config;

// module.exports = {
//   verbose: true,
//   // collectCoverage: true,
//   // coverageDirectory: "coverage",
//   // // coverageReporters: ["html", "text"],
//   // coverageReporters: ["html"],
//   // collectCoverageFrom: ["app/**/*.{js,jsx}", "lib/**/*.{js,jsx}", "jasmine/**/*.{js,jsx}", "src/**/*.{js,jsx}"],
//   // testRegex,
//   // snapshotResolver: "./jest.snapshotResolver.cjs",
//   // watchPathIgnorePatterns: [".snap.js$"],
//   // transform: {
//   //   // to turn off code transforms for ESM support in testing https://jestjs.io/docs/ecmascript-modules
//   //   "^.+\\.[t|j]sx?$": "babel-jest",
//   // },
// };
