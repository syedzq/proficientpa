export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // Index of the correct answer in options array
  explanation: string;
  topic: Topic;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export interface Topic {
  id: string;
  name: string;
  category: Category;
  subtopics?: string[];
}

export interface Category {
  id: string;
  name: string; // e.g., "Cardiology", "Pulmonology", etc.
  description: string;
}

// Sample question type for daily practice
export interface DailyQuestion extends Question {
  date: string;
  attempted?: boolean;
  userAnswer?: number;
  isCorrect?: boolean;
} 