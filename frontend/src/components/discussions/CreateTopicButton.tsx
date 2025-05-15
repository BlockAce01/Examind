'use client'; 

import React from 'react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation'; // Import useRouter

const CreateTopicButton = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter(); // Initialize router

  const handleClick = () => {
    router.push('/discussions/new');
  };

  return isAuthenticated ? (
    <Button variant="primary" onClick={handleClick}>
      + Create New Topic
    </Button>
  ) : null;
};

export default CreateTopicButton;
