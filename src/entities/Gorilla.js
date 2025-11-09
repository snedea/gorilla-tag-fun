/**
 * Gorilla.js
 * Main player character sprite and behavior for Gorilla Tag Fun Math Game
 *
 * Purpose: Manages the gorilla character sprite, animations, position, and state
 * Features:
 * - Multiple animation states (idle, swinging, celebrating, thinking)
 * - Position management and smooth movement
 * - Collision detection support
 * - State machine for behavior control
 */

export default class Gorilla extends Phaser.GameObjects.Sprite {
  /**
   * Create a Gorilla character
   * @param {Phaser.Scene} scene - The scene this gorilla belongs to
   * @param {number} x - Initial x position
   * @param {number} y - Initial y position
   */
  constructor(scene, x, y) {
    // For now, use a placeholder key - will be updated when sprites are loaded
    super(scene, x, y, 'gorilla-idle');

    // Add to scene
    scene.add.existing(this);

    // Enable physics if needed
    scene.physics.add.existing(this);

    // Set origin to center
    this.setOrigin(0.5, 0.5);

    // Set initial scale
    this.setScale(1.5);

    // Initialize state
    this.currentState = 'idle';
    this.currentAnimation = null;

    // Store reference to scene
    this.gameScene = scene;

    // Position tracking
    this.targetX = x;
    this.targetY = y;
    this.isMoving = false;

    // Create animations
    this.createAnimations();

    // Start with idle animation
    this.setState('idle');
  }

  /**
   * Create all sprite animations for the gorilla
   */
  createAnimations() {
    const scene = this.gameScene;

    // Check if animations already exist to avoid duplicates
    if (!scene.anims.exists('gorilla-idle-anim')) {
      // Idle animation (4 frames)
      scene.anims.create({
        key: 'gorilla-idle-anim',
        frames: scene.anims.generateFrameNumbers('gorilla-idle', { start: 0, end: 3 }),
        frameRate: 4,
        repeat: -1
      });
    }

    if (!scene.anims.exists('gorilla-swing-anim')) {
      // Swinging animation (6 frames)
      scene.anims.create({
        key: 'gorilla-swing-anim',
        frames: scene.anims.generateFrameNumbers('gorilla-swing', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: 0
      });
    }

    if (!scene.anims.exists('gorilla-celebrate-anim')) {
      // Celebration animation (8 frames)
      scene.anims.create({
        key: 'gorilla-celebrate-anim',
        frames: scene.anims.generateFrameNumbers('gorilla-celebrate', { start: 0, end: 7 }),
        frameRate: 12,
        repeat: 2
      });
    }

    if (!scene.anims.exists('gorilla-thinking-anim')) {
      // Thinking animation (4 frames)
      scene.anims.create({
        key: 'gorilla-thinking-anim',
        frames: scene.anims.generateFrameNumbers('gorilla-thinking', { start: 0, end: 3 }),
        frameRate: 3,
        repeat: -1
      });
    }
  }

  /**
   * Play a specific animation
   * @param {string} animationName - Name of the animation to play
   * @param {boolean} ignoreIfPlaying - If true, won't restart if already playing
   */
  playAnimation(animationName, ignoreIfPlaying = false) {
    const animKey = `gorilla-${animationName}-anim`;

    if (this.gameScene.anims.exists(animKey)) {
      this.play(animKey, ignoreIfPlaying);
      this.currentAnimation = animationName;
    } else {
      console.warn(`Animation ${animKey} does not exist`);
    }
  }

  /**
   * Set the gorilla's state and play corresponding animation
   * @param {string} state - One of: 'idle', 'swinging', 'celebrating', 'thinking'
   */
  setState(state) {
    if (this.currentState === state) {
      return;
    }

    this.currentState = state;

    switch (state) {
      case 'idle':
        this.playAnimation('idle');
        break;
      case 'swinging':
        this.playAnimation('swing');
        break;
      case 'celebrating':
        this.playAnimation('celebrate');
        break;
      case 'thinking':
        this.playAnimation('thinking');
        break;
      default:
        console.warn(`Unknown gorilla state: ${state}`);
    }
  }

  /**
   * Get current state
   * @returns {string} Current state
   */
  getState() {
    return this.currentState;
  }

  /**
   * Move gorilla forward by a specified distance with smooth animation
   * @param {number} distance - Distance to move in pixels
   * @param {number} duration - Duration of movement in milliseconds (default: 1000)
   * @param {Function} onComplete - Callback when movement completes
   */
  moveForward(distance = 100, duration = 1000, onComplete = null) {
    if (this.isMoving) {
      console.warn('Gorilla is already moving');
      return;
    }

    this.isMoving = true;
    this.targetX = this.x + distance;

    // Set swinging state
    this.setState('swinging');

    // Create smooth movement tween
    this.gameScene.tweens.add({
      targets: this,
      x: this.targetX,
      duration: duration,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.isMoving = false;
        this.setState('idle');

        if (onComplete) {
          onComplete();
        }
      }
    });
  }

  /**
   * Move to a specific position
   * @param {number} x - Target x position
   * @param {number} y - Target y position
   * @param {number} duration - Duration of movement in milliseconds
   * @param {Function} onComplete - Callback when movement completes
   */
  moveTo(x, y, duration = 1000, onComplete = null) {
    if (this.isMoving) {
      console.warn('Gorilla is already moving');
      return;
    }

    this.isMoving = true;
    this.targetX = x;
    this.targetY = y;

    this.setState('swinging');

    this.gameScene.tweens.add({
      targets: this,
      x: this.targetX,
      y: this.targetY,
      duration: duration,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.isMoving = false;
        this.setState('idle');

        if (onComplete) {
          onComplete();
        }
      }
    });
  }

  /**
   * Play celebration animation
   * @param {Function} onComplete - Callback when celebration completes
   */
  celebrate(onComplete = null) {
    this.setState('celebrating');

    // Add a bounce effect
    this.gameScene.tweens.add({
      targets: this,
      y: this.y - 30,
      duration: 300,
      yoyo: true,
      repeat: 2,
      ease: 'Sine.easeInOut'
    });

    // Wait for celebration to complete
    if (onComplete) {
      this.gameScene.time.delayedCall(2000, () => {
        this.setState('idle');
        onComplete();
      });
    }
  }

  /**
   * Think animation (used when waiting for answer)
   */
  think() {
    this.setState('thinking');
  }

  /**
   * Reset gorilla to initial position and state
   * @param {number} x - Initial x position
   * @param {number} y - Initial y position
   */
  reset(x, y) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.isMoving = false;
    this.setState('idle');
  }

  /**
   * Update method called each frame
   * @param {number} time - Current game time
   * @param {number} delta - Time since last update
   */
  update(time, delta) {
    // Override if needed for per-frame logic
    // Currently handled by tweens and animations
  }

  /**
   * Clean up when destroying the gorilla
   */
  destroy(fromScene) {
    // Stop any tweens
    this.gameScene.tweens.killTweensOf(this);

    // Call parent destroy
    super.destroy(fromScene);
  }
}
