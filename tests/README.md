# Test Suite Documentation

## Gorilla Tag Fun Math Game - Comprehensive Test Suite

This directory contains all tests for the Gorilla Tag Fun Math Game, including unit tests, integration tests, and end-to-end browser tests.

## Table of Contents

- [Overview](#overview)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Unit Tests](#unit-tests)
- [E2E Tests](#e2e-tests)
- [Coverage Requirements](#coverage-requirements)
- [Writing New Tests](#writing-new-tests)
- [Troubleshooting](#troubleshooting)

## Overview

The test suite is designed to ensure:
- **Code Quality:** 80%+ code coverage
- **Functional Correctness:** All game mechanics work as intended
- **Cross-Browser Compatibility:** Works on Chrome, Firefox, Safari
- **Accessibility:** WCAG 2.1 AA compliance
- **Performance:** 60 FPS gameplay, <3s load time

### Testing Stack

- **Unit Tests:** Jest + jsdom
- **E2E Tests:** Playwright
- **Coverage:** Istanbul/nyc

## Test Structure

```
tests/
├── unit/                          # Unit tests (Jest)
│   ├── MathEngine.test.js        # Question generation & validation
│   ├── ProgressManager.test.js   # Score tracking & localStorage
│   └── validators.test.js        # Input validation utilities
│
├── e2e/                          # End-to-end browser tests (Playwright)
│   ├── gameplay.spec.js          # Complete gameplay flow
│   ├── difficulty-levels.spec.js # All three difficulty levels
│   └── accessibility.spec.js     # Keyboard nav & accessibility
│
├── __mocks__/                    # Mock files for Jest
│   ├── fileMock.js              # Asset file mocks
│   └── styleMock.js             # CSS file mocks
│
├── setup.js                      # Jest setup and utilities
└── README.md                     # This file
```

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm test

# Run unit tests only
npm run test:unit

# Run with coverage report
npm run test:coverage

# Watch mode (re-run on file changes)
npm test -- --watch

# Run specific test file
npm test -- MathEngine.test.js
```

### E2E Tests

**IMPORTANT:** E2E tests require the dev server to be running.

```bash
# Option 1: Run tests (starts dev server automatically)
npm run test:e2e

# Option 2: Manual server control
# Terminal 1:
npm run dev

# Terminal 2:
npm run test:e2e

# Run in headed mode (see browser)
npm run test:e2e:headed

# Run in UI mode (interactive)
npm run test:e2e:ui

# Debug mode
npm run test:e2e:debug

# Run on specific browser
npm run test:e2e:chrome
npm run test:e2e:firefox
npm run test:e2e:safari

# Run on tablet viewport
npm run test:e2e:ipad
```

### All Tests

```bash
# Run both unit and E2E tests
npm run test:all
```

## Unit Tests

### MathEngine.test.js

Tests the core math question generation and validation system.

**Coverage:**
- Question generation within difficulty ranges
- Answer validation (correct/incorrect)
- Question variety and non-repetition
- Addition and subtraction operations
- Fallback question handling
- Input sanitization

**Key Test Cases:**
```javascript
// Question generation
test('generates question within easy difficulty range (0-10)')
test('generates addition with correct answer')
test('generates subtraction with non-negative answer')

// Answer validation
test('validates correct string answer')
test('identifies close answers (within 2)')
test('rejects invalid input')

// Edge cases
test('handles empty question pool gracefully')
test('generates unique question IDs')
```

### ProgressManager.test.js

Tests score tracking, star calculation, and progress persistence.

**Coverage:**
- Session initialization and management
- Score and answer tracking
- Accuracy and star calculation
- localStorage save/load
- High score tracking per difficulty
- Level completion tracking

**Key Test Cases:**
```javascript
// Score management
test('increments score correctly')
test('records correct and incorrect answers')

// Star calculation
test('awards 3 stars for 95%+ accuracy')
test('awards 2 stars for 80-94% accuracy')
test('awards 1 star for 60-79% accuracy')

// Persistence
test('saves progress to localStorage')
test('loads progress from localStorage')
test('handles corrupted localStorage data')
```

### validators.test.js

Tests all input validation and sanitization functions.

**Coverage:**
- Number validation
- Range validation
- Input sanitization
- Answer validation
- Difficulty validation
- Question structure validation

**Key Test Cases:**
```javascript
// Input validation
test('validates valid numbers')
test('rejects invalid numbers')

// Sanitization
test('removes whitespace')
test('removes non-numeric characters')
test('preserves negative sign at start')

// Answer validation
test('validates correct answer')
test('identifies close answers')
test('sanitizes input before validation')
```

## E2E Tests

### gameplay.spec.js

Tests the complete gameplay flow in a real browser.

**Coverage:**
- Game loading and initialization
- Question display and navigation
- Answer input (keyboard and UI)
- Correct/incorrect answer handling
- Score tracking during gameplay
- Level completion
- Results screen display

**Key Test Cases:**
```javascript
test('should load game successfully')
test('should start game when difficulty is selected')
test('should validate correct answer')
test('should handle incorrect answer with retry')
test('should complete a full 5-question level')
test('should track score throughout game')
test('should save progress to localStorage')
```

### difficulty-levels.spec.js

Tests all three difficulty levels and their question ranges.

**Coverage:**
- Easy difficulty (0-20 range)
- Medium difficulty (10-25 range)
- Hard difficulty (25-50 range)
- Question variety per difficulty
- Difficulty switching
- Separate high scores

**Key Test Cases:**
```javascript
test('should use 0-20 range for easy questions')
test('should use 10-25 range for medium questions')
test('should use 25-50 range for hard questions')
test('should have increasing complexity across difficulties')
test('should maintain separate high scores per difficulty')
test('should not repeat same question template immediately')
```

### accessibility.spec.js

Tests keyboard navigation, console errors, and accessibility features.

**Coverage:**
- Keyboard navigation (Tab, Enter, Escape)
- Console error detection
- Visual accessibility (text sizes, contrast)
- Screen reader support
- Touch and mouse support
- Performance (FPS, load time)

**Key Test Cases:**
```javascript
test('should support Tab key navigation')
test('should submit answer with Enter key')
test('should have no console errors during gameplay')
test('should have readable text sizes')
test('should have sufficient color contrast')
test('should maintain 60 FPS during gameplay')
test('should load within acceptable time')
```

## Coverage Requirements

The test suite aims for **80%+ code coverage** across all metrics:

- **Statements:** 80%+
- **Branches:** 80%+
- **Functions:** 80%+
- **Lines:** 80%+

### Viewing Coverage

```bash
# Generate coverage report
npm run test:coverage

# Open HTML coverage report
open coverage/index.html
```

Coverage reports show:
- Which lines are covered/uncovered
- Which branches are tested
- Which functions are executed
- Overall coverage percentages

## Writing New Tests

### Adding Unit Tests

1. Create a new test file in `tests/unit/`
2. Import the module to test
3. Use `describe()` and `test()` blocks
4. Follow AAA pattern: Arrange, Act, Assert

**Example:**
```javascript
import MyModule from '../../src/systems/MyModule.js';

describe('MyModule', () => {
  let module;

  beforeEach(() => {
    module = new MyModule();
  });

  test('should do something', () => {
    // Arrange
    const input = 'test';

    // Act
    const result = module.doSomething(input);

    // Assert
    expect(result).toBe('expected');
  });
});
```

### Adding E2E Tests

1. Create a new spec file in `tests/e2e/`
2. Import Playwright test utilities
3. Use `test.describe()` and `test()` blocks
4. Start each test with `page.goto('/')`

**Example:**
```javascript
import { test, expect } from '@playwright/test';

test.describe('My Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(3000);
  });

  test('should work correctly', async ({ page }) => {
    // Interact with the page
    await page.click('button');

    // Assert result
    await expect(page.locator('.result')).toBeVisible();
  });
});
```

## Troubleshooting

### Unit Tests

**Problem:** "Cannot find module" errors

**Solution:** Check import paths are correct and use absolute paths from project root.

```javascript
// Correct
import MathEngine from '../../src/systems/MathEngine.js';

// Incorrect
import MathEngine from 'src/systems/MathEngine.js';
```

**Problem:** localStorage not working

**Solution:** The setup file mocks localStorage. Use it normally in tests.

**Problem:** Phaser errors in unit tests

**Solution:** Phaser is mocked in setup.js. Don't test Phaser-specific features in unit tests.

### E2E Tests

**Problem:** "Target closed" or "Navigation timeout"

**Solution:** Increase timeout or wait for page to load:
```javascript
await page.waitForTimeout(3000);
await page.waitForLoadState('networkidle');
```

**Problem:** "Element not found" errors

**Solution:** Verify selectors and add waits:
```javascript
await expect(page.locator('text=/easy/i')).toBeVisible({ timeout: 5000 });
```

**Problem:** Dev server not starting

**Solution:** Check port 5173 is available:
```bash
lsof -i :5173
kill -9 <PID>
```

**Problem:** Tests pass locally but fail in CI

**Solution:**
- Increase timeouts for slower CI environments
- Use `test.setTimeout(60000)` for slow tests
- Ensure CI has all required dependencies

### Debugging Tips

**Unit Tests:**
```bash
# Add --verbose for detailed output
npm test -- --verbose

# Run only one test
npm test -- -t "specific test name"

# Use console.log() in tests
test('my test', () => {
  console.log('Debug info:', myVariable);
  expect(myVariable).toBe('value');
});
```

**E2E Tests:**
```bash
# Run in headed mode to see browser
npm run test:e2e:headed

# Use debug mode to step through tests
npm run test:e2e:debug

# Take screenshots
await page.screenshot({ path: 'debug.png' });

# Check console logs
page.on('console', msg => console.log('Browser:', msg.text()));
```

## Best Practices

### Unit Tests

1. **Test One Thing:** Each test should verify one specific behavior
2. **Use Descriptive Names:** Test names should explain what is being tested
3. **Avoid Test Interdependence:** Tests should not depend on each other
4. **Mock External Dependencies:** Use mocks for localStorage, Phaser, etc.
5. **Test Edge Cases:** Include tests for boundary conditions and error cases

### E2E Tests

1. **Wait for Elements:** Always wait for elements before interacting
2. **Use Specific Selectors:** Prefer text or data attributes over CSS classes
3. **Test User Flows:** Test complete user journeys, not isolated actions
4. **Clean State:** Clear localStorage and start fresh for each test
5. **Handle Timing:** Use appropriate waits for animations and transitions

## Continuous Integration

Tests run automatically on:
- Every push to the repository
- Every pull request
- Before deployment

CI Configuration (GitHub Actions):
```yaml
- name: Run Unit Tests
  run: npm test

- name: Run E2E Tests
  run: npm run test:e2e
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://testingjavascript.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Support

For questions or issues with tests:
1. Check this README
2. Review test examples
3. Check console output for errors
4. Open an issue on GitHub

---

**Happy Testing!** 🧪🎮🍌
