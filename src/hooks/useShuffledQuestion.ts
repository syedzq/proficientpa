import { useState, useEffect } from 'react';
import { Question } from '../types/questions';
import { shuffleArray } from '../utils/arrayUtils';

interface ShuffledQuestionState {
  question: Question;
  originalIndices: number[];
}

export function useShuffledQuestion(question: Question) {
  const [state, setState] = useState<ShuffledQuestionState>({
    question,
    originalIndices: Array.from({ length: question.options.length }, (_, i) => i)
  });

  useEffect(() => {
    const { shuffled: shuffledOptions, originalIndices } = shuffleArray(question.options);
    const newCorrectAnswerIndex = originalIndices.findIndex(i => i === question.correctAnswer);

    setState({
      question: {
        ...question,
        options: shuffledOptions,
        correctAnswer: newCorrectAnswerIndex
      },
      originalIndices
    });
  }, [question]);

  return {
    question: state.question,
    getOriginalIndex: (shuffledIndex: number) => state.originalIndices[shuffledIndex]
  };
} 