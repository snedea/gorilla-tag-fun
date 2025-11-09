/**
 * MathEngine.js
 * Handles question generation, answer validation, and difficulty management
 * for the Gorilla Tag Fun Math Game
 */

export default class MathEngine {
  constructor() {
    this.questionBank = null;
    this.currentDifficulty = 'easy';
    this.recentQuestions = [];
    this.maxRecentQuestions = 3;
    this.currentQuestion = null;
  }

  /**
   * Initialize the engine with question data
   * @param {Object} questionData - Question bank JSON data
   */
  initialize(questionData) {
    if (!questionData) {
      console.error('MathEngine: No question data provided');
      this.questionBank = this.getDefaultQuestionBank();
      return;
    }

    this.questionBank = questionData;
  }

  /**
   * Set the current difficulty level
   * @param {string} level - 'easy', 'medium', or 'hard'
   */
  setDifficulty(level) {
    const validLevels = ['easy', 'medium', 'hard'];

    if (!validLevels.includes(level)) {
      console.warn(`MathEngine: Invalid difficulty "${level}". Using "easy".`);
      this.currentDifficulty = 'easy';
      return;
    }

    this.currentDifficulty = level;
    this.recentQuestions = []; // Reset recent questions on difficulty change
  }

  /**
   * Get the next question based on current difficulty
   * @returns {Object} Question object with text, answer, and metadata
   */
  getNextQuestion() {
    if (!this.questionBank) {
      console.error('MathEngine: Question bank not initialized. Using default.');
      this.questionBank = this.getDefaultQuestionBank();
    }

    const difficulty = this.currentDifficulty;
    const pool = this.questionBank[difficulty];

    if (!pool || pool.length === 0) {
      console.error(`MathEngine: No questions available for difficulty "${difficulty}"`);
      return this.generateFallbackQuestion();
    }

    // Filter out recently used questions to avoid repetition
    const available = pool.filter(template =>
      !this.recentQuestions.includes(template.id)
    );

    // If all questions were recently used, reset the recent list
    const questionPool = available.length > 0 ? available : pool;

    // Select random question template
    const template = this.getRandomElement(questionPool);

    // Generate question with random values
    const question = this.generateQuestion(template);

    // Track this question as recently used
    this.addToRecentQuestions(template.id);

    // Store current question for validation
    this.currentQuestion = question;

    return question;
  }

  /**
   * Generate a question from a template
   * @param {Object} template - Question template
   * @returns {Object} Generated question
   */
  generateQuestion(template) {
    // Generate random values within the template's range
    const a = this.randomInt(template.minValue, template.maxValue);
    const b = this.randomInt(template.minValue, template.maxValue);

    // Calculate the correct answer
    let answer;
    if (template.operation === 'addition') {
      answer = a + b;
    } else if (template.operation === 'subtraction') {
      // Ensure non-negative results for 2nd graders
      answer = Math.max(a, b) - Math.min(a, b);
    } else {
      console.warn(`MathEngine: Unknown operation "${template.operation}"`);
      answer = a + b;
    }

    // Format the question text
    let questionText = template.template
      .replace('{a}', a)
      .replace('{b}', b);

    // For subtraction, ensure we format with larger - smaller
    if (template.operation === 'subtraction') {
      const larger = Math.max(a, b);
      const smaller = Math.min(a, b);
      questionText = template.template
        .replace('{a}', larger)
        .replace('{b}', smaller);
    }

    return {
      id: `${template.id}_${Date.now()}`,
      type: template.type,
      operation: template.operation,
      questionText: questionText,
      answer: answer,
      visualHint: template.visualHint || false,
      hintType: template.hintType || null,
      values: { a, b },
      difficulty: this.currentDifficulty
    };
  }

  /**
   * Validate a user's answer
   * @param {string|number} userInput - User's answer
   * @param {number} correctAnswer - The correct answer (optional, uses current question if not provided)
   * @returns {Object} Validation result
   */
  validateAnswer(userInput, correctAnswer = null) {
    // Use provided answer or current question's answer
    const expected = correctAnswer !== null ? correctAnswer :
      (this.currentQuestion ? this.currentQuestion.answer : null);

    if (expected === null) {
      return {
        valid: false,
        correct: false,
        message: 'No question to validate against'
      };
    }

    // Sanitize and convert input
    const cleaned = this.sanitizeInput(userInput);
    const userAnswer = parseInt(cleaned, 10);

    // Check if valid number
    if (!this.isValidNumber(userAnswer)) {
      return {
        valid: false,
        correct: false,
        message: 'Please enter a valid number'
      };
    }

    // Check if correct
    const isCorrect = userAnswer === expected;

    // Check if close (within 2)
    const isClose = Math.abs(userAnswer - expected) <= 2;

    return {
      valid: true,
      correct: isCorrect,
      close: !isCorrect && isClose,
      userAnswer: userAnswer,
      correctAnswer: expected,
      message: isCorrect ? this.getCorrectMessage() : this.getIncorrectMessage(isClose)
    };
  }

  /**
   * Get a random encouraging message for correct answers
   * @returns {string} Encouraging message
   */
  getCorrectMessage() {
    const messages = [
      'Great job!',
      "You're a math whiz!",
      'Perfect!',
      'Awesome!',
      'Super smart!',
      'You got it!',
      'Excellent work!',
      'Banana-tastic!'
    ];
    return this.getRandomElement(messages);
  }

  /**
   * Get an encouraging message for incorrect answers
   * @param {boolean} isClose - Whether the answer was close
   * @returns {string} Encouraging message
   */
  getIncorrectMessage(isClose) {
    if (isClose) {
      const closeMessages = [
        'Almost there!',
        'So close!',
        'Try again!',
        'You can do it!',
        'Give it another try!',
        'Nearly got it!'
      ];
      return this.getRandomElement(closeMessages);
    } else {
      const farMessages = [
        'Not quite, try again!',
        "Let's think about this!",
        'Give it another shot!',
        'Keep trying!',
        "You're learning!"
      ];
      return this.getRandomElement(farMessages);
    }
  }

  /**
   * Add a question ID to the recent questions list
   * @param {string} questionId - Question template ID
   */
  addToRecentQuestions(questionId) {
    this.recentQuestions.push(questionId);

    // Keep only the most recent N questions
    if (this.recentQuestions.length > this.maxRecentQuestions) {
      this.recentQuestions.shift();
    }
  }

  /**
   * Sanitize user input
   * @param {string|number} input - Raw user input
   * @returns {string} Sanitized input
   */
  sanitizeInput(input) {
    if (typeof input === 'number') {
      return input.toString();
    }

    // Remove whitespace and non-numeric characters except negative sign
    return input.toString().trim().replace(/[^0-9-]/g, '');
  }

  /**
   * Check if a value is a valid number
   * @param {*} value - Value to check
   * @returns {boolean} True if valid number
   */
  isValidNumber(value) {
    return !isNaN(value) && isFinite(value) && value !== '';
  }

  /**
   * Generate a random integer between min and max (inclusive)
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Random integer
   */
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Get a random element from an array
   * @param {Array} array - Array to select from
   * @returns {*} Random element
   */
  getRandomElement(array) {
    if (!array || array.length === 0) {
      return null;
    }
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Generate a fallback question when question bank is unavailable
   * @returns {Object} Fallback question
   */
  generateFallbackQuestion() {
    const a = this.randomInt(1, 10);
    const b = this.randomInt(1, 10);
    const answer = a + b;

    return {
      id: `fallback_${Date.now()}`,
      type: 'equation',
      operation: 'addition',
      questionText: `${a} + ${b} = ?`,
      answer: answer,
      visualHint: false,
      hintType: null,
      values: { a, b },
      difficulty: 'easy'
    };
  }

  /**
   * Get default question bank if none is loaded
   * @returns {Object} Default question bank
   */
  getDefaultQuestionBank() {
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
          id: 'add_easy_002',
          type: 'word-problem',
          operation: 'addition',
          template: 'The gorilla found {a} bananas. Then found {b} more. How many total?',
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
        },
        {
          id: 'sub_easy_002',
          type: 'word-problem',
          operation: 'subtraction',
          template: 'The gorilla had {a} bananas and ate {b}. How many are left?',
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
        },
        {
          id: 'sub_medium_001',
          type: 'equation',
          operation: 'subtraction',
          template: '{a} - {b} = ?',
          minValue: 10,
          maxValue: 25,
          visualHint: false
        },
        {
          id: 'add_medium_002',
          type: 'word-problem',
          operation: 'addition',
          template: 'The gorilla swung past {a} vines and then {b} more. How many vines total?',
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
        },
        {
          id: 'sub_hard_001',
          type: 'equation',
          operation: 'subtraction',
          template: '{a} - {b} = ?',
          minValue: 25,
          maxValue: 50,
          visualHint: false
        },
        {
          id: 'add_hard_002',
          type: 'word-problem',
          operation: 'addition',
          template: 'The gorilla collected {a} bananas yesterday and {b} today. How many total?',
          minValue: 25,
          maxValue: 50,
          visualHint: false
        }
      ]
    };
  }

  /**
   * Get current question
   * @returns {Object} Current question object
   */
  getCurrentQuestion() {
    return this.currentQuestion;
  }

  /**
   * Reset the engine state
   */
  reset() {
    this.currentQuestion = null;
    this.recentQuestions = [];
  }
}
