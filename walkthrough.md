# NestJS Production-Ready Boilerplate Walkthrough

I have successfully created a production-ready NestJS boilerplate with all requested features. Below is an overview of the implementation.

## 🏗️ Architecture & Structure
The project follows a **Modular Architecture** and uses **Repository & Service Patterns**.

```text
src/
├── common/             # Shared logic
│   ├── decorators/     # Custom decorators (Roles, Permissions)
│   ├── filters/        # Global Exception Filter
│   ├── guards/         # Auth, Roles, and Permission Guards
│   ├── interceptors/   # Global Response Transform Interceptor
│   ├── helpers/        # Pagination, Date utilities
│   └── constants/      # Global constants and messages
├── config/             # Environment configuration with Joi validation
├── prisma/             # Prisma service and module (Global)
├── modules/            # Feature-specific modules
│   ├── auth/           # JWT Login, Register, Refresh, Logout
│   ├── users/          # User CRUD & Repository
│   ├── roles/          # Role Management
│   ├── health/         # Monitoring endpoint
│   ├── mail/           # SMTP Service
│   └── files/          # File upload service
├── app.module.ts       # Application Root
└── main.ts             # Entry point (Swagger, Helmet, CORS setup)
```

## 🔐 Key Features

### 1. Authentication & Authorization
- **JWT Tokens**: Implemented Access and Refresh token logic with Passport.js.
- **RBAC**: Role-Based Access Control using `@Roles('ADMIN')` and `@Permissions('users.create')` decorators.
- **Security**: Pre-configured with `helmet`, `cors`, and `throttler` (rate-limiting).

### 2. Database (Prisma)
- **Schema**: Defined `User`, `Role`, `Permission`, and `RolePermission` models.
- **Seeder**: A comprehensive seeder is provided in `prisma/seed.ts` to initialize an Admin user and default roles.
- **Repository Pattern**: Data access is abstracted through repository classes (e.g., `UserRepository`).

### 3. API Documentation
- **Swagger**: Automatically generated documentation available at `/docs`.
- **DTOs**: All inputs are validated using `class-validator` and documented in Swagger.

### 4. Logging & Error Handling
- **Pino**: High-performance logging for requests and errors.
- **Global Filter**: Ensures all errors follow the standard format:
  ```json
  {
    "success": false,
    "message": "Error message",
    "data": null,
    "errors": { ... }
  }
  ```

### 5. Utilities
- **Standard Response**: All successful responses are wrapped in:
  ```json
  {
    "success": true,
    "message": "Operation successful",
    "data": { ... }
  }
  ```
- **Pagination**: Helper for standard paginated results.

## 🚀 DevOps & CI/CD
- **Docker**: `Dockerfile` (multi-stage build) and `docker-compose.yml` for easy deployment.
- **GitHub Actions**: Automated CI pipeline for linting, testing, and building.
- **Git Hooks**: `Husky` + `lint-staged` + `commitlint` for code quality and conventional commits.

## 🛠️ Getting Started
1. Run `npm install`.
2. Copy `.env.example` to `.env`.
3. Start DB: `docker-compose up -d db`.
4. Migrate & Seed: `npx prisma migrate dev && npm run prisma:seed`.
5. Run: `npm run start:dev`.
