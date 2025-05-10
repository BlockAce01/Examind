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

         try {
            const response = await fetch('/api/ai-chat/explanation', { // Assuming backend runs on the same host/port or proxied
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    quizTitle,
                    selectedQuestions, // quizId is not sent as per plan, n8n doesn't need it
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            let explanation = data.explanation;

            // Ensure single backslashes for LaTeX commands if n8n might return double backslashes.
            if (explanation) {
                explanation = explanation.replace(/\\\\/g, '\\');
            }
            
            console.log("Explanation received in frontend:", explanation); // <--- ADD THIS LINE
            setChatbotResponse(explanation);

        } catch (error) {
            console.error("Failed to get explanation:", error);
            setChatbotResponse(`Error getting explanation: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
            setIsLoading(false);
        }
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
                {/* Temporarily simplified rendering to debug */}
                {chatbotResponse && <pre style={{ color: 'black', backgroundColor: 'lightgray', padding: '10px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{chatbotResponse}</pre>}
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