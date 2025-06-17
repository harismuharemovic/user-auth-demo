# TASK-API-002 - Implement User Login Endpoint

## Context & Goal

**Business Value:** Allows existing users to securely access their accounts.
**Epic:** API
**User Story:** As an existing user, I want to be able to log in to my account so I can access my dashboard.

## Scope Definition

**✅ In Scope:**

- Create a `POST /api/auth/login` endpoint.
- Validate user credentials against the database.
- Create a session for the user upon successful login.
- Set an HTTP-only cookie to manage the session.

**⛔ Out of Scope:**

- "Remember me" functionality.
- Account locking after multiple failed attempts.

## Technical Specifications

**Implementation Details:**

- Use `bcrypt.compare` to verify the password.
- Use `iron-session` to create and manage the session.
- The implementation will reside in `src/app/api/auth/login.ts`.

**Architecture References:**

- TSD Section: 4. Component Design Specifications (API Endpoints), 9. Risk Assessment & Mitigation
- PRD Requirement: FR-002
- Technical Dependencies: `bcrypt`, `iron-session`

## Acceptance Criteria

1. **Given** a valid email and the correct password
   **When** a POST request is made to `/api/auth/login`
   **Then** the server responds with a `200 OK` status and sets a session cookie.
2. **Given** an invalid email or incorrect password
   **When** a POST request is made
   **Then** the server responds with a `401 Unauthorized` status.

## Definition of Done

- [ ] Implementation complete per technical specifications.
- [ ] Session configuration in `src/lib/session.ts` is created.
- [ ] Code review completed and approved.
- [ ] Endpoint tested manually.

## Dependencies

**Upstream Tasks:** TASK-SETUP-001
**External Dependencies:** None
**Parallel Tasks:** TASK-API-001
**Downstream Impact:** The login UI and route protection depend on this.

## Estimation & Priority

**Effort Estimate:** 3 Story Points
**Priority:** P0
**Risk Level:** Low
