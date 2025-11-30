# API Documentation

Complete API reference for all microservices in the API Gateway Management System.

---

## Auth Service (Port 3001)

### POST /auth/register

Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "65f1234567890abcdef12345",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errors:**
- `400` - User already exists
- `400` - Validation error

---

### POST /auth/login

Authenticate a user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "65f1234567890abcdef12345",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errors:**
- `401` - Invalid credentials
- `400` - Missing email or password

---

## API Key Service (Port 3002)

### POST /apikeys

Create a new API key.

**Request:**
```json
{
  "userId": "65f1234567890abcdef12345",
  "name": "Production API Key"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "65f9876543210fedcba98765",
    "userId": "65f1234567890abcdef12345",
    "key": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6...",
    "name": "Production API Key",
    "totalRequests": 0,
    "blockedRequests": 0,
    "averageLatency": 0,
    "isActive": true,
    "createdAt": "2025-11-21T12:00:00.000Z",
    "updatedAt": "2025-11-21T12:00:00.000Z"
  }
}
```

---

### GET /apikeys/:userId

Get all API keys for a user.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65f9876543210fedcba98765",
      "userId": "65f1234567890abcdef12345",
      "key": "a1b2c3d4...",
      "name": "Production API Key",
      "totalRequests": 1523,
      "blockedRequests": 12,
      "averageLatency": 145.5,
      "isActive": true
    }
  ]
}
```

---

### GET /apikeys/validate/:apiKey

Validate an API key.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "apiKey": {
      "_id": "65f9876543210fedcba98765",
      "userId": "65f1234567890abcdef12345",
      "key": "a1b2c3d4...",
      "name": "Production API Key",
      "isActive": true
    }
  }
}
```

**Invalid Key:**
```json
{
  "success": true,
  "data": {
    "valid": false
  }
}
```

---

### PUT /apikeys/:id/rotate

Rotate an API key (generate new key).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65f9876543210fedcba98765",
    "key": "NEW_KEY_HERE...",
    "name": "Production API Key",
    ...
  }
}
```

---

### PATCH /apikeys/:id/stats

Update API key statistics (used internally by gateway).

**Request:**
```json
{
  "totalRequests": 10,
  "blockedRequests": 1,
  "averageLatency": 150.5
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65f9876543210fedcba98765",
    "totalRequests": 1533,
    "blockedRequests": 13,
    "averageLatency": 145.8,
    ...
  }
}
```

---

### DELETE /apikeys/:id

Delete (deactivate) an API key.

**Response (200):**
```json
{
  "success": true,
  "message": "API Key deleted successfully"
}
```

---

## Service Management Service (Port 3003)

### POST /services

Create a new backend service.

**Request:**
```json
{
  "name": "JSONPlaceholder API",
  "baseUrl": "https://jsonplaceholder.typicode.com",
  "description": "Fake REST API for testing",
  "status": "UP"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "65fa1234567890abcdef56789",
    "name": "JSONPlaceholder API",
    "baseUrl": "https://jsonplaceholder.typicode.com",
    "status": "UP",
    "avgLatency": 0,
    "description": "Fake REST API for testing",
    "createdAt": "2025-11-21T12:00:00.000Z",
    "updatedAt": "2025-11-21T12:00:00.000Z"
  }
}
```

---

### GET /services

Get all services.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65fa1234567890abcdef56789",
      "name": "JSONPlaceholder API",
      "baseUrl": "https://jsonplaceholder.typicode.com",
      "status": "UP",
      "avgLatency": 125.3,
      "description": "Fake REST API for testing"
    }
  ]
}
```

---

### GET /services/:id

Get a specific service.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65fa1234567890abcdef56789",
    "name": "JSONPlaceholder API",
    "baseUrl": "https://jsonplaceholder.typicode.com",
    "status": "UP",
    "avgLatency": 125.3
  }
}
```

**Errors:**
- `404` - Service not found

---

### PUT /services/:id

Update a service.

**Request:**
```json
{
  "status": "DOWN",
  "avgLatency": 200.5
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65fa1234567890abcdef56789",
    "status": "DOWN",
    "avgLatency": 200.5,
    ...
  }
}
```

---

### DELETE /services/:id

Delete a service.

**Response (200):**
```json
{
  "success": true,
  "message": "Service deleted successfully"
}
```

---

## Route Service (Port 3004)

### POST /routes

Create a new route.

**Request:**
```json
{
  "path": "/posts",
  "method": "GET",
  "serviceId": "65fa1234567890abcdef56789",
  "destinationPath": "/posts",
  "rateLimit": 60
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "65fb9876543210fedcba12345",
    "path": "/posts",
    "method": "GET",
    "serviceId": "65fa1234567890abcdef56789",
    "destinationPath": "/posts",
    "isActive": true,
    "rateLimit": 60,
    "createdAt": "2025-11-21T12:00:00.000Z",
    "updatedAt": "2025-11-21T12:00:00.000Z"
  }
}
```

---

### GET /routes

Get all active routes.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65fb9876543210fedcba12345",
      "path": "/posts",
      "method": "GET",
      "serviceId": {
        "_id": "65fa1234567890abcdef56789",
        "name": "JSONPlaceholder API",
        "baseUrl": "https://jsonplaceholder.typicode.com",
        "status": "UP"
      },
      "isActive": true,
      "rateLimit": 60
    }
  ]
}
```

---

### GET /routes/lookup?path=/posts&method=GET

Lookup a route by path and method.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65fb9876543210fedcba12345",
    "path": "/posts",
    "method": "GET",
    "serviceId": {
      "_id": "65fa1234567890abcdef56789",
      "name": "JSONPlaceholder API",
      "baseUrl": "https://jsonplaceholder.typicode.com",
      "status": "UP"
    },
    "rateLimit": 60
  }
}
```

**Not Found:**
```json
{
  "success": true,
  "data": null
}
```

---

### PUT /routes/:id

Update a route.

**Request:**
```json
{
  "rateLimit": 100,
  "isActive": true
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65fb9876543210fedcba12345",
    "rateLimit": 100,
    "isActive": true,
    ...
  }
}
```

---

### DELETE /routes/:id

Delete (deactivate) a route.

**Response (200):**
```json
{
  "success": true,
  "message": "Route deleted successfully"
}
```

---

## Rate Limit Service (Port 3005)

### POST /ratelimit/check

Check if request is within rate limit.

**Request:**
```json
{
  "apiKey": "a1b2c3d4...",
  "routeId": "65fb9876543210fedcba12345",
  "limit": 60
}
```

**Response (200) - Allowed:**
```json
{
  "success": true,
  "data": {
    "allowed": true,
    "remaining": 45,
    "resetAt": "2025-11-21T12:01:00.000Z"
  }
}
```

**Response (200) - Blocked:**
```json
{
  "success": true,
  "data": {
    "allowed": false,
    "remaining": 0,
    "resetAt": "2025-11-21T12:01:00.000Z"
  }
}
```

---

## Logs Service (Port 3006)

### POST /logs

Create a log entry (used internally by gateway).

**Request:**
```json
{
  "timestamp": "2025-11-21T12:00:00.000Z",
  "method": "GET",
  "endpoint": "/posts",
  "statusCode": 200,
  "latency": 145,
  "apiKey": "a1b2c3d4...",
  "userId": "65f1234567890abcdef12345"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "65fc1234567890abcdef98765",
    "timestamp": "2025-11-21T12:00:00.000Z",
    "method": "GET",
    "endpoint": "/posts",
    "statusCode": 200,
    "latency": 145,
    "apiKey": "a1b2c3d4..."
  }
}
```

---

### GET /logs

Get logs with filters and pagination.

**Query Parameters:**
- `apiKey` (optional) - Filter by API key
- `status` (optional) - Filter by status code
- `from` (optional) - Start date (ISO 8601)
- `to` (optional) - End date (ISO 8601)
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 20) - Items per page

**Example:**
```
GET /logs?apiKey=a1b2c3d4...&status=200&page=1&limit=10
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "_id": "65fc1234567890abcdef98765",
        "timestamp": "2025-11-21T12:00:00.000Z",
        "method": "GET",
        "endpoint": "/posts",
        "statusCode": 200,
        "latency": 145,
        "apiKey": "a1b2c3d4..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1523,
      "pages": 153
    }
  }
}
```

---

## Metrics Service (Port 3007)

### POST /metrics

Create a metrics entry (used internally by gateway every 5 seconds).

**Request:**
```json
{
  "timestamp": "2025-11-21T12:00:00.000Z",
  "apiKey": "a1b2c3d4...",
  "avgLatency": 145.5,
  "totalRequests": 42,
  "blockedRequests": 3,
  "statusBreakdown": {
    "2xx": 38,
    "4xx": 1,
    "5xx": 0
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "65fd1234567890abcdef12345",
    "timestamp": "2025-11-21T12:00:00.000Z",
    "apiKey": "a1b2c3d4...",
    "avgLatency": 145.5,
    "totalRequests": 42,
    "blockedRequests": 3,
    "statusBreakdown": {
      "2xx": 38,
      "4xx": 1,
      "5xx": 0
    },
    "interval": "5s"
  }
}
```

---

### GET /metrics/:apiKey

Get metrics for an API key with optional time range.

**Query Parameters:**
- `from` (optional) - Start date (ISO 8601)
- `to` (optional) - End date (ISO 8601)

**Example:**
```
GET /metrics/a1b2c3d4...?from=2025-11-21T00:00:00Z&to=2025-11-21T23:59:59Z
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "metrics": [
      {
        "_id": "65fd1234567890abcdef12345",
        "timestamp": "2025-11-21T12:00:00.000Z",
        "apiKey": "a1b2c3d4...",
        "avgLatency": 145.5,
        "totalRequests": 42,
        "blockedRequests": 3,
        "statusBreakdown": {
          "2xx": 38,
          "4xx": 1,
          "5xx": 0
        }
      }
    ],
    "aggregated": {
      "totalRequests": 1523,
      "blockedRequests": 45,
      "avgLatency": 152.3,
      "statusBreakdown": {
        "2xx": 1450,
        "4xx": 28,
        "5xx": 0
      }
    }
  }
}
```

---

## API Gateway (Port 3000)

### ALL /proxy/:apiKey/*

Main proxy endpoint - forwards requests to backend services.

**URL Format:**
```
http://localhost:3000/proxy/{API_KEY}/{PATH}
```

**Example:**
```bash
curl http://localhost:3000/proxy/a1b2c3d4.../posts
```

**Flow:**
1. Validates API key
2. Checks rate limit
3. Looks up route
4. Fetches service details
5. Proxies request to backend
6. Measures latency
7. Logs request
8. Records metrics (buffered)
9. Returns response

**Response:** Proxied response from backend service

**Errors:**
- `400` - API key missing
- `401` - Invalid API key
- `404` - Route not found
- `429` - Rate limit exceeded
- `503` - Service unavailable
- `500` - Internal server error

---

## Error Response Format

All services return errors in this format:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "stack": "..." // Only in development
  }
}
```

---

## Rate Limiting

- **Algorithm**: Sliding window
- **Storage**: Redis sorted sets
- **Window**: 60 seconds (configurable per route)
- **Headers**: None (check response for rate limit info)

---

## Caching (Gateway Internal)

The gateway caches:

- **Routes**: 5 seconds TTL
- **Services**: 5 seconds TTL
- **API Keys**: 10 seconds TTL

This reduces inter-service traffic by ~80%.

---

## Metrics Buffering

- **Interval**: 5 seconds
- **Storage**: In-memory buffer
- **Flush**: Automatic background job
- **Graceful Shutdown**: Flushes remaining metrics

---

## Health Checks

All services expose `/health`:

```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "UP",
  "service": "api-gateway",
  "uptime": 12345.67
}
```
