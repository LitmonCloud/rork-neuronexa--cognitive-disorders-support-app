import Purchases, {
  PurchasesPackage,
  CustomerInfo,
  PurchasesOfferings,
  LOG_LEVEL,
} from 'react-native-purchases';

import { logger } from '@/utils/logger';

const API_KEY = 'test_UuEBbaCMjdjrwVUWDdquJcjAmkw';

class RevenueCatService {
  private isConfigured = false;

  async initialize(userId?: string): Promise<void> {
    try {
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

  async getOfferings(): Promise<PurchasesOfferings | null> {
    try {
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

  async getCustomerInfo(): Promise<CustomerInfo | null> {
    try {
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

  async purchasePackage(packageToPurchase: PurchasesPackage): Promise<{
    customerInfo: CustomerInfo;
    success: boolean;
  } | null> {
    try {
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

  async restorePurchases(): Promise<CustomerInfo | null> {
    try {
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

  isPremium(customerInfo: CustomerInfo): boolean {
    const hasPremiumEntitlement = customerInfo.entitlements.active['premium'] !== undefined;
    logger.debug('[RevenueCat] Premium status check', { isPremium: hasPremiumEntitlement });
    return hasPremiumEntitlement;
  }

  async logIn(userId: string): Promise<{ customerInfo: CustomerInfo } | null> {
    try {
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

  async logOut(): Promise<CustomerInfo | null> {
    try {
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
    listener: (customerInfo: CustomerInfo) => void
  ): () => void {
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
