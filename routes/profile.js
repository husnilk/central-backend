const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const authenticateToken = require("../middleware/authenticate");

// Get current user's profile
router.get("/", authenticateToken, async (req, res) => {
  console.log(req.user);
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      supervisorId: true,
    },
  });
  res.json({
    status: "success",
    user: user,
  });
});

// Update current user's profile
router.put("/", authenticateToken, async (req, res) => {
  const { email, firstName, lastName } = req.body;
  try {
    console.log(req.user);
    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        email,
        firstName,
        lastName,
      },
    });
    delete user.password;

    res.json({
      status: "success",
      user: user,
    });
  } catch (error) {
    res.status(404).json({ error: "User not found" });
  }
});

// Update current user's password
router.put("/password", authenticateToken, async (req, res) => {
  const { password, newPassword, confirmPassword } = req.body;
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .json({ error: "New password and confirmation do not match" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: req.user.userId },
    data: {
      password: hashedPassword,
    },
  });

  res.json({
    status: "success",
    message: "Password updated successfully",
  });
});

module.exports = router;
