const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new task
router.post('/', async (req, res) => {
  const { name, description, priority, deadline, percentage, parentId, authorId } = req.body;
  try {
    const task = await prisma.task.create({
      data: {
        name,
        description,
        priority,
        deadline: deadline ? new Date(deadline) : null,
        percentage,
        author: { connect: { id: authorId } },
        ...(parentId && { parent: { connect: { id: parentId } } }),
      },
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: 'Could not create task' });
  }
});

// Get all tasks
router.get('/', async (req, res) => {
  const tasks = await prisma.task.findMany();
  res.json(tasks);
});

// Get a single task by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const task = await prisma.task.findUnique({
    where: { id: parseInt(id) },
  });
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, priority, deadline, percentage, status } = req.body;
  try {
    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        priority,
        deadline: deadline ? new Date(deadline) : null,
        percentage,
        status,
      },
    });
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: 'Could not update task' });
  }
});

// Set task as completed
router.patch('/:id/complete', async (req, res) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        status: 'DONE',
        percentage: 100,
      },
    });
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: 'Could not complete task' });
  }
});

module.exports = router;
