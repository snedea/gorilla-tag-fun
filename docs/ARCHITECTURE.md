# Architecture Guide - Gorilla Tag Fun Math Game

Technical architecture overview and system design documentation.

## Table of Contents

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Component Architecture](#component-architecture)
4. [Data Flow](#data-flow)
5. [Module Descriptions](#module-descriptions)
6. [Design Decisions](#design-decisions)
7. [Performance Considerations](#performance-considerations)
8. [Security and Privacy](#security-and-privacy)

---

## System Overview

### High-Level Architecture

The Gorilla Tag Fun Math Game is a client-side web application built with Phaser 3, designed to run entirely in the browser without requiring a backend server.

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser Environment                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Phaser 3 Game Engine                     │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │ Boot Scene  │  │ Menu Scene  │  │ Game Scene  │  │  │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  │  │
│  │         │                │                │         │  │
│  │         └────────────────┴────────────────┘         │  │
│  │                         │                           │  │
│  │  ┌──────────────────────┴────────────────────────┐  │  │
│  │  │          Core Game Systems                    │  │  │
│  │  │  ┌──────────────┐  ┌──────────────────────┐  │  │  │
│  │  │  │ Math Engine  │  │ Progress Manager     │  │  │  │
│  │  │  └──────────────┘  └──────────────────────┘  │  │  │
│  │  │  ┌──────────────┐  ┌──────────────────────┐  │  │  │
│  │  │  │ Input System │  │ Animation Controller │  │  │  │
│  │  │  └──────────────┘  └──────────────────────┘  │  │  │
│  │  │  ┌──────────────┐  ┌──────────────────────┐  │  │  │
│  │  │  │ Audio Manager│  │ UI Manager           │  │  │  │
│  │  │  └──────────────┘  └──────────────────────┘  │  │  │
│  │  └───────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Local Storage (Progress)                │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Design Principles

1. **Client-Side Only:** No backend server required, runs entirely in browser
2. **Privacy-First:** No data collection, all progress stored locally
3. **Educational Focus:** Aligned with Common Core 2nd grade math standards
4. **Kid-Friendly:** Large buttons, bright colors, encouraging feedback
5. **Accessible:** Touch and keyboard controls, color-blind friendly
6. **Performant:** 60 FPS gameplay, fast loading times

---

## Technology Stack

### Core Technologies

**Game Engine:**
- **Phaser 3.70+**: Industry-leading HTML5 game framework
  - Handles rendering (Canvas/WebGL)
  - Physics engine for animations
  - Asset management and loading
  - Scene management
  - Input handling

**Language:**
- **JavaScript ES6+**: Modern JavaScript features
  - Arrow functions
  - Classes and modules
  - Template literals
  - Destructuring
  - Async/await

**Build Tool:**
- **Vite**: Fast build tool and dev server
  - Hot Module Replacement (HMR)
  - Fast cold starts
  - Optimized production builds
  - ES modules support

### Testing

**Unit Testing:**
- **Jest**: JavaScript testing framework
  - Fast test execution
  - Snapshot testing
  - Code coverage reports
  - Mocking capabilities

**E2E Testing:**
- **Playwright**: Cross-browser testing
  - Tests on Chrome, Firefox, Safari
  - Headless and headed modes
  - Screenshot and video capture
  - Network mocking

### Development Tools

- **npm**: Package management
- **ESLint**: Code linting (planned)
- **Prettier**: Code formatting (planned)
- **Git**: Version control
- **GitHub Pages**: Static hosting

---

## Component Architecture

### Scene Structure

The game uses Phaser's scene-based architecture with four main scenes:

#### 1. BootScene
**Purpose:** Asset loading and initialization

**Responsibilities:**
- Display loading progress bar
- Preload all game assets (sprites, sounds, fonts)
- Initialize game registry for global data
- Transition to MenuScene when complete

**Files:**
- `src/scenes/BootScene.js`

**Key Methods:**
```javascript
preload()           // Load all assets
create()            // Setup loading UI
updateProgress()    // Update loading bar
```

#### 2. MenuScene
**Purpose:** Main menu and difficulty selection

**Responsibilities:**
- Display game title and mascot
- Show difficulty selection buttons
- Instructions and parent information
- Audio mute toggle
- Navigate to GameScene

**Files:**
- `src/scenes/MenuScene.js`

**Key Methods:**
```javascript
create()              // Setup menu UI
onDifficultySelect()  // Handle difficulty choice
showInstructions()    // Display instructions modal
showParentInfo()      // Show educational info
```

#### 3. GameScene
**Purpose:** Main gameplay loop

**Responsibilities:**
- Render jungle environment
- Display gorilla character
- Present math questions
- Accept and validate answers
- Show feedback animations
- Track score and progress
- Handle pause/resume

**Files:**
- `src/scenes/GameScene.js`
- `src/entities/Gorilla.js`
- `src/entities/Banana.js`
- `src/entities/Vine.js`
- `src/ui/NumberPad.js`
- `src/ui/QuestionDisplay.js`
- `src/ui/FeedbackPanel.js`
- `src/ui/ProgressBar.js`

**Key Methods:**
```javascript
create()              // Initialize game
presentQuestion()     // Display question
handleAnswer()        // Process input
validateAnswer()      // Check correctness
updateProgress()      // Update score/progress
pauseGame()          // Pause functionality
```

#### 4. ResultsScene
**Purpose:** Display level completion results

**Responsibilities:**
- Show final score and statistics
- Calculate and display stars (1-3)
- Show bananas collected
- Provide replay/continue options
- Save progress to localStorage

**Files:**
- `src/scenes/ResultsScene.js`

**Key Methods:**
```javascript
create()              // Setup results UI
calculateStars()      // Determine star rating
displayStats()        // Show performance
onReplay()           // Restart level
onContinue()         // Next level/menu
```

### System Modules

#### MathEngine
**Purpose:** Question generation and validation

**Location:** `src/systems/MathEngine.js`

**Responsibilities:**
- Load question bank from JSON
- Generate questions based on difficulty
- Validate player answers
- Prevent immediate question repeats
- Support multiple question formats

**Key Features:**
- Difficulty levels: Easy (0-20), Medium (0-50), Hard (0-100)
- Question types: Equations, word problems
- Answer validation with "close" detection
- Recent question tracking to avoid repeats

**Data Structure:**
```javascript
{
  questionId: string,
  type: 'equation' | 'word-problem',
  difficulty: 'easy' | 'medium' | 'hard',
  operation: 'addition' | 'subtraction',
  questionText: string,
  answer: number,
  visualHint: boolean,
  values: { a: number, b: number }
}
```

#### ProgressManager
**Purpose:** Track and persist player progress

**Location:** `src/systems/ProgressManager.js`

**Responsibilities:**
- Track current session score and accuracy
- Count correct/incorrect answers
- Manage banana collection
- Calculate star ratings
- Save/load progress from localStorage
- Track high scores per difficulty

**Persistent Data:**
```javascript
{
  currentLevel: number,
  difficulty: string,
  score: number,
  correctAnswers: number,
  totalAnswers: number,
  bananasCollected: number,
  starsEarned: number,
  levelsCompleted: Array<number>,
  highScores: {
    easy: number,
    medium: number,
    hard: number
  }
}
```

#### InputManager
**Purpose:** Handle all player input

**Location:** `src/systems/InputManager.js`

**Responsibilities:**
- Keyboard event listeners (numbers, Enter, Escape)
- Mouse/touch handlers for number pad
- Input validation (numbers only)
- Visual input feedback
- Enable/disable input during animations

**Supported Inputs:**
- Keyboard: 0-9, Enter, Backspace, Escape
- Mouse: Click on number pad buttons
- Touch: Tap on number pad (tablet)

#### AnimationController
**Purpose:** Coordinate game animations

**Location:** `src/systems/AnimationController.js`

**Responsibilities:**
- Gorilla sprite animations (idle, swing, celebrate, thinking)
- Vine swinging physics
- Banana collection effects
- Particle effects
- Animation queuing

**Animation Types:**
- Sprite animations (frame-based)
- Tweens (position, scale, alpha)
- Particle emitters (banana collect, celebration)

#### AudioManager
**Purpose:** Manage sound effects and music

**Location:** `src/systems/AudioManager.js`

**Responsibilities:**
- Load and cache audio files
- Play sound effects
- Manage background music
- Handle mute/unmute
- Volume control

**Sounds:**
- `correct-answer.mp3`: Positive chime
- `wrong-answer.mp3`: Gentle "oops"
- `banana-collect.mp3`: Pickup sound
- `swing.mp3`: Whoosh effect
- `celebrate.mp3`: Victory fanfare
- `button-click.mp3`: UI feedback

#### UIManager
**Purpose:** Manage UI overlays and HUD

**Location:** `src/systems/UIManager.js`

**Responsibilities:**
- Create and update HUD (score, bananas, timer)
- Display question panels
- Show feedback messages
- Number pad overlay
- Pause menu
- Modal dialogs

---

## Data Flow

### Question Flow Diagram

```
┌─────────────────┐
│   MathEngine    │
│   generates     │──┐
│   question      │  │
└─────────────────┘  │
                     ▼
┌─────────────────────────────────┐
│     GameScene                   │
│  - Displays question            │
│  - Waits for input              │
└─────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────┐
│   InputManager                  │
│  - Captures keyboard/touch      │
│  - Validates format             │
└─────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────┐
│   MathEngine                    │
│  - Validates answer             │
│  - Returns result               │
└─────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────┐
│   GameScene                     │
│  - Shows feedback               │
│  - Updates progress             │
│  - Animates gorilla             │
└─────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────┐
│   ProgressManager               │
│  - Updates score                │
│  - Saves to localStorage        │
└─────────────────────────────────┘
```

### State Machine (GameScene)

```javascript
const GameStates = {
  PRESENTING_QUESTION: 'presenting',
  WAITING_INPUT: 'waiting',
  VALIDATING: 'validating',
  SHOWING_FEEDBACK: 'feedback',
  ANIMATING: 'animating',
  PAUSED: 'paused',
  COMPLETE: 'complete'
};
```

**State Transitions:**
1. **PRESENTING_QUESTION** → Display question → **WAITING_INPUT**
2. **WAITING_INPUT** → Player submits → **VALIDATING**
3. **VALIDATING** → Check answer → **SHOWING_FEEDBACK**
4. **SHOWING_FEEDBACK** → After delay → **ANIMATING** (if correct) or **WAITING_INPUT** (if incorrect)
5. **ANIMATING** → Animation complete → **PRESENTING_QUESTION** or **COMPLETE**
6. **Any state** → Pause pressed → **PAUSED** → Resume → Return to previous state
7. **COMPLETE** → All questions done → Transition to **ResultsScene**

---

## Module Descriptions

### Utility Modules

#### constants.js
**Purpose:** Game-wide constants and configuration

**Location:** `src/utils/constants.js`

**Contents:**
```javascript
export const GAME_CONFIG = {
  WIDTH: 1024,
  HEIGHT: 768,
  SCALE_MODE: 'FIT',
  PHYSICS: 'ARCADE'
};

export const DIFFICULTY = {
  EASY: { min: 0, max: 20, questions: 5 },
  MEDIUM: { min: 0, max: 50, questions: 5 },
  HARD: { min: 0, max: 100, questions: 5 }
};

export const SCORING = {
  CORRECT_ANSWER: 100,
  BANANA: 10,
  STAR_THRESHOLDS: [60, 80, 95]
};

export const ANIMATIONS = {
  GORILLA_SWING_DURATION: 1000,
  FEEDBACK_DISPLAY_TIME: 2000,
  CELEBRATION_DURATION: 3000
};

export const COLORS = {
  CORRECT: '#4CAF50',
  INCORRECT: '#FF9800',
  PRIMARY: '#2196F3',
  BANANA_YELLOW: '#FFD700'
};
```

#### helpers.js
**Purpose:** Utility helper functions

**Location:** `src/utils/helpers.js`

**Functions:**
```javascript
randomInt(min, max)              // Random integer in range
shuffleArray(array)              // Fisher-Yates shuffle
formatNumber(num)                // Format for display
calculatePercentage(part, total) // Calculate percentage
clamp(value, min, max)          // Clamp value to range
getRandomElement(array)         // Random array element
```

#### validators.js
**Purpose:** Input validation functions

**Location:** `src/utils/validators.js`

**Functions:**
```javascript
isValidNumber(input)      // Check if valid number
isInRange(num, min, max)  // Range validation
sanitizeInput(input)      // Clean user input
validateAnswer(input, expected) // Answer validation
```

### Data Files

#### questions.json
**Purpose:** Question bank for all difficulties

**Location:** `src/data/questions.json`

**Structure:**
```json
{
  "easy": [
    {
      "id": "add_easy_001",
      "type": "equation",
      "operation": "addition",
      "template": "{a} + {b} = ?",
      "minValue": 0,
      "maxValue": 10,
      "visualHint": true
    }
  ],
  "medium": [...],
  "hard": [...]
}
```

#### feedback-messages.json
**Purpose:** Encouraging feedback messages

**Location:** `src/data/feedback-messages.json`

**Structure:**
```json
{
  "correct": [
    "Great job!",
    "You're a math whiz!",
    "Perfect!",
    "Awesome!"
  ],
  "incorrect_close": [
    "Almost there!",
    "So close!",
    "Try again!"
  ],
  "incorrect_far": [
    "Not quite, try again!",
    "Let's think about this!",
    "Keep trying!"
  ]
}
```

---

## Design Decisions

### Why Phaser 3?

**Chosen:** Phaser 3 game engine

**Alternatives Considered:**
- Plain HTML5 Canvas
- Three.js
- PixiJS
- Unity WebGL

**Reasons:**
1. **Purpose-Built:** Designed specifically for 2D games
2. **Complete:** Built-in physics, animations, audio, input
3. **Well-Documented:** Extensive docs and community examples
4. **Performant:** Optimized rendering pipeline
5. **Free:** Open-source, no licensing costs
6. **Browser-Native:** No plugins required

### Why Client-Side Only?

**Chosen:** No backend server

**Alternatives Considered:**
- Node.js backend with database
- Firebase/BaaS solution
- PHP with MySQL

**Reasons:**
1. **Privacy:** No data collection required
2. **Cost:** Free hosting on GitHub Pages
3. **Simplicity:** No server maintenance
4. **Speed:** No network latency
5. **COPPA Compliance:** Easier without data collection
6. **Offline Capable:** Works without internet

### Why localStorage for Progress?

**Chosen:** Browser localStorage API

**Alternatives Considered:**
- Cookies
- IndexedDB
- sessionStorage
- Cloud storage

**Reasons:**
1. **Simple API:** Easy to use, no overhead
2. **Persistent:** Survives browser restarts
3. **Privacy:** Data never leaves device
4. **No Authentication:** No login required
5. **Sufficient Capacity:** 5-10MB is plenty

**Limitations:**
- Progress lost if localStorage cleared
- Not shared across devices
- No cloud backup

### Why Scene-Based Architecture?

**Chosen:** Phaser's scene system

**Alternatives Considered:**
- Single scene with state management
- Custom routing system

**Reasons:**
1. **Separation of Concerns:** Each scene has clear purpose
2. **Memory Management:** Phaser handles cleanup
3. **State Isolation:** Scenes don't interfere
4. **Transitions:** Built-in scene transitions
5. **Best Practice:** Recommended Phaser pattern

### Why No User Accounts?

**Chosen:** No login/authentication system

**Alternatives Considered:**
- Email login
- Social login (Google, etc.)
- Anonymous accounts

**Reasons:**
1. **Privacy:** COPPA compliance for children
2. **Simplicity:** Removes barrier to entry
3. **Speed:** Play immediately
4. **No Backend:** Consistent with architecture
5. **Target Audience:** 7-8 year olds don't need accounts

---

## Performance Considerations

### Asset Optimization

**Images:**
- PNG-8 for UI elements (smaller file size)
- PNG-24 for sprites (better quality)
- Sprite sheets to reduce HTTP requests
- Image compression (TinyPNG)
- Max texture atlas size: 2048x2048px

**Audio:**
- MP3 format (primary)
- OGG format (fallback for Firefox)
- 128 kbps bit rate
- Maximum 200KB per file
- Lazy loading on first user interaction

**Fonts:**
- Web fonts (WOFF2 format)
- Preload critical fonts
- Fallback to system fonts

### Loading Strategy

**Boot Scene:**
1. Show progress bar immediately
2. Load assets in order of importance:
   - Critical UI elements first
   - Gorilla sprites second
   - Background images third
   - Audio last (lazy load)
3. Target: Complete in under 3 seconds

**Lazy Loading:**
- Audio loaded on first user interaction (browser restriction)
- Non-critical assets loaded in background
- Future levels loaded during gameplay

### Rendering Optimization

**Frame Rate:**
- Target: 60 FPS
- Phaser's optimized WebGL renderer
- Object pooling for particles
- Minimal DOM manipulation

**Memory Management:**
- Destroy unused objects
- Clear particle emitters
- Scene cleanup on transition
- Target: Under 150MB memory usage

### Code Optimization

**Minification:**
- Vite handles JavaScript minification
- Tree shaking removes unused code
- Production build ~250KB gzipped

**Caching:**
- Browser caches all assets
- localStorage caches progress
- Vite generates cache-busting hashes

---

## Security and Privacy

### Privacy-First Design

**No Data Collection:**
- No analytics tracking
- No error reporting to servers
- No telemetry
- No cookies

**Local Storage Only:**
- Progress stored on device
- No transmission to servers
- User can clear anytime
- No personal information stored

**COPPA Compliance:**
- No personal information collected
- No user accounts
- No communication features
- No third-party integrations
- Age-appropriate content only

### Input Validation

**User Input:**
- Validate all inputs client-side
- Sanitize input to prevent injection
- Accept numbers only (0-9)
- No eval() or dynamic code execution

**XSS Prevention:**
- No innerHTML with user data
- Phaser text rendering is safe
- No external script loading
- Content Security Policy compatible

### Safe Dependencies

**Dependency Management:**
- Regular npm audit
- Pin major versions
- Review dependencies for security
- Minimal dependency tree

**Phaser Security:**
- Mature, battle-tested framework
- Active community monitoring
- Regular security updates

---

## Future Enhancements

### Planned Features

**Educational:**
- More difficulty levels
- Multiplication/division (3rd grade)
- Fractions (4th grade)
- Progress reports for parents

**Gameplay:**
- More levels per difficulty
- Time challenge mode
- Multiplayer (local)
- Achievement badges

**Technical:**
- Progressive Web App (PWA)
- Service worker for offline
- Better accessibility (ARIA labels)
- Multiple language support

### Extensibility

**Adding New Question Types:**
1. Update `src/data/questions.json`
2. Add template with placeholders
3. MathEngine automatically handles

**Adding New Difficulty Levels:**
1. Update `src/utils/constants.js`
2. Add to MenuScene buttons
3. Add questions to questions.json

**Adding New Animations:**
1. Create sprite sheets
2. Add to AnimationController
3. Call from appropriate scenes

---

## Development Guidelines

### Code Style

**File Naming:**
- PascalCase for classes: `MathEngine.js`
- camelCase for utilities: `helpers.js`
- kebab-case for data: `feedback-messages.json`

**Function Naming:**
- Verbs for actions: `calculateScore()`, `updateProgress()`
- Boolean getters: `isCorrect()`, `hasCompleted()`
- Event handlers: `onButtonClick()`, `handleAnswer()`

**Comments:**
```javascript
/**
 * Validates player's answer against correct answer
 * @param {string} userInput - Raw user input
 * @param {number} correctAnswer - Expected answer
 * @returns {Object} Validation result with feedback
 */
validateAnswer(userInput, correctAnswer) {
  // Implementation
}
```

### Testing Standards

**Unit Tests:**
- Test all public methods
- Test edge cases
- Mock external dependencies
- Target 80%+ coverage

**E2E Tests:**
- Test critical user paths
- Test on all supported browsers
- Test responsive layouts
- Include accessibility tests

---

## Conclusion

This architecture provides:
- Clear separation of concerns
- Maintainable code structure
- Performance optimization
- Privacy and security
- Educational value
- Extensibility for future features

For implementation details, see:
- [Installation Guide](./INSTALLATION.md)
- [Usage Guide](./USAGE.md)
- [Testing Guide](./TESTING.md)

---

**Document Version:** 1.0
**Last Updated:** 2025-11-08
**Based on:** .context-foundry/architecture.md
