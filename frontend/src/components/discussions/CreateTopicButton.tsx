'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation'; 

const CreateTopicButton = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter(); 

  const handleClick = () => {
    // go to the create new topic page
    router.push('/discussions/new');
  };

  return isAuthenticated ? (
    <Button variant="primary" onClick={handleClick}>
      + Create New Topic
    </Button>
  ) : null;
};

export default CreateTopicButton;
