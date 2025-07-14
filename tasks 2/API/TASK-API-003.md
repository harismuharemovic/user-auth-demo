# TASK-API-003 - Implement User Logout Endpoint

## Context & Goal

**Business Value:** Provides a secure way for users to end their session.
**Epic:** API
**User Story:** As a logged-in user, I want to be able to log out of my account.

## Scope Definition

**✅ In Scope:**

- Create a `POST /api/auth/logout` endpoint.
- Destroy the user's current session.
- Clear the session cookie.

**⛔ Out of Scope:**

- Global logout from all devices.

## Technical Specifications

**Implementation Details:**

- Use `req.session.destroy()` from `iron-session` to end the session.
- The implementation will reside in `src/app/api/auth/logout.ts`.

**Architecture References:**

- TSD Section: 9. Risk Assessment & Mitigation
- PRD Requirement: N/A (Implicit)
- Technical Dependencies: `iron-session`

## Acceptance Criteria

1. **Given** a user is logged in with an active session
   **When** a POST request is made to `/api/auth/logout`
   **Then** the server responds with a `200 OK` status and the session is destroyed.

## Definition of Done

- [ ] Implementation complete per technical specifications.
- [ ] Code review completed and approved.
- [ ] Endpoint tested manually.

## Dependencies

**Upstream Tasks:** TASK-API-002
**External Dependencies:** None
**Parallel Tasks:** None
**Downstream Impact:** The logout button in the UI depends on this.

## Estimation & Priority

**Effort Estimate:** 1 Story Point
**Priority:** P0
**Risk Level:** Low
