# Data Retention Policy for Nexa

**Effective Date:** October 2, 2025  
**Last Updated:** October 2, 2025

---

## Introduction

This Data Retention Policy explains how long Nexa retains your personal information and data, and how we securely delete it when no longer needed.

**This policy applies to all users of Nexa, regardless of location.**

---

## 1. Data Retention Principles

We follow these principles when retaining your data:

**Minimization:** We only retain data as long as necessary for legitimate purposes.

**Purpose Limitation:** Data is retained only for the purposes for which it was collected.

**Storage Limitation:** Data is deleted or anonymized when no longer needed.

**Security:** Retained data is protected with appropriate security measures.

**Transparency:** We clearly communicate our retention practices.

---

## 2. Local Data Retention

### 2.1 Task Data

**What:** Tasks, notes, steps, priorities, completion status

**Retention Period:** Indefinitely, until you delete the app or manually delete tasks

**Storage Location:** Your device only (encrypted by iOS/Android)

**Deletion:** 
- Manual: Delete individual tasks or all tasks in Settings
- Automatic: Deleted when you uninstall the app

### 2.2 User Preferences

**What:** Accessibility settings, communication style, theme preferences

**Retention Period:** Indefinitely, until you delete the app

**Storage Location:** Your device only

**Deletion:** Deleted when you uninstall the app

### 2.3 Caregiver Contacts

**What:** Caregiver names, phone numbers, email addresses

**Retention Period:** Indefinitely, until you delete the app or remove caregivers

**Storage Location:** Your device only

**Deletion:**
- Manual: Remove individual caregivers in Settings
- Automatic: Deleted when you uninstall the app

### 2.4 Wellness Session Data

**What:** Breathing exercise history, session duration, completion status

**Retention Period:** 90 days (automatically deleted after 90 days)

**Storage Location:** Your device only

**Deletion:**
- Automatic: Deleted after 90 days
- Manual: Clear history in Settings

---

## 3. Cloud Data Retention (Future Feature)

When cloud sync is enabled:

### 3.1 Synced Task Data

**What:** Tasks, notes, steps synced across devices

**Retention Period:** Until you delete your account or request deletion

**Storage Location:** Supabase (encrypted at rest)

**Deletion:**
- Manual: Delete account in Settings
- Request: Email privacy@nexa.app
- Processing Time: Within 30 days

### 3.2 User Profile

**What:** Display name, preferences, account information

**Retention Period:** Until you delete your account

**Storage Location:** Supabase (encrypted at rest)

**Deletion:** Deleted within 30 days of account deletion request

### 3.3 Backup Data

**What:** Encrypted backups of your synced data

**Retention Period:** 30 days after account deletion

**Storage Location:** Supabase backup systems

**Deletion:** Permanently deleted after 30 days

---

## 4. Analytics Data Retention

### 4.1 Usage Analytics (PostHog)

**What:** Feature usage, screen views, session duration (when analytics enabled)

**Retention Period:** 90 days

**Storage Location:** PostHog servers (anonymized)

**Deletion:**
- Automatic: Anonymized after 90 days
- Manual: Opt-out in Settings stops new data collection
- Request: Email privacy@nexa.app for deletion

**Note:** Analytics is opt-in and can be disabled at any time.

### 4.2 Crash Reports (Sentry)

**What:** Error logs, stack traces, device information

**Retention Period:** 90 days

**Storage Location:** Sentry servers

**Deletion:** Automatically deleted after 90 days

**Note:** Crash reports do not contain personal information.

---

## 5. Communication Data Retention

### 5.1 Support Emails

**What:** Support requests, correspondence with our team

**Retention Period:** 2 years from last contact

**Storage Location:** Email servers (encrypted)

**Deletion:** Automatically deleted after 2 years

**Request Deletion:** Email privacy@nexa.app

### 5.2 Caregiver Alert Emails

**What:** Email alerts sent to caregivers

**Retention Period:** 30 days

**Storage Location:** Email service provider (Resend/SendGrid)

**Deletion:** Automatically deleted after 30 days

---

## 6. Payment Data Retention

### 6.1 Subscription Information

**What:** Subscription status, purchase history

**Retention Period:** 7 years (for tax and legal compliance)

**Storage Location:** Apple/Google servers (we do not store payment details)

**Deletion:** Managed by Apple/Google according to their policies

**Note:** We do not have access to your payment card information.

### 6.2 RevenueCat Data

**What:** Subscription entitlements, purchase events

**Retention Period:** Until you delete your account + 90 days

**Storage Location:** RevenueCat servers

**Deletion:** Request deletion via privacy@nexa.app

---

## 7. Legal and Compliance Retention

### 7.1 Legal Holds

If your data is subject to a legal hold (e.g., litigation, investigation), we will retain it until the hold is lifted, regardless of the retention periods stated above.

### 7.2 Regulatory Compliance

We may retain certain data longer if required by law, including:
- Tax records: 7 years
- Financial records: 7 years
- Legal compliance records: As required by law

---

## 8. Data Deletion Procedures

### 8.1 Soft Deletion

When you delete data in the app:
1. Data is marked as deleted
2. Removed from active storage
3. Excluded from backups
4. Permanently deleted within 30 days

### 8.2 Hard Deletion

When you request account deletion:
1. All personal data is identified
2. Data is permanently deleted from active systems
3. Backups are purged within 30 days
4. Third-party processors are notified
5. Confirmation email sent

### 8.3 Anonymization

Some data may be anonymized instead of deleted:
- Aggregated usage statistics
- Non-identifiable analytics
- Research data (with consent)

**Anonymized data cannot be linked back to you.**

---

## 9. Data Retention by Category

| Data Type | Retention Period | Storage Location | Deletion Method |
|-----------|------------------|------------------|-----------------|
| Tasks (local) | Until app deletion | Device | Manual/Uninstall |
| Tasks (cloud) | Until account deletion | Supabase | Account deletion |
| User preferences | Until app deletion | Device | Uninstall |
| Caregiver contacts | Until removal | Device | Manual/Uninstall |
| Wellness sessions | 90 days | Device | Automatic |
| Analytics events | 90 days | PostHog | Automatic |
| Crash reports | 90 days | Sentry | Automatic |
| Support emails | 2 years | Email servers | Automatic |
| Caregiver alerts | 30 days | Email provider | Automatic |
| Subscription data | 7 years | Apple/Google | Platform policy |
| Backups | 30 days after deletion | Supabase | Automatic |

---

## 10. Your Rights

You have the right to:

**Access:** Request a copy of all data we have about you

**Rectification:** Correct inaccurate or incomplete data

**Erasure:** Request deletion of your data (right to be forgotten)

**Restriction:** Limit how we process your data

**Portability:** Receive your data in a portable format

**Objection:** Object to certain types of processing

**Withdraw Consent:** Opt-out of optional data collection

---

## 11. How to Request Data Deletion

### 11.1 In-App Deletion

1. Open Nexa
2. Go to Settings → Privacy
3. Tap "Delete My Data" (local data)
4. Tap "Delete Account" (cloud data, when available)

### 11.2 Email Request

Send an email to **privacy@nexa.app** with:
- Subject: "Data Deletion Request"
- Your account email (if applicable)
- Specific data you want deleted

**Response Time:** We will respond within 30 days.

---

## 12. Data Breach Notification

If a data breach occurs that affects your personal information:

**Notification Timeline:** Within 72 hours of discovery

**Notification Method:** Email and in-app notification

**Information Provided:**
- Nature of the breach
- Data affected
- Steps we are taking
- Steps you should take
- Contact information for questions

---

## 13. Children's Data

We do not knowingly collect data from children under 13. If we discover we have collected such data, we will delete it immediately.

**Retention Period for Children's Data:** 0 days (immediate deletion upon discovery)

---

## 14. Changes to This Policy

We may update this Data Retention Policy from time to time. Changes will be communicated via:
- In-app notification
- Email (if you have an account)
- Updated "Last Updated" date

**Your continued use of Nexa after changes constitutes acceptance.**

---

## 15. Contact Us

If you have questions about our data retention practices:

**Email:** privacy@nexa.app  
**Website:** https://nexa.app/legal/data-retention  
**Mail:** Nexa Privacy Team, [Address TBD]

---

## 16. Regulatory Compliance

This Data Retention Policy complies with:
- **GDPR** (General Data Protection Regulation)
- **CCPA** (California Consumer Privacy Act)
- **COPPA** (Children's Online Privacy Protection Act)
- **HIPAA** (Health Insurance Portability and Accountability Act) principles
- **SOC 2** security standards

---

**Thank you for trusting Nexa with your data. We take your privacy seriously.**

*Simplify. Scaffold. Support independence.*
