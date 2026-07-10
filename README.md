# AuraAI

AuraAI is a premium AI-powered Chrome assistant for browser workflows, assistant chat, page-aware actions, voice commands, and productivity automation. It is built as a split deployment:

- `client/` on Vercel
- `server/` on Render
- PostgreSQL on Neon

## Overview

AuraAI combines a modern SaaS-style interface with backend-driven AI features for:

- chat sessions
- summarize, rewrite, explain, translate, and brainstorm actions
- page-aware assistant behavior
- voice command handling
- assistant customization
- secure authentication and protected routes

## Tech Stack

### Frontend

- React 19
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React

### Backend

- Node.js
- Express
- Prisma
- PostgreSQL
- Neon
- JWT auth with cookies
- CORS, CSP, request logging, and security headers

### Tooling

- GitHub Actions
- Playwright scaffold
- ESLint
- npm audit
- Render deployment for the server
- Vercel deployment for the client

## Repository Structure

```txt
AuraAI/
|-- client/        # React frontend
|-- server/        # Express + Prisma backend
|-- api/           # Vercel API bridge when needed
|-- .github/       # CI workflow
|-- README.md
```

## Key Features

### Assistant

- multi-session chat
- page-aware responses
- rewrite, summarize, translate, explain, and draft tools
- voice input support
- quick actions and command-style input

### UI

- dark-first premium design
- glassmorphism panels
- gradient accents
- responsive layouts for mobile, tablet, laptop, and desktop
- compact extension-friendly assistant screens

### Security

- HTTP-only cookies
- protected auth flows
- strict CORS allowlist
- security headers and CSP
- request logging
- rate limiting

## Local Development

### Prerequisites

- Node.js 20+ or 22+
- npm
- Neon PostgreSQL database
- Render backend deployment or local backend setup

### Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### Environment variables

#### `client/.env`

```env
VITE_SERVER_URL=https://your-render-backend.onrender.com
```

#### `server/.env`

```env
PORT=8080
DATABASE_URL=postgresql://...
TEST_DATABASE_URL=postgresql://...
JWT_SECRET=your_jwt_secret
CLIENT_URL=https://your-vercel-app.vercel.app
CLIENT_ORIGINS=https://your-vercel-app.vercel.app,http://localhost:5173
COOKIE_SAME_SITE=none
NODE_ENV=production
GEMINI_API_KEY=your_gemini_key
OPENROUTER_API_KEY=
```

Do not commit secrets to the repository.

### Database setup

From `server/`:

```bash
npx prisma generate
npx prisma migrate dev
```

For production:

```bash
npx prisma migrate deploy
```

## Run Locally

### Start the backend

```bash
cd server
npm run dev
```

### Start the frontend

```bash
cd client
npm run dev
```

## Available Scripts

### Client

```bash
npm run dev
npm run build
npm run lint
npm run preview
npm run test:e2e
```

### Server

```bash
npm run dev
npm run prisma:generate
npm run prisma:migrate
npm run prisma:deploy
npm run test
npm run test:api
```

## Deployment

### Server on Render

1. Deploy the `server/` directory.
2. Add production environment variables.
3. Point `DATABASE_URL` to Neon.
4. Set `CLIENT_ORIGINS` to your Vercel domain and local dev domains if needed.
5. Ensure cookies are configured for cross-origin auth.

### Client on Vercel

1. Deploy the `client/` directory.
2. Set `VITE_SERVER_URL` to your Render backend URL.
3. Use the Vite build output directory: `dist`.

Recommended Vercel settings:

- Root Directory: `client`
- Build Command: `npm run build`
- Output Directory: `dist`

## API Surface

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/logout`

### User

- `GET /api/user/current`
- `POST /api/user/update`
- `GET /api/user/chats`
- `POST /api/user/chats`
- `PATCH /api/user/chats/:id`
- `DELETE /api/user/chats/:id`

### Assistant

- `POST /api/assistant/respond`
- `POST /api/assistant/classify`

## Troubleshooting

### Login or signup fails

- verify `VITE_SERVER_URL` points to the Render backend
- confirm `CLIENT_ORIGINS` includes your Vercel domain
- set `COOKIE_SAME_SITE=none` for production cross-site cookies
- confirm `NODE_ENV=production` on Render

### White screen on Vercel

- check browser console errors
- verify the client build completed successfully
- ensure the Vercel project is rooted at `client/`
- confirm the deployed app can reach the backend URL

### API requests fail

- verify the Render server is running
- check CORS allowlist values
- confirm cookies are being sent with credentials
- review server logs for authentication or Prisma errors

### Database issues

- confirm Neon connection strings are correct
- run Prisma migrations
- regenerate Prisma client after schema changes

## Contributing

1. Create a feature branch.
2. Keep UI changes isolated from backend logic unless required.
3. Do not expose secrets in commits.
4. Run lint/build/tests before opening a PR.

## License

ISC
