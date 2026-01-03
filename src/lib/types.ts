export interface Lesson {
  slug: string;
  title: string;
  description: string;
  content: string;
}

export interface Article {
  slug: string;
  title:string;
  description: string;
  content: string;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface ExerciseSet {
  slug: string;
  title: string;
  description: string;
  lessonSlug: string;
  questions: Question[];
}
