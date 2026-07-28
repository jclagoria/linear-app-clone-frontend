# User Flows — Implement Register User API Integration

## Actors

| Actor | Description |
|-------|-------------|
| Guest User | An unauthenticated visitor who wants to create a new account |

## Flow Inventory

### Authentication: User Registration

**Actor**: Guest User  
**Entry**: Login page, click "Sign up" link  
**Exit**: Dashboard (on success), Login page (on cancel)

#### Screen List

| Screen | States Visited | Description |
|--------|----------------|-------------|
| LoginPage | populated | Starting point with link to registration |
| RegisterPage | idle, loading, error, success | Registration form with validation |

#### Navigation Graph

```mermaid
graph TD
    Login[LoginPage] -->|Click "Sign up"| Register[RegisterPage]
    Register -->|Submit valid form| Loading[RegisterPage - Loading]
    Loading -->|API 201 Success| Dashboard[Dashboard]
    Loading -->|API 400 Validation| Register
    Loading -->|API 409 Conflict| Register
    Loading -->|Network Error| Register
    Register -->|Click "Sign in"| Login
```

#### State Transitions

| From | Action | To | Notes |
|------|--------|----|-------|
| LoginPage | Click "Sign up" | RegisterPage (idle) | Form renders with empty fields |
| RegisterPage (idle) | Click "Create account" with invalid data | RegisterPage (error) | Client-side validation errors shown |
| RegisterPage (idle) | Click "Create account" with valid data | RegisterPage (loading) | API request initiated |
| RegisterPage (loading) | API returns 201 | Dashboard | Tokens stored, user authenticated |
| RegisterPage (loading) | API returns 400 | RegisterPage (error) | Server validation errors displayed |
| RegisterPage (loading) | API returns 409 | RegisterPage (error) | "Email already exists" message |
| RegisterPage (loading) | Network failure | RegisterPage (error) | Generic error message |
| RegisterPage (error) | Modify field | RegisterPage (idle) | Corresponding error cleared |
| RegisterPage | Click "Sign in" | LoginPage | Navigation back to login |

---

### Authentication: Login

**Actor**: Guest User  
**Entry**: Application root (unauthenticated)  
**Exit**: Dashboard (on success)

#### Screen List

| Screen | States Visited | Description |
|--------|----------------|-------------|
| LoginPage | idle, loading, error | Login form with email/password |

#### Navigation Graph

```mermaid
graph TD
    App[App Root] -->|Unauthenticated| Login[LoginPage]
    Login -->|Click "Sign up"| Register[RegisterPage]
    Login -->|Submit valid form| Loading[LoginPage - Loading]
    Loading -->|API Success| Dashboard[Dashboard]
    Loading -->|API Error| Login
```

#### State Transitions

| From | Action | To | Notes |
|------|--------|----|-------|
| App Root | Unauthenticated | LoginPage | Default redirect |
| LoginPage | Click "Sign up" | RegisterPage | Navigate to registration |
| LoginPage | Submit valid credentials | LoginPage (loading) | API request initiated |
| LoginPage (loading) | API success | Dashboard | User authenticated |
| LoginPage (loading) | API error | LoginPage (error) | Error message displayed |
