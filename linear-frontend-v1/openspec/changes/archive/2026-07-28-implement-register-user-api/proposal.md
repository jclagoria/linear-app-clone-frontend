# Implement Register User API Integration

## Problem Statement

The OpenAPI specification defines a complete user registration endpoint (`POST /api/v1/auth/register`) that accepts email, name, and password, returns JWT tokens, and sets an HttpOnly refresh token cookie. However, the frontend currently has no implementation to call this endpoint — users cannot self-register and must rely on manual admin account creation.

## Motivation

Self-registration is a fundamental onboarding flow for any multi-user application. Without it, the application requires administrative intervention for every new user, creating friction and limiting adoption. Implementing the registration API integration enables users to create accounts independently, completing the authentication suite alongside the existing login functionality.

## Scope

- **In scope**:
  - Registration API client function to call `POST /api/v1/auth/register`
  - Registration form UI with email, name, and password fields
  - Client-side validation (email format, password minimum 8 characters, name required)
  - Server error handling (400 validation errors, 409 conflict for existing email)
  - JWT token storage and HttpOnly cookie handling on success
  - Integration with existing auth store for session management
  - Loading and error states for the registration form

- **Out of scope**:
  - Backend endpoint implementation (separate backend project)
  - Email verification flow
  - Password strength indicator UI
  - Social/OAuth registration
  - Admin user creation interface

## Impact

- **Frontend auth module**: New registration component and API client function
- **Auth store**: Extended to handle registration response and token persistence
- **Route structure**: New `/register` route accessible from login page
- **User experience**: Users gain self-service account creation; existing login flow remains unchanged
