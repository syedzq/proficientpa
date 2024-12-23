'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { SignUpButton } from '@clerk/nextjs';
import QuestionStack from '../components/QuestionStack';
import SessionSummary from '../components/SessionSummary';
import Onboarding from '../components/Onboarding';
import SettingsDrawer from '../components/SettingsDrawer';
import { questionBank } from '../data/questionBank';
import { motion } from 'motion/react';
import { shuffleArray } from '../utils/arrayUtils';
import { useUserPreferences } from '../hooks/useUserPreferences';
import AuthButton from '../components/AuthButton';

export default function Home() {
  const { preferences, isLoading, updatePreferences } = useUserPreferences();
  const { isSignedIn } = useUser();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  
  // All available questions
  const [allQuestions] = useState(questionBank);
  // Current session's questions (filtered and randomly selected)
  const [sessionQuestions, setSessionQuestions] = useState<typeof questionBank>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [correctAnswers, setCorrectAnswers] = useState<Set<number>>(new Set());
  const [skippedQuestions, setSkippedQuestions] = useState<Set<number>>(new Set());
  const [showSummary, setShowSummary] = useState(false);

  // Filter and select questions based on user preferences
  const initializeSession = useCallback(() => {
    if (!preferences) return;

    // Filter questions based on preferences
    const filteredQuestions = allQuestions.filter(question => {
      const categoryMatches = preferences.categories.includes(question.topic.category.id);
      const difficultyMatches = preferences.difficulties.includes(question.difficulty);
      return categoryMatches && difficultyMatches;
    });

    // Shuffle and select the requested number of questions
    const { shuffled } = shuffleArray(filteredQuestions);
    const selectedQuestions = shuffled.slice(0, preferences.questionCount);
    setSessionQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setAnsweredQuestions(new Set());
    setCorrectAnswers(new Set());
    setSkippedQuestions(new Set());
    setShowSummary(false);
  }, [preferences, allQuestions]);

  // Initialize session when preferences change
  useEffect(() => {
    if (preferences) {
      initializeSession();
    }
  }, [preferences, initializeSession]);

  const handleAnswer = (selectedOption: number) => {
    setAnsweredQuestions(prev => {
      const newAnswered = new Set(prev).add(currentQuestionIndex);
      
      // Show auth prompt after 2 questions if not signed in
      if (newAnswered.size === 2 && !isSignedIn) {
        setShowAuthPrompt(true);
      }
      
      return newAnswered;
    });

    const isCorrect = selectedOption === sessionQuestions[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      setCorrectAnswers(prev => new Set(prev).add(currentQuestionIndex));
    }
  };

  const handleSkip = () => {
    setSkippedQuestions(prev => new Set(prev).add(currentQuestionIndex));
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    const attemptedCount = answeredQuestions.size + skippedQuestions.size;
    // If this was the last question, show summary
    if (attemptedCount === sessionQuestions.length) {
      setShowSummary(true);
      return;
    }

    // Move to the next unattempted question
    let nextIndex = (currentQuestionIndex + 1) % sessionQuestions.length;
    while (answeredQuestions.has(nextIndex) || skippedQuestions.has(nextIndex)) {
      nextIndex = (nextIndex + 1) % sessionQuestions.length;
    }
    setCurrentQuestionIndex(nextIndex);
  };

  const handleRestart = () => {
    initializeSession();
    setCurrentQuestionIndex(0);
    setAnsweredQuestions(new Set());
    setCorrectAnswers(new Set());
    setSkippedQuestions(new Set());
    setShowSummary(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-100 py-12 flex items-center justify-center">
        <div className="text-center font-geist text-gray-600">
          Loading...
        </div>
      </main>
    );
  }

  // Show onboarding for new users
  if (!preferences) {
    return <Onboarding onComplete={updatePreferences} />;
  }

  // Show loading state while session questions are being initialized
  if (sessionQuestions.length === 0) {
    return (
      <main className="min-h-screen bg-gray-100 py-12 flex items-center justify-center">
        <div className="text-center font-geist text-gray-600">
          Preparing your questions...
        </div>
      </main>
    );
  }

  if (showSummary) {
    return (
      <main className="min-h-screen bg-gray-100 py-12">
        <SessionSummary
          correctAnswers={correctAnswers.size}
          totalQuestions={sessionQuestions.length}
          skippedQuestions={skippedQuestions.size}
          onRestart={handleRestart}
          questions={sessionQuestions}
          answeredQuestionIndices={answeredQuestions}
          correctQuestionIndices={correctAnswers}
          skippedQuestionIndices={skippedQuestions}
        />
      </main>
    );
  }

  // Show auth prompt overlay
  if (showAuthPrompt) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg max-w-md mx-4">
          <h2 className="text-2xl font-crimson font-bold text-gray-900 mb-4">
            Ready to Track Your Progress?
          </h2>
          <p className="text-gray-600 mb-6 font-geist">
            Sign up now to save your progress, track your performance, and get personalized study recommendations.
          </p>
          <div className="flex gap-4 justify-end">
            <button
              onClick={() => setShowAuthPrompt(false)}
              className="px-4 py-2 text-sm font-geist text-gray-700 hover:text-gray-900"
            >
              Continue as Guest
            </button>
            <SignUpButton mode="modal">
              <button className="px-4 py-2 text-sm font-geist bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <AuthButton />
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-crimson font-semibold text-gray-900"
            >
              ProficientPA
            </motion.h1>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
          
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-geist text-gray-600 mb-6"
          >
            Practice PANCE questions tailored to your study progress
          </motion.p>
          
          <div className="flex items-center justify-center gap-8 mb-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="text-2xl font-geist font-bold text-gray-900">
                {answeredQuestions.size}
              </div>
              <div className="text-sm font-geist text-gray-500">
                answered
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="text-2xl font-geist font-bold text-gray-900">
                {skippedQuestions.size}
              </div>
              <div className="text-sm font-geist text-gray-500">
                skipped
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm font-geist text-gray-500"
          >
            Question {currentQuestionIndex + 1} of {sessionQuestions.length}
          </motion.div>
        </div>

        <QuestionStack
          questions={sessionQuestions}
          currentIndex={currentQuestionIndex}
          onAnswer={handleAnswer}
          onSkip={handleSkip}
          hasAnsweredCurrent={answeredQuestions.has(currentQuestionIndex)}
          hasSkippedCurrent={skippedQuestions.has(currentQuestionIndex)}
          onNext={handleNextQuestion}
          attemptedCount={answeredQuestions.size + skippedQuestions.size}
          totalQuestions={sessionQuestions.length}
        />

        <SettingsDrawer
          preferences={preferences}
          onUpdatePreferences={updatePreferences}
          open={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
        />
      </div>
    </main>
  );
}
