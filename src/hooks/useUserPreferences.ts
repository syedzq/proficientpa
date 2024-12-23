import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export interface UserPreferences {
  categories: string[];
  questionCount: number;
  difficulties: string[];
}

export function useUserPreferences() {
  const { user, isLoaded: clerkLoaded } = useUser();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!clerkLoaded) return;

    if (user) {
      const userPrefs = user.unsafeMetadata.preferences as UserPreferences;
      if (userPrefs) {
        setPreferences(userPrefs);
      }
    }
    setIsLoading(false);
  }, [user, clerkLoaded]);

  const updatePreferences = async (newPrefs: UserPreferences) => {
    if (user) {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          preferences: newPrefs,
        },
      });
    }
    setPreferences(newPrefs);
  };

  const clearPreferences = async () => {
    if (user) {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          preferences: null,
        },
      });
    }
    setPreferences(null);
  };

  return {
    preferences,
    isLoading: isLoading || !clerkLoaded,
    updatePreferences,
    clearPreferences
  };
} 