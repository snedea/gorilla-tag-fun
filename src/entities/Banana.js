/**
 * Banana.js
 * Collectible banana objects for Gorilla Tag Fun Math Game
 *
 * Purpose: Manages collectible banana sprites
 * Features:
 * - Render banana sprite at specified position
 * - Handle collection detection and animation
 * - Track collected state
 * - Particle effects on collection
 */

export default class Banana extends Phaser.GameObjects.Sprite {
  /**
   * Create a Banana collectible
   * @param {Phaser.Scene} scene - The scene this banana belongs to
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} value - Point value of banana (default: 10)
   */
  constructor(scene, x, y, value = 10) {
    // Use banana sprite key
    super(scene, x, y, 'banana');

    // Add to scene
    scene.add.existing(this);

    // Enable physics for collision detection
    scene.physics.add.existing(this);

    // Set origin to center
    this.setOrigin(0.5, 0.5);

    // Set scale
    this.setScale(0.8);

    // Store reference to scene
    this.gameScene = scene;

    // Banana properties
    this.pointValue = value;
    this.collected = false;

    // Create idle animation (gentle bob/rotation)
    this.createIdleAnimation();

    // Start idle animation
    this.startIdleAnimation();
  }

  /**
   * Create gentle bobbing/rotating animation for uncollected banana
   */
  createIdleAnimation() {
    // Gentle floating animation
    this.gameScene.tweens.add({
      targets: this,
      y: this.y - 10,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Gentle rotation
    this.gameScene.tweens.add({
      targets: this,
      angle: { from: -5, to: 5 },
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  /**
   * Start the idle animation
   */
  startIdleAnimation() {
    // Animation is created in constructor and runs automatically
    this.setVisible(true);
    this.setAlpha(1);
  }

  /**
   * Collect the banana with animation
   * @param {Function} onComplete - Callback when collection animation completes
   */
  collect(onComplete = null) {
    if (this.collected) {
      return;
    }

    this.collected = true;

    // Stop idle animations
    this.gameScene.tweens.killTweensOf(this);

    // Play collection sound if audio manager is available
    if (this.gameScene.sound) {
      this.gameScene.sound.play('banana-collect', { volume: 0.5 });
    }

    // Create particle burst effect
    this.createCollectionParticles();

    // Animate banana flying up and fading out
    this.gameScene.tweens.add({
      targets: this,
      y: this.y - 100,
      alpha: 0,
      scale: this.scale * 1.5,
      duration: 500,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        if (onComplete) {
          onComplete(this.pointValue);
        }
        this.destroy();
      }
    });
  }

  /**
   * Create particle effect when banana is collected
   */
  createCollectionParticles() {
    // Create sparkle particles
    const particles = this.gameScene.add.particles(this.x, this.y, 'particle', {
      speed: { min: 50, max: 150 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 600,
      quantity: 10,
      blendMode: 'ADD',
      tint: 0xFFD700 // Golden color
    });

    // Auto-destroy particle emitter after animation
    this.gameScene.time.delayedCall(800, () => {
      particles.destroy();
    });
  }

  /**
   * Check if banana has been collected
   * @returns {boolean} True if collected
   */
  isCollected() {
    return this.collected;
  }

  /**
   * Get point value of banana
   * @returns {number} Point value
   */
  getValue() {
    return this.pointValue;
  }

  /**
   * Reset banana to uncollected state
   */
  reset() {
    this.collected = false;
    this.setVisible(true);
    this.setAlpha(1);
    this.setScale(0.8);
    this.angle = 0;

    // Restart idle animation
    this.startIdleAnimation();
  }

  /**
   * Check if gorilla is overlapping with banana
   * @param {Gorilla} gorilla - Gorilla sprite to check collision with
   * @returns {boolean} True if overlapping
   */
  checkCollision(gorilla) {
    if (this.collected) {
      return false;
    }

    // Use Phaser's built-in overlap detection
    const bounds = this.getBounds();
    const gorillaBounds = gorilla.getBounds();

    return Phaser.Geom.Intersects.RectangleToRectangle(bounds, gorillaBounds);
  }

  /**
   * Update method called each frame
   * @param {number} time - Current game time
   * @param {number} delta - Time since last update
   */
  update(time, delta) {
    // Override if needed for per-frame collision detection
    // Currently handled by events
  }

  /**
   * Clean up when destroying the banana
   */
  destroy(fromScene) {
    // Stop any tweens
    this.gameScene.tweens.killTweensOf(this);

    // Call parent destroy
    super.destroy(fromScene);
  }
}

/**
 * Helper function to create multiple bananas along a path
 * @param {Phaser.Scene} scene - Scene to add bananas to
 * @param {number} startX - Starting X position
 * @param {number} y - Y position for all bananas
 * @param {number} count - Number of bananas to create
 * @param {number} spacing - Spacing between bananas
 * @returns {Array<Banana>} Array of created banana objects
 */
export function createBananaPath(scene, startX, y, count = 5, spacing = 150) {
  const bananas = [];

  for (let i = 0; i < count; i++) {
    const x = startX + (i * spacing);
    const banana = new Banana(scene, x, y);
    bananas.push(banana);
  }

  return bananas;
}

/**
 * Helper function to create bananas in a random pattern
 * @param {Phaser.Scene} scene - Scene to add bananas to
 * @param {number} minX - Minimum X position
 * @param {number} maxX - Maximum X position
 * @param {number} minY - Minimum Y position
 * @param {number} maxY - Maximum Y position
 * @param {number} count - Number of bananas to create
 * @returns {Array<Banana>} Array of created banana objects
 */
export function createRandomBananas(scene, minX, maxX, minY, maxY, count = 5) {
  const bananas = [];

  for (let i = 0; i < count; i++) {
    const x = Phaser.Math.Between(minX, maxX);
    const y = Phaser.Math.Between(minY, maxY);
    const banana = new Banana(scene, x, y);
    bananas.push(banana);
  }

  return bananas;
}
