import { useState, useEffect, useCallback } from "react";
import NetInfo from "@react-native-community/netinfo";

export const useNetworkStatus = () => {
  const [isOffline, setIsOffline] = useState(false);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    const state = await NetInfo.fetch();
    const currentlyOffline = state.isConnected === false;
    setIsOffline(currentlyOffline);
    return !currentlyOffline; // Return true if we are online now
  }, []);

  useEffect(() => {
    // Initial check and subscription to network state changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline = state.isConnected === false;
      setIsOffline(offline);
    });

    // Setup 5-second interval polling ONLY when offline
    let intervalId: NodeJS.Timeout;

    if (isOffline) {
      intervalId = setInterval(checkConnection, 5000);
    }

    // Cleanup subscription and interval on unmount or when status changes
    return () => {
      unsubscribe();
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isOffline, checkConnection]);

  return { isOffline, checkConnection };
};
