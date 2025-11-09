/**
 * Jest Unit Test Configuration
 * Gorilla Tag Fun Math Game
 *
 * Configuration for unit and integration testing
 * of game systems, utilities, and components.
 */
export default {
  // Use jsdom environment for browser-like testing
  testEnvironment: 'jsdom',

  // Test file patterns
  testMatch: [
    '**/tests/unit/**/*.test.js',
    '**/tests/integration/**/*.test.js'
  ],

  // Setup files to run before tests
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Module path aliases (matching your project structure)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@scenes/(.*)$': '<rootDir>/src/scenes/$1',
    '^@systems/(.*)$': '<rootDir>/src/systems/$1',
    '^@entities/(.*)$': '<rootDir>/src/entities/$1',
    '^@ui/(.*)$': '<rootDir>/src/ui/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@data/(.*)$': '<rootDir>/src/data/$1',
  },

  // Transform files (ES6+ support)
  transform: {
    '^.+\\.js$': 'babel-jest',
  },

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/main.js',
    '!src/**/*.test.js',
    '!src/data/**/*.json',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],

  // Coverage thresholds (80% minimum)
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Coverage reporters
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json',
  ],

  // Coverage directory
  coverageDirectory: 'coverage',

  // Files to ignore in tests
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
    '/.cache/',
  ],

  // Module file extensions
  moduleFileExtensions: ['js', 'json', 'jsx'],

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks between tests
  restoreMocks: true,

  // Maximum number of workers
  maxWorkers: '50%',

  // Test timeout (5 seconds)
  testTimeout: 5000,

  // Globals available in tests
  globals: {
    'process.env.NODE_ENV': 'test',
  },

  // Mock files that can't be loaded in Node
  moduleNameMapper: {
    ...{
      '^@/(.*)$': '<rootDir>/src/$1',
      '^@scenes/(.*)$': '<rootDir>/src/scenes/$1',
      '^@systems/(.*)$': '<rootDir>/src/systems/$1',
      '^@entities/(.*)$': '<rootDir>/src/entities/$1',
      '^@ui/(.*)$': '<rootDir>/src/ui/$1',
      '^@utils/(.*)$': '<rootDir>/src/utils/$1',
      '^@data/(.*)$': '<rootDir>/src/data/$1',
    },
    // Mock asset files
    '\\.(jpg|jpeg|png|gif|svg|mp3|wav|ogg)$': '<rootDir>/tests/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': '<rootDir>/tests/__mocks__/styleMock.js',
  },

  // Transform ignore patterns
  transformIgnorePatterns: [
    'node_modules/(?!(phaser)/)',
  ],
};
