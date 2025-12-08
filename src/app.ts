import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import signinRoutes from './routes/routesSignin.js';

import companyRoutes from './routes/CompanyRoutes.js';
const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/signin', signinRoutes);
//route
app.use('/api/companies', companyRoutes);

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

export default app;
