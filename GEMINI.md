# Gemini Context for Express.js Project: "Central-Backend"

## 🚀 Project Overview

This project is a RESTful API for managing faculty data, built with **Express.js** and **Javascript**. The primary goal is to provide CRUD (Create, Read, Update, Delete) operations for faculty management.

The database is **MySQL**, and we use **Prisma** as the ORM.

## 📁 Directory Structure

- `/bin`: Script to run app
- `/middlewares`: Custom middleware functions.
- `/prisma`: Folder for Prisma ORM configuration
- `/public`: Public folder for application assets.
- `/routes`: Express router files. Each file corresponds to a resource.
- `app.js`: The Express app setup.

## 💻 Coding Standards & Conventions

- **Language**: Use **JavaScript**.
- **Style**: Follow the **Airbnb JavaScript Style Guide**. Use Prettier for automatic formatting.
- **Routing**: Define routes in dedicated files within `/routes`. Use plural nouns for resource names (e.g., `/api/products`).
- **Error Handling**: Use a centralized error-handling middleware. Throw custom error classes that extend the native `Error` object.
- **Asynchronous Operations**: Use `async/await` for all asynchronous code. Avoid using `.then()` and callbacks. Wrap controller functions in a utility like `express-async-handler` to catch promise rejections.

## 🧪 Testing

- We use **Jest** as the testing framework and **Supertest** for API endpoint testing.
- Tests are located in a `__tests__` directory alongside the files they are testing.
- Focus on integration tests for the API endpoints.

## Commands

- **Install dependencies:** `npm install`
- **Run the application:** `npm start` (based on standard Node.js conventions)
- **Run database migrations:** `npx prisma migrate dev`

## Development Notes

- Remember to keep the Prisma schema (`prisma/schema.prisma`) and the database in sync.
- When adding new routes, follow the existing structure in the `routes/` directory.
- Environment variables are managed in a `.env` file. A `.env.example` file is provided as a template.
