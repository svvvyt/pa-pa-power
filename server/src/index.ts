import express from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './configs/environment';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api', routes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(config.PORT, () => {
  console.log(`🚀 Audio Player API running on port ${config.PORT}`);
  console.log(`📁 Upload directory: ${path.join(__dirname, '../uploads')}`);
}); 