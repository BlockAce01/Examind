'use client';

import React, { useEffect } from 'react'; 
import TeacherSidebar from '@/components/teacher/TeacherSidebar';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

export default function TeacherLayout({ children }: { children: React.ReactNode; }) {
    const { user, isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        console.log('--- TeacherLayout User State Updated ---');
        console.log('User object:', JSON.stringify(user, null, 2));
    }, [user]); // log whenever the user object itself changes


    console.log('--- TeacherLayout Render Check ---');
    console.log('isLoading:', isLoading);
    console.log('isAuthenticated:', isAuthenticated);
    console.log('User object from context (at render):', JSON.stringify(user, null, 2));

    if (isLoading) {
        console.log('[TeacherLayout] Rendering Spinner (isLoading is true)');
        return (
             <div className="flex items-center justify-center min-h-screen">
                 <Spinner size="lg" />
             </div>
        );
    }

    // determine teacher status
    const isTeacher = isAuthenticated && user?.role === 'teacher';

    // isTeacher
    console.log(`[TeacherLayout] Checking: isAuthenticated (${isAuthenticated}) && user?.role (${user?.role}) === 'teacher' --> isTeacher: ${isTeacher}`);

    if (!isTeacher) {
        console.log('[TeacherLayout] Rendering Access Denied');
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
                <p className="text-gray-700 mb-6">You do not have permission to view this page.</p>
                <p className="text-xs text-gray-500">Auth Status: {isAuthenticated ? 'Logged In' : 'Logged Out'}, Role Detected: "{user?.role ?? 'N/A'}"</p>
                <Link href={isAuthenticated ? "/dashboard" : "/login"} className='mt-4'>
                    <Button variant="primary">
                        {isAuthenticated ? "Go to Dashboard" : "Go to Login"}
                    </Button>
                </Link>
            </div>
        );
    }

    // render teacher layout if authorized
    console.log('[TeacherLayout] Rendering teacher Content');
    return (
        <div className="flex min-h-screen bg-gray-100">
            <TeacherSidebar />
            <main className="flex-1 p-6 md:p-10">
                {children}
            </main>
        </div>
    );
}
