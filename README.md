# Job Genie — Backend

The API layer for Job Genie. Handles authentication, company wishlist management, and job fetching, with Claude powering company recommendations.

## Features

- Google OAuth and email/password auth via Supabase
- Secure HTTP-only cookie session management
- AI-generated company recommendations using Claude (Anthropic SDK)
- Wishlist CRUD with duplicate prevention and Clearbit logo fallback
- Job listings fetched from TheirStack
- Skill-based match scoring against job requirements

## Tech stack

- Node.js, Express 5, TypeScript
- Supabase (database + auth)
- Anthropic SDK (Claude)
- Google Auth Library
- Vitest + Supertest
- Nodemon, Prettier, Husky

## Getting started

### Prerequisites

- Node.js v18+
- A [Supabase](https://supabase.com/) project
- An [Anthropic API key](https://console.anthropic.com/)
- A [Google OAuth app](https://console.cloud.google.com/)
- A [TheirStack](https://theirstack.com/) token

### Setup

```bash
git clone https://github.com/fac-32/Job-Genie-Backend.git
cd Job-Genie-Backend
npm install
cp .env.example .env
```

Fill in your `.env`:

```
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SUPABASE_URL=
SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=
THEIRSTACK_TOKEN=
```

```bash
npm run dev
```

### Tests

```bash
npm test
```

## API routes

| Method | Path                     | Description                     |
| ------ | ------------------------ | ------------------------------- |
| POST   | `/auth/signin`           | Email/password login            |
| POST   | `/auth/signup`           | Register new user               |
| POST   | `/auth/google`           | Google OAuth login              |
| GET    | `/auth/me`               | Get current user                |
| GET    | `/api/wishlist`          | Get wishlist                    |
| POST   | `/api/wishlist/generate` | AI-generate company suggestions |
| POST   | `/api/wishlist/add`      | Add companies to wishlist       |
| DELETE | `/api/wishlist/remove`   | Remove a company                |
| GET    | `/api/companies`         | Get company overview with jobs  |
| POST   | `/jobs`                  | Fetch job listings              |

## Project structure

```
src/
├── controllers/
│   ├── companyController.ts
│   ├── controllerSignin.ts
│   ├── jobsController.ts
│   └── wishlist.controller.ts
├── routes/
├── services/
├── config/
└── types/
```
