import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg',
  '.mpeg': 'audio/mpeg',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  const relPath = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
  const filePath = path.join(__dirname, relPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const totalSize = stats.size;
    const rangeHeader = req.headers.range;

    // Support HTTP Range requests (crucial for audio/video streaming & fast mobile buffering)
    if (rangeHeader) {
      const parts = rangeHeader.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;

      if (start >= totalSize || end >= totalSize || start > end) {
        res.writeHead(416, {
          'Content-Range': `bytes */${totalSize}`
        });
        res.end();
        return;
      }

      const chunkSize = (end - start) + 1;
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${totalSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });

      fs.createReadStream(filePath, { start, end }).pipe(res);
    } else {
      const isCode = ext === '.html' || ext === '.js' || ext === '.mjs';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': totalSize,
        'Accept-Ranges': 'bytes',
        'Cache-Control': isCode ? 'no-cache, no-store, must-revalidate' : 'public, max-age=3600'
      });

      fs.createReadStream(filePath).pipe(res);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Wedding Invitation server running at http://localhost:${PORT}`);
});
