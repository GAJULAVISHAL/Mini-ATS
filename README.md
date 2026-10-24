# Mini ATS

Mini ATS is a lightweight applicant tracking system for creating jobs, uploading resumes, reviewing applicants, and ranking candidates by resume-to-job match.

## Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Bun, Express, TypeScript
- **Database:** PostgreSQL with Prisma
- **Resume parsing:** PDF and DOCX uploads

## Prerequisites

- [Bun](https://bun.sh/)
- PostgreSQL

## Setup

1. Configure the database connection in `Back/.env`:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
   PORT=5000
   ```

2. Install dependencies and initialize Prisma:

   ```bash
   cd Back
   bun install
   bunx prisma generate
   bunx prisma migrate dev
   ```

3. Install frontend dependencies:

   ```bash
   cd ../frontend
   bun install
   ```

   The frontend backend URL is configured in `frontend/.env`:

   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```

## Run locally

Start the API:

```bash
cd Back
bun run dev
```

In a second terminal, start the frontend:

```bash
cd frontend
bun run dev
```

Open the Vite URL shown in the terminal. The frontend proxies `/api` requests to the backend at `http://localhost:5000`.

## Features

- Create and manage job postings
- Upload PDF and DOCX resumes
- View applicants for each job
- Generate match reports
- Review candidate rankings
- Health check at `GET /api/health`

## Tests and checks

```bash
cd Back
bun test

cd ../frontend
bun run lint
bun run build
```