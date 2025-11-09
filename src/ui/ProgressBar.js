/**
 * ProgressBar.js
 * Visual level progress indicator for 2nd graders
 * Shows progress through questions with colorful, animated bar
 */

export default class ProgressBar {
  /**
   * Create a ProgressBar
   * @param {Phaser.Scene} scene - The scene this progress bar belongs to
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} maxProgress - Maximum progress value (e.g., 5 for 5 questions)
   */
  constructor(scene, x, y, maxProgress = 5) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.maxProgress = maxProgress;
    this.currentProgress = 0;
    this.container = null;

    // Styling constants
    this.BAR_WIDTH = 400;
    this.BAR_HEIGHT = 40;
    this.BG_COLOR = 0xE0E0E0; // Light gray
    this.FILL_COLOR = 0x4CAF50; // Green
    this.CHECKPOINT_COLOR = 0xFFD700; // Gold
    this.BORDER_COLOR = 0x333333;

    this.create();
  }

  /**
   * Create the progress bar UI
   */
  create() {
    // Create container for all elements
    this.container = this.scene.add.container(this.x, this.y);

    // Create background bar
    this.backgroundBar = this.scene.add.rectangle(
      0,
      0,
      this.BAR_WIDTH,
      this.BAR_HEIGHT,
      this.BG_COLOR
    );
    this.backgroundBar.setStrokeStyle(4, this.BORDER_COLOR);

    // Create fill bar (starts at 0 width)
    this.fillBar = this.scene.add.rectangle(
      -this.BAR_WIDTH / 2,
      0,
      0,
      this.BAR_HEIGHT - 8,
      this.FILL_COLOR
    );
    this.fillBar.setOrigin(0, 0.5);

    // Create checkpoints/milestones
    this.createCheckpoints();

    // Create progress text
    this.progressText = this.scene.add.text(0, 0, '0 / ' + this.maxProgress, {
      fontSize: '24px',
      fontFamily: 'Comic Sans MS, Comic Neue, cursive',
      color: '#FFFFFF',
      fontStyle: 'bold',
      stroke: '#333333',
      strokeThickness: 4
    });
    this.progressText.setOrigin(0.5);

    this.container.add(this.backgroundBar);
    this.container.add(this.fillBar);
    this.container.add(this.progressText);
  }

  /**
   * Create checkpoint markers along the progress bar
   */
  createCheckpoints() {
    this.checkpoints = [];

    for (let i = 1; i <= this.maxProgress; i++) {
      const xPos = -this.BAR_WIDTH / 2 + (i / this.maxProgress) * this.BAR_WIDTH;

      // Checkpoint circle
      const checkpoint = this.scene.add.circle(
        xPos,
        0,
        12,
        this.BG_COLOR
      );
      checkpoint.setStrokeStyle(3, this.BORDER_COLOR);
      checkpoint.setData('completed', false);
      checkpoint.setData('index', i);

      // Number label above checkpoint
      const label = this.scene.add.text(xPos, -30, i.toString(), {
        fontSize: '18px',
        fontFamily: 'Comic Sans MS, Comic Neue, cursive',
        color: '#333333',
        fontStyle: 'bold'
      });
      label.setOrigin(0.5);

      this.checkpoints.push({ circle: checkpoint, label: label });
      this.container.add(checkpoint);
      this.container.add(label);
    }
  }

  /**
   * Update progress to a new value
   * @param {number} current - Current progress value
   */
  updateProgress(current) {
    const oldProgress = this.currentProgress;
    this.currentProgress = Math.min(current, this.maxProgress);

    // Update fill bar with animation
    const targetWidth = (this.currentProgress / this.maxProgress) * (this.BAR_WIDTH - 8);

    this.scene.tweens.add({
      targets: this.fillBar,
      width: targetWidth,
      duration: 500,
      ease: 'Power2'
    });

    // Update progress text
    this.progressText.setText(this.currentProgress + ' / ' + this.maxProgress);

    // Animate completed checkpoints
    for (let i = oldProgress; i < this.currentProgress; i++) {
      if (i < this.checkpoints.length) {
        this.completeCheckpoint(i);
      }
    }

    // Pulse effect on progress increase
    if (current > oldProgress) {
      this.pulseEffect();
    }
  }

  /**
   * Mark a checkpoint as completed
   * @param {number} index - Checkpoint index (0-based)
   */
  completeCheckpoint(index) {
    if (index >= this.checkpoints.length) return;

    const checkpoint = this.checkpoints[index];

    // Change color to gold
    checkpoint.circle.setFillStyle(this.CHECKPOINT_COLOR);
    checkpoint.circle.setData('completed', true);

    // Animate completion
    this.scene.tweens.add({
      targets: checkpoint.circle,
      scale: 1.5,
      duration: 200,
      yoyo: true,
      ease: 'Back.easeOut'
    });

    // Particle burst effect
    this.createCheckpointParticles(checkpoint.circle.x, checkpoint.circle.y);

    // Play sound if available
    if (this.scene.audioManager) {
      this.scene.audioManager.playSound('checkpoint', 0.3);
    }
  }

  /**
   * Create particle effect for checkpoint completion
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  createCheckpointParticles(x, y) {
    const particleCount = 8;

    for (let i = 0; i < particleCount; i++) {
      const particle = this.scene.add.star(
        x,
        y,
        5,
        5,
        10,
        this.CHECKPOINT_COLOR
      );
      particle.setStrokeStyle(1, 0x333333);

      const angle = (Math.PI * 2 * i) / particleCount;
      const distance = 30 + Math.random() * 20;

      this.scene.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        alpha: 0,
        rotation: Math.PI * 2,
        duration: 600,
        ease: 'Power2',
        onComplete: () => particle.destroy()
      });
    }
  }

  /**
   * Pulse animation effect
   */
  pulseEffect() {
    this.scene.tweens.add({
      targets: this.container,
      scale: 1.05,
      duration: 150,
      yoyo: true,
      ease: 'Sine.easeInOut'
    });
  }

  /**
   * Set maximum progress value
   * @param {number} max - New maximum value
   */
  setMaxProgress(max) {
    this.maxProgress = max;

    // Recreate checkpoints with new max
    this.checkpoints.forEach(cp => {
      cp.circle.destroy();
      cp.label.destroy();
    });
    this.checkpoints = [];
    this.createCheckpoints();

    // Reset progress
    this.updateProgress(this.currentProgress);
  }

  /**
   * Fill to a specific percentage
   * @param {number} percentage - Percentage to fill (0-100)
   */
  fill(percentage) {
    const progress = (percentage / 100) * this.maxProgress;
    this.updateProgress(Math.round(progress));
  }

  /**
   * Reset progress to zero
   */
  reset() {
    this.currentProgress = 0;
    this.fillBar.width = 0;
    this.progressText.setText('0 / ' + this.maxProgress);

    // Reset all checkpoints
    this.checkpoints.forEach(cp => {
      cp.circle.setFillStyle(this.BG_COLOR);
      cp.circle.setData('completed', false);
      cp.circle.setScale(1);
    });
  }

  /**
   * Complete the progress bar (celebrate)
   */
  complete() {
    this.updateProgress(this.maxProgress);

    // Rainbow effect on completion
    this.scene.tweens.add({
      targets: this.fillBar,
      alpha: 0.8,
      duration: 200,
      yoyo: true,
      repeat: 3
    });

    // Create celebration particles
    this.createCelebrationEffect();
  }

  /**
   * Create celebration effect for completion
   */
  createCelebrationEffect() {
    const colors = [0xFF6B6B, 0x4ECDC4, 0x45B7D1, 0xFFA07A, 0x98D8C8];
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const particle = this.scene.add.circle(
        0,
        0,
        3 + Math.random() * 4,
        color
      );

      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
      const distance = 50 + Math.random() * 100;
      const duration = 800 + Math.random() * 400;

      this.scene.tweens.add({
        targets: particle,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 50,
        alpha: 0,
        duration: duration,
        ease: 'Power2',
        onComplete: () => particle.destroy()
      });
    }
  }

  /**
   * Get current progress value
   * @returns {number} Current progress
   */
  getCurrentProgress() {
    return this.currentProgress;
  }

  /**
   * Get progress percentage
   * @returns {number} Progress as percentage (0-100)
   */
  getPercentage() {
    return (this.currentProgress / this.maxProgress) * 100;
  }

  /**
   * Hide the progress bar
   */
  hide() {
    this.scene.tweens.add({
      targets: this.container,
      alpha: 0,
      duration: 300,
      ease: 'Power2'
    });
  }

  /**
   * Show the progress bar
   */
  show() {
    this.scene.tweens.add({
      targets: this.container,
      alpha: 1,
      duration: 300,
      ease: 'Power2'
    });
  }

  /**
   * Destroy the progress bar
   */
  destroy() {
    if (this.container) {
      this.container.destroy();
    }
  }
}
