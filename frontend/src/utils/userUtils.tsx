export const formatUserName = (user: { Name: string; Role: string } | null | undefined): string => {
  if (!user) {
    return 'Unknown User';
  }
  if (user.Role === 'admin') {
    return 'Admin';
  }
  return user.Name; // Return the user's name for other roles
};
