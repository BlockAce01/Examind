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
- [Project Structure](#project-structure)
- [Contributing](#contributing)
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
- **Dependencies:**
  - `bcrypt`: Password hashing
  - `cors`: Cross-Origin Resource Sharing
  - `dotenv`: Environment variable management
  - `express`: Web framework
  - `jsonwebtoken`: JWT authentication
  - `pg`: PostgreSQL client

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
    The backend will be running on `http://localhost:8080`.

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

## Project Structure

The project is organized into two main directories: `frontend` and `backend`.

### Frontend

The `frontend` directory contains the Next.js application, with the following key folders:

-   `src/app`: Main application pages and routes
-   `src/components`: Reusable React components
-   `src/lib`: Utility functions and API helpers
-   `src/context`: React context providers
-   `public`: Static assets (images, fonts)

### Backend

The `backend` directory contains the Node.js/Express server, with the following structure:

-   `config`: Database configuration and schema
-   `controllers`: Request handlers and business logic
-   `middleware`: Express middleware functions
-   `routes`: API route definitions

## Contributing

Contributions are welcome! If you'd like to contribute to Examind, please follow these steps:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature or bug fix:
    ```bash
    git checkout -b feature/your-feature-name
    ```
3.  **Make your changes** and commit them with a clear message.
4.  **Push your changes** to your forked repository.
5.  **Create a pull request** to the `main` branch of the original repository.

Please ensure your code follows the existing style and that you have tested your changes thoroughly.

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.
