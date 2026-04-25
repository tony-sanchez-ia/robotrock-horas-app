import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import hoursRoutes from './routes/hours.js';
import expensesRoutes from './routes/expenses.js';
import summaryRoutes from './routes/summary.js';
import adminRoutes from './routes/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/hours', hoursRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/admin', adminRoutes);

// In production, serve the Vite-built frontend
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  
  // 1. Servir archivos estáticos PRIMERO (sw.js, manifest.webmanifest, iconos, assets)
  app.use(express.static(distPath, { 
    maxAge: '1h',
    setHeaders: (res, filePath) => {
      // Service Worker no debe cachearse agresivamente
      if (filePath.endsWith('sw.js') || filePath.endsWith('manifest.webmanifest')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    }
  }));

  // 2. SPA fallback: SOLO rutas que NO son archivos reales ni API
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    } else {
      next();
    }
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
