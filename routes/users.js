const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

// Create User
router.post('/', async (req, res) => {
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
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

// List Users
router.get('/', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// View User Detail
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
  });
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Update User
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, role } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        firstName,
        lastName,
        role,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
});

// Delete User
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
});

// Search Users
router.get('/search/:query', async (req, res) => {
    const { query } = req.params;
    const users = await prisma.user.findMany({
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
    res.json(users);
});

module.exports = router;