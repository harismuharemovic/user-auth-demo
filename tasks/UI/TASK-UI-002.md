# TASK-UI-002 - Create Dashboard Page and Protected Route

## Context & Goal

**Business Value:** Provides a secure area for authenticated users and protects private content.
**Epic:** UI
**User Story:** As an authenticated user, I want to see a dashboard. As an unauthenticated user, I should not be able to access it.

## Scope Definition

**✅ In Scope:**

- Create a simple dashboard page at `/dashboard`.
- Implement middleware to protect the `/dashboard` route.
- The dashboard will contain a welcome message and a logout button.
- Unauthenticated users trying to access `/dashboard` will be redirected to `/auth`.

**⛔ Out of Scope:**

- Any actual dashboard content or widgets.
- Role-based access control.

## Technical Specifications

**Implementation Details:**

- The dashboard will be a client component at `src/app/dashboard/page.tsx`.
- Middleware will be implemented in `src/middleware.ts`.
- The middleware will check for a valid session using `iron-session`.

**Architecture References:**

- TSD Section: 3. High-Level Architecture, 8. Traceability Matrix
- PRD Requirement: FR-004, FR-005
- Technical Dependencies: `iron-session`

## Acceptance Criteria

1. **Given** a user is logged in
   **When** they navigate to `/dashboard`
   **Then** they can see the dashboard page.
2. **Given** a user is not logged in
   **When** they try to access `/dashboard` directly
   **Then** they are redirected to the `/auth` page.
3. **Given** a user is on the dashboard
   **When** they click the "Logout" button
   **Then** their session is destroyed and they are redirected to `/auth`.

## Definition of Done

- [ ] Dashboard page created.
- [ ] Middleware created and correctly protecting the route.
- [ ] Logout functionality is working.
- [ ] Code review completed and approved.

## Dependencies

**Upstream Tasks:** TASK-API-002, TASK-API-003
**External Dependencies:** None
**Parallel Tasks:** None
**Downstream Impact:** This is the core authenticated part of the app.

## Estimation & Priority

**Effort Estimate:** 4 Story Points
**Priority:** P0
**Risk Level:** Medium (Middleware configuration can be tricky)
