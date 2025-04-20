// src/app/admin/quizzes/new/page.tsx
'use client';

import React, { useState, FormEvent } from 'react'; // Import useState, FormEvent
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input'; // Import Input
import Spinner from '@/components/ui/Spinner'; // Import Spinner
import { useAuth } from '@/context/AuthContext'; // Import useAuth

// Define difficulty levels again or import from a shared location
const difficultyLevels = ['Easy', 'Medium', 'Hard'] as const;
type DifficultyLevelType = typeof difficultyLevels[number];

export default function AddQuizPage() {
    const router = useRouter();
    const { token } = useAuth();

    // Form State
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevelType | ''>('');
    const [timeLimit, setTimeLimit] = useState<number | ''>('');

    // Loading and Error State
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    // Handle Form Submission
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!token) {
            setError("Authentication required.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setFieldErrors({});

        // Validation
        let currentErrors: { [key: string]: string } = {};
        if (!title.trim()) currentErrors.title = 'Title is required.';
        if (!subject.trim()) currentErrors.subject = 'Subject is required.';
        if (!difficultyLevel) currentErrors.difficulty = 'Difficulty level is required.';
        if (timeLimit === '' || timeLimit <= 0) currentErrors.timeLimit = 'Valid time limit (minutes) is required.';

        if (Object.keys(currentErrors).length > 0) {
            setFieldErrors(currentErrors);
            setIsLoading(false);
            return;
        }

        // Prepare payload matching backend controller keys
        const quizData = {
            Title: title,
            Subject: subject,
            DifficultyLevel: difficultyLevel,
            TimeLimit: timeLimit,
        };

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/api/v1/quizzes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(quizData),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            alert('Quiz created successfully!'); // Replace with toast notification
            // Redirect or maybe go to edit page to add questions? For now, back to list.
            router.push('/admin/quizzes');

        } catch (err: any) {
            setError(err.message || 'Failed to create quiz.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Link href="/admin/quizzes" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
                ← Back to Quiz Management
            </Link>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Add New Quiz</h1>

            {/* Form connected to handleSubmit */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4">
                 {error && ( /* Display general submit error */
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                        {error}
                    </div>
                )}

                <Input label="Title" id="title" name="title" required value={title} onChange={(e) => setTitle(e.target.value)} disabled={isLoading} error={fieldErrors.title} />
                <Input label="Subject" id="subject" name="subject" required value={subject} onChange={(e) => setSubject(e.target.value)} disabled={isLoading} error={fieldErrors.subject} />

                {/* Select for Difficulty Level */}
                <div className="mb-3">
                    <label htmlFor="difficultyLevel" className="block text-gray-700 text-sm font-bold mb-2">Difficulty Level</label>
                    <select
                        id="difficultyLevel" name="difficultyLevel" required
                        value={difficultyLevel} onChange={(e) => setDifficultyLevel(e.target.value as DifficultyLevelType)}
                        disabled={isLoading}
                        className={`shadow border ${fieldErrors.difficulty ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 ${fieldErrors.difficulty ? 'focus:ring-red-300' : 'focus:ring-blue-500'} focus:border-transparent bg-white`}
                        aria-describedby={fieldErrors.difficulty ? `difficulty-error` : undefined}
                    >
                        <option value="" disabled>Select difficulty...</option>
                        {difficultyLevels.map(level => <option key={level} value={level}>{level}</option>)}
                    </select>
                     <div className="h-4 mt-1">
                        {fieldErrors.difficulty && <p id="difficulty-error" className="text-xs text-red-600">{fieldErrors.difficulty}</p>}
                    </div>
                </div>

                <Input label="Time Limit (minutes)" id="timeLimit" name="timeLimit" type="number" required value={timeLimit} onChange={(e) => setTimeLimit(e.target.value === '' ? '' : parseInt(e.target.value, 10))} disabled={isLoading} error={fieldErrors.timeLimit} />

                {/* Placeholder for adding questions UI */}
                 <div className="pt-4 border-t border-gray-200">
                     <h3 className="text-lg font-semibold mb-2">Questions</h3>
                     <p className="text-sm text-gray-500">
                         (Add questions after saving the quiz details, or implement question management UI here.)
                     </p>
                 </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                    <Link href="/admin/quizzes">
                        <Button type="button" variant="secondary" disabled={isLoading}>Cancel</Button>
                    </Link>
                    <Button type="submit" variant="primary" disabled={isLoading}>
                         {isLoading ? <Spinner size="sm" className="mx-auto" /> : 'Save Quiz Details'}
                    </Button>
                </div>
            </form>
        </div>
    );
}