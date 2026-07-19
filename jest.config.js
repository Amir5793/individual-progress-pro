const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],
  collectCoverageFrom: [
    "lib/**/*.{js,jsx}",
    "backend/**/*.{js,jsx}",
    "constants/**/*.{js,jsx}",
    "components/**/helpers.js",
    "components/**/helpers.jsx",
    "components/Items/ItemRendered/**/*.{js,jsx}",
    "components/Items/ItemsContainer/**/*.{js,jsx}",
    "components/Items/Item/shared/index.js",
    "components/Items/ItemsManager.jsx",
    "components/Stepper/utils/**/*.{js,jsx}",
    "components/store/**/*.{js,jsx}",
    "!**/node_modules/**",
    "!**/.next/**",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(styled-components|@react-three|three|@react-three/fiber)/)",
  ],
};

module.exports = createJestConfig(customJestConfig);
