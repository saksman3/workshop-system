import express from "express";
import jwt from "jsonwebtoken";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

const verifyToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    req.headers["x-user-id"] = decoded.sub;
    req.headers["x-tenant-id"] = decoded.tenantId;
    req.headers["x-user-role"] = decoded.role;

    next();
  } catch {
    return res.sendStatus(403);
  }
};

app.use(
  "/workshop",
  verifyToken,
  createProxyMiddleware({
    target: process.env.WORKSHOP_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/workshop": "",
    },
  })
);

app.use(
  "/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
  })
);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(3000, () => console.log("Gateway running"));