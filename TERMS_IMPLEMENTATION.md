# Terms of Service Implementation

## Overview
Nexa now requires users to accept the Terms of Service and Privacy Policy before using the app. This implementation ensures legal compliance and user awareness of app policies.

## User Flow

### 1. First Launch
```
App Launch → Terms Agreement Screen → Onboarding → Main App
```

### 2. Returning Users
```
App Launch → Main App (if terms already accepted)
```

## Implementation Details

### Files Created/Modified

#### New Files
- **`app/terms-agreement.tsx`** - Terms acceptance screen with checkboxes for ToS and Privacy Policy

#### Modified Files
- **`app/_layout.tsx`** - Added routing logic to check terms acceptance before onboarding
- **`types/userProfile.ts`** - Added `termsAcceptedAt` and `termsVersion` fields
- **`contexts/UserProfileContext.tsx`** - Updated to support terms tracking

### Features

#### Terms Agreement Screen
- ✅ Beautiful, accessible UI with Shield icon
- ✅ Two separate checkboxes for Terms of Service and Privacy Policy
- ✅ Links to view full documents (opens in browser)
- ✅ Medical disclaimer prominently displayed
- ✅ Summary of what users are agreeing to
- ✅ Continue button disabled until both boxes checked
- ✅ Responsive design with safe area handling

#### Data Storage
Terms acceptance is stored in two places:

1. **AsyncStorage** (`@nexa_terms_accepted`)
   ```json
   {
     "accepted": true,
     "timestamp": "2025-10-02T12:00:00.000Z",
     "version": "1.0.0"
   }
   ```

2. **User Profile** (via UserProfileContext)
   ```typescript
   {
     termsAcceptedAt: "2025-10-02T12:00:00.000Z",
     termsVersion: "1.0.0"
   }
   ```

#### Routing Logic
The app checks terms acceptance on every launch:

```typescript
if (!termsAccepted && !inTermsAgreement) {
  router.replace('/terms-agreement');
} else if (termsAccepted && !onboardingCompleted && !inOnboarding) {
  router.replace('/onboarding');
} else if (termsAccepted && onboardingCompleted) {
  router.replace('/(tabs)');
}
```

### Legal Documents

#### Accessible From Settings
Users can view legal documents at any time from Settings:
- Privacy Policy
- Terms of Service
- Accessibility Statement
- Data Retention Policy

#### Document URLs
- Terms: `https://nexa.app/legal/terms`
- Privacy: `https://nexa.app/legal/privacy`
- Accessibility: `https://nexa.app/legal/accessibility`
- Data Retention: `https://nexa.app/legal/data-retention`

## Key Features

### 1. Compliance
- ✅ Explicit consent required before app use
- ✅ Separate acceptance for Terms and Privacy Policy
- ✅ Timestamp and version tracking
- ✅ Medical disclaimer prominently displayed
- ✅ Age requirement (13+) clearly stated

### 2. User Experience
- ✅ Clean, modern design matching app aesthetic
- ✅ Easy-to-read checkboxes with visual feedback
- ✅ Quick links to view full documents
- ✅ Summary of key points
- ✅ Disabled state for continue button until acceptance

### 3. Accessibility
- ✅ High contrast colors
- ✅ Large touch targets (checkboxes)
- ✅ Clear visual hierarchy
- ✅ Readable font sizes
- ✅ Safe area handling for all devices

### 4. Data Privacy
- ✅ Local-first storage
- ✅ No data collection before acceptance
- ✅ Clear explanation of data practices
- ✅ User control over data

## Testing Checklist

### First Launch
- [ ] App shows Terms Agreement screen on first launch
- [ ] Both checkboxes must be checked to continue
- [ ] Continue button is disabled until both checked
- [ ] Tapping "View Terms" opens browser with Terms of Service
- [ ] Tapping "View Privacy Policy" opens browser with Privacy Policy
- [ ] After acceptance, user proceeds to onboarding
- [ ] Terms acceptance is saved to AsyncStorage
- [ ] Terms acceptance is saved to User Profile

### Returning Users
- [ ] App skips Terms Agreement if already accepted
- [ ] App goes directly to main app (if onboarding complete)
- [ ] Terms acceptance persists across app restarts

### Settings Access
- [ ] Terms of Service link works in Settings
- [ ] Privacy Policy link works in Settings
- [ ] All legal document links open correctly

### Edge Cases
- [ ] App handles missing AsyncStorage gracefully
- [ ] App handles corrupted terms data gracefully
- [ ] Terms version can be updated in future

## Future Enhancements

### Version Updates
When terms are updated:
1. Increment version number (e.g., "1.0.0" → "1.1.0")
2. Check if user's accepted version matches current version
3. Show terms agreement screen again if versions don't match
4. Track acceptance of new version

### Implementation:
```typescript
const CURRENT_TERMS_VERSION = "1.1.0";

if (termsAccepted && profile?.termsVersion !== CURRENT_TERMS_VERSION) {
  router.replace('/terms-agreement');
}
```

### Analytics
Track terms acceptance for compliance:
- Terms viewed count
- Time spent on terms screen
- Acceptance rate
- Version acceptance tracking

### Localization
- Translate terms agreement screen
- Provide localized legal documents
- Support multiple languages

## Legal Compliance

### COPPA (Children's Online Privacy Protection Act)
- ✅ Age requirement (13+) clearly stated
- ✅ Parental supervision recommended for 13-17
- ✅ No data collection from children under 13

### GDPR (General Data Protection Regulation)
- ✅ Explicit consent required
- ✅ Clear explanation of data processing
- ✅ Right to access and delete data
- ✅ Data portability mentioned

### CCPA (California Consumer Privacy Act)
- ✅ Clear disclosure of data practices
- ✅ No sale of personal information
- ✅ Right to delete data
- ✅ Non-discrimination for exercising rights

### App Store Requirements
- ✅ Privacy Policy accessible before account creation
- ✅ Terms of Service accessible before account creation
- ✅ Medical disclaimer for health-related apps
- ✅ Age rating compliance

## Support

### User Questions
Common questions users might have:

**Q: Why do I need to accept terms?**
A: Legal requirement to use the app. Protects both you and us.

**Q: What happens if I don't accept?**
A: You cannot use the app without accepting terms.

**Q: Can I change my mind later?**
A: Yes, you can delete your data and stop using the app at any time.

**Q: Where can I read the full terms?**
A: Tap "View Terms" or "View Privacy Policy" on the agreement screen, or access from Settings.

### Contact
For legal questions: legal@nexa.app
For privacy questions: privacy@nexa.app
For support: support@nexa.app

## Conclusion

The Terms of Service implementation ensures Nexa is legally compliant while maintaining a user-friendly experience. Users are informed about their rights and our practices before using the app, and can access legal documents at any time from Settings.

The implementation is:
- ✅ Legally compliant
- ✅ User-friendly
- ✅ Accessible
- ✅ Privacy-focused
- ✅ Future-proof (version tracking)
- ✅ Well-documented

---

**Last Updated:** October 2, 2025
**Version:** 1.0.0
