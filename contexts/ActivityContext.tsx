import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { useAuth } from './AuthContext';

const ACTIVITY_TIMEOUT = 1000 * 60 * 15; // 15 minutes

// The context doesn't need to provide a value anymore, its logic is self-contained.
const ActivityContext = createContext<{} | undefined>(undefined);

export const ActivityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();
  // Fix: The return type of setTimeout in the browser is `number`, not `NodeJS.Timeout`.
  // Initialize with null for type safety and to prevent potential linter errors.
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Function to reset the inactivity timer
    const resetTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      // Set a new timer that will log the user out when it fires
      timerRef.current = window.setTimeout(() => {
        console.log('User has been inactive. Logging out.');
        logout();
      }, ACTIVITY_TIMEOUT);
    };

    // If the user is authenticated, set up the listeners
    if (isAuthenticated) {
      const events: (keyof WindowEventMap)[] = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
      
      // Attach event listeners to reset the timer on user activity
      events.forEach(event => window.addEventListener(event, resetTimer));
      
      // Start the timer when the effect runs
      resetTimer();

      // Cleanup function: remove listeners and clear the timer
      return () => {
        events.forEach(event => window.removeEventListener(event, resetTimer));
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [isAuthenticated, logout]); // This effect re-runs if the user's auth state changes

  return (
    <ActivityContext.Provider value={{}}>
      {children}
    </ActivityContext.Provider>
  );
};

// No longer need to export a consumer hook as the context provides no value.
// export const useActivity = ...
