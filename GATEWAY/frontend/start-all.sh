#!/bin/bash

# Axiom Full Stack Startup Script
# This script starts both frontend and backend

echo "🚀 Starting Axiom Full Stack Application..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Step 1: Start databases
echo -e "${BLUE}📊 Step 1: Starting MongoDB and Redis...${NC}"
cd backend
docker-compose up -d mongodb redis

# Wait for databases to be ready
echo "Waiting for databases to initialize..."
sleep 5

# Step 2: Start backend services
echo ""
echo -e "${BLUE}⚙️  Step 2: Starting backend services...${NC}"
./start-dev.sh

# Wait for services to start
echo "Waiting for services to start..."
sleep 3

# Step 3: Start frontend
echo ""
echo -e "${BLUE}🎨 Step 3: Starting frontend...${NC}"
cd ..

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Start frontend in the background (or you can remove & to run in foreground)
npm run dev &
FRONTEND_PID=$!
echo $FRONTEND_PID > frontend.pid

echo ""
echo -e "${GREEN}✅ All services started successfully!${NC}"
echo ""
echo "📋 Access your application:"
echo "   Frontend:  http://localhost:5173"
echo "   Gateway:   http://localhost:3000"
echo ""
echo "📊 View backend logs:"
echo "   cd backend && tail -f logs/*.log"
echo ""
echo "🛑 To stop everything:"
echo "   ./stop-all.sh"
echo ""
