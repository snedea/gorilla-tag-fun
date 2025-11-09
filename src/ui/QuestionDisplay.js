/**
 * QuestionDisplay.js
 * Visual presentation of math questions for 2nd graders
 * Large, clear text with optional visual hints
 */

export default class QuestionDisplay {
  /**
   * Create a QuestionDisplay
   * @param {Phaser.Scene} scene - The scene this display belongs to
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.container = null;
    this.questionText = null;
    this.visualHintContainer = null;
    this.currentQuestion = null;

    // Styling constants
    this.PANEL_WIDTH = 600;
    this.PANEL_HEIGHT = 200;
    this.PANEL_COLOR = 0xFFFFFF;
    this.TEXT_COLOR = '#333333';
    this.HINT_SPACING = 40;

    this.create();
  }

  /**
   * Create the question display UI
   */
  create() {
    // Create container for all elements
    this.container = this.scene.add.container(this.x, this.y);

    // Create panel background
    this.createPanel();

    // Create question text
    this.createQuestionText();

    // Create visual hint container (hidden by default)
    this.visualHintContainer = this.scene.add.container(0, this.PANEL_HEIGHT / 2 + 80);
    this.container.add(this.visualHintContainer);
  }

  /**
   * Create the background panel
   */
  createPanel() {
    const panel = this.scene.add.rectangle(
      0,
      0,
      this.PANEL_WIDTH,
      this.PANEL_HEIGHT,
      this.PANEL_COLOR
    );
    panel.setStrokeStyle(5, 0x2196F3); // Blue border

    // Add decorative corners
    const cornerSize = 20;
    const corners = [
      { x: -this.PANEL_WIDTH / 2, y: -this.PANEL_HEIGHT / 2 },
      { x: this.PANEL_WIDTH / 2, y: -this.PANEL_HEIGHT / 2 },
      { x: -this.PANEL_WIDTH / 2, y: this.PANEL_HEIGHT / 2 },
      { x: this.PANEL_WIDTH / 2, y: this.PANEL_HEIGHT / 2 }
    ];

    corners.forEach(corner => {
      const circle = this.scene.add.circle(
        corner.x,
        corner.y,
        cornerSize,
        0xFFD700 // Gold
      );
      circle.setStrokeStyle(3, 0x333333);
      this.container.add(circle);
    });

    this.container.add(panel);
  }

  /**
   * Create the question text element
   */
  createQuestionText() {
    this.questionText = this.scene.add.text(0, 0, '', {
      fontSize: '40px',
      fontFamily: 'Comic Sans MS, Comic Neue, cursive',
      color: this.TEXT_COLOR,
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: this.PANEL_WIDTH - 40 }
    });
    this.questionText.setOrigin(0.5);

    this.container.add(this.questionText);
  }

  /**
   * Set and display a new question
   * @param {Object} questionData - Question data object
   */
  setQuestion(questionData) {
    this.currentQuestion = questionData;

    // Update question text
    this.questionText.setText(questionData.questionText);

    // Hide any existing visual hints
    this.hideVisualHint();

    // Animate question entrance
    this.animateEntrance();
  }

  /**
   * Animate question entrance
   */
  animateEntrance() {
    // Start from above and fade in
    this.container.setAlpha(0);
    this.container.setY(this.y - 50);

    this.scene.tweens.add({
      targets: this.container,
      alpha: 1,
      y: this.y,
      duration: 500,
      ease: 'Back.easeOut'
    });

    // Pulse the question text for emphasis
    this.scene.tweens.add({
      targets: this.questionText,
      scale: 1.1,
      duration: 300,
      yoyo: true,
      ease: 'Sine.easeInOut'
    });
  }

  /**
   * Show visual hint for current question
   */
  showVisualHint() {
    if (!this.currentQuestion || !this.currentQuestion.visualHint) {
      return;
    }

    // Clear any existing hints
    this.hideVisualHint();

    const hintType = this.currentQuestion.hintType || 'bananas';
    const values = this.currentQuestion.values;

    if (hintType === 'bananas') {
      this.createBananaHint(values.a, values.b);
    } else if (hintType === 'blocks') {
      this.createBlockHint(values.a, values.b);
    } else if (hintType === 'number-line') {
      this.createNumberLineHint(values.a, values.b);
    }

    // Animate hint entrance
    this.visualHintContainer.setAlpha(0);
    this.scene.tweens.add({
      targets: this.visualHintContainer,
      alpha: 1,
      duration: 400,
      ease: 'Power2'
    });
  }

  /**
   * Create banana counting visual hint
   * @param {number} a - First value
   * @param {number} b - Second value
   */
  createBananaHint(a, b) {
    const bananaSize = 30;
    const spacing = 10;
    const maxPerRow = 10;

    // Draw first group
    this.drawObjectGroup(
      -150,
      0,
      a,
      0xFFD700, // Banana yellow
      bananaSize,
      spacing,
      maxPerRow
    );

    // Plus sign
    const plusText = this.scene.add.text(0, 0, '+', {
      fontSize: '48px',
      fontFamily: 'Comic Sans MS, Comic Neue, cursive',
      color: '#333333',
      fontStyle: 'bold'
    });
    plusText.setOrigin(0.5);
    this.visualHintContainer.add(plusText);

    // Draw second group
    this.drawObjectGroup(
      150,
      0,
      b,
      0xFFD700,
      bananaSize,
      spacing,
      maxPerRow
    );
  }

  /**
   * Create block counting visual hint
   * @param {number} a - First value
   * @param {number} b - Second value
   */
  createBlockHint(a, b) {
    const blockSize = 25;
    const spacing = 5;
    const maxPerRow = 10;

    this.drawObjectGroup(
      -150,
      0,
      a,
      0x2196F3, // Blue blocks
      blockSize,
      spacing,
      maxPerRow,
      'square'
    );

    const plusText = this.scene.add.text(0, 0, '+', {
      fontSize: '48px',
      fontFamily: 'Comic Sans MS, Comic Neue, cursive',
      color: '#333333',
      fontStyle: 'bold'
    });
    plusText.setOrigin(0.5);
    this.visualHintContainer.add(plusText);

    this.drawObjectGroup(
      150,
      0,
      b,
      0x4CAF50, // Green blocks
      blockSize,
      spacing,
      maxPerRow,
      'square'
    );
  }

  /**
   * Create number line visual hint
   * @param {number} a - First value
   * @param {number} b - Second value
   */
  createNumberLineHint(a, b) {
    const lineWidth = 400;
    const lineY = 0;
    const max = Math.max(a + b, 20);
    const step = lineWidth / max;

    // Draw number line
    const line = this.scene.add.line(
      0,
      lineY,
      -lineWidth / 2,
      0,
      lineWidth / 2,
      0,
      0x333333
    );
    line.setLineWidth(3);
    this.visualHintContainer.add(line);

    // Draw tick marks
    for (let i = 0; i <= max; i += Math.max(1, Math.floor(max / 10))) {
      const x = -lineWidth / 2 + i * step;
      const tick = this.scene.add.line(
        x,
        lineY,
        0,
        -10,
        0,
        10,
        0x333333
      );
      tick.setLineWidth(2);
      this.visualHintContainer.add(tick);

      const label = this.scene.add.text(x, lineY + 20, i.toString(), {
        fontSize: '16px',
        fontFamily: 'Comic Sans MS, Comic Neue, cursive',
        color: '#333333'
      });
      label.setOrigin(0.5);
      this.visualHintContainer.add(label);
    }

    // Draw jump arc for addition
    const startX = -lineWidth / 2;
    const endX = startX + (a + b) * step;

    // First jump (value a)
    this.drawJumpArc(startX, lineY - 30, startX + a * step, lineY - 30, 0xFF5722);

    // Second jump (value b)
    this.drawJumpArc(startX + a * step, lineY - 30, endX, lineY - 30, 0x4CAF50);
  }

  /**
   * Draw a group of objects for counting
   * @param {number} centerX - Center X position
   * @param {number} centerY - Center Y position
   * @param {number} count - Number of objects
   * @param {number} color - Object color
   * @param {number} size - Object size
   * @param {number} spacing - Spacing between objects
   * @param {number} maxPerRow - Max objects per row
   * @param {string} shape - Shape type ('circle' or 'square')
   */
  drawObjectGroup(centerX, centerY, count, color, size, spacing, maxPerRow, shape = 'circle') {
    const rows = Math.ceil(count / maxPerRow);
    const startY = centerY - ((rows - 1) * (size + spacing)) / 2;

    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / maxPerRow);
      const col = i % maxPerRow;
      const itemsInRow = Math.min(maxPerRow, count - row * maxPerRow);
      const rowWidth = itemsInRow * (size + spacing) - spacing;

      const x = centerX - rowWidth / 2 + col * (size + spacing) + size / 2;
      const y = startY + row * (size + spacing);

      let object;
      if (shape === 'square') {
        object = this.scene.add.rectangle(x, y, size, size, color);
        object.setStrokeStyle(2, 0x333333);
      } else {
        object = this.scene.add.circle(x, y, size / 2, color);
        object.setStrokeStyle(2, 0x333333);
      }

      this.visualHintContainer.add(object);
    }
  }

  /**
   * Draw a jump arc for number line
   * @param {number} x1 - Start X
   * @param {number} y1 - Start Y
   * @param {number} x2 - End X
   * @param {number} y2 - End Y
   * @param {number} color - Arc color
   */
  drawJumpArc(x1, y1, x2, y2, color) {
    const midX = (x1 + x2) / 2;
    const height = 40;

    const curve = new Phaser.Curves.QuadraticBezier(
      new Phaser.Math.Vector2(x1, y1),
      new Phaser.Math.Vector2(midX, y1 - height),
      new Phaser.Math.Vector2(x2, y2)
    );

    const graphics = this.scene.add.graphics();
    graphics.lineStyle(3, color);
    curve.draw(graphics, 32);

    // Draw arrow at end
    const angle = Math.atan2(y2 - y1, x2 - x1);
    graphics.fillStyle(color);
    graphics.beginPath();
    graphics.moveTo(x2, y2);
    graphics.lineTo(x2 - 10 * Math.cos(angle - Math.PI / 6), y2 - 10 * Math.sin(angle - Math.PI / 6));
    graphics.lineTo(x2 - 10 * Math.cos(angle + Math.PI / 6), y2 - 10 * Math.sin(angle + Math.PI / 6));
    graphics.closePath();
    graphics.fill();

    this.visualHintContainer.add(graphics);
  }

  /**
   * Hide visual hint
   */
  hideVisualHint() {
    this.visualHintContainer.removeAll(true);
  }

  /**
   * Clear the question display
   */
  clear() {
    this.questionText.setText('');
    this.hideVisualHint();
    this.currentQuestion = null;
  }

  /**
   * Hide the entire question display
   */
  hide() {
    this.scene.tweens.add({
      targets: this.container,
      alpha: 0,
      y: this.y - 50,
      duration: 300,
      ease: 'Power2'
    });
  }

  /**
   * Show the question display
   */
  show() {
    this.scene.tweens.add({
      targets: this.container,
      alpha: 1,
      y: this.y,
      duration: 300,
      ease: 'Power2'
    });
  }

  /**
   * Destroy the question display
   */
  destroy() {
    if (this.container) {
      this.container.destroy();
    }
  }
}
