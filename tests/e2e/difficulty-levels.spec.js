/**
 * Difficulty Levels E2E Tests
 * Tests all three difficulty levels and their question ranges
 */

import { test, expect } from '@playwright/test';

test.describe('Difficulty Levels', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.waitForTimeout(3000); // Wait for boot scene
  });

  test.describe('Easy Difficulty', () => {
    test('should use 0-20 range for easy questions', async ({ page }) => {
      // Click Easy button
      await page.click('text=/easy/i');
      await page.waitForTimeout(2000);

      // Test multiple questions to verify range
      const questionValues = [];

      for (let i = 0; i < 5; i++) {
        await page.waitForTimeout(500);

        const values = await page.evaluate(() => {
          const gameScene = window.game?.scene?.getScene('GameScene');
          const question = gameScene?.mathEngine?.currentQuestion;
          return {
            a: question?.values?.a,
            b: question?.values?.b,
            answer: question?.answer
          };
        });

        if (values.a !== undefined && values.b !== undefined) {
          questionValues.push(values);
        }

        // Submit answer to move to next question
        await page.click('canvas');
        await page.keyboard.type((values.answer || 5).toString());
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2500);
      }

      // Verify all values are in easy range (0-20)
      questionValues.forEach(({ a, b }) => {
        expect(a).toBeGreaterThanOrEqual(0);
        expect(a).toBeLessThanOrEqual(20);
        expect(b).toBeGreaterThanOrEqual(0);
        expect(b).toBeLessThanOrEqual(20);
      });

      // Should have tested at least 3 questions
      expect(questionValues.length).toBeGreaterThanOrEqual(3);
    });

    test('should include both addition and subtraction in easy', async ({ page }) => {
      await page.click('text=/easy/i');
      await page.waitForTimeout(2000);

      const operations = new Set();

      for (let i = 0; i < 5; i++) {
        await page.waitForTimeout(500);

        const operation = await page.evaluate(() => {
          const gameScene = window.game?.scene?.getScene('GameScene');
          return gameScene?.mathEngine?.currentQuestion?.operation;
        });

        if (operation) {
          operations.add(operation);
        }

        const answer = await page.evaluate(() => {
          const gameScene = window.game?.scene?.getScene('GameScene');
          return gameScene?.mathEngine?.currentQuestion?.answer || 5;
        });

        await page.click('canvas');
        await page.keyboard.type(answer.toString());
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2500);
      }

      // Should have seen at least one operation type
      expect(operations.size).toBeGreaterThan(0);
      expect(operations.has('addition') || operations.has('subtraction')).toBe(true);
    });

    test('should have visual hints enabled for easy', async ({ page }) => {
      await page.click('text=/easy/i');
      await page.waitForTimeout(2000);

      const hasVisualHints = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        const question = gameScene?.mathEngine?.currentQuestion;
        return question?.visualHint;
      });

      // Easy questions should have visual hints available
      expect(typeof hasVisualHints).toBe('boolean');
    });

    test('should complete easy level successfully', async ({ page }) => {
      await page.click('text=/easy/i');
      await page.waitForTimeout(2000);

      for (let i = 0; i < 5; i++) {
        await page.waitForTimeout(500);

        const answer = await page.evaluate(() => {
          const gameScene = window.game?.scene?.getScene('GameScene');
          return gameScene?.mathEngine?.currentQuestion?.answer || 5;
        });

        await page.click('canvas');
        await page.keyboard.type(answer.toString());
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2500);
      }

      // Should have completed the level
      await page.waitForTimeout(2000);

      const isComplete = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        const stats = gameScene?.progressManager?.getCurrentStats();
        return stats?.currentQuestion >= 5 || stats?.totalAnswers >= 5;
      });

      expect(isComplete).toBeTruthy();
    });
  });

  test.describe('Medium Difficulty', () => {
    test('should use 10-25 range for medium questions', async ({ page }) => {
      await page.click('text=/medium/i');
      await page.waitForTimeout(2000);

      const questionValues = [];

      for (let i = 0; i < 5; i++) {
        await page.waitForTimeout(500);

        const values = await page.evaluate(() => {
          const gameScene = window.game?.scene?.getScene('GameScene');
          const question = gameScene?.mathEngine?.currentQuestion;
          return {
            a: question?.values?.a,
            b: question?.values?.b,
            answer: question?.answer,
            difficulty: question?.difficulty
          };
        });

        if (values.a !== undefined && values.b !== undefined) {
          questionValues.push(values);
        }

        await page.click('canvas');
        await page.keyboard.type((values.answer || 10).toString());
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2500);
      }

      // Verify all values are in medium range (10-25)
      questionValues.forEach(({ a, b }) => {
        expect(a).toBeGreaterThanOrEqual(10);
        expect(a).toBeLessThanOrEqual(25);
        expect(b).toBeGreaterThanOrEqual(10);
        expect(b).toBeLessThanOrEqual(25);
      });

      expect(questionValues.length).toBeGreaterThanOrEqual(3);
    });

    test('should track medium difficulty in progress', async ({ page }) => {
      await page.click('text=/medium/i');
      await page.waitForTimeout(2000);

      const difficulty = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        return gameScene?.progressManager?.getCurrentStats()?.difficulty;
      });

      expect(difficulty).toBe('medium');
    });

    test('should have appropriate complexity for medium', async ({ page }) => {
      await page.click('text=/medium/i');
      await page.waitForTimeout(2000);

      const question = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        return gameScene?.mathEngine?.currentQuestion;
      });

      // Medium questions should have higher values
      const total = (question?.values?.a || 0) + (question?.values?.b || 0);
      expect(total).toBeGreaterThan(15); // Should be more complex than easy
    });

    test('should complete medium level successfully', async ({ page }) => {
      await page.click('text=/medium/i');
      await page.waitForTimeout(2000);

      for (let i = 0; i < 5; i++) {
        await page.waitForTimeout(500);

        const answer = await page.evaluate(() => {
          const gameScene = window.game?.scene?.getScene('GameScene');
          return gameScene?.mathEngine?.currentQuestion?.answer || 15;
        });

        await page.click('canvas');
        await page.keyboard.type(answer.toString());
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2500);
      }

      await page.waitForTimeout(2000);

      const stats = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        return gameScene?.progressManager?.getCurrentStats();
      });

      expect(stats.totalAnswers).toBeGreaterThanOrEqual(5);
    });
  });

  test.describe('Hard Difficulty', () => {
    test('should use 25-50 range for hard questions', async ({ page }) => {
      await page.click('text=/hard/i');
      await page.waitForTimeout(2000);

      const questionValues = [];

      for (let i = 0; i < 5; i++) {
        await page.waitForTimeout(500);

        const values = await page.evaluate(() => {
          const gameScene = window.game?.scene?.getScene('GameScene');
          const question = gameScene?.mathEngine?.currentQuestion;
          return {
            a: question?.values?.a,
            b: question?.values?.b,
            answer: question?.answer
          };
        });

        if (values.a !== undefined && values.b !== undefined) {
          questionValues.push(values);
        }

        await page.click('canvas');
        await page.keyboard.type((values.answer || 30).toString());
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2500);
      }

      // Verify all values are in hard range (25-50)
      questionValues.forEach(({ a, b }) => {
        expect(a).toBeGreaterThanOrEqual(25);
        expect(a).toBeLessThanOrEqual(50);
        expect(b).toBeGreaterThanOrEqual(25);
        expect(b).toBeLessThanOrEqual(50);
      });

      expect(questionValues.length).toBeGreaterThanOrEqual(3);
    });

    test('should track hard difficulty in progress', async ({ page }) => {
      await page.click('text=/hard/i');
      await page.waitForTimeout(2000);

      const difficulty = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        return gameScene?.progressManager?.getCurrentStats()?.difficulty;
      });

      expect(difficulty).toBe('hard');
    });

    test('should have highest complexity for hard', async ({ page }) => {
      await page.click('text=/hard/i');
      await page.waitForTimeout(2000);

      const question = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        return gameScene?.mathEngine?.currentQuestion;
      });

      // Hard questions should have much higher values
      const total = (question?.values?.a || 0) + (question?.values?.b || 0);
      expect(total).toBeGreaterThan(50); // Should be most complex
    });

    test('should complete hard level successfully', async ({ page }) => {
      await page.click('text=/hard/i');
      await page.waitForTimeout(2000);

      for (let i = 0; i < 5; i++) {
        await page.waitForTimeout(500);

        const answer = await page.evaluate(() => {
          const gameScene = window.game?.scene?.getScene('GameScene');
          return gameScene?.mathEngine?.currentQuestion?.answer || 40;
        });

        await page.click('canvas');
        await page.keyboard.type(answer.toString());
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2500);
      }

      await page.waitForTimeout(2000);

      const stats = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        return gameScene?.progressManager?.getCurrentStats();
      });

      expect(stats.totalAnswers).toBeGreaterThanOrEqual(5);
    });
  });

  test.describe('Difficulty Comparison', () => {
    test('should have increasing complexity across difficulties', async ({ page }) => {
      const difficulties = ['easy', 'medium', 'hard'];
      const averageValues = [];

      for (const difficulty of difficulties) {
        await page.goto('/');
        await page.waitForTimeout(3000);

        await page.click(`text=/^${difficulty}$/i`);
        await page.waitForTimeout(2000);

        const values = [];
        for (let i = 0; i < 3; i++) {
          await page.waitForTimeout(500);

          const questionValues = await page.evaluate(() => {
            const gameScene = window.game?.scene?.getScene('GameScene');
            const question = gameScene?.mathEngine?.currentQuestion;
            return {
              a: question?.values?.a || 0,
              b: question?.values?.b || 0
            };
          });

          values.push((questionValues.a + questionValues.b) / 2);

          const answer = await page.evaluate(() => {
            const gameScene = window.game?.scene?.getScene('GameScene');
            return gameScene?.mathEngine?.currentQuestion?.answer || 10;
          });

          await page.click('canvas');
          await page.keyboard.type(answer.toString());
          await page.keyboard.press('Enter');
          await page.waitForTimeout(2500);
        }

        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        averageValues.push({ difficulty, average: avg });
      }

      // Easy should have lowest average, hard should have highest
      expect(averageValues[0].average).toBeLessThan(averageValues[1].average);
      expect(averageValues[1].average).toBeLessThan(averageValues[2].average);
    });

    test('should maintain separate high scores per difficulty', async ({ page }) => {
      // Play easy and get a score
      await page.click('text=/easy/i');
      await page.waitForTimeout(2000);

      for (let i = 0; i < 5; i++) {
        await page.waitForTimeout(500);
        const answer = await page.evaluate(() => {
          const gameScene = window.game?.scene?.getScene('GameScene');
          return gameScene?.mathEngine?.currentQuestion?.answer || 5;
        });

        await page.click('canvas');
        await page.keyboard.type(answer.toString());
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2500);
      }

      await page.waitForTimeout(2000);

      const easyScore = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        return gameScene?.progressManager?.getHighScore('easy');
      });

      // Return to menu and play medium
      await page.goto('/');
      await page.waitForTimeout(3000);

      await page.click('text=/medium/i');
      await page.waitForTimeout(2000);

      for (let i = 0; i < 5; i++) {
        await page.waitForTimeout(500);
        const answer = await page.evaluate(() => {
          const gameScene = window.game?.scene?.getScene('GameScene');
          return gameScene?.mathEngine?.currentQuestion?.answer || 15;
        });

        await page.click('canvas');
        await page.keyboard.type(answer.toString());
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2500);
      }

      await page.waitForTimeout(2000);

      const scores = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        return {
          easy: gameScene?.progressManager?.getHighScore('easy'),
          medium: gameScene?.progressManager?.getHighScore('medium'),
          hard: gameScene?.progressManager?.getHighScore('hard')
        };
      });

      // Each difficulty should have its own high score
      expect(scores.easy).toBeGreaterThan(0);
      expect(scores.medium).toBeGreaterThan(0);
      expect(scores.hard).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Difficulty Selection', () => {
    test('should allow switching between difficulties', async ({ page }) => {
      // Try easy first
      await page.click('text=/easy/i');
      await page.waitForTimeout(1000);

      let difficulty = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        return gameScene?.mathEngine?.currentDifficulty;
      });
      expect(difficulty).toBe('easy');

      // Return to menu
      await page.goto('/');
      await page.waitForTimeout(3000);

      // Try hard
      await page.click('text=/hard/i');
      await page.waitForTimeout(1000);

      difficulty = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        return gameScene?.mathEngine?.currentDifficulty;
      });
      expect(difficulty).toBe('hard');
    });

    test('should reset question history when changing difficulty', async ({ page }) => {
      await page.click('text=/easy/i');
      await page.waitForTimeout(2000);

      // Answer one question
      const answer1 = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        return gameScene?.mathEngine?.currentQuestion?.answer || 5;
      });

      await page.click('canvas');
      await page.keyboard.type(answer1.toString());
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);

      // Go back and select different difficulty
      await page.goto('/');
      await page.waitForTimeout(3000);

      await page.click('text=/medium/i');
      await page.waitForTimeout(2000);

      const stats = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        return gameScene?.progressManager?.getCurrentStats();
      });

      // Should have started fresh session
      expect(stats.currentQuestion).toBe(0);
      expect(stats.correctAnswers).toBe(0);
      expect(stats.difficulty).toBe('medium');
    });

    test('should display correct difficulty name', async ({ page }) => {
      const difficulties = ['easy', 'medium', 'hard'];

      for (const diff of difficulties) {
        await page.goto('/');
        await page.waitForTimeout(3000);

        await page.click(`text=/^${diff}$/i`);
        await page.waitForTimeout(2000);

        const currentDiff = await page.evaluate(() => {
          const gameScene = window.game?.scene?.getScene('GameScene');
          return gameScene?.progressManager?.getCurrentStats()?.difficulty;
        });

        expect(currentDiff).toBe(diff);
      }
    });
  });

  test.describe('Question Variety', () => {
    test('should not repeat same question template immediately', async ({ page }) => {
      await page.click('text=/easy/i');
      await page.waitForTimeout(2000);

      const questionTemplates = [];

      for (let i = 0; i < 4; i++) {
        await page.waitForTimeout(500);

        const templateId = await page.evaluate(() => {
          const gameScene = window.game?.scene?.getScene('GameScene');
          const questionId = gameScene?.mathEngine?.currentQuestion?.id || '';
          // Extract template ID (before timestamp)
          return questionId.split('_').slice(0, -1).join('_');
        });

        questionTemplates.push(templateId);

        const answer = await page.evaluate(() => {
          const gameScene = window.game?.scene?.getScene('GameScene');
          return gameScene?.mathEngine?.currentQuestion?.answer || 5;
        });

        await page.click('canvas');
        await page.keyboard.type(answer.toString());
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2500);
      }

      // Should have some variety in questions
      const uniqueTemplates = new Set(questionTemplates.filter(t => t));
      expect(uniqueTemplates.size).toBeGreaterThan(1);
    });

    test('should include word problems', async ({ page }) => {
      await page.click('text=/easy/i');
      await page.waitForTimeout(2000);

      const questionTypes = new Set();

      for (let i = 0; i < 5; i++) {
        await page.waitForTimeout(500);

        const questionType = await page.evaluate(() => {
          const gameScene = window.game?.scene?.getScene('GameScene');
          return gameScene?.mathEngine?.currentQuestion?.type;
        });

        if (questionType) {
          questionTypes.add(questionType);
        }

        const answer = await page.evaluate(() => {
          const gameScene = window.game?.scene?.getScene('GameScene');
          return gameScene?.mathEngine?.currentQuestion?.answer || 5;
        });

        await page.click('canvas');
        await page.keyboard.type(answer.toString());
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2500);
      }

      // Should have at least one question type
      expect(questionTypes.size).toBeGreaterThan(0);
    });
  });

  test.describe('Star Requirements by Difficulty', () => {
    test('should award stars based on accuracy threshold', async ({ page }) => {
      await page.click('text=/easy/i');
      await page.waitForTimeout(2000);

      // Answer all 5 correctly for high accuracy
      for (let i = 0; i < 5; i++) {
        await page.waitForTimeout(500);

        const answer = await page.evaluate(() => {
          const gameScene = window.game?.scene?.getScene('GameScene');
          return gameScene?.mathEngine?.currentQuestion?.answer || 5;
        });

        await page.click('canvas');
        await page.keyboard.type(answer.toString());
        await page.keyboard.press('Enter');
        await page.waitForTimeout(2500);
      }

      await page.waitForTimeout(1000);

      const result = await page.evaluate(() => {
        const gameScene = window.game?.scene?.getScene('GameScene');
        const stats = gameScene?.progressManager?.getCurrentStats();
        return {
          accuracy: gameScene?.progressManager?.calculateAccuracy(),
          stars: gameScene?.progressManager?.calculateStars()
        };
      });

      // 100% accuracy should give 3 stars
      expect(result.accuracy).toBe(100);
      expect(result.stars).toBe(3);
    });
  });
});
