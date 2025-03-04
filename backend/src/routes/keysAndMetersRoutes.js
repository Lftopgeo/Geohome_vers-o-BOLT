import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import {
  getKeysAndMeters,
  saveChecklist,
  addKey,
  addMeter,
  updateKey,
  updateMeter,
  deleteKey,
  deleteMeter
} from '../controllers/keysAndMetersController.js';

const router = express.Router();

// Aplicar middleware de autenticação a todas as rotas
router.use(authenticate);

// Rota para obter dados de chaves e medidores de uma inspeção
router.get('/inspection/:inspectionId', getKeysAndMeters);

// Rota para salvar checklist
router.post(
  '/inspection/:inspectionId/checklist',
  [
    body('checklist').isObject().withMessage('O checklist deve ser um objeto'),
    body('checklist.keys').optional().isArray().withMessage('As chaves devem ser um array'),
    body('checklist.meters').optional().isArray().withMessage('Os medidores devem ser um array')
  ],
  saveChecklist
);

// Rota para adicionar uma nova chave
router.post(
  '/inspection/:inspectionId/key',
  [
    body('room_name').notEmpty().withMessage('O nome do cômodo é obrigatório'),
    body('key_count').isInt({ min: 1 }).withMessage('A quantidade de chaves deve ser um número maior que zero'),
    body('clearly_identified').isBoolean().withMessage('A identificação clara deve ser um booleano'),
    body('condition').isIn(['optimal', 'good', 'regular', 'bad']).withMessage('A condição deve ser optimal, good, regular ou bad'),
    body('tested').isBoolean().withMessage('O teste deve ser um booleano'),
    body('photos').optional().isArray().withMessage('As fotos devem ser um array'),
    body('observations').optional().isString().withMessage('As observações devem ser um texto')
  ],
  addKey
);

// Rota para adicionar um novo medidor
router.post(
  '/inspection/:inspectionId/meter',
  [
    body('meter_type').isIn(['water', 'electricity', 'gas']).withMessage('O tipo de medidor deve ser água, eletricidade ou gás'),
    body('meter_number').notEmpty().withMessage('O número do medidor é obrigatório'),
    body('current_reading').isNumeric().withMessage('A leitura atual deve ser um número'),
    body('condition').isIn(['optimal', 'good', 'regular', 'bad']).withMessage('A condição deve ser optimal, good, regular ou bad'),
    body('seal_intact').isBoolean().withMessage('A integridade do lacre deve ser um booleano'),
    body('photos').optional().isArray().withMessage('As fotos devem ser um array'),
    body('observations').optional().isString().withMessage('As observações devem ser um texto'),
    body('leaks').optional().isBoolean().withMessage('Vazamentos deve ser um booleano'),
    body('meter_display_type').optional().isIn(['digital', 'analog']).withMessage('O tipo de display deve ser digital ou analógico'),
    body('breakers_working').optional().isBoolean().withMessage('Disjuntores funcionando deve ser um booleano'),
    body('leak_test_done').optional().isBoolean().withMessage('Teste de vazamento realizado deve ser um booleano'),
    body('safety_valve_working').optional().isBoolean().withMessage('Válvula de segurança funcionando deve ser um booleano')
  ],
  addMeter
);

// Rota para atualizar uma chave existente
router.put(
  '/key/:keyId',
  [
    body('room_name').notEmpty().withMessage('O nome do cômodo é obrigatório'),
    body('key_count').isInt({ min: 1 }).withMessage('A quantidade de chaves deve ser um número maior que zero'),
    body('clearly_identified').isBoolean().withMessage('A identificação clara deve ser um booleano'),
    body('condition').isIn(['optimal', 'good', 'regular', 'bad']).withMessage('A condição deve ser optimal, good, regular ou bad'),
    body('tested').isBoolean().withMessage('O teste deve ser um booleano'),
    body('photos').optional().isArray().withMessage('As fotos devem ser um array'),
    body('observations').optional().isString().withMessage('As observações devem ser um texto')
  ],
  updateKey
);

// Rota para atualizar um medidor existente
router.put(
  '/meter/:meterId',
  [
    body('meter_type').isIn(['water', 'electricity', 'gas']).withMessage('O tipo de medidor deve ser água, eletricidade ou gás'),
    body('meter_number').notEmpty().withMessage('O número do medidor é obrigatório'),
    body('current_reading').isNumeric().withMessage('A leitura atual deve ser um número'),
    body('condition').isIn(['optimal', 'good', 'regular', 'bad']).withMessage('A condição deve ser optimal, good, regular ou bad'),
    body('seal_intact').isBoolean().withMessage('A integridade do lacre deve ser um booleano'),
    body('photos').optional().isArray().withMessage('As fotos devem ser um array'),
    body('observations').optional().isString().withMessage('As observações devem ser um texto'),
    body('leaks').optional().isBoolean().withMessage('Vazamentos deve ser um booleano'),
    body('meter_display_type').optional().isIn(['digital', 'analog']).withMessage('O tipo de display deve ser digital ou analógico'),
    body('breakers_working').optional().isBoolean().withMessage('Disjuntores funcionando deve ser um booleano'),
    body('leak_test_done').optional().isBoolean().withMessage('Teste de vazamento realizado deve ser um booleano'),
    body('safety_valve_working').optional().isBoolean().withMessage('Válvula de segurança funcionando deve ser um booleano')
  ],
  updateMeter
);

// Rota para excluir uma chave
router.delete('/key/:keyId', deleteKey);

// Rota para excluir um medidor
router.delete('/meter/:meterId', deleteMeter);

export default router;
