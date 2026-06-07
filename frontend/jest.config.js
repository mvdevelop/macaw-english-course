export default {
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/src/jest.setup.ts"],
  moduleNameMapper: {
    // Mock CSS/Style imports
    "\\.(css|less|scss|sass)$": "<rootDir>/src/__mocks__/styleMock.ts",
    "^swiper/css.*$": "<rootDir>/src/__mocks__/styleMock.ts",
    "^swiper/modules.*$": "<rootDir>/src/__mocks__/swiperModulesMock.ts",
    // Mock file imports (images, fonts)
    "\\.(jpg|jpeg|png|gif|webp|svg|ico)$": "<rootDir>/src/__mocks__/fileMock.ts",
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx|mjs)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(lucide-react|framer-motion|lenis|react-fast-marquee|swiper|recharts)/)",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/main.tsx",
    "!src/index.css",
    "!src/**/*.data.*",
    "!src/icons/**",
  ],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 40,
      statements: 40,
    },
  },
};
