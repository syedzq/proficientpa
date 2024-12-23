import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export interface UserPreferences {
  categories: string[];
  questionCount: number;
  difficulties: string[];
}

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedPrefs = Cookies.get('userPreferences');
    if (storedPrefs) {
      try {
        setPreferences(JSON.parse(storedPrefs));
      } catch (e) {
        console.error('Error parsing user preferences:', e);
        setPreferences(null);
      }
    }
    setIsLoading(false);
  }, []);

  const updatePreferences = (newPrefs: UserPreferences) => {
    Cookies.set('userPreferences', JSON.stringify(newPrefs), { expires: 365 });
    setPreferences(newPrefs);
  };

  const clearPreferences = () => {
    Cookies.remove('userPreferences');
    setPreferences(null);
  };

  return {
    preferences,
    isLoading,
    updatePreferences,
    clearPreferences
  };
} 