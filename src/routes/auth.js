const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
  res.send("Auth login OK");
});

router.post("/verify", (req, res) => {
  const { code, username } = req.body;

  if (!code || !username) {
    return res.status(400).json({ success: false });
  }

  res.json({ success: true });
});

module.exports = router;
