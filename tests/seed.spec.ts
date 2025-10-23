import { test } from '@playwright/test';

test.describe('Test group', () => {
  test('seed', async ({ page }) => {
    // Seed test data by creating a teacher account first, getting auth token, then creating quizzes
    
    console.log('Starting quiz seeding process...');

    // Step 1: Create a teacher account for creating quizzes
    const teacherEmail = `seed.teacher.${Date.now()}@example.com`;
    
    try {
      console.log(`Registering seed teacher account: ${teacherEmail}`);
      
      const registerResponse = await page.request.post('http://localhost:8080/api/v1/auth/register', {
        data: {
          name: 'Seed Teacher',
          email: teacherEmail,
          password: 'SeedTeacher123!',
          role: 'teacher',
          subjects: ['Physics'],
        },
      });

      console.log(`Register response status: ${registerResponse.status()}`);
      
      if (!registerResponse.ok()) {
        const errorBody = await registerResponse.text();
        console.log(`Registration failed: ${errorBody}`);
      }
    } catch (error) {
      console.log(`Error during teacher registration:`, error);
    }

    // Step 2: Login with the teacher account to get auth token
    let authToken = '';
    try {
      console.log(`Logging in as teacher: ${teacherEmail}`);
      
      const loginResponse = await page.request.post('http://localhost:8080/api/v1/auth/login', {
        data: {
          email: teacherEmail,
          password: 'SeedTeacher123!',
        },
      });

      console.log(`Login response status: ${loginResponse.status()}`);
      const loginData = await loginResponse.json();
      authToken = loginData.data?.token || loginData.token;
      
      console.log(`Auth token obtained: ${authToken ? 'Yes' : 'No'}`);
    } catch (error) {
      console.log(`Error during login:`, error);
    }

    if (!authToken) {
      console.log('Failed to obtain authentication token, skipping quiz creation');
      return;
    }

    // Step 3: Create quizzes with proper authentication
    const quizzes = [
      {
        Title: 'Physics MCQ past papers',
        Subject: 'Physics',
        DifficultyLevel: 'Medium',
        TimeLimit: 15,
      },
      {
        Title: 'Chemistry Basics Quiz',
        Subject: 'Chemistry',
        DifficultyLevel: 'Easy',
        TimeLimit: 10,
      },
      {
        Title: 'Combined Mathematics Hard Challenge',
        Subject: 'Combined Mathematics',
        DifficultyLevel: 'Hard',
        TimeLimit: 20,
      },
    ];

    const headers = {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    };

    // Create quizzes with questions
    for (const quiz of quizzes) {
      try {
        console.log(`Attempting to create quiz: ${quiz.Title}`);
        
        const createQuizResponse = await page.request.post('http://localhost:8080/api/v1/quizzes', {
          headers,
          data: quiz,
        });

        console.log(`Quiz creation response status: ${createQuizResponse.status()}`);
        const quizResponseText = await createQuizResponse.text();
        console.log(`Quiz response body: ${quizResponseText}`);

        if (createQuizResponse.ok()) {
          const quizData = JSON.parse(quizResponseText);
          console.log(`Quiz data received:`, quizData);
          
          const quizID = quizData.data?.quiz?.QuizID;
          
          console.log(`Extracted QuizID: ${quizID}`);

          if (quizID) {
            // Add questions to quiz
            const questions = [
              {
                Text: 'What is the acceleration due to gravity?',
                Options: ['9.8 m/s²', '10 m/s²', '5 m/s²', '20 m/s²'],
                CorrectAnswerIndex: 0,
                QuizID: quizID,
              },
              {
                Text: 'What is the chemical formula for water?',
                Options: ['H2O', 'CO2', 'H2SO4', 'NaCl'],
                CorrectAnswerIndex: 0,
                QuizID: quizID,
              },
              {
                Text: 'What is 2 + 2?',
                Options: ['3', '4', '5', '6'],
                CorrectAnswerIndex: 1,
                QuizID: quizID,
              },
            ];

            for (const question of questions) {
              console.log(`Creating question for Quiz ${quizID}`);
              const questionResponse = await page.request.post(`http://localhost:8080/api/v1/quizzes/${quizID}/questions`, {
                headers,
                data: question,
              });
              console.log(`Question creation status: ${questionResponse.status()}`);
            }
            
            console.log(`Successfully created quiz ${quiz.Title} with ID ${quizID}`);
          }
        } else {
          console.log(`Failed to create quiz ${quiz.Title}: ${createQuizResponse.status()}`);
        }
      } catch (error) {
        console.log(`Error seeding quiz ${quiz.Title}:`, error);
      }
    }
    
    console.log('Quiz seeding process completed');
  });
});
