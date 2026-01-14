import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function printServiceSummary(): Plugin {
  return {
    name: 'print-service-summary',
    configureServer(server) {
      server.httpServer?.once('listening', () => {
        setTimeout(() => {
          console.log('\n╔═══════════════════════════════════════════════════╗');
          console.log('║         Pointing Poker - France TV                ║');
          console.log('╠═══════════════════════════════════════════════════╣');
          console.log('║  Service          │  Port                         ║');
          console.log('╠───────────────────┼───────────────────────────────╣');
          console.log('║  Serveur API      │  3001                         ║');
          console.log('║  Client (Vite)    │  5173                         ║');
          console.log('║  PostgreSQL       │  5435 (ext) : 5432 (int)      ║');
          console.log('╚═══════════════════════════════════════════════════╝\n');
        }, 100);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), printServiceSummary()],
  server: {
    port: 5173,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
