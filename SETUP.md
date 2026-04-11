# Project Setup & Installation Guide

Welcome to the Afterlife AI project. This guide will walk you through the steps to set up this application on your local machine and connect it to your database.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)
- A Neon Postgres database (or any PostgreSQL database)

## 1. Clone the Repository

First, clone the project repository to your local machine:

```bash
git clone <your-repo-url>
cd afterlifeai
```

## 2. Install Dependencies

Install the necessary npm packages using either npm, pnpm, or yarn (npm is shown here):

```bash
npm install
```

## 3. Environment Variables

We need to configure our environment variables to integrate the database and other secrets.

1. Copy the example environment file to create a new `.env` file:
   ```bash
   cp .env.example .env
   ```
2. Open the `.env` file in your code editor and fill in your details:
   - `DATABASE_URL="your_neon_db_connection_url"` - You can get this from your Neon console.

## 4. Setup Database schema

This project uses Drizzle ORM to manage the database. To set up your schema and tables on your connected PostgreSQL database:

1. **Option A: Push schema directly** (Recommended for new setup):
   ```bash
   npm run db:push
   ```
   *This automatically creates tables directly from the drizzle schema without saving migration states.*

2. **Option B: Generate and run migrations**:
   If you want to maintain a migration history:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

*(Optional)* You can manage your database via Drizzle's nice UI using:
```bash
npm run db:studio
```

## 5. Run the Application

Now you're ready to start the application:

```bash
npm run dev
```

The application should be running on `http://localhost:3000`.

## Scripts Available
- `npm run dev` - Starts local development server using Turbopack
- `npm run build` - Builds Next.js for production
- `npm run start` - Starts production server
- `npm run format` - Runs Prettier to format codebase
- `npm run lint` - Runs ESLint checks
