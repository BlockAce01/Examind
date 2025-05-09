import React, { useState } from 'react';
import Button from '@/components/ui/Button';

interface Question {
    QuestionID: number;
    Text: string;
    Options: string[];
    CorrectAnswerIndex: number;
    SubmittedAnswerIndex: number | null;
}

interface QuizResultChatbotProps {
    selectedQuestions: Question[];
    quizTitle: string;
    quizId: number;
}

const QuizResultChatbot: React.FC<QuizResultChatbotProps> = ({ selectedQuestions, quizTitle, quizId }) => {
    const [chatbotResponse, setChatbotResponse] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGetExplanation = async () => {
        if (selectedQuestions.length === 0) {
            setChatbotResponse("Please select at least one question to get an explanation.");
            return;
        }

        setIsLoading(true);
        setChatbotResponse(null);

        // simulate sending data to a backend API
        console.log("Sending selected questions for explanation:", selectedQuestions);
        console.log("Quiz Title:", quizTitle);
        console.log("Quiz ID:", quizId);

        // TODO: replace with actual API call to your backend
        await new Promise(resolve => setTimeout(resolve, 1500));

        // simulate a response from the AI
        let simulatedExplanation = `Explanation for selected question(s) from Quiz "${quizTitle}":\n\n`;

        selectedQuestions.forEach(q => {
            simulatedExplanation += `Question: ${q.Text}\n`;
            simulatedExplanation += `Correct Answer: ${q.Options[q.CorrectAnswerIndex]}\n`;
            simulatedExplanation += `Your Answer: ${q.SubmittedAnswerIndex !== null ? q.Options[q.SubmittedAnswerIndex] : 'Not Answered'}\n\n`;
            simulatedExplanation += "This is a simulated explanation based on the question details. The actual AI explanation would provide a step-by-step breakdown of how to arrive at the correct answer.\n\n---\n\n";
        });


        setChatbotResponse(simulatedExplanation);
        setIsLoading(false);
    };

    return (
        <div className="border p-4 rounded-lg shadow-sm bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">AI Assistant</h3>

            {selectedQuestions.length > 0 ? (
                <div>
                    <p className="mb-2">{selectedQuestions.length} question(s) selected.</p>
                    <Button onClick={handleGetExplanation} disabled={isLoading}>
                        {isLoading ? 'Getting Explanation...' : 'Get Explanation for Selected Questions'}
                    </Button>
                </div>
            ) : (
                <p>Select questions above to get explanations.</p>
            )}

            {/* assistant interaction area */}
            <div className="mt-4 p-3 bg-white border rounded whitespace-pre-wrap">
                {isLoading && <p className="text-gray-500">Loading explanation...</p>}
                {chatbotResponse && <p>{chatbotResponse}</p>}
                {!isLoading && !chatbotResponse && selectedQuestions.length === 0 && (
                     <p className="text-gray-500">Chatbot responses will appear here.</p>
                )}
                 {!isLoading && !chatbotResponse && selectedQuestions.length > 0 && (
                     <p className="text-gray-500">Click "Get Explanation" to see the AI's response.</p>
                )}
            </div>
        </div>
    );
};

export default QuizResultChatbot;