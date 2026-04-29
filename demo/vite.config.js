import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

const DATA = path.join(__dirname, 'demo', 'data', 'data.json');

function getPaginatedItems(items, offset, limit) {
  return items.slice(offset, offset + limit);
}

function commentsHandler(req, res) {
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const nextOffset = offset + limit;
  const previousOffset = offset - limit < 1 ? 0 : offset - limit;

  const ITEMS = JSON.parse(fs.readFileSync(DATA));

  const meta = {
    limit: limit,
    next: `?limit=${limit}&offset=${nextOffset}`,
    offset: req.query.offset,
    previous: `?limit=${limit}&offset=${previousOffset}`,
    total_count: ITEMS.length,
  };

  const json = {
    meta: meta,
    comments: getPaginatedItems(ITEMS, offset, limit),
  };

  res.json(json);
}

const commentsPlugin = {
  name: 'comments-api',
  configureServer(server) {
    server.middlewares.use('/comments', commentsHandler);
  },
};

export default defineConfig({
  plugins: [react(), commentsPlugin],
  root: 'demo',
  base: '/',
  build: {
    outDir: 'build',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'js', 'demo.jsx'),
      output: {
        entryFileNames: 'demo.js',
        assetFileNames: 'assets/[name][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
  resolve: {
    alias: {
      'react-paginate': path.resolve(__dirname, '..', 'react_components'),
    },
  },
  server: {
    port: 3000,
  },
});