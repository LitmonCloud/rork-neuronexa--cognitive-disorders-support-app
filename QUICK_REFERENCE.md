# Nexa - Quick Reference Card

## 🚀 Getting Started (30 seconds)

```bash
bun install          # Install dependencies
bun run start        # Start dev server
bun run start-web    # Start web preview
```

Scan QR code with Expo Go ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

---

## 📁 Key Files (Top 10)

| File | Purpose |
|------|---------|
| `app/(tabs)/index.tsx` | Tasks screen (home) |
| `app/task/[id].tsx` | Task detail with steps |
| `contexts/TaskContext.tsx` | Task state management |
| `services/ai/AIService.ts` | AI integration |
| `app/(tabs)/settings.tsx` | Accessibility settings |
| `app/onboarding.tsx` | Onboarding flow |
| `contexts/SubscriptionContext.tsx` | Premium features |
| `components/AITaskCoach.tsx` | Step-by-step coach |
| `constants/colors.ts` | Color palette |
| `.env.example` | Environment config |

---

## 🎯 Core Features (Quick Access)

### **Tasks**
```typescript
// Add task
const task = await addTask(title, description, priority);

// Break down with AI
await breakdownTask(task.id);

// Update step
updateStep(taskId, stepId, completed);

// Complete task
completeTask(taskId);
```

### **AI Integration**
```typescript
import { generateText } from '@rork-ai/toolkit-sdk';

const response = await generateText(prompt);
```

### **Accessibility**
```typescript
const { settings, toggleSetting } = useAccessibility();

toggleSetting('largeText');      // 1.2x text scaling
toggleSetting('highContrast');   // Border emphasis
toggleSetting('reducedMotion');  // Minimize animations
toggleSetting('voiceGuidance');  // Text-to-speech
```

### **Premium**
```typescript
const { isPremium, canCreateTask, upgradeToPremium } = useSubscription();

if (!canCreateTask()) {
  router.push('/paywall');
}
```

---

## 🎨 Design Tokens

### **Colors**
```typescript
colors.primary       // #6366F1 (Indigo)
colors.secondary     // #8B5CF6 (Purple)
colors.success       // #10B981 (Green)
colors.error         // #EF4444 (Red)
colors.warning       // #F59E0B (Amber)
colors.text          // #1F2937 (Dark Gray)
colors.background    // #F9FAFB (Light Gray)
```

### **Spacing**
```typescript
spacing.xs    // 4px
spacing.sm    // 8px
spacing.md    // 12px
spacing.lg    // 16px
spacing.xl    // 20px
spacing.xxl   // 24px
spacing.xxxl  // 32px
```

### **Typography**
```typescript
fontSizes.xs     // 11px
fontSizes.sm     // 13px
fontSizes.md     // 15px
fontSizes.lg     // 17px
fontSizes.xl     // 20px
fontSizes.xxl    // 24px
fontSizes.huge   // 48px

fontWeights.regular   // '400'
fontWeights.medium    // '500'
fontWeights.semibold  // '600'
fontWeights.bold      // '700'
```

---

## 🧠 AI Prompt Template

```typescript
const prompt = `You are helping someone with cognitive disabilities complete a task.

COGNITIVE LEVEL: ${level} // 'simple' | 'moderate' | 'complex'

TASK: ${title}
DETAILS: ${description}

For each step provide:
STEP: [Clear action]
SIMPLE: [Simpler version]
CONTEXT: [Why it matters]
TIME: [X minutes]
---

SUPPORT: [Encouraging message]
ADAPT: [Helpful adaptation]
`;

const response = await generateText(prompt);
```

---

## 📱 Navigation

### **Routes**
```typescript
router.push('/(tabs)')           // Home (tasks)
router.push('/task/123')         // Task detail
router.push('/(tabs)/wellness')  // Breathing
router.push('/(tabs)/caregiver') // Caregiver
router.push('/(tabs)/settings')  // Settings
router.push('/onboarding')       // Onboarding
router.push('/paywall')          // Paywall
router.back()                    // Go back
```

### **Navigation Guards**
```typescript
// In app/_layout.tsx
if (!onboardingCompleted && !inOnboarding) {
  router.replace('/onboarding');
}
```

---

## 🔧 Common Tasks

### **Add New Screen**
1. Create file: `app/my-screen.tsx`
2. Add to layout: `app/_layout.tsx`
3. Navigate: `router.push('/my-screen')`

### **Add New Context**
```typescript
import createContextHook from '@nkzw/create-context-hook';

export const [MyProvider, useMyContext] = createContextHook(() => {
  const [state, setState] = useState(initialState);
  
  return { state, setState };
});
```

### **Add New Component**
```typescript
// components/MyComponent.tsx
import { View, Text, StyleSheet } from 'react-native';
import colors from '@/constants/colors';

export default function MyComponent() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.surface,
  },
  text: {
    fontSize: 16,
    color: colors.text,
  },
});
```

---

## 🐛 Debugging

### **Console Logs**
```typescript
console.log('[Component] Action:', data);
console.error('[Service] Error:', error);
console.warn('[Context] Warning:', message);
```

### **React Query DevTools**
```typescript
// Check query status
const { data, isLoading, error } = useQuery({
  queryKey: ['tasks'],
  queryFn: loadTasks,
});

console.log('Query status:', { data, isLoading, error });
```

### **AsyncStorage**
```typescript
// View stored data
const tasks = await AsyncStorage.getItem('@nexa_tasks');
console.log('Stored tasks:', JSON.parse(tasks));

// Clear storage
await AsyncStorage.clear();
```

---

## 🧪 Testing Checklist

- [ ] Create task → AI generates steps
- [ ] Complete all steps → Task marked complete
- [ ] Toggle accessibility → UI updates
- [ ] Start breathing → Animation plays
- [ ] Reset breathing → Timer clears
- [ ] Add caregiver → Stored locally
- [ ] Complete onboarding → Navigate to tasks
- [ ] Reach free limit → Paywall appears

---

## 🚨 Common Issues

### **Issue**: App not loading
**Fix**: Clear cache: `bunx expo start --clear`

### **Issue**: TypeScript errors
**Fix**: Restart TypeScript server in VS Code

### **Issue**: AI not working
**Fix**: Check internet connection, verify Rork Toolkit

### **Issue**: Styles not updating
**Fix**: Reload app: Press `r` in terminal

### **Issue**: Navigation broken
**Fix**: Check route names match file paths

---

## 📦 Dependencies

### **Core**
- `expo` - Expo framework
- `react-native` - React Native
- `expo-router` - File-based routing
- `typescript` - Type safety

### **State**
- `@nkzw/create-context-hook` - Context wrapper
- `@tanstack/react-query` - Async state
- `@react-native-async-storage/async-storage` - Persistence

### **AI**
- `@rork/toolkit-sdk` - AI integration

### **UI**
- `lucide-react-native` - Icons
- `expo-haptics` - Haptic feedback
- `expo-speech` - Text-to-speech

---

## 🔐 Environment Variables

```bash
# .env
AI_PROVIDER=rork                    # AI provider
EXPO_PUBLIC_APP_NAME=Nexa      # App name
EXPO_PUBLIC_DEBUG_MODE=true         # Debug mode
```

---

## 📊 Subscription Tiers

| Feature | Free | Premium | Lifetime |
|---------|------|---------|----------|
| Tasks/Day | 3 | ∞ | ∞ |
| Total Tasks | 10 | ∞ | ∞ |
| AI Breakdowns | Limited | ∞ | ∞ |
| Breathing | Basic | Advanced | Advanced |
| Caregiver | ❌ | ✅ | ✅ |
| Price | $0 | $9.99/mo | $99.99 |

---

## 🎯 Cognitive Levels

| Level | Reading | Steps | Complexity |
|-------|---------|-------|------------|
| Simple | 5th grade | 3-4 | Very basic |
| Moderate | 8th grade | 4-6 | Clear |
| Complex | Adult | 5-8 | Detailed |

---

## 📞 Quick Links

- **Rork**: [rork.com](https://rork.com)
- **Expo Docs**: [docs.expo.dev](https://docs.expo.dev)
- **React Native**: [reactnative.dev](https://reactnative.dev)
- **Crisis**: Call 988 or text HOME to 741741

---

## 🎨 Component Patterns

### **Button**
```typescript
<Button
  title="Click Me"
  onPress={handlePress}
  variant="primary"  // 'primary' | 'secondary' | 'ghost' | 'danger'
  size="md"          // 'sm' | 'md' | 'lg'
/>
```

### **Card**
```typescript
<Card style={styles.card}>
  <Text>Content</Text>
</Card>
```

### **ConfirmDialog**
```typescript
<ConfirmDialog
  visible={showDialog}
  title="Delete Task?"
  message="This action cannot be undone."
  confirmText="Delete"
  cancelText="Cancel"
  confirmVariant="danger"
  onConfirm={handleConfirm}
  onCancel={handleCancel}
/>
```

---

## 🔄 State Management Pattern

```typescript
// 1. Create context
export const [MyProvider, useMyContext] = createContextHook(() => {
  // 2. Define state
  const [data, setData] = useState<MyData[]>([]);
  
  // 3. Load from storage
  const query = useQuery({
    queryKey: ['myData'],
    queryFn: loadData,
  });
  
  // 4. Save to storage
  const mutation = useMutation({
    mutationFn: saveData,
    onSuccess: (data) => {
      queryClient.setQueryData(['myData'], data);
    },
  });
  
  // 5. Return API
  return { data, addData, updateData, deleteData };
});

// 6. Use in component
const { data, addData } = useMyContext();
```

---

## 🎯 Accessibility Checklist

- [ ] Text scales with `largeText` setting
- [ ] High contrast mode supported
- [ ] Reduced motion respected
- [ ] Voice guidance available
- [ ] Keyboard accessible
- [ ] Touch targets ≥44x44px
- [ ] Color contrast ≥4.5:1
- [ ] Focus indicators visible

---

## 📝 Code Style

### **TypeScript**
```typescript
// ✅ Good
const [tasks, setTasks] = useState<Task[]>([]);

// ❌ Bad
const [tasks, setTasks] = useState([]);
```

### **Styling**
```typescript
// ✅ Good
const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
});

// ❌ Bad
const styles = {
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
};
```

### **Imports**
```typescript
// ✅ Good
import { View, Text } from 'react-native';
import colors from '@/constants/colors';

// ❌ Bad
import { View, Text } from 'react-native';
import colors from '../../../constants/colors';
```

---

## 🚀 Deployment

### **iOS**
```bash
eas build --platform ios
eas submit --platform ios
```

### **Android**
```bash
eas build --platform android
eas submit --platform android
```

### **Web**
```bash
eas build --platform web
eas hosting:deploy
```

---

**Quick Reference Version**: 1.0.0  
**Last Updated**: 2025-10-02  
**Status**: ✅ Production Ready
