# NestJS Production-Ready Boilerplate

A modular and scalable NestJS boilerplate with best practices, production-ready features, and clean architecture.

## Features

- **Core**: NestJS, TypeScript, Node.js LTS
- **Database**: Prisma ORM, PostgreSQL
- **Authentication**: JWT Access & Refresh Tokens, Passport.js
- **Authorization**: RBAC (Role-Based Access Control) with custom decorators and guards
- **Validation**: class-validator, class-transformer, Global ValidationPipe
- **Configuration**: @nestjs/config, Joi environment validation
- **Documentation**: Swagger API Documentation (`/docs`)
- **Logging**: Pino Logger (pino-http, pino-pretty)
- **Security**: Helmet, CORS, Rate limiting (Throttler)
- **Error Handling**: Global Exception Filter, Standard API response format
- **File Upload**: Local storage abstraction
- **Mail**: SMTP service with EJS template support
- **Health Check**: @nestjs/terminus
- **CI/CD**: GitHub Actions
- **Quality**: ESLint, Prettier, Husky, lint-staged, commitlint

## Project Structure

```
src/
├── common/         # Shared decorators, filters, guards, interceptors, pipes, helpers
├── config/         # Configuration loaders and validation
├── prisma/         # Prisma service and module
├── modules/        # Feature modules (Auth, Users, Roles, etc.)
├── app.module.ts   # Main application module
└── main.ts         # Application entry point
```

## Getting Started

### 1. Prerequisites
- Node.js LTS
- Docker & Docker Compose

### 2. Installation
```bash
npm install
```

### 3. Setup Environment
```bash
cp .env.example .env
```
Update the `.env` file with your credentials.

### 4. Database Migration & Seeding
```bash
# Start database via Docker
docker-compose up -d db

# Run migrations
npx prisma migrate dev

# Seed database
npm run prisma:seed
```

### 5. Run Application
```bash
# Development
npm run start:dev

# Production (via Docker)
docker-compose up --build
```

## API Documentation
Once the app is running, visit:
`http://localhost:3000/docs`

## Multiple Databases Support

This boilerplate supports multiple database connections. To add a new database, follow these steps:

### Step 1: Create a New Prisma Schema
Create a new file in `prisma/`, e.g., `prisma/analytics.prisma`.
**Crucial**: Set a unique `output` path for the generator to avoid conflicts.

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../node_modules/@prisma/analytics-client"
}

datasource db {
  provider = "postgresql"
  url      = env("ANALYTICS_DATABASE_URL")
}

model Log {
  id        String   @id @default(uuid())
  action    String
  createdAt DateTime @default(now())
}
```

### Step 2: Configure Environment Variables
1. Add the new database URL to `.env` and `.env.example`.
2. Update `src/config/env.validation.ts` to include the new variable in the Joi schema.

### Step 3: Update Package Scripts
Update `package.json` to include generation and migration scripts for the new schema:
```json
"prisma:generate": "prisma generate --schema=prisma/schema.prisma && prisma generate --schema=prisma/analytics.prisma",
"prisma:migrate:analytics": "prisma migrate dev --schema=prisma/analytics.prisma"
```

### Step 4: Create a Dedicated Prisma Service
Create `src/prisma/analytics-prisma.service.ts`:
```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client/analytics';

@Injectable()
export class AnalyticsPrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() { await this.$connect(); }
  async onModuleDestroy() { await this.$disconnect(); }
}
```
Then, register and export this service in `src/prisma/prisma.module.ts`.

### Step 5: Usage
Inject the service where needed:
```typescript
constructor(
  private prisma: PrismaService,
  private analytics: AnalyticsPrismaService
) {}
```

## Scripts
- `npm run build`: Build the project
- `npm run format`: Format code with Prettier
- `npm run lint`: Lint code with ESLint
- `npm run test`: Run unit tests
- `npm run test:e2e`: Run E2E tests
- `npm run prisma:generate`: Generate all Prisma clients
- `npm run prisma:migrate`: Run primary database migrations
- `npm run prisma:migrate:analytics`: Run analytics database migrations
- `npm run prisma:seed`: Seed the primary database

## License
MIT
