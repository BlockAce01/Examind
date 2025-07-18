'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Spinner from '@/components/ui/Spinner';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email address is required.'),
    password: Yup.string()
        .required('Password is required.'),
});

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth(); // get login function from context

    // loading and error state for API call
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: LoginSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            setError(null);

            try {
                // get API URL from environment variable or use default
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

                const response = await fetch(`${apiUrl}/api/v1/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });

                const data = await response.json();

                if (!response.ok) {
                    // handle API errors
                    throw new Error(data.message || `HTTP error! status: ${response.status}`);
                }

                // call context login function on success
                login(data.user, data.token);

                // redirect based on user role
                if (data.user?.role === 'admin') {
                    router.push('/admin');
                } else if (data.user?.role === 'teacher') {
                    router.push('/teacher');
                } else {
                    router.push('/dashboard');
                }

            } catch (err: any) {
                console.error("Login failed:", err);
                setError(err.message || 'An unexpected error occurred. Please try again.');
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Login to Examind</h1>

                <form onSubmit={formik.handleSubmit}>
                    {/* display general form error */}
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
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={isLoading}
                        error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
                    />

                    <Input
                        label="Password"
                        id="password"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        required
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={isLoading}
                        error={formik.touched.password && formik.errors.password ? formik.errors.password : undefined}
                    />

                    <div className="mt-6">
                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            disabled={isLoading} // disable button while loading
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