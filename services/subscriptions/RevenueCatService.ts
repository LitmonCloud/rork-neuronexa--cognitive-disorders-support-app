import { Platform } from 'react-native';
import { logger } from '@/utils/logger';

let Purchases: any = null;
let LOG_LEVEL: any = null;
let PurchasesPackage: any;
let CustomerInfo: any;
let PurchasesOfferings: any;

if (Platform.OS !== 'web') {
  const RCModule = require('react-native-purchases');
  Purchases = RCModule.default || RCModule;
  LOG_LEVEL = RCModule.LOG_LEVEL;
  PurchasesPackage = RCModule.PurchasesPackage;
  CustomerInfo = RCModule.CustomerInfo;
  PurchasesOfferings = RCModule.PurchasesOfferings;
}

export type { CustomerInfo, PurchasesPackage, PurchasesOfferings };

// Revenue Cat API Keys
// Get from https://app.revenuecat.com/settings/api-keys
const API_KEY_IOS = process.env.EXPO_PUBLIC_RC_IOS_API_KEY || 'test_UuEBbaCMjdjrwVUWDdquJcjAmkw';
const API_KEY_ANDROID = process.env.EXPO_PUBLIC_RC_ANDROID_API_KEY || 'test_UuEBbaCMjdjrwVUWDdquJcjAmkw';

// Select the appropriate API key based on platform
const API_KEY = Platform.OS === 'ios' ? API_KEY_IOS : API_KEY_ANDROID;

class RevenueCatService {
  private isConfigured = false;

  async initialize(userId?: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        logger.info('[RevenueCat] Web platform - skipping initialization');
        this.isConfigured = true;
        return;
      }

      if (!Purchases) {
        logger.warn('[RevenueCat] SDK not available');
        return;
      }

      if (this.isConfigured) {
        logger.info('[RevenueCat] Already configured');
        return;
      }

      logger.info('[RevenueCat] Initializing SDK');

      Purchases.setLogLevel(LOG_LEVEL.DEBUG);

      await Purchases.configure({
        apiKey: API_KEY,
        appUserID: userId,
      });

      if (userId) {
        await Purchases.logIn(userId);
        logger.info('[RevenueCat] User logged in', { userId });
      }

      this.isConfigured = true;
      logger.info('[RevenueCat] SDK initialized successfully');
    } catch (error) {
      logger.error('[RevenueCat] Initialization error', error as Error);
      throw error;
    }
  }

  async getOfferings(): Promise<any | null> {
    try {
      if (Platform.OS === 'web' || !Purchases) {
        logger.info('[RevenueCat] Not available on this platform');
        return null;
      }

      logger.info('[RevenueCat] Fetching offerings');
      const offerings = await Purchases.getOfferings();
      
      if (offerings.current) {
        logger.info('[RevenueCat] Current offering available', {
          identifier: offerings.current.identifier,
          packagesCount: offerings.current.availablePackages.length,
        });
      } else {
        logger.warn('[RevenueCat] No current offering available');
      }

      return offerings;
    } catch (error) {
      logger.error('[RevenueCat] Error fetching offerings', error as Error);
      return null;
    }
  }

  async getCustomerInfo(): Promise<any | null> {
    try {
      if (Platform.OS === 'web' || !Purchases) {
        logger.info('[RevenueCat] Not available on this platform');
        return null;
      }

      logger.info('[RevenueCat] Fetching customer info');
      const customerInfo = await Purchases.getCustomerInfo();
      
      logger.info('[RevenueCat] Customer info retrieved', {
        activeEntitlements: Object.keys(customerInfo.entitlements.active),
        activeSubscriptions: customerInfo.activeSubscriptions,
      });

      return customerInfo;
    } catch (error) {
      logger.error('[RevenueCat] Error fetching customer info', error as Error);
      return null;
    }
  }

  async purchasePackage(packageToPurchase: any): Promise<{
    customerInfo: any;
    success: boolean;
  } | null> {
    try {
      if (Platform.OS === 'web' || !Purchases) {
        logger.info('[RevenueCat] Not available on this platform');
        return null;
      }

      logger.info('[RevenueCat] Initiating purchase', {
        packageId: packageToPurchase.identifier,
        productId: packageToPurchase.product.identifier,
      });

      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);

      logger.info('[RevenueCat] Purchase successful', {
        activeEntitlements: Object.keys(customerInfo.entitlements.active),
      });

      return {
        customerInfo,
        success: true,
      };
    } catch (error: any) {
      if (error.userCancelled) {
        logger.info('[RevenueCat] Purchase cancelled by user');
      } else {
        logger.error('[RevenueCat] Purchase error', error);
      }
      return null;
    }
  }

  async restorePurchases(): Promise<any | null> {
    try {
      if (Platform.OS === 'web' || !Purchases) {
        logger.info('[RevenueCat] Not available on this platform');
        return null;
      }

      logger.info('[RevenueCat] Restoring purchases');
      const customerInfo = await Purchases.restorePurchases();
      
      logger.info('[RevenueCat] Purchases restored', {
        activeEntitlements: Object.keys(customerInfo.entitlements.active),
      });

      return customerInfo;
    } catch (error) {
      logger.error('[RevenueCat] Error restoring purchases', error as Error);
      return null;
    }
  }

  isPremium(customerInfo: any): boolean {
    if (!customerInfo) return false;
    const hasPremiumEntitlement = customerInfo.entitlements?.active?.['premium'] !== undefined;
    logger.debug('[RevenueCat] Premium status check', { isPremium: hasPremiumEntitlement });
    return hasPremiumEntitlement;
  }

  async logIn(userId: string): Promise<{ customerInfo: any } | null> {
    try {
      if (Platform.OS === 'web' || !Purchases) {
        logger.info('[RevenueCat] Not available on this platform');
        return null;
      }

      logger.info('[RevenueCat] Logging in user', { userId });
      const result = await Purchases.logIn(userId);
      
      logger.info('[RevenueCat] User logged in successfully', {
        created: result.created,
        activeEntitlements: Object.keys(result.customerInfo.entitlements.active),
      });

      return result;
    } catch (error) {
      logger.error('[RevenueCat] Login error', error as Error);
      return null;
    }
  }

  async logOut(): Promise<any | null> {
    try {
      if (Platform.OS === 'web' || !Purchases) {
        logger.info('[RevenueCat] Not available on this platform');
        return null;
      }

      logger.info('[RevenueCat] Logging out user');
      const customerInfo = await Purchases.logOut();
      
      logger.info('[RevenueCat] User logged out successfully');

      return customerInfo;
    } catch (error) {
      logger.error('[RevenueCat] Logout error', error as Error);
      return null;
    }
  }

  addCustomerInfoUpdateListener(
    listener: (customerInfo: any) => void
  ): () => void {
    if (Platform.OS === 'web' || !Purchases) {
      logger.info('[RevenueCat] Not available on this platform');
      return () => {};
    }

    logger.info('[RevenueCat] Adding customer info update listener');
    Purchases.addCustomerInfoUpdateListener(listener);

    return () => {
      logger.info('[RevenueCat] Removing customer info update listener');
    };
  }

  async syncAttributesForUser(attributes: {
    email?: string;
    displayName?: string;
    [key: string]: string | undefined;
  }): Promise<void> {
    try {
      if (Platform.OS === 'web' || !Purchases) {
        logger.info('[RevenueCat] Not available on this platform');
        return;
      }

      logger.info('[RevenueCat] Syncing user attributes', { keys: Object.keys(attributes) });

      if (attributes.email) {
        await Purchases.setEmail(attributes.email);
      }
      if (attributes.displayName) {
        await Purchases.setDisplayName(attributes.displayName);
      }

      for (const [key, value] of Object.entries(attributes)) {
        if (key !== 'email' && key !== 'displayName' && value) {
          await Purchases.setAttributes({ [key]: value });
        }
      }

      logger.info('[RevenueCat] User attributes synced');
    } catch (error) {
      logger.error('[RevenueCat] Error syncing attributes', error as Error);
    }
  }

  async getManagementURL(): Promise<string | null> {
    try {
      if (Platform.OS === 'web' || !Purchases) {
        logger.info('[RevenueCat] Not available on this platform');
        return null;
      }

      logger.info('[RevenueCat] Fetching management URL');
      const url = await Purchases.getCustomerInfo().then(info => {
        return info.managementURL;
      });
      
      logger.info('[RevenueCat] Management URL retrieved', { url });
      return url || null;
    } catch (error) {
      logger.error('[RevenueCat] Error fetching management URL', error as Error);
      return null;
    }
  }

  async checkTrialEligibility(productIdentifier: string): Promise<boolean> {
    try {
      if (Platform.OS === 'web' || !Purchases) {
        logger.info('[RevenueCat] Not available on this platform');
        return true;
      }

      logger.info('[RevenueCat] Checking trial eligibility', { productIdentifier });
      
      const customerInfo = await this.getCustomerInfo();
      if (!customerInfo) return true;

      const hasActiveSubscription = customerInfo.activeSubscriptions.length > 0;
      const hasUsedTrial = customerInfo.entitlements.all[productIdentifier]?.isActive === false;

      const isEligible = !hasActiveSubscription && !hasUsedTrial;
      
      logger.info('[RevenueCat] Trial eligibility checked', { 
        productIdentifier, 
        isEligible,
        hasActiveSubscription,
        hasUsedTrial
      });

      return isEligible;
    } catch (error) {
      logger.error('[RevenueCat] Error checking trial eligibility', error as Error);
      return true;
    }
  }
}

export const revenueCatService = new RevenueCatService();
