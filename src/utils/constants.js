/**
 * Game Constants and Configuration
 * Central location for all game-wide constants
 */

/**
 * Core game configuration
 */
export const GAME_CONFIG = {
    WIDTH: 1024,
    HEIGHT: 768,
    SCALE_MODE: 'FIT',
    PHYSICS: 'ARCADE',
    TITLE: 'Gorilla Tag Fun Math Game',
    VERSION: '1.0.0'
};

/**
 * Difficulty level configurations
 * Each level defines the number range and question count
 */
export const DIFFICULTY = {
    EASY: {
        name: 'Easy',
        min: 0,
        max: 20,
        questions: 5,
        timeLimit: 0, // No time limit for easy
        description: 'Perfect for beginners! Numbers 0-20'
    },
    MEDIUM: {
        name: 'Medium',
        min: 0,
        max: 50,
        questions: 5,
        timeLimit: 0, // No time limit for medium
        description: 'Getting trickier! Numbers 0-50'
    },
    HARD: {
        name: 'Hard',
        min: 0,
        max: 100,
        questions: 5,
        timeLimit: 0, // No time limit for hard
        description: 'Challenge yourself! Numbers 0-100'
    }
};

/**
 * Scoring system configuration
 */
export const SCORING = {
    CORRECT_ANSWER: 100,
    BANANA: 10,
    BONUS_FAST: 50, // Bonus for answering quickly
    BONUS_FIRST_TRY: 25, // Bonus for correct on first attempt
    STAR_THRESHOLDS: [60, 80, 95], // Accuracy % for 1/2/3 stars
    ACCURACY_3_STARS: 95,
    ACCURACY_2_STARS: 80,
    ACCURACY_1_STAR: 60
};

/**
 * Animation timing constants (in milliseconds)
 */
export const ANIMATIONS = {
    GORILLA_SWING_DURATION: 1000,
    GORILLA_CELEBRATE_DURATION: 2000,
    FEEDBACK_DISPLAY_TIME: 2000,
    CELEBRATION_DURATION: 3000,
    QUESTION_FADE_IN: 500,
    ANSWER_FEEDBACK_DELAY: 300,
    SCENE_TRANSITION: 500,
    BANANA_COLLECT: 600,
    PARTICLE_BURST: 800
};

/**
 * Color palette
 * All colors used throughout the game
 */
export const COLORS = {
    // Feedback colors
    CORRECT: '#4CAF50',
    INCORRECT: '#FF9800',
    CLOSE: '#FFC107',

    // Theme colors
    PRIMARY: '#2196F3',
    SECONDARY: '#4FC3F7',
    ACCENT: '#FFD700',

    // Banana yellow
    BANANA_YELLOW: '#FFD700',

    // Background colors
    SKY_BLUE: '#87CEEB',
    JUNGLE_GREEN: '#2D5016',

    // Text colors
    TEXT_DARK: '#333333',
    TEXT_LIGHT: '#FFFFFF',
    TEXT_SHADOW: 'rgba(0, 0, 0, 0.3)',

    // UI colors
    BUTTON_PRIMARY: '#4CAF50',
    BUTTON_SECONDARY: '#2196F3',
    BUTTON_DISABLED: '#CCCCCC',
    OVERLAY: 'rgba(0, 0, 0, 0.5)'
};

/**
 * Font configuration
 */
export const FONTS = {
    HEADING: {
        family: 'Comic Sans MS, Comic Neue, cursive, sans-serif',
        size: 48,
        weight: 'bold'
    },
    BODY: {
        family: 'Comic Sans MS, Comic Neue, cursive, sans-serif',
        size: 24,
        weight: 'normal'
    },
    QUESTION: {
        family: 'Comic Sans MS, Comic Neue, cursive, sans-serif',
        size: 36,
        weight: 'bold'
    },
    NUMBER: {
        family: 'Comic Sans MS, Comic Neue, cursive, sans-serif',
        size: 40,
        weight: 'bold'
    },
    FEEDBACK: {
        family: 'Comic Sans MS, Comic Neue, cursive, sans-serif',
        size: 32,
        weight: 'bold'
    },
    BUTTON: {
        family: 'Comic Sans MS, Comic Neue, cursive, sans-serif',
        size: 28,
        weight: 'bold'
    }
};

/**
 * UI element sizes
 */
export const UI = {
    BUTTON_WIDTH: 200,
    BUTTON_HEIGHT: 60,
    BUTTON_RADIUS: 10,
    NUMBER_PAD_BUTTON_SIZE: 70,
    MIN_TOUCH_TARGET: 44, // Minimum size for touch-friendly buttons
    PADDING: 20,
    MARGIN: 10
};

/**
 * Audio volume levels (0.0 to 1.0)
 */
export const AUDIO = {
    MUSIC_VOLUME: 0.4,
    SFX_VOLUME: 0.6,
    MASTER_VOLUME: 1.0
};

/**
 * Game states for the GameScene state machine
 */
export const GAME_STATES = {
    PRESENTING_QUESTION: 'presenting',
    WAITING_INPUT: 'waiting',
    VALIDATING: 'validating',
    SHOWING_FEEDBACK: 'feedback',
    ANIMATING: 'animating',
    PAUSED: 'paused',
    COMPLETE: 'complete'
};

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
    PROGRESS: 'gorilla-math-progress',
    HIGH_SCORES: 'gorilla-math-highscores',
    SETTINGS: 'gorilla-math-settings',
    PLAYER_ID: 'gorilla-math-player-id'
};

/**
 * Question types
 */
export const QUESTION_TYPES = {
    EQUATION: 'equation',
    WORD_PROBLEM: 'word-problem',
    VISUAL: 'visual'
};

/**
 * Math operations
 */
export const OPERATIONS = {
    ADDITION: 'addition',
    SUBTRACTION: 'subtraction'
};

/**
 * Asset paths
 */
export const ASSETS = {
    IMAGES: {
        SPRITES: '/assets/images/sprites/',
        BACKGROUNDS: '/assets/images/backgrounds/',
        UI: '/assets/images/ui/',
        OBJECTS: '/assets/images/objects/'
    },
    AUDIO: {
        MUSIC: '/assets/audio/music/',
        SFX: '/assets/audio/sfx/'
    },
    FONTS: '/assets/fonts/',
    DATA: '/src/data/'
};

/**
 * Debug settings
 */
export const DEBUG = {
    SHOW_FPS: false,
    SHOW_PHYSICS: false,
    LOG_QUESTIONS: false,
    LOG_ANSWERS: false,
    SKIP_BOOT: false
};

/**
 * Performance settings
 */
export const PERFORMANCE = {
    TARGET_FPS: 60,
    MAX_PARTICLES: 50,
    ENABLE_PIXEL_ART: false,
    ANTIALIAS: true
};

/**
 * Gorilla character settings
 */
export const GORILLA = {
    START_X: 150,
    START_Y: 400,
    SWING_DISTANCE: 150,
    ANIMATION_SPEED: 10
};

/**
 * Game progression settings
 */
export const PROGRESSION = {
    MIN_ACCURACY_TO_ADVANCE: 70, // Percentage
    MAX_ATTEMPTS_PER_QUESTION: 3,
    SHOW_HINT_AFTER_ATTEMPTS: 2
};

export default {
    GAME_CONFIG,
    DIFFICULTY,
    SCORING,
    ANIMATIONS,
    COLORS,
    FONTS,
    UI,
    AUDIO,
    GAME_STATES,
    STORAGE_KEYS,
    QUESTION_TYPES,
    OPERATIONS,
    ASSETS,
    DEBUG,
    PERFORMANCE,
    GORILLA,
    PROGRESSION
};
