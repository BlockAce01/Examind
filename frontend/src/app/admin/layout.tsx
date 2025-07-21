'use client';

import React, { useEffect, useState, useRef } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAuth } from '@/context/AuthContext';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { Bars3Icon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

export default function AdminLayout({ children }: { children: React.ReactNode; }) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(sidebarRef as React.RefObject<HTMLElement>, () => {
        if (isSidebarOpen) {
            setSidebarOpen(false);
        }
    });

    useEffect(() => {
        console.log('--- AdminLayout User State Updated ---');
        console.log('User object:', JSON.stringify(user, null, 2));
    }, [user]); // log whenever the user object itself changes


    console.log('--- AdminLayout Render Check ---');
    console.log('isLoading:', isLoading);
    console.log('isAuthenticated:', isAuthenticated);
    console.log('User object from context (at render):', JSON.stringify(user, null, 2));

    if (isLoading) {
        console.log('[AdminLayout] Rendering Spinner (isLoading is true)');
        return (
             <div className="flex items-center justify-center min-h-screen">
                 <Spinner size="lg" />
             </div>
        );
    }

    // determine admin status
    const isAdmin = isAuthenticated && user?.Role === 'admin';

    // isAdmin
    console.log(`[AdminLayout] Checking: isAuthenticated (${isAuthenticated}) && user?.Role (${user?.Role}) === 'admin' --> isAdmin: ${isAdmin}`);

    if (!isAdmin) {
        console.log('[AdminLayout] Rendering Access Denied');
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
                <p className="text-gray-700 mb-6">You do not have permission to view this page.</p>
                <p className="text-xs text-gray-500">Auth Status: {isAuthenticated ? 'Logged In' : 'Logged Out'}, Role Detected: "{user?.Role ?? 'N/A'}"</p>
                <Link href={isAuthenticated ? "/dashboard" : "/login"} className='mt-4'>
                    <Button variant="primary">
                        {isAuthenticated ? "Go to Dashboard" : "Go to Login"}
                    </Button>
                </Link>
            </div>
        );
    }

    // render admin layout if authorized
    console.log('[AdminLayout] Rendering admin Content');
    return (
        <div className="flex min-h-screen bg-gray-100">
            <div ref={sidebarRef} className={`fixed top-0 left-0 z-40 w-64 h-screen bg-gray-800 text-gray-300 flex-col min-h-screen transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
            </div>
            <main className="flex-1 p-6 md:p-10 lg:ml-64">
                <div className="lg:hidden mb-4">
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} title="Open sidebar">
                        <Bars3Icon className="w-6 h-6" />
                    </button>
                </div>
                {children}
            </main>
        </div>
    );
}
