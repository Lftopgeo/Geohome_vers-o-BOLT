import express from 'express';
import { body } from 'express-validator';
import { 
  createExternalArea, 
  getExternalAreasByInspection, 
  getExternalAreaById, 
  updateExternalArea, 
  deleteExternalArea 
} from '../controllers/externalAreaController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Validation middleware
const externalAreaValidation = [
  body('inspection_id').notEmpty().withMessage('Inspection ID is required'),
  body('name').notEmpty().withMessage('Area name is required'),
  body('type').notEmpty().withMessage('Area type is required'),
  body('condition').notEmpty().withMessage('Area condition is required'),
  body('items').isArray().withMessage('Items must be an array')
];

// Routes
router.post('/', externalAreaValidation, createExternalArea);
router.get('/inspection/:inspectionId', getExternalAreasByInspection);
router.get('/:id', getExternalAreaById);
router.put('/:id', externalAreaValidation, updateExternalArea);
router.delete('/:id', deleteExternalArea);

export default router;
