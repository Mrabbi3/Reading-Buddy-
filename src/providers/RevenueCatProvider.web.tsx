import React, { createContext, useContext, useEffect, useState } from 'react';
import { Purchases, CustomerInfo, Package } from '@revenuecat/purchases-js';
import { useAuth } from './AuthProvider';

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
  purchasePackage: async () => {},
  restorePurchases: async () => {},
  isPro: false,
});

const API_KEY = 'test_UDUfzeDpLlCrxjKdASfJezzTqhM';

export function RevenueCatProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const [purchases, setPurchases] = useState<Purchases | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [offerings, setOfferings] = useState<Package[]>([]);

  useEffect(() => {
    const initRC = async () => {
      try {
        const rc = Purchases.configure(API_KEY, session?.user?.id);
        setPurchases(rc);
        
        const info = await rc.getCustomerInfo();
        setCustomerInfo(info);
        
        const offers = await rc.getOfferings();
        if (offers.current) {
          setOfferings(offers.current.availablePackages);
        }
      } catch (e) {
        console.error('RevenueCat initialization error:', e);
      }
    };

    if (session?.user?.id) {
      initRC();
    }
  }, [session?.user?.id]);

  const purchasePackage = async (pkg: Package) => {
    if (!purchases) return;
    try {
      const { customerInfo } = await purchases.purchasePackage(pkg);
      setCustomerInfo(customerInfo);
      alert('Purchase successful!');
    } catch (e: any) {
      if (!e.userCancelled) {
        alert('Purchase failed: ' + e.message);
      }
    }
  };

  const restorePurchases = async () => {
    if (!purchases) return;
    try {
      const info = await purchases.restorePurchases();
      setCustomerInfo(info);
      alert('Purchases restored!');
    } catch (e: any) {
      alert('Restore failed: ' + e.message);
    }
  };

  const isPro = customerInfo?.entitlements.active['pro'] !== undefined;

  return (
    <RCContext.Provider value={{ customerInfo, offerings, purchasePackage, restorePurchases, isPro }}>
      {children}
    </RCContext.Provider>
  );
}

export const useRevenueCat = () => useContext(RCContext);
