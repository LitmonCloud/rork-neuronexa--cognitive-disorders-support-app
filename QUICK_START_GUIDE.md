# NeuroNexa — Quick Start Guide for App Store Submission

**Current Status:** 85% Ready  
**Time to Submit:** 2-3 days (MVP) or 2-3 weeks (Full)

---

## 🚀 Fast Track to Submission (MVP Path)

### Day 1: Legal & Assets (6 hours)

**Morning: Host Legal Docs (2 hours)**
```bash
# Option 1: Buy domain
# - Purchase neuronexa.app from Namecheap/GoDaddy
# - Deploy to Vercel/Netlify
# - Upload legal/*.md files

# Option 2: Use placeholder
# - Use existing domain: yourdomain.com/neuronexa
# - Create /legal/privacy, /legal/terms, /support pages
```

**Afternoon: Generate Screenshots (4 hours)**
```bash
# 1. Open app on iPhone 15 Pro Max
# 2. Capture these screens:
#    - Home (tasks + Nexa)
#    - AI breakdown
#    - Breathing exercise
#    - Settings (accessibility)
#    - Progress
#    - Caregiver
#    - Onboarding

# 3. Frame with device mockups:
#    - Use Figma or online tool
#    - Add captions
#    - Export for App Store

# 4. Repeat for iPhone 15 Pro and iPad Pro
```

---

### Day 2: Code Updates & Build (5 hours)

**Morning: Update Settings (2 hours)**
```typescript
// app/(tabs)/settings.tsx

import * as Linking from 'expo-linking';

// Add Legal Section
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Legal & Support</Text>
  
  <TouchableOpacity 
    onPress={() => Linking.openURL('https://neuronexa.app/legal/privacy')}
  >
    <Text style={styles.link}>Privacy Policy</Text>
  </TouchableOpacity>
  
  <TouchableOpacity 
    onPress={() => Linking.openURL('https://neuronexa.app/legal/terms')}
  >
    <Text style={styles.link}>Terms of Service</Text>
  </TouchableOpacity>
  
  <TouchableOpacity 
    onPress={() => Linking.openURL('https://neuronexa.app/support')}
  >
    <Text style={styles.link}>Support</Text>
  </TouchableOpacity>
</View>

// Add Version Display
<Text style={styles.version}>
  Version {Constants.expoConfig?.version}
</Text>
```

**Afternoon: Build & Test (3 hours)**
```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login to Expo
eas login

# 3. Build for iOS
eas build --platform ios --profile preview

# 4. Download and test on device
# 5. Fix any critical bugs
```

---

### Day 3: Submit to Stores (4 hours)

**Morning: App Store Connect (2 hours)**
```bash
# 1. Create app listing
# 2. Upload screenshots
# 3. Copy metadata from store/ios-metadata.md
# 4. Configure IAP products (or skip for MVP)
# 5. Submit for review
```

**Afternoon: Google Play Console (2 hours)**
```bash
# 1. Create app listing
# 2. Upload screenshots
# 3. Copy metadata from store/android-metadata.md
# 4. Complete content rating
# 5. Submit for review
```

---

## 📋 Pre-Submission Checklist

### Critical (Must Have)
- [ ] Legal docs hosted at neuronexa.app (or placeholder)
- [ ] Screenshots generated (7 per device class)
- [ ] Settings screen has legal links
- [ ] App version displayed in Settings
- [ ] Medical disclaimer visible in app
- [ ] TestFlight build tested by 2+ people
- [ ] No critical bugs or crashes

### Important (Should Have)
- [ ] App icon validated (1024×1024, no alpha)
- [ ] Splash screen validated (≥1242×2436)
- [ ] All accessibility features tested
- [ ] Breathing exercises tested
- [ ] AI breakdowns tested
- [ ] Caregiver management tested

### Nice to Have (Can Add Later)
- [ ] App preview video
- [ ] RevenueCat IAP (can use mock for v1.0)
- [ ] Analytics integration
- [ ] Crash reporting
- [ ] Unit tests

---

## 🔑 Key URLs to Update

### In Code
```typescript
// app.json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "app.rork.neuronexa-cognitive-disorders-support-ykokwhv"
    },
    "android": {
      "package": "app.rork.neuronexa-cognitive-disorders-support-ykokwhv"
    }
  }
}

// app/(tabs)/settings.tsx
const PRIVACY_URL = 'https://neuronexa.app/legal/privacy';
const TERMS_URL = 'https://neuronexa.app/legal/terms';
const SUPPORT_URL = 'https://neuronexa.app/support';
```

### In Store Listings
- Privacy Policy: https://neuronexa.app/legal/privacy
- Terms of Service: https://neuronexa.app/legal/terms
- Support: https://neuronexa.app/support
- Marketing: https://neuronexa.app

---

## 💡 Common Issues & Solutions

### Issue: "Privacy Policy URL not accessible"
**Solution:** Ensure legal docs are hosted and publicly accessible. Test URLs in incognito browser.

### Issue: "Screenshots don't match app"
**Solution:** Capture fresh screenshots from latest build. Ensure no placeholder content.

### Issue: "Medical claims in description"
**Solution:** Add disclaimer: "NeuroNexa is not a medical device and does not provide medical advice."

### Issue: "IAP products not configured"
**Solution:** For MVP, you can submit without real IAP. Add in v1.1 update.

### Issue: "App crashes on launch"
**Solution:** Test on physical device. Check error logs. Fix critical bugs before submission.

---

## 📞 Quick Reference

### Documentation Files
- **RELEASE_NOTES.md** — Master checklist (all phases)
- **APP_STORE_READINESS.md** — Detailed analysis
- **SUBMISSION.md** — Step-by-step submission guide
- **IMPLEMENTATION_SUMMARY.md** — What was done + next steps
- **CHANGELOG.md** — Version history
- **This file** — Quick start guide

### Legal Files
- **legal/PRIVACY_POLICY.md** — Privacy policy
- **legal/TERMS_OF_SERVICE.md** — Terms of service

### Store Files
- **store/ios-metadata.md** — App Store listing content
- **store/android-metadata.md** — Play Store listing content

### Technical Files
- **components/ErrorBoundary.tsx** — Error handler
- **.env.example** — Environment variables

---

## 🎯 Success Metrics

### Launch Goals (First 30 Days)
- 1,000+ downloads
- 40%+ Day 7 retention
- 4.5+ star rating
- <1% crash rate

### Monetization (If IAP Enabled)
- 15%+ trial-to-paid conversion
- $1,000+ MRR

---

## 🚨 Emergency Contacts

### If Submission Rejected
1. Read rejection reason carefully
2. Check SUBMISSION.md for common issues
3. Fix and resubmit within 24 hours

### If App Crashes in Production
1. Check error logs in Expo dashboard
2. Fix critical bugs
3. Submit hotfix update

### If Users Report Issues
1. Respond within 24 hours
2. Collect device info and steps to reproduce
3. Fix in next update

---

## ⏱️ Time Estimates

### MVP Path (Minimum Viable Product)
- Day 1: Legal & Assets (6 hours)
- Day 2: Code & Build (5 hours)
- Day 3: Submit (4 hours)
- **Total: 15 hours (2-3 days)**

### Full Production Path
- Week 1: Integrations (40 hours)
- Week 2: Features & Testing (40 hours)
- Week 3: Polish & Submit (40 hours)
- **Total: 120 hours (2-3 weeks)**

---

## 💰 Cost Summary

### Required
- Apple Developer: $99/year
- Google Play: $25 (one-time)
- Domain: $12/year
- **Total: ~$136/year**

### Optional (Free Tiers Available)
- RevenueCat: $0 (up to $10k MRR)
- PostHog: $0 (up to 1M events)
- Sentry: $0 (up to 5k errors)
- Supabase: $0 (up to 500MB)
- Resend: $0 (up to 3k emails)

---

## 🎉 You're Almost There!

**Current Progress: 85%**

**Remaining Work:**
1. Host legal docs (2 hours)
2. Generate screenshots (4 hours)
3. Update Settings (2 hours)
4. Build & test (3 hours)
5. Submit (4 hours)

**Total: 15 hours (2-3 days)**

---

## 📱 Quick Commands

```bash
# Install dependencies
npm install

# Start development server
npm run start

# Build for iOS (preview)
eas build --platform ios --profile preview

# Build for Android (preview)
eas build --platform android --profile preview

# Submit to App Store
eas submit --platform ios

# Submit to Google Play
eas submit --platform android

# Check build status
eas build:list

# View logs
eas build:view [BUILD_ID]
```

---

## 🔗 Useful Links

- **Expo Docs:** https://docs.expo.dev
- **EAS Build:** https://docs.expo.dev/build/introduction/
- **EAS Submit:** https://docs.expo.dev/submit/introduction/
- **App Store Connect:** https://appstoreconnect.apple.com
- **Google Play Console:** https://play.google.com/console
- **RevenueCat Docs:** https://docs.revenuecat.com

---

**Ready to submit? Follow the 3-day plan above! 🚀**

**Questions?** Check SUBMISSION.md for detailed instructions.

---

*Simplify. Scaffold. Support independence.*
