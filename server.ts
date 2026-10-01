import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
// @ts-ignore
import busArrivalHandler from './api/bus-arrival.js';
// @ts-ignore
import carparksHandler from './api/carparks.js';
// @ts-ignore
import trafficIncidentsHandler from './api/traffic-incidents.js';
// @ts-ignore
import trainAlertsHandler from './api/train-alerts.js';
// @ts-ignore
import healthHandler from './api/health.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Mount API endpoints
  app.all('/api/health', (req, res) => healthHandler(req, res));
  app.all('/api/bus-arrival', (req, res) => busArrivalHandler(req, res));
  app.all('/api/carparks', (req, res) => carparksHandler(req, res));
  app.all('/api/traffic-incidents', (req, res) => trafficIncidentsHandler(req, res));
  app.all('/api/train-alerts', (req, res) => trainAlertsHandler(req, res));

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

startServer();
