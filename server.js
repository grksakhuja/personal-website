import express from 'express';
import compression from 'compression';
import { createClient } from 'redis';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Redis client
let redis = null;
let viewCount = 0; // Fallback for local dev

async function initRedis() {
  if (process.env.REDIS_URL) {
    try {
      redis = createClient({ url: process.env.REDIS_URL });
      redis.on('error', (err) => console.error('Redis error:', err));
      await redis.connect();
      console.log('Connected to Redis');
    } catch (err) {
      console.error('Failed to connect to Redis:', err);
      redis = null;
    }
  } else {
    console.log('No REDIS_URL - using in-memory counter (local dev)');
  }
}

// Middleware
app.use(compression());

// API: Increment and return view count
app.get('/api/views', async (req, res) => {
  try {
    let count;
    if (redis) {
      count = await redis.incr('portfolio:views');
    } else {
      viewCount++;
      count = viewCount;
    }
    res.json({ views: count });
  } catch (err) {
    console.error('View count error:', err);
    res.status(500).json({ error: 'Failed to get view count' });
  }
});

// API: Get count without incrementing
app.get('/api/views/count', async (req, res) => {
  try {
    let count;
    if (redis) {
      count = (await redis.get('portfolio:views')) || 0;
    } else {
      count = viewCount;
    }
    res.json({ views: parseInt(count, 10) });
  } catch (err) {
    console.error('View count error:', err);
    res.status(500).json({ error: 'Failed to get view count' });
  }
});

// Serve static files
app.use(express.static(join(__dirname, 'dist')));

// SPA fallback
app.get('/{*splat}', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Start server
async function start() {
  await initRedis();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
