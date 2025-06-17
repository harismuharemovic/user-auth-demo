# Technical Specification Document: User Auth and Dashboard

## 1. Executive Summary

This document provides the detailed technical specifications for implementing the user authentication and dashboard features. It translates the PRD into a concrete implementation plan for the development team, covering data models, API endpoints, UI components, and development standards.

- **Solution Overview:** The solution consists of a Next.js application with server-side rendering, using API routes for authentication and a local SQLite database for persistence. The UI will be built with `shadcn/ui` components.
- **Timeline:** 1 development sprint (2 weeks).

## 2. Architecture Goals & Constraints

- **Technology Stack:**
  - Framework: Next.js (App Router)
  - UI: React, `shadcn/ui`, Tailwind CSS
  - Database: SQLite
- **Constraints:** The initial build will not include social logins or password recovery to maintain a focused scope.

## 3. High-Level Architecture

The application follows a standard Next.js architecture:

- `src/app/auth/`: Contains the `login` and `register` pages.
- `src/app/dashboard/`: The main dashboard page, protected for authenticated users.
- `src/app/api/auth/`: API routes for handling `login` and `register` logic.
- `src/lib/db.ts`: The database utility for connecting to and querying the SQLite database.
- `src/components/`: Reusable UI components, including the collapsible navigation.

## 4. Component Design Specifications

### UI Components (`shadcn/ui`)

- **`@/components/ui/button`**: For all buttons (Sign In, Register).
- **`@/components/ui/input`**: For email and password fields.
- **`@/components/ui/label`**: For form field labels.
- **`@/components/ui/card`**: To structure the login/register forms.
- **`@/components/ui/tabs`**: To switch between Sign Up and Register forms.
- **Icons:** from `lucide-react` for social login buttons and other UI elements.

### API Endpoints

- **`POST /api/auth/register`**

  - **Request:** `{ "email": "string", "password": "string" }`
  - **Response (Success):** `201 Created` with `{ "message": "User created" }`
  - **Response (Error):** `400 Bad Request` for invalid data, `409 Conflict` if user exists.
  - **Logic:** Hashes the password, creates a new user in the database.

- **`POST /api/auth/login`**
  - **Request:** `{ "email": "string", "password": "string" }`
  - **Response (Success):** `200 OK` with a session token in an HTTP-only cookie.
  - **Response (Error):** `401 Unauthorized` for invalid credentials.
  - **Logic:** Verifies credentials, creates and sets a session cookie.

## 5. Data Model

A single `users` table will be created in the `main.db` SQLite database file.

```sql
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 6. Development Standards & Guidelines

- **Project Structure:** Follow the Next.js App Router conventions.
- **Code Style:** Adhere to the default ESLint and Prettier configurations.
- **Branching:** Use feature branches (e.g., `feat/user-auth`) and submit Pull Requests to `main`.

## 7. Testing Strategy

- **Unit Tests:** Business logic, especially authentication functions, should be unit-tested.
- **E2E Tests:** A simple end-to-end test will be created to simulate the login flow.

## 8. Traceability Matrix

| PRD Requirement     | TSD Section(s) |
| ------------------- | -------------- |
| FR-001: Register    | 4, 5           |
| FR-002: Login       | 4, 5           |
| FR-003: Auth Errors | 4              |
| FR-004: Protection  | Middleware     |
| FR-005: Dashboard   | 3              |
| FR-006: Navigation  | 3, 4           |

## 9. Risk Assessment & Mitigation

- **Risk:** Manual session management can be complex.
- **Mitigation:** We will use a library like `iron-session` to securely manage sessions and cookies.
