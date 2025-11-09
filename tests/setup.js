/**
 * Jest Test Setup File
 * Runs before each test suite to configure the testing environment
 */

// Mock localStorage for testing
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }

  get length() {
    return Object.keys(this.store).length;
  }

  key(index) {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }
}

// Add localStorage to global scope
global.localStorage = new LocalStorageMock();

// Mock console methods to reduce noise in tests (optional)
// Uncomment if you want to suppress console logs during tests
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// };

// Set up test timeout
jest.setTimeout(10000);

// Mock Phaser for unit tests (Phaser is heavy and not needed for unit tests)
jest.mock('phaser', () => ({
  Game: jest.fn(),
  Scene: jest.fn(),
  AUTO: 'AUTO',
  WEBGL: 'WEBGL',
  CANVAS: 'CANVAS',
}));

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

// Global test utilities
global.testUtils = {
  /**
   * Wait for a condition to be true
   * @param {Function} condition - Function that returns boolean
   * @param {number} timeout - Max time to wait in ms
   * @returns {Promise<boolean>}
   */
  async waitFor(condition, timeout = 5000) {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      if (condition()) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return false;
  },

  /**
   * Create a mock question object
   * @param {Object} overrides - Properties to override
   * @returns {Object} Mock question
   */
  createMockQuestion(overrides = {}) {
    return {
      id: 'test_question_1',
      type: 'equation',
      operation: 'addition',
      questionText: '5 + 3 = ?',
      answer: 8,
      visualHint: false,
      hintType: null,
      values: { a: 5, b: 3 },
      difficulty: 'easy',
      ...overrides
    };
  },

  /**
   * Create mock session data
   * @param {Object} overrides - Properties to override
   * @returns {Object} Mock session
   */
  createMockSession(overrides = {}) {
    return {
      difficulty: 'easy',
      currentQuestion: 0,
      totalQuestions: 5,
      score: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      totalAnswers: 0,
      bananasCollected: 0,
      startTime: Date.now(),
      elapsedTime: 0,
      starsEarned: 0,
      ...overrides
    };
  },

  /**
   * Create mock question bank
   * @returns {Object} Mock question bank
   */
  createMockQuestionBank() {
    return {
      easy: [
        {
          id: 'add_easy_001',
          type: 'equation',
          operation: 'addition',
          template: '{a} + {b} = ?',
          minValue: 0,
          maxValue: 10,
          visualHint: true,
          hintType: 'bananas'
        },
        {
          id: 'sub_easy_001',
          type: 'equation',
          operation: 'subtraction',
          template: '{a} - {b} = ?',
          minValue: 0,
          maxValue: 10,
          visualHint: true,
          hintType: 'bananas'
        }
      ],
      medium: [
        {
          id: 'add_medium_001',
          type: 'equation',
          operation: 'addition',
          template: '{a} + {b} = ?',
          minValue: 10,
          maxValue: 25,
          visualHint: false
        }
      ],
      hard: [
        {
          id: 'add_hard_001',
          type: 'equation',
          operation: 'addition',
          template: '{a} + {b} = ?',
          minValue: 25,
          maxValue: 50,
          visualHint: false
        }
      ]
    };
  }
};

// Set up DOM environment for tests that need it
if (typeof document !== 'undefined') {
  // Add any DOM setup here
  document.body.innerHTML = '<div id="game-container"></div>';
}

console.log('Jest test environment setup complete');
