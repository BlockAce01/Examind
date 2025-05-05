'use client';

import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Spinner from '@/components/ui/Spinner';

type AllowedRole = 'admin' | 'teacher' | 'student';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: AllowedRole[]; //optional array of allowed roles
  redirectPath?: string; //optional custom redirect path if not authorized
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectPath = '/login', //default redirect if not authenticated
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    // 1.check is authenticated
    if (!isAuthenticated) {
      console.log('[ProtectedRoute] Not authenticated, redirecting to', redirectPath);
      router.push(redirectPath);
      return;
    }

    // 2.check role if allowedRoles is provided and not empty
    if (allowedRoles && allowedRoles.length > 0) {
      const userRole = user?.role;
      if (!userRole || !allowedRoles.includes(userRole)) {
        console.log(`[ProtectedRoute] Role mismatch. Allowed: ${allowedRoles.join(', ')}, User has: ${userRole}. Redirecting.`);
        //redirect unauthorized users
        router.push('/dashboard'); //redirect to 'unauthorized' page
        return;
      }
    }

    //if authenticated and authorized, allow access
    console.log('[ProtectedRoute] Access granted.');

  }, 
  [isLoading, isAuthenticated, user, allowedRoles, router, redirectPath]); //update dependency array

  //render loading state or null while checking
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
  }

  //determine if the user meets role requirements *before* rendering children
  const meetsRoleRequirements = !allowedRoles || allowedRoles.length === 0 || (user?.role && allowedRoles.includes(user.role));

  //if not authenticated doesn't meet role requirements, show spinner while redirecting
  if (!isAuthenticated || !meetsRoleRequirements) {
      //while redirecting, render null or a minimal loading state
      //this prevents flashing the protected content before redirect occurs
      return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
  }

  //if authenticated and meets role requirements, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
