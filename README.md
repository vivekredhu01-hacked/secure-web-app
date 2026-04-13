# Option B - Basic Web Application (CRUD + Roles)

This project is a basic task manager web application designed to satisfy your Option B requirements.

## Implemented Requirements

1. CRUD operations:
   - Create: add new tasks
   - Read: list tasks
   - Update: edit tasks
   - Delete: remove tasks

2. Multiple layers:
   - Storage layer: embedded LokiJS database persisted to file (`app.db.json`, initialized in `db.js`)
   - View layer: EJS templates (`views/*.ejs`)
   - Application/controller layer: Express routes (`server.js`)

3. Multiple user roles:
   - `admin` role can view all tasks and manage any task
   - `user` role can view and manage only own tasks

4. Flexible for security improvements:
   - This starter uses weak/default security choices (plain text passwords, simple session secret)
   - You can improve it by adding hashing, CSRF protection, input validation, secure cookies, stronger auth checks, and rate limiting

## Demo Credentials

- Admin: `admin` / `admin123`
- User: `alice` / `alice123`

## Run the Project

```bash
npm install
npm start
```

Then open [http://localhost:3000](http://localhost:3000).
