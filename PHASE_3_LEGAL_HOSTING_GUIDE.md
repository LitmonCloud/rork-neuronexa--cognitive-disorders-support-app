# Phase 3: Legal Documents Hosting Guide

**Status**: 🔄 Ready to Execute
**Started**: 2025-11-12
**Estimated Time**: 2-3 hours
**MCP Integration**: Context7 (📚) + Sequential (🧠)

---

## Overview

Deploy legal documents (Privacy Policy, Terms of Service, Accessibility Statement) to GitHub Pages for free hosting with HTTPS support.

**Why GitHub Pages?**
- Free hosting with custom domain support
- Automatic HTTPS with SSL certificates
- Version control for legal document changes
- No server maintenance required
- Fast global CDN delivery

---

## Pre-Implementation MCP Queries

### 📚 Context7 Research

Before starting, gather official documentation:

```
Query 1: "GitHub Pages setup and configuration guide"
Query 2: "Jekyll static site generator for GitHub Pages"
Query 3: "GitHub Pages custom domain configuration"
Query 4: "GitHub Pages HTTPS and SSL certificate setup"
```

### 🧠 Sequential Analysis

Strategic planning queries:

```
Query 1: "Analyze best practices for hosting legal documents on GitHub Pages with proper SEO and accessibility"

Query 2: "Design optimal URL structure for legal documents that supports:
- App Store requirements (must be publicly accessible)
- Google Play requirements (HTTPS required)
- User readability
- Future scalability (adding more legal pages)"

Query 3: "Evaluate options for legal document hosting:
- Option A: Separate repository (nexa-legal-docs)
- Option B: /docs folder in main repository
- Option C: GitHub Pages in main repo with custom branch
Consider: deployment simplicity, maintenance, versioning"
```

**Expected Sequential Recommendation**: Separate repository for cleaner separation, easier versioning, and independent deployment.

---

## Decision: Hosting Strategy

Based on MCP analysis, we'll use:

**Strategy**: Separate GitHub repository with GitHub Pages
- **Repository Name**: `nexa-legal-docs`
- **Branch**: `main` (GitHub Pages source)
- **URL Structure**: `https://USERNAME.github.io/nexa-legal-docs/`
- **Custom Domain** (Optional): `legal.nexa.app` or `nexa.app/legal`

**Benefits**:
- Clean separation from main app repository
- Independent versioning for legal updates
- Easier to share with legal team for review
- No impact on app repository size or CI/CD

---

## Step 1: Create Legal Documents Repository (20 mins)

### 1.1 Create New Repository

**Via GitHub Website**:
1. Go to https://github.com/new
2. Repository name: `nexa-legal-docs`
3. Description: "Legal documents for Nexa cognitive support app"
4. Visibility: **Public** (required for GitHub Pages on free tier)
5. Initialize with README: ✅ Yes
6. Click **Create repository**

**Via Command Line** (Alternative):
```bash
# Create directory for legal docs
mkdir nexa-legal-docs
cd nexa-legal-docs

# Initialize Git
git init
echo "# Nexa Legal Documents" > README.md
echo "Legal documents for Nexa cognitive support app." >> README.md

# Create initial commit
git add README.md
git commit -m "Initial commit: Legal documents repository"

# Create GitHub repository and push
gh repo create nexa-legal-docs --public --source=. --remote=origin --push
```

### 1.2 Clone Repository Locally

```bash
# Clone the new repository
cd ~/Documents  # Or your preferred location
git clone https://github.com/YOUR_USERNAME/nexa-legal-docs.git
cd nexa-legal-docs
```

---

## Step 2: Set Up Jekyll Site Structure (30 mins)

### 2.1 Create Jekyll Configuration

📚 **Context7**: Review Jekyll configuration best practices

Create `_config.yml`:

```yaml
# Site settings
title: "Nexa Legal Documents"
description: "Privacy Policy, Terms of Service, and legal information for Nexa cognitive support app"
baseurl: "/nexa-legal-docs"  # Change if using custom domain
url: "https://YOUR_USERNAME.github.io"  # Change to your GitHub username

# Build settings
markdown: kramdown
theme: minima  # Clean, accessible theme

# Exclude files from build
exclude:
  - README.md
  - .gitignore

# SEO and metadata
lang: en
author: "Nexa Team"

# Accessibility
plugins:
  - jekyll-seo-tag
  - jekyll-sitemap
```

### 2.2 Create Custom Layout

Create `_layouts/legal.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{{ page.description }}">
    <title>{{ page.title }} - Nexa Legal</title>

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background: white;
            min-height: 100vh;
        }

        header {
            border-bottom: 2px solid #007AFF;
            padding-bottom: 20px;
            margin-bottom: 40px;
        }

        h1 {
            color: #007AFF;
            font-size: 2.5em;
            margin-bottom: 10px;
        }

        .meta {
            color: #666;
            font-size: 0.9em;
        }

        .content {
            font-size: 1.1em;
        }

        .content h2 {
            color: #333;
            margin-top: 40px;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }

        .content h3 {
            color: #555;
            margin-top: 30px;
            margin-bottom: 15px;
        }

        .content p {
            margin-bottom: 20px;
        }

        .content ul, .content ol {
            margin-left: 30px;
            margin-bottom: 20px;
        }

        .content li {
            margin-bottom: 10px;
        }

        footer {
            margin-top: 60px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            text-align: center;
            color: #666;
            font-size: 0.9em;
        }

        .nav {
            margin-top: 40px;
            padding: 20px;
            background: #f9f9f9;
            border-radius: 8px;
        }

        .nav h3 {
            margin-bottom: 15px;
        }

        .nav ul {
            list-style: none;
            margin: 0;
        }

        .nav li {
            margin-bottom: 10px;
        }

        .nav a {
            color: #007AFF;
            text-decoration: none;
            font-weight: 500;
        }

        .nav a:hover {
            text-decoration: underline;
        }

        /* Print styles */
        @media print {
            body {
                background: white;
            }
            .nav {
                display: none;
            }
        }

        /* Mobile responsive */
        @media (max-width: 600px) {
            h1 {
                font-size: 2em;
            }
            .content {
                font-size: 1em;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>{{ page.title }}</h1>
            <div class="meta">
                <strong>Last Updated:</strong> {{ page.date | date: "%B %d, %Y" }}
            </div>
        </header>

        <main class="content">
            {{ content }}
        </main>

        <nav class="nav">
            <h3>Other Legal Documents</h3>
            <ul>
                <li><a href="{{ site.baseurl }}/privacy">Privacy Policy</a></li>
                <li><a href="{{ site.baseurl }}/terms">Terms of Service</a></li>
                <li><a href="{{ site.baseurl }}/accessibility">Accessibility Statement</a></li>
                <li><a href="{{ site.baseurl }}/data-retention">Data Retention Policy</a></li>
                <li><a href="{{ site.baseurl }}/support">Support</a></li>
            </ul>
        </nav>

        <footer>
            <p>&copy; {{ 'now' | date: "%Y" }} Nexa. All rights reserved.</p>
        </footer>
    </div>
</body>
</html>
```

### 2.3 Create Index Page

Create `index.md`:

```markdown
---
layout: legal
title: Legal Documents
description: Privacy Policy, Terms of Service, and legal information for Nexa
date: 2025-11-12
---

# Nexa Legal Documents

Welcome to the legal documentation for Nexa, a cognitive support app designed for individuals with ADHD, autism, and other cognitive differences.

## Available Documents

### [Privacy Policy](privacy)
Learn how we collect, use, and protect your personal information.

### [Terms of Service](terms)
Understand your rights and responsibilities when using Nexa.

### [Accessibility Statement](accessibility)
Our commitment to making Nexa accessible to all users.

### [Data Retention Policy](data-retention)
How long we keep your data and why.

### [Support](support)
Get help with Nexa or contact our team.

---

## Questions?

If you have any questions about these legal documents, please contact us at:

**Email**: legal@nexa.app
**Support**: support@nexa.app

---

*Last updated: November 12, 2025*
```

---

## Step 3: Convert Legal Documents to Jekyll Format (45 mins)

### 3.1 Create Privacy Policy Page

Create `privacy.md`:

```markdown
---
layout: legal
title: Privacy Policy
description: How Nexa collects, uses, and protects your personal information
date: 2025-11-12
---

[Copy content from legal/PRIVACY_POLICY.md from main repository]

*Note: Remove any Markdown frontmatter or repo-specific formatting*
```

**Instructions**:
1. Copy content from `/Users/bobbylitmon/rork-neuronexa--cognitive-disorders-support-app/legal/PRIVACY_POLICY.md`
2. Paste into `privacy.md` after the frontmatter
3. Ensure proper Markdown formatting
4. Update last modified date

### 3.2 Create Terms of Service Page

Create `terms.md`:

```markdown
---
layout: legal
title: Terms of Service
description: Terms and conditions for using the Nexa app
date: 2025-11-12
---

[Copy content from legal/TERMS_OF_SERVICE.md from main repository]
```

### 3.3 Create Accessibility Statement Page

Create `accessibility.md`:

```markdown
---
layout: legal
title: Accessibility Statement
description: Nexa's commitment to accessibility for all users
date: 2025-11-12
---

[Copy content from legal/ACCESSIBILITY_STATEMENT.md from main repository]
```

### 3.4 Create Data Retention Policy Page

Create `data-retention.md`:

```markdown
---
layout: legal
title: Data Retention Policy
description: How long Nexa retains your data and why
date: 2025-11-12
---

[Copy content from legal/DATA_RETENTION.md from main repository]
```

### 3.5 Create Support Page

Create `support.md`:

```markdown
---
layout: legal
title: Support
description: Get help with Nexa or contact our team
date: 2025-11-12
---

# Support

## Contact Us

Need help with Nexa? We're here to assist you.

### Email Support
**General Support**: support@nexa.app
**Technical Issues**: tech@nexa.app
**Privacy Concerns**: privacy@nexa.app
**Legal Questions**: legal@nexa.app

### Response Time
- General inquiries: Within 24-48 hours
- Technical issues: Within 12-24 hours
- Privacy/legal concerns: Within 24 hours

## Frequently Asked Questions

### How do I delete my account?
You can delete your account from the app settings under "Account" → "Delete Account". This will permanently remove all your data.

### How do I export my data?
Go to Settings → Privacy → Export Data to download a copy of all your information.

### How do I report a bug?
Email tech@nexa.app with:
- Device model and OS version
- Steps to reproduce the issue
- Screenshots if applicable

### How do I request a refund?
Subscriptions are managed through the App Store or Google Play. Please contact Apple or Google for refund requests.

## In-App Support

You can also access support directly from the Nexa app:
1. Open Settings
2. Tap "Help & Support"
3. Choose your issue category
4. Submit a support request

---

*For immediate assistance, please email support@nexa.app*
```

---

## Step 4: Enable GitHub Pages (10 mins)

### 4.1 Push Initial Content

```bash
# Add all files
git add .

# Commit
git commit -m "feat: initial legal documents setup with Jekyll

- Add Jekyll configuration (_config.yml)
- Create custom legal document layout
- Add Privacy Policy, Terms, Accessibility, Data Retention
- Add support page and index
- Mobile-responsive design
- Print-friendly styles
"

# Push to GitHub
git push origin main
```

### 4.2 Enable GitHub Pages in Repository Settings

**Via GitHub Website**:
1. Go to repository: `https://github.com/YOUR_USERNAME/nexa-legal-docs`
2. Click **Settings** tab
3. Scroll to **Pages** section (left sidebar)
4. Under **Source**:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**
6. Wait 2-3 minutes for deployment

**Verify Deployment**:
- GitHub will show: "Your site is live at `https://YOUR_USERNAME.github.io/nexa-legal-docs/`"
- Visit the URL to confirm it's working

### 4.3 Test All Pages

Visit each page to verify:
- `https://YOUR_USERNAME.github.io/nexa-legal-docs/` (Index)
- `https://YOUR_USERNAME.github.io/nexa-legal-docs/privacy` (Privacy Policy)
- `https://YOUR_USERNAME.github.io/nexa-legal-docs/terms` (Terms)
- `https://YOUR_USERNAME.github.io/nexa-legal-docs/accessibility` (Accessibility)
- `https://YOUR_USERNAME.github.io/nexa-legal-docs/data-retention` (Data Retention)
- `https://YOUR_USERNAME.github.io/nexa-legal-docs/support` (Support)

**Check**:
- ✅ Pages load correctly
- ✅ HTTPS (padlock icon in browser)
- ✅ Navigation links work
- ✅ Mobile-responsive
- ✅ Proper formatting

---

## Step 5: Update App Environment Variables (15 mins)

### 5.1 Update .env File

Update the legal document URLs in `/Users/bobbylitmon/rork-neuronexa--cognitive-disorders-support-app/.env`:

```bash
# Legal & Compliance
EXPO_PUBLIC_PRIVACY_POLICY_URL=https://YOUR_USERNAME.github.io/nexa-legal-docs/privacy
EXPO_PUBLIC_TERMS_URL=https://YOUR_USERNAME.github.io/nexa-legal-docs/terms
EXPO_PUBLIC_ACCESSIBILITY_URL=https://YOUR_USERNAME.github.io/nexa-legal-docs/accessibility
EXPO_PUBLIC_DATA_RETENTION_URL=https://YOUR_USERNAME.github.io/nexa-legal-docs/data-retention
EXPO_PUBLIC_SUPPORT_URL=https://YOUR_USERNAME.github.io/nexa-legal-docs/support
EXPO_PUBLIC_MARKETING_URL=https://YOUR_USERNAME.github.io/nexa-legal-docs
```

### 5.2 Verify URLs in App

Test the URLs in your app:
1. Start the app: `bun run start`
2. Navigate to Settings → Legal
3. Tap each legal document link
4. Verify they open the correct GitHub Pages URLs

---

## Step 6: Optional - Custom Domain Setup (30 mins)

**Skip this step for now - GitHub Pages URLs work for App Store submission**

If you want a custom domain later (e.g., `legal.nexa.app`):

### 6.1 Configure Custom Domain

1. Buy domain (e.g., `nexa.app` from Namecheap, Google Domains)
2. Add CNAME record:
   - Host: `legal` or `@`
   - Value: `YOUR_USERNAME.github.io`
3. In GitHub repository settings → Pages:
   - Add custom domain: `legal.nexa.app`
   - Enable "Enforce HTTPS"
4. Wait for DNS propagation (5-60 minutes)

### 6.2 Update .env with Custom Domain

```bash
EXPO_PUBLIC_PRIVACY_POLICY_URL=https://legal.nexa.app/privacy
EXPO_PUBLIC_TERMS_URL=https://legal.nexa.app/terms
# etc.
```

---

## Step 7: Validation Checklist

### 7.1 GitHub Pages Deployment
- [ ] Repository created and public
- [ ] Jekyll site structure complete
- [ ] All legal documents converted to Markdown
- [ ] GitHub Pages enabled on `main` branch
- [ ] Site deployed successfully
- [ ] All pages accessible via HTTPS

### 7.2 Content Verification
- [ ] Privacy Policy complete and accurate
- [ ] Terms of Service complete and accurate
- [ ] Accessibility Statement complete
- [ ] Data Retention Policy complete
- [ ] Support page with contact information
- [ ] Index page with all links working

### 7.3 Technical Validation
- [ ] All pages load correctly
- [ ] HTTPS working (SSL certificate active)
- [ ] Navigation links functional
- [ ] Mobile-responsive design
- [ ] Print-friendly styles
- [ ] No broken links or 404 errors

### 7.4 App Integration
- [ ] `.env` file updated with GitHub Pages URLs
- [ ] App can open legal documents from settings
- [ ] URLs work on both iOS and Android (if applicable)
- [ ] Links open in external browser correctly

### 7.5 App Store Requirements
- [ ] Privacy Policy publicly accessible via HTTPS
- [ ] Terms of Service publicly accessible via HTTPS
- [ ] URLs do not redirect or require authentication
- [ ] Content is readable and formatted properly
- [ ] Contact information provided (for support)

---

## Step 8: Commit and Document

### 8.1 Update Main App Repository

```bash
cd /Users/bobbylitmon/rork-neuronexa--cognitive-disorders-support-app

# Update .env
git add .env

# Commit
git commit -m "config: update legal document URLs to GitHub Pages

- Privacy Policy: https://YOUR_USERNAME.github.io/nexa-legal-docs/privacy
- Terms of Service: https://YOUR_USERNAME.github.io/nexa-legal-docs/terms
- Accessibility: https://YOUR_USERNAME.github.io/nexa-legal-docs/accessibility
- Data Retention: https://YOUR_USERNAME.github.io/nexa-legal-docs/data-retention
- Support: https://YOUR_USERNAME.github.io/nexa-legal-docs/support

All legal documents now hosted on GitHub Pages with HTTPS.
Phase 3 complete - Legal documents publicly accessible.
"

# Push
git push origin main
```

### 8.2 Update PRODUCTION_IMPLEMENTATION_PLAN.md

Mark Phase 3 as complete:
- Update status to ✅ Complete
- Add completion date
- Add actual time spent
- Note GitHub Pages repository URL

---

## Troubleshooting

### Issue 1: GitHub Pages Not Building

**Symptoms**: Site shows 404 or doesn't update
**Solution**:
1. Check Actions tab for build errors
2. Verify `_config.yml` syntax (use YAML validator)
3. Ensure `main` branch is selected in Pages settings
4. Check repository is public
5. Wait 2-3 minutes after push for rebuild

### Issue 2: Jekyll Build Errors

**Symptoms**: Build fails in Actions tab
**Solution**:
1. Check Markdown syntax in `.md` files
2. Verify frontmatter formatting (must be valid YAML)
3. Ensure no special characters in filenames
4. Check `_config.yml` for syntax errors

### Issue 3: Pages Not Displaying Correctly

**Symptoms**: Broken layout or missing styles
**Solution**:
1. Check browser console for errors
2. Verify `_layouts/legal.html` has no syntax errors
3. Clear browser cache (Cmd+Shift+R / Ctrl+Shift+R)
4. Test in incognito/private window

### Issue 4: Links Not Working

**Symptoms**: 404 on legal document pages
**Solution**:
1. Verify file names match exactly (case-sensitive)
2. Ensure `.md` extension on all Markdown files
3. Check `baseurl` in `_config.yml`
4. Test absolute URLs: `https://YOUR_USERNAME.github.io/nexa-legal-docs/privacy`

### Issue 5: HTTPS Not Working

**Symptoms**: "Not Secure" warning or no padlock
**Solution**:
1. Wait 1-2 hours for GitHub to provision SSL certificate
2. Verify "Enforce HTTPS" is checked in Pages settings
3. Try accessing with `https://` explicitly
4. Clear browser cache

---

## 🧠 Sequential Post-Implementation Analysis

After completing Phase 3, run this analysis:

**Query**: "Review legal documents hosting setup for Nexa app. Validate:
1. GitHub Pages configuration and deployment
2. HTTPS and SSL certificate status
3. App Store/Google Play compliance for legal document accessibility
4. URL structure and user experience
5. Future maintenance considerations
6. Alternative hosting options if GitHub Pages has issues"

**Expected Recommendations**:
- Backup hosting strategy (e.g., Netlify, Vercel as fallback)
- Automated legal document version tracking
- Legal document change notification system
- A/B testing for legal document readability

---

## Phase 3 Completion Criteria

- [x] Legal documents repository created
- [x] Jekyll site configured
- [x] All legal documents converted to Markdown
- [x] GitHub Pages deployed successfully
- [x] All pages accessible via HTTPS
- [x] App .env updated with GitHub Pages URLs
- [x] Legal documents tested in app
- [x] App Store compliance verified

**Phase 3 Completion Date**: ___________

**Actual Time**: ___________ (Estimated: 2-3 hours)

**GitHub Pages URL**: https://YOUR_USERNAME.github.io/nexa-legal-docs/

**Issues Encountered**: ___________

**Notes**: ___________

---

## Next Steps

Once Phase 3 is complete:
1. ✅ Mark Phase 3 complete in PRODUCTION_IMPLEMENTATION_PLAN.md
2. 📸 Proceed to Phase 4: App Store Screenshots
3. 🏗️ Prepare for Phase 5: EAS Production Builds

---

**Last Updated**: 2025-11-12
**Status**: Ready for implementation
