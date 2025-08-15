import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from './routes/auth.js';
import notesRouter from './routes/notes.js';
import authMiddleware from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Only load .env file in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.join(__dirname, '.env') });
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Health route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/notes', authMiddleware, notesRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 