import express from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './configs/environment';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', routes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      statusCode: 404,
      timestamp: new Date().toISOString()
    }
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(config.PORT, () => {
  console.log(`🚀 Audio Player API running on port ${config.PORT}`);
  console.log(`📁 Upload directory: ${path.join(__dirname, '../uploads')}`);
  console.log(`🌍 Environment: ${config.NODE_ENV}`);
}); 