/**
 * ResultsScene.js
 * End-of-level results display for Gorilla Tag Fun Math Game
 *
 * Purpose: Display level completion results with stats and encouragement
 * Features:
 * - Shows final score and accuracy
 * - Displays stars earned (1-3 based on performance)
 * - Shows total bananas collected
 * - Provides replay/continue options
 * - Displays encouraging messages
 * - Saves progress to localStorage
 */

import Phaser from 'phaser';
import { COLORS, FONTS, SCORING, ANIMATIONS } from '../utils/constants.js';
import ProgressManager from '../systems/ProgressManager.js';
import UIManager from '../systems/UIManager.js';
import AudioManager from '../systems/AudioManager.js';

export default class ResultsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ResultsScene' });

    // Results data
    this.difficulty = 'easy';
    this.score = 0;
    this.correctAnswers = 0;
    this.totalAnswers = 0;
    this.bananasCollected = 0;
    this.accuracy = 0;
    this.stars = 0;

    // Systems
    this.progressManager = null;
    this.uiManager = null;
    this.audioManager = null;

    // UI elements
    this.background = null;
    this.titleText = null;
    this.scoreText = null;
    this.accuracyText = null;
    this.bananaText = null;
    this.starGraphics = [];
    this.messageText = null;
    this.buttons = [];
  }

  init(data) {
    // Receive data from GameScene
    this.difficulty = data.difficulty || 'easy';
    this.score = data.score || 0;
    this.correctAnswers = data.correctAnswers || 0;
    this.totalAnswers = data.totalAnswers || 0;
    this.bananasCollected = data.bananasCollected || 0;
    this.accuracy = data.accuracy || 0;
    this.stars = data.stars || 0;

    console.log('ResultsScene initialized with:', data);
  }

  create() {
    // Initialize systems
    this.initializeSystems();

    // Create background
    this.createBackground();

    // Display results with animations
    this.displayResults();

    // Setup input
    this.setupInput();
  }

  initializeSystems() {
    // Progress Manager
    this.progressManager = new ProgressManager();
    this.progressManager.initialize();
    this.progressManager.loadProgress();

    // Audio Manager
    this.audioManager = new AudioManager(this);
    this.audioManager.initialize();

    // UI Manager
    this.uiManager = new UIManager(this);
    this.uiManager.initialize();

    console.log('ResultsScene systems initialized');
  }

  createBackground() {
    // Sky background with celebration colors
    this.background = this.add.rectangle(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      this.cameras.main.width,
      this.cameras.main.height,
      0x87CEEB // Sky blue
    );

    // Add celebratory confetti particles
    this.createConfetti();
  }

  createConfetti() {
    // Create simple particle effect for celebration
    const colors = [0xFF6B6B, 0x4ECDC4, 0x45B7D1, 0xFFA07A, 0xFFD700];

    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.Between(0, this.cameras.main.width);
      const y = Phaser.Math.Between(-100, 0);
      const color = colors[Phaser.Math.Between(0, colors.length - 1)];
      const size = Phaser.Math.Between(5, 15);

      const confetti = this.add.rectangle(x, y, size, size, color);
      confetti.setRotation(Phaser.Math.FloatBetween(0, Math.PI * 2));

      // Animate confetti falling
      this.tweens.add({
        targets: confetti,
        y: this.cameras.main.height + 100,
        rotation: confetti.rotation + Math.PI * 4,
        duration: Phaser.Math.Between(2000, 4000),
        delay: Phaser.Math.Between(0, 1000),
        ease: 'Linear',
        onComplete: () => {
          confetti.destroy();
        }
      });
    }
  }

  displayResults() {
    const centerX = this.cameras.main.centerX;
    const startY = 100;

    // Title
    this.titleText = this.add.text(centerX, startY, 'Level Complete!', {
      fontSize: '64px',
      fontFamily: FONTS.HEADING.family,
      color: COLORS.TEXT_DARK,
      fontStyle: 'bold',
      stroke: COLORS.TEXT_LIGHT,
      strokeThickness: 6
    });
    this.titleText.setOrigin(0.5);
    this.titleText.setAlpha(0);

    // Animate title
    this.tweens.add({
      targets: this.titleText,
      alpha: 1,
      y: startY - 20,
      duration: 500,
      ease: 'Back.easeOut'
    });

    // Play celebration sound
    this.audioManager.playSound('celebrate');

    // Show stats with sequential animation
    this.time.delayedCall(500, () => this.showStars());
    this.time.delayedCall(1500, () => this.showScore());
    this.time.delayedCall(2000, () => this.showAccuracy());
    this.time.delayedCall(2500, () => this.showBananas());
    this.time.delayedCall(3000, () => this.showMessage());
    this.time.delayedCall(3500, () => this.showButtons());
  }

  showStars() {
    const centerX = this.cameras.main.centerX;
    const starY = 200;
    const starSize = 60;
    const spacing = 80;

    // Calculate starting X for centered stars
    const totalWidth = (this.stars - 1) * spacing;
    const startX = centerX - totalWidth / 2;

    // Display stars one by one
    for (let i = 0; i < 3; i++) {
      const x = startX + i * spacing;
      const isFilled = i < this.stars;

      this.time.delayedCall(i * 300, () => {
        const star = this.createStar(x, starY, starSize, isFilled);
        this.starGraphics.push(star);

        if (isFilled) {
          this.audioManager.playSound('correct-answer', 0.3);
        }
      });
    }
  }

  createStar(x, y, size, filled) {
    // Create a star shape using graphics
    const star = this.add.graphics();

    if (filled) {
      star.fillStyle(0xFFD700, 1); // Gold
    } else {
      star.lineStyle(4, 0xCCCCCC, 1); // Gray outline
    }

    // Draw 5-pointed star
    const points = [];
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const radius = filled ? size : size - 4;
      points.push({
        x: x + Math.cos(angle) * radius,
        y: y + Math.sin(angle) * radius
      });
    }

    star.beginPath();
    star.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      star.lineTo(points[i].x, points[i].y);
    }
    star.closePath();

    if (filled) {
      star.fillPath();
    } else {
      star.strokePath();
    }

    // Animate entrance
    star.setAlpha(0);
    star.setScale(0);

    this.tweens.add({
      targets: star,
      alpha: 1,
      scale: 1,
      duration: 400,
      ease: 'Back.easeOut'
    });

    return star;
  }

  showScore() {
    const centerX = this.cameras.main.centerX;

    this.scoreText = this.add.text(centerX, 320, `Score: ${this.score}`, {
      fontSize: '48px',
      fontFamily: FONTS.HEADING.family,
      color: COLORS.TEXT_DARK,
      fontStyle: 'bold'
    });
    this.scoreText.setOrigin(0.5);
    this.scoreText.setAlpha(0);

    this.tweens.add({
      targets: this.scoreText,
      alpha: 1,
      y: 340,
      duration: 300,
      ease: 'Power2'
    });
  }

  showAccuracy() {
    const centerX = this.cameras.main.centerX;

    const accuracyDisplay = Math.round(this.accuracy);
    this.accuracyText = this.add.text(
      centerX,
      380,
      `Accuracy: ${accuracyDisplay}% (${this.correctAnswers}/${this.totalAnswers})`,
      {
        fontSize: '36px',
        fontFamily: FONTS.BODY.family,
        color: COLORS.TEXT_DARK,
        fontStyle: 'bold'
      }
    );
    this.accuracyText.setOrigin(0.5);
    this.accuracyText.setAlpha(0);

    this.tweens.add({
      targets: this.accuracyText,
      alpha: 1,
      y: 400,
      duration: 300,
      ease: 'Power2'
    });
  }

  showBananas() {
    const centerX = this.cameras.main.centerX;

    // Create banana icon (simple yellow circle for now)
    const bananaIcon = this.add.circle(centerX - 100, 460, 20, 0xFFD700);
    bananaIcon.setStrokeStyle(3, 0x333333);
    bananaIcon.setAlpha(0);

    this.bananaText = this.add.text(
      centerX - 60,
      460,
      `x ${this.bananasCollected} Bananas Collected!`,
      {
        fontSize: '32px',
        fontFamily: FONTS.BODY.family,
        color: COLORS.TEXT_DARK,
        fontStyle: 'bold'
      }
    );
    this.bananaText.setOrigin(0, 0.5);
    this.bananaText.setAlpha(0);

    this.tweens.add({
      targets: [bananaIcon, this.bananaText],
      alpha: 1,
      y: '+=20',
      duration: 300,
      ease: 'Power2'
    });
  }

  showMessage() {
    const centerX = this.cameras.main.centerX;
    const message = this.getEncouragingMessage();

    this.messageText = this.add.text(centerX, 530, message, {
      fontSize: '28px',
      fontFamily: FONTS.BODY.family,
      color: COLORS.CORRECT,
      fontStyle: 'bold'
    });
    this.messageText.setOrigin(0.5);
    this.messageText.setAlpha(0);

    this.tweens.add({
      targets: this.messageText,
      alpha: 1,
      duration: 500,
      ease: 'Power2'
    });
  }

  getEncouragingMessage() {
    if (this.stars === 3) {
      return 'Outstanding! You\'re a math superstar!';
    } else if (this.stars === 2) {
      return 'Great job! Keep up the good work!';
    } else if (this.stars === 1) {
      return 'Good effort! Practice makes perfect!';
    } else {
      return 'Nice try! Let\'s keep learning!';
    }
  }

  showButtons() {
    const centerX = this.cameras.main.centerX;
    const buttonY = 630;

    // Replay button
    const replayButton = this.createButton(
      centerX - 120,
      buttonY,
      'Replay',
      0x4CAF50,
      () => this.onReplay()
    );

    // Menu button
    const menuButton = this.createButton(
      centerX + 120,
      buttonY,
      'Menu',
      0x2196F3,
      () => this.onMenu()
    );

    this.buttons.push(replayButton, menuButton);
  }

  createButton(x, y, label, color, callback) {
    const buttonWidth = 200;
    const buttonHeight = 60;

    // Button background
    const button = this.add.rectangle(x, y, buttonWidth, buttonHeight, color);
    button.setStrokeStyle(4, 0x333333);
    button.setInteractive({ useHandCursor: true });
    button.setAlpha(0);

    // Button text
    const text = this.add.text(x, y, label, {
      fontSize: '32px',
      fontFamily: FONTS.BUTTON.family,
      color: COLORS.TEXT_LIGHT,
      fontStyle: 'bold'
    });
    text.setOrigin(0.5);
    text.setAlpha(0);

    // Hover effects
    button.on('pointerover', () => {
      button.setScale(1.05);
      this.tweens.add({
        targets: button,
        fillColor: color + 0x222222,
        duration: 100
      });
    });

    button.on('pointerout', () => {
      button.setScale(1);
      button.setFillStyle(color);
    });

    // Click effect
    button.on('pointerdown', () => {
      button.setScale(0.95);
      if (this.audioManager) {
        this.audioManager.playSound('button-click', 0.3);
      }
    });

    button.on('pointerup', () => {
      button.setScale(1.05);
      callback();
    });

    // Animate entrance
    this.tweens.add({
      targets: [button, text],
      alpha: 1,
      y: y + 20,
      duration: 300,
      ease: 'Back.easeOut'
    });

    return { button, text };
  }

  setupInput() {
    // ESC key returns to menu
    this.input.keyboard.on('keydown-ESC', () => {
      this.onMenu();
    });

    // SPACE or ENTER replays
    this.input.keyboard.on('keydown-SPACE', () => {
      this.onReplay();
    });

    this.input.keyboard.on('keydown-ENTER', () => {
      this.onReplay();
    });
  }

  onReplay() {
    console.log('Replaying level...');

    // Restart game scene with same difficulty
    this.scene.start('GameScene', {
      difficulty: this.difficulty
    });
  }

  onMenu() {
    console.log('Returning to menu...');

    // Return to menu scene
    this.scene.start('MenuScene');
  }

  shutdown() {
    console.log('ResultsScene shutting down');

    // Remove event listeners
    this.input.keyboard.off('keydown-ESC');
    this.input.keyboard.off('keydown-SPACE');
    this.input.keyboard.off('keydown-ENTER');

    // Clear references
    this.progressManager = null;
    this.uiManager = null;
    this.audioManager = null;
  }
}
