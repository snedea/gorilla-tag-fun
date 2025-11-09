/**
 * UIManager.js
 * Manages UI overlays, HUD elements, and all on-screen interface components
 */

export default class UIManager {
  constructor(scene) {
    this.scene = scene;
    this.hudElements = {};
    this.panels = {};
    this.modals = {};
    this.initialized = false;
  }

  /**
   * Initialize the UI manager
   */
  initialize() {
    this.initialized = true;
  }

  /**
   * Create the heads-up display (HUD) with score, bananas, and timer
   * @returns {Object} HUD elements
   */
  createHUD() {
    const config = this.scene.game.config;
    const width = config.width;
    const height = config.height;

    // Create HUD container
    const hudContainer = this.scene.add.container(0, 0);
    hudContainer.setScrollFactor(0);
    hudContainer.setDepth(100);

    // Score display (top left)
    const scoreLabel = this.scene.add.text(20, 20, 'Score:', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#333333'
    });

    const scoreValue = this.scene.add.text(20, 50, '0', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#2196F3'
    });

    // Banana counter (top center)
    const bananaIcon = this.scene.add.text(width / 2 - 60, 20, '🍌', {
      fontSize: '32px'
    });

    const bananaCount = this.scene.add.text(width / 2 - 20, 30, '0', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#FFD700'
    });

    // Question counter (top right)
    const questionLabel = this.scene.add.text(width - 150, 20, 'Question:', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '20px',
      color: '#333333'
    });

    const questionValue = this.scene.add.text(width - 150, 45, '1/5', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#333333'
    });

    // Add all to container
    hudContainer.add([
      scoreLabel,
      scoreValue,
      bananaIcon,
      bananaCount,
      questionLabel,
      questionValue
    ]);

    // Store references
    this.hudElements = {
      container: hudContainer,
      scoreLabel,
      scoreValue,
      bananaIcon,
      bananaCount,
      questionLabel,
      questionValue
    };

    return this.hudElements;
  }

  /**
   * Update score display
   * @param {number} score - New score value
   */
  updateScore(score) {
    if (this.hudElements.scoreValue) {
      this.hudElements.scoreValue.setText(score.toString());

      // Pulse animation on update
      this.scene.tweens.add({
        targets: this.hudElements.scoreValue,
        scale: { from: 1, to: 1.3 },
        duration: 200,
        yoyo: true,
        ease: 'Cubic.easeOut'
      });
    }
  }

  /**
   * Update banana count display
   * @param {number} count - New banana count
   */
  updateBananas(count) {
    if (this.hudElements.bananaCount) {
      this.hudElements.bananaCount.setText(count.toString());

      // Pulse animation on update
      this.scene.tweens.add({
        targets: [this.hudElements.bananaIcon, this.hudElements.bananaCount],
        scale: { from: 1, to: 1.2 },
        duration: 200,
        yoyo: true,
        ease: 'Cubic.easeOut'
      });
    }
  }

  /**
   * Update question counter
   * @param {number} current - Current question number
   * @param {number} total - Total number of questions
   */
  updateQuestionCounter(current, total) {
    if (this.hudElements.questionValue) {
      this.hudElements.questionValue.setText(`${current}/${total}`);
    }
  }

  /**
   * Show question panel with math problem
   * @param {string} question - Question text to display
   * @returns {Object} Question panel elements
   */
  showQuestionPanel(question) {
    const config = this.scene.game.config;
    const width = config.width;
    const height = config.height;

    // Remove existing question panel if present
    if (this.panels.questionPanel) {
      this.panels.questionPanel.destroy();
    }

    // Create panel container
    const panelContainer = this.scene.add.container(width / 2, 150);
    panelContainer.setDepth(90);

    // Background panel
    const panelBg = this.scene.add.rectangle(0, 0, 600, 120, 0xFFFFFF, 0.95);
    panelBg.setStrokeStyle(4, 0x2196F3);

    // Question text
    const questionText = this.scene.add.text(0, 0, question, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '36px',
      fontStyle: 'bold',
      color: '#333333',
      align: 'center',
      wordWrap: { width: 550 }
    });
    questionText.setOrigin(0.5);

    // Add to container
    panelContainer.add([panelBg, questionText]);

    // Animate entrance
    panelContainer.setScale(0);
    this.scene.tweens.add({
      targets: panelContainer,
      scale: 1,
      duration: 300,
      ease: 'Back.easeOut'
    });

    this.panels.questionPanel = panelContainer;

    return {
      container: panelContainer,
      background: panelBg,
      text: questionText
    };
  }

  /**
   * Show feedback message
   * @param {string} message - Feedback message
   * @param {string} type - Feedback type ('correct', 'incorrect', 'encouragement')
   * @param {number} duration - Display duration in milliseconds
   */
  showFeedback(message, type = 'correct', duration = 2000) {
    const config = this.scene.game.config;
    const width = config.width;
    const height = config.height;

    // Remove existing feedback if present
    if (this.panels.feedbackPanel) {
      this.panels.feedbackPanel.destroy();
    }

    // Determine color based on type
    let color = '#4CAF50'; // green for correct
    let bgColor = 0x4CAF50;
    if (type === 'incorrect') {
      color = '#FF9800'; // orange for incorrect
      bgColor = 0xFF9800;
    } else if (type === 'encouragement') {
      color = '#2196F3'; // blue for encouragement
      bgColor = 0x2196F3;
    }

    // Create feedback container
    const feedbackContainer = this.scene.add.container(width / 2, height / 2);
    feedbackContainer.setDepth(150);

    // Background
    const feedbackBg = this.scene.add.rectangle(0, 0, 500, 100, bgColor, 0.9);
    feedbackBg.setStrokeStyle(4, 0xFFFFFF);

    // Feedback text
    const feedbackText = this.scene.add.text(0, 0, message, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#FFFFFF',
      align: 'center',
      wordWrap: { width: 450 }
    });
    feedbackText.setOrigin(0.5);

    // Add to container
    feedbackContainer.add([feedbackBg, feedbackText]);

    // Animate entrance
    feedbackContainer.setAlpha(0);
    feedbackContainer.setScale(0.5);
    this.scene.tweens.add({
      targets: feedbackContainer,
      alpha: 1,
      scale: 1,
      duration: 200,
      ease: 'Back.easeOut'
    });

    this.panels.feedbackPanel = feedbackContainer;

    // Auto-hide after duration
    this.scene.time.delayedCall(duration, () => {
      if (this.panels.feedbackPanel === feedbackContainer) {
        this.hideFeedback();
      }
    });

    return feedbackContainer;
  }

  /**
   * Hide feedback panel
   */
  hideFeedback() {
    if (this.panels.feedbackPanel) {
      this.scene.tweens.add({
        targets: this.panels.feedbackPanel,
        alpha: 0,
        scale: 0.5,
        duration: 200,
        ease: 'Cubic.easeIn',
        onComplete: () => {
          if (this.panels.feedbackPanel) {
            this.panels.feedbackPanel.destroy();
            this.panels.feedbackPanel = null;
          }
        }
      });
    }
  }

  /**
   * Show number pad for input
   * @param {Function} onNumberClick - Callback when number is clicked
   * @param {Function} onBackspace - Callback when backspace is clicked
   * @param {Function} onSubmit - Callback when submit is clicked
   * @returns {Object} Number pad elements
   */
  showNumberPad(onNumberClick, onBackspace, onSubmit) {
    const config = this.scene.game.config;
    const width = config.width;
    const height = config.height;

    // Remove existing number pad if present
    if (this.panels.numberPad) {
      this.panels.numberPad.destroy();
    }

    // Create number pad container
    const padContainer = this.scene.add.container(width / 2, height - 200);
    padContainer.setDepth(80);

    const buttons = [];
    const buttonSize = 60;
    const gap = 10;

    // Create buttons 1-9
    for (let i = 1; i <= 9; i++) {
      const row = Math.floor((i - 1) / 3);
      const col = (i - 1) % 3;
      const x = (col - 1) * (buttonSize + gap);
      const y = row * (buttonSize + gap) - 100;

      const button = this.createButton(x, y, buttonSize, buttonSize, i.toString(), () => {
        if (onNumberClick) onNumberClick(i);
      });

      buttons.push(button);
      padContainer.add(button);
    }

    // Create 0 button
    const zeroButton = this.createButton(0, 3 * (buttonSize + gap) - 100, buttonSize, buttonSize, '0', () => {
      if (onNumberClick) onNumberClick(0);
    });
    buttons.push(zeroButton);
    padContainer.add(zeroButton);

    // Create backspace button
    const backspaceButton = this.createButton(-(buttonSize + gap), 3 * (buttonSize + gap) - 100, buttonSize, buttonSize, '←', () => {
      if (onBackspace) onBackspace();
    });
    buttons.push(backspaceButton);
    padContainer.add(backspaceButton);

    // Create submit button
    const submitButton = this.createButton((buttonSize + gap), 3 * (buttonSize + gap) - 100, buttonSize, buttonSize, '✓', () => {
      if (onSubmit) onSubmit();
    }, 0x4CAF50);
    buttons.push(submitButton);
    padContainer.add(submitButton);

    this.panels.numberPad = padContainer;

    return {
      container: padContainer,
      buttons: buttons
    };
  }

  /**
   * Hide number pad
   */
  hideNumberPad() {
    if (this.panels.numberPad) {
      this.panels.numberPad.destroy();
      this.panels.numberPad = null;
    }
  }

  /**
   * Create a button with text
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} width - Button width
   * @param {number} height - Button height
   * @param {string} text - Button text
   * @param {Function} onClick - Click callback
   * @param {number} color - Button color
   * @returns {Phaser.GameObjects.Container} Button container
   */
  createButton(x, y, width, height, text, onClick, color = 0x2196F3) {
    const button = this.scene.add.container(x, y);

    // Button background
    const bg = this.scene.add.rectangle(0, 0, width, height, color, 1);
    bg.setStrokeStyle(2, 0xFFFFFF);

    // Button text
    const label = this.scene.add.text(0, 0, text, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#FFFFFF'
    });
    label.setOrigin(0.5);

    button.add([bg, label]);

    // Make interactive
    bg.setInteractive({ useHandCursor: true });

    bg.on('pointerover', () => {
      bg.setFillStyle(color, 0.8);
    });

    bg.on('pointerout', () => {
      bg.setFillStyle(color, 1);
    });

    bg.on('pointerdown', () => {
      this.scene.tweens.add({
        targets: button,
        scale: 0.9,
        duration: 100,
        yoyo: true,
        ease: 'Cubic.easeOut'
      });

      if (onClick) {
        onClick();
      }
    });

    return button;
  }

  /**
   * Show pause menu overlay
   * @param {Function} onResume - Callback when resume is clicked
   * @param {Function} onQuit - Callback when quit is clicked
   */
  showPauseMenu(onResume, onQuit) {
    const config = this.scene.game.config;
    const width = config.width;
    const height = config.height;

    // Remove existing pause menu if present
    if (this.modals.pauseMenu) {
      return;
    }

    // Create pause menu container
    const pauseContainer = this.scene.add.container(0, 0);
    pauseContainer.setDepth(200);

    // Dark overlay
    const overlay = this.scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);

    // Menu panel
    const menuBg = this.scene.add.rectangle(width / 2, height / 2, 400, 300, 0xFFFFFF, 1);
    menuBg.setStrokeStyle(4, 0x2196F3);

    // Title
    const title = this.scene.add.text(width / 2, height / 2 - 100, 'PAUSED', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '48px',
      fontStyle: 'bold',
      color: '#333333'
    });
    title.setOrigin(0.5);

    // Resume button
    const resumeButton = this.createButton(width / 2, height / 2, 200, 60, 'Resume', () => {
      this.hidePauseMenu();
      if (onResume) onResume();
    }, 0x4CAF50);

    // Quit button
    const quitButton = this.createButton(width / 2, height / 2 + 80, 200, 60, 'Quit', () => {
      this.hidePauseMenu();
      if (onQuit) onQuit();
    }, 0xF44336);

    pauseContainer.add([overlay, menuBg, title, resumeButton, quitButton]);

    this.modals.pauseMenu = pauseContainer;

    return pauseContainer;
  }

  /**
   * Hide pause menu
   */
  hidePauseMenu() {
    if (this.modals.pauseMenu) {
      this.modals.pauseMenu.destroy();
      this.modals.pauseMenu = null;
    }
  }

  /**
   * Show visual hint for question
   * @param {string} hintType - Type of hint ('bananas', 'blocks', 'number-line')
   * @param {Object} values - Values for the hint visualization
   */
  showHint(hintType, values) {
    const config = this.scene.game.config;
    const width = config.width;

    // Remove existing hint if present
    if (this.panels.hintPanel) {
      this.panels.hintPanel.destroy();
    }

    const hintContainer = this.scene.add.container(width / 2, 300);
    hintContainer.setDepth(85);

    if (hintType === 'bananas') {
      // Show banana counting visual
      const { a, b } = values;
      let xOffset = -(a + b) * 15;

      // First group
      for (let i = 0; i < a; i++) {
        const banana = this.scene.add.text(xOffset, 0, '🍌', { fontSize: '24px' });
        hintContainer.add(banana);
        xOffset += 30;
      }

      // Separator
      const plus = this.scene.add.text(xOffset, 0, '+', {
        fontSize: '28px',
        fontStyle: 'bold',
        color: '#333333'
      });
      hintContainer.add(plus);
      xOffset += 30;

      // Second group
      for (let i = 0; i < b; i++) {
        const banana = this.scene.add.text(xOffset, 0, '🍌', { fontSize: '24px' });
        hintContainer.add(banana);
        xOffset += 30;
      }
    }

    this.panels.hintPanel = hintContainer;

    return hintContainer;
  }

  /**
   * Hide hint panel
   */
  hideHint() {
    if (this.panels.hintPanel) {
      this.panels.hintPanel.destroy();
      this.panels.hintPanel = null;
    }
  }

  /**
   * Show input display for current answer
   * @param {string} input - Current input value
   * @returns {Phaser.GameObjects.Text} Input display text
   */
  showInputDisplay(input = '') {
    const config = this.scene.game.config;
    const width = config.width;

    if (!this.panels.inputDisplay) {
      const inputText = this.scene.add.text(width / 2, 250, '', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '48px',
        fontStyle: 'bold',
        color: '#2196F3',
        backgroundColor: '#F0F0F0',
        padding: { x: 20, y: 10 }
      });
      inputText.setOrigin(0.5);
      inputText.setDepth(85);

      this.panels.inputDisplay = inputText;
    }

    this.panels.inputDisplay.setText(input || '_');

    return this.panels.inputDisplay;
  }

  /**
   * Hide input display
   */
  hideInputDisplay() {
    if (this.panels.inputDisplay) {
      this.panels.inputDisplay.destroy();
      this.panels.inputDisplay = null;
    }
  }

  /**
   * Show level complete banner
   * @param {number} stars - Number of stars earned
   * @param {number} score - Final score
   */
  showLevelComplete(stars, score) {
    const config = this.scene.game.config;
    const width = config.width;
    const height = config.height;

    const completeContainer = this.scene.add.container(width / 2, height / 2);
    completeContainer.setDepth(150);

    // Background
    const bg = this.scene.add.rectangle(0, 0, 600, 400, 0xFFFFFF, 0.98);
    bg.setStrokeStyle(6, 0x4CAF50);

    // Title
    const title = this.scene.add.text(0, -150, 'Level Complete!', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '48px',
      fontStyle: 'bold',
      color: '#4CAF50'
    });
    title.setOrigin(0.5);

    // Stars
    const starsContainer = this.scene.add.container(0, -50);
    for (let i = 0; i < 3; i++) {
      const star = this.scene.add.text(i * 80 - 80, 0, i < stars ? '⭐' : '☆', {
        fontSize: '64px'
      });
      starsContainer.add(star);
    }

    // Score
    const scoreText = this.scene.add.text(0, 50, `Score: ${score}`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '36px',
      fontStyle: 'bold',
      color: '#333333'
    });
    scoreText.setOrigin(0.5);

    completeContainer.add([bg, title, starsContainer, scoreText]);

    // Animate entrance
    completeContainer.setAlpha(0);
    completeContainer.setScale(0.5);
    this.scene.tweens.add({
      targets: completeContainer,
      alpha: 1,
      scale: 1,
      duration: 500,
      ease: 'Back.easeOut'
    });

    this.modals.levelComplete = completeContainer;

    return completeContainer;
  }

  /**
   * Clean up all UI elements
   */
  destroy() {
    // Destroy HUD
    if (this.hudElements.container) {
      this.hudElements.container.destroy();
    }

    // Destroy panels
    Object.values(this.panels).forEach(panel => {
      if (panel) panel.destroy();
    });

    // Destroy modals
    Object.values(this.modals).forEach(modal => {
      if (modal) modal.destroy();
    });

    this.hudElements = {};
    this.panels = {};
    this.modals = {};
    this.scene = null;
  }
}
