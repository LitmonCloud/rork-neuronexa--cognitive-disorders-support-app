# Legal Documents - Quick Start Guide

**⏱️ Time to Deploy:** 15-30 minutes  
**💰 Cost:** Free (using Netlify/Vercel/GitHub Pages)

---

## 🚀 Deploy in 3 Steps

### Step 1: Choose Hosting (Pick One)

#### Option A: Netlify (Easiest)
```bash
npm install -g netlify-cli
netlify login
cd legal
netlify deploy --prod
```

#### Option B: Vercel
```bash
npm install -g vercel
vercel login
cd legal
vercel --prod
```

#### Option C: GitHub Pages
```bash
cd legal
git init
git add .
git commit -m "Legal documents"
gh repo create nexa-legal --public
git push -u origin main
# Enable Pages in repo settings
```

---

### Step 2: Update Environment Variables

Copy `.env.example` to `.env` and update URLs:

```bash
EXPO_PUBLIC_PRIVACY_POLICY_URL=https://your-deployed-url.com/privacy
EXPO_PUBLIC_TERMS_URL=https://your-deployed-url.com/terms
EXPO_PUBLIC_ACCESSIBILITY_URL=https://your-deployed-url.com/accessibility
EXPO_PUBLIC_DATA_RETENTION_URL=https://your-deployed-url.com/data-retention
```

---

### Step 3: Test Links

```bash
# Build and run app
npm run ios
# or
npm run android

# Navigate to Settings → Legal & Support
# Tap each link to verify they open correctly
```

---

## ✅ Verification Checklist

- [ ] All 4 legal documents are accessible via URLs
- [ ] HTTPS is enabled (padlock icon in browser)
- [ ] Pages are mobile-responsive
- [ ] In-app links open correctly on iOS
- [ ] In-app links open correctly on Android
- [ ] URLs added to App Store Connect
- [ ] URLs added to Google Play Console

---

## 📋 What You Have

### Legal Documents
1. **Privacy Policy** - GDPR, CCPA, COPPA compliant
2. **Terms of Service** - Complete with medical disclaimer
3. **Accessibility Statement** - WCAG 2.1, ADA compliant
4. **Data Retention Policy** - User rights and deletion procedures

### Supporting Files
- **index.html** - Beautiful landing page
- **DEPLOYMENT_GUIDE.md** - Detailed deployment instructions
- **LEGAL_CHECKLIST.md** - Compliance checklist
- **QUICK_START.md** - This file

---

## 🆘 Troubleshooting

### Links return 404
- Check DNS configuration
- Wait for DNS propagation (up to 48 hours)
- Verify files are uploaded correctly

### SSL certificate issues
- Verify custom domain is configured
- Wait for certificate provisioning (5-10 minutes)
- Check DNS records are correct

### In-app links not working
- Verify environment variables are set
- Rebuild the app after changing .env
- Check URLs are correct (no trailing slashes)

---

## 📞 Need Help?

1. **Deployment Issues:** See `legal/DEPLOYMENT_GUIDE.md`
2. **Compliance Questions:** See `legal/LEGAL_CHECKLIST.md`
3. **Full Summary:** See `LEGAL_DOCUMENTS_SUMMARY.md`

---

## 🎯 Next Steps After Deployment

1. **App Store Connect**
   - Add Privacy Policy URL
   - Add Terms of Service URL
   - Complete privacy questionnaire
   - Verify age rating (4+)

2. **Google Play Console**
   - Add Privacy Policy URL
   - Add Terms of Service URL
   - Complete Data Safety section
   - Verify content rating (Everyone)

3. **Legal Review** (Recommended)
   - Hire attorney for review ($3,500-$7,000)
   - Or use legal template service ($500-$1,500)

4. **Set Up Email Addresses**
   - privacy@nexa.app
   - legal@nexa.app
   - support@nexa.app
   - accessibility@nexa.app

---

## ✨ You're Ready!

Once deployed and tested, your legal documents are ready for App Store submission!

**Estimated time to complete:** 15-30 minutes  
**Difficulty:** Easy  
**Cost:** Free

---

*For detailed instructions, see `legal/DEPLOYMENT_GUIDE.md`*
