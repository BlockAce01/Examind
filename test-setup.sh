#!/bin/bash

# Examind Local Testing Setup Script
# This script sets up a local testing environment that mirrors the CI/CD pipeline

set -e

echo "🚀 Setting up Examind local testing environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Setup PostgreSQL database
setup_database() {
    print_status "Setting up PostgreSQL database..."

    # Check if container already exists
    if docker ps -a --format 'table {{.Names}}' | grep -q "^examind-test-db$"; then
        print_warning "Database container already exists. Removing it..."
        docker rm -f examind-test-db
    fi

    # Start PostgreSQL container
    docker run -d \
        --name examind-test-db \
        -e POSTGRES_USER=postgres \
        -e POSTGRES_PASSWORD=postgres \
        -e POSTGRES_DB=examind_test \
        -p 5432:5432 \
        postgres:15

    print_success "PostgreSQL database started"

    # Wait for database to be ready
    print_status "Waiting for database to be ready..."
    sleep 10

    # Run database schema
    print_status "Setting up database schema..."
    docker exec examind-test-db psql -U postgres -d examind_test -f /tmp/examindDB-schema.sql || {
        # Copy schema file to container and run it
        docker cp backend/config/examindDB-schema.sql examind-test-db:/tmp/
        docker exec examind-test-db psql -U postgres -d examind_test -f /tmp/examindDB-schema.sql
    }

    print_success "Database schema initialized"
}

# Setup environment files
setup_environment() {
    print_status "Setting up environment files..."

    # Backend .env
    cat > backend/.env << EOF
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=examind_test
DB_PASSWORD=postgres
DB_PORT=5432
JWT_SECRET=test_jwt_secret_key_for_local_testing
NODE_ENV=test
EOF

    # Frontend .env.local
    cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3000/api
EOF

    print_success "Environment files created"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."

    # Root dependencies
    npm ci

    # Backend dependencies
    cd backend
    npm ci
    cd ..

    # Frontend dependencies
    cd frontend
    npm ci
    cd ..

    print_success "Dependencies installed"
}

# Build frontend
build_frontend() {
    print_status "Building frontend..."
    cd frontend
    npm run build
    cd ..
    print_success "Frontend built"
}

# Start services
start_services() {
    print_status "Starting backend server..."
    cd backend
    npm start &
    BACKEND_PID=$!
    cd ..

    print_status "Waiting for backend to start..."
    sleep 5

    print_status "Starting frontend server..."
    cd frontend
    npm start &
    FRONTEND_PID=$!
    cd ..

    print_status "Waiting for frontend to start..."
    sleep 5

    print_success "Services started"
    print_warning "Backend PID: $BACKEND_PID"
    print_warning "Frontend PID: $FRONTEND_PID"
}

# Install Playwright browsers
setup_playwright() {
    print_status "Installing Playwright browsers..."
    npx playwright install --with-deps
    print_success "Playwright browsers installed"
}

# Run tests
run_tests() {
    print_status "Running Playwright tests..."
    npx playwright test "$@"
}

# Cleanup function
cleanup() {
    print_status "Cleaning up..."

    # Kill background processes
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi

    # Stop and remove database container
    docker rm -f examind-test-db 2>/dev/null || true

    print_success "Cleanup completed"
}

# Main script
main() {
    # Set trap for cleanup
    trap cleanup EXIT

    case "${1:-all}" in
        "setup")
            check_docker
            setup_database
            setup_environment
            install_dependencies
            setup_playwright
            print_success "Local testing environment setup complete!"
            print_status "Run '$0 test' to execute tests"
            ;;
        "test")
            build_frontend
            start_services
            run_tests "${@:2}"
            ;;
        "all")
            check_docker
            setup_database
            setup_environment
            install_dependencies
            setup_playwright
            build_frontend
            start_services
            run_tests "${@:2}"
            ;;
        "cleanup")
            cleanup
            print_success "Cleanup completed"
            ;;
        *)
            echo "Usage: $0 [command] [options]"
            echo ""
            echo "Commands:"
            echo "  setup     - Setup testing environment (database, dependencies, browsers)"
            echo "  test      - Run tests (assumes environment is already set up)"
            echo "  all       - Setup environment and run tests (default)"
            echo "  cleanup  - Clean up testing environment"
            echo ""
            echo "Examples:"
            echo "  $0 setup                    # Setup environment"
            echo "  $0 test                     # Run all tests"
            echo "  $0 test --headed           # Run tests in headed mode"
            echo "  $0 test tests/1.User*      # Run specific test directory"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"