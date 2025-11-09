/**
 * AnimationController.js
 * Manages all game animations including sprite animations, transitions, and particle effects
 */

export default class AnimationController {
  constructor(scene) {
    this.scene = scene;
    this.animationQueue = [];
    this.isAnimating = false;
    this.currentAnimation = null;
  }

  /**
   * Initialize the animation controller and create sprite animations
   */
  initialize() {
    this.createGorillaAnimations();
    this.createParticleEffects();
  }

  /**
   * Create gorilla sprite animations
   */
  createGorillaAnimations() {
    // Idle animation
    if (!this.scene.anims.exists('gorilla-idle')) {
      this.scene.anims.create({
        key: 'gorilla-idle',
        frames: this.scene.anims.generateFrameNumbers('gorilla-idle', {
          start: 0,
          end: 3
        }),
        frameRate: 6,
        repeat: -1
      });
    }

    // Swinging animation
    if (!this.scene.anims.exists('gorilla-swing')) {
      this.scene.anims.create({
        key: 'gorilla-swing',
        frames: this.scene.anims.generateFrameNumbers('gorilla-swing', {
          start: 0,
          end: 5
        }),
        frameRate: 12,
        repeat: 0
      });
    }

    // Celebration animation
    if (!this.scene.anims.exists('gorilla-celebrate')) {
      this.scene.anims.create({
        key: 'gorilla-celebrate',
        frames: this.scene.anims.generateFrameNumbers('gorilla-celebrate', {
          start: 0,
          end: 7
        }),
        frameRate: 10,
        repeat: 1
      });
    }

    // Thinking animation
    if (!this.scene.anims.exists('gorilla-thinking')) {
      this.scene.anims.create({
        key: 'gorilla-thinking',
        frames: this.scene.anims.generateFrameNumbers('gorilla-thinking', {
          start: 0,
          end: 3
        }),
        frameRate: 4,
        repeat: -1
      });
    }
  }

  /**
   * Play gorilla idle animation
   * @param {Phaser.GameObjects.Sprite} gorilla - The gorilla sprite
   */
  playGorillaIdle(gorilla) {
    if (gorilla && gorilla.anims) {
      gorilla.play('gorilla-idle');
      this.currentAnimation = 'idle';
    }
  }

  /**
   * Play gorilla swinging animation
   * @param {Phaser.GameObjects.Sprite} gorilla - The gorilla sprite
   * @param {Function} onComplete - Callback when animation completes
   */
  playGorillaSwing(gorilla, onComplete) {
    if (gorilla && gorilla.anims) {
      gorilla.play('gorilla-swing');
      this.currentAnimation = 'swing';

      gorilla.once('animationcomplete', () => {
        if (onComplete) {
          onComplete();
        }
      });
    }
  }

  /**
   * Play gorilla celebration animation
   * @param {Phaser.GameObjects.Sprite} gorilla - The gorilla sprite
   * @param {Function} onComplete - Callback when animation completes
   */
  playGorillaCelebrate(gorilla, onComplete) {
    if (gorilla && gorilla.anims) {
      gorilla.play('gorilla-celebrate');
      this.currentAnimation = 'celebrate';

      gorilla.once('animationcomplete', () => {
        if (onComplete) {
          onComplete();
        }
      });
    }
  }

  /**
   * Play gorilla thinking animation
   * @param {Phaser.GameObjects.Sprite} gorilla - The gorilla sprite
   */
  playGorillaThinking(gorilla) {
    if (gorilla && gorilla.anims) {
      gorilla.play('gorilla-thinking');
      this.currentAnimation = 'thinking';
    }
  }

  /**
   * Animate vine swinging with physics-based motion
   * @param {Phaser.GameObjects.Sprite} vine - The vine sprite
   * @param {number} duration - Duration in milliseconds
   * @param {Function} onComplete - Callback when animation completes
   */
  animateVineSwing(vine, duration = 1000, onComplete) {
    if (!vine) return;

    this.scene.tweens.add({
      targets: vine,
      angle: { from: -15, to: 15 },
      duration: duration / 2,
      yoyo: true,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        if (onComplete) {
          onComplete();
        }
      }
    });
  }

  /**
   * Animate banana collection with scale and fade
   * @param {Phaser.GameObjects.Sprite} banana - The banana sprite
   * @param {Function} onComplete - Callback when animation completes
   */
  animateBananaCollect(banana, onComplete) {
    if (!banana) return;

    // Scale up and fade out
    this.scene.tweens.add({
      targets: banana,
      scale: { from: 1, to: 1.5 },
      alpha: { from: 1, to: 0 },
      y: banana.y - 50,
      duration: 500,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        banana.destroy();
        if (onComplete) {
          onComplete();
        }
      }
    });

    // Create sparkle effect at banana position
    this.createParticleEffect('bananaCollect', banana.x, banana.y);
  }

  /**
   * Create particle effects system
   */
  createParticleEffects() {
    // Store particle configurations
    this.particleConfigs = {
      bananaCollect: {
        speed: { min: 50, max: 150 },
        scale: { start: 0.6, end: 0 },
        alpha: { start: 1, end: 0 },
        lifespan: 600,
        frequency: -1,
        quantity: 10,
        blendMode: 'ADD'
      },
      correctAnswer: {
        speed: { min: 30, max: 100 },
        scale: { start: 0.8, end: 0 },
        alpha: { start: 1, end: 0 },
        lifespan: 800,
        frequency: -1,
        quantity: 20,
        blendMode: 'ADD'
      },
      celebration: {
        speed: { min: 100, max: 300 },
        scale: { start: 1, end: 0 },
        alpha: { start: 1, end: 0 },
        lifespan: 2000,
        frequency: -1,
        quantity: 50,
        blendMode: 'NORMAL',
        gravityY: 200
      }
    };
  }

  /**
   * Create and emit a particle effect
   * @param {string} effectType - Type of particle effect
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  createParticleEffect(effectType, x, y) {
    const config = this.particleConfigs[effectType];
    if (!config) return;

    // Create a simple graphics object as particle if texture doesn't exist
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0xFFD700, 1);
    graphics.fillCircle(4, 4, 4);
    graphics.generateTexture('particle-' + effectType, 8, 8);
    graphics.destroy();

    // Create particle emitter
    const particles = this.scene.add.particles('particle-' + effectType);
    const emitter = particles.createEmitter({
      ...config,
      x: x,
      y: y
    });

    // Emit particles once
    emitter.explode();

    // Clean up after lifespan
    this.scene.time.delayedCall(config.lifespan + 100, () => {
      particles.destroy();
    });
  }

  /**
   * Queue an animation to be played sequentially
   * @param {Function} animationFn - Animation function to queue
   */
  queueAnimation(animationFn) {
    this.animationQueue.push(animationFn);

    if (!this.isAnimating) {
      this.processAnimationQueue();
    }
  }

  /**
   * Process the animation queue sequentially
   */
  processAnimationQueue() {
    if (this.animationQueue.length === 0) {
      this.isAnimating = false;
      return;
    }

    this.isAnimating = true;
    const nextAnimation = this.animationQueue.shift();

    // Execute animation with callback to continue queue
    nextAnimation(() => {
      this.processAnimationQueue();
    });
  }

  /**
   * Tween an object to a new position
   * @param {Phaser.GameObjects.GameObject} target - Target object to animate
   * @param {number} x - Target X position
   * @param {number} y - Target Y position
   * @param {number} duration - Duration in milliseconds
   * @param {Function} onComplete - Callback when tween completes
   */
  tweenTo(target, x, y, duration = 1000, onComplete) {
    this.scene.tweens.add({
      targets: target,
      x: x,
      y: y,
      duration: duration,
      ease: 'Cubic.easeInOut',
      onComplete: () => {
        if (onComplete) {
          onComplete();
        }
      }
    });
  }

  /**
   * Fade in an object
   * @param {Phaser.GameObjects.GameObject} target - Target object to fade in
   * @param {number} duration - Duration in milliseconds
   * @param {Function} onComplete - Callback when fade completes
   */
  fadeIn(target, duration = 500, onComplete) {
    target.alpha = 0;
    this.scene.tweens.add({
      targets: target,
      alpha: 1,
      duration: duration,
      ease: 'Linear',
      onComplete: () => {
        if (onComplete) {
          onComplete();
        }
      }
    });
  }

  /**
   * Fade out an object
   * @param {Phaser.GameObjects.GameObject} target - Target object to fade out
   * @param {number} duration - Duration in milliseconds
   * @param {Function} onComplete - Callback when fade completes
   */
  fadeOut(target, duration = 500, onComplete) {
    this.scene.tweens.add({
      targets: target,
      alpha: 0,
      duration: duration,
      ease: 'Linear',
      onComplete: () => {
        if (onComplete) {
          onComplete();
        }
      }
    });
  }

  /**
   * Shake an object (useful for incorrect answer feedback)
   * @param {Phaser.GameObjects.GameObject} target - Target object to shake
   * @param {number} intensity - Shake intensity
   * @param {number} duration - Duration in milliseconds
   */
  shake(target, intensity = 10, duration = 300) {
    const originalX = target.x;

    this.scene.tweens.add({
      targets: target,
      x: originalX + intensity,
      duration: duration / 6,
      yoyo: true,
      repeat: 2,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        target.x = originalX;
      }
    });
  }

  /**
   * Pulse an object (scale up and down)
   * @param {Phaser.GameObjects.GameObject} target - Target object to pulse
   * @param {number} scale - Max scale value
   * @param {number} duration - Duration in milliseconds
   */
  pulse(target, scale = 1.2, duration = 500) {
    this.scene.tweens.add({
      targets: target,
      scale: scale,
      duration: duration / 2,
      yoyo: true,
      ease: 'Sine.easeInOut'
    });
  }

  /**
   * Clear all queued animations
   */
  clearQueue() {
    this.animationQueue = [];
    this.isAnimating = false;
  }

  /**
   * Stop all tweens for a target
   * @param {Phaser.GameObjects.GameObject} target - Target object
   */
  stopTweens(target) {
    this.scene.tweens.killTweensOf(target);
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.clearQueue();
    this.scene = null;
    this.particleConfigs = null;
  }
}
