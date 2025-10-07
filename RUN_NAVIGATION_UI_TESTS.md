# Running Navigation and UI Tests

## Quick Start

```bash
# Make script executable
chmod +x scripts/run-navigation-ui-tests.sh

# Run all navigation and UI tests
./scripts/run-navigation-ui-tests.sh
```

## Individual Test Suites

### Navigation Tests
```bash
# All navigation tests
bun test __tests__/navigation/

# Routing tests only
bun test __tests__/navigation/routing.test.tsx

# Deep linking tests only
bun test __tests__/navigation/deepLinking.test.tsx
```

### UI Tests
```bash
# All UI tests
bun test __tests__/ui/

# Component tests
bun test __tests__/ui/components.test.tsx

# Accessibility tests
bun test __tests__/ui/accessibility.test.tsx

# Responsive design tests
bun test __tests__/ui/responsive.test.tsx

# Theming tests
bun test __tests__/ui/theming.test.tsx
```

## Test Coverage

### Navigation (2 test files, 15+ tests)
- ✅ Route protection and guards
- ✅ Terms agreement flow
- ✅ Onboarding flow
- ✅ Caregiver/patient role-based routing
- ✅ Subscription paywall
- ✅ Deep linking (URL schemes)
- ✅ Universal links
- ✅ External links (phone, email, web)

### UI Components (5 test files, 40+ tests)
- ✅ Button variants and states
- ✅ Card component
- ✅ ConfirmDialog component
- ✅ Accessibility compliance
- ✅ Responsive design
- ✅ Theme support

## Error Boundary Fix

The ErrorBoundary now properly logs errors with:
- Error message
- Error stack trace
- Component stack trace

This fixes the `[object Object]` logging issue.

## What Was Fixed

1. **ErrorBoundary Logging**: Enhanced error logging to show detailed error information
2. **Navigation Tests**: Comprehensive routing and deep linking tests
3. **UI Component Tests**: Tests for Button, Card, and ConfirmDialog
4. **Accessibility Tests**: WCAG 2.1 AA compliance tests
5. **Responsive Tests**: Multi-device and orientation support
6. **Theming Tests**: Light/dark theme and system theme detection

## Next Steps

Run the tests to verify everything works:
```bash
./scripts/run-navigation-ui-tests.sh
```

All tests should pass and provide confidence in the navigation and UI functionality.
