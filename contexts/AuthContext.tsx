import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { AuthUser, User } from '../types';

// Using more realistic keys
const DB_USERS_KEY = 'timevault_db_users';
const SESSION_USER_KEY = 'timevault_session_user';
const PENDING_VERIFICATION_KEY = 'timevault_pending_verification';

interface AuthContextType {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, phone: string, password: string) => Promise<void>;
  verifyPhoneAndLogin: (code: string) => Promise<void>;
  updateProfilePhoto: (photoDataUrl: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to get users from our mock DB (localStorage)
const getMockUsers = (): User[] => {
  const users = localStorage.getItem(DB_USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Helper to save users to our mock DB
const saveMockUsers = (users: User[]) => {
  localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On initial load, check for a logged-in user in session storage
    try {
      const storedUser = sessionStorage.getItem(SESSION_USER_KEY);
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from sessionStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const clientUser = (user: User): AuthUser => {
    const { password, ...clientUser } = user;
    return clientUser;
  };

  const login = useCallback(async (email: string, pass: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getMockUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
        
        if (user) {
          if (!user.phoneVerified) {
            reject(new Error('Account not verified. Please complete the phone verification process.'));
            return;
          }
          const authUser = clientUser(user);
          sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(authUser));
          setCurrentUser(authUser);
          resolve();
        } else {
          reject(new Error('Invalid email or password.'));
        }
      }, 1000);
    });
  }, []);

  const signup = useCallback(async (email: string, phone: string, password: string): Promise<void> => {
     return new Promise((resolve, reject) => {
        setTimeout(() => {
            const users = getMockUsers();
            if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
                reject(new Error('An account with this email already exists.'));
                return;
            }

            const verificationCode = "123456"; // Hardcoded for demo
            
            const pendingUser = { email, phone, password, verificationCode };
            sessionStorage.setItem(PENDING_VERIFICATION_KEY, JSON.stringify(pendingUser));

            resolve();
        }, 1000);
     });
  }, []);

  const verifyPhoneAndLogin = useCallback(async (code: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const pendingData = sessionStorage.getItem(PENDING_VERIFICATION_KEY);
        if (!pendingData) {
          reject(new Error("No pending verification found. Please sign up again."));
          return;
        }

        const { email, phone, password, verificationCode } = JSON.parse(pendingData);

        if (code !== verificationCode) {
          reject(new Error("Invalid verification code."));
          return;
        }
        
        const users = getMockUsers();
        const newUser: User = {
          id: `user-${Date.now()}`,
          email,
          phone,
          password,
          phoneVerified: true,
          profilePhotoUrl: null,
        };
        
        saveMockUsers([...users, newUser]);
        
        const authUser = clientUser(newUser);
        sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(authUser));
        setCurrentUser(authUser);
        
        sessionStorage.removeItem(PENDING_VERIFICATION_KEY);
        resolve();
      }, 1000);
    });
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_USER_KEY);
    setCurrentUser(null);
  }, []);
  
  const updateProfilePhoto = useCallback(async (photoDataUrl: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (currentUser) {
            setTimeout(() => {
                const updatedUser = { ...currentUser, profilePhotoUrl: photoDataUrl };
                sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(updatedUser));
                setCurrentUser(updatedUser);
                
                // Also update the mock DB
                const users = getMockUsers();
                const userIndex = users.findIndex(u => u.id === currentUser.id);
                if (userIndex > -1) {
                    users[userIndex].profilePhotoUrl = photoDataUrl;
                    saveMockUsers(users);
                }
                resolve();
            }, 500);
        } else {
            reject(new Error("No user is logged in to update."));
        }
    });
  }, [currentUser]);
  
  const forgotPassword = useCallback(async (email: string): Promise<void> => {
    return new Promise((resolve) => {
        console.log(`Password reset requested for: ${email}. In a real app, this would check if the user exists and trigger an email.`);
        setTimeout(resolve, 1000);
    });
  }, []);

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    login,
    logout,
    signup,
    verifyPhoneAndLogin,
    updateProfilePhoto,
    forgotPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};