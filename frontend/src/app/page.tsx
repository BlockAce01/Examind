// src/app/page.tsx
import Link from 'next/link';
import Button from '@/components/ui/Button'; // Import your Button component

export default function HomePage() {
  return (
    // Add some padding and center the content
    <div className="flex flex-col items-center justify-center text-center py-20">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        Welcome to Examind!
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
        The modern, gamified platform designed to help Sri Lankan students excel in their A/L exams.
        Engage with quizzes, resources, and discussions.
      </p>
      <div className="space-x-4">
        {/* Link to your Login page */}
        <Link href="/login">
          <Button variant="primary" size="lg"> {/* Assuming Button accepts size prop */}
            Login
          </Button>
        </Link>
         {/* Link to your Register page */}
        <Link href="/register">
          <Button variant="secondary" size="lg">
            Register
          </Button>
        </Link>
      </div>
      {/* You can add more sections here later - features, testimonials etc. */}
    </div>
  );
}