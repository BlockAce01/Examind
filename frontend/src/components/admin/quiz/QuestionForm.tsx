// src/components/admin/quiz/QuestionForm.tsx
'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { type Question } from '@/types/quiz'; // Import Question type
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

interface QuestionFormProps {
    quizId: number; // ID of the quiz this question belongs to
    initialData?: Question | null; // Pass existing question data for editing
    onSave: (questionData: Partial<Question>) => Promise<void>; // Function to call on save (API call)
    onCancel: () => void; // Function to call on cancel
    isSaving: boolean; // Pass loading state from parent
}

const QuestionForm: React.FC<QuestionFormProps> = ({
    quizId,
    initialData,
    onSave,
    onCancel,
    isSaving
}) => {
    const [text, setText] = useState('');
    const [options, setOptions] = useState<string[]>(['', '']); // Start with 2 empty options
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | ''>('');
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    const isEditing = !!initialData; // Determine if adding or editing

    // Populate form if initialData is provided (for editing)
    useEffect(() => {
        if (initialData) {
            setText(initialData.Text || '');
            setOptions(initialData.Options || ['', '']);
            setCorrectAnswerIndex(initialData.CorrectAnswerIndex ?? '');
        } else {
            // Reset form for adding new
            setText('');
            setOptions(['', '']);
            setCorrectAnswerIndex('');
        }
        setFieldErrors({}); // Clear errors when data changes
    }, [initialData]); // Rerun when initialData changes

    // Handle changes in option input fields
    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    // Add a new empty option field
    const addOption = () => {
        setOptions([...options, '']);
    };

    // Remove an option field (ensure at least 2 options remain)
    const removeOption = (index: number) => {
        if (options.length > 2) {
            const newOptions = options.filter((_, i) => i !== index);
            setOptions(newOptions);
            // Adjust correct index if the removed option was the correct one or before it
            if (correctAnswerIndex === index) {
                setCorrectAnswerIndex(''); // Reset if correct answer removed
            } else if (correctAnswerIndex !== '' && correctAnswerIndex > index) {
                setCorrectAnswerIndex(correctAnswerIndex - 1);
            }
        } else {
            alert("A question must have at least two options.");
        }
    };

    // Handle form submission
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFieldErrors({}); // Clear previous errors

        // Validation
        let errors: { [key: string]: string } = {};
        if (!text.trim()) errors.text = 'Question text is required.';
        if (options.some(opt => !opt.trim())) errors.options = 'All option fields must be filled.';
        if (options.length < 2) errors.options = 'At least two options are required.';
        if (correctAnswerIndex === '' || correctAnswerIndex < 0 || correctAnswerIndex >= options.length) {
            errors.correctAnswer = 'Please select a valid correct answer.';
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        // Prepare data for saving (match backend expected keys)
        const questionData = {
            Text: text,
            Options: options,
            CorrectAnswerIndex: correctAnswerIndex as number, // Cast as number, already validated
             // Include QuestionID only when editing
             ...(isEditing && initialData && { QuestionID: initialData.QuestionID }),
             // QuizID is implicit via the API route
        };

        await onSave(questionData); // Call parent save function (API call)
        // Parent component should handle closing the form or resetting state on success
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded-md bg-gray-50 space-y-4 my-4">
            <h3 className="text-md font-semibold">{isEditing ? 'Edit Question' : 'Add New Question'}</h3>

            {/* Question Text */}
             <div>
                 <label htmlFor="questionText" className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                 <textarea
                     id="questionText" rows={3} required
                     value={text} onChange={(e) => setText(e.target.value)}
                     disabled={isSaving}
                     className={`w-full p-2 border rounded focus:ring-2 focus:outline-none ${fieldErrors.text ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`}
                 />
                 {fieldErrors.text && <p className="text-xs text-red-600 mt-1">{fieldErrors.text}</p>}
            </div>

            {/* Options */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
                {options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                            type="text" required
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            disabled={isSaving}
                            placeholder={`Option ${index + 1}`}
                            className={`flex-grow p-2 border rounded focus:ring-2 focus:outline-none ${fieldErrors.options ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`}
                        />
                        {options.length > 2 && ( // Only show remove button if more than 2 options
                             <button
                                 type="button" onClick={() => removeOption(index)}
                                 disabled={isSaving}
                                 className="p-1 text-red-500 hover:text-red-700 disabled:opacity-50"
                                 title="Remove Option"
                             >
                                <XMarkIcon className="w-4 h-4"/>
                             </button>
                         )}
                    </div>
                ))}
                {fieldErrors.options && <p className="text-xs text-red-600 mt-1">{fieldErrors.options}</p>}
                <Button type="button" variant="secondary" size="sm" onClick={addOption} disabled={isSaving} className="mt-1 text-xs">
                    <PlusIcon className="w-3 h-3 mr-1 inline-block"/> Add Option
                </Button>
            </div>

             {/* Correct Answer Selection */}
            <div>
                <label htmlFor="correctAnswer" className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
                <select
                    id="correctAnswer" required
                    value={correctAnswerIndex}
                    onChange={(e) => setCorrectAnswerIndex(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                    disabled={isSaving || options.some(opt => !opt.trim())} // Disable if options are empty
                    className={`w-full p-2 border rounded bg-white focus:ring-2 focus:outline-none ${fieldErrors.correctAnswer ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`}
                >
                    <option value="" disabled>Select correct option...</option>
                    {options.map((option, index) => (
                        // Only show valid options in dropdown
                        option.trim() && <option key={index} value={index}>Option {index + 1}: {option}</option>
                    ))}
                </select>
                 {fieldErrors.correctAnswer && <p className="text-xs text-red-600 mt-1">{fieldErrors.correctAnswer}</p>}
            </div>


            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-3 border-t">
                 <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>
                     Cancel
                 </Button>
                 <Button type="submit" variant="primary" disabled={isSaving}>
                     {isSaving ? <Spinner size="sm"/> : (isEditing ? 'Update Question' : 'Add Question')}
                 </Button>
            </div>
        </form>
    );
};

export default QuestionForm;