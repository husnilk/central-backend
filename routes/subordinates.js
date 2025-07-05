const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticate = require('../middleware/authenticate');

// Middleware to check if the user is a supervisor
const isSupervisor = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

// Get all subordinates for the current supervisor
router.get('/', authenticate, isSupervisor, async (req, res) => {
  try {
    const subordinates = await prisma.user.findMany({
      where: {
        supervisorId: req.user.id,
      },
      include: {
        tasks: true,
      },
    });

    const result = subordinates.map(s => {
      const completedTasks = s.tasks.filter(t => t.status === 'DONE').length;
      return {
        id: s.id,
        firstName: s.firstName,
        lastName: s.lastName,
        email: s.email,
        taskCount: s.tasks.length,
        completedTaskCount: completedTasks,
      };
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a single subordinate by ID
router.get('/:id', authenticate, isSupervisor, async (req, res) => {
  try {
    const subordinate = await prisma.user.findFirst({
      where: {
        id: req.params.id,
        supervisorId: req.user.id,
      },
      include: {
        tasks: true,
      },
    });

    if (!subordinate) {
      return res.status(404).json({ message: 'Subordinate not found' });
    }

    res.json(subordinate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Dismiss a subordinate
router.put('/:id/dismiss', authenticate, isSupervisor, async (req, res) => {
  try {
    const subordinate = await prisma.user.updateMany({
      where: {
        id: req.params.id,
        supervisorId: req.user.id,
      },
      data: {
        supervisorId: null,
      },
    });

    if (subordinate.count === 0) {
      return res.status(404).json({ message: 'Subordinate not found' });
    }

    res.json({ message: 'Subordinate dismissed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
