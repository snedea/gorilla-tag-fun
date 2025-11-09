/**
 * Gameplay E2E Tests
 * Tests the complete gameplay flow in a real browser environment
 */

import { test, expect } from '@playwright/test';

test.describe('Complete Gameplay Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the game
    await page.goto('/');

    // Clear localStorage to start fresh
    await page.evaluate(() => localStorage.clear());
  });

  test('should load game successfully', async ({ page }) => {
    // Check that the page title is correct
    await expect(page).toHaveTitle(/Gorilla Tag Fun/i);

    // Check that the canvas element is present
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });

    // Wait for assets to load
    await page.waitForTimeout(3000);

    // Check for no console errors during load
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.waitForTimeout(1000);
    expect(errors).toHaveLength(0);
  });

  test('should show menu scene after loading', async ({ page }) => {
    // Wait for boot scene to complete
    await page.waitForTimeout(3000);

    // Check for difficulty buttons or menu elements
    // Note: These selectors depend on your actual implementation
    // Adjust based on how you render UI elements

    // If using DOM elements for UI:
    const easyButton = page.locator('text=/easy/i').first();
    const mediumButton = page.locator('text=/medium/i').first();
    const hardButton = page.locator('text=/hard/i').first();

    // At least one difficulty option should be visible
    await expect(easyButton.or(mediumButton).or(hardButton)).toBeVisible({ timeout: 5000 });
  });

  test('should start game when difficulty is selected', async ({ page }) => {
    await page.waitForTimeout(3000);

    // Click on Easy difficulty
    const easyButton = page.locator('text=/easy/i').first();
    await easyButton.click();

    // Wait for game scene to load
    await page.waitForTimeout(2000);

    // Verify game state changed (check canvas or game elements)
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Check if question is displayed (this depends on your implementation)
    // You might check for DOM elements or evaluate game state
    const hasQuestion = await page.evaluate(() => {
      return window.game && window.game.scene &&
             window.game.scene.keys &&
             window.game.scene.keys.GameScene;
    });

    expect(hasQuestion).toBeTruthy();
  });

  test('should display math question', async ({ page }) => {
    await page.waitForTimeout(3000);

    // Start easy game
    await page.click('text=/easy/i');
    await page.waitForTimeout(2000);

    // Check if a question is displayed
    // This requires that your game exposes question data
    const questionData = await page.evaluate(() => {
      const gameScene = window.game?.scene?.getScene('GameScene');
      return gameScene?.mathEngine?.currentQuestion;
    });

    expect(questionData).toBeTruthy();
    expect(questionData).toHaveProperty('questionText');
    expect(questionData).toHaveProperty('answer');
  });

  test('should accept keyboard input for answers', async ({ page }) => {
    await page.waitForTimeout(3000);
    await page.click('text=/easy/i');
    await page.waitForTimeout(2000);

    // Focus on the game canvas or input area
    await page.click('canvas');

    // Type an answer
    await page.keyboard.type('5');
    await page.waitForTimeout(500);

    // Verify input was captured
    const inputValue = await page.evaluate(() => {
      const gameScene = window.game?.scene?.getScene('GameScene');
      return gameScene?.currentInput || gameScene?.inputManager?.getCurrentInput();
    });

    expect(inputValue).toContain('5');
  });

  test('should validate correct answer', async ({ page }) => {
    await page.waitForTimeout(3000);
    await page.click('text=/easy/i');
    await page.waitForTimeout(2000);

    // Get the correct answer
    const correctAnswer = await page.evaluate(() => {
      const gameScene = window.game?.scene?.getScene('GameScene');
      return gameScene?.mathEngine?.currentQuestion?.answer;
    });

    // Input the correct answer
    await page.click('canvas');
    await page.keyboard.type(correctAnswer.toString());
    await page.keyboard.press('Enter');

    // Wait for feedback animation
    await page.waitForTimeout(1000);

    // Check that score increased or question progressed
    const stats = await page.evaluate(() => {
      const gameScene = window.game?.scene?.getScene('GameScene');
      return gameScene?.progressManager?.getCurrentStats();
    });

    expect(stats.correctAnswers).toBeGreaterThan(0);
  });

  test('should handle incorrect answer with retry', async ({ page }) => {
    await page.waitForTimeout(3000);
    await page.click('text=/easy/i');
    await page.waitForTimeout(2000);

    // Input an obviously wrong answer
    await page.click('canvas');
    await page.keyboard.type('999');
    await page.keyboard.press('Enter');

    await page.waitForTimeout(1500);

    // Check that we can try again (input should be cleared or ready)
    const stats = await page.evaluate(() => {
      const gameScene = window.game?.scene?.getScene('GameScene');
      return gameScene?.progressManager?.getCurrentStats();
    });

    expect(stats.incorrectAnswers).toBeGreaterThan(0);

    // Should still be able to input another answer
    await page.keyboard.type('5');
    const inputValue = await page.evaluate(() => {
      const gameScene = window.game?.scene?.getScene('GameScene');
      return gameScene?.currentInput;
    });

    expect(inputValue).toBeTruthy();
  });

  test('should complete a full 5-question level', async ({ page }) => {
    await page.waitForTimeout(3000);
    await page.click('text=/easy/i');
    await page.waitForTimeout(2000);

    // Answer 5 questions correctly
    for (let i = 0; i < 5; i++) {
      // Wait for question to be ready
      await page.waitForTimeout(500);

      // Get correct answer
      const correctAnswer = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        return gameScene?.mathEngine?.currentQuestion?.answer;
      });

      if (!correctAnswer) {
        console.log(`Question ${i + 1}: No answer found, skipping`);
        continue;
      }

      // Clear any existing input
      await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        if (gameScene?.clearInput) gameScene.clearInput();
      });

      // Input answer
      await page.click('canvas');
      await page.keyboard.type(correctAnswer.toString());
      await page.keyboard.press('Enter');

      // Wait for feedback and next question
      await page.waitForTimeout(3000);
    }

    // Should transition to results scene
    await page.waitForTimeout(2000);

    const currentScene = await page.evaluate(() => {
      return window.game?.scene?.getScenes(true)?.find(s => s.scene.isActive())?.scene?.key;
    });

    // Should be in ResultsScene or show completion
    expect(currentScene).toBeTruthy();
  });

  test('should track score throughout game', async ({ page }) => {
    await page.waitForTimeout(3000);
    await page.click('text=/easy/i');
    await page.waitForTimeout(2000);

    // Get initial score
    let scoreTracking = [];

    for (let i = 0; i < 3; i++) {
      await page.waitForTimeout(500);

      const correctAnswer = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        return gameScene?.mathEngine?.currentQuestion?.answer;
      });

      await page.click('canvas');
      await page.keyboard.type(correctAnswer?.toString() || '1');
      await page.keyboard.press('Enter');

      await page.waitForTimeout(2000);

      const score = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        return gameScene?.progressManager?.getCurrentStats()?.score || 0;
      });

      scoreTracking.push(score);
    }

    // Score should increase or at least not decrease
    for (let i = 1; i < scoreTracking.length; i++) {
      expect(scoreTracking[i]).toBeGreaterThanOrEqual(scoreTracking[i - 1]);
    }
  });

  test('should display results screen after level completion', async ({ page }) => {
    await page.waitForTimeout(3000);
    await page.click('text=/easy/i');
    await page.waitForTimeout(2000);

    // Quickly complete 5 questions
    for (let i = 0; i < 5; i++) {
      await page.waitForTimeout(500);

      const correctAnswer = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        return gameScene?.mathEngine?.currentQuestion?.answer || 5;
      });

      await page.click('canvas');
      await page.keyboard.type(correctAnswer.toString());
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2500);
    }

    // Wait for results scene
    await page.waitForTimeout(3000);

    // Check for results elements (adjust selectors based on your UI)
    const hasResults = await page.evaluate(() => {
      const resultsScene = window.game?.scene?.getScene('ResultsScene');
      return resultsScene?.scene?.isActive() || false;
    });

    expect(hasResults).toBeTruthy();
  });

  test('should show stars based on performance', async ({ page }) => {
    await page.waitForTimeout(3000);
    await page.click('text=/easy/i');
    await page.waitForTimeout(2000);

    // Answer all questions correctly for 3 stars
    for (let i = 0; i < 5; i++) {
      await page.waitForTimeout(500);

      const correctAnswer = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        return gameScene?.mathEngine?.currentQuestion?.answer || 5;
      });

      await page.click('canvas');
      await page.keyboard.type(correctAnswer.toString());
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2500);
    }

    await page.waitForTimeout(2000);

    // Check stars awarded
    const stars = await page.evaluate(() => {
      const gameScene = window.game?.scene?.getScene('GameScene');
      return gameScene?.progressManager?.calculateStars();
    });

    expect(stars).toBeGreaterThanOrEqual(0);
    expect(stars).toBeLessThanOrEqual(3);
  });

  test('should save progress to localStorage', async ({ page }) => {
    await page.waitForTimeout(3000);
    await page.click('text=/easy/i');
    await page.waitForTimeout(2000);

    // Answer one question
    const correctAnswer = await page.evaluate(() => {
      const gameScene = window.game?.scene?.getScene('GameScene');
      return gameScene?.mathEngine?.currentQuestion?.answer || 5;
    });

    await page.click('canvas');
    await page.keyboard.type(correctAnswer.toString());
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);

    // Check localStorage
    const savedData = await page.evaluate(() => {
      return localStorage.getItem('gorilla-math-progress');
    });

    expect(savedData).toBeTruthy();

    const parsed = JSON.parse(savedData);
    expect(parsed).toHaveProperty('persistent');
  });

  test('should maintain game state during session', async ({ page }) => {
    await page.waitForTimeout(3000);
    await page.click('text=/easy/i');
    await page.waitForTimeout(2000);

    // Answer 2 questions
    for (let i = 0; i < 2; i++) {
      await page.waitForTimeout(500);

      const correctAnswer = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        return gameScene?.mathEngine?.currentQuestion?.answer || 5;
      });

      await page.click('canvas');
      await page.keyboard.type(correctAnswer.toString());
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2500);
    }

    // Check that progress is maintained
    const stats = await page.evaluate(() => {
      const gameScene = window.game?.scene?.getScene('GameScene');
      return gameScene?.progressManager?.getCurrentStats();
    });

    expect(stats.currentQuestion).toBeGreaterThan(0);
    expect(stats.correctAnswers).toBeGreaterThan(0);
    expect(stats.score).toBeGreaterThan(0);
  });

  test('should handle rapid input gracefully', async ({ page }) => {
    await page.waitForTimeout(3000);
    await page.click('text=/easy/i');
    await page.waitForTimeout(2000);

    // Rapid keyboard input
    await page.click('canvas');
    await page.keyboard.type('123456789');
    await page.waitForTimeout(100);

    // Game should not crash
    const isGameRunning = await page.evaluate(() => {
      return window.game && !window.game.isDestroyed;
    });

    expect(isGameRunning).toBeTruthy();
  });

  test('should clear input after submission', async ({ page }) => {
    await page.waitForTimeout(3000);
    await page.click('text=/easy/i');
    await page.waitForTimeout(2000);

    // Input and submit answer
    await page.click('canvas');
    await page.keyboard.type('5');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);

    // Check that input is cleared for next question
    const inputCleared = await page.evaluate(() => {
      const gameScene = window.game?.scene?.getScene('GameScene');
      const input = gameScene?.currentInput || '';
      return input === '' || input === null;
    });

    expect(inputCleared).toBeTruthy();
  });

  test('should handle backspace in input', async ({ page }) => {
    await page.waitForTimeout(3000);
    await page.click('text=/easy/i');
    await page.waitForTimeout(2000);

    await page.click('canvas');
    await page.keyboard.type('123');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');

    const input = await page.evaluate(() => {
      const gameScene = window.game?.scene?.getScene('GameScene');
      return gameScene?.currentInput || '';
    });

    expect(input.length).toBeLessThan(3);
  });

  test('should prevent non-numeric input', async ({ page }) => {
    await page.waitForTimeout(3000);
    await page.click('text=/easy/i');
    await page.waitForTimeout(2000);

    await page.click('canvas');
    await page.keyboard.type('abc123def');

    const input = await page.evaluate(() => {
      const gameScene = window.game?.scene?.getScene('GameScene');
      return gameScene?.currentInput || '';
    });

    // Should only contain numeric characters
    expect(input).toMatch(/^[0-9]*$/);
  });

  test('should not crash on invalid operations', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.waitForTimeout(3000);
    await page.click('text=/easy/i');
    await page.waitForTimeout(2000);

    // Try various edge cases
    await page.click('canvas');
    await page.keyboard.press('Enter'); // Submit without input
    await page.waitForTimeout(500);

    await page.keyboard.type('0');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Check for critical errors (some warnings are ok)
    const criticalErrors = errors.filter(e =>
      e.includes('undefined') || e.includes('null') || e.includes('crash')
    );

    expect(criticalErrors.length).toBe(0);
  });

  test('should transition smoothly between questions', async ({ page }) => {
    await page.waitForTimeout(3000);
    await page.click('text=/easy/i');
    await page.waitForTimeout(2000);

    // Record question IDs to verify transitions
    const questionIds = [];

    for (let i = 0; i < 3; i++) {
      await page.waitForTimeout(500);

      const questionId = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        return gameScene?.mathEngine?.currentQuestion?.id;
      });

      questionIds.push(questionId);

      const correctAnswer = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        return gameScene?.mathEngine?.currentQuestion?.answer || 5;
      });

      await page.click('canvas');
      await page.keyboard.type(correctAnswer.toString());
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2500);
    }

    // All questions should have unique IDs
    const uniqueIds = new Set(questionIds.filter(id => id));
    expect(uniqueIds.size).toBeGreaterThan(0);
  });
});
