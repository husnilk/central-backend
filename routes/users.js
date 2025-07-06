const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const authenticateToken = require("../middleware/authenticate");

// Create User
router.post("/", authenticateToken, async (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
      },
    });
    res.status(201).json({
      status: "success",
      user: user,
    });
  } catch (error) {
    res.status(400).json({ error: "Email already exists" });
  }
});

// List Users
router.get("/", authenticateToken, async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
    },
  });
  res.json({
    status: "success",
    users: users,
  });
});

// View User Detail
router.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
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
    where: { id: id },
  });
  if (user) {
    res.json({
      status: "success",
      user: user,
    });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Update User
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { email, firstName, lastName, role, supervisorId } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: id },
      data: {
        email,
        firstName,
        lastName,
        role: role ? { set: role } : undefined, // role is enum
        supervisorId,
      },
    });
    delete user.password; // Remove password from response

    res.json({
      status: "success",
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "User not found" });
  }
});

// Delete User
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id: id },
    });
    res.status(204).json();
  } catch (error) {
    res.status(404).json({ error: "User not found" });
  }
});

// Search Users
router.get("/search/:query", authenticateToken, async (req, res) => {
  const { query } = req.params;
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
    },
    where: {
      OR: [
        {
          firstName: {
            contains: query,
          },
        },
        {
          lastName: {
            contains: query,
          },
        },
        {
          email: {
            contains: query,
          },
        },
      ],
    },
  });
  res.json({
    status: "success",
    users: users,
  });
});

module.exports = router;
