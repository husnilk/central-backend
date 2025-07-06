const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const authenticateToken = require("../middleware/authenticate");

// Create a new logbook entry for a task
router.post("/:taskId/logbooks", authenticateToken, async (req, res) => {
  const { taskId } = req.params;
  const { content } = req.body;
  const authorId = req.user.id;

  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Check if the user is authorized to add a logbook to this task
    if (task.authorId !== authorId) {
      return res.status(403).json({ error: "You are not authorized to add a logbook to this task" });
    }

    const logbook = await prisma.logbook.create({
      data: {
        content,
        task: { connect: { id: taskId } },
        author: { connect: { id: authorId } },
      },
    });

    res.status(201).json({
        status: "success",
        logbook: logbook,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while creating the logbook" });
  }
});

// Delete a logbook entry from a task
router.delete("/:taskId/logbooks/:logbookId", authenticateToken, async (req, res) => {
  const { taskId, logbookId } = req.params;
  const authorId = req.user.id;

  try {
    const logbook = await prisma.logbook.findUnique({
      where: { id: logbookId },
      include: { task: true },
    });

    if (!logbook || logbook.taskId !== taskId) {
      return res.status(404).json({ error: "Logbook not found" });
    }

    // Check if the user is authorized to delete this logbook
    if (logbook.authorId !== authorId) {
      return res.status(403).json({ error: "You are not authorized to delete this logbook" });
    }

    await prisma.logbook.delete({
      where: { id: logbookId },
    });

    res.status(204).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while deleting the logbook" });
  }
});

module.exports = router;
