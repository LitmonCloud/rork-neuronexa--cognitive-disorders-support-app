# NeuroNexa Test Suite & Quality Assurance Plan

**Created:** November 12, 2025
**Status:** Implementation Ready
**Coverage Target:** 80% (Critical Features), 60% (Overall)

---

## 📋 Executive Summary

This document outlines a comprehensive testing strategy for NeuroNexa's main features, prioritized by user impact and business criticality.

**Current State:**
- ✅ Jest configured with expo preset
- ✅ Testing utilities installed
- ✅ 25+ test files exist
- ⚠️ Coverage target: 60% (needs improvement to 80%)
- ⚠️ Some tests may need updates after rebrand

---

## 🎯 Testing Strategy

### Testing Pyramid

```
           /\
          /  \
         / E2E \          10% - User flows (Detox)
        /------\
       /        \
      /Integration\      20% - Feature integration
     /------------\
    /              \
   /   Unit Tests   \    70% - Services, utilities, hooks
  /------------------\
```

### Priority Matrix

| Feature | Priority | Impact | Complexity | Test Coverage Target |
|---------|----------|--------|------------|---------------------|
| AI Task Coach | P0 | Critical | High | 90% |
| Subscription/Paywall | P0 | Critical | Medium | 90% |
| Breathing Exercises | P1 | High | Low | 80% |
| Caregiver Management | P1 | High | Medium | 85% |
| Location Tracking | P1 | High | High | 85% |
| Accessibility | P2 | Medium | Medium | 75% |
| Notifications | P2 | Medium | Medium | 75% |

---

## 🧪 Test Suite Structure

### Phase 1: Critical Features (P0) 🔴

#### 1.1 AI Task Coach Tests

**File:** `__tests__/features/aiTaskCoach.test.tsx`

**Coverage:**
- ✅ Task breakdown generation (simple, moderate, complex)
- ✅ User profile context integration
- ✅ Cognitive level adaptation
- ✅ Step-by-step execution mode
- ✅ Offline fallback behavior
- ✅ Error handling & recovery
- ✅ Voice guidance integration
- ⚠️ Update: Performance benchmarks

**Test Cases:** (12 total)

```typescript
describe('AI Task Coach', () => {
  describe('Task Breakdown Generation', () => {
    test('generates simple breakdown for simple cognitive level')
    test('generates moderate breakdown for moderate cognitive level')
    test('generates complex breakdown for complex cognitive level')
    test('adapts language based on user preferences')
    test('includes supportive messages')
    test('includes time estimates')
  })

  describe('User Context Integration', () => {
    test('uses user profile name in responses')
    test('adapts communication style (casual/formal/encouraging/direct)')
    test('incorporates learned preferences')
    test('avoids configured topics')
  })

  describe('Error Handling', () => {
    test('falls back to offline mode when AI unavailable')
    test('provides generic breakdown when context missing')
  })
})
```

**New Tests Needed:**
```typescript
describe('Performance & Quality', () => {
  test('completes breakdown in <3 seconds', async () => {
    const start = Date.now()
    await aiService.generateTaskBreakdown(input)
    expect(Date.now() - start).toBeLessThan(3000)
  })

  test('validates output format', async () => {
    const result = await aiService.generateTaskBreakdown(input)
    expect(result.steps).toBeDefined()
    expect(result.steps.length).toBeGreaterThan(0)
    expect(result.supportiveMessage).toBeDefined()
  })
})
```

---

#### 1.2 Subscription & Monetization Tests

**File:** `__tests__/features/subscription.test.tsx`

**Coverage:**
- ✅ Free tier limitations
- ✅ Premium feature gates
- ✅ Trial period activation (7 days)
- ✅ Subscription status checks
- ✅ Usage tracking (daily/total limits)
- ✅ Paywall display logic
- ⚠️ Update: RevenueCat integration
- ⚠️ Update: Purchase flow testing

**Test Cases:** (15 total)

```typescript
describe('Subscription System', () => {
  describe('Tier Management', () => {
    test('enforces free tier task limit (5/day)')
    test('allows unlimited tasks for premium users')
    test('grants premium access during trial')
    test('expires trial after 7 days')
  })

  describe('Feature Gates', () => {
    test('blocks advanced AI features for free users')
    test('allows all features for premium users')
    test('allows all features for lifetime users')
  })

  describe('Paywall Logic', () => {
    test('shows paywall when hitting free limits')
    test('hides paywall for premium users')
    test('displays trial countdown')
    test('tracks feature unlock attempts')
  })

  describe('RevenueCat Integration', () => {
    test('fetches offerings successfully')
    test('processes purchase successfully')
    test('restores previous purchases')
    test('handles purchase errors gracefully')
  })
})
```

**New Tests Needed:**
```typescript
describe('Edge Cases', () => {
  test('handles subscription expiration gracefully')
  test('syncs subscription status across devices')
  test('handles payment failures')
  test('validates receipt signatures')
})
```

---

### Phase 2: High-Impact Features (P1) 🟡

#### 2.1 Breathing Exercise Tests

**File:** `__tests__/features/breathingExercise.test.tsx`

**Coverage:**
- ✅ Box breathing (4-4-4-4) pattern
- ✅ 4-7-8 breathing pattern
- ✅ Finger trace breathing pattern
- ✅ Timer accuracy
- ✅ Phase transitions (inhale → hold → exhale)
- ✅ Reset functionality
- ⚠️ Add: Haptic feedback testing
- ⚠️ Add: Audio cue testing

**Test Cases:** (10 total)

```typescript
describe('Breathing Exercises', () => {
  describe('Pattern Execution', () => {
    test('executes box breathing correctly')
    test('executes 4-7-8 breathing correctly')
    test('executes finger trace pattern')
    test('transitions between phases smoothly')
  })

  describe('Timer Management', () => {
    test('starts timer on exercise begin')
    test('pauses timer correctly')
    test('resets timer and state')
    test('completes cycle and notifies user')
  })

  describe('Accessibility', () => {
    test('provides haptic feedback on phase change')
    test('announces phases via screen reader')
  })
})
```

---

#### 2.2 Caregiver Management Tests

**File:** `__tests__/features/caregiverManagement.test.tsx`

**Coverage:**
- ✅ Add caregiver (name, email, phone, relationship)
- ✅ Edit caregiver information
- ✅ Delete caregiver with confirmation
- ✅ Set primary caregiver
- ✅ Send test alerts
- ⚠️ Add: Invite code generation
- ⚠️ Add: Invite code redemption
- ⚠️ Add: Real-time sync testing

**Test Cases:** (12 total)

```typescript
describe('Caregiver Management', () => {
  describe('CRUD Operations', () => {
    test('adds caregiver with valid data')
    test('validates required fields')
    test('updates caregiver information')
    test('deletes caregiver after confirmation')
  })

  describe('Primary Caregiver', () => {
    test('sets primary caregiver')
    test('only allows one primary caregiver')
    test('displays primary badge in UI')
  })

  describe('Alerts', () => {
    test('sends test alert successfully')
    test('formats alert message correctly')
    test('tracks alert delivery status')
  })

  describe('Invitations', () => {
    test('generates unique invite codes')
    test('redeems invite code successfully')
    test('handles expired invite codes')
  })
})
```

---

#### 2.3 Location Tracking Tests

**File:** `__tests__/features/locationTracking.test.tsx`

**Coverage:**
- ✅ Request location permissions
- ✅ Track current location
- ✅ Background location updates
- ✅ Geofencing setup
- ✅ Geofence entry/exit events
- ⚠️ Add: Battery optimization testing
- ⚠️ Add: Privacy controls testing

**Test Cases:** (10 total)

```typescript
describe('Location Tracking', () => {
  describe('Permission Management', () => {
    test('requests location permissions')
    test('handles permission denial')
    test('requests background permission separately')
  })

  describe('Location Updates', () => {
    test('gets current location')
    test('starts background tracking')
    test('stops tracking when disabled')
    test('optimizes battery usage')
  })

  describe('Geofencing', () => {
    test('creates geofence successfully')
    test('triggers entry event')
    test('triggers exit event')
  })
})
```

---

### Phase 3: Medium Priority (P2) 🟢

#### 3.1 Accessibility Tests

**File:** `__tests__/features/accessibility.test.tsx`

**Coverage:**
- ✅ High contrast mode
- ✅ Large text (1.2x scaling)
- ✅ Reduced motion
- ✅ Voice guidance
- ✅ Screen reader compatibility
- ✅ Keyboard navigation
- ⚠️ Add: Color blind mode testing
- ⚠️ Add: Focus management testing

---

#### 3.2 Notification Tests

**File:** `__tests__/features/notifications.test.tsx`

**Coverage:**
- ✅ Push notification delivery
- ✅ Local notification scheduling
- ✅ Notification permissions
- ✅ Badge count updates
- ✅ Deep link handling
- ⚠️ Add: Real-time notification testing
- ⚠️ Add: Notification categories

---

## 🔧 Integration Tests

### Integration Test Suite

**File:** `__tests__/integration/userFlows.test.tsx`

**Critical User Flows:**

1. **Onboarding Flow** (E2E)
   ```typescript
   test('completes full onboarding flow', async () => {
     // 1. Opens app for first time
     // 2. Views onboarding slides
     // 3. Accepts terms
     // 4. Activates trial
     // 5. Lands on home screen
   })
   ```

2. **Task Creation → AI Breakdown → Completion** (Integration)
   ```typescript
   test('creates task, gets AI breakdown, marks complete', async () => {
     // 1. Add new task
     // 2. Request AI breakdown
     // 3. View steps
     // 4. Mark steps complete
     // 5. Complete task
     // 6. View achievement
   })
   ```

3. **Caregiver Invitation Flow** (Integration)
   ```typescript
   test('patient generates code, caregiver redeems', async () => {
     // 1. Patient generates invite
     // 2. Code is created
     // 3. Caregiver redeems code
     // 4. Relationship established
     // 5. Both see connection
   })
   ```

4. **Subscription Flow** (Integration)
   ```typescript
   test('hits limit, views paywall, subscribes', async () => {
     // 1. Free user hits task limit
     // 2. Paywall appears
     // 3. User views offerings
     // 4. Selects plan
     // 5. Completes purchase
     // 6. Premium access granted
   })
   ```

---

## 📊 Test Metrics & Quality Gates

### Coverage Requirements

```yaml
Overall Project:     60% (minimum)
Critical Services:   80% (minimum)
AI Service:          90% (must achieve)
Subscription:        90% (must achieve)
Contexts:            75% (target)
Components:          70% (target)
Utils:               80% (target)
```

### Quality Gates

**Pre-Commit:**
- ✅ All unit tests pass
- ✅ No TypeScript errors
- ✅ ESLint passes

**Pre-Push:**
- ✅ Integration tests pass
- ✅ Coverage meets minimums
- ✅ No console errors

**Pre-Deployment:**
- ✅ E2E tests pass (iOS + Android)
- ✅ Performance benchmarks met
- ✅ Accessibility audit passes

---

## 🚀 Implementation Plan

### Week 1: Critical Features (P0)

**Day 1-2: AI Task Coach**
- [ ] Complete AIService.test.ts
- [ ] Add performance benchmarks
- [ ] Test all cognitive levels
- [ ] Validate offline fallbacks

**Day 3-4: Subscription System**
- [ ] Complete subscription.test.tsx
- [ ] Mock RevenueCat thoroughly
- [ ] Test purchase flows
- [ ] Validate feature gates

**Day 5: Integration & Review**
- [ ] Run full test suite
- [ ] Fix failing tests
- [ ] Review coverage reports
- [ ] Document gaps

### Week 2: High-Impact Features (P1)

**Day 1: Breathing Exercises**
- [ ] Test all breathing patterns
- [ ] Validate timer accuracy
- [ ] Test accessibility features

**Day 2-3: Caregiver Management**
- [ ] Test CRUD operations
- [ ] Test invitation flow
- [ ] Test real-time sync

**Day 4: Location Tracking**
- [ ] Test permission flows
- [ ] Test geofencing
- [ ] Test battery optimization

**Day 5: Integration Tests**
- [ ] User flow testing
- [ ] Cross-feature integration
- [ ] Performance testing

### Week 3: Medium Priority & Polish (P2)

**Day 1-2: Accessibility & Notifications**
- [ ] Complete accessibility tests
- [ ] Complete notification tests
- [ ] Test edge cases

**Day 3-4: E2E Tests**
- [ ] Update Detox tests
- [ ] Test on physical devices
- [ ] Test on iOS + Android

**Day 5: Final Review**
- [ ] Coverage audit
- [ ] Performance benchmarks
- [ ] Documentation review
- [ ] Test report generation

---

## 🧪 Test Utilities & Helpers

### Custom Test Utilities

**File:** `__tests__/utils/testHelpers.ts`

```typescript
// Mock user profiles
export const mockUserProfiles = {
  simple: createMockProfile({ cognitiveLevel: 'simple' }),
  moderate: createMockProfile({ cognitiveLevel: 'moderate' }),
  complex: createMockProfile({ cognitiveLevel: 'complex' }),
}

// Mock tasks
export const mockTasks = {
  simple: { title: 'Make breakfast', complexity: 'simple' },
  moderate: { title: 'Plan weekly schedule', complexity: 'moderate' },
  complex: { title: 'File taxes', complexity: 'complex' },
}

// Wait utilities
export const waitForAsync = (ms = 100) =>
  new Promise(resolve => setTimeout(resolve, ms))

// Render with providers
export const renderWithProviders = (component) => {
  return render(
    <SubscriptionProvider>
      <TaskProvider>
        <AccessibilityProvider>
          {component}
        </AccessibilityProvider>
      </TaskProvider>
    </SubscriptionProvider>
  )
}
```

---

## 🔍 Testing Best Practices

### 1. Arrange-Act-Assert Pattern
```typescript
test('should do something', () => {
  // Arrange: Set up test data
  const input = { ... }

  // Act: Execute the function
  const result = functionToTest(input)

  // Assert: Verify the outcome
  expect(result).toBe(expected)
})
```

### 2. Descriptive Test Names
```typescript
// ❌ Bad
test('test 1', () => ...)

// ✅ Good
test('should generate simple task breakdown for users with ADHD', () => ...)
```

### 3. Test One Thing
```typescript
// ❌ Bad: Tests multiple things
test('should handle everything', () => {
  expect(a).toBe(1)
  expect(b).toBe(2)
  expect(c).toBe(3)
})

// ✅ Good: Separate tests
test('should handle scenario A', () => ...)
test('should handle scenario B', () => ...)
```

### 4. Mock External Dependencies
```typescript
jest.mock('@rork-ai/toolkit-sdk')
jest.mock('expo-haptics')
jest.mock('@react-native-async-storage/async-storage')
```

### 5. Test Edge Cases
```typescript
test('handles empty input')
test('handles invalid data')
test('handles network errors')
test('handles timeout')
test('handles concurrent requests')
```

---

## 📈 Performance Benchmarks

### Target Metrics

| Feature | Metric | Target | Critical |
|---------|--------|--------|----------|
| AI Breakdown | Response Time | <3s | <5s |
| App Launch | Cold Start | <2s | <3s |
| Screen Navigation | Transition | <200ms | <500ms |
| API Calls | Response | <500ms | <1s |
| UI Rendering | Frame Rate | 60fps | 50fps |

### Performance Test Template

```typescript
describe('Performance', () => {
  test('AI breakdown completes within 3 seconds', async () => {
    const start = performance.now()
    await aiService.generateTaskBreakdown(input)
    const duration = performance.now() - start
    expect(duration).toBeLessThan(3000)
  })
})
```

---

## 🐛 Bug Prevention Checklist

### Before Writing Tests
- [ ] Understand feature requirements
- [ ] Review existing implementation
- [ ] Identify edge cases
- [ ] Plan test scenarios

### While Writing Tests
- [ ] Use descriptive test names
- [ ] Follow AAA pattern
- [ ] Mock external dependencies
- [ ] Test happy path first
- [ ] Then test edge cases
- [ ] Add performance benchmarks

### After Writing Tests
- [ ] Run tests locally
- [ ] Check coverage report
- [ ] Review test quality
- [ ] Document complex tests
- [ ] Update test plan

---

## 📚 Testing Resources

### Documentation
- [Jest Documentation](https://jestjs.io/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Detox E2E Testing](https://wix.github.io/Detox/)
- [Expo Testing Guide](https://docs.expo.dev/develop/unit-testing/)

### Internal Docs
- `jest.config.js` - Jest configuration
- `jest.setup.js` - Test environment setup
- `__tests__/README.md` - Testing guidelines
- `TESTING_GUIDE.md` - Comprehensive testing guide

---

## ✅ Test Suite Completion Checklist

### Phase 1: Critical (Week 1)
- [ ] AI Task Coach tests (12 tests)
- [ ] Subscription tests (15 tests)
- [ ] Integration tests for P0 features
- [ ] Coverage: ≥90% for critical features

### Phase 2: High-Impact (Week 2)
- [ ] Breathing exercise tests (10 tests)
- [ ] Caregiver management tests (12 tests)
- [ ] Location tracking tests (10 tests)
- [ ] Coverage: ≥85% for P1 features

### Phase 3: Complete Suite (Week 3)
- [ ] Accessibility tests (8 tests)
- [ ] Notification tests (8 tests)
- [ ] E2E tests updated (5 flows)
- [ ] Coverage: ≥60% overall

### Quality Assurance
- [ ] All tests passing
- [ ] Coverage reports generated
- [ ] Performance benchmarks met
- [ ] Documentation complete

---

**Next Steps:**
1. Review existing test files
2. Identify gaps in coverage
3. Prioritize P0 tests (AI + Subscription)
4. Begin implementation (Week 1)
5. Track progress in TESTING_GUIDE.md

---

**Document Status:** Draft → Ready for Implementation
**Estimated Effort:** 3 weeks (1 developer)
**Success Criteria:** ≥80% coverage for critical features, all tests passing
