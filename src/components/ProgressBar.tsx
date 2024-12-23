import { motion } from 'motion/react';

interface ProgressBarProps {
  correct: number;
  incorrect: number;
  skipped: number;
}

export default function ProgressBar({ correct, incorrect, skipped }: ProgressBarProps) {
  const total = correct + incorrect + skipped;
  if (total === 0) return null;

  const correctPercentage = (correct / total) * 100;
  const incorrectPercentage = (incorrect / total) * 100;
  const skippedPercentage = (skipped / total) * 100;

  return (
    <div className="w-full">
      <div className="flex mb-2 justify-between text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Correct ({correct})</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Incorrect ({incorrect})</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <span>Skipped ({skipped})</span>
        </div>
      </div>
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full flex">
          {correctPercentage > 0 && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${correctPercentage}%` }}
              transition={{ duration: 0.5 }}
              className="bg-green-500 h-full"
            />
          )}
          {incorrectPercentage > 0 && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${incorrectPercentage}%` }}
              transition={{ duration: 0.5 }}
              className="bg-red-500 h-full"
            />
          )}
          {skippedPercentage > 0 && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${skippedPercentage}%` }}
              transition={{ duration: 0.5 }}
              className="bg-yellow-400 h-full"
            />
          )}
        </div>
      </div>
    </div>
  );
} 