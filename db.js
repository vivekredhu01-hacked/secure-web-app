const path = require("path");
const loki = require("lokijs");

const dbPath = path.join(__dirname, "app.db.json");
const db = new loki(dbPath, {
  autoload: true,
  autosave: true,
  autosaveInterval: 4000
});

function getCollection(name, options = {}) {
  let collection = db.getCollection(name);
  if (!collection) {
    collection = db.addCollection(name, options);
  }
  return collection;
}

function initData() {
  const users = getCollection("users", { unique: ["username"] });
  const tasks = getCollection("tasks");

  if (!users.findOne({ username: "admin" })) {
    users.insert({ id: 1, username: "admin", password: "admin123", role: "admin" });
  }

  if (!users.findOne({ username: "alice" })) {
    users.insert({ id: 2, username: "alice", password: "alice123", role: "user" });
  }

  return { users, tasks };
}

module.exports = {
  db,
  initData
};
