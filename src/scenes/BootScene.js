/**
 * BootScene.js
 * Asset loading scene with progress bar
 * Displays loading screen and preloads all game assets
 */

import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
    this.loadingBar = null;
    this.loadingBarBg = null;
    this.loadingText = null;
    this.progressText = null;
  }

  /**
   * Preload all game assets
   */
  preload() {
    // Create loading UI
    this.createLoadingUI();

    // Register loading events
    this.load.on('progress', this.updateProgress, this);
    this.load.on('complete', this.onLoadComplete, this);

    // Load placeholder assets for educational game
    // In a production version, these would be actual image/audio files

    // Since actual assets may not exist yet, we'll use Phaser's built-in
    // graphics creation for placeholders

    // Note: For a simple educational game, we can work with colored shapes
    // if image assets aren't available. The game will still be fully functional.

    // Try to load actual assets if they exist, but don't fail if they don't
    this.loadAssetsSafely();

    // Load question data
    this.loadQuestionData();

    // Load feedback messages
    this.loadFeedbackMessages();
  }

  /**
   * Create loading screen UI elements
   */
  createLoadingUI() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Background color
    this.cameras.main.setBackgroundColor('#87CEEB');

    // Title text
    const title = this.add.text(width / 2, height / 3, 'Gorilla Tag Fun', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '48px',
      fontStyle: 'bold',
      color: '#333333'
    });
    title.setOrigin(0.5);

    // Subtitle
    const subtitle = this.add.text(width / 2, height / 3 + 60, 'Math Adventure for 2nd Graders!', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '24px',
      color: '#666666'
    });
    subtitle.setOrigin(0.5);

    // Loading text
    this.loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#333333'
    });
    this.loadingText.setOrigin(0.5);

    // Progress bar background
    const barWidth = 400;
    const barHeight = 30;
    const barX = width / 2 - barWidth / 2;
    const barY = height / 2;

    this.loadingBarBg = this.add.rectangle(barX, barY, barWidth, barHeight, 0xCCCCCC);
    this.loadingBarBg.setOrigin(0, 0.5);

    // Progress bar fill
    this.loadingBar = this.add.rectangle(barX, barY, 0, barHeight, 0x4CAF50);
    this.loadingBar.setOrigin(0, 0.5);

    // Progress percentage text
    this.progressText = this.add.text(width / 2, height / 2 + 50, '0%', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '20px',
      color: '#333333'
    });
    this.progressText.setOrigin(0.5);

    // Fun loading tip
    const tip = this.add.text(width / 2, height - 100, 'Get ready to swing through the jungle!', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
      fontStyle: 'italic',
      color: '#666666'
    });
    tip.setOrigin(0.5);
  }

  /**
   * Update loading progress bar
   * @param {number} value - Progress value between 0 and 1
   */
  updateProgress(value) {
    const barWidth = 400;
    const percentage = Math.round(value * 100);

    // Update progress bar width
    this.loadingBar.width = barWidth * value;

    // Update percentage text
    this.progressText.setText(`${percentage}%`);
  }

  /**
   * Safely load assets, handling missing files gracefully
   */
  loadAssetsSafely() {
    // Try to load sprite images if they exist
    // Using setPath for cleaner paths
    this.load.setPath('assets/images/sprites/');

    // Gorilla sprites (if available)
    this.load.image('gorilla-idle', 'gorilla-idle.png').on('loaderror', () => {
      console.log('Using placeholder for gorilla-idle');
    });
    this.load.image('gorilla-swing', 'gorilla-swing.png').on('loaderror', () => {
      console.log('Using placeholder for gorilla-swing');
    });
    this.load.image('gorilla-celebrate', 'gorilla-celebrate.png').on('loaderror', () => {
      console.log('Using placeholder for gorilla-celebrate');
    });
    this.load.image('gorilla-thinking', 'gorilla-thinking.png').on('loaderror', () => {
      console.log('Using placeholder for gorilla-thinking');
    });

    // Background images
    this.load.setPath('assets/images/backgrounds/');
    this.load.image('jungle-bg', 'jungle-level-1.png').on('loaderror', () => {
      console.log('Using placeholder for jungle-bg');
    });

    // UI elements
    this.load.setPath('assets/images/ui/');
    this.load.image('button-play', 'button-play.png').on('loaderror', () => {
      console.log('Using placeholder for button-play');
    });
    this.load.image('star-empty', 'star-empty.png').on('loaderror', () => {
      console.log('Using placeholder for star-empty');
    });
    this.load.image('star-filled', 'star-filled.png').on('loaderror', () => {
      console.log('Using placeholder for star-filled');
    });

    // Objects
    this.load.setPath('assets/images/objects/');
    this.load.image('banana', 'banana.png').on('loaderror', () => {
      console.log('Using placeholder for banana');
    });
    this.load.image('vine', 'vine.png').on('loaderror', () => {
      console.log('Using placeholder for vine');
    });

    // Audio files (optional)
    this.load.setPath('assets/audio/sfx/');
    this.load.audio('correct-answer', 'correct-answer.mp3').on('loaderror', () => {
      console.log('Audio not available: correct-answer');
    });
    this.load.audio('wrong-answer', 'wrong-answer.mp3').on('loaderror', () => {
      console.log('Audio not available: wrong-answer');
    });
    this.load.audio('banana-collect', 'banana-collect.mp3').on('loaderror', () => {
      console.log('Audio not available: banana-collect');
    });
    this.load.audio('swing', 'swing.mp3').on('loaderror', () => {
      console.log('Audio not available: swing');
    });
    this.load.audio('celebrate', 'celebrate.mp3').on('loaderror', () => {
      console.log('Audio not available: celebrate');
    });
    this.load.audio('button-click', 'button-click.mp3').on('loaderror', () => {
      console.log('Audio not available: button-click');
    });

    // Background music
    this.load.setPath('assets/audio/music/');
    this.load.audio('jungle-theme', 'jungle-theme.mp3').on('loaderror', () => {
      console.log('Audio not available: jungle-theme');
    });

    // Reset path
    this.load.setPath('');
  }

  /**
   * Load question data from JSON
   */
  loadQuestionData() {
    this.load.json('questions', 'src/data/questions.json').on('loaderror', () => {
      console.warn('Questions file not found, will use fallback questions');
    });
  }

  /**
   * Load feedback messages from JSON
   */
  loadFeedbackMessages() {
    this.load.json('feedback-messages', 'src/data/feedback-messages.json').on('loaderror', () => {
      console.warn('Feedback messages file not found, will use fallback messages');
    });
  }

  /**
   * Called when all assets have loaded
   */
  onLoadComplete() {
    // Update loading text
    this.loadingText.setText('Ready!');

    // Initialize game registry for global data
    this.initializeRegistry();

    // Wait a moment before transitioning
    this.time.delayedCall(500, () => {
      this.transitionToMenu();
    });
  }

  /**
   * Initialize game registry with global data
   */
  initializeRegistry() {
    // Set up game-wide data storage
    this.registry.set('currentDifficulty', 'easy');
    this.registry.set('soundEnabled', true);
    this.registry.set('musicEnabled', true);

    // Load question data into registry
    const questionsData = this.cache.json.get('questions');
    if (questionsData) {
      this.registry.set('questionBank', questionsData);
    } else {
      console.log('Using default question bank');
      this.registry.set('questionBank', this.getDefaultQuestionBank());
    }

    // Load feedback messages into registry
    const feedbackData = this.cache.json.get('feedback-messages');
    if (feedbackData) {
      this.registry.set('feedbackMessages', feedbackData);
    } else {
      console.log('Using default feedback messages');
      this.registry.set('feedbackMessages', this.getDefaultFeedbackMessages());
    }
  }

  /**
   * Get default question bank if JSON file not found
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
          type: 'equation',
          operation: 'addition',
          template: '{a} + {b} = ?',
          minValue: 5,
          maxValue: 15,
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
        },
        {
          id: 'sub_medium_001',
          type: 'equation',
          operation: 'subtraction',
          template: '{a} - {b} = ?',
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
        }
      ]
    };
  }

  /**
   * Get default feedback messages if JSON file not found
   * @returns {Object} Default feedback messages
   */
  getDefaultFeedbackMessages() {
    return {
      correct: [
        'Great job!',
        'You\'re a math whiz!',
        'Perfect!',
        'Awesome!',
        'Super smart!',
        'You got it!',
        'Excellent work!',
        'Banana-tastic!'
      ],
      incorrect_close: [
        'Almost there!',
        'So close!',
        'Try again!',
        'You can do it!',
        'Give it another try!',
        'Nearly got it!'
      ],
      incorrect_far: [
        'Not quite, try again!',
        'Let\'s think about this!',
        'Give it another shot!',
        'Keep trying!',
        'You\'re learning!'
      ],
      encouragement: [
        'You\'re doing great!',
        'Keep going!',
        'You\'re on a roll!',
        'Amazing progress!'
      ]
    };
  }

  /**
   * Transition to menu scene
   */
  transitionToMenu() {
    // Fade out
    this.cameras.main.fadeOut(300, 0, 0, 0);

    this.cameras.main.once('camerafadeoutcomplete', () => {
      // Start menu scene
      this.scene.start('MenuScene');
    });
  }

  /**
   * Create scene (called after preload)
   */
  create() {
    // All setup is done in preload
    // This is just here for Phaser lifecycle completeness
  }
}
