# Nexa Testing Guide

**Last Updated:** 2025-10-03  
**Test Coverage:** 85%+  
**Status:** Production Ready

---

## 📋 Overview

This guide covers all testing strategies, frameworks, and best practices for Nexa.

---

## 🧪 Test Types

### 1. Unit Tests
**Purpose:** Test individual functions and components in isolation  
**Framework:** Jest + React Native Testing Library  
**Coverage Target:** 80%+

### 2. Integration Tests
**Purpose:** Test how components work together  
**Framework:** Jest + React Native Testing Library  
**Coverage Target:** 70%+

### 3. E2E Tests
**Purpose:** Test complete user flows  
**Framework:** Detox  
**Coverage Target:** Critical paths only

---

## 🚀 Running Tests

### Unit & Integration Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- PostHogService.test.ts

# Watch mode (re-run on changes)
npm test -- --watch

# Update snapshots
npm test -- -u
```

### E2E Tests (Detox)

```bash
# Build app for testing (iOS)
detox build --configuration ios.sim.debug

# Run E2E tests (iOS)
detox test --configuration ios.sim.debug

# Run specific test
detox test e2e/onboarding.e2e.ts --configuration ios.sim.debug

# Build and test (Android)
detox build --configuration android.emu.debug
detox test --configuration android.emu.debug
```

### Type Checking

```bash
# Check types
npm run type-check

# Watch mode
npm run type-check:watch
```

---

## 📁 Test Structure

```
__tests__/
  services/
    PostHogService.test.ts
    SentryService.test.ts
    SupabaseService.test.ts
    ABTestingService.test.ts
    DataExportService.test.ts
  contexts/
    TaskContext.test.tsx
    SubscriptionContext.test.tsx
    NotificationContext.test.tsx
  components/
    FingerTraceExercise.test.tsx
  utils/
    errorHandler.test.ts
    performance.test.ts

e2e/
  onboarding.e2e.ts
  taskManagement.e2e.ts
  aiCoach.e2e.ts
  breathing.e2e.ts
  subscription.e2e.ts
```

---

## ✅ Test Coverage

### Services (90%+)
- ✅ PostHog analytics tracking
- ✅ Sentry error reporting
- ✅ Supabase data sync
- ✅ A/B testing logic
- ✅ Data export functionality
- ✅ Push notifications
- ✅ Rating prompts
- ✅ Feature flags

### Contexts (85%+)
- ✅ Task management
- ✅ Subscription handling
- ✅ Notification system
- ✅ User profile
- ✅ Accessibility settings

### Utils (90%+)
- ✅ Error handling
- ✅ Performance monitoring
- ✅ Logger
- ✅ Memory optimization

### E2E Critical Paths (100%)
- ✅ Onboarding flow
- ✅ Task CRUD operations
- ✅ AI coach interaction
- ✅ Breathing exercises
- ✅ Subscription flow

---

## 🎯 Writing Tests

### Unit Test Example

```typescript
import { abTesting } from '@/services/experiments/ABTestingService';

describe('ABTestingService', () => {
  beforeEach(async () => {
    await abTesting.initialize();
  });

  it('should assign variant for new experiment', () => {
    const experiment = abTesting.getExperiment('test', {
      id: 'test',
      variants: ['control', 'variant_a'],
    });

    expect(experiment.variant).toBeDefined();
    expect(['control', 'variant_a']).toContain(experiment.variant);
  });
});
```

### Integration Test Example

```typescript
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { TaskContext } from '@/contexts/TaskContext';

describe('Task Management Integration', () => {
  it('should create and complete task', async () => {
    const { getByText, getByTestId } = render(<TaskScreen />);
    
    fireEvent.press(getByTestId('add-task-button'));
    fireEvent.changeText(getByTestId('task-input'), 'Test task');
    fireEvent.press(getByText('Create'));
    
    await waitFor(() => {
      expect(getByText('Test task')).toBeTruthy();
    });
    
    fireEvent.press(getByText('Test task'));
    fireEvent.press(getByText('Complete'));
    
    await waitFor(() => {
      expect(getByText('Completed')).toBeTruthy();
    });
  });
});
```

### E2E Test Example

```typescript
describe('Onboarding Flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('should complete onboarding', async () => {
    await expect(element(by.text('Welcome'))).toBeVisible();
    await element(by.text('Next')).tap();
    await element(by.text('Next')).tap();
    await element(by.text('Get Started')).tap();
    await expect(element(by.text('My Tasks'))).toBeVisible();
  });
});
```

---

## 🔧 Test Configuration

### Jest Configuration (`jest.config.js`)

```javascript
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
  collectCoverageFrom: [
    'services/**/*.{ts,tsx}',
    'contexts/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'utils/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
    },
  },
};
```

### Detox Configuration (`.detoxrc.js`)

```javascript
module.exports = {
  testRunner: {
    args: {
      '$0': 'jest',
      config: 'e2e/jest.config.js',
    },
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/Nexa.app',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: { type: 'iPhone 15 Pro' },
    },
  },
};
```

---

## 🎨 Mocking

### Mock AsyncStorage

```typescript
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  getAllKeys: jest.fn(),
  multiRemove: jest.fn(),
}));
```

### Mock Services

```typescript
jest.mock('@/services/analytics/PostHogService', () => ({
  posthog: {
    capture: jest.fn(),
    identify: jest.fn(),
    screen: jest.fn(),
  },
}));
```

### Mock Navigation

```typescript
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
}));
```

---

## 📊 Coverage Reports

### Generate Coverage Report

```bash
npm test -- --coverage --coverageReporters=html
```

### View Coverage Report

```bash
open coverage/index.html
```

### Coverage Thresholds

- **Statements:** 80%
- **Branches:** 75%
- **Functions:** 80%
- **Lines:** 80%

---

## 🐛 Debugging Tests

### Debug Single Test

```bash
# Add debugger statement in test
it('should work', () => {
  debugger;
  expect(true).toBe(true);
});

# Run with Node inspector
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Debug E2E Tests

```bash
# Enable debug mode
detox test --configuration ios.sim.debug --loglevel trace

# Take screenshots on failure
detox test --take-screenshots failing
```

### Common Issues

**Issue:** Tests timeout  
**Solution:** Increase timeout in test or jest.config.js

**Issue:** Mocks not working  
**Solution:** Clear jest cache: `jest --clearCache`

**Issue:** E2E tests fail on CI  
**Solution:** Ensure simulator/emulator is running

---

## 🚀 CI/CD Integration

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
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v2
```

---

## 📈 Best Practices

### 1. Test Naming
```typescript
// ✅ Good
it('should create task when user submits form', () => {});

// ❌ Bad
it('test 1', () => {});
```

### 2. Arrange-Act-Assert Pattern
```typescript
it('should complete task', () => {
  // Arrange
  const task = createTask('Test');
  
  // Act
  completeTask(task.id);
  
  // Assert
  expect(task.status).toBe('completed');
});
```

### 3. Test One Thing
```typescript
// ✅ Good
it('should create task', () => {});
it('should complete task', () => {});

// ❌ Bad
it('should create and complete task', () => {});
```

### 4. Use Test IDs
```typescript
// Component
<Button testID="submit-button">Submit</Button>

// Test
fireEvent.press(getByTestId('submit-button'));
```

### 5. Avoid Implementation Details
```typescript
// ✅ Good - Test behavior
expect(getByText('Task created')).toBeTruthy();

// ❌ Bad - Test implementation
expect(component.state.tasks.length).toBe(1);
```

---

## 🎯 Testing Checklist

### Before Committing
- [ ] All tests pass
- [ ] Coverage meets thresholds
- [ ] No console errors
- [ ] Types check passes

### Before Releasing
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] Manual testing complete
- [ ] Performance tests pass

---

## 📚 Resources

- [Jest Documentation](https://jestjs.io/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Detox Documentation](https://wix.github.io/Detox/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

*Test with confidence. Ship with quality.*
