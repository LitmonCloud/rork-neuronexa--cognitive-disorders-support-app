import '@testing-library/jest-native/extend-expect';

// Must be BEFORE any react-native imports
jest.mock('react-native/Libraries/StyleSheet/StyleSheetExports', () => {
  const PixelRatio = {
    get: () => 2,
    getFontScale: () => 1,
    getPixelSizeForLayoutSize: (layoutSize) => layoutSize * 2,
    roundToNearestPixel: (layoutSize) => Math.round(layoutSize),
  };

  return {
    __esModule: true,
    default: {
      create: (styles) => styles,
      flatten: (styles) => styles,
      compose: (...styles) => Object.assign({}, ...styles),
      hairlineWidth: 1,
      absoluteFill: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
      absoluteFillObject: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
    },
    hairlineWidth: 1,
    absoluteFill: 0,
    absoluteFillObject: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  };
});

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiRemove: jest.fn(() => Promise.resolve()),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  selectionAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-linking', () => ({
  canOpenURL: jest.fn(() => Promise.resolve(true)),
  openURL: jest.fn(() => Promise.resolve()),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  removeEventListener: jest.fn(),
  createURL: jest.fn((path) => `nexa://${path}`),
  parse: jest.fn((url) => ({ hostname: null, path: null, queryParams: {} })),
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted', granted: true })
  ),
  requestBackgroundPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted', granted: true })
  ),
  getCurrentPositionAsync: jest.fn(() =>
    Promise.resolve({
      coords: {
        latitude: 37.7749,
        longitude: -122.4194,
        accuracy: 10,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    })
  ),
  startLocationUpdatesAsync: jest.fn(() => Promise.resolve()),
  stopLocationUpdatesAsync: jest.fn(() => Promise.resolve()),
  hasStartedLocationUpdatesAsync: jest.fn(() => Promise.resolve(false)),
  watchPositionAsync: jest.fn(() => Promise.resolve({ remove: jest.fn() })),
}));

jest.mock('@rork-ai/toolkit-sdk', () => ({
  generateText: jest.fn(() => Promise.resolve('Mocked AI response')),
  generateObject: jest.fn(() => Promise.resolve({})),
  useRorkAgent: jest.fn(() => ({
    messages: [],
    sendMessage: jest.fn(),
    addToolResult: jest.fn(),
    setMessages: jest.fn(),
  })),
  createRorkTool: jest.fn((config) => config),
}));

jest.mock('@shopify/react-native-skia', () => ({
  Canvas: 'Canvas',
  Path: jest.fn(),
  Skia: {
    Path: { Make: jest.fn(() => ({ addPath: jest.fn(), close: jest.fn() })) },
  },
  BlurMask: jest.fn(),
  useSharedValueEffect: jest.fn(),
  useTouchHandler: jest.fn(),
  runSpring: jest.fn(),
}));

jest.mock('react-native-gesture-handler', () => ({
  Gesture: {
    Pan: jest.fn(() => ({ onStart: jest.fn(), onUpdate: jest.fn(), onEnd: jest.fn() })),
  },
  GestureDetector: 'GestureDetector',
  GestureHandlerRootView: 'GestureHandlerRootView',
}));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('react-native-purchases', () => ({
  configure: jest.fn(),
  getOfferings: jest.fn(() => Promise.resolve({ current: null, all: {} })),
  purchasePackage: jest.fn(() => Promise.resolve({ customerInfo: {}, productIdentifier: 'test' })),
  restorePurchases: jest.fn(() => Promise.resolve({ customerInfo: {} })),
  getCustomerInfo: jest.fn(() => Promise.resolve({
    activeSubscriptions: [],
    allPurchasedProductIdentifiers: [],
    entitlements: { active: {} }
  })),
  addCustomerInfoUpdateListener: jest.fn(() => ({ remove: jest.fn() })),
}));

jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  scheduleNotificationAsync: jest.fn(() => Promise.resolve('notification-id')),
  cancelScheduledNotificationAsync: jest.fn(() => Promise.resolve()),
  getAllScheduledNotificationsAsync: jest.fn(() => Promise.resolve([])),
  setNotificationHandler: jest.fn(),
  addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
}));

// Mock Dimensions for react-native main export
jest.doMock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return Object.defineProperty(RN, 'Dimensions', {
    get: () => ({
      get: jest.fn(() => ({ width: 375, height: 667 })),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }),
  });
});

global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
};
