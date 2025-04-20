// src/app/register/page.tsx
'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import Spinner from '@/components/ui/Spinner';

export default function RegisterPage() {
    const router = useRouter();

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<'student' | 'teacher' | ''>(''); // Initialize role state
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({}); // For field-specific errors
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setFieldErrors({});
        setSuccessMessage(null);

        // Frontend Validation
        if (password !== confirmPassword) {
            setFieldErrors({ confirmPassword: 'Passwords do not match' });
            return;
        }
         if (!role) {
             setFieldErrors({ role: 'Please select a role' });
             return;
         }
        // Add more validation (e.g., password strength) here

        setIsLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/api/v1/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role }),
            });

            const data = await response.json();

            if (!response.ok) {
                 // Handle potential field-specific errors if API provides them
                 // Or just use the general message
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            // Show success message and maybe redirect to login after a delay
            setSuccessMessage('Registration successful! You can now log in.');
            // Clear form?
            setName(''); setEmail(''); setPassword(''); setConfirmPassword(''); setRole('');
            // Optional: Redirect after delay
            setTimeout(() => {
                router.push('/login');
            }, 2000); // Redirect after 2 seconds

        } catch (err: any) {
            console.error("Registration failed:", err);
            setError(err.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-8">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Your Account</h1>

                <form onSubmit={handleSubmit}>
                    {/* Display general form error */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                            {error}
                        </div>
                    )}
                    {/* Display success message */}
                    {successMessage && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
                            {successMessage}
                        </div>
                    )}

                    <Input label="Full Name" id="name" type="text" name="name" placeholder="Your Full Name" required value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
                    <Input label="Email Address" id="email" type="email" name="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
                    <Input label="Password" id="password" type="password" name="password" placeholder="Choose a strong password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
                    <Input label="Confirm Password" id="confirmPassword" type="password" name="confirmPassword" placeholder="Re-enter your password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} error={fieldErrors.confirmPassword} />

                    {/* Role Selection */}
                     <div className="mb-3"> {/* Reduced margin like Input */}
                        <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">Register As</label>
                        <select
                            id="role"
                            name="role"
                            required
                            value={role}
                            onChange={(e) => setRole(e.target.value as 'student' | 'teacher')}
                            disabled={isLoading}
                            className={`shadow border ${fieldErrors.role ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 ${fieldErrors.role ? 'focus:ring-red-300' : 'focus:ring-blue-500'} focus:border-transparent bg-white`}
                            aria-describedby={fieldErrors.role ? `role-error` : undefined}
                        >
                            <option value="" disabled>Select your role</option>
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                        </select>
                         {/* Placeholder for error message */}
                         <div className="h-4 mt-1">
                            {fieldErrors.role && (
                                <p id="role-error" className="text-xs text-red-600">
                                    {fieldErrors.role}
                                </p>
                            )}
                        </div>
                    </div>


                    <div className="mt-6">
                        <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
                           {isLoading ? <Spinner size="sm" className="mx-auto" /> : 'Register'}
                        </Button>
                    </div>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-600 hover:underline font-medium">Login here</Link>
                </p>
            </div>
        </div>
    );
}