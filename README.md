# Secure Web Application
## Project Overview
The project is a secured web application that was created on the module of the Secure Web Development. It shows that it is possible to create a multi-user task management system with Node.js, Express, EJS, and LokiJS. The system performs user authentication, access roles and create, update, and delete tasks using the application.
Another area of concern to the project is the principles of web security, determining those vulnerabilities that are common and implementing the security improvements of choice, willingly leaving some of the vulnerabilities to be analyzed and tested by academics.
## Features
1. User registration system and log-in system.
2. Session-based authentication
3. Multi-user environment with different privileges
4. Create, Read, Update, Delete (CRUD) task management
5. Task ownership tracking
6. Easy to use interface based on EJS templates.
7. CSS and JavaScript frontend assets that are static.
## Security Objectives
This project was also meant to showcase secure development concepts, including:
1. Data entry checks in customer data.
2. Managing Sessions with Express Session.
3. Controlled access of authenticated users.
4. Secure routing practices
5. Knowledge of general susceptibilities to web (OWASP Top 10).
## Possibly Known Vulnerabilities (Academic Purposes)
Testing and demonstrating the vulnerabilities still present are:
1. Plaintext password storage
2. Weak hardcoded secret of a session.
3. Lack of CSRF on state changing forms.
4. No brute-force limiting of logins.
5. Inadequate authentication of routes.
These vulnerabilities are documented in the project report with recommendations for mitigation.
## Technologies Used
1. Node.js
2. Express.js
3. EJS
4. LokiJS
5. HTML5
6. CSS3
7. JavaScript
## Project Structure
Webapp/
├── server.test.js # Test version of server.js.rver file
├── db.js              # Database configuration
├── app.db.log # Logs for the application.storage
├── package.json       # Project dependencies
├── public/            # Static assets
├── views/             # EJS templates
└── README.md          # Documentation
## Installation & Setup
### Prerequisites
1. Node.js installed
2. npm installed
### Steps
1. Clone the repository
git clone https://github.com/YOUR_USERNAME/secure-web-app.git
2. Move to project directory.
3. cd Webapp
4. Install dependencies
5. npm install
6. Run the application
7. node server.js
Open browser
http://localhost:3000
## Usage Guidelines
1. Create an account.
2. Login using credentials
3. Create tasks
4. View all tasks
5. Create, edit or delete the owned tasks.
6. Logout securely
## Future Improvements
1. Hasher: Hashing of passwords with bcrypt.
2. CSRF protection
3. Rate limiting of logins.
4. Strong environment-based secrets
5. Improved role-based authorization
6. Migration to MongoDB / PostgreSQL database.
## Academic Note
This project was developed for educational purposes. Certain vulnerabilities have been purposefully left in as a showcase of security analysis, testing, and mitigation planning.
