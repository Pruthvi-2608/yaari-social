import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173', // Vite default port
  'http://localhost:5174', // Admin dev port
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:3000',
  'https://yaari-social.vercel.app',
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(null, true); // Dev permissive
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API routes
app.use('/api', apiRouter);

// Serve frontend static media and assets (for Admin panel and API consumers)
const frontendPublicPath = path.join(__dirname, '..', '..', 'frontend', 'public');
app.use('/media', express.static(path.join(frontendPublicPath, 'media')));
app.use('/images', express.static(path.join(frontendPublicPath, 'images')));
app.use('/brand', express.static(path.join(frontendPublicPath, 'brand')));
app.use(express.static(frontendPublicPath));

// Serve admin static build if it exists
const adminBuildPath = path.join(__dirname, 'admin', 'dist');
app.use('/admin', express.static(adminBuildPath));
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(adminBuildPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('Admin dashboard build not found. Running in development mode.');
    }
  });
});

// Root welcome
app.get('/', (req, res) => {
  res.json({
    message: 'Yaari Social Cafe API & Admin Server',
    health: '/api/health',
    menu: '/api/menu',
    docs: '/api/health'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`☕ Yaari Social Cafe API running on http://localhost:${PORT}`);
    console.log(`📡 Health endpoint: http://localhost:${PORT}/api/health`);
  });
}

export default app;
