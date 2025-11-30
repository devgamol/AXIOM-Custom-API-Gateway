#!/bin/bash

# Axiom Full Stack Stop Script
# This script stops both frontend and backend

echo "🛑 Stopping Axiom Full Stack Application..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Stop frontend
if [ -f "frontend.pid" ]; then
    FRONTEND_PID=$(cat frontend.pid)
    echo "Stopping frontend (PID: $FRONTEND_PID)..."
    kill $FRONTEND_PID 2>/dev/null
    rm frontend.pid
fi

# Stop backend services
echo "Stopping backend services..."
cd backend
./stop-dev.sh 2>/dev/null

# Stop databases (optional - comment out if you want to keep them running)
echo "Stopping databases..."
docker-compose down

cd ..

echo ""
echo -e "${GREEN}✅ All services stopped!${NC}"
