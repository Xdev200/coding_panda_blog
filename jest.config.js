/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterFramework: [],
  setupFilesAfterEach: [],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|less|scss|sass)$": "<rootDir>/__mocks__/styleMock.js",
    "\\.(jpg|jpeg|png|gif|svg|webp)$": "<rootDir>/__mocks__/fileMock.js",
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": [
      "babel-jest",
      {
        presets: [
          ["@babel/preset-env", { targets: { node: "current" } }],
          ["@babel/preset-react", { runtime: "automatic" }],
          "@babel/preset-typescript",
        ],
      },
    ],
  },
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "services/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!app/layout.tsx",
    "!app/page.tsx",
    "!app/not-found.tsx",
  ],
  coverageThreshold: {
    global: {
      lines: 90,
      branches: 85,
      functions: 90,
      statements: 90,
    },
  },
  testMatch: [
    "**/__tests__/**/*.{ts,tsx,js}",
    "**/*.test.{ts,tsx,js}",
  ],
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
};

module.exports = config;
