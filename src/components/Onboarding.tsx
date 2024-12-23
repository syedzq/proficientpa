import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Cookies from 'js-cookie';

interface UserPreferences {
  categories: string[];
  questionCount: number;
  difficulties: string[];
}

// Ordered categories based on typical PA school syllabus
const ORDERED_CATEGORIES = [
  { id: 'anatomy-physiology', name: 'Anatomy & Physiology', description: 'Basic structure and function of human body systems', emoji: '🧬' },
  { id: 'clinical-medicine', name: 'Clinical Medicine', description: 'Fundamentals of clinical practice and patient care', emoji: '👨‍⚕️' },
  { id: 'cardiology', name: 'Cardiology', description: 'Diseases and conditions affecting the heart and blood vessels', emoji: '❤️' },
  { id: 'pulmonology', name: 'Pulmonology', description: 'Diseases and conditions affecting the respiratory system', emoji: '🫁' },
  { id: 'gastroenterology', name: 'Gastroenterology', description: 'Diseases and conditions affecting the digestive system', emoji: '🔥' },
  { id: 'endocrinology', name: 'Endocrinology', description: 'Diseases and conditions affecting the endocrine system', emoji: '⚡' },
  { id: 'nephrology', name: 'Nephrology', description: 'Diseases and conditions affecting the kidneys', emoji: '🫘' },
  { id: 'neurology', name: 'Neurology', description: 'Diseases and conditions affecting the nervous system', emoji: '🧠' },
  { id: 'orthopedics', name: 'Orthopedics', description: 'Musculoskeletal conditions and injuries', emoji: '🦴' },
  { id: 'infectious-disease', name: 'Infectious Disease', description: 'Diseases caused by pathogenic microorganisms', emoji: '🦠' },
  { id: 'emergency-medicine', name: 'Emergency Medicine', description: 'Acute care and emergency conditions', emoji: '🚑' },
  { id: 'pediatrics', name: 'Pediatrics', description: 'Care of infants, children, and adolescents', emoji: '👶' },
  { id: 'obgyn', name: 'OB/GYN', description: 'Women\'s health and reproductive medicine', emoji: '🤰' },
  { id: 'psychiatry', name: 'Psychiatry', description: 'Mental health conditions and disorders', emoji: '🧩' },
  { id: 'dermatology', name: 'Dermatology', description: 'Conditions affecting the skin', emoji: '🔬' }
];

interface OnboardingProps {
  onComplete: (preferences: UserPreferences) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulties, setDifficulties] = useState<Set<string>>(new Set(['easy', 'medium', 'hard']));

  const handleCategoryToggle = (categoryId: string) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId);
    } else {
      newSelected.add(categoryId);
    }
    setSelectedCategories(newSelected);
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
  };

  const handleComplete = () => {
    const newPrefs: UserPreferences = {
      categories: Array.from(selectedCategories),
      questionCount,
      difficulties: Array.from(difficulties)
    };

    // Save preferences to cookies
    Cookies.set('userPreferences', JSON.stringify(newPrefs), { expires: 365 }); // Expires in 1 year

    // Call the onComplete callback with the new preferences
    onComplete(newPrefs);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          {/* Progress indicator */}
          <div className="flex justify-between space-x-2 mb-8">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`w-full h-1 rounded ${
                  num <= step ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-crimson font-bold text-gray-900 mb-4">
                  Select Covered Topics
                </h2>
                <p className="text-gray-600 mb-6 font-geist">
                  Choose the categories you've already covered in your PA program.
                  They're arranged in typical curriculum order.
                </p>
                <div className="space-y-3">
                  {ORDERED_CATEGORIES.map((category) => (
                    <div
                      key={category.id}
                      onClick={() => handleCategoryToggle(category.id)}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedCategories.has(category.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl" role="img" aria-label={category.name}>
                            {category.emoji}
                          </span>
                          <div>
                            <h3 className="font-geist font-medium text-gray-900">
                              {category.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {category.description}
                            </p>
                          </div>
                        </div>
                        {selectedCategories.has(category.id) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                          >
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-crimson font-bold text-gray-900 mb-4">
                  Questions per Session
                </h2>
                <p className="text-gray-600 mb-6 font-geist">
                  How many questions would you like in each practice session?
                </p>
                <div className="space-y-6">
                  <div>
                    <input
                      type="range"
                      min="3"
                      max="15"
                      value={questionCount}
                      onChange={(e) => setQuestionCount(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
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
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-2xl font-crimson font-bold text-gray-900 mb-4">
                  Question Difficulty
                </h2>
                <p className="text-gray-600 mb-6 font-geist">
                  Select the difficulty levels you'd like to practice with.
                </p>
                <div className="flex gap-3">
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
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-2 text-gray-600 font-geist hover:text-gray-900 transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={() => {
                if (step < 3) {
                  setStep(step + 1);
                } else {
                  handleComplete();
                }
              }}
              disabled={step === 1 && selectedCategories.size === 0}
              className={`px-6 py-2 rounded-lg font-geist ${
                step === 1 && selectedCategories.size === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {step === 3 ? 'Start Practice' : 'Next'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 