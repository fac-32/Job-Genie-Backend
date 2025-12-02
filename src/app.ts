import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check route
app.get('/health', (req: Request, res: Response) => {
	return res
		.status(200)
		.json({ status: 'ok', message: 'Job Genie Backend is running' });
});

// Root route
app.get('/', (req: Request, res: Response) => {
	return res.json({ message: 'Welcome to Job Genie API' });
});

export default app;
