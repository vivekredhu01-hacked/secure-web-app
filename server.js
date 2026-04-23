const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const csrf = require("csurf");
const rateLimit = require("express-rate-limit");
const { initData } = require("./db");

const app = express();
const PORT = 3000;
const isProd = process.env.NODE_ENV === "production";
const sessionSecret = process.env.SESSION_SECRET || "change-this-dev-secret";

const csrfProtection = csrf();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many login attempts. Please try again later."
});

function sanitizeInput(value, maxLen) {
  if (typeof value !== "string") {
    return "";
  }
  return value.replace(/\s+/g, " ").trim().slice(0, maxLen);
}

function parseTaskId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) {
    return null;
  }
  return id;
}

app.set("view engine", "ejs");
app.disable("x-powered-by");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false, limit: "10kb" }));
app.use(
  session({
    name: "task.sid",
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "strict",
      secure: isProd,
      maxAge: 60 * 60 * 1000
    }
  })
);
app.use(csrfProtection);

const state = initData();
const users = state.users;
const tasks = state.tasks;

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
}

app.get("/", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  return res.redirect("/tasks");
});

app.get("/login", (req, res) => {
  res.render("login", { error: null, csrfToken: req.csrfToken() });
});

app.post("/login", loginLimiter, (req, res) => {
  const username = sanitizeInput(req.body.username, 50);
  const password = typeof req.body.password === "string" ? req.body.password : "";
  const user = users.findOne({ username });
  if (!user || !user.password_hash || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).render("login", {
      error: "Invalid username or password",
      csrfToken: req.csrfToken()
    });
  }

  return req.session.regenerate((err) => {
    if (err) {
      return res.status(500).send("Session error");
    }
    req.session.user = { id: user.id, username: user.username, role: user.role };
    return res.redirect("/tasks");
  });
});

app.post("/logout", requireAuth, (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

app.get("/tasks", requireAuth, (req, res) => {
  const currentUser = req.session.user;
  let allTasks = tasks.chain().simplesort("id", true).data();
  if (currentUser.role !== "admin") {
    allTasks = allTasks.filter((task) => task.owner_id === currentUser.id);
  }

  const mappedTasks = allTasks.map((task) => {
    const owner = users.findOne({ id: task.owner_id });
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      owner_id: task.owner_id,
      owner_name: owner ? owner.username : "unknown"
    };
  });

  res.render("index", { tasks: mappedTasks, user: currentUser, csrfToken: req.csrfToken() });
});

app.get("/tasks/new", requireAuth, (req, res) => {
  res.render("new-task", { user: req.session.user, error: null, csrfToken: req.csrfToken() });
});

app.post("/tasks", requireAuth, (req, res) => {
  const title = sanitizeInput(req.body.title, 120);
  const description = sanitizeInput(req.body.description, 1000);
  if (title.length < 3) {
    return res.status(400).render("new-task", {
      user: req.session.user,
      error: "Title must be at least 3 characters.",
      csrfToken: req.csrfToken()
    });
  }

  const highest = tasks.chain().simplesort("id", true).limit(1).data()[0];
  const nextId = highest ? highest.id + 1 : 1;

  tasks.insert({
    id: nextId,
    title,
    description,
    owner_id: req.session.user.id
  });

  return res.redirect("/tasks");
});

app.get("/tasks/:id/edit", requireAuth, (req, res) => {
  const taskId = parseTaskId(req.params.id);
  if (!taskId) {
    return res.status(400).send("Invalid task id");
  }

  const task = tasks.findOne({ id: taskId });
  if (!task) {
    return res.status(404).send("Task not found");
  }

  const isOwner = task.owner_id === req.session.user.id;
  const isAdmin = req.session.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).send("Not authorized");
  }

  return res.render("edit-task", {
    task,
    user: req.session.user,
    error: null,
    csrfToken: req.csrfToken()
  });
});

app.post("/tasks/:id/update", requireAuth, (req, res) => {
  const taskId = parseTaskId(req.params.id);
  if (!taskId) {
    return res.status(400).send("Invalid task id");
  }

  const task = tasks.findOne({ id: taskId });
  if (!task) {
    return res.status(404).send("Task not found");
  }

  const isOwner = task.owner_id === req.session.user.id;
  const isAdmin = req.session.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).send("Not authorized");
  }

  const title = sanitizeInput(req.body.title, 120);
  const description = sanitizeInput(req.body.description, 1000);
  if (title.length < 3) {
    return res.status(400).render("edit-task", {
      task,
      user: req.session.user,
      error: "Title must be at least 3 characters.",
      csrfToken: req.csrfToken()
    });
  }

  task.title = title;
  task.description = description;
  tasks.update(task);

  return res.redirect("/tasks");
});

app.post("/tasks/:id/delete", requireAuth, (req, res) => {
  const taskId = parseTaskId(req.params.id);
  if (!taskId) {
    return res.status(400).send("Invalid task id");
  }

  const task = tasks.findOne({ id: taskId });
  if (!task) {
    return res.status(404).send("Task not found");
  }

  const isOwner = task.owner_id === req.session.user.id;
  const isAdmin = req.session.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).send("Not authorized");
  }

  tasks.remove(task);
  return res.redirect("/tasks");
});

app.use((err, req, res, next) => {
  if (err && err.code === "EBADCSRFTOKEN") {
    return res.status(403).send("Invalid or expired form token. Refresh and try again.");
  }
  return next(err);
});

app.listen(PORT, () => {
  console.log(`App running at http://localhost:${PORT}`);
});
