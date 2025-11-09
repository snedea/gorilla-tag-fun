/**
 * Input Validation Functions
 * Validates user input for math answers and game data
 */

/**
 * Check if input is a valid number
 * @param {*} input - Input to validate
 * @returns {boolean} True if valid number
 */
export function isValidNumber(input) {
    // Handle null/undefined
    if (input === null || input === undefined) return false;

    // Handle empty string
    if (input === '') return false;

    // Convert to string and trim
    const str = String(input).trim();

    // Check if empty after trim
    if (str === '') return false;

    // Check if it's a valid number format
    const num = Number(str);

    // Check if conversion resulted in valid number
    return !isNaN(num) && isFinite(num);
}

/**
 * Check if number is within a range (inclusive)
 * @param {number} num - Number to check
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} True if in range
 */
export function isInRange(num, min, max) {
    if (!isValidNumber(num)) return false;
    const n = Number(num);
    return n >= min && n <= max;
}

/**
 * Sanitize user input (remove non-numeric characters, trim whitespace)
 * @param {string} input - Raw user input
 * @returns {string} Sanitized input
 */
export function sanitizeInput(input) {
    if (input === null || input === undefined) return '';

    // Convert to string and trim
    let cleaned = String(input).trim();

    // Remove all non-digit characters except minus sign at start
    cleaned = cleaned.replace(/[^\d-]/g, '');

    // Only allow minus at the beginning
    if (cleaned.indexOf('-') > 0) {
        cleaned = cleaned.replace(/-/g, '');
    }

    // Remove duplicate minus signs
    if (cleaned.split('-').length > 2) {
        cleaned = '-' + cleaned.replace(/-/g, '');
    }

    return cleaned;
}

/**
 * Validate answer against expected value
 * @param {*} input - User's answer
 * @param {number} expected - Correct answer
 * @returns {Object} Validation result {valid: boolean, correct: boolean, value: number}
 */
export function validateAnswer(input, expected) {
    // Sanitize the input
    const cleaned = sanitizeInput(input);

    // Check if valid number
    if (!isValidNumber(cleaned)) {
        return {
            valid: false,
            correct: false,
            value: null,
            message: 'Please enter a number'
        };
    }

    // Convert to number
    const userAnswer = parseInt(cleaned, 10);

    // Check if correct
    const isCorrect = userAnswer === expected;

    // Check if close (within 2)
    const isClose = Math.abs(userAnswer - expected) <= 2;

    return {
        valid: true,
        correct: isCorrect,
        close: !isCorrect && isClose,
        value: userAnswer,
        message: isCorrect ? 'Correct!' : 'Not quite, try again!'
    };
}

/**
 * Validate difficulty level
 * @param {string} difficulty - Difficulty level to validate
 * @returns {boolean} True if valid difficulty
 */
export function isValidDifficulty(difficulty) {
    const validLevels = ['easy', 'medium', 'hard'];
    return validLevels.includes(String(difficulty).toLowerCase());
}

/**
 * Validate question object structure
 * @param {Object} question - Question object to validate
 * @returns {boolean} True if valid question
 */
export function isValidQuestion(question) {
    if (!question || typeof question !== 'object') return false;

    // Required fields
    const hasRequiredFields =
        question.hasOwnProperty('id') &&
        question.hasOwnProperty('type') &&
        question.hasOwnProperty('operation') &&
        question.hasOwnProperty('questionText') &&
        question.hasOwnProperty('answer');

    if (!hasRequiredFields) return false;

    // Validate answer is a valid number
    if (!isValidNumber(question.answer)) return false;

    // Validate type
    const validTypes = ['equation', 'word-problem', 'visual'];
    if (!validTypes.includes(question.type)) return false;

    // Validate operation
    const validOperations = ['addition', 'subtraction'];
    if (!validOperations.includes(question.operation)) return false;

    return true;
}

/**
 * Validate score value
 * @param {number} score - Score to validate
 * @returns {boolean} True if valid score
 */
export function isValidScore(score) {
    return isValidNumber(score) && score >= 0;
}

/**
 * Validate accuracy percentage
 * @param {number} accuracy - Accuracy percentage
 * @returns {boolean} True if valid accuracy
 */
export function isValidAccuracy(accuracy) {
    return isValidNumber(accuracy) && accuracy >= 0 && accuracy <= 100;
}

/**
 * Sanitize string for display (prevent XSS)
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
export function sanitizeString(str) {
    if (!str) return '';

    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Validate player name
 * @param {string} name - Player name
 * @returns {Object} Validation result {valid: boolean, message: string}
 */
export function validatePlayerName(name) {
    if (!name || typeof name !== 'string') {
        return { valid: false, message: 'Name is required' };
    }

    const trimmed = name.trim();

    if (trimmed.length === 0) {
        return { valid: false, message: 'Name cannot be empty' };
    }

    if (trimmed.length < 2) {
        return { valid: false, message: 'Name must be at least 2 characters' };
    }

    if (trimmed.length > 20) {
        return { valid: false, message: 'Name must be 20 characters or less' };
    }

    // Check for appropriate characters (letters, spaces, numbers)
    if (!/^[a-zA-Z0-9\s]+$/.test(trimmed)) {
        return { valid: false, message: 'Name can only contain letters, numbers, and spaces' };
    }

    return { valid: true, message: 'Valid name' };
}

/**
 * Validate localStorage data
 * @param {*} data - Data from localStorage
 * @param {string} type - Expected data type
 * @returns {boolean} True if valid
 */
export function isValidStorageData(data, type = 'object') {
    if (data === null || data === undefined) return false;

    if (type === 'object') {
        return typeof data === 'object' && !Array.isArray(data);
    }

    if (type === 'array') {
        return Array.isArray(data);
    }

    return typeof data === type;
}

/**
 * Validate timestamp
 * @param {number} timestamp - Unix timestamp
 * @returns {boolean} True if valid timestamp
 */
export function isValidTimestamp(timestamp) {
    if (!isValidNumber(timestamp)) return false;

    const num = Number(timestamp);

    // Check if reasonable timestamp (after year 2000, before year 2100)
    const year2000 = 946684800000; // Jan 1, 2000
    const year2100 = 4102444800000; // Jan 1, 2100

    return num >= year2000 && num <= year2100;
}

/**
 * Check if answer is close to correct (within threshold)
 * @param {number} userAnswer - User's answer
 * @param {number} correctAnswer - Correct answer
 * @param {number} threshold - Allowable difference (default: 2)
 * @returns {boolean} True if close
 */
export function isAnswerClose(userAnswer, correctAnswer, threshold = 2) {
    if (!isValidNumber(userAnswer) || !isValidNumber(correctAnswer)) {
        return false;
    }

    const diff = Math.abs(userAnswer - correctAnswer);
    return diff > 0 && diff <= threshold;
}

/**
 * Validate game session data
 * @param {Object} session - Session data object
 * @returns {boolean} True if valid session
 */
export function isValidSession(session) {
    if (!session || typeof session !== 'object') return false;

    // Check required session fields
    const requiredFields = ['sessionId', 'difficulty', 'startTime', 'score'];

    for (const field of requiredFields) {
        if (!session.hasOwnProperty(field)) return false;
    }

    // Validate difficulty
    if (!isValidDifficulty(session.difficulty)) return false;

    // Validate score
    if (!isValidScore(session.score)) return false;

    // Validate timestamp
    if (!isValidTimestamp(session.startTime)) return false;

    return true;
}

export default {
    isValidNumber,
    isInRange,
    sanitizeInput,
    validateAnswer,
    isValidDifficulty,
    isValidQuestion,
    isValidScore,
    isValidAccuracy,
    sanitizeString,
    validatePlayerName,
    isValidStorageData,
    isValidTimestamp,
    isAnswerClose,
    isValidSession
};
