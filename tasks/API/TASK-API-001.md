# TASK-API-001 - Implement User Registration Endpoint

## Context & Goal

**Business Value:** Allows new users to create an account.
**Epic:** API
**User Story:** As a new user, I want to be able to register for an account so I can access the application.

## Scope Definition

**✅ In Scope:**

- Create a `POST /api/auth/register` endpoint.
- Hash user passwords using `bcrypt`.
- Insert new user records into the `users` table.
- Handle cases where the email already exists.

**⛔ Out of Scope:**

- Email verification.
- Rate limiting.

## Technical Specifications

**Implementation Details:**

- The endpoint will accept `email` and `password`.
- It will return a `201` on success and appropriate error codes (`400`, `409`) on failure.
- The implementation will reside in `src/app/api/auth/register.ts`.

**Architecture References:**

- TSD Section: 4. Component Design Specifications (API Endpoints)
- PRD Requirement: FR-001
- Technical Dependencies: `bcrypt`, `sqlite3`

## Acceptance Criteria

1. **Given** a unique email and a valid password
   **When** a POST request is made to `/api/auth/register`
   **Then** the server responds with a `201 Created` status.
2. **Given** an email that already exists in the database
   **When** a POST request is made with that email
   **Then** the server responds with a `409 Conflict` status.
3. **Given** a request with missing email or password
   **When** a POST request is made
   **Then** the server responds with a `400 Bad Request` status.

## Definition of Done

- [ ] Implementation complete per technical specifications.
- [ ] Unit tests written for the registration logic.
- [ ] Code review completed and approved.
- [ ] Endpoint tested manually.

## Dependencies

**Upstream Tasks:** TASK-SETUP-001
**External Dependencies:** None
**Parallel Tasks:** TASK-API-002
**Downstream Impact:** The registration UI depends on this.

## Estimation & Priority

**Effort Estimate:** 3 Story Points
**Priority:** P0
**Risk Level:** Low
