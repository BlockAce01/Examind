const axios = require('axios');

const n8nWebhookUrl = 'https://primary-production-275b.up.railway.app/webhook/2a8e3d95-d58c-414e-86fd-374dad086423-dfwse345sdfsd-gyrt7456gfbzdfg';

const getAIExplanation = async (req, res) => {
    const { quizTitle, selectedQuestions } = req.body;

    if (!quizTitle || !selectedQuestions || !Array.isArray(selectedQuestions) || selectedQuestions.length === 0) {
        return res.status(400).json({ message: 'Missing quizTitle or selectedQuestions.' });
    }

    try {
        const transformedQuestions = selectedQuestions.map(q => {
            const correctAnswer = q.Options[q.CorrectAnswerIndex];
            const submittedAnswer = q.SubmittedAnswerIndex !== null ? q.Options[q.SubmittedAnswerIndex] : null;
            return {
                text: q.Text,
                options: q.Options,
                correctAnswer: correctAnswer,
                submittedAnswer: submittedAnswer,
            };
        });

        const n8nPayload = {
            quizTitle,
            questions: transformedQuestions,
        };

        // Log the payload being sent to n8n
        console.log('Sending payload to n8n:', JSON.stringify(n8nPayload, null, 2));

        const n8nResponse = await axios.post(n8nWebhookUrl, n8nPayload, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Log the response received from n8n
        console.log('Received response from n8n:', JSON.stringify(n8nResponse.data, null, 2));

        if (Array.isArray(n8nResponse.data) && n8nResponse.data.length > 0 && n8nResponse.data[0] && typeof n8nResponse.data[0].output === 'string') {
            res.json({ explanation: n8nResponse.data[0].output });
        } else {
            console.error('Unexpected response structure from n8n or missing output:', n8nResponse.data);
            res.status(500).json({ message: 'Error processing AI explanation: Unexpected response format from AI service.' });
        }
    } catch (error) {
        console.error('Error calling n8n webhook:', error.message);
        if (error.response) {
            console.error('n8n error response data:', error.response.data);
            console.error('n8n error response status:', error.response.status);
        } else if (error.request) {
            console.error('n8n no response received:', error.request);
        }
        res.status(500).json({ message: 'Failed to get AI explanation.' });
    }
};

module.exports = {
    getAIExplanation,
};