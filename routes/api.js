const express = require("express");
const router = express.Router();

router.get("/status", (req, res) => {
  res.json({
    online: true,
    players: 0,
    message: "API is ready"
  });
});

module.exports = router;
