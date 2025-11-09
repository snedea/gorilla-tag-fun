/**
 * InputManager.js
 * Handles keyboard, mouse, and touch input for the Gorilla Tag Fun Math Game
 */

export default class InputManager {
  constructor() {
    this.scene = null;
    this.inputEnabled = false;
    this.currentInput = '';
    this.maxInputLength = 3; // Maximum digits for answer
    this.keyboardListeners = [];
    this.callbacks = {
      onNumberInput: null,
      onSubmit: null,
      onBackspace: null,
      onClear: null
    };
  }

  /**
   * Initialize the input manager with a scene
   * @param {Phaser.Scene} scene - The Phaser scene to attach to
   */
  initialize(scene) {
    if (!scene) {
      console.error('InputManager: No scene provided');
      return;
    }

    this.scene = scene;
    this.setupKeyboardInput();
  }

  /**
   * Setup keyboard input listeners
   */
  setupKeyboardInput() {
    if (!this.scene || !this.scene.input || !this.scene.input.keyboard) {
      console.warn('InputManager: Keyboard input not available');
      return;
    }

    // Number keys (0-9)
    for (let i = 0; i <= 9; i++) {
      // Main number keys
      const key = this.scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes['DIGIT' + i]
      );
      key.on('down', () => this.handleNumberKey(i.toString()));
      this.keyboardListeners.push(key);

      // Numpad keys
      const numpadKey = this.scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes['NUMPAD_' + i]
      );
      numpadKey.on('down', () => this.handleNumberKey(i.toString()));
      this.keyboardListeners.push(numpadKey);
    }

    // Enter key (submit answer)
    const enterKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
    enterKey.on('down', () => this.handleSubmit());
    this.keyboardListeners.push(enterKey);

    // Backspace key
    const backspaceKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.BACKSPACE
    );
    backspaceKey.on('down', () => this.handleBackspace());
    this.keyboardListeners.push(backspaceKey);

    // Delete key (alternative to backspace)
    const deleteKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.DELETE
    );
    deleteKey.on('down', () => this.handleBackspace());
    this.keyboardListeners.push(deleteKey);

    // Escape key (clear input)
    const escapeKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC
    );
    escapeKey.on('down', () => this.handleClear());
    this.keyboardListeners.push(escapeKey);
  }

  /**
   * Handle number key press
   * @param {string} digit - The digit pressed
   */
  handleNumberKey(digit) {
    if (!this.inputEnabled) {
      return;
    }

    // Validate digit
    if (!/^[0-9]$/.test(digit)) {
      console.warn('InputManager: Invalid digit', digit);
      return;
    }

    // Check max length
    if (this.currentInput.length >= this.maxInputLength) {
      console.log('InputManager: Max input length reached');
      return;
    }

    // Add digit to input
    this.currentInput += digit;

    // Trigger callback
    if (this.callbacks.onNumberInput) {
      this.callbacks.onNumberInput(this.currentInput, digit);
    }
  }

  /**
   * Handle backspace key press
   */
  handleBackspace() {
    if (!this.inputEnabled) {
      return;
    }

    if (this.currentInput.length === 0) {
      return;
    }

    // Remove last character
    this.currentInput = this.currentInput.slice(0, -1);

    // Trigger callback
    if (this.callbacks.onBackspace) {
      this.callbacks.onBackspace(this.currentInput);
    }
  }

  /**
   * Handle submit key press
   */
  handleSubmit() {
    if (!this.inputEnabled) {
      return;
    }

    if (this.currentInput.length === 0) {
      console.log('InputManager: No input to submit');
      return;
    }

    // Trigger callback
    if (this.callbacks.onSubmit) {
      this.callbacks.onSubmit(this.currentInput);
    }
  }

  /**
   * Handle clear key press
   */
  handleClear() {
    if (!this.inputEnabled) {
      return;
    }

    this.currentInput = '';

    // Trigger callback
    if (this.callbacks.onClear) {
      this.callbacks.onClear();
    }
  }

  /**
   * Enable input capture
   */
  enableInput() {
    this.inputEnabled = true;
  }

  /**
   * Disable input capture
   */
  disableInput() {
    this.inputEnabled = false;
  }

  /**
   * Check if input is enabled
   * @returns {boolean} Input enabled status
   */
  isInputEnabled() {
    return this.inputEnabled;
  }

  /**
   * Get current input value
   * @returns {string} Current input
   */
  getCurrentInput() {
    return this.currentInput;
  }

  /**
   * Clear current input
   */
  clearInput() {
    this.currentInput = '';
  }

  /**
   * Set current input (for programmatic input)
   * @param {string} value - Input value to set
   */
  setInput(value) {
    const sanitized = this.sanitizeInput(value);

    if (sanitized.length > this.maxInputLength) {
      this.currentInput = sanitized.substring(0, this.maxInputLength);
    } else {
      this.currentInput = sanitized;
    }
  }

  /**
   * Sanitize input to only include digits
   * @param {string} input - Raw input
   * @returns {string} Sanitized input
   */
  sanitizeInput(input) {
    return input.toString().replace(/[^0-9]/g, '');
  }

  /**
   * Register a callback for number input
   * @param {Function} callback - Callback function (input, digit) => void
   */
  onNumberInput(callback) {
    if (typeof callback === 'function') {
      this.callbacks.onNumberInput = callback;
    }
  }

  /**
   * Register a callback for submit
   * @param {Function} callback - Callback function (input) => void
   */
  onSubmit(callback) {
    if (typeof callback === 'function') {
      this.callbacks.onSubmit = callback;
    }
  }

  /**
   * Register a callback for backspace
   * @param {Function} callback - Callback function (input) => void
   */
  onBackspace(callback) {
    if (typeof callback === 'function') {
      this.callbacks.onBackspace = callback;
    }
  }

  /**
   * Register a callback for clear
   * @param {Function} callback - Callback function () => void
   */
  onClear(callback) {
    if (typeof callback === 'function') {
      this.callbacks.onClear = callback;
    }
  }

  /**
   * Submit the current answer
   * @returns {string} Current input value
   */
  submitAnswer() {
    if (this.currentInput.length === 0) {
      return null;
    }

    const answer = this.currentInput;
    return answer;
  }

  /**
   * Handle mouse/touch click on number pad button
   * @param {string|number} number - Number clicked
   */
  onNumberPadClick(number) {
    this.handleNumberKey(number.toString());
  }

  /**
   * Handle mouse/touch click on backspace button
   */
  onBackspaceClick() {
    this.handleBackspace();
  }

  /**
   * Handle mouse/touch click on submit button
   */
  onSubmitClick() {
    this.handleSubmit();
  }

  /**
   * Handle mouse/touch click on clear button
   */
  onClearClick() {
    this.handleClear();
  }

  /**
   * Set maximum input length
   * @param {number} length - Maximum input length
   */
  setMaxInputLength(length) {
    if (typeof length === 'number' && length > 0) {
      this.maxInputLength = length;
    }
  }

  /**
   * Get maximum input length
   * @returns {number} Maximum input length
   */
  getMaxInputLength() {
    return this.maxInputLength;
  }

  /**
   * Prevent default paste behavior
   * @param {Event} event - Paste event
   */
  preventPaste(event) {
    event.preventDefault();
    console.log('InputManager: Paste prevented');
  }

  /**
   * Setup paste prevention
   */
  setupPastePrevention() {
    if (typeof window !== 'undefined') {
      document.addEventListener('paste', this.preventPaste);
    }
  }

  /**
   * Remove paste prevention
   */
  removePastePrevention() {
    if (typeof window !== 'undefined') {
      document.removeEventListener('paste', this.preventPaste);
    }
  }

  /**
   * Destroy the input manager and cleanup listeners
   */
  destroy() {
    // Remove keyboard listeners
    this.keyboardListeners.forEach(key => {
      if (key && key.removeAllListeners) {
        key.removeAllListeners();
      }
    });

    this.keyboardListeners = [];

    // Remove paste prevention
    this.removePastePrevention();

    // Clear callbacks
    this.callbacks = {
      onNumberInput: null,
      onSubmit: null,
      onBackspace: null,
      onClear: null
    };

    // Reset state
    this.currentInput = '';
    this.inputEnabled = false;
    this.scene = null;
  }

  /**
   * Reset input state (but keep listeners)
   */
  reset() {
    this.currentInput = '';
    this.inputEnabled = false;
  }

  /**
   * Get input state for debugging
   * @returns {Object} Input state
   */
  getState() {
    return {
      enabled: this.inputEnabled,
      currentInput: this.currentInput,
      maxLength: this.maxInputLength,
      hasCallbacks: {
        numberInput: this.callbacks.onNumberInput !== null,
        submit: this.callbacks.onSubmit !== null,
        backspace: this.callbacks.onBackspace !== null,
        clear: this.callbacks.onClear !== null
      }
    };
  }

  /**
   * Validate that input is a valid number
   * @param {string} input - Input to validate
   * @returns {boolean} True if valid
   */
  isValidInput(input = this.currentInput) {
    if (input.length === 0) {
      return false;
    }

    const num = parseInt(input, 10);
    return !isNaN(num) && isFinite(num);
  }

  /**
   * Get input as number
   * @returns {number|null} Input as number or null if invalid
   */
  getInputAsNumber() {
    if (!this.isValidInput()) {
      return null;
    }

    return parseInt(this.currentInput, 10);
  }
}
