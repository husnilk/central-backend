const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new supervisor request
router.post('/request', async (req, res) => {
  const { requesterId, supervisorId } = req.body;
  try {
    const request = await prisma.supervisorRequest.create({
      data: {
        requester: { connect: { id: requesterId } },
        supervisor: { connect: { id: supervisorId } },
      },
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ error: 'Could not create supervisor request' });
  }
});

// Get all supervisor requests for a user
router.get('/requests', async (req, res) => {
  const { userId } = req.query;
  const requests = await prisma.supervisorRequest.findMany({
    where: { supervisorId: parseInt(userId) },
  });
  res.json(requests);
});

// Approve or reject a supervisor request
router.patch('/request/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // "APPROVED" or "REJECTED"

  try {
    const request = await prisma.supervisorRequest.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    if (status === 'APPROVED') {
      await prisma.user.update({
        where: { id: request.requesterId },
        data: { supervisor: { connect: { id: request.supervisorId } } },
      });
    }

    res.json(request);
  } catch (error) {
    res.status(400).json({ error: 'Could not update supervisor request' });
  }
});

module.exports = router;
