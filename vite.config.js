import react from '@vitejs/plugin-react';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import { resolve } from 'node:path';
import process from 'node:process';
import { defineConfig } from 'vitest/config';

const diaryDataDirectory = resolve(process.cwd(), 'data');
const diaryDataFile = resolve(diaryDataDirectory, 'vibeDiaryData.json');

async function readRequestBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks).toString('utf8');
}

function diaryFileApiPlugin() {
  return {
    name: 'vibe-diary-file-api',
    configureServer(server) {
      server.middlewares.use('/api/diary', async (request, response, next) => {
        try {
          response.setHeader('Content-Type', 'application/json; charset=utf-8');

          if (request.method === 'GET') {
            try {
              const storedValue = await readFile(diaryDataFile, 'utf8');
              response.end(storedValue);
            } catch (error) {
              if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
                response.end('[]');
                return;
              }

              throw error;
            }

            return;
          }

          if (request.method === 'POST') {
            const body = await readRequestBody(request);
            const entries = JSON.parse(body);

            if (!Array.isArray(entries)) {
              response.statusCode = 400;
              response.end(JSON.stringify({ error: 'Diary payload must be an array.' }));
              return;
            }

            await mkdir(diaryDataDirectory, { recursive: true });
            await writeFile(diaryDataFile, `${JSON.stringify(entries, null, 2)}\n`, 'utf8');
            response.end(JSON.stringify(entries));
            return;
          }

          response.statusCode = 405;
          response.end(JSON.stringify({ error: 'Method not allowed.' }));
        } catch (error) {
          next(error);
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), diaryFileApiPlugin()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts',
  },
});
