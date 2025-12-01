import app from "./app";
import { config } from './config/environment';

const PORT = config.port || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Job Genie Backend server running on port ${PORT}`);
  console.log(`📍 Local: http://localhost:${PORT}`);
});
