# Nexa — Screenshot Capture Guide

**Version:** 1.0.0  
**Last Updated:** 2025-10-02

This guide explains how to capture, frame, and prepare screenshots for App Store and Google Play Store submission.

---

## 📱 Required Screenshots

### iOS App Store

**iPhone 6.7" (Pro Max)** - Required
- Resolution: 1290 × 2796 pixels
- Devices: iPhone 15 Pro Max, 14 Pro Max, 13 Pro Max, 12 Pro Max
- Minimum: 3 screenshots, Maximum: 10 screenshots

**iPhone 6.1" (Pro)** - Required  
- Resolution: 1179 × 2556 pixels
- Devices: iPhone 15 Pro, 15, 14 Pro, 14, 13 Pro, 13, 12 Pro, 12
- Minimum: 3 screenshots, Maximum: 10 screenshots

**iPad Pro 12.9"** - Optional but Recommended
- Resolution: 2048 × 2732 pixels
- Devices: iPad Pro 12.9" (all generations)
- Minimum: 3 screenshots, Maximum: 10 screenshots

### Google Play Store

**Phone** - Required
- Minimum: 2 screenshots, Maximum: 8 screenshots
- Minimum dimension: 320px
- Maximum dimension: 3840px
- Aspect ratio: 16:9 or 9:16

**Tablet** - Optional
- Same requirements as phone
- Recommended for better tablet visibility

---

## 🎯 Recommended Screenshots

Capture these 7 key screens to showcase Nexa's features:

1. **Home / Today View**
   - Show Nexa AI coach greeting
   - Display today's tasks
   - Highlight premium badge (if applicable)
   - Caption: "Meet Nexa, your personalized AI coach"

2. **AI Task Breakdown**
   - Show a task with AI-generated steps
   - Display cognitive level selector
   - Show step-by-step guidance
   - Caption: "Break down complex tasks into simple steps"

3. **Breathing Exercise**
   - Show breathing pattern in action
   - Display visual timer
   - Show haptic feedback indicator
   - Caption: "Calm your mind with guided breathing"

4. **Accessibility Settings**
   - Show high contrast, large text, reduced motion toggles
   - Display cognitive support options
   - Show voice guidance settings
   - Caption: "Customize for your unique needs"

5. **Progress Analytics**
   - Show completion stats
   - Display streak counter
   - Show weekly/monthly trends
   - Caption: "Track your progress and celebrate wins"

6. **Caregiver Management**
   - Show caregiver list
   - Display add caregiver form
   - Show test alert button
   - Caption: "Stay connected with your support network"

7. **Onboarding / Welcome**
   - Show first onboarding slide
   - Display app value proposition
   - Show "Get Started" button
   - Caption: "Cognitive support that adapts to you"

---

## 📸 How to Capture Screenshots

### Method 1: Using iOS Simulator (Recommended)

1. **Open Simulator**
   ```bash
   npm start
   # Press 'i' to open iOS simulator
   ```

2. **Select Device**
   - Go to: File → Open Simulator → iOS 18.0 → iPhone 15 Pro Max
   - Repeat for iPhone 15 Pro and iPad Pro 12.9"

3. **Navigate to Screen**
   - Open the app and navigate to the desired screen
   - Ensure all content is loaded and looks perfect

4. **Capture Screenshot**
   - Press: `Cmd + S` (saves to Desktop)
   - Or: File → Save Screen

5. **Repeat for All Screens**
   - Capture all 7 recommended screens
   - Capture on all required device sizes

### Method 2: Using Physical Device

1. **Install on Device**
   ```bash
   # Build development client
   eas build --profile development --platform ios
   ```

2. **Capture Screenshot**
   - iPhone: Press `Volume Up + Side Button` simultaneously
   - iPad: Press `Volume Up + Top Button` simultaneously

3. **Transfer to Computer**
   - AirDrop to Mac
   - Or: Connect via USB and use Image Capture app

### Method 3: Using Android Emulator

1. **Open Emulator**
   ```bash
   npm start
   # Press 'a' to open Android emulator
   ```

2. **Select Device**
   - Use Pixel 7 Pro or Samsung Galaxy S23 Ultra

3. **Capture Screenshot**
   - Click camera icon in emulator toolbar
   - Or: Press `Cmd + S` (Mac) / `Ctrl + S` (Windows)

---

## 🖼️ Framing Screenshots

### Option 1: Use Online Tools (Easiest)

**Recommended Tools:**
- [Screely](https://www.screely.com/) - Free, instant browser-based
- [Mockuphone](https://mockuphone.com/) - Free device mockups
- [Smartmockups](https://smartmockups.com/) - Free tier available
- [Previewed](https://previewed.app/) - Free tier available

**Steps:**
1. Upload your screenshot
2. Select device frame (iPhone 15 Pro Max, etc.)
3. Adjust background color (use Nexa brand colors)
4. Add optional text overlay
5. Download framed image

### Option 2: Use Figma/Sketch (Professional)

1. **Download Device Mockups**
   - [Facebook Design Resources](https://design.facebook.com/toolsandresources/devices/)
   - [Apple Design Resources](https://developer.apple.com/design/resources/)

2. **Import to Figma/Sketch**
   - Create artboard for each device size
   - Place screenshot inside device frame
   - Add background gradient
   - Add text captions

3. **Export**
   - Export at 2x or 3x resolution
   - Use PNG format
   - Ensure exact dimensions match store requirements

### Option 3: Use Fastlane Frameit (Automated)

```bash
# Install fastlane
gem install fastlane

# Install frameit
fastlane frameit setup

# Frame screenshots
fastlane frameit
```

---

## 📝 Adding Captions

### Caption Guidelines

- **Length:** 30-40 characters max
- **Font:** San Francisco (iOS) or Roboto (Android)
- **Size:** 48-64pt for readability
- **Color:** High contrast (white text on dark background, or vice versa)
- **Position:** Top or bottom, consistent across all screenshots

### Recommended Captions

1. "Meet Nexa, your personalized AI coach"
2. "Break down complex tasks into simple steps"
3. "Calm your mind with guided breathing"
4. "Customize for your unique needs"
5. "Track your progress and celebrate wins"
6. "Stay connected with your support network"
7. "Cognitive support that adapts to you"

---

## 📂 File Organization

Create this folder structure:

```
store/
├── screenshots/
│   ├── ios/
│   │   ├── 6.7-inch/
│   │   │   ├── 01-home.png
│   │   │   ├── 02-ai-breakdown.png
│   │   │   ├── 03-breathing.png
│   │   │   ├── 04-accessibility.png
│   │   │   ├── 05-progress.png
│   │   │   ├── 06-caregiver.png
│   │   │   └── 07-onboarding.png
│   │   ├── 6.1-inch/
│   │   │   └── [same files]
│   │   └── 12.9-inch/
│   │       └── [same files]
│   └── android/
│       ├── phone/
│       │   └── [same files]
│       └── tablet/
│           └── [same files]
└── app-preview/
    ├── ios-preview.mp4
    └── android-preview.mp4
```

---

## ✅ Pre-Upload Checklist

Before uploading to stores:

- [ ] All screenshots are correct dimensions
- [ ] Screenshots show actual app content (no mockups)
- [ ] No placeholder text or lorem ipsum
- [ ] No personal information visible
- [ ] Consistent branding across all screenshots
- [ ] Captions are clear and readable
- [ ] Screenshots are in correct order (1-7)
- [ ] File names are descriptive
- [ ] All required device sizes captured
- [ ] Screenshots show latest app version
- [ ] No debug overlays or developer tools visible
- [ ] Status bar shows full signal and battery
- [ ] Time shows 9:41 AM (iOS convention)

---

## 🎬 App Preview Video (Optional)

### iOS App Preview

**Requirements:**
- Duration: 15-30 seconds
- Resolution: Match screenshot dimensions
- Format: .mov, .m4v, or .mp4
- File size: Max 500 MB
- Orientation: Portrait

**Content Ideas:**
1. Open app (0-2s)
2. Show Nexa greeting (2-5s)
3. Create task with AI breakdown (5-12s)
4. Complete breathing exercise (12-20s)
5. View progress stats (20-25s)
6. Show accessibility features (25-30s)

**Tools:**
- QuickTime Screen Recording (Mac)
- iOS Simulator recording
- iMovie for editing

### Android App Preview

**Requirements:**
- Duration: 30 seconds max
- Resolution: 1080p or higher
- Format: .mp4
- File size: Max 100 MB
- Orientation: Portrait or landscape

---

## 🚀 Uploading to Stores

### App Store Connect

1. Go to: My Apps → [Your App] → App Store → Screenshots
2. Select device size (6.7", 6.1", 12.9")
3. Drag and drop screenshots in order
4. Add optional app preview video
5. Save changes

### Google Play Console

1. Go to: Store presence → Main store listing → Screenshots
2. Select device type (Phone, Tablet)
3. Upload screenshots (minimum 2, maximum 8)
4. Reorder if needed
5. Save changes

---

## 💡 Tips for Great Screenshots

1. **Use Real Data:** Show actual tasks, not "Task 1", "Task 2"
2. **Show Value:** Each screenshot should communicate a benefit
3. **Consistent Lighting:** Use same time of day for all screenshots
4. **Clean UI:** Hide keyboard, close modals, show final state
5. **Highlight Features:** Use arrows or highlights to draw attention
6. **Test on Device:** View screenshots on actual device before uploading
7. **A/B Test:** Try different screenshot orders to see what converts best
8. **Update Regularly:** Refresh screenshots when you add new features

---

## 📞 Support

If you need help with screenshots:
- **Figma Template:** [Coming Soon]
- **Video Tutorial:** [Coming Soon]
- **Support Email:** support@nexa.app

---

**Good luck with your screenshots! 📸**

*Simplify. Scaffold. Support independence.*
