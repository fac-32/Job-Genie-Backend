import app from './app.js';
import { Request, Response, NextFunction } from 'express';
import { config } from './config/environment.js';

import wishlistRouter from './routes/wishlist.route.js';

const PORT = config.port || 3000;

// API routing
app.use('/api/wishlist', wishlistRouter);

// 404 handler
app.use((req: Request, res: Response) => {
	res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
	console.log(`🚀 Job Genie Backend server running on port ${PORT}`);
	console.log(`📍 Local: http://localhost:${PORT}`);
});
