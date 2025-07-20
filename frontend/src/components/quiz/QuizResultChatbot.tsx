import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import WaitingState from './WaitingState';
import styles from './QuizResultChatbot.module.css';
import api from '@/lib/api';

interface Question {
    QuestionID: number;
    Text: string;
    Options: string[];
    CorrectAnswerIndex: number;
    SubmittedAnswerIndex: number | null;
}

interface QuizResultChatbotProps {
    selectedQuestion: Question | null;
    quizTitle: string;
    quizId: number;
}

const QuizResultChatbot: React.FC<QuizResultChatbotProps> = ({ selectedQuestion, quizTitle, quizId }) => {
    const [chatbotResponse, setChatbotResponse] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGetExplanation = async () => {
        if (!selectedQuestion) {
            setChatbotResponse("Please select a question to get an explanation.");
            return;
        }

        setIsLoading(true);
        setChatbotResponse(null);

         try {
            const response = await api.post('/ai-chat', {
                quizTitle,
                selectedQuestions: [selectedQuestion], // API expects an array
            });

            let explanation = response.data.explanation;

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

            {selectedQuestion ? (
                <div>
                    <p className="mb-2">1 question selected.</p>
                    <Button onClick={handleGetExplanation} disabled={isLoading}>
                        {isLoading ? 'Getting Explanation...' : 'Get Explanation for Selected Question'}
                    </Button>
                </div>
            ) : (
                <p>Select a question above to get an explanation.</p>
            )}

            {/* assistant interaction area */}
            <div className="mt-4 p-3 bg-white border rounded whitespace-pre-wrap">
                {isLoading && <WaitingState />}
                {/* Render HTML content safely */}
                {chatbotResponse && (
                    <div
                        className={styles.chatbotResponse}
                        dangerouslySetInnerHTML={{ __html: chatbotResponse }}
                    />
                )}
                {!isLoading && !chatbotResponse && !selectedQuestion && (
                     <p className="text-gray-500">Chatbot responses will appear here.</p>
                )}
                 {!isLoading && !chatbotResponse && selectedQuestion && (
                     <p className="text-gray-500">Click "Get Explanation" to see the AI's response.</p>
                )}
            </div>
        </div>
    );
};

export default QuizResultChatbot;
