'use client';

import React from 'react';
import DiscussionForm from '@/components/discussions/DiscussionForm';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

export default function CreateDiscussionPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <DiscussionForm />
    </ProtectedRoute>
  );
}
