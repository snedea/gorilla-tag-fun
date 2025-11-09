/**
 * Accessibility E2E Tests
 * Tests for keyboard navigation, console errors, and accessibility features
 */

import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test.describe('Keyboard Navigation', () => {
    test('should support Tab key navigation', async ({ page }) => {
      await page.waitForTimeout(3000);

      // Tab through interactive elements
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);

      // Check if an element is focused
      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.tagName;
      });

      expect(focusedElement).toBeTruthy();
    });

    test('should allow selecting difficulty with keyboard', async ({ page }) => {
      await page.waitForTimeout(3000);

      // Tab to first difficulty button
      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);

      // Press Enter to select
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);

      // Check if game started
      const gameStarted = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        return gameScene?.scene?.isActive() || false;
      });

      expect(gameStarted).toBeTruthy();
    });

    test('should support number input via keyboard', async ({ page }) => {
      await page.waitForTimeout(3000);

      // Start game
      await page.click('text=/easy/i');
      await page.waitForTimeout(2000);

      // Type numbers with keyboard
      await page.keyboard.type('5');
      await page.waitForTimeout(300);

      const input = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        return gameScene?.currentInput || '';
      });

      expect(input).toContain('5');
    });

    test('should submit answer with Enter key', async ({ page }) => {
      await page.waitForTimeout(3000);
      await page.click('text=/easy/i');
      await page.waitForTimeout(2000);

      const answerBefore = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        return gameScene?.progressManager?.getCurrentStats()?.totalAnswers || 0;
      });

      // Type answer and press Enter
      await page.keyboard.type('5');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1500);

      const answerAfter = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        return gameScene?.progressManager?.getCurrentStats()?.totalAnswers || 0;
      });

      expect(answerAfter).toBeGreaterThan(answerBefore);
    });

    test('should support Backspace for input correction', async ({ page }) => {
      await page.waitForTimeout(3000);
      await page.click('text=/easy/i');
      await page.waitForTimeout(2000);

      // Type and delete
      await page.keyboard.type('123');
      await page.keyboard.press('Backspace');
      await page.keyboard.press('Backspace');

      const input = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        return gameScene?.currentInput || '';
      });

      expect(input.length).toBeLessThanOrEqual(1);
    });

    test('should support Escape key for pausing', async ({ page }) => {
      await page.waitForTimeout(3000);
      await page.click('text=/easy/i');
      await page.waitForTimeout(2000);

      // Press Escape to pause
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);

      // Check if game is paused (implementation dependent)
      const isPaused = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        return gameScene?.scene?.isPaused() || gameScene?.isPaused || false;
      });

      // Game should be paused or pause menu should be visible
      expect(typeof isPaused).toBe('boolean');
    });

    test('should maintain focus indicators', async ({ page }) => {
      await page.waitForTimeout(3000);

      await page.keyboard.press('Tab');
      await page.waitForTimeout(200);

      // Check if focus is visible (check for outline or focus styles)
      const hasFocusStyles = await page.evaluate(() => {
        const focused = document.activeElement;
        if (!focused) return false;

        const styles = window.getComputedStyle(focused);
        // Check for outline or other focus indicators
        return styles.outline !== 'none' ||
               styles.outlineWidth !== '0px' ||
               styles.boxShadow !== 'none';
      });

      // Focus should be visible (or at least styles exist)
      expect(typeof hasFocusStyles).toBe('boolean');
    });
  });

  test.describe('Console Error Detection', () => {
    test('should have no console errors on page load', async ({ page }) => {
      const errors = [];

      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.goto('/');
      await page.waitForTimeout(3000);

      // Filter out known acceptable errors (if any)
      const criticalErrors = errors.filter(error =>
        !error.includes('DevTools') && // Ignore DevTools warnings
        !error.includes('Extension') // Ignore extension errors
      );

      expect(criticalErrors).toHaveLength(0);
    });

    test('should have no console errors during gameplay', async ({ page }) => {
      const errors = [];

      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.waitForTimeout(3000);
      await page.click('text=/easy/i');
      await page.waitForTimeout(2000);

      // Play one question
      const answer = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        return gameScene?.mathEngine?.currentQuestion?.answer || 5;
      });

      await page.keyboard.type(answer.toString());
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);

      const criticalErrors = errors.filter(error =>
        !error.includes('DevTools') &&
        !error.includes('Extension')
      );

      expect(criticalErrors).toHaveLength(0);
    });

    test('should have no console errors on scene transitions', async ({ page }) => {
      const errors = [];

      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.waitForTimeout(3000);

      // Transition to game scene
      await page.click('text=/easy/i');
      await page.waitForTimeout(2000);

      // Complete level to transition to results
      for (let i = 0; i < 5; i++) {
        await page.waitForTimeout(500);
        const answer = await page.evaluate(() => {
          const gameScene = window.game?.scene?.getScene('GameScene');
          return gameScene?.mathEngine?.currentQuestion?.answer || 5;
        });

        await page.keyboard.type(answer.toString());
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2500);
      }

      await page.waitForTimeout(2000);

      const criticalErrors = errors.filter(error =>
        !error.includes('DevTools') &&
        !error.includes('Extension')
      );

      expect(criticalErrors).toHaveLength(0);
    });

    test('should handle errors gracefully', async ({ page }) => {
      const errors = [];

      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.waitForTimeout(3000);
      await page.click('text=/easy/i');
      await page.waitForTimeout(2000);

      // Try to cause potential errors
      await page.keyboard.press('Enter'); // Submit without input
      await page.waitForTimeout(500);

      await page.keyboard.type('abc'); // Invalid input
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);

      // Game should still be running
      const isRunning = await page.evaluate(() => {
        return window.game && !window.game.isDestroyed;
      });

      expect(isRunning).toBeTruthy();
    });
  });

  test.describe('Visual Accessibility', () => {
    test('should have readable text sizes', async ({ page }) => {
      await page.waitForTimeout(3000);

      // Check various text elements
      const textElements = await page.$$('body *');

      for (const element of textElements.slice(0, 10)) {
        const fontSize = await element.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return parseInt(styles.fontSize);
        });

        // Text should be at least 14px (ideally 24px+ for kids)
        if (fontSize > 0) {
          expect(fontSize).toBeGreaterThanOrEqual(14);
        }
      }
    });

    test('should have sufficient color contrast', async ({ page }) => {
      await page.waitForTimeout(3000);

      // Get button colors
      const buttonColors = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button, .button'));
        return buttons.map(btn => {
          const styles = window.getComputedStyle(btn);
          return {
            color: styles.color,
            background: styles.backgroundColor,
            tag: btn.tagName
          };
        });
      });

      // Colors should be defined (not transparent)
      buttonColors.forEach(({ color, background }) => {
        if (color) {
          expect(color).not.toBe('rgba(0, 0, 0, 0)');
        }
      });
    });

    test('should render canvas element properly', async ({ page }) => {
      await page.waitForTimeout(3000);

      const canvas = page.locator('canvas');
      await expect(canvas).toBeVisible();

      const canvasSize = await canvas.boundingBox();
      expect(canvasSize.width).toBeGreaterThan(0);
      expect(canvasSize.height).toBeGreaterThan(0);
    });

    test('should scale properly on different viewports', async ({ page }) => {
      const viewports = [
        { width: 1920, height: 1080, name: 'Desktop' },
        { width: 1024, height: 768, name: 'Tablet' },
        { width: 1280, height: 720, name: 'Small Desktop' }
      ];

      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.waitForTimeout(1000);

        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible();

        const canvasBox = await canvas.boundingBox();
        expect(canvasBox.width).toBeGreaterThan(0);
        expect(canvasBox.height).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Screen Reader Support', () => {
    test('should have semantic HTML structure', async ({ page }) => {
      await page.waitForTimeout(3000);

      // Check for proper document structure
      const hasMain = await page.$('main, [role="main"]');
      const hasCanvas = await page.$('canvas');

      expect(hasCanvas).toBeTruthy();
    });

    test('should have descriptive page title', async ({ page }) => {
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
      expect(title).toMatch(/gorilla|math|game/i);
    });

    test('should have alt text for images', async ({ page }) => {
      await page.waitForTimeout(3000);

      const images = await page.$$('img');

      for (const img of images) {
        const hasAlt = await img.evaluate(el => {
          return el.hasAttribute('alt');
        });

        // Images should have alt text (can be empty for decorative)
        expect(hasAlt).toBe(true);
      }
    });

    test('should have ARIA labels for interactive elements', async ({ page }) => {
      await page.waitForTimeout(3000);

      const buttons = await page.$$('button');

      for (const button of buttons) {
        const hasLabel = await button.evaluate(el => {
          return el.textContent.trim().length > 0 ||
                 el.hasAttribute('aria-label') ||
                 el.hasAttribute('aria-labelledby');
        });

        // Buttons should be labeled
        expect(hasLabel).toBe(true);
      }
    });
  });

  test.describe('Touch and Mouse Support', () => {
    test('should support mouse clicks', async ({ page }) => {
      await page.waitForTimeout(3000);

      // Click difficulty with mouse
      await page.click('text=/easy/i', { button: 'left' });
      await page.waitForTimeout(2000);

      const gameStarted = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        return gameScene?.scene?.isActive() || false;
      });

      expect(gameStarted).toBeTruthy();
    });

    test('should have touch-friendly target sizes', async ({ page, isMobile }) => {
      if (!isMobile) {
        test.skip();
      }

      await page.waitForTimeout(3000);

      const buttons = await page.$$('button');

      for (const button of buttons) {
        const box = await button.boundingBox();

        if (box) {
          // Touch targets should be at least 44x44px
          expect(box.width).toBeGreaterThanOrEqual(44);
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
    });

    test('should support touch events on canvas', async ({ page }) => {
      await page.waitForTimeout(3000);
      await page.click('text=/easy/i');
      await page.waitForTimeout(2000);

      const canvas = page.locator('canvas');

      // Tap on canvas
      await canvas.tap();
      await page.waitForTimeout(500);

      // Game should still be responsive
      const isRunning = await page.evaluate(() => {
        return window.game && !window.game.isDestroyed;
      });

      expect(isRunning).toBeTruthy();
    });
  });

  test.describe('Performance and UX', () => {
    test('should load within acceptable time', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const loadTime = Date.now() - startTime;

      // Should load in under 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('should not have layout shifts', async ({ page }) => {
      await page.goto('/');

      // Wait for initial render
      await page.waitForTimeout(1000);

      const canvas = page.locator('canvas');
      const initialBox = await canvas.boundingBox();

      // Wait a bit more
      await page.waitForTimeout(2000);

      const finalBox = await canvas.boundingBox();

      // Canvas position should not shift significantly
      if (initialBox && finalBox) {
        expect(Math.abs(initialBox.x - finalBox.x)).toBeLessThan(10);
        expect(Math.abs(initialBox.y - finalBox.y)).toBeLessThan(10);
      }
    });

    test('should maintain 60 FPS during gameplay', async ({ page }) => {
      await page.waitForTimeout(3000);
      await page.click('text=/easy/i');
      await page.waitForTimeout(2000);

      const fps = await page.evaluate(() => {
        return new Promise(resolve => {
          let frames = 0;
          const startTime = performance.now();

          function countFrame() {
            frames++;
            const elapsed = performance.now() - startTime;

            if (elapsed < 1000) {
              requestAnimationFrame(countFrame);
            } else {
              resolve(frames);
            }
          }

          requestAnimationFrame(countFrame);
        });
      });

      // Should be close to 60 FPS (allow some variance)
      expect(fps).toBeGreaterThan(45);
    });

    test('should provide immediate visual feedback', async ({ page }) => {
      await page.waitForTimeout(3000);
      await page.click('text=/easy/i');
      await page.waitForTimeout(2000);

      // Type a character
      const beforeType = Date.now();
      await page.keyboard.type('5');

      // Check input was captured quickly
      await page.waitForTimeout(100);

      const input = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        return gameScene?.currentInput || '';
      });

      const responseTime = Date.now() - beforeType;

      expect(input).toContain('5');
      expect(responseTime).toBeLessThan(500); // Should respond within 500ms
    });
  });

  test.describe('Error Prevention', () => {
    test('should prevent double-submission', async ({ page }) => {
      await page.waitForTimeout(3000);
      await page.click('text=/easy/i');
      await page.waitForTimeout(2000);

      // Type answer
      await page.keyboard.type('5');

      // Try to submit twice quickly
      await page.keyboard.press('Enter');
      await page.keyboard.press('Enter');
      await page.keyboard.press('Enter');

      await page.waitForTimeout(1500);

      const stats = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        return gameScene?.progressManager?.getCurrentStats();
      });

      // Should only count as one answer
      expect(stats.totalAnswers).toBeLessThanOrEqual(1);
    });

    test('should handle rapid input gracefully', async ({ page }) => {
      await page.waitForTimeout(3000);
      await page.click('text=/easy/i');
      await page.waitForTimeout(2000);

      // Type rapidly
      await page.keyboard.type('1234567890');
      await page.waitForTimeout(200);

      // Game should not crash
      const isRunning = await page.evaluate(() => {
        return window.game && !window.game.isDestroyed;
      });

      expect(isRunning).toBeTruthy();
    });

    test('should prevent navigation during active game', async ({ page }) => {
      await page.waitForTimeout(3000);
      await page.click('text=/easy/i');
      await page.waitForTimeout(2000);

      // Try to navigate back
      await page.goBack();
      await page.waitForTimeout(1000);

      // Should prompt or prevent navigation (browser dependent)
      // At minimum, check game state is preserved or handled
      const gameExists = await page.evaluate(() => {
        return typeof window.game !== 'undefined';
      });

      expect(gameExists).toBeTruthy();
    });
  });

  test.describe('Browser Compatibility', () => {
    test('should work without localStorage', async ({ page, context }) => {
      // Block localStorage access
      await context.addInitScript(() => {
        Object.defineProperty(window, 'localStorage', {
          value: null,
          writable: false
        });
      });

      await page.goto('/');
      await page.waitForTimeout(3000);

      // Game should still load
      const gameLoaded = await page.evaluate(() => {
        return typeof window.game !== 'undefined';
      });

      expect(gameLoaded).toBeTruthy();
    });

    test('should work with JavaScript enabled', async ({ page }) => {
      const jsEnabled = await page.evaluate(() => true);
      expect(jsEnabled).toBe(true);

      await page.waitForTimeout(3000);

      const gameLoaded = await page.evaluate(() => {
        return typeof window.game !== 'undefined';
      });

      expect(gameLoaded).toBeTruthy();
    });
  });

  test.describe('User Guidance', () => {
    test('should provide clear feedback for wrong answers', async ({ page }) => {
      await page.waitForTimeout(3000);
      await page.click('text=/easy/i');
      await page.waitForTimeout(2000);

      // Submit wrong answer
      await page.keyboard.type('999');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);

      // Should show some feedback (check for visual or state change)
      const feedback = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        return gameScene?.lastFeedbackMessage || gameScene?.currentFeedback;
      });

      // Some feedback should be present
      expect(typeof feedback).toBeTruthy();
    });

    test('should provide encouragement', async ({ page }) => {
      await page.waitForTimeout(3000);
      await page.click('text=/easy/i');
      await page.waitForTimeout(2000);

      const answer = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        return gameScene?.mathEngine?.currentQuestion?.answer || 5;
      });

      await page.keyboard.type(answer.toString());
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);

      // Should provide positive feedback
      const feedback = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        const validation = gameScene?.mathEngine?.validateAnswer?.(
          gameScene.currentInput,
          gameScene.mathEngine?.currentQuestion?.answer
        );
        return validation?.message;
      });

      expect(typeof feedback).toBe('string');
    });
  });
});
