export interface Lesson {
  slug: string;
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  imageHint?: string;
}

export interface Article {
  slug: string;
  title:string;
  description: string;
  content: string;
  imageUrl?: string;
  imageHint?: string;
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

export interface OlympiadQuestion {
  slug: string;
  title: string;
  description: string;
  problemStatement: string;
  solution: string;
  difficulty: 'متوسط' | 'صعب' | 'صعب جداً';
  tags: string[];
}
