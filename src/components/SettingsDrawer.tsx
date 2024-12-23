import { Drawer } from 'vaul';
import { useState, useEffect } from 'react';
import { UserPreferences } from '../hooks/useUserPreferences';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const ORDERED_CATEGORIES = [
  { id: 'anatomy-physiology', name: 'Anatomy & Physiology', emoji: '🧬' },
  { id: 'clinical-medicine', name: 'Clinical Medicine', emoji: '👨‍⚕️' },
  { id: 'cardiology', name: 'Cardiology', emoji: '❤️' },
  { id: 'pulmonology', name: 'Pulmonology', emoji: '🫁' },
  { id: 'gastroenterology', name: 'Gastroenterology', emoji: '🔥' },
  { id: 'endocrinology', name: 'Endocrinology', emoji: '⚡' },
  { id: 'nephrology', name: 'Nephrology', emoji: '🫘' },
  { id: 'neurology', name: 'Neurology', emoji: '🧠' },
  { id: 'orthopedics', name: 'Orthopedics', emoji: '🦴' },
  { id: 'infectious-disease', name: 'Infectious Disease', emoji: '🦠' },
  { id: 'emergency-medicine', name: 'Emergency Medicine', emoji: '🚑' },
  { id: 'pediatrics', name: 'Pediatrics', emoji: '👶' },
  { id: 'obgyn', name: 'OB/GYN', emoji: '🤰' },
  { id: 'psychiatry', name: 'Psychiatry', emoji: '🧩' },
  { id: 'dermatology', name: 'Dermatology', emoji: '🔬' }
];

interface SettingsDrawerProps {
  preferences: UserPreferences;
  onUpdatePreferences: (newPrefs: UserPreferences) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SettingsDrawer({ preferences, onUpdatePreferences, open, onOpenChange }: SettingsDrawerProps) {
  const [isMobile, setIsMobile] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set(preferences.categories));
  const [questionCount, setQuestionCount] = useState(preferences.questionCount);
  const [difficulties, setDifficulties] = useState<Set<string>>(new Set(preferences.difficulties));

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCategoryToggle = (categoryId: string) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId);
    } else {
      newSelected.add(categoryId);
    }
    setSelectedCategories(newSelected);
    updatePreferences({ categories: Array.from(newSelected) });
  };

  const handleDifficultyToggle = (difficulty: string) => {
    const newSelected = new Set(difficulties);
    if (newSelected.has(difficulty)) {
      if (newSelected.size > 1) { // Prevent deselecting all difficulties
        newSelected.delete(difficulty);
      }
    } else {
      newSelected.add(difficulty);
    }
    setDifficulties(newSelected);
    updatePreferences({ difficulties: Array.from(newSelected) });
  };

  const handleQuestionCountChange = (count: number) => {
    setQuestionCount(count);
    updatePreferences({ questionCount: count });
  };

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    onUpdatePreferences({
      ...preferences,
      ...updates
    });
  };

  return (
    <Drawer.Root 
      open={open} 
      onOpenChange={onOpenChange}
      direction={isMobile ? 'bottom' : 'right'}
      shouldScaleBackground
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className={`
          bg-white text-gray-900 flex flex-col fixed z-[60]
          ${isMobile ? 
            'bottom-0 left-0 right-0 h-[96vh] rounded-t-[10px]' : 
            'bottom-0 right-0 top-0 w-[400px] rounded-l-[10px]'
          }
        `}>
            <VisuallyHidden><Drawer.Title>Settings</Drawer.Title></VisuallyHidden>
          <div className="p-4 flex-1 overflow-y-auto">
            {isMobile && (
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
            )}
            
            <h2 className="sr-only">Settings</h2>
            
            <div className="mb-8">
              <h3 className="text-lg font-crimson font-semibold mb-4">Categories</h3>
              <div className="grid grid-cols-2 gap-2">
                {ORDERED_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryToggle(category.id)}
                    className={`p-2 rounded-lg border flex items-center text-left gap-2 transition-colors ${
                      selectedCategories.has(category.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl" role="img" aria-label={category.name}>
                      {category.emoji}
                    </span>
                    <span className="text-sm font-geist">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-crimson font-semibold mb-4">Questions per Session</h3>
              <div className="px-2">
                <input
                  type="range"
                  min="3"
                  max="15"
                  value={questionCount}
                  onChange={(e) => handleQuestionCountChange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  aria-label="Number of questions per session"
                />
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>3</span>
                  <span className="font-medium text-blue-600">
                    {questionCount} questions
                  </span>
                  <span>15</span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-crimson font-semibold mb-4">Difficulty</h3>
              <div className="flex gap-2">
                {['easy', 'medium', 'hard'].map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => handleDifficultyToggle(difficulty)}
                    className={`px-4 py-2 rounded-full font-geist capitalize transition-colors ${
                      difficulties.has(difficulty)
                        ? 'bg-blue-100 text-blue-800 border-2 border-blue-500'
                        : 'bg-gray-100 text-gray-800 border-2 border-transparent hover:bg-gray-200'
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
} 