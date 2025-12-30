const express = require("express");
const router = express.Router();

function requireLogin(req, res, next) {
  if (!req.session.user) return res.redirect("/login.html");
  next();
}

router.get("/", requireLogin, (req, res) => {
  res.send(`
    <h1>Dashboard</h1>
    <p>Logged in as ${req.session.user}</p>
    <a href="/logout">Logout</a>
  `);
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {});
  res.redirect("/");
});

module.exports = router;
