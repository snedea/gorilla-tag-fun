/**
 * FeedbackPanel.js
 * Display encouraging feedback for 2nd graders
 * Shows correct/incorrect messages with positive reinforcement
 */

export default class FeedbackPanel {
  /**
   * Create a FeedbackPanel
   * @param {Phaser.Scene} scene - The scene this panel belongs to
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.container = null;
    this.messageText = null;
    this.iconContainer = null;
    this.isVisible = false;

    // Styling constants
    this.PANEL_WIDTH = 500;
    this.PANEL_HEIGHT = 150;
    this.CORRECT_COLOR = 0x4CAF50; // Green
    this.INCORRECT_COLOR = 0xFF9800; // Orange (not red - less harsh)
    this.PANEL_COLOR = 0xFFFFFF;
    this.TEXT_COLOR = '#FFFFFF';

    // Feedback messages
    this.correctMessages = [
      'Great job!',
      'You\'re a math whiz!',
      'Perfect!',
      'Awesome!',
      'Super smart!',
      'You got it!',
      'Excellent work!',
      'Banana-tastic!'
    ];

    this.incorrectCloseMessages = [
      'Almost there!',
      'So close!',
      'Try again!',
      'You can do it!',
      'Give it another try!',
      'Nearly got it!'
    ];

    this.incorrectFarMessages = [
      'Not quite, try again!',
      'Let\'s think about this!',
      'Give it another shot!',
      'Keep trying!',
      'You\'re learning!'
    ];

    this.encouragementMessages = [
      'You\'re doing great!',
      'Keep going!',
      'You\'re on a roll!',
      'Amazing progress!'
    ];

    this.create();
  }

  /**
   * Create the feedback panel UI
   */
  create() {
    // Create container for all elements
    this.container = this.scene.add.container(this.x, this.y);

    // Create panel background
    this.panel = this.scene.add.rectangle(
      0,
      0,
      this.PANEL_WIDTH,
      this.PANEL_HEIGHT,
      this.PANEL_COLOR
    );
    this.panel.setStrokeStyle(6, 0x333333);

    // Create icon container
    this.iconContainer = this.scene.add.container(-150, 0);

    // Create message text
    this.messageText = this.scene.add.text(30, 0, '', {
      fontSize: '36px',
      fontFamily: 'Comic Sans MS, Comic Neue, cursive',
      color: '#333333',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: 300 }
    });
    this.messageText.setOrigin(0, 0.5);

    this.container.add(this.panel);
    this.container.add(this.iconContainer);
    this.container.add(this.messageText);

    // Initially hidden
    this.container.setVisible(false);
  }

  /**
   * Show correct answer feedback
   */
  showCorrectFeedback() {
    const message = this.getRandomMessage(this.correctMessages);
    this.showFeedback(message, this.CORRECT_COLOR, 'correct');
  }

  /**
   * Show incorrect answer feedback
   * @param {number} correctAnswer - The correct answer to show
   * @param {boolean} isClose - Whether answer was close
   */
  showIncorrectFeedback(correctAnswer, isClose = false) {
    const messages = isClose ? this.incorrectCloseMessages : this.incorrectFarMessages;
    const message = this.getRandomMessage(messages);
    const fullMessage = `${message}\n\nThe answer is ${correctAnswer}`;

    this.showFeedback(fullMessage, this.INCORRECT_COLOR, 'incorrect');
  }

  /**
   * Show encouragement message
   */
  showEncouragement() {
    const message = this.getRandomMessage(this.encouragementMessages);
    this.showFeedback(message, 0x2196F3, 'encouragement'); // Blue
  }

  /**
   * Show feedback with animation
   * @param {string} message - Message to display
   * @param {number} color - Panel accent color
   * @param {string} type - Feedback type ('correct', 'incorrect', 'encouragement')
   */
  showFeedback(message, color, type) {
    // Update panel styling
    this.panel.setStrokeStyle(6, color);

    // Update message
    this.messageText.setText(message);

    // Clear and create icon
    this.iconContainer.removeAll(true);
    this.createIcon(type, color);

    // Show and animate
    this.container.setVisible(true);
    this.isVisible = true;

    // Start off-screen and fade in
    this.container.setAlpha(0);
    this.container.setScale(0.5);

    this.scene.tweens.add({
      targets: this.container,
      alpha: 1,
      scale: 1,
      duration: 400,
      ease: 'Back.easeOut'
    });

    // Particle effect for correct answers
    if (type === 'correct') {
      this.createParticleEffect(color);
    }

    // Shake effect for incorrect answers
    if (type === 'incorrect') {
      this.shakePanel();
    }
  }

  /**
   * Create icon based on feedback type
   * @param {string} type - Feedback type
   * @param {number} color - Icon color
   */
  createIcon(type, color) {
    if (type === 'correct') {
      // Draw checkmark
      const graphics = this.scene.add.graphics();
      graphics.lineStyle(8, color);
      graphics.beginPath();
      graphics.moveTo(-20, 0);
      graphics.lineTo(-5, 15);
      graphics.lineTo(20, -15);
      graphics.strokePath();
      this.iconContainer.add(graphics);

      // Circle around checkmark
      const circle = this.scene.add.circle(0, 0, 40, 0xFFFFFF);
      circle.setStrokeStyle(6, color);
      this.iconContainer.add(circle);
      this.iconContainer.sendToBack(circle);
    } else if (type === 'incorrect') {
      // Draw thoughtful gorilla emoji or thinking bubble
      const bubble = this.scene.add.ellipse(0, 0, 80, 60, 0xFFFFFF);
      bubble.setStrokeStyle(4, color);
      this.iconContainer.add(bubble);

      // Three dots
      const dotY = 0;
      [-15, 0, 15].forEach(x => {
        const dot = this.scene.add.circle(x, dotY, 5, color);
        this.iconContainer.add(dot);
      });
    } else {
      // Star for encouragement
      this.drawStar(0, 0, 5, 35, 18, color);
    }
  }

  /**
   * Draw a star shape
   * @param {number} x - Center X
   * @param {number} y - Center Y
   * @param {number} points - Number of points
   * @param {number} outerRadius - Outer radius
   * @param {number} innerRadius - Inner radius
   * @param {number} color - Star color
   */
  drawStar(x, y, points, outerRadius, innerRadius, color) {
    const graphics = this.scene.add.graphics();
    const angle = Math.PI / points;

    graphics.fillStyle(color);
    graphics.lineStyle(3, 0x333333);

    graphics.beginPath();
    for (let i = 0; i < 2 * points; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const xPos = x + radius * Math.sin(i * angle);
      const yPos = y - radius * Math.cos(i * angle);

      if (i === 0) {
        graphics.moveTo(xPos, yPos);
      } else {
        graphics.lineTo(xPos, yPos);
      }
    }
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();

    this.iconContainer.add(graphics);
  }

  /**
   * Create particle effect for correct answers
   * @param {number} color - Particle color
   */
  createParticleEffect(color) {
    const particles = [];
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
      const particle = this.scene.add.circle(0, 0, 5, color);
      particle.setAlpha(0);
      this.container.add(particle);
      particles.push(particle);

      const angle = (Math.PI * 2 * i) / particleCount;
      const distance = 100 + Math.random() * 50;

      this.scene.tweens.add({
        targets: particle,
        alpha: 1,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        duration: 600,
        ease: 'Power2',
        onComplete: () => {
          this.scene.tweens.add({
            targets: particle,
            alpha: 0,
            duration: 200,
            onComplete: () => particle.destroy()
          });
        }
      });
    }
  }

  /**
   * Shake the panel (for incorrect answers)
   */
  shakePanel() {
    const originalX = this.container.x;

    this.scene.tweens.add({
      targets: this.container,
      x: originalX - 10,
      duration: 50,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        this.container.x = originalX;
      }
    });
  }

  /**
   * Hide the feedback panel
   * @param {number} delay - Delay before hiding (ms)
   */
  hide(delay = 0) {
    this.scene.time.delayedCall(delay, () => {
      this.scene.tweens.add({
        targets: this.container,
        alpha: 0,
        scale: 0.8,
        duration: 300,
        ease: 'Power2',
        onComplete: () => {
          this.container.setVisible(false);
          this.isVisible = false;
        }
      });
    });
  }

  /**
   * Get random message from array
   * @param {Array<string>} messages - Array of messages
   * @returns {string} Random message
   */
  getRandomMessage(messages) {
    return messages[Math.floor(Math.random() * messages.length)];
  }

  /**
   * Check if feedback is currently visible
   * @returns {boolean} Visibility status
   */
  getIsVisible() {
    return this.isVisible;
  }

  /**
   * Destroy the feedback panel
   */
  destroy() {
    if (this.container) {
      this.container.destroy();
    }
  }
}
