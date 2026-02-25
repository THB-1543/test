import { createApp } from './app';
import { initializeDatabase } from './database/database';
import path from 'path';
import fs from 'fs';

const PORT = parseInt(process.env.PORT || '3001', 10);

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
initializeDatabase();
console.log('Database initialized');

// Start server
const app = createApp();
app.listen(PORT, () => {
  console.log(`CRM API server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
