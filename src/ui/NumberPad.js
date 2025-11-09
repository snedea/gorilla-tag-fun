/**
 * NumberPad.js
 * On-screen number input component for touch devices
 * Designed for 2nd graders - large buttons, colorful, friendly
 */

export default class NumberPad {
  /**
   * Create a NumberPad
   * @param {Phaser.Scene} scene - The scene this number pad belongs to
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.container = null;
    this.currentInput = '';
    this.buttons = [];
    this.inputDisplay = null;
    this.isVisible = false;

    // Styling constants
    this.BUTTON_SIZE = 80;
    this.BUTTON_SPACING = 10;
    this.BUTTON_COLOR = 0x2196F3; // Primary blue
    this.BUTTON_HOVER_COLOR = 0x1976D2; // Darker blue
    this.BUTTON_TEXT_COLOR = '#FFFFFF';
    this.DISPLAY_COLOR = 0xFFFFFF;
    this.DISPLAY_TEXT_COLOR = '#333333';

    this.create();
  }

  /**
   * Create the number pad UI elements
   */
  create() {
    // Create container for all elements
    this.container = this.scene.add.container(this.x, this.y);

    // Create input display at the top
    this.createInputDisplay();

    // Create number buttons (0-9) in a 3x4 grid
    this.createNumberButtons();

    // Create action buttons (backspace, clear, submit)
    this.createActionButtons();

    // Initially hidden
    this.hide();
  }

  /**
   * Create the input display area
   */
  createInputDisplay() {
    const displayWidth = this.BUTTON_SIZE * 3 + this.BUTTON_SPACING * 2;
    const displayHeight = 60;

    // Display background
    const displayBg = this.scene.add.rectangle(
      displayWidth / 2,
      0,
      displayWidth,
      displayHeight,
      this.DISPLAY_COLOR
    );
    displayBg.setStrokeStyle(4, 0x333333);

    // Display text
    this.inputDisplay = this.scene.add.text(
      displayWidth / 2,
      0,
      '0',
      {
        fontSize: '36px',
        fontFamily: 'Comic Sans MS, Comic Neue, cursive',
        color: this.DISPLAY_TEXT_COLOR,
        fontStyle: 'bold'
      }
    );
    this.inputDisplay.setOrigin(0.5);

    this.container.add(displayBg);
    this.container.add(this.inputDisplay);
  }

  /**
   * Create number buttons (0-9) in a grid layout
   */
  createNumberButtons() {
    const startY = 80; // Below the display
    const numbers = [
      [7, 8, 9],
      [4, 5, 6],
      [1, 2, 3],
      [0]
    ];

    numbers.forEach((row, rowIndex) => {
      row.forEach((number, colIndex) => {
        let xPos, yPos;

        if (number === 0) {
          // Center the 0 button
          xPos = this.BUTTON_SIZE + this.BUTTON_SPACING;
        } else {
          xPos = colIndex * (this.BUTTON_SIZE + this.BUTTON_SPACING);
        }

        yPos = startY + rowIndex * (this.BUTTON_SIZE + this.BUTTON_SPACING);

        this.createButton(
          number.toString(),
          xPos + this.BUTTON_SIZE / 2,
          yPos + this.BUTTON_SIZE / 2,
          this.BUTTON_COLOR,
          () => this.onNumberPress(number)
        );
      });
    });
  }

  /**
   * Create action buttons (backspace, clear, submit)
   */
  createActionButtons() {
    const startY = 80;
    const col3X = (this.BUTTON_SIZE + this.BUTTON_SPACING) * 2;

    // Backspace button (top right)
    this.createButton(
      '\u2190', // Left arrow
      col3X + this.BUTTON_SIZE / 2,
      startY + this.BUTTON_SIZE / 2,
      0xFF9800, // Orange
      () => this.onBackspace(),
      'Backspace'
    );

    // Clear button (middle right)
    this.createButton(
      'C',
      col3X + this.BUTTON_SIZE / 2,
      startY + (this.BUTTON_SIZE + this.BUTTON_SPACING) * 1 + this.BUTTON_SIZE / 2,
      0xF44336, // Red
      () => this.clear(),
      'Clear'
    );

    // Submit button (bottom, spans full width)
    const submitWidth = this.BUTTON_SIZE * 3 + this.BUTTON_SPACING * 2;
    const submitY = startY + (this.BUTTON_SIZE + this.BUTTON_SPACING) * 4;

    this.createButton(
      'Submit',
      submitWidth / 2,
      submitY + this.BUTTON_SIZE / 2,
      0x4CAF50, // Green
      () => this.onSubmit(),
      'Submit',
      submitWidth
    );
  }

  /**
   * Create a single button
   * @param {string} label - Button label
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} color - Button color
   * @param {Function} callback - Click callback
   * @param {string} name - Button name for reference
   * @param {number} width - Optional custom width
   */
  createButton(label, x, y, color, callback, name = label, width = null) {
    const btnWidth = width || this.BUTTON_SIZE;
    const btnHeight = this.BUTTON_SIZE;

    // Button background
    const button = this.scene.add.rectangle(x, y, btnWidth, btnHeight, color);
    button.setStrokeStyle(3, 0x333333);
    button.setInteractive({ useHandCursor: true });
    button.setData('name', name);
    button.setData('defaultColor', color);

    // Button text
    const text = this.scene.add.text(x, y, label, {
      fontSize: label === 'Submit' ? '28px' : '32px',
      fontFamily: 'Comic Sans MS, Comic Neue, cursive',
      color: this.BUTTON_TEXT_COLOR,
      fontStyle: 'bold'
    });
    text.setOrigin(0.5);

    // Hover effects
    button.on('pointerover', () => {
      button.setFillStyle(this.BUTTON_HOVER_COLOR);
      button.setScale(1.05);
    });

    button.on('pointerout', () => {
      button.setFillStyle(button.getData('defaultColor'));
      button.setScale(1);
    });

    // Click effect
    button.on('pointerdown', () => {
      button.setScale(0.95);
      // Play click sound if audio manager exists
      if (this.scene.audioManager) {
        this.scene.audioManager.playSound('button-click', 0.3);
      }
    });

    button.on('pointerup', () => {
      button.setScale(1.05);
      callback();
    });

    this.container.add(button);
    this.container.add(text);
    this.buttons.push({ button, text });
  }

  /**
   * Handle number button press
   * @param {number} number - The number pressed
   */
  onNumberPress(number) {
    // Limit input to 3 digits (max answer in 2nd grade math is usually < 200)
    if (this.currentInput.length >= 3) {
      return;
    }

    // Remove leading zero
    if (this.currentInput === '0') {
      this.currentInput = '';
    }

    this.currentInput += number.toString();
    this.updateDisplay();
  }

  /**
   * Handle backspace button press
   */
  onBackspace() {
    if (this.currentInput.length > 0) {
      this.currentInput = this.currentInput.slice(0, -1);
    }

    if (this.currentInput === '') {
      this.currentInput = '0';
    }

    this.updateDisplay();
  }

  /**
   * Clear all input
   */
  clear() {
    this.currentInput = '0';
    this.updateDisplay();
  }

  /**
   * Update the display with current input
   */
  updateDisplay() {
    const displayValue = this.currentInput === '' ? '0' : this.currentInput;
    this.inputDisplay.setText(displayValue);
  }

  /**
   * Handle submit button press
   */
  onSubmit() {
    if (this.currentInput === '' || this.currentInput === '0') {
      return;
    }

    // Emit event for parent scene to handle
    if (this.scene.events) {
      this.scene.events.emit('numberpad-submit', this.currentInput);
    }

    // Call callback if provided
    if (this.onSubmitCallback) {
      this.onSubmitCallback(this.currentInput);
    }
  }

  /**
   * Set submit callback
   * @param {Function} callback - Function to call on submit
   */
  setSubmitCallback(callback) {
    this.onSubmitCallback = callback;
  }

  /**
   * Get current input value
   * @returns {string} Current input
   */
  getCurrentInput() {
    return this.currentInput === '' ? '0' : this.currentInput;
  }

  /**
   * Show the number pad
   */
  show() {
    this.container.setVisible(true);
    this.isVisible = true;
    this.clear();

    // Animate entrance
    this.container.setAlpha(0);
    this.container.setY(this.y + 50);

    this.scene.tweens.add({
      targets: this.container,
      alpha: 1,
      y: this.y,
      duration: 300,
      ease: 'Back.easeOut'
    });
  }

  /**
   * Hide the number pad
   */
  hide() {
    this.scene.tweens.add({
      targets: this.container,
      alpha: 0,
      y: this.y + 50,
      duration: 200,
      ease: 'Power2',
      onComplete: () => {
        this.container.setVisible(false);
        this.isVisible = false;
      }
    });
  }

  /**
   * Enable input
   */
  enableInput() {
    this.buttons.forEach(({ button }) => {
      button.setInteractive();
    });
  }

  /**
   * Disable input
   */
  disableInput() {
    this.buttons.forEach(({ button }) => {
      button.disableInteractive();
    });
  }

  /**
   * Destroy the number pad
   */
  destroy() {
    if (this.container) {
      this.container.destroy();
    }
  }
}
