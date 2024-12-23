import { motion, AnimatePresence } from 'motion/react';
import QuestionCard from './QuestionCard';
import type { Question } from '../types/questions';

interface QuestionStackProps {
  questions: Question[];
  currentIndex: number;
  onAnswer: (selectedOption: number) => void;
  onSkip: () => void;
  hasAnsweredCurrent: boolean;
  hasSkippedCurrent: boolean;
  onNext: () => void;
  attemptedCount: number;
  totalQuestions: number;
}

export default function QuestionStack({
  questions,
  currentIndex,
  onAnswer,
  onSkip,
  hasAnsweredCurrent,
  hasSkippedCurrent,
  onNext,
  attemptedCount,
  totalQuestions,
}: QuestionStackProps) {
  const currentQuestion = questions[currentIndex];

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Background cards */}
      {[...Array(2)].map((_, i) => (
        <div
          key={i}
          className="absolute top-2 left-0 right-0 h-full bg-white rounded-lg shadow-lg transform -z-10"
          style={{
            transform: `translateY(${(i + 1) * 8}px) scale(${1 - (i + 1) * 0.02})`,
          }}
        />
      ))}

      {/* Active question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 200 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -200 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative z-0"
        >
          <QuestionCard
            question={currentQuestion}
            onAnswer={onAnswer}
          />
        </motion.div>
      </AnimatePresence>

      {/* Action buttons */}
      <div className="mt-6 flex justify-center gap-4 relative z-0">
        {!hasAnsweredCurrent && !hasSkippedCurrent && (
          <motion.button
            onClick={onSkip}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-geist"
          >
            Skip Question
          </motion.button>
        )}
        {hasAnsweredCurrent && (
          <motion.button
            onClick={onNext}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-geist"
          >
            {attemptedCount === totalQuestions ? 'Show Summary' : 'Next Question'}
          </motion.button>
        )}
      </div>
    </div>
  );
} 