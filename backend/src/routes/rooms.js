import express from 'express';
import { body } from 'express-validator';
import { 
  createRoom, 
  getRoomsByInspection, 
  getRoomById, 
  updateRoom, 
  deleteRoom 
} from '../controllers/roomController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Validation middleware
const roomValidation = [
  body('inspection_id').notEmpty().withMessage('Inspection ID is required'),
  body('name').notEmpty().withMessage('Room name is required'),
  body('type').notEmpty().withMessage('Room type is required'),
  body('condition').notEmpty().withMessage('Room condition is required'),
  body('items').isArray().withMessage('Items must be an array')
];

// Routes
router.post('/', roomValidation, createRoom);
router.get('/inspection/:inspectionId', getRoomsByInspection);
router.get('/:id', getRoomById);
router.put('/:id', roomValidation, updateRoom);
router.delete('/:id', deleteRoom);

export default router;
