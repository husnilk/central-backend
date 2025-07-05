const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authenticate = require('../middleware/authenticate');

// Middleware to check if the user is the group leader
const isGroupLeader = async (req, res, next) => {
  const groupId = req.params.id;
  const group = await prisma.group.findUnique({
    where: { id: groupId },
  });

  if (!group) {
    return res.status(404).json({ message: 'Group not found' });
  }

  if (group.leaderId !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  next();
};

// Create a new group
router.post('/', authenticate, async (req, res) => {
  const { name, description } = req.body;
  try {
    const group = await prisma.group.create({
      data: {
        name,
        description,
        leader: { connect: { id: req.user.id } },
        members: {
          create: {
            user: { connect: { id: req.user.id } },
          },
        },
      },
    });
    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ error: 'Could not create group' });
  }
});

// Get group details
router.get('/:id', authenticate, async (req, res) => {
  const groupId = req.params.id;
  try {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        leader: true,
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add a member to a group
router.post('/:id/members', authenticate, isGroupLeader, async (req, res) => {
  const groupId = req.params.id;
  const { userId } = req.body;

  try {
    const member = await prisma.groupMember.create({
      data: {
        group: { connect: { id: groupId } },
        user: { connect: { id: userId } },
      },
    });
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ error: 'Could not add member to group' });
  }
});

// Remove a member from a group
router.delete('/:id/members/:userId', authenticate, isGroupLeader, async (req, res) => {
  const groupId = req.params.id;
  const userId = parseInt(req.params.userId);

  try {
    await prisma.groupMember.deleteMany({
      where: {
        groupId: groupId,
        userId: userId,
      },
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Could not remove member from group' });
  }
});

// Change the leader of a group
router.put('/:id/leader', authenticate, isGroupLeader, async (req, res) => {
  const groupId = req.params.id;
  const { userId } = req.body;

  try {
    const group = await prisma.group.update({
      where: { id: groupId },
      data: {
        leader: { connect: { id: userId } },
      },
    });
    res.json(group);
  } catch (error) {
    res.status(400).json({ error: 'Could not change group leader' });
  }
});

module.exports = router;
