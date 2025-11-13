# Changelog

All notable changes to Nexa will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2025-10-02

### 🎉 Initial Release

**Nexa is now available on the App Store and Google Play!**

### Added

#### Core Features
- **Nexa AI Coach:** Personalized cognitive support coach that learns your habits, preferences, and communication style
- **Smart Task Management:** Create, organize, and complete tasks with AI-powered breakdowns
- **AI Task Breakdowns:** Get step-by-step guidance tailored to your cognitive level (simple, moderate, complex)
- **Breathing Exercises:** Three guided patterns (Box 4-4-4-4, 4-7-8, Finger Trace) with visual pacing and haptic feedback
- **Progress Tracking:** View completion stats, streaks, and analytics
- **Caregiver Support:** Add caregivers, manage contacts, and send test alerts

#### Nexa AI Capabilities
- Personalized task creation and breakdown
- Motivational messages and affirmations
- Check-ins based on time of day and recent activity
- Learning system that adapts to user preferences
- Context-aware responses based on user profile
- Tool integration (create tasks, list tasks, complete tasks, provide encouragement)

#### Accessibility Features
- **High Contrast Mode:** Enhanced visibility for low vision users
- **Large Text:** 1.2× text scaling throughout the app
- **Reduced Motion:** Disable animations for motion sensitivity
- **Voice Guidance:** Text-to-speech for task steps (mobile only)
- **Cognitive Support Mode:** Simplified language and extra context
- **Step-by-Step Coach:** Break tasks into micro-steps
- **Auto-Read Steps:** Automatic voice guidance for each step
- **Visual Cues:** Icons and color coding for better comprehension
- **Simplified Language:** Plain language mode for all content

#### Mental Health Resources
- Crisis hotlines (988, Crisis Text Line)
- Support communities (NAMI, MHA, CHADD, Autism Society)
- Educational resources (NIMH, CDC, WHO)
- Accessibility information (ADA, W3C)

#### Premium Features
- **7-Day Free Trial:** Full access to premium features
- **Subscription Tiers:** Monthly ($9.99), Yearly ($59.99), Lifetime ($149.99)
- **Usage Tracking:** Monitor daily and total task limits
- **Premium Badge:** Visual indicator of premium status

#### User Experience
- **Onboarding Flow:** 4-slide introduction with skip option
- **Paywall:** Beautiful premium upgrade screen
- **Notifications:** Badge system for caregiver and app updates
- **Themes:** Light and dark mode support
- **Responsive Design:** Optimized for phones and tablets

#### Developer Features
- **TypeScript:** Strict type checking throughout
- **Expo Router:** File-based navigation
- **Context Providers:** State management with @nkzw/create-context-hook
- **React Query:** Server state management
- **AsyncStorage:** Local data persistence
- **Error Boundary:** Graceful error handling
- **Comprehensive Documentation:** Implementation guides, API docs, and quick reference

### Technical Stack
- React Native 0.79
- Expo SDK 53
- TypeScript 5.8
- Expo Router 5.0
- Rork Toolkit SDK (AI)
- Lucide React Native (icons)
- React Query (data fetching)
- AsyncStorage (persistence)

### Known Limitations
- Cloud sync not yet available (coming in v1.1)
- Push notifications require custom dev build
- Caregiver alerts are UI-only (backend coming in v1.1)
- Analytics and crash reporting not yet integrated
- No HealthKit integration (planned for v1.2)

---

## [Unreleased]

### Planned for v1.1.0 (Q4 2025)

#### Backend Integration
- [ ] Supabase authentication and database
- [ ] Cloud sync for tasks across devices
- [ ] Real-time caregiver alerts via email
- [ ] Push notifications for reminders
- [ ] User profiles and preferences sync

#### Analytics & Monitoring
- [ ] PostHog analytics integration
- [ ] Sentry crash reporting
- [ ] Usage insights and trends
- [ ] A/B testing framework

#### Enhanced Features
- [ ] Task templates and recurring tasks
- [ ] Custom breathing patterns
- [ ] Habit tracking
- [ ] Mood logging
- [ ] Journal entries

### Planned for v1.2.0 (Q1 2026)

#### HealthKit Integration
- [ ] Heart rate monitoring during breathing
- [ ] HRV (Heart Rate Variability) tracking
- [ ] Stress detection
- [ ] Sleep data integration
- [ ] Activity correlation

#### Advanced AI
- [ ] Voice input (speech-to-text)
- [ ] Image recognition for task context
- [ ] Predictive task suggestions
- [ ] Adaptive difficulty based on performance
- [ ] Multi-language support

### Planned for v1.3.0 (Q2 2026)

#### Gamification
- [ ] Achievements and badges
- [ ] Streak rewards and milestones
- [ ] Progress celebrations
- [ ] Social sharing (opt-in)
- [ ] Leaderboards (anonymous)

#### Caregiver Dashboard
- [ ] Web-based caregiver portal
- [ ] Real-time progress monitoring
- [ ] Alert configuration
- [ ] Communication tools
- [ ] Report generation

---

## Version History

| Version | Release Date | Status |
|---------|--------------|--------|
| 1.0.0   | 2025-10-02   | ✅ Released |
| 1.1.0   | TBD          | 🚧 In Development |
| 1.2.0   | TBD          | 📋 Planned |
| 1.3.0   | TBD          | 📋 Planned |

---

## Migration Guides

### Upgrading to v1.0.0

This is the initial release. No migration needed.

### Future: Upgrading to v1.1.0

When v1.1.0 is released:
1. Your local data will be preserved
2. You'll be prompted to create an account for cloud sync (optional)
3. Caregiver contacts will be migrated to the new backend
4. Analytics will be opt-in (disabled by default)

---

## Support

For questions, bug reports, or feature requests:
- **Email:** support@nexa.app
- **Website:** https://nexa.app
- **GitHub:** [Coming Soon]

---

**Thank you for using Nexa!**

*Simplify. Scaffold. Support independence.*
