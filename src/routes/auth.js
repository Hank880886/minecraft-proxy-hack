const express = require("express");
const fs = require("fs");
const router = express.Router();

const EXPIRE_TIME = 5 * 60 * 1000; // 5 分鐘

function load(file) {
  return JSON.parse(fs.readFileSync(file));
}
function save(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// 產生驗證碼
router.get("/login", (req, res) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const verify = load("data/verify.json");

  verify[code] = {
    created: Date.now()
  };

  save("data/verify.json", verify);

  res.send(`
    <h1>Minecraft 登入</h1>
    <p>請在遊戲內輸入：</p>
    <h2>/verify ${code}</h2>
    <p>⚠ 5 分鐘內有效</p>
  `);
});

// PocketMine 呼叫
router.post("/verify", (req, res) => {
  const { code, username } = req.body;
  const verify = load("data/verify.json");
  const users = load("data/users.json");

  if (!verify[code]) {
    return res.status(400).json({ success: false, reason: "invalid" });
  }

  // ⏰ 過期檢查
  if (Date.now() - verify[code].created > EXPIRE_TIME) {
    delete verify[code];
    save("data/verify.json", verify);
    return res.status(400).json({ success: false, reason: "expired" });
  }

  users[username] = {
    name: username,
    loginAt: Date.now()
  };

  delete verify[code];
  save("data/verify.json", verify);
  save("data/users.json", users);

  res.json({ success: true });
});

module.exports = router;
