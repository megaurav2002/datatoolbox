import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  modulePathIgnorePatterns: ["<rootDir>/.next/"],
  testPathIgnorePatterns: ["<rootDir>/.next/"],
  collectCoverageFrom: [
    "lib/transformations/**/*.ts",
    "components/tools/HashGeneratorTool.tsx",
    "components/tools/MermaidEditorTool.tsx",
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    "./lib/transformations/index.ts": {
      branches: 80,
      functions: 90,
      lines: 85,
      statements: 85,
    },
    "./lib/transformations/hash.ts": {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
    "./components/tools/*.tsx": {
      branches: 30,
      functions: 45,
      lines: 40,
      statements: 40,
    },
  },
};

export default createJestConfig(customJestConfig);
