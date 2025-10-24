# Examind: Online Learning and Community Platform

[![CI/CD Pipeline](https://github.com/BlockAce01/Examind/actions/workflows/ci-cd.yml/badge.svg?branch=test)](https://github.com/BlockAce01/Examind/actions/workflows/ci-cd.yml)
[![Playwright Tests](https://github.com/BlockAce01/Examind/actions/workflows/playwright.yml/badge.svg?branch=test)](https://github.com/BlockAce01/Examind/actions/workflows/playwright.yml)

Examind is a full-stack web application designed to provide an interactive and engaging learning experience. It features a comprehensive set of tools for students and teachers, including quizzes, discussion forums, resource sharing, and a gamified leaderboard to encourage participation.

## Table of Contents

- [Examind: Online Learning and Community Platform](#examind-online-learning-and-community-platform)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
    - [Frontend](#frontend)
    - [Backend](#backend)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Docker Setup (Recommended for Testing)](#docker-setup-recommended-for-testing)
    - [Configuration](#configuration)
    - [Running the Application](#running-the-application)
  - [API Endpoints](#api-endpoints)
  - [Project Structure](#project-structure)
    - [Frontend](#frontend-1)
    - [Backend](#backend-1)
  - [Testing](#testing)
    - [Test Structure](#test-structure)
    - [Running Tests](#running-tests)
    - [Test Configuration](#test-configuration)
    - [Writing Tests](#writing-tests)
  - [CI/CD Pipeline](#cicd-pipeline)
    - [Workflows](#workflows)
      - [1. CI/CD Pipeline (`ci-cd.yml`)](#1-cicd-pipeline-ci-cdyml)
      - [2. Playwright Tests (`playwright.yml`)](#2-playwright-tests-playwrightyml)
    - [Pipeline Features](#pipeline-features)
    - [Test Reports](#test-reports)
    - [Accessing Test Results](#accessing-test-results)
    - [Running Locally vs CI](#running-locally-vs-ci)
    - [Local Testing Script](#local-testing-script)
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

- **Framework:** Next.js 15.2.4 (with Turbopack)
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4
- **State Management & Forms:** Formik, Yup
- **Data Visualization:** Chart.js, react-chartjs-2
- **UI Components:** Heroicons React
- **HTTP Client:** Axios
- **Date Handling:** date-fns

### Backend

- **Runtime:** Node.js 18+
- **Framework:** Express.js 5.1
- **Database:** PostgreSQL 15
- **Authentication:** bcrypt, JSON Web Tokens (JWT)
- **HTTP Client:** Axios
- **Environment Management:** dotenv
- **CORS:** Express CORS middleware
- **Database Client:** pg (node-postgres)

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

### Docker Setup (Recommended for Testing)

For a complete development and testing environment using Docker:

```bash
# Build and start all services
docker-compose up --build

# The following services will start:
# - PostgreSQL 15 (postgres:5432)
# - Backend (http://localhost:8080)
# - Frontend (http://localhost:3000)
# - Playwright Tests (runs tests automatically)
```

**Note**: Docker Compose automatically:
- Creates the `examind_test_database` database
- Loads the schema from `backend/config/examindDB-schema.sql`
- Sets up environment variables for both services
- Ensures proper service startup order with healthchecks

To stop services:
```bash
docker-compose down

# To also remove the database volume (fresh start):
docker-compose down -v
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
    - Create a database named `examind_test_database` (or `examindDB` for development).
    - Run the schema file `backend/config/examindDB-schema.sql` to create the necessary tables:
      ```bash
      PGPASSWORD=your_password psql -h localhost -U your_user -d your_database -f backend/config/examindDB-schema.sql
      ```

3.  **Frontend:**
    - Create a `.env.local` file in the `frontend` directory.
    - Add the following environment variable:
      ```
      NEXT_PUBLIC_API_URL=http://localhost:8080
      ```
    - ⚠️ **Important**: The `NEXT_PUBLIC_API_URL` should be **without** the `/api/v1` suffix. The frontend code automatically appends `/api/v1` to all API requests.

### Running the Application

1.  **Start the backend server:**
    ```bash
    cd backend
    npm start           # Production mode
    # OR
    npm run dev        # Development mode with auto-reload (requires nodemon)
    ```
    The backend will be running on `http://localhost:8080`.

2.  **Start the frontend development server:**
    ```bash
    cd frontend
    npm run dev        # Development mode with Turbopack
    # OR
    npm start         # Production mode (requires npm run build first)
    ```
    The frontend will be running on `http://localhost:3000`.

## API Endpoints

The backend provides a RESTful API with the following main endpoints (all prefixed with `/api/v1`):

- `/auth`: User authentication (login, register, logout)
- `/users`: User management and admin operations
- `/quizzes`: Quiz creation, management, and taking
- `/discussions`: Discussion forums and community features
- `/resources`: Educational resource sharing and management
- `/badges`: Badge and gamification system
- `/stats`: Application statistics and analytics
- `/ai-chat`: AI chatbot functionality and conversational features
- `/subjects`: Subject management and filtering

**Health Check Endpoint:**
- `/api/health`: Service health status (no authentication required)

## Project Structure

The project is organized into two main directories: `frontend` and `backend`.

### Frontend

The `frontend` directory contains the Next.js application, with the following key structure:

-   `src/app`: Next.js App Router with pages and layouts
-   `src/components`: Reusable React components (page objects, UI components)
-   `src/lib`: Utility functions and API client helpers
-   `src/context`: React context providers (e.g., AuthContext)
-   `src/types`: TypeScript type definitions
-   `src/utils`: Helper functions and utilities
-   `src/hooks`: Custom React hooks
-   `public`: Static assets (images, badges, favicons)

### Backend

The `backend` directory contains the Node.js/Express server, with the following structure:

-   `config`: Database configuration, connection pool, and schema (`examindDB-schema.sql`)
-   `controllers`: Request handlers and business logic for each feature
-   `middleware`: Express middleware functions (authentication, logging, error handling)
-   `routes`: API route definitions and endpoint mappings
-   `server.js`: Main Express application entry point

## Testing

Examind uses [Playwright](https://playwright.dev/) for end-to-end testing to ensure the application works correctly from a user's perspective.

### Test Structure

The `tests/` directory contains comprehensive test suites organized by functionality:

- **1.User Authentication and Registration**: Login, registration, session management
- **2.Dashboard and User Profile**: User dashboard, profile management, leaderboard
- **3.Quiz Management and Taking**: Quiz creation, taking quizzes, navigation
- **4.Resource Management**: Resource upload, download, filtering
- **5.Discussion Forums**: Discussion creation, posting, moderation
- **6.Gamification - Points and Badges**: Badge earning, point system, achievements
- **7.Teacher Dashboard**: Teacher-specific features and content management
- **8.Admin Dashboard**: Administrative functions and user management
- **9.Subject Management**: Subject filtering across different features
- **10.Edge Cases and Error Handling**: Error scenarios, invalid inputs, security tests

### Running Tests

1. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

2. **Run all tests:**
   ```bash
   npx playwright test
   ```

3. **Run specific test file:**
   ```bash
   npx playwright test tests/1.User Authentication and Registration/01-student-registration-valid-data.spec.ts
   ```

4. **Run tests with UI mode:**
   ```bash
   npx playwright test --ui
   ```

5. **Run tests in headed mode (visible browser):**
   ```bash
   npx playwright test --headed
   ```

6. **Generate test report:**
   ```bash
   npx playwright show-report
   ```

### Test Configuration

- **Framework**: Playwright v1.40+ with TypeScript
- **Browser**: Chromium (headless by default), with cross-browser support available (Firefox, WebKit)
- **Page Objects**: Reusable page classes in `tests/pages/` for maintainable, DRY tests
- **Test Data**: Seed data in `tests/seed.spec.ts` for consistent test environments
- **Execution**: Sequential execution (1 worker) for stability; parallel execution available
- **Reporting**: HTML reports, JSON output, JUnit XML for CI/CD integration
- **Retry Strategy**: 0 retries locally, 2 retries in CI for flaky test handling
- **Trace Recording**: Enabled on first retry to debug failures

### Writing Tests

Tests follow the **Page Object Model (POM)** pattern for better maintainability and reusability. Each test file includes:

- **Clear test descriptions**: Descriptive test names that explain what is being tested
- **Page object usage**: Using `tests/pages/` classes to encapsulate UI interaction logic
- **Setup and teardown logic**: Proper test isolation and cleanup
- **Assertions**: Clear assertions for expected behavior and outcomes
- **Error handling**: Comprehensive handling of edge cases and error scenarios
- **Data generation**: Use of helper methods like `generateUniqueEmail()` for test data

Example test structure:
```typescript
test('1.1 Student Registration - Valid Data', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  
  // Setup
  const uniqueEmail = registerPage.generateUniqueEmail('john.doe');
  
  // Act
  await registerPage.navigateToRegister();
  await registerPage.registerStudent('John Doe', uniqueEmail, 'SecurePass123!', subjects);
  
  // Assert
  await registerPage.verifySuccessMessage();
  await registerPage.verifyFormCleared();
});
```

## CI/CD Pipeline

Examind uses GitHub Actions for continuous integration and automated testing **on the `test` branch only**, ensuring code quality and preventing regressions.

### Workflows

#### 1. CI/CD Pipeline (`ci-cd.yml`)
Comprehensive pipeline that runs on every push and pull request to the `test` branch:

- **Quality Checks**: Linting and TypeScript type checking
- **Build**: Frontend build verification
- **E2E Tests**: Full Playwright test suite with database setup
- **Security**: Dependency vulnerability scanning

#### 2. Playwright Tests (`playwright.yml`)
Dedicated end-to-end testing workflow for the `test` branch:

- PostgreSQL database setup
- Backend and frontend server startup
- Complete test execution
- Test artifact uploads and detailed reporting

### Pipeline Features

- **Database Setup**: Automatic PostgreSQL setup with schema initialization
- **Service Dependencies**: Backend and frontend servers start automatically
- **Artifact Management**: Test results and reports are preserved for 30 days
- **Parallel Jobs**: Quality checks run in parallel with builds
- **Environment Variables**: Secure handling of secrets and configuration
- **Status Reporting**: GitHub step summaries with direct links to results

### Test Reports

After each test run on the `test` branch, you can access:

- **GitHub Actions**: Check the Actions tab for workflow runs
- **Test Results**: Download test artifacts (screenshots, videos, traces)
- **Playwright Report**: Interactive HTML report with detailed test execution
- **Status Badges**: Real-time status shown in the README
- **GitHub Summary**: Quick overview in each workflow run summary

### Accessing Test Results

1. Go to the **Actions** tab in your GitHub repository
2. Click on the latest workflow run
3. Scroll down to the **Artifacts** section
4. Download `test-results` and `playwright-report` archives
5. Extract and open `playwright-report/index.html` for detailed results

### Running Locally vs CI

The CI pipeline replicates your local development environment:

- Uses the same Node.js version (18)
- Installs dependencies with `npm ci` for reproducible builds
- Sets up PostgreSQL with the same schema
- Runs tests against built frontend and running backend
- Provides detailed reporting and artifact storage

### Local Testing Script

For easier local testing that mirrors the CI environment, use the provided test setup script:

```bash
# Setup testing environment (one-time)
./test-setup.sh setup

# Run tests
./test-setup.sh test

# Setup and run tests in one command
./test-setup.sh all

# Run tests in headed mode
./test-setup.sh test --headed

# Run specific test directory
./test-setup.sh test "tests/1.User Authentication and Registration/*"

# Cleanup testing environment
./test-setup.sh cleanup
```

The script automatically:
- Starts a PostgreSQL container
- Sets up the database schema
- Creates necessary environment files
- Installs dependencies and Playwright browsers
- Builds the frontend
- Starts backend and frontend servers
- Runs the test suite

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
