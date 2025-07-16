'use client';

import React from 'react';
import DiscussionForm from '@/components/discussions/DiscussionForm';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function CreateDiscussionPage() {
  return (
    <ProtectedRoute>
      <DiscussionForm />
    </ProtectedRoute>
  );
}
