module.exports = {
  roots: ["<rootDir>/src"],
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>src/setupTests.ts"],
  testPathIgnorePatterns: ["<rootDir>/cypress/"],
  moduleDirectories: ["node_modules", "src"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transform: {
    "^.+\\.(js|jsx|mjs|cjs|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.scss$": "jest-scss-transform",
    "^.+\\.css$": "<rootDir>/jest/mocks/cssMock.js",
  },
  transformIgnorePatterns: [
    "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$",
    "^.+\\.module\\.(css|sass|scss)$",
    "/!node_modules\\/lodash-es/",
  ],
  moduleNameMapper: {
    "^lodash-es$": "lodash",
  },
  automock: false,
};
