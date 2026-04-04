# Full-Stack Task Management System

It features a secure Node.js/Express backend using an SQLite database via Prisma, and a modern Next.js React frontend.

## 🚀 Tech Stack
* **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
* **Backend:** Node.js, Express, TypeScript, Prisma ORM, SQLite
* **Authentication:** JWT (Short-lived Access Tokens + Long-lived Refresh Tokens)

## 🛠️ Setup Instructions

### 1. Backend Setup (`/task-manager-api`)
1. Navigate to the API directory: `cd task-manager-api`
2. Install dependencies: `npm install`
3. Rename the `.env.example` file to `.env`.
4. Initialize the database: `npx prisma migrate dev`
5. Start the server: `npm run dev` (Runs on `http://localhost:5000`)

### 2. Frontend Setup (`/task-manager-web`)
1. Open a new terminal and navigate to the web directory: `cd task-manager-web`
2. Install dependencies: `npm install`
3. Start the frontend server: `npm run dev` (Runs on `http://localhost:3000`)

### 🔑 Features Implemented
* Complete User Authentication (Register, Login, Logout)
* Secure JWT handling with automatic background token refreshing via an Axios/Fetch wrapper.
* Full CRUD functionality for tasks (Create, Read, Update, Delete, Toggle Status).
* Dashboard with search, status filtering, and pagination.
* Toast notifications for all success/error states.