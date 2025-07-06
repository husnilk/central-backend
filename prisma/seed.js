const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("password", salt);

  const user1 = await prisma.user.create({
    data: {
      email: "john.doe@example.com",
      password: hashedPassword,
      firstName: "John",
      lastName: "Doe",
      role: "ADMIN",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "jane.smith@example.com",
      password: hashedPassword,
      firstName: "Jane",
      lastName: "Smith",
      role: "USER",
    },
  });

  console.log("Users created:");
  console.log(user1);
  console.log(user2);

  const task1 = await prisma.task.create({
    data: {
      name: "Setup project",
      description: "Initial setup of the project structure",
      priority: "HIGH",
      status: "DONE",
      authorId: user1.id,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      name: "Create models",
      description: "Define the database models",
      priority: "HIGH",
      status: "IN_PROGRESS",
      authorId: user1.id,
    },
  });

  const task3 = await prisma.task.create({
    data: {
      name: "Write documentation",
      description: "Document the API endpoints",
      priority: "MEDIUM",
      status: "TODO",
      authorId: user2.id,
    },
  });

  console.log("Tasks created:");
  console.log(task1);
  console.log(task2);
  console.log(task3);

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
