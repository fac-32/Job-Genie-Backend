import app from './app.js';
import { config } from './config/environment.js';

const PORT = config.port || 3000;

app.listen(PORT, () => {
	console.log(`🚀 Job Genie Backend server running on port ${PORT}`);
	console.log(`📍 Local: http://localhost:${PORT}`);
});
