const path = require("path");
const loki = require("lokijs");
const bcrypt = require("bcryptjs");

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
    users.insert({
      id: 1,
      username: "admin",
      password_hash: bcrypt.hashSync("admin123", 12),
      role: "admin"
    });
  }

  if (!users.findOne({ username: "alice" })) {
    users.insert({
      id: 2,
      username: "alice",
      password_hash: bcrypt.hashSync("alice123", 12),
      role: "user"
    });
  }

  // Migrate old plaintext passwords to hashed format.
  users.find().forEach((user) => {
    if (!user.password_hash && user.password) {
      user.password_hash = bcrypt.hashSync(user.password, 12);
      delete user.password;
      users.update(user);
    }
  });

  if (!tasks.binaryIndices || !tasks.binaryIndices.id) {
    tasks.ensureIndex("id");
  }

  return { users, tasks };
}

module.exports = {
  db,
  initData
};
