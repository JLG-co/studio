import ExerciseClientPage from './ExerciseClientPage';
import { exerciseSets } from '@/lib/data';

type ExercisePageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  return exerciseSets.map((exercise) => ({
    slug: exercise.slug,
  }));
}

const ExercisePage = ({ params }: ExercisePageProps) => {
  // The ExerciseClientPage is already marked with 'use client',
  // so Next.js knows to treat it as a client boundary.
  return <ExerciseClientPage />;
};

export default ExercisePage;
