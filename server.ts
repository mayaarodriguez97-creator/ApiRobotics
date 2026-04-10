import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Mock Data
  const hives = [
    { id: 'HIVE-001', farmId: 'FUNDO-ALTO', battery: 85, temp: 34.2, humidity: 60, status: 'active', lastConnection: '2026-04-10T00:45:00Z' },
    { id: 'HIVE-002', farmId: 'FUNDO-ALTO', battery: 12, temp: 33.8, humidity: 62, status: 'warning', lastConnection: '2026-04-10T00:50:00Z' },
    { id: 'HIVE-003', farmId: 'FUNDO-BAJO', battery: 92, temp: 35.1, humidity: 58, status: 'active', lastConnection: '2026-04-10T01:00:00Z' },
    { id: 'HIVE-004', farmId: 'FUNDO-BAJO', battery: 0, temp: 0, humidity: 0, status: 'offline', lastConnection: '2026-04-09T18:30:00Z' },
  ];

  const farms = [
    { id: 'FUNDO-ALTO', name: 'Fundo Alto Valle', location: 'Ica, Perú', contractStatus: 'active', totalHives: 150 },
    { id: 'FUNDO-BAJO', name: 'Fundo Bajo Sol', location: 'Chao, Perú', contractStatus: 'active', totalHives: 85 },
  ];

  const alerts = [
    { id: 1, type: 'critical', message: 'HIVE-002: Batería Crítica (12%)', timestamp: '2026-04-10T00:55:00Z' },
    { id: 2, type: 'warning', message: 'HIVE-004: Sin conexión por más de 6 horas', timestamp: '2026-04-10T01:00:00Z' },
  ];

  // API Routes
  app.get('/api/hives', (req, res) => {
    res.json(hives);
  });

  app.get('/api/farms', (req, res) => {
    res.json(farms);
  });

  app.get('/api/alerts', (req, res) => {
    res.json(alerts);
  });

  // Health check for Stitch frontend
  app.get('/api/health-summary', (req, res) => {
    const activeHives = hives.filter(h => h.status === 'active').length;
    const efficiency = 94; // Mock KPI
    res.json({
      status: 'ok',
      activeHives,
      totalHives: hives.length,
      efficiency: `+${efficiency}%`,
      lastUpdate: new Date().toISOString()
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
