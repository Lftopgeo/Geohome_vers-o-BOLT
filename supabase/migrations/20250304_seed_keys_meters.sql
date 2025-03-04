-- Seed para dados iniciais de chaves e medidores
-- Criado em: 2025-03-04

-- Inserindo checklists padrão para chaves
INSERT INTO keys_meters_checklist (inspection_id, checklist_type, item_label, is_checked, observations)
VALUES 
  -- Considerando um ID de inspeção de exemplo - deve ser atualizado para um ID válido
  ('00000000-0000-0000-0000-000000000001', 'keys', 'Todas as chaves identificadas', false, ''),
  ('00000000-0000-0000-0000-000000000001', 'keys', 'Chaves testadas e funcionando', false, ''),
  ('00000000-0000-0000-0000-000000000001', 'keys', 'Quantidade de cópias confere', false, ''),
  ('00000000-0000-0000-0000-000000000001', 'keys', 'Estado das chaves adequado', false, '');

-- Inserindo checklists padrão para medidores
INSERT INTO keys_meters_checklist (inspection_id, checklist_type, item_label, is_checked, observations)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'meters', 'Medidores acessíveis', false, ''),
  ('00000000-0000-0000-0000-000000000001', 'meters', 'Leituras registradas', false, ''),
  ('00000000-0000-0000-0000-000000000001', 'meters', 'Lacres intactos', false, ''),
  ('00000000-0000-0000-0000-000000000001', 'meters', 'Sem vazamentos/irregularidades', false, '');

-- Inserindo exemplos de chaves
INSERT INTO keys (inspection_id, room_name, key_count, clearly_identified, condition, tested, observations)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Porta Principal', 2, true, 'good', true, 'Chaves funcionam perfeitamente'),
  ('00000000-0000-0000-0000-000000000001', 'Porta dos Fundos', 1, true, 'regular', true, 'Chave um pouco desgastada'),
  ('00000000-0000-0000-0000-000000000001', 'Portão', 2, false, 'bad', false, 'Chaves não estão identificadas');

-- Inserindo exemplos de medidores
INSERT INTO meters (inspection_id, meter_type, meter_number, current_reading, condition, seal_intact, observations)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'water', 'W-12345', 35678.5, 'good', true, 'Medidor em bom estado'),
  ('00000000-0000-0000-0000-000000000001', 'electricity', 'E-54321', 9876.3, 'good', true, 'Medidor digital funcionando corretamente'),
  ('00000000-0000-0000-0000-000000000001', 'gas', 'G-98765', 456.8, 'regular', true, 'Medidor com leve oxidação');

-- Atualizando os medidores com dados específicos
UPDATE meters SET meter_display_type = 'digital', breakers_working = true 
WHERE meter_type = 'electricity' AND inspection_id = '00000000-0000-0000-0000-000000000001';

UPDATE meters SET leaks = false 
WHERE meter_type = 'water' AND inspection_id = '00000000-0000-0000-0000-000000000001';

UPDATE meters SET leak_test_done = true, safety_valve_working = true 
WHERE meter_type = 'gas' AND inspection_id = '00000000-0000-0000-0000-000000000001';
