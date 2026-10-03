import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');

// Serve static assets from dist if it exists
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Health check endpoint for Render zero-downtime deploy
app.get('/healthz', (_req, res) => {
  res.status(200).send('OK');
});

// Single Page Application (SPA) fallback
app.get('*', (_req, res) => {
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>MTC Stream Control</title>
        </head>
        <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f8fafc; color: #334155;">
          <div style="text-align: center; max-width: 480px; padding: 28px; background: white; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
            <h2 style="color: #1e293b; margin-top: 0;">MTC Stream Control</h2>
            <p style="font-size: 14px; line-height: 1.5;">La aplicación se está inicializando o falta compilar los archivos de producción.</p>
            <p style="font-size: 13px; color: #64748b;">En Render, asegúrate de que el <strong>Build Command</strong> sea:<br><code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">npm install && npm run build</code></p>
          </div>
        </body>
      </html>
    `);
  }
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`MTC Stream Control running on http://0.0.0.0:${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
