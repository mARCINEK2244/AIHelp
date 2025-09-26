import { useState, useEffect, useCallback } from 'react';
import { mockAuthService } from '../services/mockAuthService';
import type { AuthUser, UserAppData } from '../types';

const defaultAppData: UserAppData = {
  selectedSubstance: null,
  userInfo: null,
  cravingLogs: [],
};

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [userAppData, setUserAppData] = useState<UserAppData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Check session on initial load
  useEffect(() => {
    const checkCurrentUser = async () => {
      setIsLoading(true);
      const user = await mockAuthService.checkSession();
      if (user) {
        setCurrentUser(user);
        const data = await mockAuthService.loadUserData(user);
        setUserAppData(data);
      }
      setIsLoading(false);
    };
    checkCurrentUser();
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (currentUser && userAppData && !isLoading) {
      setIsSaving(true);
      const handler = setTimeout(() => {
        mockAuthService.saveUserData(currentUser, userAppData).finally(() => setIsSaving(false));
      }, 1000); // Debounce saving

      return () => clearTimeout(handler);
    }
  }, [userAppData, currentUser, isLoading]);

  const login = useCallback(async (email: string, password: string) => {
    const user = await mockAuthService.login(email, password);
    setCurrentUser(user);
    setIsLoading(true);
    const data = await mockAuthService.loadUserData(user);
    setUserAppData(data);
    setIsLoading(false);
    return user;
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    const user = await mockAuthService.signup(email, password);
    setCurrentUser(user);
    setUserAppData(defaultAppData); // Start with fresh data
    return user;
  }, []);

  const logout = useCallback(async () => {
    await mockAuthService.logout();
    setCurrentUser(null);
    setUserAppData(null);
  }, []);

  // Function to update parts of the user data
  const updateUserAppData = useCallback((updates: Partial<UserAppData>) => {
    setUserAppData(prevData => {
        if (!prevData) return defaultAppData;
        return { ...prevData, ...updates };
    });
  }, []);

  const resetUserProgress = useCallback(() => {
    setUserAppData(defaultAppData);
  }, []);

  return {
    currentUser,
    userAppData,
    isLoading,
    isSaving,
    login,
    signup,
    logout,
    updateUserAppData,
    resetUserProgress
  };
};
