import express from 'express';
import { body } from 'express-validator';
import { 
  createInspection, 
  getAllInspections, 
  getInspectionById, 
  updateInspection, 
  deleteInspection,
  generateReport
} from '../controllers/inspectionController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Validation middleware
const inspectionValidation = [
  body('property_data').isObject().withMessage('Property data is required'),
  body('property_data.address').notEmpty().withMessage('Property address is required'),
  body('structural_conditions').isObject().withMessage('Structural conditions data is required'),
  body('installations').isObject().withMessage('Installations data is required'),
  body('inspector_data').isObject().withMessage('Inspector data is required'),
  body('inspector_data.name').notEmpty().withMessage('Inspector name is required')
];

// Routes
router.post('/', inspectionValidation, createInspection);
router.get('/', getAllInspections);
router.get('/:id', getInspectionById);
router.put('/:id', inspectionValidation, updateInspection);
router.delete('/:id', deleteInspection);
router.get('/:id/report', generateReport);

export default router;
