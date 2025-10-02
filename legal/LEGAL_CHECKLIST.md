# NeuroNexa Legal Compliance Checklist

**Last Updated:** October 2, 2025

This checklist ensures NeuroNexa meets all legal and compliance requirements for App Store and Google Play submission.

---

## ✅ Legal Documents Status

### Core Documents
- [x] **Privacy Policy** - Complete and comprehensive
  - Location: `legal/PRIVACY_POLICY.md`
  - Covers: Data collection, usage, storage, sharing, user rights
  - Compliant with: GDPR, CCPA, COPPA
  
- [x] **Terms of Service** - Complete and comprehensive
  - Location: `legal/TERMS_OF_SERVICE.md`
  - Covers: User agreements, acceptable use, liability, subscriptions
  - Includes: Medical disclaimer, dispute resolution
  
- [x] **Accessibility Statement** - Complete and comprehensive
  - Location: `legal/ACCESSIBILITY_STATEMENT.md`
  - Covers: WCAG 2.1 compliance, assistive technology support
  - Includes: Known limitations, feedback process
  
- [x] **Data Retention Policy** - Complete and comprehensive
  - Location: `legal/DATA_RETENTION.md`
  - Covers: Retention periods, deletion procedures, user rights
  - Includes: Backup policies, legal holds

### Web Versions
- [x] **Legal Landing Page** - HTML version created
  - Location: `legal/index.html`
  - Provides: Easy navigation to all legal documents
  - Design: Accessible, mobile-friendly

---

## 📋 Compliance Requirements

### GDPR (General Data Protection Regulation)
- [x] Privacy Policy includes GDPR-specific rights
- [x] Legal basis for processing documented
- [x] Data retention periods specified
- [x] User rights clearly explained (access, rectification, erasure, portability)
- [x] Data processor information disclosed
- [x] Contact information for data protection inquiries
- [ ] **TODO:** Appoint Data Protection Officer (if required)
- [ ] **TODO:** Implement data export functionality
- [ ] **TODO:** Implement data deletion functionality

### CCPA (California Consumer Privacy Act)
- [x] Privacy Policy includes CCPA-specific rights
- [x] "Do Not Sell" disclosure (we don't sell data)
- [x] Categories of personal information disclosed
- [x] Right to deletion explained
- [x] Non-discrimination policy stated
- [ ] **TODO:** Implement "Do Not Sell My Personal Information" link (if applicable)

### COPPA (Children's Online Privacy Protection Act)
- [x] Age restriction stated (13+)
- [x] Parental consent guidance for 13-17
- [x] No knowingly collecting data from children under 13
- [x] Immediate deletion policy for children's data
- [x] Age-appropriate content rating (4+)

### HIPAA Awareness
- [x] Medical disclaimer prominently displayed
- [x] Not claiming to be a medical device
- [x] Not collecting protected health information (PHI)
- [x] Secure data storage practices documented
- [x] No diagnosis or treatment claims
- [ ] **TODO:** Consider HIPAA compliance if adding health data features

### ADA (Americans with Disabilities Act)
- [x] Accessibility Statement published
- [x] WCAG 2.1 Level AA compliance targeted
- [x] Assistive technology compatibility documented
- [x] Accessibility feedback mechanism provided
- [x] Known limitations disclosed
- [x] Roadmap for improvements included

---

## 🏪 App Store Requirements

### Apple App Store Connect
- [x] Privacy Policy URL ready
- [x] Terms of Service URL ready
- [x] Support URL ready
- [x] Marketing URL ready
- [ ] **TODO:** Upload URLs to App Store Connect
- [ ] **TODO:** Complete App Privacy questionnaire
- [ ] **TODO:** Verify age rating (4+)
- [ ] **TODO:** Add medical disclaimer to app description

### Google Play Console
- [x] Privacy Policy URL ready
- [x] Terms of Service URL ready
- [x] Support URL ready
- [ ] **TODO:** Upload URLs to Google Play Console
- [ ] **TODO:** Complete Data Safety section
- [ ] **TODO:** Verify content rating (Everyone)
- [ ] **TODO:** Add medical disclaimer to app description

---

## 🔗 URL Configuration

### Environment Variables
- [x] `EXPO_PUBLIC_PRIVACY_POLICY_URL` defined in .env.example
- [x] `EXPO_PUBLIC_TERMS_URL` defined in .env.example
- [x] `EXPO_PUBLIC_ACCESSIBILITY_URL` defined in .env.example
- [x] `EXPO_PUBLIC_DATA_RETENTION_URL` defined in .env.example
- [x] `EXPO_PUBLIC_SUPPORT_URL` defined in .env.example
- [x] `EXPO_PUBLIC_MARKETING_URL` defined in .env.example

### In-App Links
- [x] Settings screen links to Privacy Policy
- [x] Settings screen links to Terms of Service
- [x] Settings screen links to Accessibility Statement
- [x] Settings screen links to Data Retention Policy
- [x] Settings screen links to Support
- [ ] **TODO:** Add legal links to onboarding flow
- [ ] **TODO:** Add legal links to paywall screen
- [ ] **TODO:** Test all links on iOS and Android

### Store Metadata
- [x] iOS metadata includes all legal URLs
- [x] Android metadata includes all legal URLs
- [ ] **TODO:** Verify URLs are accessible and working

---

## 📝 Content Requirements

### Medical Disclaimer
- [x] Included in Privacy Policy
- [x] Included in Terms of Service
- [x] Displayed in Settings screen
- [ ] **TODO:** Add to onboarding flow
- [ ] **TODO:** Add to app store descriptions
- [ ] **TODO:** Add to marketing website

### Contact Information
- [x] Privacy email: privacy@neuronexa.app
- [x] Legal email: legal@neuronexa.app
- [x] Support email: support@neuronexa.app
- [x] Accessibility email: accessibility@neuronexa.app
- [ ] **TODO:** Set up email addresses
- [ ] **TODO:** Configure email forwarding
- [ ] **TODO:** Add physical address (if required)

### Version Control
- [x] Effective dates on all documents
- [x] Last updated dates on all documents
- [ ] **TODO:** Implement version history tracking
- [ ] **TODO:** Set up notification system for policy changes
- [ ] **TODO:** Create process for user notification of changes

---

## 🔒 Security & Privacy

### Data Protection
- [x] Encryption in transit (TLS 1.3) documented
- [x] Encryption at rest (AES-256) documented
- [x] Local-first storage approach documented
- [x] Optional cloud sync documented
- [x] No data selling policy stated
- [ ] **TODO:** Implement encryption for sensitive data
- [ ] **TODO:** Set up secure backup procedures
- [ ] **TODO:** Conduct security audit

### User Rights
- [x] Right to access data explained
- [x] Right to delete data explained
- [x] Right to export data explained
- [x] Right to opt-out explained
- [ ] **TODO:** Implement data access request process
- [ ] **TODO:** Implement data deletion process
- [ ] **TODO:** Implement data export functionality
- [ ] **TODO:** Create user rights request form

### Analytics & Tracking
- [x] Analytics opt-in/opt-out documented
- [x] No PII in analytics policy stated
- [x] Analytics provider disclosed (PostHog)
- [x] Crash reporting provider disclosed (Sentry)
- [ ] **TODO:** Implement analytics opt-out functionality
- [ ] **TODO:** Verify no PII in analytics events
- [ ] **TODO:** Test opt-out functionality

---

## 🌐 Hosting & Deployment

### Legal Documents Hosting
- [ ] **TODO:** Choose hosting platform (Netlify, Vercel, GitHub Pages)
- [ ] **TODO:** Deploy legal documents to production
- [ ] **TODO:** Configure custom domain (neuronexa.app)
- [ ] **TODO:** Set up SSL certificate
- [ ] **TODO:** Test all URLs are accessible
- [ ] **TODO:** Set up monitoring for uptime

### Recommended Hosting Options

**Option 1: Netlify (Recommended)**
```bash
cd legal
netlify deploy --prod
```
- Free tier available
- Automatic SSL
- Easy custom domain setup
- Built-in analytics

**Option 2: Vercel**
```bash
cd legal
vercel --prod
```
- Free tier available
- Automatic SSL
- Fast global CDN
- Easy deployment

**Option 3: GitHub Pages**
- Free hosting
- Automatic SSL with custom domain
- Version control built-in
- Simple setup

---

## ⚖️ Legal Review

### Professional Review
- [ ] **TODO:** Hire privacy attorney for GDPR/CCPA review
- [ ] **TODO:** Hire healthcare attorney for medical disclaimer review
- [ ] **TODO:** Hire accessibility attorney for ADA compliance review
- [ ] **TODO:** Hire general counsel for terms and liability review

### Estimated Costs
- Privacy attorney: $1,500 - $3,000
- Healthcare attorney: $1,000 - $2,000
- Accessibility attorney: $1,000 - $2,000
- General counsel: $1,500 - $3,000
- **Total:** $5,000 - $10,000

### Alternative: Legal Templates
- Use LegalZoom or Rocket Lawyer templates
- Customize for NeuroNexa specifics
- Have reviewed by attorney (lower cost)
- **Cost:** $500 - $1,500

---

## 📅 Maintenance Schedule

### Quarterly Review (Every 3 months)
- [ ] Review all legal documents for accuracy
- [ ] Check for regulatory changes
- [ ] Update contact information if needed
- [ ] Verify all links are working
- [ ] Review user feedback on legal docs

### Annual Review (Every 12 months)
- [ ] Full legal review by attorney
- [ ] Update effective dates
- [ ] Notify users of material changes
- [ ] Review and update accessibility statement
- [ ] Audit data retention practices

### As-Needed Updates
- [ ] When adding new features
- [ ] When changing data practices
- [ ] When adding new third-party services
- [ ] When expanding to new jurisdictions
- [ ] When regulations change

---

## 🚨 Pre-Submission Checklist

### Before App Store Submission
- [ ] All legal documents published and accessible
- [ ] URLs tested on iOS and Android
- [ ] URLs added to App Store Connect
- [ ] Privacy questionnaire completed
- [ ] Medical disclaimer in app description
- [ ] Age rating verified (4+)
- [ ] In-app legal links tested
- [ ] Legal review completed (recommended)

### Before Google Play Submission
- [ ] All legal documents published and accessible
- [ ] URLs tested on iOS and Android
- [ ] URLs added to Google Play Console
- [ ] Data Safety section completed
- [ ] Medical disclaimer in app description
- [ ] Content rating verified (Everyone)
- [ ] In-app legal links tested
- [ ] Legal review completed (recommended)

---

## 📞 Support & Resources

### Legal Resources
- **GDPR:** https://gdpr-info.eu/
- **CCPA:** https://oag.ca.gov/privacy/ccpa
- **COPPA:** https://www.ftc.gov/enforcement/rules/rulemaking-regulatory-reform-proceedings/childrens-online-privacy-protection-rule
- **WCAG:** https://www.w3.org/WAI/WCAG21/quickref/
- **ADA:** https://www.ada.gov/

### App Store Guidelines
- **Apple:** https://developer.apple.com/app-store/review/guidelines/
- **Google:** https://play.google.com/about/developer-content-policy/

### Legal Services
- **LegalZoom:** https://www.legalzoom.com/
- **Rocket Lawyer:** https://www.rocketlawyer.com/
- **TermsFeed:** https://www.termsfeed.com/
- **Iubenda:** https://www.iubenda.com/

---

## ✅ Final Sign-Off

### Legal Team Approval
- [ ] Privacy Policy approved
- [ ] Terms of Service approved
- [ ] Accessibility Statement approved
- [ ] Data Retention Policy approved
- [ ] All URLs verified
- [ ] Compliance requirements met

### Development Team Approval
- [ ] All legal links implemented
- [ ] Environment variables configured
- [ ] In-app disclaimers added
- [ ] Analytics opt-out implemented
- [ ] Data deletion implemented

### Ready for Submission
- [ ] All checklist items completed
- [ ] Legal review completed
- [ ] URLs live and accessible
- [ ] Store metadata updated
- [ ] Team sign-off obtained

---

**Status:** 🟡 In Progress  
**Target Completion:** Before App Store Submission  
**Last Review:** October 2, 2025  
**Next Review:** January 2, 2026

---

*This checklist should be reviewed and updated regularly to ensure ongoing compliance.*
