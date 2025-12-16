import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import signinRoutes from './routes/routesSignin.js';
import companyRoutes from './routes/CompanyRoutes.js';
import wishlistRouter from './routes/wishlist.route.js';
import jobRoutes from './routes/jobRoutes.js';

const app: Application = express();

const allowedOrigins = [
	'http://localhost:5173', // Vite dev
	'https://job-genie-frontend-i50i.onrender.com', // deployed frontend (Netlify/Vercel/etc)
];

// Middleware
app.use(
	cors({
		origin: allowedOrigins,
		credentials: true, // allow cookies / auth headers
	})
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routing
app.use('/api/wishlist', wishlistRouter);

// Routes
app.use('/auth', signinRoutes);
//route
app.use('/api/companies', companyRoutes);
app.use('/jobs', jobRoutes);

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
