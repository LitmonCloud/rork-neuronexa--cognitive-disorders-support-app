# Legal Documents Deployment Guide

This guide walks you through deploying NeuroNexa's legal documents to production.

---

## 📋 Quick Start

You have **4 legal documents** ready to deploy:
1. Privacy Policy
2. Terms of Service
3. Accessibility Statement
4. Data Retention Policy

**Target URLs:**
- https://neuronexa.app/legal/privacy
- https://neuronexa.app/legal/terms
- https://neuronexa.app/legal/accessibility
- https://neuronexa.app/legal/data-retention

---

## 🚀 Deployment Options

### Option 1: Netlify (Recommended)

**Why Netlify?**
- Free tier with generous limits
- Automatic SSL certificates
- Custom domain support
- Easy deployment
- Built-in analytics

**Steps:**

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Login to Netlify**
```bash
netlify login
```

3. **Deploy from legal directory**
```bash
cd legal
netlify deploy --prod
```

4. **Configure custom domain**
- Go to Netlify dashboard
- Add custom domain: `neuronexa.app`
- Configure DNS records
- SSL will be automatic

5. **Set up redirects** (optional)
Create `legal/_redirects`:
```
/legal/privacy    /PRIVACY_POLICY.html    200
/legal/terms      /TERMS_OF_SERVICE.html  200
/legal/accessibility  /ACCESSIBILITY_STATEMENT.html  200
/legal/data-retention /DATA_RETENTION.html  200
```

---

### Option 2: Vercel

**Why Vercel?**
- Free tier available
- Fast global CDN
- Automatic SSL
- Easy GitHub integration

**Steps:**

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy from legal directory**
```bash
cd legal
vercel --prod
```

4. **Configure custom domain**
- Go to Vercel dashboard
- Add domain: `neuronexa.app`
- Configure DNS records
- SSL will be automatic

5. **Create vercel.json** (optional)
```json
{
  "rewrites": [
    { "source": "/legal/privacy", "destination": "/PRIVACY_POLICY.html" },
    { "source": "/legal/terms", "destination": "/TERMS_OF_SERVICE.html" },
    { "source": "/legal/accessibility", "destination": "/ACCESSIBILITY_STATEMENT.html" },
    { "source": "/legal/data-retention", "destination": "/DATA_RETENTION.html" }
  ]
}
```

---

### Option 3: GitHub Pages

**Why GitHub Pages?**
- Free hosting
- Version control built-in
- Automatic SSL with custom domain
- Simple setup

**Steps:**

1. **Create a new repository**
```bash
# Create repo: neuronexa-legal
gh repo create neuronexa-legal --public
```

2. **Push legal directory**
```bash
cd legal
git init
git add .
git commit -m "Initial legal documents"
git remote add origin https://github.com/[username]/neuronexa-legal.git
git push -u origin main
```

3. **Enable GitHub Pages**
- Go to repository Settings
- Navigate to Pages section
- Source: Deploy from main branch
- Custom domain: `neuronexa.app`

4. **Configure DNS**
Add CNAME record:
```
CNAME neuronexa.app [username].github.io
```

5. **Wait for SSL**
GitHub will automatically provision SSL (may take a few minutes)

---

### Option 4: AWS S3 + CloudFront

**Why AWS?**
- Enterprise-grade reliability
- Global CDN
- Fine-grained control
- Scalable

**Steps:**

1. **Create S3 bucket**
```bash
aws s3 mb s3://neuronexa-legal
```

2. **Upload files**
```bash
cd legal
aws s3 sync . s3://neuronexa-legal --acl public-read
```

3. **Enable static website hosting**
```bash
aws s3 website s3://neuronexa-legal --index-document index.html
```

4. **Create CloudFront distribution**
- Origin: S3 bucket
- Custom domain: neuronexa.app
- SSL certificate: Request via ACM

5. **Configure DNS**
Add CNAME record pointing to CloudFront distribution

---

## 🔄 Converting Markdown to HTML

If you need HTML versions of the markdown files:

### Using Pandoc

1. **Install Pandoc**
```bash
# macOS
brew install pandoc

# Ubuntu/Debian
sudo apt-get install pandoc

# Windows
choco install pandoc
```

2. **Convert files**
```bash
cd legal

# Convert with custom CSS
pandoc PRIVACY_POLICY.md -o privacy.html --standalone --css=style.css
pandoc TERMS_OF_SERVICE.md -o terms.html --standalone --css=style.css
pandoc ACCESSIBILITY_STATEMENT.md -o accessibility.html --standalone --css=style.css
pandoc DATA_RETENTION.md -o data-retention.html --standalone --css=style.css
```

3. **Create style.css**
```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  color: #333;
}

h1 { color: #667eea; }
h2 { color: #764ba2; margin-top: 2em; }
a { color: #667eea; }
code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
```

### Using Marked (Node.js)

1. **Install marked**
```bash
npm install -g marked
```

2. **Convert files**
```bash
marked PRIVACY_POLICY.md -o privacy.html
marked TERMS_OF_SERVICE.md -o terms.html
marked ACCESSIBILITY_STATEMENT.md -o accessibility.html
marked DATA_RETENTION.md -o data-retention.html
```

---

## 🌐 DNS Configuration

Once you've chosen a hosting provider, configure your DNS:

### For Netlify
```
Type: CNAME
Name: neuronexa.app
Value: [your-site].netlify.app
```

### For Vercel
```
Type: CNAME
Name: neuronexa.app
Value: cname.vercel-dns.com
```

### For GitHub Pages
```
Type: CNAME
Name: neuronexa.app
Value: [username].github.io
```

### For CloudFront
```
Type: CNAME
Name: neuronexa.app
Value: [distribution-id].cloudfront.net
```

---

## ✅ Post-Deployment Checklist

After deploying, verify everything works:

### 1. Test All URLs
```bash
# Test each URL
curl -I https://neuronexa.app/legal/privacy
curl -I https://neuronexa.app/legal/terms
curl -I https://neuronexa.app/legal/accessibility
curl -I https://neuronexa.app/legal/data-retention
```

Expected response: `200 OK`

### 2. Verify SSL Certificate
- Visit each URL in browser
- Check for padlock icon
- Verify certificate is valid
- Ensure no mixed content warnings

### 3. Test Mobile Responsiveness
- Open on mobile device
- Check text is readable
- Verify links work
- Test navigation

### 4. Accessibility Check
- Run Lighthouse audit
- Test with screen reader
- Verify color contrast
- Check keyboard navigation

### 5. Update Environment Variables
```bash
# Update .env file
EXPO_PUBLIC_PRIVACY_POLICY_URL=https://neuronexa.app/legal/privacy
EXPO_PUBLIC_TERMS_URL=https://neuronexa.app/legal/terms
EXPO_PUBLIC_ACCESSIBILITY_URL=https://neuronexa.app/legal/accessibility
EXPO_PUBLIC_DATA_RETENTION_URL=https://neuronexa.app/legal/data-retention
```

### 6. Update App Store Metadata
- **App Store Connect:** Add URLs to app information
- **Google Play Console:** Add URLs to store listing
- **In-App Links:** Test all legal links in app

### 7. Test In-App Links
```bash
# Build and test app
npm run ios
# or
npm run android

# Navigate to Settings → Legal & Support
# Tap each legal link
# Verify correct page opens
```

---

## 🔒 Security Best Practices

### Enable HTTPS Only
Ensure all legal documents are served over HTTPS:
- Netlify/Vercel: Automatic
- GitHub Pages: Automatic with custom domain
- AWS: Configure in CloudFront

### Set Security Headers
Add these headers to your hosting configuration:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

**Netlify:** Create `_headers` file:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

**Vercel:** Add to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```

---

## 📊 Monitoring & Analytics

### Set Up Uptime Monitoring
Use a service to monitor your legal pages:
- **UptimeRobot** (free): https://uptimerobot.com/
- **Pingdom** (paid): https://www.pingdom.com/
- **StatusCake** (free tier): https://www.statuscake.com/

### Track Page Views (Optional)
Add privacy-friendly analytics:
- **Plausible** (paid): https://plausible.io/
- **Fathom** (paid): https://usefathom.com/
- **Simple Analytics** (paid): https://simpleanalytics.com/

**Note:** If you add analytics, update your Privacy Policy!

---

## 🔄 Updating Legal Documents

When you need to update legal documents:

1. **Update the markdown file**
```bash
# Edit the file
vim legal/PRIVACY_POLICY.md

# Update "Last Updated" date
# Update version number if needed
```

2. **Commit changes**
```bash
git add legal/PRIVACY_POLICY.md
git commit -m "Update Privacy Policy: [describe changes]"
```

3. **Deploy update**
```bash
# Netlify
netlify deploy --prod

# Vercel
vercel --prod

# GitHub Pages
git push origin main
```

4. **Notify users** (if material changes)
- Send in-app notification
- Email users (if you have email list)
- Update "Last Updated" date prominently

---

## 🆘 Troubleshooting

### URLs Return 404
- Check DNS configuration
- Verify files are uploaded
- Check file names match URLs
- Wait for DNS propagation (up to 48 hours)

### SSL Certificate Issues
- Verify custom domain is configured
- Check DNS records are correct
- Wait for certificate provisioning
- Contact hosting support if needed

### Mobile Display Issues
- Add viewport meta tag to HTML
- Test responsive CSS
- Check font sizes are readable
- Verify touch targets are large enough

### Links Not Working in App
- Verify environment variables are set
- Check URLs are correct
- Test on both iOS and Android
- Verify Linking.openURL is working

---

## 📞 Support

If you need help deploying:

**Netlify Support:** https://www.netlify.com/support/  
**Vercel Support:** https://vercel.com/support  
**GitHub Support:** https://support.github.com/  
**AWS Support:** https://aws.amazon.com/support/

---

## ✅ Deployment Complete!

Once deployed, you should have:
- ✅ All legal documents live and accessible
- ✅ HTTPS enabled with valid SSL
- ✅ Custom domain configured
- ✅ Mobile-responsive design
- ✅ Environment variables updated
- ✅ In-app links tested
- ✅ Store metadata updated

**Next Steps:**
1. Complete App Store Connect setup
2. Complete Google Play Console setup
3. Submit app for review
4. Monitor legal page uptime
5. Schedule quarterly legal review

---

**Congratulations! Your legal documents are ready for App Store submission! 🎉**
