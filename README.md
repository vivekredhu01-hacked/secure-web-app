# Secure Task Manager Web App

## Overview
This project is a role-based task manager built for secure web development coursework. It supports CRUD operations, layered architecture (view + application + storage), and two user roles with different privileges.

The app was first built as an insecure baseline, then hardened with practical security controls.

## Core Features
- Session-based authentication (login/logout)
- Role-based authorization:
  - `admin`: can access all tasks
  - `user`: can access only own tasks
- Full CRUD for tasks:
  - Create, Read, Update, Delete
- Professional light-theme UI with EJS templates
- Persistent file-backed storage using LokiJS

## Tech Stack
- Node.js
- Express.js
- EJS
- LokiJS
- HTML/CSS/JavaScript

## Security Considerations Implemented

### 1) Password Security
- Passwords are stored as `password_hash` values using `bcryptjs`.
- Legacy plaintext passwords are migrated to hashes at startup.
- Login compares hash using `bcrypt.compareSync()`.

### 2) Session Hardening
- Uses `express-session` with secure cookie options:
  - `httpOnly: true`
  - `sameSite: "strict"`
  - `secure: true` in production
  - `maxAge` configured
- Session ID is regenerated after successful login to reduce session fixation risk.
- `x-powered-by` header is disabled.

### 3) CSRF Protection
- Uses `csurf` middleware globally.
- All state-changing forms include CSRF token:
  - login
  - logout
  - create task
  - update task
  - delete task
- Invalid token requests are blocked with `403`.

### 4) Brute-Force Mitigation
- Uses `express-rate-limit` on `POST /login`.
- Limits repeated login attempts in a time window.

### 5) Input Validation and Sanitization
- User input is normalized, trimmed, and length-limited.
- Task IDs are validated before processing.
- Task title minimum length enforced server-side.
- Request body parser uses safer settings (`extended: false`, limited body size).

## Why This Mitigates Common Vulnerabilities
- **SQL Injection**: not applicable in classic form because the app uses LokiJS (no raw SQL queries).
- **CSRF**: mitigated by anti-CSRF tokens and server verification.
- **Session Attacks**: reduced by secure cookie settings and session regeneration.
- **Credential Stuffing/Brute Force**: reduced by login rate limiting.
- **Unsafe Input Abuse**: reduced by validation/sanitization and strict ID checks.

## Project Structure
```text
Webapp/
├── server.js          # Routes, auth, validation, security middleware
├── db.js              # LokiJS setup + seed users + password migration
├── app.db.json        # Persistent data file
├── package.json
├── public/
│   └── styles.css
├── views/
│   ├── login.ejs
│   ├── index.ejs
│   ├── new-task.ejs
│   └── edit-task.ejs
└── README.md
```

## Setup and Run

### Prerequisites
- Node.js 18+ (or newer)
- npm

### Install
```bash
cd "Webapp"
npm install
```

### Start
```bash
npm start
```

Open: [http://localhost:3000](http://localhost:3000)

## Demo Credentials
- Admin: `admin` / `admin123`
- User: `alice` / `alice123`

## Environment Variables (Recommended)
For production:

```bash
export SESSION_SECRET="replace-with-long-random-secret"
export NODE_ENV=production
```

## Quick Security Demo Checklist (for viva/video)
1. Show hashed passwords in `db.js` (`password_hash`, bcrypt).
2. Show secure session config in `server.js`.
3. Show CSRF middleware and `_csrf` hidden fields in views.
4. Show rate limiter on login route.
5. Show input sanitization/validation helpers and checks.

## Academic Note
This project is for educational use and demonstrates secure coding improvements on a previously vulnerable baseline application.
