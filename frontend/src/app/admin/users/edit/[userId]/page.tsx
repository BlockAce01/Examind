'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input'; 
import Spinner from '@/components/ui/Spinner';
import { useAuth } from '@/context/AuthContext';
import { type User } from '@/types/user'; 

//define roles & statuses 
const roles = ['student', 'teacher', 'admin'] as const;
type RoleType = typeof roles[number];
const statuses = ['free', 'premium', 'pending', 'cancelled'] as const; //example statuses
type StatusType = typeof statuses[number];

//define user type matching API response 
interface UserDetail {
    UserID: number;
    Name: string;
    Email: string;
    Role: RoleType;
    SubscriptionStatus: StatusType;
    //add other fields
}

export default function EditUserPage() {
    const router = useRouter();
    const params = useParams();
    const { token } = useAuth();
    const userId = params.userId as string;

    //form State
    const [userName, setUserName] = useState(''); //display only
    const [userEmail, setUserEmail] = useState(''); //display only
    const [role, setRole] = useState<RoleType | ''>('');
    const [subscriptionStatus, setSubscriptionStatus] = useState<StatusType | ''>('');

    //loading & error state
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    //fetch existing user data
    useEffect(() => {
        if (!userId || !token) {
            if (!token) setError("Authentication required.");
            setIsLoadingData(false);
            return;
        }
        const fetchUser = async () => {
            setIsLoadingData(true);
            setError(null);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const response = await fetch(`${apiUrl}/api/v1/users/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `User not found. Status: ${response.status}`);
                }
                const data = await response.json();
                if (data.status === 'success' && data.data?.user) {
                    const fetchedUser: UserDetail = data.data.user;
                    setUserName(fetchedUser.Name || '');
                    setUserEmail(fetchedUser.Email || '');
                    setRole(fetchedUser.Role || '');
                    setSubscriptionStatus(fetchedUser.SubscriptionStatus || '');
                } else {
                    throw new Error('Invalid user data format received.');
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchUser();
    }, [userId, token]);

    //handle form submission
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!token) return;

        setIsUpdating(true);
        setError(null);
        setFieldErrors({});

        //validation 
        if (!role) {
            setFieldErrors({ role: 'Role cannot be empty.' });
            setIsUpdating(false);
            return;
        }
         if (!subscriptionStatus) {
            setFieldErrors({ status: 'Subscription status cannot be empty.' });
            setIsUpdating(false);
            return;
         }

        //prepare payload 
        const updatedUserData = {
            Role: role, //matches backend expected -Role
            SubscriptionStatus: subscriptionStatus, //matches backend -SubscriptionStatus
        };

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/api/v1/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedUserData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }
            alert('User details updated successfully!');
            router.push('/admin/users');
        } catch (err: any) {
            setError(err.message || 'Failed to update user.');
        } finally {
            setIsUpdating(false);
        }
    };

     if (isLoadingData) { /*render spinner*/ }
     if (error && !userName) { /*render fetch error*/ }

    return (
        <div>
            <Link href="/admin/users" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
                ← Back to User Management
            </Link>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit User (ID: {userId})</h1>

            {/* form */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4">

                {/* display name & email */}
                <Input label="Name (Read Only)" id="name" name="name" value={userName} disabled />
                <Input label="Email (Read Only)" id="email" name="email" type="email" value={userEmail} disabled />

                {/*select for role*/}
                <div className="mb-3">
                    <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">Role</label>
                    <select
                        id="role" name="role" required
                        value={role} onChange={(e) => setRole(e.target.value as RoleType)}
                        disabled={isUpdating}
                        className={`shadow border ${fieldErrors.role ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 ${fieldErrors.role ? 'focus:ring-red-300' : 'focus:ring-blue-500'} focus:border-transparent bg-white`}
                        aria-describedby={fieldErrors.role ? `role-error` : undefined}
                    >
                        <option value="" disabled>Select role...</option>
                        {roles.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                    </select>
                     <div className="h-4 mt-1">
                        {fieldErrors.role && <p id="role-error" className="text-xs text-red-600">{fieldErrors.role}</p>}
                    </div>
                </div>

                 {/*select for subscription status*/}
                <div className="mb-3">
                    <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Subscription Status</label>
                    <select
                        id="status" name="status" required
                        value={subscriptionStatus} onChange={(e) => setSubscriptionStatus(e.target.value as StatusType)}
                        disabled={isUpdating}
                        className={`shadow border ${fieldErrors.status ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 ${fieldErrors.status ? 'focus:ring-red-300' : 'focus:ring-blue-500'} focus:border-transparent bg-white`}
                        aria-describedby={fieldErrors.status ? `status-error` : undefined}
                    >
                        <option value="" disabled>Select status...</option>
                        {statuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                    <div className="h-4 mt-1">
                        {fieldErrors.status && <p id="status-error" className="text-xs text-red-600">{fieldErrors.status}</p>}
                    </div>
                </div>


                {/*buttons*/}
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                    <Link href="/admin/users">
                        <Button type="button" variant="secondary" disabled={isUpdating}>Cancel</Button>
                    </Link>
                    <Button type="submit" variant="primary" disabled={isUpdating}>
                        {isUpdating ? <Spinner size="sm" className="mx-auto" /> : 'Update User'}
                    </Button>
                </div>
            </form>
        </div>
    );
}