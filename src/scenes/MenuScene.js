/**
 * MenuScene.js
 * Main menu with difficulty selection
 * Displays game title, difficulty buttons, and settings
 */

import Phaser from 'phaser';
import AudioManager from '../systems/AudioManager.js';
import UIManager from '../systems/UIManager.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
    this.audioManager = null;
    this.uiManager = null;
    this.selectedDifficulty = null;
    this.buttons = {};
    this.muteButton = null;
    this.instructionsModal = null;
    this.parentInfoModal = null;
  }

  /**
   * Initialize scene
   */
  init() {
    // Initialize managers
    this.audioManager = new AudioManager(this);
    this.audioManager.initialize();

    this.uiManager = new UIManager(this);
    this.uiManager.initialize();
  }

  /**
   * Create menu scene
   */
  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Fade in from boot scene
    this.cameras.main.fadeIn(300, 135, 206, 235);

    // Create background
    this.createBackground(width, height);

    // Create title and mascot
    this.createTitle(width, height);

    // Create difficulty selection buttons
    this.createDifficultyButtons(width, height);

    // Create footer buttons (instructions, parent info)
    this.createFooterButtons(width, height);

    // Create mute toggle
    this.createMuteToggle(width, height);

    // Add keyboard shortcuts
    this.setupKeyboardShortcuts();

    // Play background music if enabled
    this.playBackgroundMusic();
  }

  /**
   * Create background elements
   */
  createBackground(width, height) {
    // Sky blue background
    this.cameras.main.setBackgroundColor('#87CEEB');

    // Try to use loaded background image, fallback to gradient
    if (this.textures.exists('jungle-bg')) {
      const bg = this.add.image(width / 2, height / 2, 'jungle-bg');
      bg.setDisplaySize(width, height);
      bg.setAlpha(0.3);
    } else {
      // Create a simple jungle-themed background with rectangles
      const ground = this.add.rectangle(0, height - 100, width, 100, 0x2d5016);
      ground.setOrigin(0, 0);

      // Add some decorative circles as trees
      for (let i = 0; i < 5; i++) {
        const x = (i + 1) * (width / 6);
        const tree = this.add.circle(x, height - 50, 30, 0x1a3a0a);
        tree.setAlpha(0.6);
      }
    }
  }

  /**
   * Create title and mascot
   */
  createTitle(width, height) {
    // Main title
    const title = this.add.text(width / 2, height / 6, 'Gorilla Tag Fun', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '56px',
      fontStyle: 'bold',
      color: '#333333',
      stroke: '#FFFFFF',
      strokeThickness: 6
    });
    title.setOrigin(0.5);

    // Add bouncing animation to title
    this.tweens.add({
      targets: title,
      y: title.y - 10,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Subtitle
    const subtitle = this.add.text(width / 2, height / 6 + 70, 'Math Adventure!', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '32px',
      fontStyle: 'italic',
      color: '#666666'
    });
    subtitle.setOrigin(0.5);

    // Gorilla emoji as mascot (placeholder for actual sprite)
    const mascot = this.add.text(width / 2, height / 3, '🦍', {
      fontSize: '80px'
    });
    mascot.setOrigin(0.5);

    // Add swinging animation to mascot
    this.tweens.add({
      targets: mascot,
      angle: { from: -10, to: 10 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  /**
   * Create difficulty selection buttons
   */
  createDifficultyButtons(width, height) {
    const centerY = height / 2 + 50;
    const buttonWidth = 250;
    const buttonHeight = 70;
    const spacing = 30;

    // Create difficulty options
    const difficulties = [
      { key: 'easy', label: 'Easy (0-20)', color: 0x4CAF50, hoverColor: 0x45a049 },
      { key: 'medium', label: 'Medium (0-50)', color: 0xFF9800, hoverColor: 0xe68900 },
      { key: 'hard', label: 'Hard (0-100)', color: 0xF44336, hoverColor: 0xda190b }
    ];

    difficulties.forEach((diff, index) => {
      const y = centerY + index * (buttonHeight + spacing);

      // Create button
      const button = this.createButton(
        width / 2,
        y,
        buttonWidth,
        buttonHeight,
        diff.label,
        diff.color,
        diff.hoverColor,
        () => this.onDifficultySelect(diff.key)
      );

      this.buttons[diff.key] = button;
    });

    // Instruction text above buttons
    const instructionText = this.add.text(width / 2, centerY - 60, 'Choose Your Difficulty:', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#333333'
    });
    instructionText.setOrigin(0.5);
  }

  /**
   * Create a button with hover effects
   */
  createButton(x, y, width, height, text, color, hoverColor, callback) {
    // Button background
    const bg = this.add.rectangle(x, y, width, height, color);
    bg.setStrokeStyle(4, 0x333333);

    // Button text
    const label = this.add.text(x, y, text, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#FFFFFF'
    });
    label.setOrigin(0.5);

    // Container for button elements
    const container = this.add.container(0, 0, [bg, label]);

    // Make interactive
    bg.setInteractive({ useHandCursor: true });

    // Hover effects
    bg.on('pointerover', () => {
      bg.setFillStyle(hoverColor);
      this.tweens.add({
        targets: container,
        scale: 1.05,
        duration: 100,
        ease: 'Power2'
      });
    });

    bg.on('pointerout', () => {
      bg.setFillStyle(color);
      this.tweens.add({
        targets: container,
        scale: 1,
        duration: 100,
        ease: 'Power2'
      });
    });

    // Click effect and callback
    bg.on('pointerdown', () => {
      this.tweens.add({
        targets: container,
        scale: 0.95,
        duration: 50,
        yoyo: true,
        ease: 'Power2',
        onComplete: () => {
          this.audioManager.playSound('button-click');
          callback();
        }
      });
    });

    return { bg, label, container };
  }

  /**
   * Create footer buttons (instructions and parent info)
   */
  createFooterButtons(width, height) {
    const buttonWidth = 180;
    const buttonHeight = 50;
    const y = height - 70;

    // Instructions button
    const instructionsButton = this.createButton(
      width / 2 - buttonWidth / 2 - 20,
      y,
      buttonWidth,
      buttonHeight,
      'How to Play',
      0x2196F3,
      0x1976D2,
      () => this.showInstructions()
    );

    // Parent info button
    const parentButton = this.createButton(
      width / 2 + buttonWidth / 2 + 20,
      y,
      buttonWidth,
      buttonHeight,
      'For Parents',
      0x9C27B0,
      0x7B1FA2,
      () => this.showParentInfo()
    );
  }

  /**
   * Create mute/unmute toggle button
   */
  createMuteToggle(width, height) {
    const isMuted = this.audioManager.isMuted();
    const muteText = isMuted ? '🔇' : '🔊';

    this.muteButton = this.add.text(width - 60, 30, muteText, {
      fontSize: '36px'
    });
    this.muteButton.setOrigin(0.5);
    this.muteButton.setInteractive({ useHandCursor: true });

    this.muteButton.on('pointerdown', () => {
      this.toggleMute();
    });

    // Pulse animation
    this.tweens.add({
      targets: this.muteButton,
      scale: { from: 1, to: 1.1 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  /**
   * Handle difficulty selection
   */
  onDifficultySelect(difficulty) {
    this.selectedDifficulty = difficulty;

    // Store difficulty in registry
    this.registry.set('currentDifficulty', difficulty);

    // Visual feedback - flash the selected button
    const button = this.buttons[difficulty];
    this.tweens.add({
      targets: button.container,
      alpha: 0.5,
      duration: 100,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        this.startGame();
      }
    });
  }

  /**
   * Start the game with selected difficulty
   */
  startGame() {
    // Fade out
    this.cameras.main.fadeOut(300, 0, 0, 0);

    this.cameras.main.once('camerafadeoutcomplete', () => {
      // Stop background music
      this.audioManager.stopMusic();

      // Start game scene with difficulty data
      this.scene.start('GameScene', {
        difficulty: this.selectedDifficulty
      });
    });
  }

  /**
   * Show instructions modal
   */
  showInstructions() {
    if (this.instructionsModal) {
      return; // Already showing
    }

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Create modal background overlay
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
    overlay.setOrigin(0, 0);
    overlay.setInteractive();
    overlay.setDepth(1000);

    // Create modal panel
    const panelWidth = 600;
    const panelHeight = 400;
    const panel = this.add.rectangle(width / 2, height / 2, panelWidth, panelHeight, 0xFFFFFF);
    panel.setStrokeStyle(4, 0x333333);
    panel.setDepth(1001);

    // Title
    const title = this.add.text(width / 2, height / 2 - 150, 'How to Play', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#333333'
    });
    title.setOrigin(0.5);
    title.setDepth(1001);

    // Instructions
    const instructions = this.add.text(width / 2, height / 2 - 60,
      '1. Choose your difficulty level\n\n' +
      '2. Answer math questions correctly\n\n' +
      '3. Help the gorilla swing through the jungle\n\n' +
      '4. Collect bananas and earn stars!\n\n' +
      'Use keyboard or number pad to answer.',
      {
        fontFamily: 'Arial, sans-serif',
        fontSize: '20px',
        color: '#666666',
        align: 'left',
        lineSpacing: 5
      }
    );
    instructions.setOrigin(0.5);
    instructions.setDepth(1001);

    // Close button
    const closeButton = this.createButton(
      width / 2,
      height / 2 + 140,
      150,
      50,
      'Got it!',
      0x4CAF50,
      0x45a049,
      () => this.closeInstructions()
    );
    closeButton.container.setDepth(1001);

    this.instructionsModal = {
      overlay,
      panel,
      title,
      instructions,
      closeButton
    };
  }

  /**
   * Close instructions modal
   */
  closeInstructions() {
    if (!this.instructionsModal) {
      return;
    }

    // Destroy all modal elements
    this.instructionsModal.overlay.destroy();
    this.instructionsModal.panel.destroy();
    this.instructionsModal.title.destroy();
    this.instructionsModal.instructions.destroy();
    this.instructionsModal.closeButton.container.destroy();

    this.instructionsModal = null;
  }

  /**
   * Show parent/teacher information modal
   */
  showParentInfo() {
    if (this.parentInfoModal) {
      return; // Already showing
    }

    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Create modal background overlay
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
    overlay.setOrigin(0, 0);
    overlay.setInteractive();
    overlay.setDepth(1000);

    // Create modal panel
    const panelWidth = 650;
    const panelHeight = 450;
    const panel = this.add.rectangle(width / 2, height / 2, panelWidth, panelHeight, 0xFFFFFF);
    panel.setStrokeStyle(4, 0x333333);
    panel.setDepth(1001);

    // Title
    const title = this.add.text(width / 2, height / 2 - 180, 'For Parents & Teachers', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#333333'
    });
    title.setOrigin(0.5);
    title.setDepth(1001);

    // Information
    const info = this.add.text(width / 2, height / 2 - 70,
      'Educational Value:\n' +
      '• Aligned with Common Core 2nd grade standards\n' +
      '• Practices addition & subtraction fluency\n' +
      '• Builds mental math skills\n' +
      '• Encouraging, positive feedback only\n\n' +
      'Difficulty Levels:\n' +
      '• Easy: Numbers 0-20 (perfect for beginners)\n' +
      '• Medium: Numbers 0-50 (building confidence)\n' +
      '• Hard: Numbers 0-100 (challenging mastery)\n\n' +
      'No data collection • Safe for kids • Ad-free',
      {
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
        color: '#666666',
        align: 'left',
        lineSpacing: 3
      }
    );
    info.setOrigin(0.5);
    info.setDepth(1001);

    // Close button
    const closeButton = this.createButton(
      width / 2,
      height / 2 + 170,
      150,
      50,
      'Close',
      0x9C27B0,
      0x7B1FA2,
      () => this.closeParentInfo()
    );
    closeButton.container.setDepth(1001);

    this.parentInfoModal = {
      overlay,
      panel,
      title,
      info,
      closeButton
    };
  }

  /**
   * Close parent info modal
   */
  closeParentInfo() {
    if (!this.parentInfoModal) {
      return;
    }

    // Destroy all modal elements
    this.parentInfoModal.overlay.destroy();
    this.parentInfoModal.panel.destroy();
    this.parentInfoModal.title.destroy();
    this.parentInfoModal.info.destroy();
    this.parentInfoModal.closeButton.container.destroy();

    this.parentInfoModal = null;
  }

  /**
   * Toggle mute state
   */
  toggleMute() {
    if (this.audioManager.isMuted()) {
      this.audioManager.unmute();
      this.muteButton.setText('🔊');
    } else {
      this.audioManager.mute();
      this.muteButton.setText('🔇');
    }

    // Play click sound if not muted
    this.audioManager.playSound('button-click');

    // Pulse animation on toggle
    this.tweens.add({
      targets: this.muteButton,
      scale: 1.3,
      duration: 150,
      yoyo: true,
      ease: 'Power2'
    });
  }

  /**
   * Play background music if enabled
   */
  playBackgroundMusic() {
    // Only play if music is enabled and available
    if (this.cache.audio.exists('jungle-theme')) {
      this.audioManager.playMusic('jungle-theme', true);
    }
  }

  /**
   * Setup keyboard shortcuts
   */
  setupKeyboardShortcuts() {
    // Press 1 for Easy
    this.input.keyboard.on('keydown-ONE', () => {
      this.onDifficultySelect('easy');
    });

    // Press 2 for Medium
    this.input.keyboard.on('keydown-TWO', () => {
      this.onDifficultySelect('medium');
    });

    // Press 3 for Hard
    this.input.keyboard.on('keydown-THREE', () => {
      this.onDifficultySelect('hard');
    });

    // Press I for instructions
    this.input.keyboard.on('keydown-I', () => {
      if (!this.instructionsModal) {
        this.showInstructions();
      } else {
        this.closeInstructions();
      }
    });

    // Press ESC to close modals
    this.input.keyboard.on('keydown-ESC', () => {
      if (this.instructionsModal) {
        this.closeInstructions();
      }
      if (this.parentInfoModal) {
        this.closeParentInfo();
      }
    });

    // Press M to mute
    this.input.keyboard.on('keydown-M', () => {
      this.toggleMute();
    });
  }

  /**
   * Update loop (called every frame)
   */
  update() {
    // Add any per-frame updates here if needed
  }
}
