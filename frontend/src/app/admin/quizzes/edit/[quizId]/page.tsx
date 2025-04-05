// src/app/admin/quizzes/edit/[quizId]/page.tsx
'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import { useAuth } from '@/context/AuthContext';
// Use the detailed Quiz type which might include questions, even if not edited here
import { type QuizDetail } from '@/types/quiz';

const difficultyLevels = ['Easy', 'Medium', 'Hard'] as const;
type DifficultyLevelType = typeof difficultyLevels[number];

export default function EditQuizPage() {
    const router = useRouter();
    const params = useParams();
    const { token } = useAuth();
    const quizId = params.quizId as string;

    // Form State
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevelType | ''>('');
    const [timeLimit, setTimeLimit] = useState<number | ''>('');
    // State to hold fetched questions (display only for now)
    const [questions, setQuestions] = useState<any[]>([]); // Use specific Question type if defined

    // Loading and Error State
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    // --- Fetch Existing Quiz Data (including questions) ---
    useEffect(() => {
        if (!quizId || !token) {
            if (!token) setError("Authentication required.");
            setIsLoadingData(false);
            return;
        }

        const fetchQuiz = async () => {
            setIsLoadingData(true);
            setError(null);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                // Fetch the detailed quiz data including questions
                const response = await fetch(`${apiUrl}/api/v1/quizzes/${quizId}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `Quiz not found or permission denied. Status: ${response.status}`);
                }
                const data = await response.json();

                if (data.status === 'success' && data.data?.quiz) {
                    const fetchedQuiz: QuizDetail = data.data.quiz; // Use detailed type
                    // Populate form state
                    setTitle(fetchedQuiz.Title || '');
                    setSubject(fetchedQuiz.Subject || '');
                    setDifficultyLevel(fetchedQuiz.DifficultyLevel || '');
                    setTimeLimit(fetchedQuiz.TimeLimit ?? '');
                    setQuestions(fetchedQuiz.questions || []); // Store fetched questions
                } else {
                    throw new Error('Invalid data format received from API.');
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchQuiz();
    }, [quizId, token]);

    // --- Handle Form Submission (Update Quiz Details) ---
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!token) return; // Should be handled by initial check/redirect

        setIsUpdating(true);
        setError(null);
        setFieldErrors({});

        // Validation
        let currentErrors: { [key: string]: string } = {};
        if (!title.trim()) currentErrors.title = 'Title is required.';
        if (!subject.trim()) currentErrors.subject = 'Subject is required.';
        if (!difficultyLevel) currentErrors.difficulty = 'Difficulty level is required.';
        if (timeLimit === '' || timeLimit <= 0) currentErrors.timeLimit = 'Valid time limit is required.';

        if (Object.keys(currentErrors).length > 0) {
            setFieldErrors(currentErrors);
            setIsUpdating(false);
            return;
        }

        // Prepare payload - Use correct casing matching backend controller
        const updatedQuizData = {
            Title: title,
            Subject: subject,
            DifficultyLevel: difficultyLevel,
            TimeLimit: timeLimit,
        };

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/api/v1/quizzes/${quizId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedQuizData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }
            alert('Quiz details updated successfully!');
            router.push('/admin/quizzes');
        } catch (err: any) {
            setError(err.message || 'Failed to update quiz details.');
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoadingData) { /* ... render spinner ... */ }
    if (error && !title) { /* ... render fetch error ... */ }

    return (
        <div>
            <Link href="/admin/quizzes" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
                ← Back to Quiz Management
            </Link>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Quiz (ID: {quizId})</h1>

            {/* --- Edit Quiz Details Form --- */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4 mb-8">
                <h2 className="text-lg font-semibold border-b pb-2 mb-4">Quiz Details</h2>
                {error && ( /* Display submit error */
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                        {error}
                    </div>
                )}
                <Input label="Title" id="title" name="title" required value={title} onChange={(e) => setTitle(e.target.value)} disabled={isUpdating} error={fieldErrors.title} />
                <Input label="Subject" id="subject" name="subject" required value={subject} onChange={(e) => setSubject(e.target.value)} disabled={isUpdating} error={fieldErrors.subject} />
                {/* Select for Difficulty Level */}
                <div className="mb-3">
                    <label htmlFor="difficultyLevel" className="block text-gray-700 text-sm font-bold mb-2">Difficulty Level</label>
                    <select
                        id="difficultyLevel" name="difficultyLevel" required
                        value={difficultyLevel} onChange={(e) => setDifficultyLevel(e.target.value as DifficultyLevelType)}
                        disabled={isUpdating}
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
                 <Input label="Time Limit (minutes)" id="timeLimit" name="timeLimit" type="number" required value={timeLimit} onChange={(e) => setTimeLimit(e.target.value === '' ? '' : parseInt(e.target.value, 10))} disabled={isUpdating} error={fieldErrors.timeLimit} />

                {/* Submit/Cancel Buttons for Quiz Details */}
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                    <Link href="/admin/quizzes">
                        <Button type="button" variant="secondary" disabled={isUpdating}>Cancel</Button>
                    </Link>
                    <Button type="submit" variant="primary" disabled={isUpdating}>
                        {isUpdating ? <Spinner size="sm" className="mx-auto" /> : 'Update Quiz Details'}
                    </Button>
                </div>
            </form>

            {/* --- Manage Questions Section (Placeholder) --- */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4">
                 <h2 className="text-lg font-semibold border-b pb-2 mb-4">Manage Questions ({questions.length})</h2>
                 <p className="text-sm text-gray-500">
                     (Question management UI needs to be built here. This would involve displaying existing questions,
                     providing forms to add new questions, edit existing ones, and delete questions, along with separate API calls.)
                 </p>
                 {/* Example: List existing questions */}
                 {questions.length > 0 && (
                     <ul className="space-y-2 text-sm">
                         {questions.map((q, index) => (
                             <li key={q.QuestionID || index} className="p-2 border rounded bg-gray-50">
                                 {index + 1}. {q.Text} {/* Adjust property casing if needed */}
                                 {/* Add Edit/Delete buttons here later */}
                             </li>
                         ))}
                     </ul>
                 )}
                 {/* Button to trigger adding a new question form/modal */}
                  <div className="text-right">
                      <Button type="button" variant='secondary' > + Add Question</Button>
                  </div>
            </div>
        </div>
    );
}