/**
 * ProgressManager.js
 * Manages player progress, score tracking, and localStorage persistence
 * for the Gorilla Tag Fun Math Game
 */

export default class ProgressManager {
  constructor() {
    this.storageKey = 'gorilla-math-progress';
    this.sessionData = this.getDefaultSessionData();
    this.persistentData = this.getDefaultPersistentData();
  }

  /**
   * Initialize the progress manager and load saved data
   */
  initialize() {
    this.loadProgress();
  }

  /**
   * Get default session data structure
   * @returns {Object} Default session data
   */
  getDefaultSessionData() {
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
      starsEarned: 0
    };
  }

  /**
   * Get default persistent data structure
   * @returns {Object} Default persistent data
   */
  getDefaultPersistentData() {
    return {
      playerId: this.generatePlayerId(),
      createdAt: Date.now(),
      lastPlayed: Date.now(),
      totalSessions: 0,
      totalBananas: 0,
      totalStars: 0,
      levelsCompleted: {
        easy: [],
        medium: [],
        hard: []
      },
      highScores: {
        easy: 0,
        medium: 0,
        hard: 0
      },
      preferences: {
        soundEnabled: true,
        musicEnabled: true
      }
    };
  }

  /**
   * Start a new game session
   * @param {string} difficulty - Game difficulty level
   * @param {number} totalQuestions - Number of questions in session
   */
  startSession(difficulty = 'easy', totalQuestions = 5) {
    this.sessionData = this.getDefaultSessionData();
    this.sessionData.difficulty = difficulty;
    this.sessionData.totalQuestions = totalQuestions;
    this.sessionData.startTime = Date.now();
  }

  /**
   * Increment the player's score
   * @param {number} points - Points to add
   */
  incrementScore(points) {
    if (typeof points !== 'number' || points < 0) {
      console.warn('ProgressManager: Invalid points value');
      return;
    }

    this.sessionData.score += points;
  }

  /**
   * Record an answer (correct or incorrect)
   * @param {boolean} isCorrect - Whether the answer was correct
   */
  recordAnswer(isCorrect) {
    this.sessionData.totalAnswers++;

    if (isCorrect) {
      this.sessionData.correctAnswers++;
    } else {
      this.sessionData.incorrectAnswers++;
    }
  }

  /**
   * Add bananas to the collection
   * @param {number} count - Number of bananas to add
   */
  addBananas(count = 1) {
    if (typeof count !== 'number' || count < 0) {
      console.warn('ProgressManager: Invalid banana count');
      return;
    }

    this.sessionData.bananasCollected += count;
  }

  /**
   * Increment current question counter
   */
  nextQuestion() {
    this.sessionData.currentQuestion++;
  }

  /**
   * Calculate current accuracy percentage
   * @returns {number} Accuracy percentage (0-100)
   */
  calculateAccuracy() {
    if (this.sessionData.totalAnswers === 0) {
      return 0;
    }

    return (this.sessionData.correctAnswers / this.sessionData.totalAnswers) * 100;
  }

  /**
   * Calculate stars earned based on accuracy
   * @returns {number} Number of stars (0-3)
   */
  calculateStars() {
    const accuracy = this.calculateAccuracy();

    // Star thresholds from architecture: 60%, 80%, 95%
    if (accuracy >= 95) {
      return 3;
    } else if (accuracy >= 80) {
      return 2;
    } else if (accuracy >= 60) {
      return 1;
    } else {
      return 0;
    }
  }

  /**
   * Update elapsed time
   */
  updateElapsedTime() {
    this.sessionData.elapsedTime = Date.now() - this.sessionData.startTime;
  }

  /**
   * Complete the current session
   * @returns {Object} Session results
   */
  completeSession() {
    this.updateElapsedTime();

    // Calculate stars
    const stars = this.calculateStars();
    this.sessionData.starsEarned = stars;

    // Update persistent data
    this.persistentData.totalSessions++;
    this.persistentData.totalBananas += this.sessionData.bananasCollected;
    this.persistentData.totalStars += stars;
    this.persistentData.lastPlayed = Date.now();

    // Update high score if applicable
    const difficulty = this.sessionData.difficulty;
    if (this.sessionData.score > this.persistentData.highScores[difficulty]) {
      this.persistentData.highScores[difficulty] = this.sessionData.score;
    }

    // Track level completion
    const levelNumber = this.persistentData.levelsCompleted[difficulty].length + 1;
    if (!this.persistentData.levelsCompleted[difficulty].includes(levelNumber)) {
      this.persistentData.levelsCompleted[difficulty].push(levelNumber);
    }

    // Save progress
    this.saveProgress();

    return {
      score: this.sessionData.score,
      accuracy: this.calculateAccuracy(),
      stars: stars,
      bananas: this.sessionData.bananasCollected,
      correctAnswers: this.sessionData.correctAnswers,
      totalAnswers: this.sessionData.totalAnswers,
      elapsedTime: this.sessionData.elapsedTime
    };
  }

  /**
   * Get current session statistics
   * @returns {Object} Current session data
   */
  getCurrentStats() {
    return {
      ...this.sessionData,
      accuracy: this.calculateAccuracy()
    };
  }

  /**
   * Get persistent statistics
   * @returns {Object} Persistent data
   */
  getPersistentStats() {
    return { ...this.persistentData };
  }

  /**
   * Save progress to localStorage
   * @returns {boolean} Success status
   */
  saveProgress() {
    try {
      const data = {
        persistent: this.persistentData,
        lastSession: {
          difficulty: this.sessionData.difficulty,
          score: this.sessionData.score,
          stars: this.sessionData.starsEarned,
          bananas: this.sessionData.bananasCollected,
          timestamp: Date.now()
        }
      };

      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('ProgressManager: Failed to save progress', error);
      return false;
    }
  }

  /**
   * Load progress from localStorage
   * @returns {boolean} Success status
   */
  loadProgress() {
    try {
      const saved = localStorage.getItem(this.storageKey);

      if (!saved) {
        console.log('ProgressManager: No saved progress found');
        return false;
      }

      const data = JSON.parse(saved);

      if (data.persistent) {
        this.persistentData = {
          ...this.getDefaultPersistentData(),
          ...data.persistent
        };
      }

      console.log('ProgressManager: Progress loaded successfully');
      return true;
    } catch (error) {
      console.error('ProgressManager: Failed to load progress', error);
      return false;
    }
  }

  /**
   * Reset session progress (current game)
   */
  resetSession() {
    this.sessionData = this.getDefaultSessionData();
  }

  /**
   * Reset all progress (session and persistent)
   */
  resetAllProgress() {
    this.sessionData = this.getDefaultSessionData();
    this.persistentData = this.getDefaultPersistentData();

    try {
      localStorage.removeItem(this.storageKey);
      console.log('ProgressManager: All progress reset');
    } catch (error) {
      console.error('ProgressManager: Failed to reset progress', error);
    }
  }

  /**
   * Check if localStorage is available
   * @returns {boolean} True if localStorage is available
   */
  isLocalStorageAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate a unique player ID
   * @returns {string} Unique player ID
   */
  generatePlayerId() {
    return `player_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Update preferences
   * @param {Object} preferences - Preference updates
   */
  updatePreferences(preferences) {
    this.persistentData.preferences = {
      ...this.persistentData.preferences,
      ...preferences
    };
    this.saveProgress();
  }

  /**
   * Get a specific preference
   * @param {string} key - Preference key
   * @returns {*} Preference value
   */
  getPreference(key) {
    return this.persistentData.preferences[key];
  }

  /**
   * Get high score for a difficulty
   * @param {string} difficulty - Difficulty level
   * @returns {number} High score
   */
  getHighScore(difficulty) {
    return this.persistentData.highScores[difficulty] || 0;
  }

  /**
   * Get completed levels for a difficulty
   * @param {string} difficulty - Difficulty level
   * @returns {Array} Array of completed level numbers
   */
  getCompletedLevels(difficulty) {
    return this.persistentData.levelsCompleted[difficulty] || [];
  }

  /**
   * Check if a level is completed
   * @param {string} difficulty - Difficulty level
   * @param {number} levelNumber - Level number
   * @returns {boolean} True if completed
   */
  isLevelCompleted(difficulty, levelNumber) {
    return this.persistentData.levelsCompleted[difficulty].includes(levelNumber);
  }

  /**
   * Get total play time across all sessions
   * @returns {number} Total play time in milliseconds
   */
  getTotalPlayTime() {
    return Date.now() - this.persistentData.createdAt;
  }

  /**
   * Export progress data
   * @returns {Object} Progress data
   */
  exportProgress() {
    return {
      persistent: this.persistentData,
      session: this.sessionData,
      exportedAt: Date.now()
    };
  }

  /**
   * Import progress data
   * @param {Object} data - Progress data to import
   * @returns {boolean} Success status
   */
  importProgress(data) {
    try {
      if (data.persistent) {
        this.persistentData = {
          ...this.getDefaultPersistentData(),
          ...data.persistent
        };
      }

      this.saveProgress();
      return true;
    } catch (error) {
      console.error('ProgressManager: Failed to import progress', error);
      return false;
    }
  }
}
