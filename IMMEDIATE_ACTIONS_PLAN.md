# NeuroNexa Immediate Actions Plan

**Created:** November 12, 2025
**Priority:** Critical Path to App Store Submission
**Timeline:** 2-3 Days

---

## 🎯 Mission

Complete NeuroNexa rebrand and prepare for App Store submission with production-ready quality.

---

## 📋 Phase 1: Repository Cleanup (30 minutes) 🔴

### Action 1.1: Remove Backup Files
**Priority:** P0 (Must do immediately)
**Impact:** Repository cleanliness, professional appearance
**Effort:** 5 minutes

```bash
# Navigate to project root
cd /Users/bobbylitmon/rork-neuronexa--cognitive-disorders-support-app

# Count backup files (should show 254)
find . -name "*.bak" | wc -l

# Create backup of backup files (just in case)
mkdir -p /tmp/neuronexa-backups
find . -name "*.bak" -exec cp {} /tmp/neuronexa-backups/ \;

# Remove all .bak files
find . -name "*.bak" -type f -delete

# Verify removal
find . -name "*.bak" | wc -l  # Should show 0
```

**Success Criteria:**
- ✅ 0 .bak files remain
- ✅ Backup stored in /tmp/neuronexa-backups
- ✅ Repository size reduced

---

### Action 1.2: Update .gitignore
**Priority:** P0
**Impact:** Prevent future backup file commits
**Effort:** 2 minutes

```bash
# Add backup file patterns to .gitignore
cat >> .gitignore << 'EOF'

# Backup files
*.bak
*.backup
*.old
*.orig
*.swp
*~

# macOS
.DS_Store
.AppleDouble
.LSOverride

# Thumbnails
._*

# Files that might appear in the root
.DocumentRevisions-V100
.fseventsd
.Spotlight-V100
.TemporaryItems
.Trashes
.VolumeIcon.icns
.com.apple.timemachine.donotpresent
EOF
```

**Success Criteria:**
- ✅ .gitignore updated with backup patterns
- ✅ macOS-specific patterns added

---

### Action 1.3: Commit Cleanup
**Priority:** P0
**Impact:** Clean git history
**Effort:** 3 minutes

```bash
# Stage changes
git add .gitignore

# Commit cleanup
git commit -m "chore: Remove 254 backup files and update .gitignore

- Removed all .bak, .backup, .old files
- Updated .gitignore to prevent future backup commits
- Added macOS-specific ignore patterns
- Cleaner repository for App Store submission"

# Verify clean status
git status
```

**Success Criteria:**
- ✅ Clean commit created
- ✅ git status shows clean working directory

---

## 📋 Phase 2: NeuroNexa Rebrand (2-3 hours) 🟡

### Action 2.1: Register Bundle ID in Apple Developer Portal
**Priority:** P0 (Blocking all iOS builds)
**Impact:** Required for App Store submission
**Effort:** 15 minutes

**Steps:**
1. Go to: https://developer.apple.com/account/resources/identifiers/list
2. Log in: litmonbobby@yahoo.com
3. Click "+" → "App IDs" → Continue
4. Select "App" → Continue
5. Fill in details:
   ```
   Description: NeuroNexa Cognitive Support
   Bundle ID: app.rork.neuronexa
   ```

6. Enable Capabilities:
   - ✅ Push Notifications
   - ✅ App Groups
     - Create: `group.app.rork.neuronexa`
     - Description: "NeuroNexa app data sharing"
   - ✅ Sign In with Apple
     - Select: "Enable as a primary App ID"
   - ✅ iCloud (Optional)
     - Select: CloudKit
     - Create container: `iCloud.app.rork.neuronexa`

7. Click "Register"

**Success Criteria:**
- ✅ Bundle ID `app.rork.neuronexa` registered
- ✅ Push Notifications enabled
- ✅ App Group created: `group.app.rork.neuronexa`
- ✅ Sign In with Apple enabled

**Verification:**
```bash
# Check in Apple Developer Portal
# Should see: app.rork.neuronexa with all capabilities
```

---

### Action 2.2: Create App in App Store Connect
**Priority:** P0 (Blocking submission)
**Impact:** Required for TestFlight & App Store
**Effort:** 20 minutes

**Steps:**
1. Go to: https://appstoreconnect.apple.com
2. Log in: litmonbobby@yahoo.com
3. Click "My Apps" → "+" → "New App"
4. Fill in form:
   ```
   Platform: ☑ iOS
   Name: NeuroNexa: Cognitive Disorders Support
   Primary Language: English (U.S.)
   Bundle ID: app.rork.neuronexa (from dropdown)
   SKU: neuronexa-2025
   User Access: Full Access
   ```

5. Click "Create"

6. **IMPORTANT:** Copy the App ID (10-digit number)
   - Location: App Information section
   - Example: 1234567890
   - Save this number!

7. Fill in App Store listing (use content from APP_STORE_LISTING_CONTENT.md):
   - Promotional Text (170 chars)
   - Description (4,000 chars)
   - Keywords (100 chars)
   - Support URL: https://litmoncloud.github.io/nexa-legal-docs/
   - Marketing URL: https://rork.com
   - Version: 1.0
   - Copyright: © 2025 Rork, Inc. All rights reserved.

**Success Criteria:**
- ✅ App created in App Store Connect
- ✅ App ID copied and saved
- ✅ Basic metadata filled in
- ✅ Legal URLs configured

---

### Action 2.3: Update eas.json with App ID
**Priority:** P0
**Impact:** Required for EAS submit
**Effort:** 5 minutes

**Current eas.json:**
```json
"submit": {
  "production": {
    "ios": {
      "appleId": "bobby@rork.com",
      "ascAppId": "placeholder",
      "appleTeamId": "placeholder"
    }
  }
}
```

**Update to:**
```json
"submit": {
  "production": {
    "ios": {
      "appleId": "bobby@rork.com",
      "ascAppId": "YOUR_10_DIGIT_APP_ID",
      "appleTeamId": "YNSMLADB62"
    }
  }
}
```

**Commands:**
```bash
# Open eas.json
code eas.json

# Replace placeholders with actual values
# Save file
```

**Success Criteria:**
- ✅ eas.json updated with real App ID
- ✅ Team ID set to YNSMLADB62
- ✅ Apple ID set to bobby@rork.com

---

### Action 2.4: Initialize New EAS Project
**Priority:** P0
**Impact:** Create fresh EAS project for NeuroNexa
**Effort:** 10 minutes

**Commands:**
```bash
# Ensure you're in project root
cd /Users/bobbylitmon/rork-neuronexa--cognitive-disorders-support-app

# Initialize EAS project
eas init

# When prompted:
# "Would you like to create a project for @litmoncloud/neuronexa-cognitive-disorders-support?"
# Answer: Yes

# This will:
# - Create new EAS project ID
# - Update app.json automatically
# - Link project to your Expo account
```

**Expected Output:**
```
✔ Created a new project: @litmoncloud/neuronexa-cognitive-disorders-support
✔ Updated app.json with project ID
```

**Success Criteria:**
- ✅ New EAS project created
- ✅ app.json updated with new project ID
- ✅ Project visible in EAS dashboard

**Verification:**
```bash
# Check app.json has new project ID
cat app.json | grep projectId
```

---

### Action 2.5: Build with NeuroNexa Branding
**Priority:** P0
**Impact:** Production-ready builds with correct branding
**Effort:** 15 minutes (wait time: 7-10 minutes per platform)

**iOS Build:**
```bash
# Build iOS production
eas build --platform ios --profile production

# Expected:
# - New certificates for app.rork.neuronexa
# - New provisioning profile
# - Build number: 1 (fresh start)
# - Completion time: ~7-10 minutes
```

**Android Build:**
```bash
# Build Android production
eas build --platform android --profile production

# Expected:
# - Uses existing keystore or generates new
# - Package: app.rork.neuronexa
# - Version code: 1 (fresh start)
# - Completion time: ~12-15 minutes
```

**Parallel Builds (Recommended):**
```bash
# Build both platforms simultaneously
eas build --platform all --profile production
```

**Success Criteria:**
- ✅ iOS build completes successfully
- ✅ Android build completes successfully
- ✅ New certificates generated
- ✅ Builds downloadable from EAS

**Verification:**
```bash
# Check build status
eas build:list --limit 2

# Should show 2 new builds with NeuroNexa branding
```

---

## 📋 Phase 3: Quality Assurance (1 hour) 🟢

### Action 3.1: Download and Test Builds
**Priority:** P1
**Impact:** Verify app functionality
**Effort:** 20 minutes

**iOS Testing:**
```bash
# Download .ipa from EAS dashboard
# Install on physical iPhone or TestFlight

# Test checklist:
- [ ] App launches successfully
- [ ] NeuroNexa branding visible
- [ ] AI Task Coach works
- [ ] Breathing exercises work
- [ ] Onboarding flows
- [ ] Settings accessible
- [ ] No critical crashes
```

**Android Testing:**
```bash
# Download .aab from EAS dashboard
# Upload to Google Play Internal Testing
# Install on physical Android device

# Test checklist:
- [ ] App launches successfully
- [ ] NeuroNexa branding visible
- [ ] Core features work
- [ ] No critical crashes
```

**Success Criteria:**
- ✅ iOS app functional
- ✅ Android app functional
- ✅ No blocking bugs
- ✅ Branding correct

---

### Action 3.2: Run Test Suite
**Priority:** P1
**Impact:** Code quality validation
**Effort:** 15 minutes

**Commands:**
```bash
# Run full test suite
npm test

# Expected output:
# - All tests pass
# - Coverage reports generated
# - No errors

# If tests fail:
# 1. Review failures
# 2. Fix issues
# 3. Re-run tests
```

**Success Criteria:**
- ✅ Test suite passes
- ✅ Coverage ≥60%
- ✅ No critical failures

---

### Action 3.3: Lint and Type Check
**Priority:** P1
**Impact:** Code quality
**Effort:** 10 minutes

**Commands:**
```bash
# Run ESLint
npm run lint

# Expected: No errors (warnings OK)

# Run TypeScript check
npx tsc --noEmit

# Expected: No type errors
```

**Success Criteria:**
- ✅ No ESLint errors
- ✅ No TypeScript errors
- ✅ Code quality maintained

---

## 📋 Phase 4: Final Preparation (1 hour) 🔵

### Action 4.1: Capture Screenshots
**Priority:** P1 (Required for submission)
**Impact:** App Store listing
**Effort:** 30 minutes

**Requirements:**
- Size: 1290×2796px (iPhone 15 Pro Max)
- Quantity: 5-7 screenshots
- Device: iOS Simulator or real device

**Screenshots Needed:**
1. **AI Task Breakdown** - Show task being broken down into steps
2. **Mood Tracking** - Show emotional wellness tracking
3. **Caregiver Dashboard** - Show family support features
4. **Breathing Exercise** - Show wellness features
5. **Accessibility Settings** - Show customization options
6. **Progress Tracking** (Optional)
7. **Memory Exercises** (Optional)

**Commands:**
```bash
# Launch iOS Simulator
npx expo start --ios

# Or use physical device with proper device name
npx expo start

# Capture screenshots:
# - Simulator: Cmd+S
# - Physical: Volume Up + Power Button

# Save to: screenshots/ directory
mkdir -p screenshots
```

**Success Criteria:**
- ✅ 5-7 high-quality screenshots
- ✅ Correct dimensions (1290×2796px)
- ✅ Show key features
- ✅ Saved in screenshots/ folder

---

### Action 4.2: Update Documentation
**Priority:** P2
**Impact:** Developer experience
**Effort:** 15 minutes

**Files to Update:**
```bash
# Update README.md with NeuroNexa branding
code README.md

# Update CHANGELOG.md
code CHANGELOG.md

# Create v1.0.0 release notes
```

**README.md Updates:**
```markdown
# NeuroNexa: Cognitive Disorders Support

Compassionate support for individuals with ADHD, autism, dementia,
and other cognitive challenges.

## Features
- AI-powered task breakdown
- Breathing & mindfulness exercises
- Caregiver support network
- Memory exercises & journals
- Accessibility-first design
```

**CHANGELOG.md Entry:**
```markdown
## [1.0.0] - 2025-11-12

### Added
- NeuroNexa rebrand (previously Nexa)
- Production builds for iOS and Android
- Complete App Store Connect setup
- Enhanced testing suite

### Changed
- Bundle ID: app.rork.neuronexa
- Package: app.rork.neuronexa
- App name: "NeuroNexa: Cognitive Disorders Support"

### Fixed
- Removed 254 backup files
- Updated .gitignore patterns
```

**Success Criteria:**
- ✅ README.md updated
- ✅ CHANGELOG.md updated
- ✅ Documentation reflects NeuroNexa branding

---

### Action 4.3: Commit Rebrand Changes
**Priority:** P0
**Impact:** Track rebrand in git history
**Effort:** 5 minutes

**Commands:**
```bash
# Stage all changes
git add .

# Commit rebrand
git commit -m "feat: Complete NeuroNexa rebrand and prepare for App Store

- Rebrand from Nexa to NeuroNexa (name conflict resolution)
- Updated Bundle ID: app.rork.neuronexa
- Updated Package: app.rork.neuronexa
- Registered new Bundle ID in Apple Developer Portal
- Created app in App Store Connect (SKU: neuronexa-2025)
- Generated new EAS project and builds
- Removed 254 backup files
- Updated .gitignore patterns
- Captured screenshots for App Store
- Updated documentation

Ready for TestFlight and App Store submission.

Bundle ID: app.rork.neuronexa
App Store Connect: Ready
EAS Builds: Complete (iOS + Android)
Screenshots: 5-7 captured
Documentation: Updated"

# Push to GitHub
git push origin main
```

**Success Criteria:**
- ✅ Clean commit with rebrand
- ✅ Pushed to GitHub
- ✅ GitHub repo updated

---

## 📋 Phase 5: Submission Preparation (30 minutes) 🟣

### Action 5.1: Submit to TestFlight
**Priority:** P1
**Impact:** Internal testing before public release
**Effort:** 10 minutes

**Commands:**
```bash
# Submit iOS build to TestFlight
eas submit --platform ios

# Follow prompts:
# - Select latest build
# - Confirm submission
# - Wait for processing (5-15 minutes)

# Check status
eas build:list --platform ios --limit 1
```

**Success Criteria:**
- ✅ Build submitted to TestFlight
- ✅ Processing completes
- ✅ Available for internal testing

---

### Action 5.2: Upload Screenshots to App Store Connect
**Priority:** P1
**Impact:** Required for review
**Effort:** 10 minutes

**Steps:**
1. Go to App Store Connect
2. Select NeuroNexa app
3. Go to "App Store" tab
4. Scroll to "Screenshots"
5. Upload 5-7 screenshots (1290×2796px)
6. Add captions (optional)
7. Click "Save"

**Success Criteria:**
- ✅ Screenshots uploaded
- ✅ Displayed in correct order
- ✅ All required sizes covered

---

### Action 5.3: Final Submission Checklist
**Priority:** P0
**Impact:** Readiness verification
**Effort:** 10 minutes

**Checklist:**
```markdown
App Identity
- [ ] App name: "NeuroNexa: Cognitive Disorders Support"
- [ ] Bundle ID: app.rork.neuronexa
- [ ] SKU: neuronexa-2025
- [ ] Version: 1.0
- [ ] Build number: 1

App Store Connect
- [ ] Promotional text (170 chars)
- [ ] Description (4,000 chars)
- [ ] Keywords (100 chars)
- [ ] Support URL
- [ ] Privacy URL
- [ ] Screenshots (5-7)

Builds
- [ ] iOS build uploaded
- [ ] Android build ready
- [ ] TestFlight active
- [ ] No critical bugs

Legal
- [ ] Privacy Policy hosted
- [ ] Terms of Service hosted
- [ ] Data retention policy
- [ ] Accessibility statement

Testing
- [ ] Test suite passing
- [ ] Manual testing complete
- [ ] No blocking issues
```

**Success Criteria:**
- ✅ All checklist items complete
- ✅ Ready for App Store submission

---

## 📅 Timeline Summary

### Day 1 (Today - 4 hours)
```
Hour 1: Repository Cleanup
  ├─ 0:00-0:05 → Remove backup files
  ├─ 0:05-0:10 → Update .gitignore
  ├─ 0:10-0:15 → Commit cleanup
  └─ 0:15-0:30 → Break

Hour 2-3: NeuroNexa Rebrand
  ├─ 0:30-0:45 → Register Bundle ID
  ├─ 0:45-1:05 → Create App Store Connect app
  ├─ 1:05-1:10 → Update eas.json
  ├─ 1:10-1:20 → Initialize EAS project
  ├─ 1:20-1:35 → Start builds (iOS + Android)
  └─ 1:35-2:00 → Wait for builds / Break

Hour 4: Quality Assurance
  ├─ 2:00-2:20 → Download and test builds
  ├─ 2:20-2:35 → Run test suite
  ├─ 2:35-2:45 → Lint and type check
  └─ 2:45-3:00 → Review results

Evening: Capture screenshots (optional, can do Day 2)
```

### Day 2 (Tomorrow - 2 hours)
```
Hour 1: Screenshots & Documentation
  ├─ 0:00-0:30 → Capture screenshots
  ├─ 0:30-0:45 → Update documentation
  └─ 0:45-1:00 → Commit rebrand changes

Hour 2: Submission Preparation
  ├─ 1:00-1:10 → Submit to TestFlight
  ├─ 1:10-1:20 → Upload screenshots
  ├─ 1:20-1:30 → Final checklist review
  └─ 1:30-2:00 → Submit for review (if ready)
```

### Day 3 (Optional - Polish)
```
- Address any App Store review feedback
- Fix any issues from TestFlight testing
- Prepare marketing materials
```

---

## 🚨 Critical Path & Dependencies

```
Repository Cleanup
        ↓
Register Bundle ID ← [BLOCKING iOS BUILD]
        ↓
Create App Store Connect App ← [BLOCKING SUBMISSION]
        ↓
Update eas.json
        ↓
Initialize EAS Project
        ↓
Build iOS + Android ← [PARALLEL - 10 min wait]
        ↓
Test Builds
        ↓
Capture Screenshots ← [REQUIRED FOR REVIEW]
        ↓
Submit to TestFlight
        ↓
Upload Screenshots
        ↓
Final Review → SUBMIT FOR APP STORE REVIEW
```

---

## ⚠️ Risk Mitigation

### Risk 1: Build Failures
**Probability:** Low
**Impact:** High
**Mitigation:**
- Keep backup of old Nexa builds
- Test locally before EAS build
- Have rollback plan ready

### Risk 2: App Store Rejection
**Probability:** Medium
**Impact:** Medium
**Mitigation:**
- Follow App Store guidelines strictly
- Test all features thoroughly
- Have legal docs in place
- Respond quickly to feedback

### Risk 3: Time Overrun
**Probability:** Low
**Impact:** Low
**Mitigation:**
- Buffer time in schedule
- Focus on critical path
- Defer nice-to-have items

---

## ✅ Success Metrics

### Completion Criteria
- [ ] Repository cleaned (0 .bak files)
- [ ] NeuroNexa branding complete
- [ ] Bundle ID registered
- [ ] App Store Connect configured
- [ ] iOS + Android builds successful
- [ ] Test suite passing
- [ ] Screenshots captured (5-7)
- [ ] TestFlight submission complete
- [ ] Ready for App Store submission

### Quality Metrics
- [ ] Test coverage ≥60%
- [ ] No ESLint errors
- [ ] No TypeScript errors
- [ ] No critical bugs
- [ ] Build time <10 min (iOS), <15 min (Android)

---

## 📞 Support & Escalation

### If Stuck:
1. **Apple Developer Issues:** https://developer.apple.com/support/
2. **App Store Connect:** https://appstoreconnect.apple.com/help
3. **EAS Build Issues:** https://expo.dev/accounts/litmoncloud/projects
4. **GitHub Issues:** https://github.com/LitmonCloud/rork-neuronexa--cognitive-disorders-support-app/issues

### Emergency Contacts:
- **Apple Developer Support:** developer.apple.com/contact
- **Expo Support:** expo.dev/support
- **Documentation:** All guides in project root

---

## 🎯 Next Actions (Start Now!)

### Step 1: Open Terminal
```bash
cd /Users/bobbylitmon/rork-neuronexa--cognitive-disorders-support-app
```

### Step 2: Remove Backup Files
```bash
find . -name "*.bak" -type f -delete
```

### Step 3: Update .gitignore
```bash
echo "*.bak" >> .gitignore
```

### Step 4: Commit Cleanup
```bash
git add .gitignore
git commit -m "chore: Remove backup files and update .gitignore"
```

### Step 5: Register Bundle ID
Open browser: https://developer.apple.com/account/resources/identifiers/list

---

**Document Status:** ✅ READY FOR EXECUTION
**Last Updated:** November 12, 2025
**Est. Completion:** Day 2 (2-3 days total)
