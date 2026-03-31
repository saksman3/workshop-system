import express from "express";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/test", (req: any, res) => {
  res.json({
    message: "Workshop service reached",
    userId: req.headers["x-user-id"],
    tenantId: req.headers["x-tenant-id"],
    role: req.headers["x-user-role"],
  });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Service running on port ${PORT}`);
});