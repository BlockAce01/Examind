
'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import { useAuth } from '@/context/AuthContext';
import { type QuizDetail, type Question } from '@/types/quiz'; // use shared types
import QuestionForm from '@/components/admin/quiz/QuestionForm'; // import questionForm
import { PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

const difficultyLevels = ['Easy', 'Medium', 'Hard'] as const;
type DifficultyLevelType = typeof difficultyLevels[number];

export default function EditQuizPage() {
    const router = useRouter();
    const params = useParams();
    const { token } = useAuth();
    const quizId = params.quizId as string;
    const quizIdNum = parseInt(quizId, 10);

    // quiz Details Form
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevelType | ''>('');
    const [timeLimit, setTimeLimit] = useState<number | ''>('');
    const [isUpdatingQuiz, setIsUpdatingQuiz] = useState(false); // loading state for quiz detail update
    const [quizDetailError, setQuizDetailError] = useState<string | null>(null); 
    const [quizFieldErrors, setQuizFieldErrors] = useState<{ [key: string]: string }>({});

    // Question Management
    const [questions, setQuestions] = useState<Question[]>([]);
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [isSavingQuestion, setIsSavingQuestion] = useState(false); 
    const [questionError, setQuestionError] = useState<string | null>(null); 

    // general loading/Error for initial fetch
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    
    const fetchQuizData = async () => {
        // added isNaN check for quizIdNum
        if (!quizIdNum || isNaN(quizIdNum) || !token) {
            if (!token) setFetchError("Authentication required.");
            else setFetchError("Invalid Quiz ID.");
            setIsLoadingData(false);
            return;
        }
        console.log(`Fetching data for quiz ID: ${quizIdNum}`);
        setIsLoadingData(true);
        setFetchError(null);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/api/v1/quizzes/${quizIdNum}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            
            if (response.status === 404) throw new Error('Quiz not found.');
            if (!response.ok) throw new Error(`Error fetching quiz details. Status: ${response.status}`);

            const data = await response.json();
            if (data.status === 'success' && data.data?.quiz) {
                const fetchedQuiz: QuizDetail = data.data.quiz;
                setTitle(fetchedQuiz.Title || '');
                setSubject(fetchedQuiz.Subject || '');
                setDifficultyLevel(fetchedQuiz.DifficultyLevel || '');
                setTimeLimit(fetchedQuiz.TimeLimit ?? '');
                setQuestions(fetchedQuiz.questions || []); // ensure questions array exists
                console.log("Fetched data successfully, questions:", fetchedQuiz.questions);
            } else {
                throw new Error(data.message || 'Invalid data format received.');
            }
        } catch (err: any) {
            setFetchError(err.message);
            console.error("Fetch quiz error:", err);
        } finally {
            setIsLoadingData(false);
        }
    };

    useEffect(() => {
        fetchQuizData();
       
    }, [quizIdNum, token]);

    // handle quiz detail update
    const handleQuizDetailSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // prevent default form submission
        if (!token) {
            setQuizDetailError("Authentication required."); 
            return;
        }

        setIsUpdatingQuiz(true); 
        setQuizDetailError(null); 
        setQuizFieldErrors({});

        // Validation
        let currentErrors: { [key: string]: string } = {};
        if (!title.trim()) currentErrors.title = 'Title is required.';
        if (!subject.trim()) currentErrors.subject = 'Subject is required.';
        if (!difficultyLevel) currentErrors.difficulty = 'Difficulty level is required.';
        if (timeLimit === '' || timeLimit <= 0) currentErrors.timeLimit = 'Valid time limit (minutes) is required.';

        if (Object.keys(currentErrors).length > 0) {
            setQuizFieldErrors(currentErrors);
            setIsUpdatingQuiz(false);
            return;
        }

        // Prepare payload - use correct casing matching backend controller
        const updatedQuizData = {
            Title: title,
            Subject: subject,
            DifficultyLevel: difficultyLevel,
            TimeLimit: timeLimit,
        };

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/api/v1/quizzes/${quizIdNum}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedQuizData),
            });
            const data = await response.json(); // Always try to parse JSON
            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }
            alert('Quiz details updated successfully!');
            // optionally refetch data if needed, but usually not necessary if API returns updated object
            // fetchquizdata();
        } catch (err: any) {
            setQuizDetailError(err.message || 'Failed to update quiz details.'); 
            console.error("Quiz Detail Update Error:", err);
        } finally {
            setIsUpdatingQuiz(false);
        }
    };

    // question action handlers 
    const handleSaveQuestion = async (questionData: Partial<Question>) => {
        if (!token || !quizIdNum) return;
        setIsSavingQuestion(true);
        setQuestionError(null);
        const isEditing = !!questionData.QuestionID;
        const method = isEditing ? 'PUT' : 'POST';
        const questionId = questionData.QuestionID;
        const apiUrlBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        let url = `${apiUrlBase}/api/v1/quizzes/${quizIdNum}/questions`;
        if (isEditing && questionId) { url += `/${questionId}`; }

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ 
                    Options: questionData.Options,
                    CorrectAnswerIndex: questionData.CorrectAnswerIndex
                }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || `Failed to ${isEditing ? 'update' : 'add'} question`);

            // Update local state
            fetchQuizData(); // refetch quiz data to get updated question list & count reliably

            // Close form
            setShowQuestionForm(false);
            setEditingQuestion(null);
            alert(`Question ${isEditing ? 'updated' : 'added'} successfully!`);

        } catch (err: any) {
            setQuestionError(err.message);
            console.error("Save Question Error:", err);
             alert(`Error saving question: ${err.message}`);
        } finally {
            setIsSavingQuestion(false);
        }
    };

    const handleDeleteQuestion = async (questionIdToDelete: number, questionText: string) => {
        if (!token || !quizIdNum) return;
        if (window.confirm(`Delete question: "${questionText.substring(0, 50)}..."?`)) {
            setQuestionError(null);
            
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const response = await fetch(`${apiUrl}/api/v1/quizzes/${quizIdNum}/questions/${questionIdToDelete}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (response.status === 204) {
                    
                    fetchQuizData();
                    alert('Question deleted successfully.');
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `Failed to delete. Status: ${response.status}`);
                }
            } catch (err: any) {
                setQuestionError(err.message);
                console.error("Delete Question Error:", err);
                alert(`Error deleting question: ${err.message}`);
            }
        }
    };

    const handleAddNewQuestionClick = () => {
        setEditingQuestion(null);
        setShowQuestionForm(true);
        setQuestionError(null);
    };

    const handleEditQuestionClick = (question: Question) => {
        setEditingQuestion(question);
        setShowQuestionForm(true);
        setQuestionError(null);
    };

    const handleCancelQuestionForm = () => {
        setShowQuestionForm(false);
        setEditingQuestion(null);
        setQuestionError(null);
    };

    // render logic
    if (isLoadingData) {
        return <div className="flex justify-center p-10"><Spinner size="lg" /></div>;
    }
    // show fetch error more prominently if initial data failed to load
    if (fetchError) {
         return (
              <div className="text-center p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
                  <p><strong>Error loading quiz:</strong> {fetchError}</p>
                   <Link href="/admin/quizzes" className="block mt-4">
                       <Button variant="secondary">Back to Quizzes</Button>
                   </Link>
              </div>
         );
     }

    return (
        <div>
            <Link href="/admin/quizzes" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
                ← Back to Quiz Management
            </Link>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Quiz (ID: {quizId})</h1>

            {/* Edit Quiz Details Form  */}
            {/* Ensure this form uses handlequizdetailSubmit */}
            <form onSubmit={handleQuizDetailSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4 mb-8">
                <h2 className="text-lg font-semibold border-b pb-2 mb-4">Quiz Details</h2>
                {/* Display quiz detail update errors */}
                {quizDetailError && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                        {quizDetailError}
                    </div>
                )}
                {/* Inputs for quiz details */}
                <Input label="Title" id="title" name="title" required value={title} onChange={(e) => setTitle(e.target.value)} disabled={isUpdatingQuiz} error={quizFieldErrors.title} />
                <Input label="Subject" id="subject" name="subject" required value={subject} onChange={(e) => setSubject(e.target.value)} disabled={isUpdatingQuiz} error={quizFieldErrors.subject} />
                <div className="mb-3"> {/* Select for Difficulty */}
                    <label htmlFor="difficultyLevel" className="block text-gray-700 text-sm font-bold mb-2">Difficulty Level</label>
                    <select id="difficultyLevel" name="difficultyLevel" required value={difficultyLevel} onChange={(e) => setDifficultyLevel(e.target.value as DifficultyLevelType)} disabled={isUpdatingQuiz} className={`shadow border ${quizFieldErrors.difficulty ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 ${quizFieldErrors.difficulty ? 'focus:ring-red-300' : 'focus:ring-blue-500'} focus:border-transparent bg-white`} aria-describedby={quizFieldErrors.difficulty ? `difficulty-error` : undefined}>
                         <option value="" disabled>Select difficulty...</option>
                         {difficultyLevels.map(level => <option key={level} value={level}>{level}</option>)}
                     </select>
                     <div className="h-4 mt-1">{quizFieldErrors.difficulty && <p id="difficulty-error" className="text-xs text-red-600">{quizFieldErrors.difficulty}</p>}</div>
                 </div>
                 <Input label="Time Limit (minutes)" id="timeLimit" name="timeLimit" type="number" required value={timeLimit} onChange={(e) => setTimeLimit(e.target.value === '' ? '' : parseInt(e.target.value, 10))} disabled={isUpdatingQuiz} error={quizFieldErrors.timeLimit} />

                {/* Submit/Cancel Buttons for Quiz Details */}
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                    <Link href="/admin/quizzes">
                        <Button type="button" variant="secondary" disabled={isUpdatingQuiz}>Cancel Changes</Button>
                    </Link>
                    <Button type="submit" variant="primary" disabled={isUpdatingQuiz}>
                        {isUpdatingQuiz ? <Spinner size="sm" className="mx-auto" /> : 'Update Quiz Details'}
                    </Button>
                </div>
            </form>

            {/*  manage questions section  */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4">
                 <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h2 className="text-lg font-semibold">Manage Questions ({questions.length})</h2>
                     {!showQuestionForm && (
                        <Button variant='secondary' onClick={handleAddNewQuestionClick} disabled={isSavingQuestion}>
                            <PlusIcon className="w-4 h-4 mr-1 inline-block"/> Add Question
                        </Button>
                     )}
                 </div>

                {/* Conditionally render the Question Form */}
                {showQuestionForm && (
                    <QuestionForm
                        quizId={quizIdNum}
                        initialData={editingQuestion}
                        onSave={handleSaveQuestion} 
                        onCancel={handleCancelQuestionForm}
                        isSaving={isSavingQuestion}
                    />
                )}
                {/* Display question action errors */}
                 {questionError && !showQuestionForm && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                        Error handling question: {questionError}
                    </div>
                 )}

                {/* List of Existing Questions */}
                 <div className="space-y-3">
                     {questions.length > 0 ? (
                         questions.map((q, index) => (
                             <div key={q.QuestionID} className="flex justify-between items-start p-3 border rounded bg-gray-50">
                                <div className="text-sm flex-grow mr-4"> {/* Added mr-4 */}
                                     <p className="font-medium">{index + 1}. {q.Text}</p>
                                     <ul className="list-disc list-inside pl-4 mt-1 text-xs text-gray-600">
                                         {q.Options?.map((opt, optIndex) => (
                                             <li key={optIndex} className={optIndex === q.CorrectAnswerIndex ? 'font-semibold text-green-700' : ''}>
                                                 {opt} {optIndex === q.CorrectAnswerIndex ? '(Correct)' : ''}
                                             </li>
                                         ))}
                                     </ul>
                                 </div>
                                 <div className="flex-shrink-0 space-x-2"> {/* Removed ml-4 */}
                                     <Button variant="secondary" className="px-2 py-1 text-xs" onClick={() => handleEditQuestionClick(q)} title="Edit Question" disabled={showQuestionForm}> {/* Disable if form open */}
                                         <PencilSquareIcon className="w-4 h-4"/>
                                     </Button>
                                     <Button variant="secondary" className="px-2 py-1 text-xs text-red-600 border border-red-600 hover:bg-red-100" onClick={() => handleDeleteQuestion(q.QuestionID, q.Text)} title="Delete Question" disabled={showQuestionForm}> {/* Disable if form open */}
                                         <TrashIcon className="w-4 h-4"/>
                                     </Button>
                                 </div>
                             </div>
                         ))
                     ) : (
                          !showQuestionForm && <p className="text-sm text-gray-500 text-center py-4">No questions added to this quiz yet.</p>
                     )}
                 </div>
            </div>
        </div>
    );
}
