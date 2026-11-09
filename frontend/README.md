
# IndicAcademic AI

IndicAcademic AI is an academic companion for students working through Indian university curricula. The planned product will combine syllabus-aware study tools, document-based question answering, exam-oriented explanations, quizzes, and learning progress tracking.

## Current status

The repository currently contains the Next.js frontend foundation and a responsive product landing page. The landing page communicates the planned feature set, but the application workflows are not implemented yet: authentication, document uploads, AI question answering, quizzes, persistence, and progress tracking are still planned.

## Planned architecture

The project is being developed as a Next.js App Router application with TypeScript and Tailwind CSS.

### Frontend

- `app/`: routes, layouts, server components, and client interactions
- Reusable UI components for the dashboard, syllabus navigation, chat, documents, quizzes, and progress views
- Form validation and explicit loading, empty, and error states
- Responsive student experience for desktop and mobile

### Application and API layer

- Next.js route handlers and/or server actions for application workflows
- Authentication and authorization for students and future administrators
- Request validation, rate limiting, structured errors, and observability
- AI response streaming for interactive question answering

### Data and AI layer

- Relational database for users, institutions, courses, subjects, documents, conversations, quizzes, and progress
- Object storage for uploaded PDFs and notes
- Document extraction, chunking, embeddings, and vector search
- Retrieval-augmented generation grounded in a student's selected syllabus and uploaded sources
- Citations, usage limits, retries, and evaluation of academic answer quality

The architecture is intentionally described as planned because those backend and AI services have not been added to this repository yet.

## Requirements

- Node.js 20.9 or newer
- npm

## Run locally

Install dependencies from this directory:

```bash
npm install
```

Create a local environment file when backend integrations are introduced:

```bash
copy .env.example .env.local
```

There is no `.env.example` file yet because the current landing page does not read environment variables. The planned variables are listed below as placeholders so the expected configuration is documented in advance.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

## Environment variables

None are required by the current landing page. Do not add real secrets to the repository. These are planned placeholders for future integrations:

```dotenv
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication
AUTH_SECRET=replace-with-a-random-secret

# Database
DATABASE_URL=replace-with-database-connection-string

# AI provider
AI_API_KEY=replace-with-provider-key
AI_MODEL=replace-with-model-name

# File and object storage
STORAGE_ENDPOINT=replace-with-storage-endpoint
STORAGE_BUCKET=replace-with-bucket-name
STORAGE_ACCESS_KEY=replace-with-access-key
STORAGE_SECRET_KEY=replace-with-secret-key

# Vector search
VECTOR_DATABASE_URL=replace-with-vector-database-url
VECTOR_DATABASE_API_KEY=replace-with-vector-database-key
```

Only variables prefixed with `NEXT_PUBLIC_` should be exposed to browser code. Server-only credentials must remain unprefixed and must be accessed from server-side code.

## Available commands

Run the development server:

```bash
npm run dev
```

Run ESLint:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```

Run the production build locally after building:

```bash
npm run start
```

### Tests

A test runner has not been configured yet, so there is currently no `npm test` command. Once unit, integration, or end-to-end testing is added, the test script should be added to `package.json` and run with:

```bash
npm test
```

Until then, the available automated checks are `npm run lint` and `npm run build`.

## Project structure

```text
app/
	globals.css       Global styles and Tailwind entry point
	layout.tsx        Root layout, fonts, and product metadata
	page.tsx          Current landing page
public/             Static assets
next.config.ts      Next.js configuration
package.json        Scripts and dependencies
```

## Product roadmap

The first complete vertical slice should support:

1. Student sign-in and onboarding
2. University, semester, and subject selection
3. Academic document upload with validation
4. A syllabus-grounded question and answer workflow
5. Source citations and saved conversation history
6. A basic quiz generated from the selected material
7. Progress tracking for answered questions and quiz results

The landing page is the starting point for that experience; it is not yet the experience itself.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
