# Remaining Test Fixes - Analysis & Solutions

**Current Status:** 219/230 tests passing (95.2%)
**Remaining:** 11 failing tests across 5 test files

---

## Test File #1: routing.test.tsx (4 tests failing)

**File:** [__tests__/navigation/routing.test.tsx](__tests__/navigation/routing.test.tsx:1)

### Problem
Tests are setting up mocks and waiting for `router.replace()` to be called, but **no component is being rendered** that contains the navigation guard logic.

### Root Cause
Navigation guards are in [app/_layout.tsx](app/_layout.tsx:136-150) in the `RootLayoutNav` component's `useEffect` hook (lines 108-170). The tests mock the hooks but never render this component, so the navigation logic never executes.

### Solution
The tests need to render the `RootLayoutNav` component:

```typescript
// BEFORE (doesn't work):
it('should redirect to terms-agreement when not accepted', async () => {
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  await waitFor(() => {
    expect(mockRouter.replace).toHaveBeenCalledWith('/terms-agreement');
  });
});

// AFTER (will work):
import RootLayoutNav from '@/app/_layout'; // Import the component

it('should redirect to terms-agreement when not accepted', async () => {
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

  render(
    <SubscriptionProvider>
      <UserProfileProvider>
        <RootLayoutNav />
      </UserProfileProvider>
    </SubscriptionProvider>
  );

  await waitFor(() => {
    expect(mockRouter.replace).toHaveBeenCalledWith('/terms-agreement');
  }, { timeout: 5000 });
});
```

### Failing Tests
1. ✗ "should redirect to terms-agreement when not accepted"
2. ✗ "should redirect to onboarding when not completed"
3. ✗ "should block patient from caregiver routes"
4. ✗ "should redirect caregiver to paywall when subscription required"

### Estimated Fix Time
~30 minutes (needs to export RootLayoutNav from _layout.tsx and refactor all 4 tests)

---

## Test File #2: taskFlow.test.tsx (2 tests failing)

**File:** [__tests__/integration/taskFlow.test.tsx](__tests__/integration/taskFlow.test.tsx:1)

### Problem
Integration tests timing out after 5 seconds - operations taking too long.

### Root Cause Analysis Needed
Run the test to see detailed error:
```bash
npm test -- __tests__/integration/taskFlow.test.tsx --no-coverage
```

### Likely Issues
1. **Async operations not completing** - waitFor timeout
2. **Context initialization delays** - multiple provider nesting
3. **Mock timing issues** - fake timers interfering

### Solution Approaches
1. **Increase timeouts:**
   ```typescript
   await waitFor(() => {
     expect(something).toBeTruthy();
   }, { timeout: 10000 }); // Increase from 5s to 10s
   ```

2. **Simplify async operations:**
   - Mock async dependencies
   - Use jest.runAllTimers() if fake timers active

3. **Check for infinite loops:**
   - Review component useEffect dependencies
   - Check for missing abort controller cleanup

### Estimated Fix Time
~45 minutes (requires investigation + fix)

---

## Test File #3: LocationTrackingService.test.ts (2 tests failing)

**File:** [__tests__/services/LocationTrackingService.test.ts](__tests__/services/LocationTrackingService.test.ts:1)

### Problem
Service vs context implementation mismatch - tests expect service methods but app uses context.

### Root Cause
The app likely migrated from a service-based implementation to a context-based implementation, but tests weren't updated.

### Solution Options

**Option A: Update tests to use context (RECOMMENDED)**
```typescript
// BEFORE (testing service):
import LocationTrackingService from '@/services/location/LocationTrackingService';

it('should start tracking', () => {
  const service = new LocationTrackingService();
  service.startTracking();
  expect(service.isTracking).toBe(true);
});

// AFTER (testing context):
import { LocationProvider, useLocation } from '@/contexts/LocationContext';

it('should start tracking', () => {
  const TestComponent = () => {
    const { startTracking, isTracking } = useLocation();
    return <Button onPress={startTracking} />;
  };

  const { getByRole } = render(
    <LocationProvider>
      <TestComponent />
    </LocationProvider>
  );

  fireEvent.press(getByRole('button'));
  // Assert tracking started
});
```

**Option B: Delete service tests if service is unused**
If the service is completely replaced by context, delete the service and its tests.

### Estimated Fix Time
~20 minutes (update 2 tests to use context pattern)

---

## Test File #4: BreathingExercise.test.tsx (1 test failing)

**File:** [__tests__/components/BreathingExercise.test.tsx:88](__tests__/components/BreathingExercise.test.tsx:88)

### Problem
`onComplete` callback not being called when exercise finishes.

### Root Cause
Timing issue - the test advances fake timers by 5000ms but the exercise may need more time to complete all phases and cycles.

### Current Test (lines 88-110)
```typescript
it('should call onComplete callback when exercise finishes', () => {
  const onComplete = jest.fn();
  const shortPattern: BreathingPattern = {
    ...mockPattern,
    cycles: 1,
    inhale: 1,
    hold: 1,
    exhale: 1,
    holdAfterExhale: 1,
  };

  const { getByText } = renderWithTheme(
    <BreathingExercise pattern={shortPattern} onComplete={onComplete} />
  );

  const startButton = getByText(/start/i);
  fireEvent.press(startButton);

  act(() => {
    jest.advanceTimersByTime(5000); // Advances 5 seconds
  });

  expect(onComplete).toHaveBeenCalled();
});
```

### Solution
The pattern has 4 phases × 1 second each = 4 seconds per cycle, but there may be animation delays or state update delays. Need to:

1. **Increase timer advance:**
   ```typescript
   act(() => {
     jest.advanceTimersByTime(6000); // Add buffer
   });
   ```

2. **Or advance in steps matching phases:**
   ```typescript
   const startButton = getByText(/start/i);
   fireEvent.press(startButton);

   // Inhale (1s)
   act(() => { jest.advanceTimersByTime(1000); });

   // Hold (1s)
   act(() => { jest.advanceTimersByTime(1000); });

   // Exhale (1s)
   act(() => { jest.advanceTimersByTime(1000); });

   // Hold after exhale (1s)
   act(() => { jest.advanceTimersByTime(1000); });

   // Extra buffer for completion
   act(() => { jest.advanceTimersByTime(500); });

   expect(onComplete).toHaveBeenCalled();
   ```

### Estimated Fix Time
~10 minutes (simple timing adjustment)

---

## Test File #5: locationTracking.test.tsx (1 test failing)

**File:** [__tests__/functionality/locationTracking.test.tsx](__tests__/functionality/locationTracking.test.tsx:1)

### Problem
Async timing issue - location updates not propagating in time.

### Root Cause Analysis Needed
Run the test to see which specific assertion fails:
```bash
npm test -- __tests__/functionality/locationTracking.test.tsx --no-coverage
```

### Likely Issues
1. **Geolocation mock delay** - getCurrentPosition callback not firing fast enough
2. **State update delay** - React state updates not flushing
3. **Missing waitFor** - Test assertion running before async operation completes

### Solution Approaches

1. **Add proper async waiting:**
   ```typescript
   // BEFORE:
   fireEvent.press(getByText('Start Tracking'));
   expect(isTracking).toBe(true);

   // AFTER:
   fireEvent.press(getByText('Start Tracking'));
   await waitFor(() => {
     expect(isTracking).toBe(true);
   });
   ```

2. **Ensure mock fires immediately:**
   ```typescript
   global.navigator.geolocation = {
     getCurrentPosition: jest.fn((success) => {
       // Call success callback synchronously
       success({
         coords: { latitude: 37.7749, longitude: -122.4194 },
         timestamp: Date.now(),
       });
     }),
   };
   ```

3. **Flush all pending timers and promises:**
   ```typescript
   fireEvent.press(startButton);
   await act(async () => {
     jest.runAllTimers();
     await Promise.resolve(); // Flush promise queue
   });
   ```

### Estimated Fix Time
~15 minutes (add proper async waiting)

---

## Summary & Next Steps

### Time Estimates
| Test File | Failing Tests | Est. Time | Priority |
|-----------|---------------|-----------|----------|
| routing.test.tsx | 4 | 30 min | High |
| taskFlow.test.tsx | 2 | 45 min | Medium |
| LocationTrackingService.test.ts | 2 | 20 min | High |
| BreathingExercise.test.tsx | 1 | 10 min | High |
| locationTracking.test.tsx | 1 | 15 min | High |
| **TOTAL** | **11** | **~2 hours** | |

### Recommended Order
1. **BreathingExercise** (10 min) - Quick win, simple timing fix
2. **LocationTrackingService** (20 min) - Update to context pattern
3. **locationTracking** (15 min) - Add proper async waiting
4. **routing** (30 min) - Render actual component
5. **taskFlow** (45 min) - Most complex, needs investigation

### Testing Commands

**Run specific failing test:**
```bash
npm test -- __tests__/components/BreathingExercise.test.tsx --no-coverage
```

**Run all failing tests:**
```bash
npm test -- --onlyFailures
```

**Run full suite:**
```bash
npm test -- --passWithNoTests
```

---

## Additional Notes

### Test Quality Improvements Needed

1. **Routing tests** should test actual navigation behavior, not just mock calls
2. **Integration tests** should have reasonable timeouts (10s+)
3. **Service tests** should match implementation (context vs service)
4. **Async tests** need proper `waitFor` usage

### Best Practices Established

✅ Use `testID` for duplicate text disambiguation
✅ Mock ordering matters in jest.setup.js
✅ Provider nesting: TestWrapper > UserProfileProvider > LocationProvider
✅ Always render component when testing behavior
✅ Use `act()` for timer advances
✅ Add `waitFor()` for async operations

---

**Last Updated:** Current session
**Target:** 230/230 tests passing (100%)
**Current:** 219/230 tests passing (95.2%)
**Remaining:** 11 tests (4.8%)
