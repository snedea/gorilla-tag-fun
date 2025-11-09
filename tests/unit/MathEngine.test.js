/**
 * MathEngine Unit Tests
 * Tests for question generation, answer validation, and difficulty management
 */

import MathEngine from '../../src/systems/MathEngine.js';

describe('MathEngine', () => {
  let engine;

  beforeEach(() => {
    engine = new MathEngine();
    engine.initialize(null); // Use default question bank
  });

  describe('Initialization', () => {
    test('initializes with default values', () => {
      expect(engine.currentDifficulty).toBe('easy');
      expect(engine.recentQuestions).toEqual([]);
      expect(engine.currentQuestion).toBeNull();
    });

    test('loads default question bank when no data provided', () => {
      engine.initialize(null);
      expect(engine.questionBank).toBeDefined();
      expect(engine.questionBank.easy).toBeDefined();
      expect(engine.questionBank.medium).toBeDefined();
      expect(engine.questionBank.hard).toBeDefined();
    });

    test('accepts custom question bank', () => {
      const customBank = {
        easy: [{ id: 'test_1', type: 'equation', operation: 'addition', template: '{a} + {b}', minValue: 1, maxValue: 5 }],
        medium: [],
        hard: []
      };
      engine.initialize(customBank);
      expect(engine.questionBank).toBe(customBank);
    });
  });

  describe('Difficulty Management', () => {
    test('sets valid difficulty levels', () => {
      engine.setDifficulty('easy');
      expect(engine.currentDifficulty).toBe('easy');

      engine.setDifficulty('medium');
      expect(engine.currentDifficulty).toBe('medium');

      engine.setDifficulty('hard');
      expect(engine.currentDifficulty).toBe('hard');
    });

    test('defaults to easy for invalid difficulty', () => {
      engine.setDifficulty('impossible');
      expect(engine.currentDifficulty).toBe('easy');
    });

    test('resets recent questions when difficulty changes', () => {
      engine.recentQuestions = ['q1', 'q2', 'q3'];
      engine.setDifficulty('medium');
      expect(engine.recentQuestions).toEqual([]);
    });
  });

  describe('Question Generation', () => {
    test('generates question within easy difficulty range (0-10)', () => {
      engine.setDifficulty('easy');
      const question = engine.getNextQuestion();

      expect(question).toBeDefined();
      expect(question.values.a).toBeGreaterThanOrEqual(0);
      expect(question.values.a).toBeLessThanOrEqual(10);
      expect(question.values.b).toBeGreaterThanOrEqual(0);
      expect(question.values.b).toBeLessThanOrEqual(10);
    });

    test('generates question within medium difficulty range (10-25)', () => {
      engine.setDifficulty('medium');
      const question = engine.getNextQuestion();

      expect(question).toBeDefined();
      expect(question.values.a).toBeGreaterThanOrEqual(10);
      expect(question.values.a).toBeLessThanOrEqual(25);
      expect(question.values.b).toBeGreaterThanOrEqual(10);
      expect(question.values.b).toBeLessThanOrEqual(25);
    });

    test('generates question within hard difficulty range (25-50)', () => {
      engine.setDifficulty('hard');
      const question = engine.getNextQuestion();

      expect(question).toBeDefined();
      expect(question.values.a).toBeGreaterThanOrEqual(25);
      expect(question.values.a).toBeLessThanOrEqual(50);
      expect(question.values.b).toBeGreaterThanOrEqual(25);
      expect(question.values.b).toBeLessThanOrEqual(50);
    });

    test('generates addition with correct answer', () => {
      engine.setDifficulty('easy');
      const customBank = {
        easy: [{
          id: 'add_test',
          type: 'equation',
          operation: 'addition',
          template: '{a} + {b} = ?',
          minValue: 5,
          maxValue: 5
        }],
        medium: [],
        hard: []
      };
      engine.initialize(customBank);

      const question = engine.getNextQuestion();
      expect(question.operation).toBe('addition');
      expect(question.answer).toBe(10); // 5 + 5
    });

    test('generates subtraction with non-negative answer', () => {
      engine.setDifficulty('easy');

      // Generate multiple questions to test non-negative constraint
      for (let i = 0; i < 10; i++) {
        const question = engine.getNextQuestion();
        if (question.operation === 'subtraction') {
          expect(question.answer).toBeGreaterThanOrEqual(0);
        }
      }
    });

    test('includes all required question properties', () => {
      const question = engine.getNextQuestion();

      expect(question).toHaveProperty('id');
      expect(question).toHaveProperty('type');
      expect(question).toHaveProperty('operation');
      expect(question).toHaveProperty('questionText');
      expect(question).toHaveProperty('answer');
      expect(question).toHaveProperty('visualHint');
      expect(question).toHaveProperty('values');
      expect(question).toHaveProperty('difficulty');
    });

    test('stores current question', () => {
      const question = engine.getNextQuestion();
      expect(engine.currentQuestion).toBe(question);
      expect(engine.getCurrentQuestion()).toBe(question);
    });

    test('does not repeat questions immediately', () => {
      const q1 = engine.getNextQuestion();
      const q2 = engine.getNextQuestion();
      const q3 = engine.getNextQuestion();

      // Extract template IDs (before timestamp)
      const id1 = q1.id.split('_').slice(0, -1).join('_');
      const id2 = q2.id.split('_').slice(0, -1).join('_');
      const id3 = q3.id.split('_').slice(0, -1).join('_');

      // At least one should be different (with default question bank)
      const uniqueIds = new Set([id1, id2, id3]);
      expect(uniqueIds.size).toBeGreaterThan(1);
    });

    test('tracks recent questions up to maxRecentQuestions', () => {
      engine.maxRecentQuestions = 3;

      engine.getNextQuestion();
      engine.getNextQuestion();
      engine.getNextQuestion();
      engine.getNextQuestion();

      expect(engine.recentQuestions.length).toBeLessThanOrEqual(3);
    });

    test('generates fallback question when question bank unavailable', () => {
      engine.questionBank = null;
      const question = engine.getNextQuestion();

      expect(question).toBeDefined();
      expect(question.id).toBeDefined(); // Should have some ID
      expect(['addition', 'subtraction']).toContain(question.operation);
      expect(question.answer).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Answer Validation', () => {
    beforeEach(() => {
      // Set up a known question
      engine.currentQuestion = {
        id: 'test_1',
        answer: 12,
        questionText: '5 + 7 = ?'
      };
    });

    test('validates correct string answer', () => {
      const result = engine.validateAnswer('12');

      expect(result.valid).toBe(true);
      expect(result.correct).toBe(true);
      expect(result.userAnswer).toBe(12);
      expect(result.correctAnswer).toBe(12);
      expect(result.message).toMatch(/great|perfect|awesome|excellent|banana/i);
    });

    test('validates correct number answer', () => {
      const result = engine.validateAnswer(12);

      expect(result.valid).toBe(true);
      expect(result.correct).toBe(true);
    });

    test('rejects incorrect answer', () => {
      const result = engine.validateAnswer('15');

      expect(result.valid).toBe(true);
      expect(result.correct).toBe(false);
      expect(result.userAnswer).toBe(15);
    });

    test('identifies close answers (within 2)', () => {
      const result1 = engine.validateAnswer('13'); // off by 1
      expect(result1.close).toBe(true);

      const result2 = engine.validateAnswer('14'); // off by 2
      expect(result2.close).toBe(true);

      const result3 = engine.validateAnswer('15'); // off by 3
      expect(result3.close).toBe(false);
    });

    test('sanitizes input with whitespace', () => {
      const result = engine.validateAnswer('  12  ');

      expect(result.valid).toBe(true);
      expect(result.correct).toBe(true);
    });

    test('sanitizes input with non-numeric characters', () => {
      const result = engine.validateAnswer('12abc');

      expect(result.valid).toBe(true);
      expect(result.userAnswer).toBe(12);
    });

    test('rejects invalid input', () => {
      const result1 = engine.validateAnswer('abc');
      expect(result1.valid).toBe(false);

      const result2 = engine.validateAnswer('');
      expect(result2.valid).toBe(false);

      const result3 = engine.validateAnswer(null);
      expect(result3.valid).toBe(false);
    });

    test('accepts custom correct answer parameter', () => {
      const result = engine.validateAnswer('25', 25);

      expect(result.valid).toBe(true);
      expect(result.correct).toBe(true);
      expect(result.correctAnswer).toBe(25);
    });

    test('returns error when no question to validate against', () => {
      engine.currentQuestion = null;
      const result = engine.validateAnswer('12');

      expect(result.valid).toBe(false);
      expect(result.message).toContain('No question');
    });

    test('handles negative numbers', () => {
      engine.currentQuestion = { answer: -5 };
      const result = engine.validateAnswer('-5');

      expect(result.valid).toBe(true);
      expect(result.correct).toBe(true);
    });

    test('provides encouraging messages for close answers', () => {
      const result = engine.validateAnswer('13'); // close

      expect(result.message).toMatch(/almost|close|again|try/i);
    });

    test('provides encouraging messages for far answers', () => {
      const result = engine.validateAnswer('99'); // far

      expect(result.message).toMatch(/try|think|shot|learning/i);
    });
  });

  describe('Helper Methods', () => {
    test('randomInt generates integers within range', () => {
      for (let i = 0; i < 100; i++) {
        const num = engine.randomInt(5, 10);
        expect(num).toBeGreaterThanOrEqual(5);
        expect(num).toBeLessThanOrEqual(10);
        expect(Number.isInteger(num)).toBe(true);
      }
    });

    test('getRandomElement returns element from array', () => {
      const array = ['a', 'b', 'c', 'd', 'e'];
      const element = engine.getRandomElement(array);

      expect(array).toContain(element);
    });

    test('getRandomElement returns null for empty array', () => {
      expect(engine.getRandomElement([])).toBeNull();
      expect(engine.getRandomElement(null)).toBeNull();
    });

    test('sanitizeInput removes non-numeric characters', () => {
      expect(engine.sanitizeInput('12abc34')).toBe('1234');
      expect(engine.sanitizeInput('  25  ')).toBe('25');
      expect(engine.sanitizeInput('12.34')).toBe('1234');
    });

    test('sanitizeInput handles negative numbers', () => {
      expect(engine.sanitizeInput('-15')).toBe('-15');
      expect(engine.sanitizeInput('1-5')).toBe('15'); // minus not at start
    });

    test('isValidNumber validates numbers correctly', () => {
      expect(engine.isValidNumber(12)).toBe(true);
      expect(engine.isValidNumber('12')).toBe(true);
      expect(engine.isValidNumber(0)).toBe(true);
      expect(engine.isValidNumber(-5)).toBe(true);
      expect(engine.isValidNumber('abc')).toBe(false);
      expect(engine.isValidNumber('')).toBe(false);
      expect(engine.isValidNumber(NaN)).toBe(false);
      expect(engine.isValidNumber(Infinity)).toBe(false);
    });
  });

  describe('Feedback Messages', () => {
    test('getCorrectMessage returns positive feedback', () => {
      const message = engine.getCorrectMessage();
      expect(typeof message).toBe('string');
      expect(message.length).toBeGreaterThan(0);
    });

    test('getIncorrectMessage returns encouraging feedback', () => {
      const closeMessage = engine.getIncorrectMessage(true);
      expect(typeof closeMessage).toBe('string');

      const farMessage = engine.getIncorrectMessage(false);
      expect(typeof farMessage).toBe('string');
    });

    test('different feedback for close vs far answers', () => {
      // These should be from different message pools
      const closeMessages = new Set();
      const farMessages = new Set();

      for (let i = 0; i < 20; i++) {
        closeMessages.add(engine.getIncorrectMessage(true));
        farMessages.add(engine.getIncorrectMessage(false));
      }

      // Should have collected different messages
      expect(closeMessages.size).toBeGreaterThan(1);
      expect(farMessages.size).toBeGreaterThan(1);
    });
  });

  describe('Reset Functionality', () => {
    test('reset clears current question and recent questions', () => {
      engine.getNextQuestion();
      engine.recentQuestions = ['q1', 'q2'];

      engine.reset();

      expect(engine.currentQuestion).toBeNull();
      expect(engine.recentQuestions).toEqual([]);
    });
  });

  describe('Edge Cases', () => {
    test('handles empty question pool gracefully', () => {
      engine.questionBank = { easy: [], medium: [], hard: [] };
      const question = engine.getNextQuestion();

      // Should return fallback question from default bank
      expect(question).toBeDefined();
      expect(question.id).toBeDefined();
      expect(question.operation).toBeDefined();
    });

    test('handles missing difficulty in question bank', () => {
      engine.questionBank = { easy: [] };
      engine.setDifficulty('medium');
      const question = engine.getNextQuestion();

      expect(question).toBeDefined();
    });

    test('generates unique question IDs', () => {
      const q1 = engine.getNextQuestion();
      const q2 = engine.getNextQuestion();

      expect(q1.id).not.toBe(q2.id);
    });

    test('handles rapid question generation', () => {
      const questions = [];
      for (let i = 0; i < 10; i++) {
        questions.push(engine.getNextQuestion());
      }

      expect(questions.length).toBe(10);
      questions.forEach(q => {
        expect(q).toBeDefined();
        expect(q.answer).toBeDefined();
      });
    });
  });

  describe('Question Bank Structure', () => {
    test('default question bank has all difficulties', () => {
      const bank = engine.getDefaultQuestionBank();

      expect(bank.easy).toBeDefined();
      expect(bank.medium).toBeDefined();
      expect(bank.hard).toBeDefined();
      expect(bank.easy.length).toBeGreaterThan(0);
      expect(bank.medium.length).toBeGreaterThan(0);
      expect(bank.hard.length).toBeGreaterThan(0);
    });

    test('default questions have required properties', () => {
      const bank = engine.getDefaultQuestionBank();

      ['easy', 'medium', 'hard'].forEach(difficulty => {
        bank[difficulty].forEach(template => {
          expect(template).toHaveProperty('id');
          expect(template).toHaveProperty('type');
          expect(template).toHaveProperty('operation');
          expect(template).toHaveProperty('template');
          expect(template).toHaveProperty('minValue');
          expect(template).toHaveProperty('maxValue');
        });
      });
    });

    test('default question bank includes both addition and subtraction', () => {
      const bank = engine.getDefaultQuestionBank();

      const operations = new Set();
      bank.easy.forEach(q => operations.add(q.operation));

      expect(operations.has('addition')).toBe(true);
      expect(operations.has('subtraction')).toBe(true);
    });

    test('default question bank includes different question types', () => {
      const bank = engine.getDefaultQuestionBank();

      const types = new Set();
      bank.easy.forEach(q => types.add(q.type));

      expect(types.has('equation')).toBe(true);
      expect(types.has('word-problem')).toBe(true);
    });
  });

  describe('Subtraction Edge Cases', () => {
    test('subtraction always results in non-negative answers', () => {
      const template = {
        id: 'sub_test',
        type: 'equation',
        operation: 'subtraction',
        template: '{a} - {b} = ?',
        minValue: 0,
        maxValue: 20
      };

      // Test 50 random subtractions
      for (let i = 0; i < 50; i++) {
        const question = engine.generateQuestion(template);
        expect(question.answer).toBeGreaterThanOrEqual(0);
      }
    });

    test('subtraction formats question with larger - smaller', () => {
      const template = {
        id: 'sub_test',
        type: 'equation',
        operation: 'subtraction',
        template: '{a} - {b} = ?',
        minValue: 10,
        maxValue: 10
      };

      const question = engine.generateQuestion(template);
      expect(question.questionText).toBe('10 - 10 = ?');
      expect(question.answer).toBe(0);
    });
  });
});
