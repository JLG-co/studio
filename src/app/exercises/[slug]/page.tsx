import dynamic from 'next/dynamic';
import { exerciseSets } from '@/lib/data';

// Dynamically import the client component and disable SSR
const ExerciseClientPage = dynamic(() => import('./ExerciseClientPage'), {
  ssr: false,
});

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
  return <ExerciseClientPage />;
};

export default ExercisePage;
