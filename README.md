# Workshop Management System (Microservices)

A multi-tenant workshop management system built with Node.js.
Designed for car repair shops to manage bookings, job cards, technicians, and billing.

---

## Overview

This system uses a microservices architecture with:

* API Gateway (entry point)
* Auth Service (authentication + tenants)
* Workshop Service (core business logic)
* PostgreSQL (database)

Each repair shop is treated as a **tenant**.
All data is isolated per tenant.

---

## Architecture

```
Client
  ├── Auth Service (login)
  └── API Gateway
         ├── Workshop Service
         └── (Future) Billing Service
```

---

## Tech Stack

* Node.js (v20+)
* TypeScript
* Express
* PostgreSQL
* Prisma ORM
* Docker + Docker Compose
* JWT (authentication)

---

## Services

### 1. API Gateway

* Routes requests to services
* Validates JWT
* Injects headers:

  * x-user-id
  * x-tenant-id
  * x-user-role

---

### 2. Auth Service

Handles:

* Tenant creation
* User management
* Login
* JWT issuing

---

### 3. Workshop Service

Handles:

* Clients
* Vehicles
* Appointments
* Job Cards
* Work Orders

---

## Project Structure

```
workshop-system/
  auth-service/
  gateway-service/
  workshop-service/
  shared/
  docker-compose.yml
```

---

## Environment Variables

### Auth Service

```
PORT=3001
JWT_SECRET=supersecret
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/workshop
```

---

### Gateway Service

```
PORT=3000
JWT_SECRET=supersecret
AUTH_SERVICE_URL=http://auth-service:3001
WORKSHOP_SERVICE_URL=http://workshop-service:3002
```

---

### Workshop Service

```
PORT=3002
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/workshop
```

---

## Running the System

### Start services

```
docker-compose up --build
```

---

### Check services

* Gateway: http://localhost:3000/health
* Auth: http://localhost:3001/health
* Workshop: http://localhost:3002/health

---

## Authentication Flow

1. Client logs in via Auth Service
2. Auth returns JWT
3. Client calls API Gateway with JWT
4. Gateway validates token
5. Request forwarded to service with tenant context

---

## Example Login

```
POST /auth/login
```

Body:

```
{
  "email": "admin@test.com",
  "password": "password123",
  "tenantId": "shop-123"
}
```

---

## Example Protected Request

```
GET /workshop/test
Authorization: Bearer <token>
```

---

## Development Mode

* Uses `ts-node-dev`
* No build step required
* Hot reload enabled

---

## Production Mode (later)

* Compile TypeScript (`npm run build`)
* Run compiled code (`dist/`)
* Use optimized Docker images

---

## Roadmap

### Phase 0

* Auth + Gateway + basic service

### Phase 1

* Clients
* Vehicles
* Appointments
* Job Cards

### Phase 2

* Work Orders
* Technician management

### Phase 3

* Billing Service
* Invoices + payments

### Phase 4

* Client portal
* Notifications

---

## Key Design Principles

* Multi-tenant from day one
* Each service owns its database
* No shared database between services
* JWT carries tenant context
* Gateway handles routing only

---

## Next Steps

* Replace mock login with Prisma DB
* Implement client + vehicle modules
* Add job card workflow
* Introduce billing service

---
