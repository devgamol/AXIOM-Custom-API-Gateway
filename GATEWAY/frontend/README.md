# 🚀 Axiom - API Gateway Platform

A modern API gateway platform with microservices architecture, built with React and Node.js.

## Quick Start (Easiest Way)

```bash
# Start everything (databases + backend + frontend)
./start-all.sh

# Open browser to http://localhost:5173

# When done, stop everything
./stop-all.sh
```

## Manual Start

### 1. Start Databases
```bash
cd backend
docker-compose up -d mongodb redis
```

### 2. Start Backend Services
```bash
cd backend
./start-dev.sh

# View logs
tail -f logs/*.log
```

### 3. Start Frontend
```bash
# From project root
npm run dev
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                        │
│                   http://localhost:5173                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  API Gateway :3000                          │
└──┬──────┬───────┬────────┬────────┬────────┬────────┬──────┘
   │      │       │        │        │        │        │
   ▼      ▼       ▼        ▼        ▼        ▼        ▼
┌─────┐┌─────┐┌──────┐┌──────┐┌──────┐┌──────┐┌─────────┐
│Auth ││Keys ││Servs ││Routes││Logs  ││Metric││RateLimit│
│:3001││:3002││:3003 ││:3004 ││:3006 ││:3007 ││:3005    │
└─────┘└─────┘└──────┘└──────┘└──────┘└──────┘└─────────┘
   │      │       │        │        │        │        │
   └──────┴───────┴────────┴────────┴────────┴────────┘
                      │                      │
                      ▼                      ▼
              ┌──────────────┐      ┌──────────────┐
              │   MongoDB    │      │    Redis     │
              │   :27017     │      │    :6379     │
              └──────────────┘      └──────────────┘
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 5173 | React UI (Vite) |
| Gateway | 3000 | API Gateway & Proxy |
| Auth | 3001 | User authentication & JWT |
| API Keys | 3002 | API key management |
| Services | 3003 | Service registry |
| Routes | 3004 | Route configuration |
| Rate Limit | 3005 | Rate limiting (Redis) |
| Logs | 3006 | Request logging |
| Metrics | 3007 | Analytics & metrics |

## Tech Stack

### Frontend
- React 19
- React Router
- Vite
- Tailwind CSS
- Framer Motion
- Recharts
- Axios

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- Redis
- JWT Authentication
- Docker & Docker Compose

## Health Checks

```bash
# Check all services
curl http://localhost:3000/health  # Gateway
curl http://localhost:3001/health  # Auth
curl http://localhost:3002/health  # API Keys
curl http://localhost:3003/health  # Services
curl http://localhost:3004/health  # Routes
curl http://localhost:3005/health  # Rate Limit
curl http://localhost:3006/health  # Logs
curl http://localhost:3007/health  # Metrics
```

## Environment Variables

Backend services use `.env` file (already created from `.env.example`):

```env
MONGODB_URI=mongodb://admin:admin123@localhost:27017/axiom?authSource=admin
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## Development

### Watch Backend Logs
```bash
cd backend
tail -f logs/*.log
```

### Restart a Specific Service
```bash
cd backend/<service-name>
npm start
```

### Clear All Logs
```bash
cd backend
rm -rf logs/*.log
```

## Troubleshooting

### MongoDB Connection Failed
```bash
# Start MongoDB
cd backend
docker-compose up -d mongodb

# Verify it's running
docker ps | grep mongo
```

### Redis Connection Failed
```bash
# Start Redis
cd backend
docker-compose up -d redis

# Test connection
docker exec -it axiom-redis redis-cli ping
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Reset Everything
```bash
# Stop all services
./stop-all.sh

# Remove all Docker containers and volumes
cd backend
docker-compose down -v

# Restart
./start-all.sh
```

## Production Deployment

For production deployment, use Docker Compose:

```bash
cd backend
docker-compose up -d

# Build frontend
cd ..
npm run build

# Serve frontend with nginx or similar
```

## Documentation

- [Complete Startup Guide](/.gemini/antigravity/brain/c2067b63-511d-4be7-964b-8756ea3292aa/startup_guide.md)
- [Connection Logging Summary](/.gemini/antigravity/brain/c2067b63-511d-4be7-964b-8756ea3292aa/connection_logging_summary.md)

## License

MIT
