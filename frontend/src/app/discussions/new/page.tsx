'use client';

import React from 'react';
import DiscussionForm from '@/components/discussions/DiscussionForm';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

export default function CreateDiscussionPage() {
  const { user } = useAuth();

  // Pass the subjectId as a prop to the DiscussionForm
  const defaultSubjectId = user?.role === 'teacher' ? user.subjectId : undefined;

  return (
    <ProtectedRoute>
      <DiscussionForm defaultSubjectId={defaultSubjectId} />
    </ProtectedRoute>
  );
}
