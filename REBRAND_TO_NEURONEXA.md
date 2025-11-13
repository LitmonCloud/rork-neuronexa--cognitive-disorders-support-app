# Rebranding from Nexa to NeuroNexa

**Date:** November 12, 2025
**Reason:** "Nexa" name already taken in App Store Connect
**New Brand:** NeuroNexa

---

## Critical Changes Required

### 1. App Name Changes

**Current:**
- App Name: "Nexa: Cognitive Disorders Support App"
- Display Name: "Nexa"
- Slug: "nexa-cognitive-disorders-support-ykokwhv"

**New:**
- App Name: "NeuroNexa: Cognitive Disorders Support"
- Display Name: "NeuroNexa"
- Slug: "neuronexa-cognitive-support"

### 2. Bundle Identifier Changes

**Current:**
```
iOS: app.rork.nexa-cognitive-disorders-support-ykokwhv
Android: app.rork.nexacognitivedisorderssupport
```

**New (Recommended):**
```
iOS: app.rork.neuronexa
Android: app.rork.neuronexa
```

**Why simpler Bundle IDs:**
- Easier to remember and type
- Cleaner for future maintenance
- Standard industry practice
- Still unique and professional

### 3. SKU/Product ID

**New SKU for App Store Connect:**
```
neuronexa-cognitive-support-2025
```

### 4. App Group

**New App Group:**
```
group.app.rork.neuronexa
```

### 5. CloudKit Container (if using)

**New Container:**
```
iCloud.app.rork.neuronexa
```

---

## Step-by-Step Rebranding Process

### Phase 1: Apple Developer Portal (Do This First)

#### Step 1.1: Register New Bundle ID

1. Go to: https://developer.apple.com/account/resources/identifiers/list
2. Click "+" to register new identifier
3. Select "App IDs"
4. Fill in:
   ```
   Description: NeuroNexa Cognitive Disorders Support
   Bundle ID: app.rork.neuronexa
   ```
5. Enable capabilities:
   - ✅ Push Notifications
   - ✅ App Groups
   - ✅ Sign In with Apple (recommended)
   - ✅ iCloud (optional)

#### Step 1.2: Create New App Group

1. In Identifiers, click "+"
2. Select "App Groups"
3. Enter:
   ```
   Identifier: group.app.rork.neuronexa
   Description: NeuroNexa data sharing for widgets and extensions
   ```
4. Register

#### Step 1.3: Assign App Group to Bundle ID

1. Edit Bundle ID: app.rork.neuronexa
2. Under "App Groups", click "Configure"
3. Select: `group.app.rork.neuronexa`
4. Save

#### Step 1.4: Delete/Archive Old Builds

**Important:** The old Bundle ID (`app.rork.nexa-cognitive-disorders-support-ykokwhv`) has builds associated with it.

**Options:**
- **Option A (Recommended):** Leave old Bundle ID registered but unused
- **Option B:** Delete old Bundle ID (loses all builds)

**Recommended:** Keep old Bundle ID for now, creates no cost/issues.

---

### Phase 2: Update app.json

```json
{
  "expo": {
    "name": "NeuroNexa: Cognitive Disorders Support",
    "slug": "neuronexa-cognitive-support",
    "version": "1.0.0",
    "icon": "./assets/images/icon.png",
    "scheme": "neuronexa",

    "ios": {
      "bundleIdentifier": "app.rork.neuronexa",
      "infoPlist": {
        // ... keep existing permissions
      }
    },

    "android": {
      "package": "app.rork.neuronexa",
      // ... keep existing config
    },

    "plugins": [
      [
        "expo-router",
        {
          "origin": "https://rork.com/"
        }
      ]
      // ... keep other plugins
    ],

    "extra": {
      "router": {
        "origin": "https://rork.com/"
      },
      "eas": {
        "projectId": "60c48ad5-c1e8-41cf-ad9f-05b8d61377c0"
      }
    }
  }
}
```

---

### Phase 3: Update Legal Documents

Update all references in:

**Files to update:**
- `legal/PRIVACY_POLICY.md`
- `legal/TERMS_OF_SERVICE.md`
- `legal/ACCESSIBILITY_STATEMENT.md`
- `legal/DATA_RETENTION.md`
- `legal/index.html`

**Find and replace:**
```
Old: Nexa
New: NeuroNexa

Old: nexa-cognitive-disorders-support-app
New: neuronexa-app

Old: app.rork.nexa
New: app.rork.neuronexa
```

**Redeploy legal docs:**
```bash
cd /Users/bobbylitmon/nexa-legal-docs
# Update files
git add .
git commit -m "Rebrand to NeuroNexa"
git push origin main
```

---

### Phase 4: Update Environment Variables

Update `.env` and `.env.example`:

```bash
# Old
AI_PROVIDER=rork
EXPO_PUBLIC_TOOLKIT_URL=https://rork-nexa-toolkit-api.vercel.app

# New (if needed)
AI_PROVIDER=rork
EXPO_PUBLIC_TOOLKIT_URL=https://rork-neuronexa-api.vercel.app
```

---

### Phase 5: Update Code References

**Files with "Nexa" references (key files):**

1. **app.json** - Main configuration
2. **package.json** - Project name
3. **app/(tabs)/_layout.tsx** - Tab labels
4. **app/(tabs)/index.tsx** - Home screen
5. **app/onboarding.tsx** - Onboarding flow
6. **components/SmartPaywall.tsx** - Subscription messaging
7. **Legal documents** - All legal files

**Automated find/replace (be careful!):**
```bash
# Test first - see what would change
grep -r "Nexa" --exclude-dir=node_modules --exclude-dir=.git --exclude="*.bak"

# Manual replacement recommended for code files
# Automated replacement for documentation
```

---

### Phase 6: Update Documentation

**Key documentation files to update:**
- `README.md`
- `APP_STORE_CONNECT_SETUP.md`
- `APPLE_DEVELOPER_CAPABILITIES_GUIDE.md`
- `PHASE_5_COMPLETE.md`
- All other `.md` files

**Bulk update script:**
```bash
# Update all markdown files (excluding .bak files)
find . -name "*.md" -not -name "*.bak" -exec sed -i '' 's/Nexa:/NeuroNexa:/g' {} +
find . -name "*.md" -not -name "*.bak" -exec sed -i '' 's/Nexa /NeuroNexa /g' {} +
find . -name "*.md" -not -name "*.bak" -exec sed -i '' 's/nexa-cognitive/neuronexa-cognitive/g' {} +
```

---

### Phase 7: Rebuild and Redeploy

#### Step 7.1: Clean Previous Builds

```bash
# Clear EAS credentials for old Bundle ID
eas credentials -p ios --clear-all
eas credentials -p android --clear-all

# Or keep them and add new credentials separately
```

#### Step 7.2: Build with New Bundle ID

```bash
# Update eas.json if needed (should work with existing config)

# Build iOS
eas build --platform ios --profile production

# Build Android
eas build --platform android --profile production
```

**What will happen:**
- EAS will detect new Bundle ID
- Will ask to generate new credentials
- Apple account login required again
- New certificates and provisioning profiles created
- New Android keystore generated

#### Step 7.3: Update eas.json Submit Config

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "bobby@rork.com",
        "ascAppId": "[Get from new App Store Connect app]",
        "appleTeamId": "YNSMLADB62"
      },
      "android": {
        "serviceAccountKeyPath": "./google-play-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

---

### Phase 8: App Store Connect Setup

1. **Create New App:**
   - Name: NeuroNexa: Cognitive Disorders Support
   - SKU: neuronexa-cognitive-support-2025
   - Bundle ID: app.rork.neuronexa

2. **Complete App Information:**
   - Privacy URL: https://litmoncloud.github.io/nexa-legal-docs/privacy.html
   - Terms URL: https://litmoncloud.github.io/nexa-legal-docs/terms.html
   - Categories: Health & Fitness, Medical

3. **Upload Build:**
   ```bash
   eas submit --platform ios --profile production
   ```

---

### Phase 9: Google Play Console Setup

1. **Create New App:**
   - App name: NeuroNexa: Cognitive Disorders Support
   - Package name: app.rork.neuronexa

2. **Complete Store Listing:**
   - Privacy Policy: https://litmoncloud.github.io/nexa-legal-docs/privacy.html
   - Description: Update with "NeuroNexa" branding

3. **Upload Build:**
   ```bash
   eas submit --platform android --profile production
   ```

---

## Quick Rebrand Script

I can create an automated script for most changes. Here's what it will do:

```bash
#!/bin/bash
# rebrand-to-neuronexa.sh

echo "🔄 Rebranding Nexa to NeuroNexa..."

# 1. Update app.json
echo "📝 Updating app.json..."
# (Manual editing recommended for this file)

# 2. Update documentation
echo "📚 Updating documentation files..."
find . -name "*.md" -not -name "*.bak" -not -path "*/node_modules/*" -exec sed -i '' 's/Nexa: Cognitive/NeuroNexa: Cognitive/g' {} +
find . -name "*.md" -not -name "*.bak" -not -path "*/node_modules/*" -exec sed -i '' 's/app\.rork\.nexa-cognitive-disorders-support-ykokwhv/app.rork.neuronexa/g' {} +
find . -name "*.md" -not -name "*.bak" -not -path "*/node_modules/*" -exec sed -i '' 's/nexacognitivedisorderssupport/neuronexa/g' {} +

# 3. Update legal documents
echo "⚖️  Updating legal documents..."
cd legal
sed -i '' 's/Nexa/NeuroNexa/g' *.md
sed -i '' 's/Nexa/NeuroNexa/g' index.html
cd ..

# 4. Update package.json
echo "📦 Updating package.json..."
sed -i '' 's/"name": "rork-nexa-cognitive-disorders-support-app"/"name": "rork-neuronexa-cognitive-support"/g' package.json

echo "✅ Rebranding complete!"
echo ""
echo "⚠️  Manual steps required:"
echo "1. Update app.json (name, slug, bundleIdentifier, package)"
echo "2. Register new Bundle ID in Apple Developer Portal"
echo "3. Create new App Group: group.app.rork.neuronexa"
echo "4. Rebuild with: eas build --platform all --profile production"
echo "5. Create new apps in App Store Connect and Google Play Console"
```

---

## Recommended Approach

### Option A: Clean Start (Recommended)

**Advantages:**
- Clean, simple Bundle IDs
- No legacy references
- Professional presentation
- Easier maintenance

**Steps:**
1. Register new Bundle ID: `app.rork.neuronexa`
2. Update app.json with new IDs
3. Rebuild completely with new credentials
4. Create new store listings

**Time:** 2-3 hours

### Option B: Keep Existing, Rename Only

**Advantages:**
- Keep existing builds and credentials
- Faster turnaround
- No Apple Developer Portal changes needed

**Steps:**
1. Only update display names in app.json
2. Update documentation
3. Keep Bundle IDs same
4. Use "NeuroNexa" as App Store listing name

**Limitation:** Bundle ID still says "nexa"

**Time:** 30 minutes

---

## Recommendation

**I recommend Option A (Clean Start)** because:

1. You haven't submitted to stores yet (no users affected)
2. Cleaner Bundle IDs (`app.rork.neuronexa` vs long version)
3. Professional from day one
4. Only 2-3 hours of work
5. Avoids future confusion

---

## What Should We Do?

Please choose:

**A) Clean rebrand** - New Bundle IDs, complete rebuild (2-3 hours)
**B) Quick rebrand** - Just change display names (30 minutes)

I can execute either approach automatically!

---

**Next Steps After Decision:**

1. I'll update all necessary files
2. Create rebrand script
3. Commit changes to Git
4. Guide you through Apple Developer Portal changes
5. Rebuild with new configuration
6. Update store listings

Which option would you like?
