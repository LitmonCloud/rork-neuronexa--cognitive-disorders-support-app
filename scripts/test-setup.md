# Nexa Testing Setup Guide

## Overview

This guide explains how to set up comprehensive testing for Nexa, including unit tests, integration tests, and E2E tests.

## Current Status

**Testing Framework:** Not yet configured  
**Recommendation:** Start with Jest for unit tests, add Detox for E2E later

---

## Phase 1: Unit Testing with Jest (Recommended for MVP)

### Installation

```bash
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native jest-expo
```

### Configuration

Create `jest.config.js`:

```javascript
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/coverage/**',
    '!**/node_modules/**',
    '!**/babel.config.js',
    '!**/jest.setup.js'
  ]
};
```

Create `jest-setup.js`:

```javascript
import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
}));

// Mock expo-speech
jest.mock('expo-speech', () => ({
  speak: jest.fn(),
  stop: jest.fn(),
  isSpeakingAsync: jest.fn(() => Promise.resolve(false)),
}));
```

### Update package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

## Phase 2: Example Unit Tests

### Test 1: AIService

Create `services/ai/__tests__/AIService.test.ts`:

```typescript
import { AIService } from '../AIService';

describe('AIService', () => {
  describe('breakdownTask', () => {
    it('should break down a task into steps', async () => {
      const result = await AIService.breakdownTask('Clean my room');
      
      expect(result).toHaveProperty('steps');
      expect(Array.isArray(result.steps)).toBe(true);
      expect(result.steps.length).toBeGreaterThan(0);
    });

    it('should handle complex tasks', async () => {
      const result = await AIService.breakdownTask('Prepare for a job interview');
      
      expect(result.steps.length).toBeGreaterThan(3);
      expect(result.steps[0]).toHaveProperty('title');
      expect(result.steps[0]).toHaveProperty('description');
    });
  });

  describe('generateMotivation', () => {
    it('should generate motivational message', async () => {
      const message = await AIService.generateMotivation('task_completed');
      
      expect(typeof message).toBe('string');
      expect(message.length).toBeGreaterThan(0);
    });
  });
});
```

### Test 2: TaskContext

Create `contexts/__tests__/TaskContext.test.tsx`:

```typescript
import { renderHook, act } from '@testing-library/react-native';
import { TaskProvider, useTasks } from '../TaskContext';

describe('TaskContext', () => {
  it('should add a task', () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: TaskProvider,
    });

    act(() => {
      result.current.addTask({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'medium',
      });
    });

    expect(result.current.tasks.length).toBe(1);
    expect(result.current.tasks[0].title).toBe('Test Task');
  });

  it('should complete a task', () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: TaskProvider,
    });

    let taskId: string;

    act(() => {
      result.current.addTask({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'medium',
      });
      taskId = result.current.tasks[0].id;
    });

    act(() => {
      result.current.completeTask(taskId);
    });

    expect(result.current.tasks[0].status).toBe('completed');
  });
});
```

### Test 3: Accessibility Features

Create `contexts/__tests__/AccessibilityContext.test.tsx`:

```typescript
import { renderHook, act } from '@testing-library/react-native';
import { AccessibilityProvider, useAccessibility } from '../AccessibilityContext';

describe('AccessibilityContext', () => {
  it('should toggle high contrast mode', () => {
    const { result } = renderHook(() => useAccessibility(), {
      wrapper: AccessibilityProvider,
    });

    expect(result.current.highContrast).toBe(false);

    act(() => {
      result.current.toggleHighContrast();
    });

    expect(result.current.highContrast).toBe(true);
  });

  it('should toggle large text', () => {
    const { result } = renderHook(() => useAccessibility(), {
      wrapper: AccessibilityProvider,
    });

    expect(result.current.largeText).toBe(false);

    act(() => {
      result.current.toggleLargeText();
    });

    expect(result.current.largeText).toBe(true);
  });
});
```

---

## Phase 3: E2E Testing with Detox (Optional for v1.1)

### Installation

```bash
npm install --save-dev detox detox-cli
```

### Configuration

Create `.detoxrc.js`:

```javascript
module.exports = {
  testRunner: {
    args: {
      '$0': 'jest',
      config: 'e2e/jest.config.js'
    },
    jest: {
      setupTimeout: 120000
    }
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/Nexa.app',
      build: 'xcodebuild -workspace ios/Nexa.xcworkspace -scheme Nexa -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build'
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug'
    }
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 15 Pro'
      }
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_7_Pro_API_34'
      }
    }
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug'
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug'
    }
  }
};
```

### Example E2E Test

Create `e2e/onboarding.test.ts`:

```typescript
describe('Onboarding Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should complete onboarding', async () => {
    await expect(element(by.text('Welcome to Nexa'))).toBeVisible();
    
    await element(by.id('next-button')).tap();
    await expect(element(by.text('Meet Nexa'))).toBeVisible();
    
    await element(by.id('next-button')).tap();
    await expect(element(by.text('Accessibility First'))).toBeVisible();
    
    await element(by.id('get-started-button')).tap();
    await expect(element(by.id('home-screen'))).toBeVisible();
  });
});
```

---

## Testing Priorities for MVP

### High Priority (Must Have)
1. ✅ Unit tests for AIService
2. ✅ Unit tests for TaskContext
3. ✅ Unit tests for AccessibilityContext
4. ✅ Unit tests for utility functions

### Medium Priority (Should Have)
1. Integration tests for task creation flow
2. Integration tests for AI breakdown
3. Integration tests for breathing exercises
4. Snapshot tests for key components

### Low Priority (Nice to Have)
1. E2E tests with Detox
2. Visual regression tests
3. Performance tests
4. Load tests

---

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests (if configured)
npm run test:e2e
```

---

## Coverage Goals

**MVP Target:** 60% coverage  
**v1.1 Target:** 80% coverage  
**v2.0 Target:** 90% coverage

**Priority Areas:**
- Core business logic (AIService, contexts)
- Critical user flows (task creation, completion)
- Accessibility features
- Error handling

---

## Continuous Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run type check
      run: npm run type-check
      
    - name: Run linter
      run: npm run lint
      
    - name: Run tests
      run: npm test -- --coverage
      
    - name: Upload coverage
      uses: codecov/codecov-action@v3
```

---

## Next Steps

1. **For MVP Launch:**
   - Set up Jest and basic unit tests
   - Test critical paths (task creation, AI breakdown)
   - Aim for 60% coverage

2. **For v1.1:**
   - Add integration tests
   - Set up Detox for E2E tests
   - Increase coverage to 80%

3. **For v2.0:**
   - Add visual regression tests
   - Add performance tests
   - Achieve 90% coverage

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Detox Documentation](https://wix.github.io/Detox/)
- [Expo Testing Guide](https://docs.expo.dev/develop/unit-testing/)

---

**Note:** For MVP launch, focus on critical unit tests. E2E testing can be added in v1.1 after validating product-market fit.
