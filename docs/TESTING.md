# Testing Guide - Gorilla Tag Fun Math Game

Comprehensive testing documentation for developers and contributors.

## Table of Contents

1. [Testing Overview](#testing-overview)
2. [Running Tests](#running-tests)
3. [Unit Tests](#unit-tests)
4. [Integration Tests](#integration-tests)
5. [End-to-End Tests](#end-to-end-tests)
6. [Test Coverage](#test-coverage)
7. [Writing New Tests](#writing-new-tests)
8. [CI/CD Integration](#cicd-integration)
9. [Troubleshooting Tests](#troubleshooting-tests)

---

## Testing Overview

### Testing Strategy

The Gorilla Tag Fun Math Game uses a comprehensive testing strategy following the testing pyramid:

```
        ┌──────────────┐
        │     E2E      │  ← Browser Tests (Playwright)
        │  (Slow)      │     Full user flows
        └──────────────┘
              ▲
              │
      ┌───────────────┐
      │ Integration   │  ← System Tests (Jest)
      │  (Medium)     │     Component interactions
      └───────────────┘
              ▲
              │
    ┌─────────────────────┐
    │    Unit Tests       │  ← Function Tests (Jest)
    │     (Fast)          │     Individual functions
    └─────────────────────┘
```

### Test Types

**Unit Tests (Jest):**
- Test individual functions and classes
- Fast execution (milliseconds)
- No browser required
- Majority of test coverage

**Integration Tests (Jest):**
- Test interactions between modules
- Medium execution time (seconds)
- Mock external dependencies
- Verify system integration

**End-to-End Tests (Playwright):**
- Test complete user workflows
- Slow execution (minutes)
- Real browser environment
- Verify production-like behavior

### Current Test Status

Based on `.context-foundry/test-final-report.md`:

- **Status:** ALL TESTS PASSED
- **Total Tests:** 187/187 (100%)
- **Coverage:** 100% of core methods
- **Failures:** 0

**Test Breakdown:**
- MathEngine: 56 tests
- ProgressManager: 63 tests
- Validators: 68 tests

---

## Running Tests

### Quick Start

```bash
# Run all tests (unit + integration)
npm test

# Run unit tests only
npm run test:unit

# Run E2E tests (requires browser)
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

### Detailed Commands

#### Unit Tests

```bash
# Run all unit tests
npm run test:unit

# Run specific test file
npm test -- tests/unit/MathEngine.test.js

# Run tests in watch mode (auto-rerun on changes)
npm test -- --watch

# Run with coverage
npm run test:coverage

# Run verbose output
npm test -- --verbose

# Run specific test by name
npm test -- -t "validates correct answer"
```

#### Integration Tests

```bash
# Run integration tests
npm run test:integration

# Run specific integration test
npm test -- tests/integration/scene-transitions.test.js
```

#### End-to-End Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run in headed mode (see browser)
npm run test:e2e:headed

# Run with UI mode (interactive)
npm run test:e2e:ui

# Debug E2E tests
npm run test:e2e:debug

# Run on specific browser
npm run test:e2e:chrome
npm run test:e2e:firefox
npm run test:e2e:safari

# Run specific test file
npx playwright test tests/e2e/gameplay.spec.js

# Run specific test by name
npx playwright test -g "should complete a level"
```

### Test Output

**Successful Test Run:**
```
PASS  tests/unit/MathEngine.test.js
  MathEngine
    ✓ generates question within difficulty range (3ms)
    ✓ validates correct answer (2ms)
    ✓ rejects invalid input (1ms)
    ✓ does not repeat questions immediately (4ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Time:        1.234s
```

**Failed Test Run:**
```
FAIL  tests/unit/MathEngine.test.js
  MathEngine
    ✓ generates question within difficulty range (3ms)
    ✗ validates correct answer (12ms)

  ● MathEngine › validates correct answer

    expect(received).toBe(expected)

    Expected: true
    Received: false

      23 |     const result = engine.validateAnswer('12', 12);
      24 |
    > 25 |     expect(result.correct).toBe(true);
         |                            ^
      26 |   });
```

---

## Unit Tests

### Test Structure

All unit tests are located in `tests/unit/` and follow this naming convention:
- `[ModuleName].test.js`

### MathEngine Tests

**File:** `tests/unit/MathEngine.test.js`

**What's Tested:**
- Question generation for all difficulty levels
- Answer validation (correct, incorrect, close)
- Difficulty range enforcement
- Input sanitization
- No immediate question repeats
- Edge cases (null, undefined, invalid input)

**Example Test:**
```javascript
describe('MathEngine', () => {
  test('generates question within difficulty range', () => {
    const engine = new MathEngine();
    engine.setDifficulty('easy');
    const question = engine.getNextQuestion();

    expect(question.values.a).toBeGreaterThanOrEqual(0);
    expect(question.values.a).toBeLessThanOrEqual(20);
    expect(question.values.b).toBeGreaterThanOrEqual(0);
    expect(question.values.b).toBeLessThanOrEqual(20);
  });

  test('validates correct answer', () => {
    const engine = new MathEngine();
    const result = engine.validateAnswer('12', 12);

    expect(result.valid).toBe(true);
    expect(result.correct).toBe(true);
  });

  test('rejects invalid input', () => {
    const engine = new MathEngine();
    const result = engine.validateAnswer('abc', 12);

    expect(result.valid).toBe(false);
  });
});
```

**Running MathEngine Tests:**
```bash
npm test -- tests/unit/MathEngine.test.js
```

### ProgressManager Tests

**File:** `tests/unit/ProgressManager.test.js`

**What's Tested:**
- Score tracking and incrementing
- Answer recording (correct/incorrect)
- Accuracy calculation
- Star calculation based on thresholds
- localStorage save/load operations
- High score tracking per difficulty
- Level completion tracking
- Data import/export functionality

**Example Test:**
```javascript
describe('ProgressManager', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('calculates accuracy correctly', () => {
    const manager = new ProgressManager();
    manager.recordAnswer(true);
    manager.recordAnswer(true);
    manager.recordAnswer(false);

    const accuracy = manager.calculateAccuracy();
    expect(accuracy).toBeCloseTo(66.67, 1);
  });

  test('saves progress to localStorage', () => {
    const manager = new ProgressManager();
    manager.incrementScore(200);
    manager.saveProgress();

    const saved = JSON.parse(localStorage.getItem('gorilla-math-progress'));
    expect(saved.score).toBe(200);
  });

  test('loads progress from localStorage', () => {
    const manager1 = new ProgressManager();
    manager1.incrementScore(300);
    manager1.saveProgress();

    const manager2 = new ProgressManager();
    manager2.loadProgress();

    expect(manager2.getCurrentStats().score).toBe(300);
  });
});
```

**Running ProgressManager Tests:**
```bash
npm test -- tests/unit/ProgressManager.test.js
```

### Validators Tests

**File:** `tests/unit/validators.test.js`

**What's Tested:**
- Number validation
- Range checking
- Input sanitization (XSS prevention)
- Non-numeric character removal
- Answer validation logic
- Difficulty validation
- Player name validation
- Edge cases and error handling

**Example Test:**
```javascript
describe('Validators', () => {
  test('validates numbers correctly', () => {
    expect(isValidNumber('123')).toBe(true);
    expect(isValidNumber('0')).toBe(true);
    expect(isValidNumber('-5')).toBe(true);
    expect(isValidNumber('abc')).toBe(false);
    expect(isValidNumber('')).toBe(false);
  });

  test('sanitizes input', () => {
    expect(sanitizeInput('  123  ')).toBe('123');
    expect(sanitizeInput('12.5')).toBe('12');
    expect(sanitizeInput('1a2b3')).toBe('123');
  });

  test('validates range', () => {
    expect(isInRange(5, 0, 10)).toBe(true);
    expect(isInRange(15, 0, 10)).toBe(false);
    expect(isInRange(-1, 0, 10)).toBe(false);
  });
});
```

**Running Validators Tests:**
```bash
npm test -- tests/unit/validators.test.js
```

---

## Integration Tests

Integration tests verify that different modules work together correctly.

**Location:** `tests/integration/`

### Scene Transitions Tests

**File:** `tests/integration/scene-transitions.test.js`

**What's Tested:**
- Boot → Menu transition
- Menu → Game transition with difficulty data
- Game → Results transition on completion
- Scene cleanup and initialization

**Example Test:**
```javascript
describe('Scene Transitions', () => {
  let game;

  beforeEach(() => {
    game = createTestGame();
  });

  afterEach(() => {
    game.destroy(true);
  });

  test('transitions from Menu to Game with difficulty', (done) => {
    const menuScene = game.scene.getScene('MenuScene');
    menuScene.selectDifficulty('easy');

    game.events.on('scene-transition', (toScene, data) => {
      expect(toScene).toBe('GameScene');
      expect(data.difficulty).toBe('easy');
      done();
    });
  });
});
```

### Game Flow Tests

**File:** `tests/integration/game-flow.test.js`

**What's Tested:**
- Complete question cycle (present → answer → validate → feedback)
- State transitions in GameScene
- Score updates after correct answers
- Progress bar updates

---

## End-to-End Tests

E2E tests use Playwright to test the complete application in real browsers.

**Location:** `tests/e2e/`

**Configuration:** `playwright.config.js`

### Setup

**Install Playwright Browsers:**
```bash
npx playwright install
```

**Browsers Tested:**
- Chromium (Chrome/Edge)
- WebKit (Safari)
- Firefox
- iPad viewport

### Gameplay Tests

**File:** `tests/e2e/gameplay.spec.js`

**What's Tested:**
- Loading the game
- Selecting difficulty
- Answering questions correctly
- Answering questions incorrectly
- Completing a full level
- Viewing results screen
- Keyboard input
- Touch input (on tablet viewport)
- Pause/resume functionality

**Example Test:**
```javascript
import { test, expect } from '@playwright/test';

test('should load game and complete a level', async ({ page }) => {
  // Navigate to game
  await page.goto('/');

  // Wait for boot scene to load
  await expect(page.locator('canvas')).toBeVisible();

  // Wait for menu
  await page.waitForTimeout(3000);

  // Select easy difficulty
  await page.click('text=Easy');
  await page.waitForTimeout(1000);

  // Answer 5 questions
  for (let i = 0; i < 5; i++) {
    // Get correct answer
    const answer = await page.evaluate(() => {
      return window.gameScene.currentQuestion.answer;
    });

    // Input answer
    await page.keyboard.type(answer.toString());
    await page.keyboard.press('Enter');

    // Wait for feedback and animation
    await page.waitForTimeout(3000);
  }

  // Should show results
  await expect(page.locator('text=Level Complete')).toBeVisible();

  // Should show 3 stars (100% accuracy)
  const stars = page.locator('.star.filled');
  await expect(stars).toHaveCount(3);
});
```

**Running Gameplay Tests:**
```bash
npm run test:e2e -- tests/e2e/gameplay.spec.js
```

### Difficulty Levels Tests

**File:** `tests/e2e/difficulty-levels.spec.js`

**What's Tested:**
- Easy mode uses 0-20 range
- Medium mode uses 0-50 range
- Hard mode uses 0-100 range
- Question generation respects difficulty

### Progress Tracking Tests

**File:** `tests/e2e/progress-tracking.spec.js`

**What's Tested:**
- Progress saves to localStorage
- Progress persists after page reload
- Banana count increments
- High scores tracked per difficulty

### Responsive Design Tests

**File:** `tests/e2e/responsive.spec.js`

**What's Tested:**
- Desktop resolution (1920x1080)
- Tablet resolution (1024x768)
- iPad viewport
- Touch targets minimum 44x44px
- Touch interactions work

### Accessibility Tests

**File:** `tests/e2e/accessibility.spec.js`

**What's Tested:**
- Keyboard navigation
- Focus indicators
- Contrast ratios
- Font sizes (minimum 24px)
- No console errors

**Example Test:**
```javascript
test('supports keyboard navigation', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(3000);

  // Tab to first button
  await page.keyboard.press('Tab');

  // Should focus on Easy button
  const focused = await page.evaluate(() =>
    document.activeElement.textContent
  );
  expect(focused).toContain('Easy');

  // Press Enter to select
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);

  // Should start game
  await expect(page.locator('.question-text')).toBeVisible();
});
```

### Performance Tests

**File:** `tests/e2e/performance.spec.js`

**What's Tested:**
- Load time under 3 seconds
- Frame rate at 60 FPS
- Memory usage under 150MB

---

## Test Coverage

### Generating Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# Open HTML coverage report
open coverage/lcov-report/index.html
```

### Coverage Metrics

**Current Coverage (from test-final-report.md):**
- MathEngine: 100%
- ProgressManager: 100%
- Validators: 100%

**Coverage Goals:**
- Unit Test Coverage: 80%+ (ACHIEVED: 100%)
- Integration Test Coverage: 70%+
- E2E Critical Paths: 100%

### Coverage Report Output

```
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------|---------|----------|---------|---------|-------------------
All files          |     100 |      100 |     100 |     100 |
 MathEngine.js     |     100 |      100 |     100 |     100 |
 ProgressManager.js|     100 |      100 |     100 |     100 |
 validators.js     |     100 |      100 |     100 |     100 |
-------------------|---------|----------|---------|---------|-------------------
```

---

## Writing New Tests

### Unit Test Template

**Location:** `tests/unit/NewModule.test.js`

```javascript
import { NewModule } from '../../src/systems/NewModule';

describe('NewModule', () => {
  let module;

  beforeEach(() => {
    // Setup before each test
    module = new NewModule();
  });

  afterEach(() => {
    // Cleanup after each test
    module = null;
  });

  describe('methodName', () => {
    test('should do expected behavior', () => {
      // Arrange
      const input = 'test';

      // Act
      const result = module.methodName(input);

      // Assert
      expect(result).toBe('expected');
    });

    test('should handle edge case', () => {
      expect(module.methodName(null)).toBe(null);
    });

    test('should throw error on invalid input', () => {
      expect(() => {
        module.methodName(undefined);
      }).toThrow('Expected error message');
    });
  });
});
```

### E2E Test Template

**Location:** `tests/e2e/new-feature.spec.js`

```javascript
import { test, expect } from '@playwright/test';

test.describe('New Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3000); // Wait for load
  });

  test('should perform expected action', async ({ page }) => {
    // Navigate to feature
    await page.click('text=Feature Button');

    // Interact with feature
    await page.fill('input#field', 'test value');
    await page.click('button#submit');

    // Verify result
    await expect(page.locator('.result')).toHaveText('Expected Result');
  });

  test('should handle error case', async ({ page }) => {
    await page.click('text=Feature Button');
    await page.click('button#submit'); // Submit without filling

    await expect(page.locator('.error')).toBeVisible();
  });
});
```

### Best Practices

**Unit Tests:**
- Test one thing per test
- Use descriptive test names
- Follow AAA pattern: Arrange, Act, Assert
- Mock external dependencies
- Clean up after tests (beforeEach/afterEach)

**E2E Tests:**
- Test user flows, not implementation
- Use data-testid attributes for selectors
- Wait for elements, don't use arbitrary timeouts
- Test happy path and error cases
- Take screenshots on failure (automatic in Playwright)

**General:**
- Keep tests independent (no shared state)
- Make tests deterministic (same input = same output)
- Test edge cases and error conditions
- Write readable test descriptions
- Don't test implementation details

---

## CI/CD Integration

### GitHub Actions Workflow

**File:** `.github/workflows/test.yml`

```yaml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage-final.json

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

### Running Tests Locally Before Push

```bash
# Full test suite
npm run test:all

# Quick pre-push check
npm test && npm run test:e2e:chrome
```

### Pre-commit Hooks (Optional)

**Install husky:**
```bash
npm install --save-dev husky
npx husky init
```

**Add pre-commit hook:**
```bash
# .husky/pre-commit
npm test
```

---

## Troubleshooting Tests

### Common Issues

#### Issue 1: Tests Timeout

**Problem:** Tests hang and timeout

**Solution:**
```bash
# Increase timeout in test
test('long running test', async () => {
  // code
}, 10000); // 10 second timeout

# Or in Playwright config
use: {
  timeout: 30000 // 30 seconds
}
```

#### Issue 2: localStorage Tests Fail

**Problem:** localStorage not available in test environment

**Solution:**
```javascript
// Mock localStorage in test setup
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;
```

#### Issue 3: Playwright Browser Not Found

**Problem:** "Executable doesn't exist" error

**Solution:**
```bash
# Install Playwright browsers
npx playwright install

# Install with system dependencies
npx playwright install --with-deps
```

#### Issue 4: Tests Pass Locally But Fail in CI

**Problem:** Environment differences

**Solution:**
- Check Node.js version matches
- Verify all dependencies installed
- Check for race conditions
- Review CI logs for specific error

#### Issue 5: Flaky E2E Tests

**Problem:** Tests pass/fail inconsistently

**Solution:**
```javascript
// Use waitFor instead of waitForTimeout
await page.waitForSelector('.element');

// Use retry logic
await expect(async () => {
  const text = await page.textContent('.element');
  expect(text).toBe('expected');
}).toPass({ timeout: 5000 });
```

### Debugging Tests

**Unit Tests:**
```bash
# Run with debugging
node --inspect-brk node_modules/.bin/jest --runInBand

# Use debugger statement
test('debug this test', () => {
  debugger;
  expect(true).toBe(true);
});
```

**E2E Tests:**
```bash
# Run in debug mode
npm run test:e2e:debug

# Run with UI mode (interactive)
npm run test:e2e:ui

# Run headed (see browser)
npm run test:e2e:headed
```

### Getting Help

**Resources:**
- Jest Documentation: https://jestjs.io/docs/getting-started
- Playwright Documentation: https://playwright.dev/
- GitHub Issues: Check existing issues
- Stack Overflow: Tag with `jest` or `playwright`

---

## Quick Reference

### Test Commands

```bash
# Unit Tests
npm test                    # Run all unit tests
npm run test:unit          # Run unit tests only
npm test -- --watch        # Watch mode
npm run test:coverage      # With coverage

# E2E Tests
npm run test:e2e           # All browsers
npm run test:e2e:headed    # Show browser
npm run test:e2e:debug     # Debug mode
npm run test:e2e:ui        # Interactive UI

# Specific Tests
npm test -- MathEngine.test.js        # Specific file
npm test -- -t "validates answer"     # Specific test
npx playwright test gameplay.spec.js  # E2E file
```

### Test Locations

```
tests/
├── unit/
│   ├── MathEngine.test.js
│   ├── ProgressManager.test.js
│   └── validators.test.js
├── integration/
│   ├── scene-transitions.test.js
│   └── game-flow.test.js
└── e2e/
    ├── gameplay.spec.js
    ├── difficulty-levels.spec.js
    ├── progress-tracking.spec.js
    ├── responsive.spec.js
    └── accessibility.spec.js
```

---

**Testing is key to maintaining quality! Write tests for all new features.**

For more information, see:
- [Installation Guide](./INSTALLATION.md)
- [Usage Guide](./USAGE.md)
- [Architecture Guide](./ARCHITECTURE.md)
