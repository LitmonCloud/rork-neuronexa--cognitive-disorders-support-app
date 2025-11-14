# Test Gap Quick Reference - AI Features for Memory Users

**Quick lookup guide for implementing missing tests**

---

## At a Glance

| Feature | Status | Tests | Priority | Est. Hours |
|---------|--------|-------|----------|-----------|
| **generateMemoryPrompt** | ❌ MISSING | 0/10 | CRITICAL | 4 |
| **generateOrientationReminder** | ❌ MISSING | 0/8 | CRITICAL | 3 |
| **generateMedicationReminder** | ❌ MISSING | 0/8 | CRITICAL | 4 |
| **generateJournalPrompt** | ❌ MISSING | 0/8 | HIGH | 3 |
| **buildUserContext** | ⚠️ PARTIAL | 1/10 | HIGH | 3 |
| **Premium Access Control** | ❌ MISSING | 0/6 | CRITICAL | 4 |
| **Paywall UI** | ❌ MISSING | 0/5 | CRITICAL | 3 |
| **Error Handling** | ❌ MISSING | 0/8 | HIGH | 3 |
| **Environment Config** | ❌ MISSING | 0/2 | MEDIUM | 1 |
| | | | **TOTAL** | **28 hours** |

---

## What to Test Immediately (This Week)

### 1️⃣ Premium Access Control
**Why**: Blocks entire premium feature validation
**Files to Create**: `__tests__/functionality/premiumAccessControl.test.tsx`
**Tests Needed**: 6
```
- hasAIAccess when isPremium = true
- hasAIAccess when canAccessFeature('aiCoaching') = true
- hasAIAccess = false when neither condition met
- generateMemoryPrompt NOT called when hasAIAccess = false
- generateMemoryPrompt called when hasAIAccess = true
- generateMemoryPrompt NOT called when settings.enabled = false
```

### 2️⃣ generateMemoryPrompt
**Why**: Most important premium feature for memory patients
**File to Enhance**: `__tests__/services/AIService.test.ts`
**Tests Needed**: 10
```
- Basic generation
- Morning/Afternoon/Evening variations
- Recent memories included
- Emotional state handling
- User profile personalization
- API failure → fallback
- Fallback randomization
- Missing EXPO_PUBLIC_TOOLKIT_URL handling
- Empty user profile
- Empty memory journal
```

### 3️⃣ Paywall UI Rendering
**Why**: Free users must see upsell to generate revenue
**File to Create**: `__tests__/functionality/premiumAIFeatures.test.tsx`
**Tests Needed**: 5
```
- Paywall card visible when hasAIAccess = false
- Lock icon shown
- "Unlock AI Memory Support" text present
- Value proposition text displayed
- Tap navigates to /paywall
```

### 4️⃣ generateMedicationReminder
**Why**: Medical data must be handled correctly (safety critical)
**File to Enhance**: `__tests__/services/AIService.test.ts`
**Tests Needed**: 8
```
- Basic reminder generation
- Dosage included in output
- Medication name included
- Instructions included when provided
- API failure → fallback
- Simple clear fallback format
- Complex medication names handled
- Large dosages handled
```

---

## What to Test Next (Week 2)

### 5️⃣ buildUserContext (Personalization Engine)
**Why**: All personalization depends on this
**File to Create**: `__tests__/services/AIService.buildUserContext.test.ts`
**Tests Needed**: 10
```
- Name inclusion
- Undefined profile handling
- Communication style included
- Preferences filtered by strength >= 5
- Limited to top 5 preferences
- Habits filtered by confidence >= 0.6
- Favorite encouragements included
- Topics to avoid included
- Motivation triggers included
- Empty arrays handled
```

### 6️⃣ generateOrientationReminder
**Why**: Critical for memory patients who lose track of time/date
**File to Enhance**: `__tests__/services/AIService.test.ts`
**Tests Needed**: 8
```
- Basic generation
- Date/time formatting
- Location included when provided
- Location omitted when not provided
- Simple language (5th grade level)
- API failure → fallback
- Name personalization
- Timeout handling
```

### 7️⃣ generateJournalPrompt
**Why**: Encourages memory recording (engagement)
**File to Enhance**: `__tests__/services/AIService.test.ts`
**Tests Needed**: 8
```
- Basic generation
- Time-of-day variations
- Recent entries context
- Simple language validation
- Emotional safety (non-threatening)
- API failure → fallback
- Name personalization
- Empty journal handling
```

### 8️⃣ DementiaSupportScreen AI Integration
**Why**: Verify screen renders correctly with/without premium
**File to Enhance**: `__tests__/functionality/dementiaSupport.test.tsx`
**Tests Needed**: 7
```
- AI prompt card shows when hasAIAccess = true
- AI prompt card hidden when hasAIAccess = false
- Paywall upsell shown when hasAIAccess = false && enabled
- Loading state during fetch
- Correct time-of-day detection
- Recent memories passed to service
- User profile passed to service
```

---

## Test Code Templates

### Template 1: Premium Feature Test
```typescript
describe('Feature Name - Premium Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (generateText as jest.Mock).mockClear();
  });

  it('should call AI service with correct context', async () => {
    (generateText as jest.Mock).mockResolvedValue('Generated text');
    
    const result = await aiService.generateMemoryPrompt({
      userProfile: mockProfile,
      recentMemories: ['Memory 1', 'Memory 2'],
      timeOfDay: 'morning',
    });

    expect(generateText).toHaveBeenCalled();
    expect(result).toBeTruthy();
  });

  it('should return fallback when API fails', async () => {
    (generateText as jest.Mock).mockRejectedValue(new Error('API error'));
    
    const result = await aiService.generateMemoryPrompt({
      timeOfDay: 'morning',
    });

    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);
  });
});
```

### Template 2: Access Control Test
```typescript
describe('Premium Feature - Access Control', () => {
  it('should load AI prompt when hasAIAccess = true', () => {
    const mockSubscription = { isPremium: true };
    const mockAIService = jest.spyOn(aiService, 'generateMemoryPrompt');
    
    const { getByTestId } = render(
      <DementiaSupportScreen />
    );

    expect(mockAIService).toHaveBeenCalled();
    expect(getByTestId('ai-prompt-card')).toBeTruthy();
  });

  it('should show paywall when hasAIAccess = false', () => {
    const mockSubscription = { isPremium: false };
    
    const { getByTestId } = render(
      <DementiaSupportScreen />
    );

    expect(getByTestId('paywall-upsell')).toBeTruthy();
  });
});
```

### Template 3: Error Handling Test
```typescript
describe('Error Handling', () => {
  it('should provide safe fallback on API error', async () => {
    (generateText as jest.Mock).mockRejectedValue(
      new Error('Network timeout')
    );

    const result = await aiService.generateMedicationReminder({
      medicationName: 'Aspirin',
      dosage: '81mg',
    });

    // Must include critical info even if AI fails
    expect(result).toContain('Aspirin');
    expect(result).toContain('81mg');
    expect(result.length).toBeGreaterThan(0);
  });
});
```

---

## Common Pitfalls to Avoid

❌ **Don't**: Mock subscription without mocking context provider
✅ **Do**: Use proper test wrapper with QueryClientProvider + SubscriptionProvider

❌ **Don't**: Test UI without mocking AIService.generateMemoryPrompt
✅ **Do**: Mock the service to control output and prevent API calls

❌ **Don't**: Forget to test both `isPremium` AND `canAccessFeature('aiCoaching')`
✅ **Do**: Test both paths since either can grant access

❌ **Don't**: Assume fallback works - test it explicitly
✅ **Do**: Force API error and verify fallback returns safe output

❌ **Don't**: Test medical reminders with real medical data
✅ **Do**: Use test data and validate format/clarity

---

## File Modification Checklist

### Files to CREATE
- [ ] `__tests__/services/AIService.buildUserContext.test.ts` (10 tests)
- [ ] `__tests__/functionality/premiumAccessControl.test.tsx` (6 tests)
- [ ] `__tests__/functionality/premiumAIFeatures.test.tsx` (5 tests)
- [ ] `__tests__/ui/AIPromptCard.test.tsx` (optional, 3 tests)

### Files to ENHANCE
- [ ] `__tests__/services/AIService.test.ts` (add 34 tests)
  - generateMemoryPrompt (10 tests)
  - generateOrientationReminder (8 tests)
  - generateMedicationReminder (8 tests)
  - generateJournalPrompt (8 tests)
  
- [ ] `__tests__/functionality/dementiaSupport.test.tsx` (add 7 tests)

---

## Success Indicators

✅ All 44 new tests added
✅ All tests passing with >80% code coverage
✅ Premium access control validated
✅ Paywall upsell rendering verified
✅ All fallback strategies tested
✅ Error scenarios covered
✅ CI/CD pipeline shows green

---

## Running Tests

```bash
# Run all AI service tests
npm test __tests__/services/AIService.test.ts

# Run specific test file
npm test __tests__/functionality/premiumAccessControl.test.tsx

# Run with coverage
npm test -- --coverage __tests__/services/AIService.test.ts

# Watch mode for development
npm test -- --watch __tests__/services/AIService.test.ts
```

---

## Resources

- [AIService.ts](services/ai/AIService.ts) - Implementation to test
- [DementiaSupportScreen](app/(tabs)/dementia-support.tsx) - UI component to test
- [SubscriptionContext](contexts/SubscriptionContext.tsx) - Access control to test
- [AI Features Analysis](AI_FEATURES_MEMORY_USERS_ANALYSIS.md) - Feature documentation

