'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import Spinner from '@/components/ui/Spinner';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const RegisterSchema = Yup.object().shape({
    name: Yup.string()
        .required('Full Name is required.'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email address is required.'),
    password: Yup.string()
        .required('Password is required.')
        .min(6, 'Password must be at least 6 characters.'), // Example minimum length
    confirmPassword: Yup.string()
        .required('Confirm Password is required.')
        .oneOf([Yup.ref('password')], 'Passwords must match'),
    role: Yup.string()
        .oneOf(['student', 'teacher'], 'Please select a valid role.')
        .required('Please select a role.'),
    subject1: Yup.string().when('role', (role: any, schema: any) => {
        return role[0] === 'student' ? schema.required('Please select your first subject.') : schema;
    }),
    subject2: Yup.string().when('role', (role: any, schema: any) => {
        return role[0] === 'student' ? schema.required('Please select your second subject.') : schema;
    }),
    subject3: Yup.string().when('role', (role: any, schema: any) => {
        return role[0] === 'student' ? schema.required('Please select your third subject.') : schema;
    }),
    teacherSubject: Yup.string().when('role', (role: any, schema: any) => {
        return role[0] === 'teacher' ? schema.required('Please select a subject.') : schema;
    }),
});

export default function RegisterPage() {
    const router = useRouter();

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [subjects, setSubjects] = useState<{ SubjectID: number; Name: string }[]>([]);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const response = await fetch(`${apiUrl}/api/v1/subjects`);
                const data = await response.json();
                if (response.ok) {
                    setSubjects(data);
                }
            } catch (error) {
                console.error('Failed to fetch subjects:', error);
            }
        };
        fetchSubjects();
    }, []);

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: '',
            subject1: '',
            subject2: '',
            subject3: '',
            teacherSubject: '',
        },
        validationSchema: RegisterSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            setError(null);
            setSuccessMessage(null);

            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const response = await fetch(`${apiUrl}/api/v1/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: values.name,
                        email: values.email,
                        password: values.password,
                        role: values.role,
                        subjects: values.role === 'student' ? [values.subject1, values.subject2, values.subject3] : [values.teacherSubject],
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || `HTTP error! status: ${response.status}`);
                }

                setSuccessMessage('Registration successful! You can now log in.');

                // Clear form after successful submission
                formik.resetForm();

                setTimeout(() => {
                    router.push('/login');
                }, 2000); // Redirect after 2 seconds

            } catch (err: any) {
                console.error("Registration failed:", err);
                setError(err.message || 'An unexpected error occurred. Please try again.');
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-8">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Your Account</h1>

                <form onSubmit={formik.handleSubmit}>
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

                    <Input
                        label="Full Name"
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Your Full Name"
                        required
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={isLoading}
                        error={formik.touched.name && formik.errors.name ? formik.errors.name : undefined}
                    />
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
                        placeholder="Choose a strong password"
                        required
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={isLoading}
                        error={formik.touched.password && formik.errors.password ? formik.errors.password : undefined}
                    />
                    <Input
                        label="Confirm Password"
                        id="confirmPassword"
                        type="password"
                        name="confirmPassword"
                        placeholder="Re-enter your password"
                        required
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={isLoading}
                        error={formik.touched.confirmPassword && formik.errors.confirmPassword ? formik.errors.confirmPassword : undefined}
                    />

                    {/* Role Selection */}
                     <div className="mb-3"> {/* Reduced margin like Input */}
                        <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">Register As</label>
                        <select
                            id="role"
                            name="role"
                            required
                            value={formik.values.role}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            disabled={isLoading}
                            className={`shadow border ${formik.touched.role && formik.errors.role ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 ${formik.touched.role && formik.errors.role ? 'focus:ring-red-300' : 'focus:ring-blue-500'} focus:border-transparent bg-white`}
                            aria-describedby={formik.touched.role && formik.errors.role ? `role-error` : undefined}
                        >
                            <option value="" disabled>Select your role</option>
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                        </select>
                         {/* Placeholder for error message */}
                         <div className="h-4 mt-1">
                            {formik.touched.role && formik.errors.role && (
                                <p id="role-error" className="text-xs text-red-600">
                                    {formik.errors.role}
                                </p>
                            )}
                        </div>
                    </div>

                    {formik.values.role === 'student' && (
                        <>
                            <div className="mb-3">
                                <label htmlFor="subject1" className="block text-gray-700 text-sm font-bold mb-2">Subject 1</label>
                                <select
                                    id="subject1"
                                    name="subject1"
                                    required
                                    value={formik.values.subject1}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    disabled={isLoading}
                                    className={`shadow border ${formik.touched.subject1 && formik.errors.subject1 ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 ${formik.touched.subject1 && formik.errors.subject1 ? 'focus:ring-red-300' : 'focus:ring-blue-500'} focus:border-transparent bg-white`}
                                >
                                    <option value="" disabled>Select Subject 1</option>
                                    {subjects.map(subject => (
                                        <option key={subject.SubjectID} value={subject.SubjectID}>{subject.Name}</option>
                                    ))}
                                </select>
                                <div className="h-4 mt-1">
                                    {formik.touched.subject1 && formik.errors.subject1 && (
                                        <p className="text-xs text-red-600">
                                            {formik.errors.subject1}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {formik.values.subject1 && (
                                <div className="mb-3">
                                    <label htmlFor="subject2" className="block text-gray-700 text-sm font-bold mb-2">Subject 2</label>
                                    <select
                                        id="subject2"
                                        name="subject2"
                                        required
                                        value={formik.values.subject2}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled={isLoading}
                                        className={`shadow border ${formik.touched.subject2 && formik.errors.subject2 ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 ${formik.touched.subject2 && formik.errors.subject2 ? 'focus:ring-red-300' : 'focus:ring-blue-500'} focus:border-transparent bg-white`}
                                    >
                                        <option value="" disabled>Select Subject 2</option>
                                        {subjects.filter(subject => subject.SubjectID.toString() !== formik.values.subject1).map(subject => (
                                            <option key={subject.SubjectID} value={subject.SubjectID}>{subject.Name}</option>
                                        ))}
                                    </select>
                                    <div className="h-4 mt-1">
                                        {formik.touched.subject2 && formik.errors.subject2 && (
                                            <p className="text-xs text-red-600">
                                                {formik.errors.subject2}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {formik.values.subject2 && (
                                <div className="mb-3">
                                    <label htmlFor="subject3" className="block text-gray-700 text-sm font-bold mb-2">Subject 3</label>
                                    <select
                                        id="subject3"
                                        name="subject3"
                                        required
                                        value={formik.values.subject3}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled={isLoading}
                                        className={`shadow border ${formik.touched.subject3 && formik.errors.subject3 ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 ${formik.touched.subject3 && formik.errors.subject3 ? 'focus:ring-red-300' : 'focus:ring-blue-500'} focus:border-transparent bg-white`}
                                    >
                                        <option value="" disabled>Select Subject 3</option>
                                        {subjects.filter(subject => subject.SubjectID.toString() !== formik.values.subject1 && subject.SubjectID.toString() !== formik.values.subject2).map(subject => (
                                            <option key={subject.SubjectID} value={subject.SubjectID}>{subject.Name}</option>
                                        ))}
                                    </select>
                                    <div className="h-4 mt-1">
                                        {formik.touched.subject3 && formik.errors.subject3 && (
                                            <p className="text-xs text-red-600">
                                                {formik.errors.subject3}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {formik.values.role === 'teacher' && (
                        <div className="mb-3">
                            <label htmlFor="teacherSubject" className="block text-gray-700 text-sm font-bold mb-2">Subject</label>
                            <select
                                id="teacherSubject"
                                name="teacherSubject"
                                required
                                value={formik.values.teacherSubject}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={isLoading}
                                className={`shadow border ${formik.touched.teacherSubject && formik.errors.teacherSubject ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 ${formik.touched.teacherSubject && formik.errors.teacherSubject ? 'focus:ring-red-300' : 'focus:ring-blue-500'} focus:border-transparent bg-white`}
                            >
                                <option value="" disabled>Select a Subject</option>
                                {subjects.map(subject => (
                                    <option key={subject.SubjectID} value={subject.SubjectID}>{subject.Name}</option>
                                ))}
                            </select>
                            <div className="h-4 mt-1">
                                {formik.touched.teacherSubject && formik.errors.teacherSubject && (
                                    <p className="text-xs text-red-600">
                                        {formik.errors.teacherSubject}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}


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
