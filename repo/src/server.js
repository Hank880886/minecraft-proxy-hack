const express = require("express");
const session = require("express-session");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "mc-secret",
  resave: false,
  saveUninitialized: false
}));

if (!fs.existsSync("data")) fs.mkdirSync("data");
if (!fs.existsSync("data/verify.json")) fs.writeFileSync("data/verify.json", "{}");
if (!fs.existsSync("data/users.json")) fs.writeFileSync("data/users.json", "{}");

app.use(express.static("public"));
app.use("/auth", require("./routes/auth"));
app.use("/admin", require("./routes/admin"));

app.listen(3000, () => {
  console.log("🌐 http://localhost:3000");
});
