import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(express.json());

// TEMP: hardcoded user (replace with DB later)
const mockUser = {
  id: "user-123",
  email: "admin@test.com",
  passwordHash: bcrypt.hashSync("password123", 10),
  tenantId: "shop-123",
  role: "admin",
};

app.post("/auth/login", async (req, res) => {
  const { email, password, tenantId } = req.body;

  if (email !== mockUser.email || tenantId !== mockUser.tenantId) {
    return res.status(401).json({ message: "Invalid user.." });
  }

  const valid = await bcrypt.compare(password, mockUser.passwordHash);

  if (!valid) {
    return res.status(401).json({ message: "Invalid password" });
  }

  // user is valid get token
  const token = jwt.sign(
    {
      sub: mockUser.id,
      tenantId: mockUser.tenantId,
      role: mockUser.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "5m" }
  );

  res.json({ accessToken: token });
});

app.get("/health", (req, res) => {
  res.json({ status: "auth ok" });
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Auth service running");
});