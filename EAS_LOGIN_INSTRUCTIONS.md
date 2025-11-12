# EAS CLI Authentication Instructions

**Status**: ⏳ Action Required - Manual Login Needed
**Created**: 2025-11-12

---

## 🔐 Step 1: Login to EAS CLI

Since EAS login requires interactive input, you need to run this command in your terminal:

```bash
cd /Users/bobbylitmon/rork-neuronexa--cognitive-disorders-support-app
eas login
```

### What You'll Be Asked:

1. **Email or username**: Enter your Expo account email
2. **Password**: Enter your Expo account password

### Example Session:
```
$ eas login
Email or username: your-email@example.com
Password: [your password - hidden]
✔ Logged in
```

---

## ✅ Step 2: Verify Authentication

After logging in, verify your session:

```bash
eas whoami
```

**Expected Output**:
```
Logged in as your-username
```

---

## 🆕 Don't Have an Expo Account?

If you don't have an Expo account yet, you can create one:

### Option 1: Sign Up via CLI
```bash
eas register
```

### Option 2: Sign Up via Web
Visit: https://expo.dev/signup

**Required Information**:
- Email address
- Username (unique)
- Password

**Note**: Expo accounts are free for basic usage. EAS Build offers a free tier with limited builds per month.

---

## 🔑 Alternative: Personal Access Token

For CI/CD or automated workflows, you can use a Personal Access Token:

### 1. Generate Token
- Visit: https://expo.dev/accounts/[username]/settings/access-tokens
- Click "Create token"
- Give it a name (e.g., "Nexa Production Builds")
- Copy the token immediately (it won't be shown again)

### 2. Set Environment Variable
```bash
export EXPO_TOKEN=your-personal-access-token
```

### 3. Verify Token Authentication
```bash
eas whoami
```

---

## 📋 After Successful Login

Once authenticated, you can proceed with:

### 1. Configure Build Credentials
```bash
# iOS credentials
eas credentials -p ios

# Android credentials
eas credentials -p android
```

### 2. Set Environment Secrets
```bash
# Supabase URL
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://picfkoucbnaoiuhpegba.supabase.co"

# Supabase Anon Key
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# RevenueCat iOS API Key
eas secret:create --scope project --name EXPO_PUBLIC_RC_IOS_API_KEY --value "test_UuEBbaCMjdjrwVUWDdquJcjAmkw"

# RevenueCat Android API Key
eas secret:create --scope project --name EXPO_PUBLIC_RC_ANDROID_API_KEY --value "test_UuEBbaCMjdjrwVUWDdquJcjAmkw"

# Sentry DSN
eas secret:create --scope project --name EXPO_PUBLIC_SENTRY_DSN --value "https://4efda263bc9847e7d9caffde4ef65e90@o4509221317902336.ingest.us.sentry.io/4510350359134208"
```

### 3. Execute First Build
```bash
# iOS production build
eas build --platform ios --profile production

# Android production build
eas build --platform android --profile production

# Both platforms
eas build --platform all --profile production
```

---

## ⚠️ Troubleshooting

### "Not logged in" Error
```bash
# Clear credentials and re-login
rm -rf ~/.expo
eas login
```

### "Invalid credentials" Error
- Verify email and password are correct
- Try resetting password at: https://expo.dev/forgot-password
- Ensure you're not using SSO (use `eas login --sso` for SSO accounts)

### Session Expired
```bash
# Re-authenticate
eas logout
eas login
```

---

## 📊 Account Status Check

After logging in, check your account details:

```bash
# View account information
eas account:view

# Check build credits
eas build:list

# View projects
eas project:list
```

---

## 🔗 Resources

- **Expo Account Signup**: https://expo.dev/signup
- **EAS CLI Docs**: https://docs.expo.dev/build/setup/
- **Personal Access Tokens**: https://docs.expo.dev/accounts/programmatic-access/
- **EAS Build Pricing**: https://expo.dev/pricing

---

## 🎯 Next Steps After Login

1. ✅ Complete EAS authentication (`eas login`)
2. ⏳ Configure iOS credentials
3. ⏳ Configure Android credentials
4. ⏳ Set environment secrets
5. ⏳ Execute production builds
6. ⏳ Download and validate artifacts

---

**Status**: Waiting for manual `eas login` command execution
**Next Command**: `eas whoami` to verify authentication
