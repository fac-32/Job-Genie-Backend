// Import express (the web framework)
import express from 'express';
// Import cors (allows frontend to talk to backend)
import cors from 'cors';
// Import our routes
import companyRoutes from './routes/companyRoutes.js';

// Create the express app
const app = express();

// Choose which port to run on
const PORT = 3000;

// ===== MIDDLEWARE (runs before routes) =====

// cors() allows requests from different origins (like localhost:5173)
app.use(cors());

// express.json() lets us receive JSON data in requests
app.use(express.json());

// ===== ROUTES =====

// All routes starting with /api/companies use companyRoutes
// So /api/companies/Google/overview gets handled by companyRoutes
app.use('/api/companies', companyRoutes);

// Test route to check if server is running
app.get('/', (req, res) => {
	res.json({ message: 'Backend is running!' });
});

// ===== START SERVER =====

// "listen" starts the server
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
	console.log(
		`API endpoint: http://localhost:${PORT}/api/companies/:companyName/overview`
	);
});
