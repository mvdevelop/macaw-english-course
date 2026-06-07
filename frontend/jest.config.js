export default {
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/src/jest.setup.js"],
  moduleNameMapper: {
    // Mock CSS/Style imports
    "\\.(css|less|scss|sass)$": "<rootDir>/src/__mocks__/styleMock.js",
    "^swiper/css.*$": "<rootDir>/src/__mocks__/styleMock.js",
    "^swiper/modules.*$": "<rootDir>/src/__mocks__/swiperModulesMock.js",
    // Mock file imports (images, fonts)
    "\\.(jpg|jpeg|png|gif|webp|svg|ico)$": "<rootDir>/src/__mocks__/fileMock.js",
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx|mjs)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(lucide-react|framer-motion|lenis|react-fast-marquee|swiper|recharts)/)",
  ],
  moduleFileExtensions: ["js", "jsx", "json", "node"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/main.jsx",
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
