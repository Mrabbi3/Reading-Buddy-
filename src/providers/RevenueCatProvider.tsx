import React, { createContext, useContext } from 'react';

// Mock types for Native so it doesn't crash in Expo Go without the native SDK installed
type Package = any;
type CustomerInfo = any;

type RCContextType = {
  customerInfo: CustomerInfo | null;
  offerings: Package[];
  purchasePackage: (pkg: Package) => Promise<void>;
  restorePurchases: () => Promise<void>;
  isPro: boolean;
};

const RCContext = createContext<RCContextType>({
  customerInfo: null,
  offerings: [],
  purchasePackage: async () => {
    alert('Purchases are only available on the Web version in this Expo Go test environment. Build a custom dev client to test Native purchases.');
  },
  restorePurchases: async () => {},
  isPro: false,
});

export function RevenueCatProvider({ children }: { children: React.ReactNode }) {
  return (
    <RCContext.Provider value={{ 
      customerInfo: null, 
      offerings: [], 
      purchasePackage: async () => {
        alert('Purchases are currently configured for the Web version only in this Expo Go setup.');
      }, 
      restorePurchases: async () => {}, 
      isPro: false 
    }}>
      {children}
    </RCContext.Provider>
  );
}

export const useRevenueCat = () => useContext(RCContext);
