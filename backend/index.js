const express = require("express");
const mainRouter = require("./routes/index");
const cors = require('cors');
const { initDb } = require('./db');

const app = express(); // ✅ Declare before using

app.use(cors());
app.use(express.json());
app.use("/api/v1", mainRouter);

initDb();

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
