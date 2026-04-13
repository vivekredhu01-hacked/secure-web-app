const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const { initData } = require("./db");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "dev-secret",
    resave: false,
    saveUninitialized: false
  })
);

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
  res.render("login", { error: null });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.findOne({ username, password });
  if (!user) {
    return res.render("login", { error: "Invalid username or password" });
  }

  req.session.user = { id: user.id, username: user.username, role: user.role };
  return res.redirect("/tasks");
});

app.get("/logout", (req, res) => {
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

  res.render("index", { tasks: mappedTasks, user: currentUser });
});

app.get("/tasks/new", requireAuth, (req, res) => {
  res.render("new-task", { user: req.session.user });
});

app.post("/tasks", requireAuth, (req, res) => {
  const { title, description } = req.body;
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
  const task = tasks.findOne({ id: Number(req.params.id) });
  if (!task) {
    return res.status(404).send("Task not found");
  }

  const isOwner = task.owner_id === req.session.user.id;
  const isAdmin = req.session.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).send("Not authorized");
  }

  return res.render("edit-task", { task, user: req.session.user });
});

app.post("/tasks/:id/update", requireAuth, (req, res) => {
  const task = tasks.findOne({ id: Number(req.params.id) });
  if (!task) {
    return res.status(404).send("Task not found");
  }

  const isOwner = task.owner_id === req.session.user.id;
  const isAdmin = req.session.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).send("Not authorized");
  }

  const { title, description } = req.body;
  task.title = title;
  task.description = description;
  tasks.update(task);

  return res.redirect("/tasks");
});

app.post("/tasks/:id/delete", requireAuth, (req, res) => {
  const task = tasks.findOne({ id: Number(req.params.id) });
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

app.listen(PORT, () => {
  console.log(`App running at http://localhost:${PORT}`);
});
