import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["html", "text"],
  collectCoverageFrom: ["server/**/*.ts"],
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
};

export default config;