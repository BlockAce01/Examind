//examind-frontend\src\app\login\page.tsx
'use client'; // Needs to be client for state and handlers

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation'; // For redirection
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import Spinner from '@/components/ui/Spinner'; // Import Spinner

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth(); // Get login function from context

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null); // To display API errors
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default page reload
        setIsLoading(true);
        setError(null); // Clear previous errors

        try {
            // Get API URL from environment variable or use default
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

            const response = await fetch(`${apiUrl}/api/v1/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle API errors (e.g., invalid credentials, server errors)
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            // Call context login function on success
            login(data.user, data.token);

            // Redirect to dashboard
            router.push('/dashboard');

        } catch (err: any) {
            console.error("Login failed:", err);
            setError(err.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Login to Examind</h1>

                <form onSubmit={handleSubmit}>
                    {/* Display general form error */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <Input
                        label="Email Address"
                        id="email"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                    />

                    <Input
                        label="Password"
                        id="password"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        // Pass potential field-specific errors later if API provides them
                        // error={fieldErrors?.password}
                    />

                    <div className="mt-6">
                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            disabled={isLoading} // Disable button while loading
                        >
                            {isLoading ? <Spinner size="sm" className="mx-auto" /> : 'Login'}
                        </Button>
                    </div>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-blue-600 hover:underline font-medium">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}