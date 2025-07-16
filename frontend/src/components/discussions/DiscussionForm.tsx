'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import { useAuth } from '@/context/AuthContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const DiscussionSchema = Yup.object().shape({
    topic: Yup.string()
        .trim()
        .required('Topic title is required.'),
    description: Yup.string().optional(),
    subjectId: Yup.number().required('Subject is required.'),
});

interface Subject {
    SubjectID: number;
    Name: string;
}

export default function DiscussionForm() {
    const router = useRouter();
    const { token } = useAuth();
    const [subjects, setSubjects] = useState<Subject[]>([]);

    // loading and error state for API call
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const response = await fetch(`${apiUrl}/api/v1/subjects`);
                if (!response.ok) {
                    throw new Error('Failed to fetch subjects');
                }
                const data = await response.json();
                setSubjects(data);
            } catch (error: any) {
                setError(error.message);
            }
        };

        fetchSubjects();
    }, []);

    const formik = useFormik({
        initialValues: {
            topic: '',
            description: '',
            subjectId: '',
        },
        validationSchema: DiscussionSchema,
        onSubmit: async (values) => {
            if (!token) {
                setError("Authentication required.");
                return;
            }
            setIsLoading(true);
            setError(null);

            // prepare payload matching backend controller keys
            const forumData = {
                Topic: values.topic,
                Description: values.description || null,
                SubjectID: values.subjectId,
            };

            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const response = await fetch(`${apiUrl}/api/v1/discussions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(forumData),
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || `HTTP error! status: ${response.status}`);
                }
                alert('Forum topic created successfully!');
                router.push('/discussions');
            } catch (err: any) {
                setError(err.message || 'Failed to create forum topic.');
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <div>
            <Link href="/discussions" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
                Back to Discussion Forums
            </Link>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Add New Forum Topic</h1>

            <form onSubmit={formik.handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4">
                 {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                        {error}
                    </div>
                 )}

                <Input
                    label="Topic Title"
                    id="topic"
                    name="topic"
                    required
                    value={formik.values.topic}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isLoading}
                    error={formik.touched.topic && formik.errors.topic ? formik.errors.topic : undefined}
                />

                <div className="mb-3">
                    <label htmlFor="subjectId" className="block text-gray-700 text-sm font-bold mb-2">Subject</label>
                    <select
                        id="subjectId"
                        name="subjectId"
                        value={formik.values.subjectId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        disabled={isLoading}
                        className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Select a subject</option>
                        {subjects.map((subject) => (
                            <option key={subject.SubjectID} value={subject.SubjectID}>
                                {subject.Name}
                            </option>
                        ))}
                    </select>
                    {formik.touched.subjectId && formik.errors.subjectId ? (
                        <p className="text-red-500 text-xs italic mt-1">{formik.errors.subjectId}</p>
                    ) : null}
                </div>

                 <div className="mb-3">
                     <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description (Optional)</label>
                     <textarea
                         id="description"
                         name="description"
                         rows={4}
                         value={formik.values.description}
                         onChange={formik.handleChange}
                         onBlur={formik.handleBlur}
                         disabled={isLoading}
                         className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     />
                      {formik.touched.description && formik.errors.description ? (
                        <p className="text-red-500 text-xs italic mt-1">{formik.errors.description}</p>
                    ) : null}
                 </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                    <Link href="/discussions">
                        <Button type="button" variant="secondary" disabled={isLoading}>Cancel</Button>
                    </Link>
                    <Button type="submit" variant="primary" disabled={isLoading}>
                        {isLoading ? <Spinner size="sm" className="mx-auto" /> : 'Save Topic'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
