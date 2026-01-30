# Personal Portfolio - AI-Powered Interactive Resume

**Live Site:** [https://rohitsakhuja.dev/](https://rohitsakhuja.dev/)

An AI-powered portfolio website featuring interactive job description analysis, contextual AI chat, and a modern animated interface. Built with React, TypeScript, and dual AI provider support.

## Tech Stack

- **Frontend:** React 19 + Vite 7 + TypeScript 5.9
- **3D/Particles:** Three.js, React Three Fiber, tsparticles
- **Animations:** Framer Motion
- **Styling:** Tailwind CSS
- **Backend:** Express + Node.js
- **Database:** PostgreSQL 16 (profile/CV data storage)
- **Caching:** Redis 7 (rate limiting & caching)
- **AI Providers:** OpenAI & Anthropic (dual provider support)
- **Testing:** Vitest + React Testing Library + MSW
- **Deployment:** Railway + Docker Compose (local dev)

## Features

### Core UI
- Interactive particle background
- 3D rotating geometric element
- Smooth scroll animations
- Typing effect on hero section
- Persistent view counter
- Mobile responsive
- Dark theme

### AI Chat (Ask AI)
- Contextual chat powered by real CV data from database
- Suggested questions loaded from database
- Session persistence for conversation continuity
- Anti-sycophancy guidelines for honest responses

### JD Analyzer
- Paste any job description for an honest fit assessment
- Three verdicts: **Strong Fit**, **Worth Conversation**, **Probably Not**
- Shows skill gaps and transferable skills
- Demo jobs available for testing the feature

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│    Frontend     │────▶│     Backend     │
│  React + Vite   │     │  Express/Node   │
└─────────────────┘     └────────┬────────┘
                                 │
                    ┌────────────┼────────────┐
                    ▼            ▼            ▼
              ┌──────────┐ ┌──────────┐ ┌──────────┐
              │ PostgreSQL│ │  Redis   │ │ AI Layer │
              │  (Data)   │ │ (Cache)  │ │(OpenAI/  │
              │           │ │          │ │Anthropic)│
              └──────────┘ └──────────┘ └──────────┘
```

## Security Implementation

### Rate Limiting
- Redis-backed with in-memory fallback
- JD Analysis: 10 requests/hour per IP
- Chat: 15 requests/hour per IP
- Fail-closed behavior on critical endpoints

### Input Validation
- Job descriptions: max 10,000 characters
- Chat messages: max 2,000 characters, max 50 messages per conversation
- Message role validation (user/assistant only)

### Database Security
- Parameterized SQL queries (SQL injection protection)
- Connection pooling with timeouts
- SSL/TLS configurable via `DATABASE_SSL_MODE`

### Privacy
- IP addresses hashed with SHA-256 before storage
- No PII stored in analytics

### AI Request Protection
- 30-second timeout on all AI calls
- Request cancellation support via AbortController

### Request Limits
- JSON body: 100KB max

## Local Development

```bash
# Start PostgreSQL and Redis containers
npm run db:up

# Run database migrations
npm run migrate

# Start backend server (requires .env file)
npm run dev:server

# Start frontend dev server (separate terminal)
npm run dev

# Reset database (drops and recreates)
npm run db:reset
```

## Testing

```bash
# Run all tests
npm run test:run

# Run tests in watch mode
npm run test
```

- 23 tests passing
- Uses Vitest + React Testing Library + MSW for API mocking

## Database Schema

Key tables managed via migrations:

| Table | Purpose |
|-------|---------|
| `candidate_profile` | Core profile information |
| `experiences` | Work history and roles |
| `skills` | Technical and soft skills |
| `gaps_weaknesses` | Honest self-assessment areas |
| `faq_responses` | Pre-defined Q&A content |
| `ai_instructions` | System prompts and guidelines |
| `chat_history` | Conversation persistence |
| `jd_analyses` | Job description analysis results |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/profile` | GET | Public profile data |
| `/api/chat` | POST | AI chat conversation |
| `/api/analyze-jd` | POST | Job description analysis |
| `/api/views` | GET | View counter |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `AI_PROVIDER` | `openai` or `anthropic` (default: openai) |
| `OPENAI_API_KEY` | OpenAI API key |
| `ANTHROPIC_API_KEY` | Anthropic API key (if using Anthropic) |
| `DATABASE_SSL_MODE` | SSL mode for PostgreSQL connections |
| `IP_HASH_SALT` | Salt for IP address hashing |
| `PORT` | Server port (default: 3000) |

## Deployment

Deployed on Railway with PostgreSQL and Redis addons.

```bash
railway up
```

## License

MIT
