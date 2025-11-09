# Testing Quick Start Guide

## Quick Command Reference

### Run All Tests
```bash
npm run test:all
```

### Unit Tests Only
```bash
npm test
```

### E2E Tests Only (starts dev server automatically)
```bash
npm run test:e2e
```

### Coverage Report
```bash
npm run test:coverage
open coverage/index.html
```

## First Time Setup

1. Install dependencies:
```bash
npm install
```

2. Verify unit tests work:
```bash
npm test
```

3. Verify E2E tests work:
```bash
npm run test:e2e
```

## During Development

### Watch Mode (re-run on file changes)
```bash
npm test -- --watch
```

### Run Specific Test File
```bash
npm test -- MathEngine.test.js
npm test -- ProgressManager.test.js
npm test -- validators.test.js
```

### Run Single Test
```bash
npm test -- -t "validates correct answer"
```

## E2E Testing Tips

### See the Browser (Headed Mode)
```bash
npm run test:e2e:headed
```

### Interactive UI Mode
```bash
npm run test:e2e:ui
```

### Debug Mode (step through tests)
```bash
npm run test:e2e:debug
```

### Test Specific Browser
```bash
npm run test:e2e:chrome
npm run test:e2e:firefox
npm run test:e2e:safari
```

### Test Tablet Viewport
```bash
npm run test:e2e:ipad
```

## Troubleshooting

### E2E Tests Won't Start
Make sure port 5173 is available:
```bash
lsof -i :5173
```

If blocked, kill the process:
```bash
kill -9 <PID>
```

### Unit Tests Fail
Clear cache and reinstall:
```bash
rm -rf node_modules coverage
npm install
npm test
```

### See More Details
```bash
npm test -- --verbose
npm run test:e2e -- --debug
```

## Test File Locations

```
tests/
├── unit/
│   ├── MathEngine.test.js        # Question generation tests
│   ├── ProgressManager.test.js   # Score tracking tests
│   └── validators.test.js        # Input validation tests
└── e2e/
    ├── gameplay.spec.js          # Gameplay flow tests
    ├── difficulty-levels.spec.js # Difficulty tests
    └── accessibility.spec.js     # Accessibility tests
```

## Coverage Goals

- Minimum: 80% across all metrics
- Target: 85%+ for core systems
- View: `coverage/index.html` after running `npm run test:coverage`

## Before Committing

Run this to ensure everything passes:
```bash
npm run test:all
```

## CI/CD

Tests run automatically on:
- Every push to repository
- Every pull request
- Before deployment

## Need Help?

- Read: `tests/README.md` for detailed documentation
- Check: `TEST-SUITE-SUMMARY.md` for overview
- Review: Test examples in test files

## Test Coverage by Component

| Component | Test File | Coverage |
|-----------|-----------|----------|
| MathEngine | MathEngine.test.js | 56 tests |
| ProgressManager | ProgressManager.test.js | 63 tests |
| Validators | validators.test.js | 75 tests |
| Gameplay | gameplay.spec.js | 21 tests |
| Difficulty | difficulty-levels.spec.js | 20 tests |
| Accessibility | accessibility.spec.js | 33 tests |

**Total: 259 test cases** ✅
