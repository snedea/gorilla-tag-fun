/**
 * Validators Unit Tests
 * Tests for input validation and sanitization functions
 */

import {
  isValidNumber,
  isInRange,
  sanitizeInput,
  validateAnswer,
  isValidDifficulty,
  isValidQuestion,
  isValidScore,
  isValidAccuracy,
  sanitizeString,
  validatePlayerName,
  isValidStorageData,
  isValidTimestamp,
  isAnswerClose,
  isValidSession
} from '../../src/utils/validators.js';

describe('Validators', () => {
  describe('isValidNumber', () => {
    test('validates valid numbers', () => {
      expect(isValidNumber(0)).toBe(true);
      expect(isValidNumber(123)).toBe(true);
      expect(isValidNumber(-5)).toBe(true);
      expect(isValidNumber(3.14)).toBe(true);
      expect(isValidNumber('42')).toBe(true);
      expect(isValidNumber('0')).toBe(true);
    });

    test('rejects invalid numbers', () => {
      expect(isValidNumber('abc')).toBe(false);
      expect(isValidNumber('')).toBe(false);
      expect(isValidNumber('  ')).toBe(false);
      expect(isValidNumber(null)).toBe(false);
      expect(isValidNumber(undefined)).toBe(false);
      expect(isValidNumber(NaN)).toBe(false);
      expect(isValidNumber(Infinity)).toBe(false);
      expect(isValidNumber(-Infinity)).toBe(false);
    });

    test('handles edge cases', () => {
      expect(isValidNumber(0)).toBe(true);
      expect(isValidNumber(-0)).toBe(true);
      expect(isValidNumber('  42  ')).toBe(true); // Trimmed
    });
  });

  describe('isInRange', () => {
    test('validates numbers within range', () => {
      expect(isInRange(5, 0, 10)).toBe(true);
      expect(isInRange(0, 0, 10)).toBe(true);
      expect(isInRange(10, 0, 10)).toBe(true);
      expect(isInRange('5', 0, 10)).toBe(true);
    });

    test('rejects numbers outside range', () => {
      expect(isInRange(15, 0, 10)).toBe(false);
      expect(isInRange(-1, 0, 10)).toBe(false);
      expect(isInRange(11, 0, 10)).toBe(false);
    });

    test('rejects invalid numbers', () => {
      expect(isInRange('abc', 0, 10)).toBe(false);
      expect(isInRange(null, 0, 10)).toBe(false);
      expect(isInRange(undefined, 0, 10)).toBe(false);
    });

    test('handles negative ranges', () => {
      expect(isInRange(-5, -10, 0)).toBe(true);
      expect(isInRange(-11, -10, 0)).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    test('removes whitespace', () => {
      expect(sanitizeInput('  123  ')).toBe('123');
      expect(sanitizeInput(' 4 5 6 ')).toBe('456');
    });

    test('removes non-numeric characters', () => {
      expect(sanitizeInput('12abc34')).toBe('1234');
      expect(sanitizeInput('12.34')).toBe('1234');
      expect(sanitizeInput('$100')).toBe('100');
      expect(sanitizeInput('12,345')).toBe('12345');
    });

    test('preserves negative sign at start', () => {
      expect(sanitizeInput('-15')).toBe('-15');
      expect(sanitizeInput('-123')).toBe('-123');
    });

    test('removes negative sign not at start', () => {
      expect(sanitizeInput('12-34')).toBe('1234');
      expect(sanitizeInput('1-2-3')).toBe('123');
    });

    test('handles multiple negative signs', () => {
      expect(sanitizeInput('--15')).toBe('-15');
      expect(sanitizeInput('---20')).toBe('-20');
    });

    test('handles null and undefined', () => {
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
    });

    test('converts numbers to strings', () => {
      expect(sanitizeInput(123)).toBe('123');
      expect(sanitizeInput(-45)).toBe('-45');
    });

    test('handles empty string', () => {
      expect(sanitizeInput('')).toBe('');
      expect(sanitizeInput('   ')).toBe('');
    });
  });

  describe('validateAnswer', () => {
    test('validates correct answer', () => {
      const result = validateAnswer('12', 12);

      expect(result.valid).toBe(true);
      expect(result.correct).toBe(true);
      expect(result.value).toBe(12);
      expect(result.message).toBe('Correct!');
    });

    test('validates incorrect answer', () => {
      const result = validateAnswer('15', 12);

      expect(result.valid).toBe(true);
      expect(result.correct).toBe(false);
      expect(result.value).toBe(15);
    });

    test('identifies close answers', () => {
      const result1 = validateAnswer('13', 12);
      expect(result1.close).toBe(true);

      const result2 = validateAnswer('14', 12);
      expect(result2.close).toBe(true);

      const result3 = validateAnswer('10', 12);
      expect(result3.close).toBe(true);
    });

    test('identifies answers that are not close', () => {
      const result = validateAnswer('20', 12);
      expect(result.close).toBe(false);
    });

    test('rejects invalid input', () => {
      const result = validateAnswer('abc', 12);

      expect(result.valid).toBe(false);
      expect(result.correct).toBe(false);
      expect(result.value).toBeNull();
      expect(result.message).toBe('Please enter a number');
    });

    test('sanitizes input before validation', () => {
      const result = validateAnswer('  12  ', 12);
      expect(result.correct).toBe(true);

      const result2 = validateAnswer('12abc', 12);
      expect(result2.correct).toBe(true);
    });

    test('handles negative answers', () => {
      const result = validateAnswer('-5', -5);
      expect(result.correct).toBe(true);
    });
  });

  describe('isValidDifficulty', () => {
    test('validates valid difficulty levels', () => {
      expect(isValidDifficulty('easy')).toBe(true);
      expect(isValidDifficulty('medium')).toBe(true);
      expect(isValidDifficulty('hard')).toBe(true);
    });

    test('handles case insensitivity', () => {
      expect(isValidDifficulty('EASY')).toBe(true);
      expect(isValidDifficulty('Medium')).toBe(true);
      expect(isValidDifficulty('HARD')).toBe(true);
    });

    test('rejects invalid difficulty levels', () => {
      expect(isValidDifficulty('impossible')).toBe(false);
      expect(isValidDifficulty('normal')).toBe(false);
      expect(isValidDifficulty('')).toBe(false);
      expect(isValidDifficulty(null)).toBe(false);
    });
  });

  describe('isValidQuestion', () => {
    test('validates valid question object', () => {
      const question = {
        id: 'test_1',
        type: 'equation',
        operation: 'addition',
        questionText: '5 + 3 = ?',
        answer: 8
      };

      expect(isValidQuestion(question)).toBe(true);
    });

    test('validates word problem', () => {
      const question = {
        id: 'word_1',
        type: 'word-problem',
        operation: 'subtraction',
        questionText: 'The gorilla had 10 bananas and ate 3. How many are left?',
        answer: 7
      };

      expect(isValidQuestion(question)).toBe(true);
    });

    test('rejects question missing required fields', () => {
      const incomplete = {
        id: 'test_1',
        type: 'equation'
        // Missing operation, questionText, answer
      };

      expect(isValidQuestion(incomplete)).toBe(false);
    });

    test('rejects question with invalid type', () => {
      const invalid = {
        id: 'test_1',
        type: 'invalid-type',
        operation: 'addition',
        questionText: '5 + 3 = ?',
        answer: 8
      };

      expect(isValidQuestion(invalid)).toBe(false);
    });

    test('rejects question with invalid operation', () => {
      const invalid = {
        id: 'test_1',
        type: 'equation',
        operation: 'multiplication',
        questionText: '5 × 3 = ?',
        answer: 15
      };

      expect(isValidQuestion(invalid)).toBe(false);
    });

    test('rejects question with invalid answer', () => {
      const invalid = {
        id: 'test_1',
        type: 'equation',
        operation: 'addition',
        questionText: '5 + 3 = ?',
        answer: 'eight'
      };

      expect(isValidQuestion(invalid)).toBe(false);
    });

    test('rejects null or non-object', () => {
      expect(isValidQuestion(null)).toBe(false);
      expect(isValidQuestion(undefined)).toBe(false);
      expect(isValidQuestion('string')).toBe(false);
      expect(isValidQuestion(123)).toBe(false);
    });
  });

  describe('isValidScore', () => {
    test('validates valid scores', () => {
      expect(isValidScore(0)).toBe(true);
      expect(isValidScore(100)).toBe(true);
      expect(isValidScore(9999)).toBe(true);
      expect(isValidScore('500')).toBe(true);
    });

    test('rejects negative scores', () => {
      expect(isValidScore(-10)).toBe(false);
      expect(isValidScore('-5')).toBe(false);
    });

    test('rejects invalid score types', () => {
      expect(isValidScore('abc')).toBe(false);
      expect(isValidScore(null)).toBe(false);
      expect(isValidScore(undefined)).toBe(false);
    });
  });

  describe('isValidAccuracy', () => {
    test('validates valid accuracy percentages', () => {
      expect(isValidAccuracy(0)).toBe(true);
      expect(isValidAccuracy(50)).toBe(true);
      expect(isValidAccuracy(100)).toBe(true);
      expect(isValidAccuracy(66.67)).toBe(true);
    });

    test('rejects accuracy outside 0-100 range', () => {
      expect(isValidAccuracy(-10)).toBe(false);
      expect(isValidAccuracy(101)).toBe(false);
      expect(isValidAccuracy(150)).toBe(false);
    });

    test('rejects invalid accuracy types', () => {
      expect(isValidAccuracy('abc')).toBe(false);
      expect(isValidAccuracy(null)).toBe(false);
    });
  });

  describe('sanitizeString', () => {
    // Note: This test requires DOM environment (jsdom)
    test('sanitizes HTML entities', () => {
      const result = sanitizeString('<script>alert("xss")</script>');
      expect(result).not.toContain('<script>');
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
    });

    test('preserves safe text', () => {
      const result = sanitizeString('Hello World');
      expect(result).toBe('Hello World');
    });

    test('handles empty string', () => {
      expect(sanitizeString('')).toBe('');
      expect(sanitizeString(null)).toBe('');
      expect(sanitizeString(undefined)).toBe('');
    });

    test('escapes special characters', () => {
      const result = sanitizeString('5 < 10 & 10 > 5');
      expect(result).toContain('&lt;');
      expect(result).toContain('&gt;');
      expect(result).toContain('&amp;');
    });
  });

  describe('validatePlayerName', () => {
    test('validates valid player names', () => {
      const result1 = validatePlayerName('John');
      expect(result1.valid).toBe(true);

      const result2 = validatePlayerName('Player 123');
      expect(result2.valid).toBe(true);
    });

    test('rejects empty names', () => {
      const result = validatePlayerName('');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('empty');
    });

    test('rejects names too short', () => {
      const result = validatePlayerName('A');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('at least 2');
    });

    test('rejects names too long', () => {
      const result = validatePlayerName('A'.repeat(21));
      expect(result.valid).toBe(false);
      expect(result.message).toContain('20 characters');
    });

    test('rejects names with special characters', () => {
      const result = validatePlayerName('John@123');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('letters, numbers, and spaces');
    });

    test('accepts names with spaces', () => {
      const result = validatePlayerName('John Doe');
      expect(result.valid).toBe(true);
    });

    test('trims whitespace', () => {
      const result = validatePlayerName('  John  ');
      expect(result.valid).toBe(true);
    });

    test('rejects null or non-string', () => {
      const result1 = validatePlayerName(null);
      expect(result1.valid).toBe(false);

      const result2 = validatePlayerName(123);
      expect(result2.valid).toBe(false);
    });
  });

  describe('isValidStorageData', () => {
    test('validates objects', () => {
      expect(isValidStorageData({ key: 'value' }, 'object')).toBe(true);
      expect(isValidStorageData({}, 'object')).toBe(true);
    });

    test('validates arrays', () => {
      expect(isValidStorageData([1, 2, 3], 'array')).toBe(true);
      expect(isValidStorageData([], 'array')).toBe(true);
    });

    test('validates primitive types', () => {
      expect(isValidStorageData('string', 'string')).toBe(true);
      expect(isValidStorageData(123, 'number')).toBe(true);
      expect(isValidStorageData(true, 'boolean')).toBe(true);
    });

    test('rejects null and undefined', () => {
      expect(isValidStorageData(null, 'object')).toBe(false);
      expect(isValidStorageData(undefined, 'object')).toBe(false);
    });

    test('distinguishes between object and array', () => {
      expect(isValidStorageData([1, 2], 'object')).toBe(false);
      expect(isValidStorageData({ key: 'value' }, 'array')).toBe(false);
    });
  });

  describe('isValidTimestamp', () => {
    test('validates valid timestamps', () => {
      const now = Date.now();
      expect(isValidTimestamp(now)).toBe(true);

      const year2020 = new Date('2020-01-01').getTime();
      expect(isValidTimestamp(year2020)).toBe(true);
    });

    test('rejects timestamps before year 2000', () => {
      const year1999 = new Date('1999-12-31').getTime();
      expect(isValidTimestamp(year1999)).toBe(false);
    });

    test('rejects timestamps after year 2100', () => {
      const year2101 = new Date('2101-01-01').getTime();
      expect(isValidTimestamp(year2101)).toBe(false);
    });

    test('rejects invalid timestamps', () => {
      expect(isValidTimestamp('not a timestamp')).toBe(false);
      expect(isValidTimestamp(null)).toBe(false);
      expect(isValidTimestamp(undefined)).toBe(false);
    });
  });

  describe('isAnswerClose', () => {
    test('identifies answers within threshold', () => {
      expect(isAnswerClose(10, 12, 2)).toBe(true);
      expect(isAnswerClose(14, 12, 2)).toBe(true);
      expect(isAnswerClose(13, 12, 2)).toBe(true);
      expect(isAnswerClose(11, 12, 2)).toBe(true);
    });

    test('rejects exact matches as close', () => {
      expect(isAnswerClose(12, 12, 2)).toBe(false);
    });

    test('rejects answers outside threshold', () => {
      expect(isAnswerClose(9, 12, 2)).toBe(false);
      expect(isAnswerClose(15, 12, 2)).toBe(false);
    });

    test('uses default threshold of 2', () => {
      expect(isAnswerClose(10, 12)).toBe(true);
      expect(isAnswerClose(14, 12)).toBe(true);
      expect(isAnswerClose(9, 12)).toBe(false);
    });

    test('handles custom threshold', () => {
      expect(isAnswerClose(8, 12, 5)).toBe(true);
      expect(isAnswerClose(6, 12, 5)).toBe(false);
    });

    test('rejects invalid inputs', () => {
      expect(isAnswerClose('abc', 12)).toBe(false);
      expect(isAnswerClose(12, 'xyz')).toBe(false);
      expect(isAnswerClose(null, 12)).toBe(false);
    });
  });

  describe('isValidSession', () => {
    test('validates valid session object', () => {
      const session = {
        sessionId: 'session_123',
        difficulty: 'easy',
        startTime: Date.now(),
        score: 500
      };

      expect(isValidSession(session)).toBe(true);
    });

    test('rejects session missing required fields', () => {
      const incomplete = {
        sessionId: 'session_123',
        difficulty: 'easy'
        // Missing startTime and score
      };

      expect(isValidSession(incomplete)).toBe(false);
    });

    test('rejects session with invalid difficulty', () => {
      const invalid = {
        sessionId: 'session_123',
        difficulty: 'impossible',
        startTime: Date.now(),
        score: 500
      };

      expect(isValidSession(invalid)).toBe(false);
    });

    test('rejects session with invalid score', () => {
      const invalid = {
        sessionId: 'session_123',
        difficulty: 'easy',
        startTime: Date.now(),
        score: -100
      };

      expect(isValidSession(invalid)).toBe(false);
    });

    test('rejects session with invalid timestamp', () => {
      const invalid = {
        sessionId: 'session_123',
        difficulty: 'easy',
        startTime: 123, // Too old
        score: 500
      };

      expect(isValidSession(invalid)).toBe(false);
    });

    test('rejects null or non-object', () => {
      expect(isValidSession(null)).toBe(false);
      expect(isValidSession(undefined)).toBe(false);
      expect(isValidSession('string')).toBe(false);
    });
  });

  describe('Edge Cases and Integration', () => {
    test('handles very large numbers', () => {
      expect(isValidNumber(999999999)).toBe(true);
      expect(isInRange(500000, 0, 1000000)).toBe(true);
    });

    test('handles floating point precision', () => {
      expect(isValidNumber(0.1 + 0.2)).toBe(true);
      expect(isValidAccuracy(66.66666667)).toBe(true);
    });

    test('validates data pipeline from input to storage', () => {
      const userInput = '  12abc  ';
      const sanitized = sanitizeInput(userInput);
      expect(sanitized).toBe('12');

      const validation = validateAnswer(sanitized, 12);
      expect(validation.valid).toBe(true);
      expect(validation.correct).toBe(true);

      const score = validation.value * 10;
      expect(isValidScore(score)).toBe(true);
    });

    test('sanitizes and validates player names for storage', () => {
      const name = '  John Doe  ';
      const validation = validatePlayerName(name);
      expect(validation.valid).toBe(true);

      const sanitized = sanitizeString(name.trim());
      expect(sanitized).toBe('John Doe');
    });
  });
});
