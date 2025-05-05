'use client';

import React from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Button from '@/components/ui/Button';

export default function CreateQuizPageWrapper() { 
  return (
    //allowing only admin and teacher roles
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <CreateQuizPageContent />
    </ProtectedRoute>
  );
}

//original page content moved to this component
function CreateQuizPageContent() {
  return (
    <div>
       <div className="mb-4">
           <Link href="/quizzes" className="text-sm text-blue-600 hover:underline">
               ← Back to Quizzes
           </Link>
       </div>
      <h1 className="text-3xl font-bold mb-6">Create New Quiz</h1>
      <p className="text-gray-600 mb-4">
        Build a new quiz for students. Add questions, set options, and define the correct answers.
      </p>
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <p className="text-gray-500 italic">Quiz creation form components will be added here...</p>
      </div>
    </div>
  );
}
