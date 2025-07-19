# Examind: Online Learning and Community Platform

Examind is a full-stack web application designed to provide an interactive and engaging learning experience. It features a comprehensive set of tools for students and teachers, including quizzes, discussion forums, resource sharing, and a gamified leaderboard to encourage participation.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Features

- **User Authentication:** Secure user registration and login system using JWT and bcrypt.
- **Quizzes:** Create, take, and review quizzes with a variety of question types.
- **Discussion Forums:** Engage in discussions, ask questions, and share knowledge with the community.
- **Resource Sharing:** Upload and download educational resources.
- **Admin Dashboard:** Manage users, quizzes, discussions, and resources.
- **Teacher Dashboard:** Tools for teachers to manage their own content.
- **Gamification:** Earn badges and points for participation, with a leaderboard to track progress.
- **AI-Powered Chatbot:** An intelligent chatbot to assist with quiz results and provide explanations.

## Tech Stack

### Frontend

- **Framework:** Next.js
- **UI Library:** React
- **Styling:** Tailwind CSS
- **State Management & Forms:** Formik, Yup
- **Data Visualization:** Chart.js

### Backend

- **Framework:** Node.js, Express
- **Database:** PostgreSQL
- **Authentication:** bcrypt, JSON Web Tokens

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)
- PostgreSQL

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/BlockAce01/Examind.git
    cd Examind
    ```

2.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Install frontend dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

### Configuration

1.  **Backend:**
    - Create a `.env` file in the `backend` directory.
    - Add the following environment variables:
      ```
      DB_USER=your_db_user
      DB_HOST=your_db_host
      DB_DATABASE=your_db_name
      DB_PASSWORD=your_db_password
      DB_PORT=your_db_port
      JWT_SECRET=your_jwt_secret
      ```

2.  **Database:**
    - Make sure your PostgreSQL server is running.
    - Create a database named `examindDB`.
    - Run the schema file `backend/config/examindDB-schema.sql` to create the necessary tables.

### Running the Application

1.  **Start the backend server:**
    ```bash
    cd backend
    npm run dev
    ```
    The backend will be running on `http://localhost:3001`.

2.  **Start the frontend development server:**
    ```bash
    cd frontend
    npm run dev
    ```
    The frontend will be running on `http://localhost:3000`.

## API Endpoints

The backend provides a RESTful API with the following main endpoints:

- `/api/auth`: User authentication (login, register)
- `/api/users`: User management
- `/api/quizzes`: Quiz creation and management
- `/api/discussions`: Discussion forums
- `/api/resources`: Resource sharing
- `/api/badges`: Badge and gamification system
- `/api/stats`: Application statistics
- `/api/ai-chat`: AI chatbot functionality

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.
