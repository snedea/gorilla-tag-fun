/**
 * Vine.js
 * Swinging vine visual element for Gorilla Tag Fun Math Game
 *
 * Purpose: Manages vine sprites that gorilla swings on
 * Features:
 * - Physics-based swinging motion
 * - Attach/detach from gorilla
 * - Realistic pendulum animation
 * - Visual rope/vine rendering
 */

export default class Vine extends Phaser.GameObjects.Container {
  /**
   * Create a Vine object
   * @param {Phaser.Scene} scene - The scene this vine belongs to
   * @param {number} x - X position (attachment point at top)
   * @param {number} y - Y position (attachment point at top)
   * @param {number} length - Length of vine in pixels (default: 200)
   */
  constructor(scene, x, y, length = 200) {
    super(scene, x, y);

    // Add to scene
    scene.add.existing(this);

    // Store reference to scene
    this.gameScene = scene;

    // Vine properties
    this.vineLength = length;
    this.attachmentX = x;
    this.attachmentY = y;
    this.isSwinging = false;
    this.attachedGorilla = null;

    // Swing physics properties
    this.swingAngle = 0; // Current swing angle in radians
    this.swingVelocity = 0; // Angular velocity
    this.swingAmplitude = 0.5; // Max swing angle (radians)
    this.damping = 0.98; // Damping factor for realistic swing

    // Create vine visual components
    this.createVineVisuals();

    // Start position for vine end
    this.vineEndX = 0;
    this.vineEndY = this.vineLength;

    this.updateVinePosition();
  }

  /**
   * Create visual representation of the vine
   */
  createVineVisuals() {
    // Create rope/vine using graphics
    this.vineGraphics = this.gameScene.add.graphics();
    this.add(this.vineGraphics);

    // Create vine leaf sprite at attachment point
    this.vineLeaf = this.gameScene.add.sprite(0, 0, 'vine');
    this.vineLeaf.setOrigin(0.5, 0);
    this.vineLeaf.setScale(0.5);
    this.add(this.vineLeaf);

    // Create optional swinging object at bottom (decorative)
    this.endPoint = this.gameScene.add.circle(0, this.vineLength, 8, 0x8B4513);
    this.add(this.endPoint);
  }

  /**
   * Draw the vine rope
   */
  drawVine() {
    this.vineGraphics.clear();

    // Calculate vine end position based on swing angle
    this.vineEndX = Math.sin(this.swingAngle) * this.vineLength;
    this.vineEndY = Math.cos(this.swingAngle) * this.vineLength;

    // Draw vine as a curved rope
    this.vineGraphics.lineStyle(4, 0x654321, 1);

    // Create a bezier curve for more realistic rope appearance
    const curve = new Phaser.Curves.QuadraticBezier(
      new Phaser.Math.Vector2(0, 0),
      new Phaser.Math.Vector2(this.vineEndX * 0.5, this.vineEndY * 0.3),
      new Phaser.Math.Vector2(this.vineEndX, this.vineEndY)
    );

    curve.draw(this.vineGraphics, 32);

    // Update end point position
    this.endPoint.setPosition(this.vineEndX, this.vineEndY);
  }

  /**
   * Update vine position based on current physics
   */
  updateVinePosition() {
    this.drawVine();

    // If gorilla is attached, update its position
    if (this.attachedGorilla) {
      const worldX = this.x + this.vineEndX;
      const worldY = this.y + this.vineEndY;
      this.attachedGorilla.setPosition(worldX, worldY);
    }
  }

  /**
   * Start swinging animation
   * @param {number} duration - Duration of swing in milliseconds (default: 1000)
   * @param {Function} onComplete - Callback when swing completes
   */
  swing(duration = 1000, onComplete = null) {
    if (this.isSwinging) {
      return;
    }

    this.isSwinging = true;

    // Reset swing parameters
    this.swingAngle = -this.swingAmplitude; // Start at max left
    this.swingVelocity = 0;

    // Play swing sound if available
    if (this.gameScene.sound) {
      this.gameScene.sound.play('swing', { volume: 0.4 });
    }

    // Create physics-based swing animation
    const swingTime = this.gameScene.time.addEvent({
      delay: 16, // ~60 FPS
      callback: () => {
        // Simple pendulum physics
        const gravity = 0.003;
        const acceleration = -gravity * Math.sin(this.swingAngle);

        this.swingVelocity += acceleration;
        this.swingAngle += this.swingVelocity;
        this.swingVelocity *= this.damping; // Apply damping

        // Update visuals
        this.updateVinePosition();
      },
      callbackScope: this,
      loop: true
    });

    // Stop after duration
    this.gameScene.time.delayedCall(duration, () => {
      swingTime.remove();
      this.isSwinging = false;

      // Return to resting position
      this.returnToRest(() => {
        if (onComplete) {
          onComplete();
        }
      });
    });
  }

  /**
   * Return vine to resting vertical position
   * @param {Function} onComplete - Callback when complete
   */
  returnToRest(onComplete = null) {
    this.gameScene.tweens.addCounter({
      from: this.swingAngle,
      to: 0,
      duration: 500,
      ease: 'Sine.easeInOut',
      onUpdate: (tween) => {
        this.swingAngle = tween.getValue();
        this.updateVinePosition();
      },
      onComplete: () => {
        this.swingAngle = 0;
        this.swingVelocity = 0;
        this.updateVinePosition();

        if (onComplete) {
          onComplete();
        }
      }
    });
  }

  /**
   * Attach gorilla to vine
   * @param {Gorilla} gorilla - Gorilla sprite to attach
   */
  attach(gorilla) {
    if (this.attachedGorilla) {
      console.warn('Gorilla already attached to vine');
      return;
    }

    this.attachedGorilla = gorilla;

    // Position gorilla at vine end
    const worldX = this.x + this.vineEndX;
    const worldY = this.y + this.vineEndY;
    gorilla.setPosition(worldX, worldY);

    // Set gorilla to swinging state
    if (gorilla.setState) {
      gorilla.setState('swinging');
    }
  }

  /**
   * Detach gorilla from vine
   * @returns {Gorilla|null} The detached gorilla
   */
  detach() {
    const gorilla = this.attachedGorilla;

    if (gorilla) {
      // Return gorilla to idle state
      if (gorilla.setState) {
        gorilla.setState('idle');
      }

      this.attachedGorilla = null;
    }

    return gorilla;
  }

  /**
   * Get the current end point position in world coordinates
   * @returns {Object} Object with x and y coordinates
   */
  getEndPoint() {
    return {
      x: this.x + this.vineEndX,
      y: this.y + this.vineEndY
    };
  }

  /**
   * Set swing amplitude (how far it swings)
   * @param {number} amplitude - Amplitude in radians (default: 0.5)
   */
  setSwingAmplitude(amplitude) {
    this.swingAmplitude = amplitude;
  }

  /**
   * Update method called each frame
   * @param {number} time - Current game time
   * @param {number} delta - Time since last update
   */
  update(time, delta) {
    // Update is handled by tween and time events
    // Override if needed for custom per-frame logic
  }

  /**
   * Clean up when destroying the vine
   */
  destroy(fromScene) {
    // Detach any attached gorilla
    this.detach();

    // Stop any tweens
    this.gameScene.tweens.killTweensOf(this);

    // Clear graphics
    if (this.vineGraphics) {
      this.vineGraphics.clear();
    }

    // Call parent destroy
    super.destroy(fromScene);
  }
}

/**
 * Helper function to create multiple vines in a row
 * @param {Phaser.Scene} scene - Scene to add vines to
 * @param {number} startX - Starting X position
 * @param {number} y - Y position for all vines
 * @param {number} count - Number of vines to create
 * @param {number} spacing - Spacing between vines
 * @param {number} length - Length of each vine
 * @returns {Array<Vine>} Array of created vine objects
 */
export function createVinePath(scene, startX, y, count = 5, spacing = 200, length = 200) {
  const vines = [];

  for (let i = 0; i < count; i++) {
    const x = startX + (i * spacing);
    const vine = new Vine(scene, x, y, length);
    vines.push(vine);
  }

  return vines;
}

/**
 * Helper function to create vines at specific positions
 * @param {Phaser.Scene} scene - Scene to add vines to
 * @param {Array<Object>} positions - Array of {x, y, length} objects
 * @returns {Array<Vine>} Array of created vine objects
 */
export function createVinesAtPositions(scene, positions) {
  const vines = [];

  positions.forEach(pos => {
    const vine = new Vine(scene, pos.x, pos.y, pos.length || 200);
    vines.push(vine);
  });

  return vines;
}
