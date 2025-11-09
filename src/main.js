/**
 * Main Game Entry Point
 * Gorilla Tag Fun Math Game for 2nd Grade
 *
 * This file initializes the Phaser game engine and configures
 * the game settings, scenes, and rendering options.
 */

import Phaser from 'phaser';
import { GAME_CONFIG } from './utils/constants.js';

/**
 * Phaser Game Configuration
 * Defines all core settings for the game engine
 */
const config = {
    type: Phaser.AUTO, // Use WebGL if available, fallback to Canvas
    parent: 'phaser-game',
    width: GAME_CONFIG.WIDTH,
    height: GAME_CONFIG.HEIGHT,
    backgroundColor: '#87CEEB',

    // Scale settings for responsive design
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: GAME_CONFIG.WIDTH,
        height: GAME_CONFIG.HEIGHT,
        min: {
            width: 800,
            height: 600
        },
        max: {
            width: 1920,
            height: 1080
        }
    },

    // Physics engine configuration
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // No gravity for this game
            debug: false // Set to true for development debugging
        }
    },

    // Render settings
    render: {
        antialias: true,
        pixelArt: false,
        roundPixels: true
    },

    // Audio settings
    audio: {
        disableWebAudio: false
    },

    // DOM element settings
    dom: {
        createContainer: true
    },

    // Scenes will be added here as they are created
    scene: [
        // BootScene will be imported and added
        // MenuScene will be imported and added
        // GameScene will be imported and added
        // ResultsScene will be imported and added
    ],

    // Callbacks
    callbacks: {
        preBoot: function (game) {
            console.log('🦍 Gorilla Tag Fun - Initializing...');
        },
        postBoot: function (game) {
            console.log('🦍 Game engine ready!');

            // Hide loading screen after a brief delay
            setTimeout(() => {
                if (window.hideLoadingScreen) {
                    window.hideLoadingScreen();
                }
            }, 500);
        }
    }
};

/**
 * Initialize the Phaser game
 * This creates the game instance and starts the boot process
 */
const game = new Phaser.Game(config);

/**
 * Global game registry setup
 * Store global data that persists across scenes
 */
game.registry.set('difficulty', 'easy');
game.registry.set('soundEnabled', true);
game.registry.set('musicEnabled', true);

/**
 * Window resize handler
 * Ensures game scales properly on window resize
 */
window.addEventListener('resize', () => {
    game.scale.refresh();
});

/**
 * Prevent context menu on right-click
 * Improves user experience during gameplay
 */
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

/**
 * Prevent default touch behaviors
 * Stops bouncing/zooming on touch devices
 */
document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

/**
 * Export game instance for debugging
 * Available in browser console as window.game
 */
if (typeof window !== 'undefined') {
    window.game = game;
}

/**
 * Development helpers
 * Only active in development mode
 */
if (import.meta.env.DEV) {
    console.log('🔧 Development mode active');
    console.log('Game instance available as window.game');
    console.log('Game config:', GAME_CONFIG);
}

export default game;
