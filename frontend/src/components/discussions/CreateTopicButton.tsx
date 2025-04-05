// src/components/discussions/CreateTopicButton.tsx
'use client'; // <-- Make this a Client Component

import React from 'react';
import Button from '@/components/ui/Button'; // Import your reusable Button

const CreateTopicButton = () => {
  // Now onClick is allowed because this runs on the client
  const handleClick = () => {
    // You can add more complex logic here later, like opening a modal
    alert('New Topic form would open here.');
  };

  return (
    <Button variant="primary" onClick={handleClick}>
      + Create New Topic
    </Button>
  );
};

export default CreateTopicButton;