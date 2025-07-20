'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { type Question } from '@/types/quiz';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

interface QuestionFormProps {
    quizId: number; //ID of the quiz this question belongs to
    initialData?: Question | null; //pass existing question data for editing
    onSave: (questionData: Partial<Question>) => Promise<void>; //function to call on save
    onCancel: () => void; //function to call on cancel
    isSaving: boolean; //pass loading state from parent
}

const QuestionForm: React.FC<QuestionFormProps> = ({
    quizId,
    initialData,
    onSave,
    onCancel,
    isSaving
}) => {
    const [text, setText] = useState('');
    const [options, setOptions] = useState<string[]>(['', '']); 
    const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | ''>('');
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    const isEditing = !!initialData; //determine if adding or editing

    //populate form if initialData is provided
    useEffect(() => {
        if (initialData) {
            setText(initialData.Text || '');
            setOptions(initialData.Options || ['', '']);
            setCorrectAnswerIndex(initialData.CorrectAnswerIndex ?? '');
        } else {
            //reset form for adding new
            setText('');
            setOptions(['', '']);
            setCorrectAnswerIndex('');
        }
        setFieldErrors({}); //clear errors when data changes
    }, [initialData]);

    //handle changes in option's input
    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    //add a new empty option
    const addOption = () => {
        setOptions([...options, '']);
    };

    //remove an option field(least 2 options remain)
    const removeOption = (index: number) => {
        if (options.length > 2) {
            const newOptions = options.filter((_, i) => i !== index);
            setOptions(newOptions);
            //adjust correct index if the removed option was the correct one or before it
            if (correctAnswerIndex === index) {
                setCorrectAnswerIndex(''); //reset if correct answer removed
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
        setFieldErrors({}); 

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

        //prepare data for saving
        const questionData = {
            Text: text,
            Options: options,
            CorrectAnswerIndex: correctAnswerIndex as number,
             ...(isEditing && initialData && { QuestionID: initialData.QuestionID }),
        };

        await onSave(questionData); //call parent save function
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
                        {options.length > 2 && ( //only show remove button if more than 2 options
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
                <Button type="button" variant="secondary" onClick={addOption} disabled={isSaving} className="mt-1 text-xs">
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
                    disabled={isSaving || options.some(opt => !opt.trim())} //disable if options are empty
                    className={`w-full p-2 border rounded bg-white focus:ring-2 focus:outline-none ${fieldErrors.correctAnswer ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'}`}
                >
                    <option value="" disabled>Select correct option...</option>
                    {options.map((option, index) => (
                        //only show valid options in dropdown
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
