/**
 * Helper Utility Functions
 * Common utility functions used throughout the game
 */

/**
 * Generate a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
export function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array (new array, original unchanged)
 */
export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Format a number for display (add commas for thousands)
 * @param {number} num - Number to format
 * @returns {string} Formatted number string
 */
export function formatNumber(num) {
    return num.toLocaleString('en-US');
}

/**
 * Calculate percentage
 * @param {number} part - Part value
 * @param {number} total - Total value
 * @returns {number} Percentage (0-100)
 */
export function calculatePercentage(part, total) {
    if (total === 0) return 0;
    return Math.round((part / total) * 100);
}

/**
 * Clamp a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Get a random element from an array
 * @param {Array} array - Array to pick from
 * @returns {*} Random element from array
 */
export function getRandomElement(array) {
    if (!array || array.length === 0) return null;
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Debounce a function (prevent rapid repeated calls)
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Check if a value is a valid number
 * @param {*} value - Value to check
 * @returns {boolean} True if valid number
 */
export function isNumber(value) {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;

    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }

    if (obj instanceof Array) {
        return obj.map(item => deepClone(item));
    }

    if (obj instanceof Object) {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
}

/**
 * Wait for a specified time (Promise-based delay)
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after delay
 */
export function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate a unique ID
 * @returns {string} Unique identifier
 */
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

/**
 * Calculate distance between two points
 * @param {number} x1 - First point x coordinate
 * @param {number} y1 - First point y coordinate
 * @param {number} x2 - Second point x coordinate
 * @param {number} y2 - Second point y coordinate
 * @returns {number} Distance between points
 */
export function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Linear interpolation between two values
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
export function lerp(start, end, t) {
    return start + (end - start) * clamp(t, 0, 1);
}

/**
 * Map a value from one range to another
 * @param {number} value - Value to map
 * @param {number} inMin - Input range minimum
 * @param {number} inMax - Input range maximum
 * @param {number} outMin - Output range minimum
 * @param {number} outMax - Output range maximum
 * @returns {number} Mapped value
 */
export function mapRange(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Check if two rectangles overlap
 * @param {Object} rect1 - First rectangle {x, y, width, height}
 * @param {Object} rect2 - Second rectangle {x, y, width, height}
 * @returns {boolean} True if rectangles overlap
 */
export function rectanglesOverlap(rect1, rect2) {
    return !(
        rect1.x + rect1.width < rect2.x ||
        rect2.x + rect2.width < rect1.x ||
        rect1.y + rect1.height < rect2.y ||
        rect2.y + rect2.height < rect1.y
    );
}

/**
 * Format time in seconds to MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Capitalize first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Remove duplicates from an array
 * @param {Array} array - Array with potential duplicates
 * @returns {Array} Array with duplicates removed
 */
export function removeDuplicates(array) {
    return [...new Set(array)];
}

/**
 * Check if device is mobile/tablet
 * @returns {boolean} True if mobile or tablet
 */
export function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    ) || ('ontouchstart' in window);
}

/**
 * Get browser name
 * @returns {string} Browser name
 */
export function getBrowser() {
    const userAgent = navigator.userAgent;

    if (userAgent.indexOf('Firefox') > -1) return 'Firefox';
    if (userAgent.indexOf('Chrome') > -1) return 'Chrome';
    if (userAgent.indexOf('Safari') > -1) return 'Safari';
    if (userAgent.indexOf('Edge') > -1) return 'Edge';
    if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) return 'IE';

    return 'Unknown';
}

/**
 * Play sound with error handling
 * @param {Phaser.Sound.BaseSound} sound - Phaser sound object
 * @param {number} volume - Volume (0-1)
 */
export function playSound(sound, volume = 1) {
    try {
        if (sound && typeof sound.play === 'function') {
            sound.play({ volume });
        }
    } catch (error) {
        console.warn('Failed to play sound:', error);
    }
}

export default {
    randomInt,
    shuffleArray,
    formatNumber,
    calculatePercentage,
    clamp,
    getRandomElement,
    debounce,
    isNumber,
    deepClone,
    wait,
    generateId,
    distance,
    lerp,
    mapRange,
    rectanglesOverlap,
    formatTime,
    capitalize,
    removeDuplicates,
    isMobileDevice,
    getBrowser,
    playSound
};
