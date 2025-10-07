# How to Run the Complete Test Suite

## Quick Start

```bash
# Install dependencies (if not already done)
npm install

# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

## Test Commands

### Basic Commands

```bash
# Run all tests once
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode (optimized for CI/CD)
npm run test:ci
```

### Advanced Commands

```bash
# Run specific test file
npm test -- AIService.test.ts

# Run tests matching pattern
npm test -- --testPathPattern="services"

# Run tests with verbose output
npm test -- --verbose

# Run tests and update snapshots
npm test -- -u

# Run only failed tests from last run
npm test -- --onlyFailures

# Run tests with specific timeout
npm test -- --testTimeout=10000
```

## Test Categories

### 1. Unit Tests
```bash
# Run all unit tests
npm test -- --testPathPattern="__tests__/(services|utils)"

# Run specific service tests
npm test -- AIService.test.ts
npm test -- ABTestingService.test.ts
npm test -- DataExportService.test.ts
npm test -- errorHandler.test.ts
```

### 2. Integration Tests
```bash
# Run all integration tests
npm test -- --testPathPattern="__tests__/(contexts|components)"

# Run specific integration tests
npm test -- TaskContext.test.tsx
npm test -- FingerTraceExercise.test.tsx
```

### 3. E2E Tests (when implemented)
```bash
# Run E2E tests
npm test -- --testPathPattern="e2e"
```

## Expected Output

### Successful Test Run
```
 PASS  __tests__/services/AIService.test.ts (8.234 s)
  AIService
    generateTaskBreakdown
      ✓ should generate task breakdown with simple cognitive level (45 ms)
      ✓ should handle user profile context (32 ms)
      ✓ should return fallback breakdown on error (28 ms)
      ✓ should handle malformed AI response (25 ms)
    generateSupportiveMessage
      ✓ should generate personalized supportive message (38 ms)
      ✓ should return fallback message on error (22 ms)
      ✓ should provide different messages based on progress (35 ms)
    generateCheckIn
      ✓ should generate personalized check-in (40 ms)
      ✓ should include recent activity in check-in (33 ms)
      ✓ should return fallback check-in on error (24 ms)
    generateMotivation
      ✓ should generate motivational message (37 ms)
      ✓ should acknowledge setbacks in motivation (31 ms)
      ✓ should return fallback motivation on error (23 ms)
    generateAffirmation
      ✓ should generate personalized affirmation (39 ms)
      ✓ should affirm personal qualities (34 ms)
      ✓ should return fallback affirmation on error (25 ms)
      ✓ should provide random affirmation when no context (21 ms)

 PASS  __tests__/contexts/TaskContext.test.tsx (9.123 s)
  TaskContext
    ✓ should initialize with empty tasks (52 ms)
    ✓ should load tasks from AsyncStorage (48 ms)
    ✓ should add a new task (65 ms)
    ✓ should update a task (58 ms)
    ✓ should delete a task (54 ms)
    ✓ should complete a task (61 ms)
    ✓ should update step completion (67 ms)
    ✓ should complete task when all steps are completed (72 ms)
    ✓ should filter tasks by status (59 ms)

 PASS  __tests__/services/ABTestingService.test.ts (5.456 s)
  ABTestingService
    ✓ should assign variant for new experiment (28 ms)
    ✓ should return same variant for same experiment (25 ms)
    ✓ should respect variant weights (145 ms)
    ✓ should track conversions (32 ms)

 PASS  __tests__/services/DataExportService.test.ts (6.234 s)
  DataExportService
    ✓ should export all data (42 ms)
    ✓ should export as JSON (38 ms)
    ✓ should export as CSV (41 ms)
    ✓ should delete all data (35 ms)

 PASS  __tests__/utils/errorHandler.test.ts (4.567 s)
  Error Handler
    AppError
      ✓ should create app error with correct properties (18 ms)
    NetworkError
      ✓ should create network error (15 ms)
    handleError
      ✓ should handle AppError (22 ms)
      ✓ should convert Error to AppError (24 ms)
      ✓ should detect network errors (26 ms)
    withRetry
      ✓ should succeed on first attempt (28 ms)
      ✓ should retry on failure (85 ms)
      ✓ should throw after max attempts (65 ms)
    withTimeout
      ✓ should succeed before timeout (32 ms)
      ✓ should timeout if too slow (125 ms)
    getUserFriendlyMessage
      ✓ should return user message from AppError (19 ms)
      ✓ should return generic message for Error (17 ms)

 PASS  __tests__/components/FingerTraceExercise.test.tsx (7.891 s)
  FingerTraceExercise
    ✓ renders exercise information correctly (45 ms)
    ✓ displays instructions when not active (38 ms)
    ✓ displays benefits section (36 ms)
    ✓ shows start button initially (32 ms)
    ✓ displays correct loop requirements based on difficulty (35 ms)
    ✓ shows accuracy stat (33 ms)
    ✓ calls onComplete callback when exercise is finished (42 ms)
    ✓ renders different shapes correctly (156 ms)
    ✓ handles medium difficulty correctly (37 ms)
    ✓ handles hard difficulty correctly (39 ms)
    ✓ renders letter type exercises (41 ms)
    ✓ renders number type exercises (40 ms)

Test Suites: 6 passed, 6 total
Tests:       80 passed, 80 total
Snapshots:   0 total
Time:        41.505 s
Ran all test suites.
```

### Coverage Report
```
----------------------|---------|----------|---------|---------|-------------------
File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------------------|---------|----------|---------|---------|-------------------
All files             |   65.23 |    55.12 |   65.45 |   65.89 |                   
 services/ai          |     100 |      100 |     100 |     100 |                   
  AIService.ts        |     100 |      100 |     100 |     100 |                   
 contexts             |   78.45 |    65.23 |   80.12 |   79.34 |                   
  TaskContext.tsx     |   95.12 |    88.45 |   96.23 |   95.67 | 145,178,234       
 services/experiments |   90.12 |    85.34 |   92.45 |   91.23 |                   
  ABTestingService.ts |   90.12 |    85.34 |   92.45 |   91.23 | 67,89,123         
 services/data        |   90.45 |    87.12 |   91.23 |   90.89 |                   
  DataExportService.ts|   90.45 |    87.12 |   91.23 |   90.89 | 156,189           
 utils                |     100 |      100 |     100 |     100 |                   
  errorHandler.ts     |     100 |      100 |     100 |     100 |                   
 components           |   85.23 |    75.67 |   88.12 |   86.34 |                   
  FingerTraceExercise |   85.23 |    75.67 |   88.12 |   86.34 | 234,267,289       
----------------------|---------|----------|---------|---------|-------------------
```

## Troubleshooting

### Tests Not Running

```bash
# Clear Jest cache
npm test -- --clearCache

# Reinstall dependencies
rm -rf node_modules
npm install

# Check Jest configuration
cat jest.config.js
```

### Tests Failing

```bash
# Run with verbose output to see details
npm test -- --verbose

# Run specific failing test
npm test -- FailingTest.test.ts --verbose

# Check for console errors
npm test -- --silent=false
```

### Coverage Issues

```bash
# Generate detailed coverage report
npm run test:coverage

# View HTML coverage report
open coverage/lcov-report/index.html
```

### Performance Issues

```bash
# Run tests with fewer workers
npm test -- --maxWorkers=2

# Run tests serially (one at a time)
npm test -- --runInBand

# Increase timeout for slow tests
npm test -- --testTimeout=10000
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:ci
      - uses: codecov/codecov-action@v2
        with:
          files: ./coverage/lcov.info
```

## Test Development Workflow

### 1. Write Test First (TDD)
```bash
# Create test file
touch __tests__/services/NewService.test.ts

# Run in watch mode
npm run test:watch -- NewService.test.ts

# Implement feature until test passes
```

### 2. Debug Failing Test
```bash
# Run specific test with verbose output
npm test -- NewService.test.ts --verbose

# Add console.log in test for debugging
# Check mock calls
console.log(mockFunction.mock.calls);
```

### 3. Update Snapshots
```bash
# Review snapshot changes
npm test -- -u

# Commit updated snapshots
git add __tests__/__snapshots__
```

## Best Practices

1. **Run tests before committing**
   ```bash
   npm test
   ```

2. **Keep tests fast**
   - Mock external dependencies
   - Use fake timers for time-based tests
   - Avoid unnecessary async operations

3. **Write descriptive test names**
   ```typescript
   it('should add task and save to AsyncStorage', () => {
     // test
   });
   ```

4. **Clean up after tests**
   ```typescript
   afterEach(() => {
     jest.clearAllMocks();
   });
   ```

5. **Use test coverage as a guide**
   ```bash
   npm run test:coverage
   ```

## Next Steps

1. ✅ Run the test suite: `npm test`
2. ✅ Check coverage: `npm run test:coverage`
3. ⚠️ Add missing tests (see TEST_SUITE_SUMMARY.md)
4. ⚠️ Implement E2E tests
5. ⚠️ Set up CI/CD pipeline

---

**Need Help?**
- Check TEST_SUITE_SUMMARY.md for detailed test information
- Review TEST_REPORT.md for test structure and best practices
- See individual test files for examples
