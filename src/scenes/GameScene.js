/**
 * GameScene.js
 * Main gameplay scene for Gorilla Tag Fun Math Game
 *
 * Purpose: Main gameplay loop where math challenges happen
 * Features:
 * - Renders jungle environment with parallax scrolling
 * - Displays gorilla character and manages state
 * - Presents math questions and accepts player input
 * - Validates answers and provides feedback
 * - Handles level progression and completion
 * - Pause/resume functionality
 */

import Phaser from 'phaser';
import { GAME_STATES, ANIMATIONS, SCORING, GORILLA, COLORS } from '../utils/constants.js';
import MathEngine from '../systems/MathEngine.js';
import ProgressManager from '../systems/ProgressManager.js';
import InputManager from '../systems/InputManager.js';
import AnimationController from '../systems/AnimationController.js';
import AudioManager from '../systems/AudioManager.js';
import UIManager from '../systems/UIManager.js';
import Gorilla from '../entities/Gorilla.js';
import Banana from '../entities/Banana.js';
import Vine from '../entities/Vine.js';
import NumberPad from '../ui/NumberPad.js';
import QuestionDisplay from '../ui/QuestionDisplay.js';
import FeedbackPanel from '../ui/FeedbackPanel.js';
import ProgressBar from '../ui/ProgressBar.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });

    // Game state
    this.gameState = GAME_STATES.PRESENTING_QUESTION;
    this.difficulty = 'easy';
    this.currentQuestionIndex = 0;
    this.totalQuestions = 5;
    this.currentQuestion = null;
    this.attemptCount = 0;

    // Systems
    this.mathEngine = null;
    this.progressManager = null;
    this.inputManager = null;
    this.animationController = null;
    this.audioManager = null;
    this.uiManager = null;

    // Entities
    this.gorilla = null;
    this.bananas = [];
    this.vines = [];

    // UI Components
    this.numberPad = null;
    this.questionDisplay = null;
    this.feedbackPanel = null;
    this.progressBar = null;

    // Background elements
    this.background = null;
    this.trees = [];
  }

  init(data) {
    // Get difficulty from menu scene
    this.difficulty = data.difficulty || 'easy';
    console.log(`GameScene initialized with difficulty: ${this.difficulty}`);
  }

  create() {
    // Create background
    this.createBackground();

    // Initialize all systems
    this.initializeSystems();

    // Create game entities
    this.createEntities();

    // Create UI components
    this.createUI();

    // Setup input handlers
    this.setupInput();

    // Start the game
    this.startGame();
  }

  createBackground() {
    // Sky background
    this.background = this.add.rectangle(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      this.cameras.main.width,
      this.cameras.main.height,
      0x87CEEB // Sky blue
    );

    // Create jungle floor
    const floor = this.add.rectangle(
      this.cameras.main.centerX,
      this.cameras.main.height - 100,
      this.cameras.main.width,
      200,
      0x2D5016 // Jungle green
    );

    // Add some decorative trees (simple colored rectangles for now)
    for (let i = 0; i < 5; i++) {
      const treeX = 100 + i * 200;
      const tree = this.add.rectangle(treeX, this.cameras.main.height - 200, 40, 200, 0x3E2723);
      const leaves = this.add.circle(treeX, this.cameras.main.height - 280, 60, 0x4CAF50);
      this.trees.push({ trunk: tree, leaves: leaves });
    }
  }

  initializeSystems() {
    // Math Engine
    this.mathEngine = new MathEngine();
    this.mathEngine.initialize(null); // Will use default question bank
    this.mathEngine.setDifficulty(this.difficulty);

    // Progress Manager
    this.progressManager = new ProgressManager();
    this.progressManager.initialize();
    this.progressManager.startSession(this.difficulty);

    // Audio Manager
    this.audioManager = new AudioManager(this);
    this.audioManager.initialize();

    // Animation Controller
    this.animationController = new AnimationController(this);
    this.animationController.initialize();

    // Input Manager
    this.inputManager = new InputManager(this);
    this.inputManager.initialize();

    // UI Manager
    this.uiManager = new UIManager(this);
    this.uiManager.initialize();

    console.log('All systems initialized');
  }

  createEntities() {
    // Create gorilla character
    this.gorilla = new Gorilla(this, GORILLA.START_X, GORILLA.START_Y);

    // Create bananas along the path
    this.createBananas();

    // Create vines (decorative for now)
    this.createVines();

    console.log('Entities created');
  }

  createBananas() {
    // Create one banana per question
    const spacing = (this.cameras.main.width - 200) / this.totalQuestions;

    for (let i = 0; i < this.totalQuestions; i++) {
      const bananaX = 200 + i * spacing;
      const bananaY = GORILLA.START_Y - 50;

      const banana = new Banana(this, bananaX, bananaY);
      this.bananas.push(banana);
    }
  }

  createVines() {
    // Create decorative vines
    const spacing = (this.cameras.main.width - 200) / this.totalQuestions;

    for (let i = 0; i < this.totalQuestions; i++) {
      const vineX = 200 + i * spacing;
      const vineY = 100;

      const vine = new Vine(this, vineX, vineY);
      this.vines.push(vine);
    }
  }

  createUI() {
    // Create HUD
    this.uiManager.createHUD();

    // Question Display
    this.questionDisplay = new QuestionDisplay(
      this,
      this.cameras.main.centerX,
      100
    );

    // Feedback Panel
    this.feedbackPanel = new FeedbackPanel(
      this,
      this.cameras.main.centerX,
      this.cameras.main.centerY
    );

    // Progress Bar
    this.progressBar = new ProgressBar(
      this,
      50,
      30,
      this.totalQuestions
    );

    // Number Pad
    this.numberPad = new NumberPad(
      this,
      this.cameras.main.width - 200,
      this.cameras.main.height - 300
    );

    // Set number pad submit callback
    this.numberPad.setSubmitCallback((answer) => {
      this.handleAnswer(answer);
    });

    console.log('UI components created');
  }

  setupInput() {
    // Setup keyboard input handler
    this.inputManager.setAnswerCallback((answer) => {
      this.handleAnswer(answer);
    });

    // Listen for numberpad events
    this.events.on('numberpad-submit', (answer) => {
      this.handleAnswer(answer);
    });

    // Setup pause key (ESC)
    this.input.keyboard.on('keydown-ESC', () => {
      this.togglePause();
    });

    console.log('Input handlers setup');
  }

  startGame() {
    console.log('Game started!');

    // Show initial UI
    this.uiManager.updateScore(0);
    this.uiManager.updateBananas(0);

    // Present first question
    this.presentNextQuestion();
  }

  presentNextQuestion() {
    if (this.currentQuestionIndex >= this.totalQuestions) {
      this.completeLevel();
      return;
    }

    this.gameState = GAME_STATES.PRESENTING_QUESTION;
    this.attemptCount = 0;

    // Get next question from math engine
    this.currentQuestion = this.mathEngine.getNextQuestion();

    // Show question
    this.questionDisplay.setQuestion(this.currentQuestion);
    this.questionDisplay.show();

    // Show gorilla thinking
    this.gorilla.think();

    // Show number pad
    this.numberPad.show();

    // Enable input
    this.inputManager.enableInput();
    this.numberPad.enableInput();

    // Transition to waiting for input
    this.time.delayedCall(ANIMATIONS.QUESTION_FADE_IN, () => {
      this.gameState = GAME_STATES.WAITING_INPUT;
    });

    console.log(`Question ${this.currentQuestionIndex + 1}:`, this.currentQuestion.questionText);
  }

  handleAnswer(userAnswer) {
    if (this.gameState !== GAME_STATES.WAITING_INPUT) {
      console.log('Not accepting input in current state:', this.gameState);
      return;
    }

    // Disable input while validating
    this.gameState = GAME_STATES.VALIDATING;
    this.inputManager.disableInput();
    this.numberPad.disableInput();

    // Validate answer
    const result = this.mathEngine.validateAnswer(userAnswer);

    console.log('Answer validation:', result);

    // Increment attempt count
    this.attemptCount++;

    // Show feedback
    this.showFeedback(result);
  }

  showFeedback(result) {
    this.gameState = GAME_STATES.SHOWING_FEEDBACK;

    if (result.correct) {
      // Correct answer!
      this.feedbackPanel.showCorrectFeedback(result.message);
      this.audioManager.playSound('correct-answer');

      // Record progress
      this.progressManager.recordAnswer(true);
      this.progressManager.incrementScore(SCORING.CORRECT_ANSWER);

      // Update UI
      this.uiManager.updateScore(this.progressManager.getCurrentStats().score);

      // Wait for feedback, then animate success
      this.time.delayedCall(ANIMATIONS.FEEDBACK_DISPLAY_TIME, () => {
        this.feedbackPanel.hide();
        this.animateCorrectAnswer();
      });

    } else {
      // Incorrect answer
      this.feedbackPanel.showIncorrectFeedback(result.message, result.correctAnswer);
      this.audioManager.playSound('wrong-answer');

      // Record incorrect attempt
      this.progressManager.recordAnswer(false);

      // Wait for feedback, then allow retry
      this.time.delayedCall(ANIMATIONS.FEEDBACK_DISPLAY_TIME, () => {
        this.feedbackPanel.hide();
        this.allowRetry();
      });
    }
  }

  animateCorrectAnswer() {
    this.gameState = GAME_STATES.ANIMATING;

    // Hide question and number pad
    this.questionDisplay.hide();
    this.numberPad.hide();

    // Gorilla celebrates
    this.gorilla.celebrate(() => {
      // Move gorilla forward
      this.moveGorillaForward();
    });
  }

  moveGorillaForward() {
    const targetBanana = this.bananas[this.currentQuestionIndex];

    if (targetBanana) {
      // Move gorilla to banana position
      this.gorilla.moveForward(
        GORILLA.SWING_DISTANCE,
        ANIMATIONS.GORILLA_SWING_DURATION,
        () => {
          // Collect banana
          this.collectBanana(targetBanana);
        }
      );
    } else {
      // No banana, just move forward
      this.gorilla.moveForward(
        GORILLA.SWING_DISTANCE,
        ANIMATIONS.GORILLA_SWING_DURATION,
        () => {
          this.onAnimationComplete();
        }
      );
    }
  }

  collectBanana(banana) {
    // Collect the banana
    banana.collect();
    this.audioManager.playSound('banana-collect');

    // Update banana count
    this.progressManager.addBananas(1);
    this.uiManager.updateBananas(this.progressManager.getCurrentStats().bananasCollected);

    // Continue to next question
    this.time.delayedCall(ANIMATIONS.BANANA_COLLECT, () => {
      this.onAnimationComplete();
    });
  }

  onAnimationComplete() {
    // Update progress bar
    this.currentQuestionIndex++;
    this.progressBar.updateProgress(this.currentQuestionIndex);

    // Check if level complete
    if (this.currentQuestionIndex >= this.totalQuestions) {
      this.completeLevel();
    } else {
      // Present next question
      this.presentNextQuestion();
    }
  }

  allowRetry() {
    // Check if max attempts reached
    if (this.attemptCount >= 3) {
      // Show hint or skip to next question
      this.feedbackPanel.showEncouragement('Let\'s try another one!');

      this.time.delayedCall(1500, () => {
        this.feedbackPanel.hide();
        this.currentQuestionIndex++;
        this.progressBar.updateProgress(this.currentQuestionIndex);

        if (this.currentQuestionIndex >= this.totalQuestions) {
          this.completeLevel();
        } else {
          this.presentNextQuestion();
        }
      });
    } else {
      // Allow another attempt
      this.numberPad.clear();
      this.inputManager.clearInput();
      this.inputManager.enableInput();
      this.numberPad.enableInput();
      this.gameState = GAME_STATES.WAITING_INPUT;
    }
  }

  completeLevel() {
    this.gameState = GAME_STATES.COMPLETE;

    console.log('Level complete!');

    // Hide UI
    this.questionDisplay.hide();
    this.numberPad.hide();

    // Gorilla final celebration
    this.gorilla.celebrate(() => {
      // Save progress
      this.progressManager.saveProgress();

      // Show level complete message
      this.feedbackPanel.showEncouragement('Level Complete!');

      // Transition to results scene
      this.time.delayedCall(ANIMATIONS.CELEBRATION_DURATION, () => {
        this.transitionToResults();
      });
    });
  }

  transitionToResults() {
    // Get final stats
    const stats = this.progressManager.getCurrentStats();

    // Transition to results scene
    this.scene.start('ResultsScene', {
      difficulty: this.difficulty,
      score: stats.score,
      correctAnswers: stats.correctAnswers,
      totalAnswers: stats.totalAnswers,
      bananasCollected: stats.bananasCollected,
      accuracy: this.progressManager.calculateAccuracy(),
      stars: this.progressManager.calculateStars()
    });
  }

  togglePause() {
    if (this.gameState === GAME_STATES.PAUSED) {
      this.resumeGame();
    } else if (this.gameState !== GAME_STATES.COMPLETE) {
      this.pauseGame();
    }
  }

  pauseGame() {
    this.previousState = this.gameState;
    this.gameState = GAME_STATES.PAUSED;

    // Disable input
    this.inputManager.disableInput();
    this.numberPad.disableInput();

    // Show pause menu
    this.uiManager.showPauseMenu();

    console.log('Game paused');
  }

  resumeGame() {
    this.gameState = this.previousState || GAME_STATES.WAITING_INPUT;

    // Enable input
    this.inputManager.enableInput();
    this.numberPad.enableInput();

    // Hide pause menu
    this.uiManager.hidePauseMenu();

    console.log('Game resumed');
  }

  update(time, delta) {
    // Update gorilla if needed
    if (this.gorilla) {
      this.gorilla.update(time, delta);
    }

    // Update bananas
    this.bananas.forEach(banana => {
      if (banana.update) {
        banana.update(time, delta);
      }
    });

    // Update vines
    this.vines.forEach(vine => {
      if (vine.update) {
        vine.update(time, delta);
      }
    });
  }

  shutdown() {
    // Clean up
    console.log('GameScene shutting down');

    // Remove event listeners
    this.events.off('numberpad-submit');
    this.input.keyboard.off('keydown-ESC');

    // Clear references
    this.mathEngine = null;
    this.progressManager = null;
    this.inputManager = null;
    this.animationController = null;
    this.audioManager = null;
    this.uiManager = null;
  }
}
