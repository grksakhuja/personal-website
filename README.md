# Personal Portfolio

**Live Site:** [https://personal-portfolio-production-9347.up.railway.app/](https://personal-portfolio-production-9347.up.railway.app/)

A modern, animated portfolio site built with React, Three.js, and Framer Motion.

## Tech Stack

- **Framework:** React 18 + Vite + TypeScript
- **3D/Particles:** Three.js, React Three Fiber, tsparticles
- **Animations:** Framer Motion
- **Styling:** Tailwind CSS
- **Backend:** Express + Redis (view counter)
- **Deployment:** Railway

## Features

- Interactive particle background
- 3D rotating geometric element
- Smooth scroll animations
- Typing effect on hero section
- Persistent view counter
- Mobile responsive
- Dark theme

## Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Run production server locally
node server.js
```

## Deployment

Deployed on Railway with Redis for the view counter.

```bash
railway up
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `REDIS_URL` | Redis connection string (optional - falls back to in-memory for local dev) |
| `PORT` | Server port (default: 3000) |

## License

MIT
