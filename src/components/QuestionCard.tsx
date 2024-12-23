import { useState } from 'react';
import type { Question } from '../types/questions';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { useShuffledQuestion } from '../hooks/useShuffledQuestion';

interface QuestionCardProps {
  question: Question;
  onAnswer: (selectedOption: number) => void;
  key?: string;
}

const letters = ['A', 'B', 'C', 'D', 'E'];

export default function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  const { question: shuffledQuestion, getOriginalIndex } = useShuffledQuestion(question);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = () => {
    if (selectedOption !== null) {
      const originalIndex = getOriginalIndex(selectedOption);
      onAnswer(originalIndex);
      setShowExplanation(true);
      setHasSubmitted(true);

      if (selectedOption === shuffledQuestion.correctAnswer) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
      }
    }
  };

  const getOptionClassName = (index: number) => {
    if (!hasSubmitted || selectedOption !== index) {
      return selectedOption === index
        ? 'border-blue-500 bg-blue-50'
        : 'border-gray-200 hover:bg-gray-50';
    }

    return index === shuffledQuestion.correctAnswer
      ? 'border-green-500 bg-green-100 text-green-800'
      : selectedOption === index
      ? 'border-red-500 bg-red-100 text-red-800'
      : 'border-gray-200';
  };

  const getCircleClassName = (index: number) => {
    if (!hasSubmitted) {
      return selectedOption === index
        ? 'bg-blue-500 text-white'
        : 'bg-gray-100 text-gray-600';
    }

    if (index === shuffledQuestion.correctAnswer) {
      return 'bg-green-500 text-white';
    }
    
    if (selectedOption === index) {
      return 'bg-red-500 text-white';
    }

    return 'bg-gray-100 text-gray-600';
  };

  const shakeAnimation = {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-geist text-gray-500">{shuffledQuestion.topic.name}</span>
          <span className={`px-2 py-1 rounded text-sm font-geist ${
            shuffledQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
            shuffledQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {shuffledQuestion.difficulty}
          </span>
        </div>
        <p className="text-2xl font-crimson font-normal text-gray-900">{shuffledQuestion.text}</p>
      </div>

      <div className="space-y-3">
        {shuffledQuestion.options.map((option, index) => {
          const isSelected = selectedOption === index;
          const isWrongAnswer = hasSubmitted && isSelected && index !== shuffledQuestion.correctAnswer;
          
          return (
            <motion.button
              key={index}
              animate={isWrongAnswer && isShaking ? shakeAnimation : {}}
              onClick={() => !hasSubmitted && setSelectedOption(index)}
              disabled={hasSubmitted}
              className={`w-full p-4 text-left rounded-lg border font-geist text-gray-900 transition-colors ${getOptionClassName(index)}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${getCircleClassName(index)}`}>
                  {letters[index]}
                </div>
                <span>{option}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={selectedOption === null || hasSubmitted}
          className={`px-4 py-2 rounded-lg font-geist ${
            selectedOption === null || hasSubmitted
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {hasSubmitted ? 'Submitted' : 'Submit Answer'}
        </button>
      </div>

      {showExplanation && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-crimson font-normal text-xl text-gray-900">Explanation</h3>
          <p className="mt-2 font-geist text-gray-700">{shuffledQuestion.explanation}</p>
        </div>
      )}
    </div>
  );
} 