import RadialProgress from './RadialProgress';
import ProgressBar from './ProgressBar';
import { Question } from '../types/questions';

interface SessionSummaryProps {
  correctAnswers: number;
  totalQuestions: number;
  skippedQuestions: number;
  onRestart: () => void;
  questions: Question[];
  answeredQuestionIndices: Set<number>;
  correctQuestionIndices: Set<number>;
  skippedQuestionIndices: Set<number>;
}

interface CategorySummary {
  name: string;
  correct: number;
  incorrect: number;
  skipped: number;
  total: number;
}

export default function SessionSummary({
  correctAnswers,
  totalQuestions,
  skippedQuestions,
  onRestart,
  questions,
  answeredQuestionIndices,
  correctQuestionIndices,
  skippedQuestionIndices
}: SessionSummaryProps) {
  const attemptedQuestions = totalQuestions - skippedQuestions;
  const percentage = attemptedQuestions > 0 
    ? (correctAnswers / attemptedQuestions) * 100 
    : 0;

  // Calculate category summaries
  const categorySummaries = questions.reduce((acc: { [key: string]: CategorySummary }, question, index) => {
    const categoryName = question.topic.category.name;
    
    if (!acc[categoryName]) {
      acc[categoryName] = {
        name: categoryName,
        correct: 0,
        incorrect: 0,
        skipped: 0,
        total: 0
      };
    }

    acc[categoryName].total++;

    if (skippedQuestionIndices.has(index)) {
      acc[categoryName].skipped++;
    } else if (correctQuestionIndices.has(index)) {
      acc[categoryName].correct++;
    } else if (answeredQuestionIndices.has(index)) {
      acc[categoryName].incorrect++;
    }

    return acc;
  }, {});

  const sortedCategories = Object.values(categorySummaries).sort((a, b) => b.total - a.total);
  
  const getFeedbackMessage = () => {
    if (skippedQuestions === totalQuestions) {
      return {
        title: "No Questions Attempted 🤔",
        message: "Try answering some questions! It's okay to make mistakes - that's how we learn."
      };
    }
    
    if (percentage === 100) {
      return {
        title: "Perfect Score! 🎉",
        message: skippedQuestions > 0 
          ? `Outstanding work on the questions you attempted! Try the ${skippedQuestions} skipped question${skippedQuestions > 1 ? 's' : ''} when you feel ready.`
          : "Outstanding work! You've mastered these concepts completely. Keep up the excellent work!"
      };
    } else if (percentage >= 80) {
      return {
        title: "Excellent Performance! 🌟",
        message: skippedQuestions > 0
          ? `Great job on the questions you attempted! Review the ones you missed and try the ${skippedQuestions} skipped question${skippedQuestions > 1 ? 's' : ''} when ready.`
          : "Great job! You're showing strong understanding of the material. Focus on the few questions you missed to achieve perfection."
      };
    } else if (percentage >= 70) {
      return {
        title: "Good Progress! 👍",
        message: skippedQuestions > 0
          ? `You're on the right track! Review the questions you missed and tackle the ${skippedQuestions} skipped question${skippedQuestions > 1 ? 's' : ''} after some study.`
          : "You're on the right track! Review the questions you missed to strengthen your knowledge in those areas."
      };
    } else if (percentage >= 60) {
      return {
        title: "Keep Going! 💪",
        message: skippedQuestions > 0
          ? `You're making progress! Review the material, then try both the missed and ${skippedQuestions} skipped question${skippedQuestions > 1 ? 's' : ''}.`
          : "You're making progress! Focus on understanding the explanations for the questions you missed."
      };
    } else {
      return {
        title: "Room for Improvement 📚",
        message: skippedQuestions > 0
          ? `Don't get discouraged! Review the material thoroughly before attempting the ${skippedQuestions} skipped question${skippedQuestions > 1 ? 's' : ''}.`
          : "Don't get discouraged! Use the explanations as learning opportunities and try again after reviewing the material."
      };
    }
  };

  const feedback = getFeedbackMessage();

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-crimson font-bold text-center text-gray-900 mb-6">Session Summary</h2>
      
      <div className="flex flex-col items-center mb-8">
        <RadialProgress percentage={percentage} />
        <div className="mt-4 space-y-2 text-center">
          <p className="text-lg font-geist font-medium text-gray-900">
            {correctAnswers} out of {attemptedQuestions} correct
          </p>
          {skippedQuestions > 0 && (
            <p className="text-sm font-geist text-gray-600">
              {skippedQuestions} question{skippedQuestions > 1 ? 's' : ''} skipped
            </p>
          )}
        </div>
      </div>

      <div className="text-center mb-8">
        <h3 className="text-xl font-crimson font-semibold mb-2 text-gray-900">
          {feedback.title}
        </h3>
        <p className="font-geist text-gray-600">
          {feedback.message}
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-crimson font-semibold mb-4 text-gray-900">
          Category Breakdown
        </h3>
        <div className="space-y-4">
          {sortedCategories.map(category => (
            <div key={category.name} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-geist font-medium text-gray-900">{category.name}</h4>
                <span className="text-sm font-geist text-gray-500">
                  {category.total} question{category.total !== 1 ? 's' : ''}
                </span>
              </div>
              <ProgressBar
                correct={category.correct}
                incorrect={category.incorrect}
                skipped={category.skipped}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onRestart}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-geist"
        >
          Start New Session
        </button>
      </div>
    </div>
  );
} 