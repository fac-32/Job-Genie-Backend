import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import signinRoutes from './routes/routesSignin.js';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/signin', signinRoutes);

// Basic health check route
app.get('/health', (req: Request, res: Response) => {
	res
		.status(200)
		.json({ status: 'ok', message: 'Job Genie Backend is running' });
});

// Root route
app.get('/', (req: Request, res: Response) => {
	res.json({ message: 'Welcome to Job Genie API' });
});

// 404 handler
app.use((req: Request, res: Response) => {
	res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(500).json({ error: 'Something went wrong!' });
});

export default app;
