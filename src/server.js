const express = require("express");
const session = require("express-session");

const app = express();

app.use(express.json());

app.use(session({
  secret: "mc-secret",
  resave: false,
  saveUninitialized: true
}));

const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
