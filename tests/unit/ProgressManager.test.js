/**
 * ProgressManager Unit Tests
 * Tests for score tracking, star calculation, and localStorage persistence
 */

import ProgressManager from '../../src/systems/ProgressManager.js';

describe('ProgressManager', () => {
  let manager;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    manager = new ProgressManager();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Initialization', () => {
    test('initializes with default session data', () => {
      const stats = manager.getCurrentStats();

      expect(stats.difficulty).toBe('easy');
      expect(stats.currentQuestion).toBe(0);
      expect(stats.totalQuestions).toBe(5);
      expect(stats.score).toBe(0);
      expect(stats.correctAnswers).toBe(0);
      expect(stats.incorrectAnswers).toBe(0);
      expect(stats.bananasCollected).toBe(0);
      expect(stats.starsEarned).toBe(0);
    });

    test('initializes with default persistent data', () => {
      const stats = manager.getPersistentStats();

      expect(stats.playerId).toBeDefined();
      expect(stats.createdAt).toBeDefined();
      expect(stats.totalSessions).toBe(0);
      expect(stats.totalBananas).toBe(0);
      expect(stats.totalStars).toBe(0);
      expect(stats.highScores).toEqual({ easy: 0, medium: 0, hard: 0 });
      expect(stats.levelsCompleted).toEqual({ easy: [], medium: [], hard: [] });
    });

    test('generates unique player ID', () => {
      const manager1 = new ProgressManager();
      const manager2 = new ProgressManager();

      const id1 = manager1.getPersistentStats().playerId;
      const id2 = manager2.getPersistentStats().playerId;

      expect(id1).not.toBe(id2);
      expect(id1).toContain('player_');
      expect(id2).toContain('player_');
    });
  });

  describe('Session Management', () => {
    test('starts new session with default values', () => {
      manager.startSession();
      const stats = manager.getCurrentStats();

      expect(stats.difficulty).toBe('easy');
      expect(stats.totalQuestions).toBe(5);
      expect(stats.score).toBe(0);
      expect(stats.startTime).toBeDefined();
    });

    test('starts session with custom difficulty', () => {
      manager.startSession('hard', 10);
      const stats = manager.getCurrentStats();

      expect(stats.difficulty).toBe('hard');
      expect(stats.totalQuestions).toBe(10);
    });

    test('resets session data on new session', () => {
      manager.incrementScore(100);
      manager.recordAnswer(true);
      manager.addBananas(5);

      manager.startSession('medium');
      const stats = manager.getCurrentStats();

      expect(stats.score).toBe(0);
      expect(stats.correctAnswers).toBe(0);
      expect(stats.bananasCollected).toBe(0);
    });
  });

  describe('Score Management', () => {
    test('increments score correctly', () => {
      manager.incrementScore(100);
      expect(manager.getCurrentStats().score).toBe(100);

      manager.incrementScore(50);
      expect(manager.getCurrentStats().score).toBe(150);
    });

    test('handles zero score increment', () => {
      manager.incrementScore(0);
      expect(manager.getCurrentStats().score).toBe(0);
    });

    test('ignores negative score increments', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      manager.incrementScore(-50);
      expect(manager.getCurrentStats().score).toBe(0);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    test('ignores invalid score types', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      manager.incrementScore('abc');
      expect(manager.getCurrentStats().score).toBe(0);

      consoleSpy.mockRestore();
    });
  });

  describe('Answer Recording', () => {
    test('records correct answers', () => {
      manager.recordAnswer(true);
      manager.recordAnswer(true);
      manager.recordAnswer(true);

      const stats = manager.getCurrentStats();
      expect(stats.correctAnswers).toBe(3);
      expect(stats.totalAnswers).toBe(3);
      expect(stats.incorrectAnswers).toBe(0);
    });

    test('records incorrect answers', () => {
      manager.recordAnswer(false);
      manager.recordAnswer(false);

      const stats = manager.getCurrentStats();
      expect(stats.incorrectAnswers).toBe(2);
      expect(stats.totalAnswers).toBe(2);
      expect(stats.correctAnswers).toBe(0);
    });

    test('records mixed answers', () => {
      manager.recordAnswer(true);
      manager.recordAnswer(false);
      manager.recordAnswer(true);
      manager.recordAnswer(true);
      manager.recordAnswer(false);

      const stats = manager.getCurrentStats();
      expect(stats.correctAnswers).toBe(3);
      expect(stats.incorrectAnswers).toBe(2);
      expect(stats.totalAnswers).toBe(5);
    });
  });

  describe('Banana Collection', () => {
    test('adds bananas correctly', () => {
      manager.addBananas(1);
      expect(manager.getCurrentStats().bananasCollected).toBe(1);

      manager.addBananas(3);
      expect(manager.getCurrentStats().bananasCollected).toBe(4);
    });

    test('adds multiple bananas at once', () => {
      manager.addBananas(5);
      expect(manager.getCurrentStats().bananasCollected).toBe(5);
    });

    test('defaults to 1 banana when no count provided', () => {
      manager.addBananas();
      expect(manager.getCurrentStats().bananasCollected).toBe(1);
    });

    test('ignores negative banana counts', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      manager.addBananas(-5);
      expect(manager.getCurrentStats().bananasCollected).toBe(0);

      consoleSpy.mockRestore();
    });

    test('ignores invalid banana count types', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      manager.addBananas('abc');
      expect(manager.getCurrentStats().bananasCollected).toBe(0);

      consoleSpy.mockRestore();
    });
  });

  describe('Accuracy Calculation', () => {
    test('calculates 100% accuracy for all correct', () => {
      manager.recordAnswer(true);
      manager.recordAnswer(true);
      manager.recordAnswer(true);

      expect(manager.calculateAccuracy()).toBe(100);
    });

    test('calculates 0% accuracy for all incorrect', () => {
      manager.recordAnswer(false);
      manager.recordAnswer(false);
      manager.recordAnswer(false);

      expect(manager.calculateAccuracy()).toBe(0);
    });

    test('calculates 50% accuracy for half correct', () => {
      manager.recordAnswer(true);
      manager.recordAnswer(false);

      expect(manager.calculateAccuracy()).toBe(50);
    });

    test('calculates 66.67% accuracy for 2 out of 3', () => {
      manager.recordAnswer(true);
      manager.recordAnswer(true);
      manager.recordAnswer(false);

      const accuracy = manager.calculateAccuracy();
      expect(accuracy).toBeCloseTo(66.67, 1);
    });

    test('returns 0 accuracy when no answers recorded', () => {
      expect(manager.calculateAccuracy()).toBe(0);
    });
  });

  describe('Star Calculation', () => {
    test('awards 3 stars for 95%+ accuracy', () => {
      // 19 correct, 1 incorrect = 95%
      for (let i = 0; i < 19; i++) manager.recordAnswer(true);
      manager.recordAnswer(false);

      expect(manager.calculateStars()).toBe(3);
    });

    test('awards 2 stars for 80-94% accuracy', () => {
      // 8 correct, 2 incorrect = 80%
      for (let i = 0; i < 8; i++) manager.recordAnswer(true);
      for (let i = 0; i < 2; i++) manager.recordAnswer(false);

      expect(manager.calculateStars()).toBe(2);
    });

    test('awards 1 star for 60-79% accuracy', () => {
      // 6 correct, 4 incorrect = 60%
      for (let i = 0; i < 6; i++) manager.recordAnswer(true);
      for (let i = 0; i < 4; i++) manager.recordAnswer(false);

      expect(manager.calculateStars()).toBe(1);
    });

    test('awards 0 stars for <60% accuracy', () => {
      // 5 correct, 5 incorrect = 50%
      for (let i = 0; i < 5; i++) manager.recordAnswer(true);
      for (let i = 0; i < 5; i++) manager.recordAnswer(false);

      expect(manager.calculateStars()).toBe(0);
    });

    test('awards 0 stars when no answers recorded', () => {
      expect(manager.calculateStars()).toBe(0);
    });

    test('star thresholds are accurate', () => {
      // Test boundary conditions
      const testCases = [
        { correct: 95, total: 100, expected: 3 },
        { correct: 94, total: 100, expected: 2 },
        { correct: 80, total: 100, expected: 2 },
        { correct: 79, total: 100, expected: 1 },
        { correct: 60, total: 100, expected: 1 },
        { correct: 59, total: 100, expected: 0 }
      ];

      testCases.forEach(({ correct, total, expected }) => {
        manager.resetSession();
        for (let i = 0; i < correct; i++) manager.recordAnswer(true);
        for (let i = 0; i < total - correct; i++) manager.recordAnswer(false);

        expect(manager.calculateStars()).toBe(expected);
      });
    });
  });

  describe('Session Completion', () => {
    test('completes session and returns results', () => {
      manager.startSession('easy');
      manager.incrementScore(500);
      manager.recordAnswer(true);
      manager.recordAnswer(true);
      manager.recordAnswer(false);
      manager.addBananas(3);

      const results = manager.completeSession();

      expect(results.score).toBe(500);
      expect(results.accuracy).toBeCloseTo(66.67, 1);
      expect(results.stars).toBe(1);
      expect(results.bananas).toBe(3);
      expect(results.correctAnswers).toBe(2);
      expect(results.totalAnswers).toBe(3);
      expect(results.elapsedTime).toBeGreaterThanOrEqual(0);
    });

    test('updates persistent stats on completion', () => {
      manager.startSession('easy');
      manager.incrementScore(300);
      manager.recordAnswer(true);
      manager.addBananas(5);

      manager.completeSession();

      const persistent = manager.getPersistentStats();
      expect(persistent.totalSessions).toBe(1);
      expect(persistent.totalBananas).toBe(5);
      expect(persistent.totalStars).toBeGreaterThan(0);
    });

    test('updates high score for difficulty', () => {
      manager.startSession('medium');
      manager.incrementScore(400);
      manager.recordAnswer(true);

      manager.completeSession();

      expect(manager.getHighScore('medium')).toBe(400);
    });

    test('does not update high score if lower', () => {
      manager.startSession('hard');
      manager.incrementScore(500);
      manager.recordAnswer(true);
      manager.completeSession();

      manager.startSession('hard');
      manager.incrementScore(300);
      manager.recordAnswer(true);
      manager.completeSession();

      expect(manager.getHighScore('hard')).toBe(500);
    });

    test('tracks level completion', () => {
      manager.startSession('easy');
      manager.recordAnswer(true);
      manager.completeSession();

      const levels = manager.getCompletedLevels('easy');
      expect(levels.length).toBe(1);
      expect(levels[0]).toBe(1);
    });

    test('saves progress to localStorage on completion', () => {
      manager.startSession('easy');
      manager.incrementScore(200);
      manager.recordAnswer(true);
      manager.completeSession();

      const saved = localStorage.getItem('gorilla-math-progress');
      expect(saved).not.toBeNull();

      const data = JSON.parse(saved);
      expect(data.persistent).toBeDefined();
      expect(data.lastSession).toBeDefined();
    });
  });

  describe('localStorage Persistence', () => {
    test('saves progress to localStorage', () => {
      manager.incrementScore(100);
      manager.recordAnswer(true);

      const success = manager.saveProgress();

      expect(success).toBe(true);
      expect(localStorage.getItem('gorilla-math-progress')).not.toBeNull();
    });

    test('loads progress from localStorage', () => {
      // Save some progress
      manager.startSession('medium');
      manager.incrementScore(300);
      manager.recordAnswer(true);
      manager.addBananas(5);
      manager.completeSession();

      // Create new manager and load
      const newManager = new ProgressManager();
      newManager.initialize();

      const persistent = newManager.getPersistentStats();
      expect(persistent.totalBananas).toBe(5);
      expect(persistent.highScores.medium).toBe(300);
    });

    test('handles missing localStorage data gracefully', () => {
      localStorage.clear();
      const success = manager.loadProgress();

      expect(success).toBe(false);
      // Should still work with defaults
      expect(manager.getCurrentStats()).toBeDefined();
    });

    test('handles corrupted localStorage data', () => {
      localStorage.setItem('gorilla-math-progress', 'invalid json {]');

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const success = manager.loadProgress();

      expect(success).toBe(false);
      consoleSpy.mockRestore();
    });

    test('checks localStorage availability', () => {
      expect(manager.isLocalStorageAvailable()).toBe(true);
    });

    test('saved data includes all required fields', () => {
      manager.incrementScore(200);
      manager.completeSession();

      const saved = JSON.parse(localStorage.getItem('gorilla-math-progress'));

      expect(saved).toHaveProperty('persistent');
      expect(saved).toHaveProperty('lastSession');
      expect(saved.lastSession).toHaveProperty('difficulty');
      expect(saved.lastSession).toHaveProperty('score');
      expect(saved.lastSession).toHaveProperty('timestamp');
    });
  });

  describe('Reset Functionality', () => {
    test('resetSession clears current session only', () => {
      manager.incrementScore(100);
      manager.recordAnswer(true);
      manager.addBananas(3);

      // Save to persistent
      manager.completeSession();
      const totalBananasBefore = manager.getPersistentStats().totalBananas;

      manager.resetSession();

      const session = manager.getCurrentStats();
      expect(session.score).toBe(0);
      expect(session.correctAnswers).toBe(0);
      expect(session.bananasCollected).toBe(0);

      // Persistent data should remain
      const persistent = manager.getPersistentStats();
      expect(persistent.totalBananas).toBe(totalBananasBefore);
    });

    test('resetAllProgress clears everything', () => {
      manager.incrementScore(500);
      manager.recordAnswer(true);
      manager.completeSession();

      manager.resetAllProgress();

      const session = manager.getCurrentStats();
      const persistent = manager.getPersistentStats();

      expect(session.score).toBe(0);
      expect(persistent.totalBananas).toBe(0);
      expect(persistent.totalSessions).toBe(0);
      expect(localStorage.getItem('gorilla-math-progress')).toBeNull();
    });
  });

  describe('Preferences', () => {
    test('updates preferences', () => {
      manager.updatePreferences({ soundEnabled: false });

      expect(manager.getPreference('soundEnabled')).toBe(false);
    });

    test('updates multiple preferences', () => {
      manager.updatePreferences({
        soundEnabled: false,
        musicEnabled: true
      });

      expect(manager.getPreference('soundEnabled')).toBe(false);
      expect(manager.getPreference('musicEnabled')).toBe(true);
    });

    test('saves preferences to localStorage', () => {
      manager.updatePreferences({ soundEnabled: false });

      const newManager = new ProgressManager();
      newManager.initialize();

      expect(newManager.getPreference('soundEnabled')).toBe(false);
    });

    test('has default preferences', () => {
      expect(manager.getPreference('soundEnabled')).toBe(true);
      expect(manager.getPreference('musicEnabled')).toBe(true);
    });
  });

  describe('High Scores', () => {
    test('gets high score for difficulty', () => {
      expect(manager.getHighScore('easy')).toBe(0);

      manager.startSession('easy');
      manager.incrementScore(300);
      manager.recordAnswer(true);
      manager.completeSession();

      expect(manager.getHighScore('easy')).toBe(300);
    });

    test('returns 0 for missing difficulty', () => {
      expect(manager.getHighScore('nonexistent')).toBe(0);
    });

    test('maintains separate high scores per difficulty', () => {
      // Easy high score
      manager.startSession('easy');
      manager.incrementScore(200);
      manager.recordAnswer(true);
      manager.completeSession();

      // Medium high score
      manager.startSession('medium');
      manager.incrementScore(400);
      manager.recordAnswer(true);
      manager.completeSession();

      expect(manager.getHighScore('easy')).toBe(200);
      expect(manager.getHighScore('medium')).toBe(400);
      expect(manager.getHighScore('hard')).toBe(0);
    });
  });

  describe('Level Completion Tracking', () => {
    test('gets completed levels for difficulty', () => {
      expect(manager.getCompletedLevels('easy')).toEqual([]);

      manager.startSession('easy');
      manager.recordAnswer(true);
      manager.completeSession();

      expect(manager.getCompletedLevels('easy')).toEqual([1]);
    });

    test('tracks multiple level completions', () => {
      for (let i = 0; i < 3; i++) {
        manager.startSession('easy');
        manager.recordAnswer(true);
        manager.completeSession();
      }

      const levels = manager.getCompletedLevels('easy');
      expect(levels.length).toBe(3);
    });

    test('checks if level is completed', () => {
      manager.startSession('medium');
      manager.recordAnswer(true);
      manager.completeSession();

      expect(manager.isLevelCompleted('medium', 1)).toBe(true);
      expect(manager.isLevelCompleted('medium', 2)).toBe(false);
    });
  });

  describe('Question Counter', () => {
    test('increments current question', () => {
      expect(manager.getCurrentStats().currentQuestion).toBe(0);

      manager.nextQuestion();
      expect(manager.getCurrentStats().currentQuestion).toBe(1);

      manager.nextQuestion();
      expect(manager.getCurrentStats().currentQuestion).toBe(2);
    });
  });

  describe('Time Tracking', () => {
    test('tracks elapsed time', () => {
      manager.startSession();

      // Wait a bit
      const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      return wait(10).then(() => {
        manager.updateElapsedTime();
        expect(manager.getCurrentStats().elapsedTime).toBeGreaterThan(0);
      });
    });

    test('records elapsed time in session results', () => {
      manager.startSession();

      const results = manager.completeSession();
      expect(results.elapsedTime).toBeGreaterThanOrEqual(0);
    });

    test('calculates total play time', () => {
      const totalTime = manager.getTotalPlayTime();
      expect(totalTime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Export and Import', () => {
    test('exports progress data', () => {
      manager.incrementScore(100);
      manager.recordAnswer(true);

      const exported = manager.exportProgress();

      expect(exported).toHaveProperty('persistent');
      expect(exported).toHaveProperty('session');
      expect(exported).toHaveProperty('exportedAt');
    });

    test('imports progress data', () => {
      // Create progress
      manager.startSession('hard');
      manager.incrementScore(500);
      manager.recordAnswer(true);
      manager.completeSession();

      const exported = manager.exportProgress();

      // Create new manager and import
      const newManager = new ProgressManager();
      const success = newManager.importProgress(exported);

      expect(success).toBe(true);
      expect(newManager.getHighScore('hard')).toBe(500);
    });

    test('handles invalid import data', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const success = manager.importProgress({ invalid: 'data' });
      expect(success).toBe(false);

      consoleSpy.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    test('handles very large scores', () => {
      manager.incrementScore(999999999);
      expect(manager.getCurrentStats().score).toBe(999999999);
    });

    test('handles many answer recordings', () => {
      for (let i = 0; i < 1000; i++) {
        manager.recordAnswer(i % 2 === 0);
      }

      expect(manager.getCurrentStats().totalAnswers).toBe(1000);
      expect(manager.calculateAccuracy()).toBe(50);
    });

    test('handles rapid session starts', () => {
      manager.startSession('easy');
      manager.startSession('medium');
      manager.startSession('hard');

      expect(manager.getCurrentStats().difficulty).toBe('hard');
    });

    test('handles missing localStorage gracefully', () => {
      // Mock localStorage failure
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage full');
      });

      const success = manager.saveProgress();
      expect(success).toBe(false);

      setItemSpy.mockRestore();
    });
  });
});
