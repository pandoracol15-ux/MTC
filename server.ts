import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

app.get('/healthz', (_req: Request, res: Response) => {
  res.status(200).send('OK');
});

app.get('*', (_req: Request, res: Response) => {
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send('MTC Stream Control is building...');
  }
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`MTC Stream Control running on http://0.0.0.0:${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
