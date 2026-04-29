import express from "express";

const app = express();

app.post("/login", (req, res) => {
  res.json({ message: "logged in" });
});

app.listen(3000);