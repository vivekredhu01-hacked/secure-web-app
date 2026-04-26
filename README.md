# Secure Task Management Web Application

## Project Title and Overview

The Secure Task Management Web Application is a multi-user web-based productivity system developed for the Secure Web Development module. The primary purpose of the application is to allow authenticated users to create, view, update, and delete personal tasks through a secure browser-based interface.

The project focuses not only on functionality, but also on implementing practical web security controls such as password hashing, secure session handling, role-based authorization, CSRF protection, input validation, and brute-force login protection. The application demonstrates how an initially basic CRUD system can be improved into a more secure web solution.

---

## Features and Security Objectives

### Core Features

* User login
* Logout functionality
* Create, Read, Update, Delete (CRUD) tasks
* Multi-user task ownership
* Role-based access (Admin / User)
* Dashboard using EJS templates
* Local persistent database storage

### Security Objectives

* Protect user credentials using password hashing
* Restrict unauthorized access to protected routes
* Prevent users from modifying other users’ tasks
* Protect forms against CSRF attacks
* Prevent brute-force login attempts
* Validate and sanitize user input
* Improve secure session management

---

## Technologies Used

* Node.js
* Express.js
* EJS
* LokiJS
* HTML / CSS / JavaScript

---

## Project Structure

```text id="x4fz6j"
Webapp/
│── server.js              # Main server logic, routes, security middleware
│── db.js                  # Database initialization and password migration
│── app.db.json            # Local JSON database (users/tasks)
│── package.json           # Dependencies and scripts
│── public/
│   └── styles.css         # Frontend styles
│── views/
│   ├── login.ejs          # Login page
│   ├── index.ejs          # Dashboard / task list
│   ├── new-task.ejs       # Create task page
│   └── edit-task.ejs      # Update task page
│── README.md
```

---

## Setup and Installation Instructions

### 1. Clone Repository

```bash id="5h6fli"
git clone https://github.com/vivekredhu01-hacked/secure-web-app.git
cd Webapp
```

### 2. Install Dependencies

```bash id="k7r3c5"
npm install
```

### 3. Run Application

```bash id="9pt5yr"
npm start
```

### 4. Open in Browser

```text id="nmn2js"
http://localhost:3000
```

---

## Usage Guidelines

### Demo Accounts

```text id="m1zw80"
Admin:
Username: admin
Password: admin123

Standard User:
Username: alice
Password: alice123
```

### How to Use

1. Login using a valid account
2. Access the dashboard
3. Create new tasks
4. Edit existing tasks
5. Delete tasks
6. Logout securely

### Role Behaviour

* **Admin** can view and manage all tasks
* **Standard users** can only manage their own tasks

---

## Security Improvements Implemented

### Authentication Security

* Passwords hashed using bcryptjs
* Secure password comparison during login
* Session regeneration after successful login

### Session Security

* Custom session cookie name
* HttpOnly cookies
* SameSite=Strict
* Secure cookies in production mode
* Session expiry configured

### Authorization

* Protected routes require login
* Ownership checks for edit/delete actions
* Role-based task visibility

### CSRF Protection

* Implemented using csurf middleware
* Tokens added to all POST forms:

  * Login
  * Logout
  * Create Task
  * Update Task
  * Delete Task

### Input Validation

* Sanitized user input
* Task title minimum length enforced
* Task ID validation

### Brute Force Protection

* Login route protected using express-rate-limit

---

## Testing Process

### Functional Testing

* User registration/login tested
* CRUD operations verified
* Role-based restrictions confirmed

### Static Application Security Testing (SAST)

Manual source-code review was conducted on:

* Authentication logic
* Session configuration
* Route protection
* Validation routines
* Security middleware

### Security Testing Results

* Password hashes confirmed in database
* CSRF tokens verified in forms
* Unauthorized routes redirected to login
* Session logout destroys session
* Rate limiting protects repeated login attempts

---

### Frameworks / Libraries Used

* Node.js
* Express.js
* EJS
* LokiJS
* bcryptjs
* express-session
* csurf
* express-rate-limit


