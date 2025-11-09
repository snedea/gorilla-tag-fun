/**
 * AudioManager.js
 * Handles all sound effects and music playback with volume control and mute functionality
 */

export default class AudioManager {
  constructor(scene) {
    this.scene = scene;
    this.sounds = {};
    this.music = null;
    this.isMutedState = false;
    this.masterVolume = 1.0;
    this.sfxVolume = 0.7;
    this.musicVolume = 0.5;
    this.initialized = false;
  }

  /**
   * Initialize the audio manager and load audio from localStorage preferences
   */
  initialize() {
    // Load mute state from localStorage
    const savedMuteState = localStorage.getItem('gorilla-math-mute');
    if (savedMuteState !== null) {
      this.isMutedState = JSON.parse(savedMuteState);
    }

    // Load volume settings from localStorage
    const savedVolume = localStorage.getItem('gorilla-math-volume');
    if (savedVolume !== null) {
      const volumes = JSON.parse(savedVolume);
      this.masterVolume = volumes.master || 1.0;
      this.sfxVolume = volumes.sfx || 0.7;
      this.musicVolume = volumes.music || 0.5;
    }

    this.initialized = true;
  }

  /**
   * Load and cache a sound effect
   * @param {string} key - Sound key identifier
   * @param {string} path - Path to audio file (without extension)
   */
  loadSound(key, path) {
    // Phaser automatically handles loading during preload phase
    // This method is for runtime reference
    if (this.scene.cache.audio.exists(key)) {
      this.sounds[key] = {
        key: key,
        loaded: true
      };
    }
  }

  /**
   * Play a sound effect
   * @param {string} key - Sound key identifier
   * @param {number} volume - Volume override (0-1), uses default if not provided
   * @param {Object} config - Additional Phaser sound config
   * @returns {Phaser.Sound.BaseSound} The sound instance
   */
  playSound(key, volume = null, config = {}) {
    if (!this.initialized) {
      this.initialize();
    }

    // Don't play if muted
    if (this.isMutedState) {
      return null;
    }

    // Check if sound exists in cache
    if (!this.scene.cache.audio.exists(key)) {
      console.warn(`Audio key "${key}" not found in cache`);
      return null;
    }

    // Calculate final volume
    const finalVolume = (volume !== null ? volume : this.sfxVolume) * this.masterVolume;

    // Play the sound
    const sound = this.scene.sound.add(key, {
      volume: finalVolume,
      loop: false,
      ...config
    });

    sound.play();

    return sound;
  }

  /**
   * Play background music with looping
   * @param {string} key - Music key identifier
   * @param {boolean} loop - Whether to loop the music
   * @returns {Phaser.Sound.BaseSound} The music instance
   */
  playMusic(key, loop = true) {
    if (!this.initialized) {
      this.initialize();
    }

    // Stop existing music if playing
    if (this.music) {
      this.music.stop();
      this.music.destroy();
    }

    // Don't play if muted
    if (this.isMutedState) {
      return null;
    }

    // Check if music exists in cache
    if (!this.scene.cache.audio.exists(key)) {
      console.warn(`Music key "${key}" not found in cache`);
      return null;
    }

    // Calculate final volume
    const finalVolume = this.musicVolume * this.masterVolume;

    // Create and play music
    this.music = this.scene.sound.add(key, {
      volume: finalVolume,
      loop: loop
    });

    this.music.play();

    return this.music;
  }

  /**
   * Stop currently playing music
   */
  stopMusic() {
    if (this.music) {
      this.music.stop();
    }
  }

  /**
   * Pause currently playing music
   */
  pauseMusic() {
    if (this.music && this.music.isPlaying) {
      this.music.pause();
    }
  }

  /**
   * Resume paused music
   */
  resumeMusic() {
    if (this.music && this.music.isPaused && !this.isMutedState) {
      this.music.resume();
    }
  }

  /**
   * Mute all audio
   */
  mute() {
    this.isMutedState = true;

    // Stop all playing sounds
    this.scene.sound.stopAll();

    // Save mute state to localStorage
    localStorage.setItem('gorilla-math-mute', JSON.stringify(true));
  }

  /**
   * Unmute all audio
   */
  unmute() {
    this.isMutedState = false;

    // Save mute state to localStorage
    localStorage.setItem('gorilla-math-mute', JSON.stringify(false));

    // Resume music if it was playing
    if (this.music && this.music.isPaused) {
      this.music.resume();
    }
  }

  /**
   * Toggle mute state
   * @returns {boolean} New mute state
   */
  toggleMute() {
    if (this.isMutedState) {
      this.unmute();
    } else {
      this.mute();
    }
    return this.isMutedState;
  }

  /**
   * Check if audio is currently muted
   * @returns {boolean} Mute state
   */
  isMuted() {
    return this.isMutedState;
  }

  /**
   * Set master volume level
   * @param {number} level - Volume level (0-1)
   */
  setVolume(level) {
    this.masterVolume = Math.max(0, Math.min(1, level));

    // Update music volume if playing
    if (this.music) {
      this.music.setVolume(this.musicVolume * this.masterVolume);
    }

    // Save to localStorage
    this.saveVolumeSettings();
  }

  /**
   * Set SFX volume level
   * @param {number} level - Volume level (0-1)
   */
  setSFXVolume(level) {
    this.sfxVolume = Math.max(0, Math.min(1, level));
    this.saveVolumeSettings();
  }

  /**
   * Set music volume level
   * @param {number} level - Volume level (0-1)
   */
  setMusicVolume(level) {
    this.musicVolume = Math.max(0, Math.min(1, level));

    // Update currently playing music
    if (this.music) {
      this.music.setVolume(this.musicVolume * this.masterVolume);
    }

    this.saveVolumeSettings();
  }

  /**
   * Get current master volume
   * @returns {number} Volume level (0-1)
   */
  getVolume() {
    return this.masterVolume;
  }

  /**
   * Get current SFX volume
   * @returns {number} Volume level (0-1)
   */
  getSFXVolume() {
    return this.sfxVolume;
  }

  /**
   * Get current music volume
   * @returns {number} Volume level (0-1)
   */
  getMusicVolume() {
    return this.musicVolume;
  }

  /**
   * Save volume settings to localStorage
   */
  saveVolumeSettings() {
    const volumes = {
      master: this.masterVolume,
      sfx: this.sfxVolume,
      music: this.musicVolume
    };
    localStorage.setItem('gorilla-math-volume', JSON.stringify(volumes));
  }

  /**
   * Play correct answer sound effect
   */
  playCorrectSound() {
    return this.playSound('correct-answer');
  }

  /**
   * Play wrong answer sound effect
   */
  playWrongSound() {
    return this.playSound('wrong-answer');
  }

  /**
   * Play banana collection sound effect
   */
  playBananaSound() {
    return this.playSound('banana-collect');
  }

  /**
   * Play swing sound effect
   */
  playSwingSound() {
    return this.playSound('swing');
  }

  /**
   * Play celebration sound effect
   */
  playCelebrationSound() {
    return this.playSound('celebrate');
  }

  /**
   * Play button click sound effect
   */
  playClickSound() {
    return this.playSound('button-click', 0.5);
  }

  /**
   * Fade out music over time
   * @param {number} duration - Duration in milliseconds
   * @param {Function} onComplete - Callback when fade completes
   */
  fadeOutMusic(duration = 1000, onComplete) {
    if (!this.music || !this.music.isPlaying) {
      if (onComplete) onComplete();
      return;
    }

    const initialVolume = this.music.volume;
    const steps = 20;
    const stepDuration = duration / steps;
    const volumeStep = initialVolume / steps;
    let currentStep = 0;

    const fadeInterval = setInterval(() => {
      currentStep++;
      const newVolume = initialVolume - (volumeStep * currentStep);

      if (newVolume <= 0 || currentStep >= steps) {
        clearInterval(fadeInterval);
        this.music.stop();
        this.music.setVolume(initialVolume);
        if (onComplete) onComplete();
      } else {
        this.music.setVolume(newVolume);
      }
    }, stepDuration);
  }

  /**
   * Fade in music over time
   * @param {string} key - Music key identifier
   * @param {number} duration - Duration in milliseconds
   * @param {boolean} loop - Whether to loop the music
   */
  fadeInMusic(key, duration = 1000, loop = true) {
    if (this.isMutedState) {
      return null;
    }

    // Stop existing music
    if (this.music) {
      this.music.stop();
    }

    // Create new music
    this.music = this.scene.sound.add(key, {
      volume: 0,
      loop: loop
    });

    this.music.play();

    const targetVolume = this.musicVolume * this.masterVolume;
    const steps = 20;
    const stepDuration = duration / steps;
    const volumeStep = targetVolume / steps;
    let currentStep = 0;

    const fadeInterval = setInterval(() => {
      currentStep++;
      const newVolume = volumeStep * currentStep;

      if (newVolume >= targetVolume || currentStep >= steps) {
        clearInterval(fadeInterval);
        this.music.setVolume(targetVolume);
      } else {
        this.music.setVolume(newVolume);
      }
    }, stepDuration);

    return this.music;
  }

  /**
   * Stop all currently playing sounds
   */
  stopAll() {
    this.scene.sound.stopAll();
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.stopAll();

    if (this.music) {
      this.music.destroy();
      this.music = null;
    }

    this.sounds = {};
    this.scene = null;
  }
}
