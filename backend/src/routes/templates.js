import express from 'express';
import { body } from 'express-validator';
import { 
  createTemplate, 
  getAllTemplates, 
  getTemplateById, 
  updateTemplate, 
  deleteTemplate 
} from '../controllers/templateController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Validation middleware
const templateValidation = [
  body('name').notEmpty().withMessage('Template name is required'),
  body('description').optional(),
  body('sections').isArray().withMessage('Sections must be an array'),
  body('sections.*.name').notEmpty().withMessage('Section name is required'),
  body('sections.*.items').isArray().withMessage('Section items must be an array')
];

// Routes
router.post('/', templateValidation, createTemplate);
router.get('/', getAllTemplates);
router.get('/:id', getTemplateById);
router.put('/:id', templateValidation, updateTemplate);
router.delete('/:id', deleteTemplate);

export default router;
