const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use("/api", require("./routes/api"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log(`🌐 Website running on http://localhost:${PORT}`);
});
