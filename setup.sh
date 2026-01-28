#!/bin/bash

# Stock Trading Application Setup Script

echo "================================"
echo "Stock Trading App Setup"
echo "================================"
echo ""

# Backend Setup
echo "Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -q -r requirements.txt

# Run migrations
echo "Running database migrations..."
python manage.py migrate

# Create superuser prompt
echo ""
echo "Would you like to create an admin superuser? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    python manage.py createsuperuser
fi

cd ..

# Frontend Setup
echo ""
echo "Setting up frontend..."
cd frontend

# Install Node dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
fi

cd ..

echo ""
echo "================================"
echo "Setup Complete!"
echo "================================"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  python manage.py runserver"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend"
echo "  npm start"
echo ""
echo "Then visit:"
echo "  Frontend: http://localhost:3000"
echo "  Admin Panel: http://localhost:8000/admin"
echo "  API: http://localhost:8000/api"
echo ""
