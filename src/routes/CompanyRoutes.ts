// backend/src/routes/companyRoutes.ts

// Import express
import express from 'express';
// Import our controller
import { CompanyController } from '../controllers/companyController.js';

// "Router()" creates a mini-app for handling routes
const router = express.Router();

// Create an instance of our controller
const controller = new CompanyController();

// ROUTE 1: GET /api/companies/:companyName/overview
// ":companyName" is a parameter - can be any value
// When someone visits this URL, run controller.getCompanyOverview
router.get('/:companyName/overview', controller.getCompanyOverview);

// ROUTE 2: GET /api/companies/:companyName/jobs
router.get('/:companyName/jobs', controller.getCompanyJobs);

// Export so server.ts can use it
export default router;
