'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import { useAuth } from '@/context/AuthContext';
import { type QuizDetail, type Question } from '@/types/quiz';
import QuestionForm from '@/components/teacher/quiz/QuestionForm';
import { PencilSquareIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

const difficultyLevels = ['Easy', 'Medium', 'Hard'] as const;
type DifficultyLevelType = typeof difficultyLevels[number];

export default function EditQuizPage() {
    const router = useRouter();
    const params = useParams();
    const { token } = useAuth();
    const quizId = params.quizId as string;
    const quizIdNum = parseInt(quizId, 10);

    //this is for the quiz details form
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [difficultyLevel, setDifficultyLevel] = useState<DifficultyLevelType | ''>('');
    const [timeLimit, setTimeLimit] = useState<number | ''>('');
    const [isUpdatingQuiz, setIsUpdatingQuiz] = useState(false);
    const [quizDetailError, setQuizDetailError] = useState<string | null>(null);
    const [quizFieldErrors, setQuizFieldErrors] = useState<{ [key: string]: string }>({});

    //this is for managing questions
    const [questions, setQuestions] = useState<Question[]>([]);
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [isSavingQuestion, setIsSavingQuestion] = useState(false);
    const [questionError, setQuestionError] = useState<string | null>(null);

    //this is for loading and errors when we first get data
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    //get the quiz data that's already here
    const fetchQuizData = async () => {
        if (!quizIdNum || isNaN(quizIdNum) || !token) {
            if (!token) setFetchError("authentication required.");
            else setFetchError("invalid quiz id.");
            setIsLoadingData(false);
            return;
        }
        console.log(`fetching data for quiz id: ${quizIdNum}`);
        setIsLoadingData(true);
        setFetchError(null);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/api/v1/quizzes/${quizIdNum}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            //check for specific errors to handle them better
            if (response.status === 404) throw new Error('quiz not found.');
            if (!response.ok) throw new Error(`error fetching quiz details. status: ${response.status}`);

            const data = await response.json();
            if (data.status === 'success' && data.data?.quiz) {
                const fetchedQuiz: QuizDetail = data.data.quiz;
                setTitle(fetchedQuiz.Title || '');
                setSubject(fetchedQuiz.Subject || '');
                setDifficultyLevel(fetchedQuiz.DifficultyLevel || '');
                setTimeLimit(fetchedQuiz.TimeLimit ?? '');
                setQuestions(fetchedQuiz.questions || []);
                console.log("fetched data successfully, questions:", fetchedQuiz.questions);
            } else {
                throw new Error(data.message || 'invalid data format received.');
            }
        } catch (err: any) {
            setFetchError(err.message);
            console.error("fetch quiz error:", err);
        } finally {
            setIsLoadingData(false);
        }
    };

    useEffect(() => {
        fetchQuizData();
    }, [quizIdNum, token]);

    //this is for updating the quiz details
    const handleQuizDetailSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); //stop the form from submitting normally
        if (!token) {
            setQuizDetailError("authentication required."); //show a specific error message
            return;
        }

        setIsUpdatingQuiz(true); //show that we are loading something specific
        setQuizDetailError(null); //clear the specific error message
        setQuizFieldErrors({});

        //check if the input is okay
        let currentErrors: { [key: string]: string } = {};
        if (!title.trim()) currentErrors.title = 'title is required.';
        if (!subject.trim()) currentErrors.subject = 'subject is required.';
        if (!difficultyLevel) currentErrors.difficulty = 'difficulty level is required.';
        if (timeLimit === '' || timeLimit <= 0) currentErrors.timeLimit = 'valid time limit (minutes) is required.';

        if (Object.keys(currentErrors).length > 0) {
            setQuizFieldErrors(currentErrors);
            setIsUpdatingQuiz(false);
            return;
        }

        //get the data ready to send - make sure the names match the backend
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
            const data = await response.json(); //always try to parse json
            if (!response.ok) {
                throw new Error(data.message || `http error! status: ${response.status}`);
            }
            alert('Quiz details updated successfully!');
        } catch (err: any) {
            setQuizDetailError(err.message || 'Failed to update quiz details.');
            console.error("Quiz detail update error:", err);
        } finally {
            setIsUpdatingQuiz(false); //loading state
        }
    };

    //these are the things that happen when we do stuff with questions
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
                    Text: questionData.Text,
                    Options: questionData.Options,
                    CorrectAnswerIndex: questionData.CorrectAnswerIndex
                }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || `failed to ${isEditing ? 'update' : 'add'} question`);

            //update the stuff we see on the page
            fetchQuizData();

            //close the form
            setShowQuestionForm(false);
            setEditingQuestion(null);
            alert(`question ${isEditing ? 'updated' : 'added'} successfully!`);

        } catch (err: any) {
            setQuestionError(err.message);
            console.error("save question error:", err);
             alert(`error saving question: ${err.message}`);
        } finally {
            setIsSavingQuestion(false);
        }
    };

    const handleDeleteQuestion = async (questionIdToDelete: number, questionText: string) => {
        if (!token || !quizIdNum) return;
        if (window.confirm(`delete question: "${questionText.substring(0, 50)}..."?`)) {
            setQuestionError(null);
            //maybe show that we are deleting something specific if we need to
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                const response = await fetch(`${apiUrl}/api/v1/quizzes/${quizIdNum}/questions/${questionIdToDelete}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (response.status === 204) {
                    //update the stuff we see on the page - getting the data again is better
                    fetchQuizData();
                    alert('question deleted successfully.');
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `failed to delete. status: ${response.status}`);
                }
            } catch (err: any) {
                setQuestionError(err.message);
                console.error("delete question error:", err);
                alert(`error deleting question: ${err.message}`);
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

    //this is how we show things on the page
    if (isLoadingData) {
        return <div className="flex justify-center p-10"><Spinner size="lg" /></div>;
    }
    //show the error if the first data didn't load right
    if (fetchError) {
         return (
              <div className="text-center p-10 text-red-600 bg-red-50 border border-red-200 rounded-lg">
                  <p><strong>Error loading quiz:</strong> {fetchError}</p>
                   <Link href="/teacher/quizzes" className="block mt-4">
                       <Button variant="secondary">Back to quizzes</Button>
                   </Link>
              </div>
         );
     }

    return (
        <div>
            <Link href="/teacher/quizzes" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
                ← Back to quiz management
            </Link>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Quiz (id: {quizId})</h1>

            {/*this is for editing the quiz details form*/}
            <form onSubmit={handleQuizDetailSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4 mb-8">
                <h2 className="text-lg font-semibold border-b pb-2 mb-4">Quiz details</h2>
                {/*show any errors when updating quiz details*/}
                {quizDetailError && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                        {quizDetailError}
                    </div>
                )}
                {/*places to type in the quiz details*/}
                <Input label="Title" id="title" name="title" required value={title} onChange={(e) => setTitle(e.target.value)} disabled={isUpdatingQuiz} error={quizFieldErrors.title} />
                <Input label="Subject" id="subject" name="subject" required value={subject} onChange={(e) => setSubject(e.target.value)} disabled={isUpdatingQuiz} error={quizFieldErrors.subject} />
                <div className="mb-3"> {/*choose how hard the quiz is*/}
                    <label htmlFor="difficultyLevel" className="block text-gray-700 text-sm font-bold mb-2">Difficulty Level</label>
                    <select id="difficultyLevel" name="difficultyLevel" required value={difficultyLevel} onChange={(e) => setDifficultyLevel(e.target.value as DifficultyLevelType)} disabled={isUpdatingQuiz} className={`shadow border ${quizFieldErrors.difficulty ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 ${quizFieldErrors.difficulty ? 'focus:ring-red-300' : 'focus:ring-blue-500'} focus:border-transparent bg-white`} aria-describedby={quizFieldErrors.difficulty ? `difficulty-error` : undefined}>
                         <option value="" disabled>select difficulty...</option>
                         {difficultyLevels.map(level => <option key={level} value={level}>{level}</option>)}
                     </select>
                     <div className="h-4 mt-1">{quizFieldErrors.difficulty && <p id="difficulty-error" className="text-xs text-red-600">{quizFieldErrors.difficulty}</p>}</div>
                 </div>
                 <Input label="Time Limit (minutes)" id="timeLimit" name="timeLimit" type="number" required value={timeLimit} onChange={(e) => setTimeLimit(e.target.value === '' ? '' : parseInt(e.target.value, 10))} disabled={isUpdatingQuiz} error={quizFieldErrors.timeLimit} />

                {/*buttons to send or cancel the quiz details*/}
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                    <Link href="/teacher/quizzes">
                        <Button type="button" variant="secondary" disabled={isUpdatingQuiz}>Cancel changes</Button>
                    </Link>
                    <Button type="submit" variant="primary" disabled={isUpdatingQuiz}>
                        {isUpdatingQuiz ? <Spinner size="sm" className="mx-auto" /> : 'Update quiz details'}
                    </Button>
                </div>
            </form>

            {/*this is where we handle the questions*/}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4">
                 <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h2 className="text-lg font-semibold">Manage questions ({questions.length})</h2>
                     {!showQuestionForm && (
                        <Button variant='secondary' onClick={handleAddNewQuestionClick} disabled={isSavingQuestion}>
                            <PlusIcon className="w-4 h-4 mr-1 inline-block"/> Add Question
                        </Button>
                     )}
                 </div>

                {/*show the question form if we need to*/}
                {showQuestionForm && (
                    <QuestionForm
                        quizId={quizIdNum}
                        initialData={editingQuestion}
                        onSave={handleSaveQuestion} //make sure this uses the handleSaveQuestion function
                        onCancel={handleCancelQuestionForm}
                        isSaving={isSavingQuestion}
                    />
                )}
                {/*show any errors when doing stuff with questions*/}
                 {questionError && !showQuestionForm && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                        Error handling question: {questionError}
                    </div>
                 )}

                {/*a list of the questions that are already here*/}
                 <div className="space-y-3">
                     {questions.length > 0 ? (
                         questions.map((q, index) => (
                             <div key={q.QuestionID} className="flex justify-between items-start p-3 border rounded bg-gray-50">
                                <div className="text-sm flex-grow mr-4">
                                     <p className="font-medium">{index + 1}. {q.Text}</p>
                                     <ul className="list-disc list-inside pl-4 mt-1 text-xs text-gray-600">
                                         {q.Options?.map((opt, optIndex) => (
                                             <li key={optIndex} className={optIndex === q.CorrectAnswerIndex ? 'font-semibold text-green-700' : ''}>
                                                 {opt} {optIndex === q.CorrectAnswerIndex ? '(correct)' : ''}
                                             </li>
                                         ))}
                                     </ul>
                                 </div>
                                 <div className="flex-shrink-0 space-x-2">
                                     <Button variant="secondary" className="px-2 py-1 text-xs" onClick={() => handleEditQuestionClick(q)} title="edit question" disabled={showQuestionForm}> {/*don't let you click if the form is open*/}
                                         <PencilSquareIcon className="w-4 h-4"/>
                                     </Button>
                                     <Button variant="secondary" className="px-2 py-1 text-xs" onClick={() => handleDeleteQuestion(q.QuestionID, q.Text)} title="delete question" disabled={showQuestionForm}> {/*don't let you click if the form is open*/}
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
