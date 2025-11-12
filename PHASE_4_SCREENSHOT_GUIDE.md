# Phase 4: App Store Screenshots - Complete Capture Guide

**Created**: 2025-11-12
**Estimated Time**: 4-6 hours
**Output**: 14 screenshots (7 screens × 2 iOS sizes)

---

## Quick Start

### Prerequisites
✅ App running with realistic data
✅ Simulators ready (iPhone 15 Pro Max & Pro)
✅ Clean screenshots folder structure

### Screenshot Strategy

**Narrative Flow**: Tell the story of how Nexa helps users manage cognitive challenges

1. **Home** - "Your AI-powered cognitive support companion"
2. **AI Task Breakdown** - "Break down overwhelming tasks into manageable steps"
3. **Breathing Exercise** - "Calm your mind with guided breathing"
4. **Finger Tracing** - "Improve focus with mindful finger exercises"
5. **Accessibility** - "Designed for everyone, customizable for you"
6. **Caregiver Dashboard** - "Family support and connection"
7. **Progress Tracking** - "Celebrate your growth and achievements"

---

## Screenshot Specifications

### Required Sizes

#### iOS App Store
- **iPhone 6.7"** (1290×2796) - iPhone 15 Pro Max, 14 Pro Max
- **iPhone 6.5"** (1284×2778) - iPhone 14 Plus, 13 Pro Max, 12 Pro Max
- **iPhone 5.5"** (1242×2208) - iPhone 8 Plus, 7 Plus, 6s Plus

**Recommended**: Focus on 6.7" (most common), use for 6.5" and 5.5" as well

#### Google Play Store
- **Phone** (1080×1920 minimum, up to 3840×2160)
- **Recommended**: Use iOS 6.7" screenshots (1290×2796)

### File Naming Convention
```
[platform]-[size]/[number]-[screen-name].png

Examples:
ios-6_7/01-home.png
ios-6_7/02-ai-breakdown.png
android/01-home.png
```

---

## Setup Instructions

### 1. Prepare Simulators

```bash
# List available devices
xcrun simctl list devices | grep "iPhone 15"

# Expected output:
# iPhone 15 Pro Max (DEVICE-ID) (Booted)
# iPhone 15 Pro (DEVICE-ID) (Shutdown)

# Boot iPhone 15 Pro Max (6.7")
xcrun simctl boot "iPhone 15 Pro Max"

# Boot iPhone 15 Pro (6.1")
xcrun simctl boot "iPhone 15 Pro"

# Open Simulator app
open -a Simulator
```

### 2. Configure Simulator Settings

**For Each Simulator**:
1. **Device** → **Erase All Content and Settings** (fresh start)
2. **I/O** → **Keyboard** → Uncheck "Connect Hardware Keyboard" (show software keyboard)
3. **Window** → **Physical Size** (or Cmd+1 for 100% scale)
4. Set system time to: **November 12, 2025, 10:00 AM**
5. Enable **Appearance: Light** (Settings → Display & Brightness)

### 3. Launch App with Test Data

```bash
# Start Expo development server
bun run start

# In Expo CLI, press 'i' to open iOS simulator
# OR
# Press 'Shift + I' to select specific simulator
```

### 4. Populate Test Data

Run this script in the app to create realistic test data:

```typescript
// In app console or debug menu
const populateTestData = async () => {
  // Create test tasks
  await createTask({
    title: "Grocery shopping for dinner",
    description: "Get ingredients for pasta night",
    priority: "high",
    due_date: new Date()
  });

  await createTask({
    title: "Call Mom",
    description: "Catch up and say hi",
    priority: "medium"
  });

  await createTask({
    title: "Take evening medication",
    priority: "urgent",
    due_date: new Date(Date.now() + 3600000) // 1 hour from now
  });

  // Create mood entry
  await createMoodEntry({
    mood_value: 4,
    mood_label: "happy",
    notes: "Feeling productive today!"
  });
};
```

---

## Screenshot Capture Process

### Screen 1: Home / Today View ⭐

**Purpose**: Show clean, organized task list with AI greeting

**Setup** (5 minutes):
1. Navigate to Home tab
2. Ensure 3-4 tasks visible
3. Check date displays correctly
4. Verify AI greeting shows: "Good morning! Ready to tackle today?"

**Capture** (10 minutes):
1. **iPhone 15 Pro Max** (6.7"):
   - Open Simulator
   - Navigate to Home screen
   - Wait for animations to settle
   - Press **Cmd+S** to save screenshot
   - File saves to Desktop by default
   - Move to `store/screenshots/ios-6_7/01-home.png`

2. Switch to **iPhone 15 Pro** (6.1"), repeat

**Quality Checklist**:
- ✅ No keyboard visible
- ✅ Clean status bar (good signal, battery, time)
- ✅ Tasks clearly visible
- ✅ AI greeting present
- ✅ Today's date shown
- ✅ No debug UI or overlays

---

### Screen 2: AI Task Breakdown 🤖

**Purpose**: Demonstrate AI-powered task decomposition

**Setup** (10 minutes):
1. Create new task: "Organize apartment for weekend guests"
2. Tap "Break Down Task" button
3. Wait for AI response (~3-5 seconds)
4. Ensure breakdown shows 4-6 substeps

**Expected AI Response**:
```
Breaking down "Organize apartment for weekend guests":

1. Clean living room and dining area (30 min)
2. Change guest bedroom sheets (15 min)
3. Stock bathroom with fresh towels (10 min)
4. Tidy kitchen and take out trash (20 min)
5. Vacuum all rooms (25 min)
6. Set out fresh flowers or air freshener (5 min)

Total estimated time: ~2 hours
```

**Capture** (10 minutes):
1. Ensure AI breakdown is fully visible
2. Screenshot on both simulators
3. Save as `02-ai-breakdown.png`

**Quality Checklist**:
- ✅ AI response fully visible
- ✅ Substeps numbered and clear
- ✅ Time estimates shown
- ✅ Professional, helpful tone
- ✅ No loading indicators

---

### Screen 3: Breathing Exercise 🫁

**Purpose**: Showcase wellness and calming features

**Setup** (10 minutes):
1. Navigate to Wellness tab
2. Select "Breathing Exercises"
3. Choose "4-7-8 Relaxation" pattern
4. Tap "Start Exercise"
5. Wait for animation to reach active state

**Capture Timing**:
- Capture at **timer: 00:45** (mid-exercise)
- Animation should show breathing circle expanding/contracting
- Text: "Breathe In" or "Hold"

**Capture** (10 minutes):
1. Start exercise
2. Wait for perfect animation frame
3. Screenshot on both simulators
4. Save as `03-breathing.png`

**Quality Checklist**:
- ✅ Animation clearly visible
- ✅ Timer showing (e.g., "2:15 remaining")
- ✅ Instructions clear ("Breathe In", "Hold", "Breathe Out")
- ✅ Calming colors (blues, purples)
- ✅ Circular animation present

---

### Screen 4: Finger Tracing Exercise ✍️

**Purpose**: Demonstrate focus and mindfulness features

**Setup** (15 minutes):
1. Navigate to Wellness tab → Finger Trace
2. Select "Circle" exercise
3. Tap "Start Exercise"
4. Trace ~80% of circle with finger/mouse
5. Ensure accuracy meter shows "Good!" or "Excellent!"

**Capture Timing**:
- Capture when trace line is 70-80% complete
- Accuracy: 85-95% (green indicator)
- Timer: 00:12-00:18 seconds

**Capture** (10 minutes):
1. Practice tracing a few times
2. Start fresh trace
3. Screenshot at optimal moment
4. Save as `04-finger-trace.png`

**Quality Checklist**:
- ✅ Trace line clearly visible
- ✅ Shape outline present (circle, square, star)
- ✅ Accuracy meter showing "Good!" (green)
- ✅ Timer visible
- ✅ Finger trace smooth and clean

---

### Screen 5: Accessibility Settings ♿

**Purpose**: Show inclusive design and customization

**Setup** (10 minutes):
1. Navigate to Settings tab → Accessibility
2. Enable **High Contrast Mode** (toggle ON)
3. Adjust **Large Text** slider to 120%
4. Enable **Reduced Motion** (toggle ON)
5. Enable **Screen Reader Optimizations**

**Capture** (10 minutes):
1. Scroll to show 4-5 accessibility options
2. Ensure toggles are clearly visible
3. Screenshot on both simulators
4. Save as `05-accessibility.png`

**Quality Checklist**:
- ✅ Multiple accessibility options visible
- ✅ Toggles showing ON state (blue/green)
- ✅ Clear labels and descriptions
- ✅ Text size slider visible
- ✅ Professional, organized layout

---

### Screen 6: Caregiver Dashboard 👨‍👩‍👧‍👦

**Purpose**: Highlight family support and connection features

**Setup** (15 minutes):
1. Create test caregiver account or use demo mode
2. Link to patient profile (use invite code system)
3. Navigate to Caregiver Hub
4. Ensure patient overview shows:
   - Recent mood: "Happy 😊"
   - Today's tasks: "3 of 5 completed"
   - Last location update: "Home, 10:23 AM"

**Capture** (10 minutes):
1. Navigate to Caregiver Dashboard
2. Ensure patient data is visible but privacy-respectful
3. Screenshot on both simulators
4. Save as `06-caregiver-dashboard.png`

**Quality Checklist**:
- ✅ Patient overview card visible
- ✅ Recent activity summary present
- ✅ Location status shown (if enabled)
- ✅ Privacy-focused design
- ✅ Professional, caring aesthetic

---

### Screen 7: Progress & Achievements 📊

**Purpose**: Celebrate user growth and build motivation

**Setup** (15 minutes):
1. Navigate to Progress tab
2. Populate with test data:
   - 5-day mood chart (trending positive)
   - Task completion: 32/40 this week (80%)
   - Wellness streak: 5 days
   - Achievements: "5 Day Streak", "Task Master"

**Capture** (10 minutes):
1. Ensure progress charts are visible
2. Show positive trend lines
3. Screenshot on both simulators
4. Save as `07-progress.png`

**Quality Checklist**:
- ✅ Charts clearly visible
- ✅ Positive trends highlighted
- ✅ Achievement badges shown
- ✅ Statistics accurate and motivating
- ✅ Clean, data-visualization design

---

## Post-Capture Process

### 1. Organize Screenshots

```bash
# Verify all screenshots captured
ls -la store/screenshots/ios-6_7/
ls -la store/screenshots/ios-6_1/

# Expected files (per directory):
# 01-home.png
# 02-ai-breakdown.png
# 03-breathing.png
# 04-finger-trace.png
# 05-accessibility.png
# 06-caregiver-dashboard.png
# 07-progress.png
```

### 2. Quality Check

For each screenshot:
- ✅ Correct resolution (1290×2796 for 6.7")
- ✅ No simulator chrome/bezels
- ✅ Clean status bar
- ✅ No debug overlays
- ✅ Professional appearance
- ✅ Content clearly visible

### 3. Create Captions

**Store Listing Captions** (70 characters max):

1. **Home**: "AI-powered task management for ADHD, autism, and more"
2. **AI Breakdown**: "Break overwhelming tasks into simple, manageable steps"
3. **Breathing**: "Guided breathing exercises to calm anxiety and stress"
4. **Finger Trace**: "Mindful exercises to improve focus and attention"
5. **Accessibility**: "Designed for everyone with customizable accessibility"
6. **Caregiver**: "Connect with family and caregivers for extra support"
7. **Progress**: "Track your growth and celebrate your achievements"

---

## Troubleshooting

### Screenshot is Dark/Black
**Solution**: Simulator may be locked. Press Cmd+L to unlock, wait 2 seconds, then screenshot.

### Animation Looks Choppy
**Solution**: Use **Window → Physical Size** instead of "Fit Screen". Restart simulator if needed.

### Status Bar Shows Wrong Time
**Solution**: Simulator → Debug → Location → Custom Location → Set time in system preferences.

### Colors Look Washed Out
**Solution**: Simulator → Settings → Display & Brightness → Appearance: Light (not Auto or Dark).

### Screenshot Has Simulator Chrome
**Solution**: Use Cmd+S (not external screenshot tool). This captures just the device screen.

### File Size Too Large
**Solution**: Use PNG compression tool:
```bash
# Install pngquant
brew install pngquant

# Compress screenshots (lossless quality)
pngquant --quality=85-95 store/screenshots/ios-6_7/*.png --ext .png --force
```

---

## Android Screenshots (Optional)

If you want dedicated Android screenshots:

### Setup Android Emulator

```bash
# List available Android Virtual Devices
emulator -list-avds

# Start Pixel 6 Pro (or similar)
emulator -avd Pixel_6_Pro
```

### Capture Process
1. Same 7 screens as iOS
2. Android-specific UI elements (Material Design)
3. Save to `store/screenshots/android/`
4. Resolution: 1440×3120 (Pixel 6 Pro) or 1080×1920 (minimum)

---

## Completion Checklist

### Screenshots Captured
- [ ] 01-home.png (both sizes)
- [ ] 02-ai-breakdown.png (both sizes)
- [ ] 03-breathing.png (both sizes)
- [ ] 04-finger-trace.png (both sizes)
- [ ] 05-accessibility.png (both sizes)
- [ ] 06-caregiver-dashboard.png (both sizes)
- [ ] 07-progress.png (both sizes)

### Quality Verified
- [ ] All screenshots correct resolution
- [ ] No simulator UI visible
- [ ] Clean status bars
- [ ] Professional appearance
- [ ] Content clearly visible

### Organized
- [ ] Files properly named
- [ ] Stored in correct directories
- [ ] Captions written
- [ ] Backup created

### Next Steps
- [ ] Upload to App Store Connect
- [ ] Upload to Google Play Console
- [ ] Test on actual store listing preview
- [ ] Get feedback from team/testers

---

## Time Estimates

| Task | Estimated Time | Actual Time |
|------|----------------|-------------|
| Setup simulators | 15 min | ___ |
| Populate test data | 15 min | ___ |
| Screen 1: Home | 15 min | ___ |
| Screen 2: AI Breakdown | 20 min | ___ |
| Screen 3: Breathing | 20 min | ___ |
| Screen 4: Finger Trace | 25 min | ___ |
| Screen 5: Accessibility | 20 min | ___ |
| Screen 6: Caregiver | 25 min | ___ |
| Screen 7: Progress | 25 min | ___ |
| Quality check | 30 min | ___ |
| Organization | 15 min | ___ |
| **Total** | **4.5 hours** | ___ |

---

## Tips for Success

### 1. Take Multiple Shots
- Capture 3-5 attempts per screen
- Choose the best one later
- Don't delete until you've reviewed all

### 2. Use Natural Lighting
- Simulator looks best at 100% brightness
- Avoid dark mode for screenshots (harder to see)
- Use light theme for accessibility

### 3. Keep It Real
- Use realistic task names and data
- Avoid Lorem Ipsum or placeholder text
- Show genuine app functionality

### 4. Tell a Story
- Screenshots should flow together
- Show different features
- Highlight key benefits

### 5. Test on Actual Devices
- After capturing, view on physical iPhone
- Colors may look different
- Adjust if needed

---

**Created by**: Claude Code SuperClaude Framework
**Date**: 2025-11-12
**Phase**: 4 of 7
**Next Phase**: Production Builds with EAS
