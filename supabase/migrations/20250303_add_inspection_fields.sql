-- Adicionar campos necessários para o dashboard
ALTER TABLE inspections 
ADD COLUMN IF NOT EXISTS protocol VARCHAR(50),
ADD COLUMN IF NOT EXISTS property_address TEXT,
ADD COLUMN IF NOT EXISTS date TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS client_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS property_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS inspector_id UUID,
ADD COLUMN IF NOT EXISTS inspector_name VARCHAR(255);

-- Inserir dados de exemplo
INSERT INTO inspections (
  id, 
  protocol, 
  property_address, 
  date, 
  status, 
  client_name, 
  property_type, 
  inspector_id, 
  inspector_name,
  property_data,
  inspector_data
) VALUES 
(
  uuid_generate_v4(), 
  'VST202503010001', 
  'Rua das Flores, 123 - Jardim Primavera', 
  NOW() - INTERVAL '2 days', 
  'completed', 
  'Maria Silva', 
  'Apartamento', 
  '00000000-0000-0000-0000-000000000001', 
  'João Pereira',
  '{"address": "Rua das Flores, 123 - Jardim Primavera", "type": "Apartamento", "area": 75}',
  '{"name": "João Pereira", "email": "joao@exemplo.com"}'
),
(
  uuid_generate_v4(), 
  'VST202503020002', 
  'Av. Central, 456 - Centro', 
  NOW() - INTERVAL '1 day', 
  'pending', 
  'Carlos Oliveira', 
  'Casa', 
  '00000000-0000-0000-0000-000000000001', 
  'Ana Santos',
  '{"address": "Av. Central, 456 - Centro", "type": "Casa", "area": 120}',
  '{"name": "Ana Santos", "email": "ana@exemplo.com"}'
),
(
  uuid_generate_v4(), 
  'VST202503030003', 
  'Rua dos Pinheiros, 789 - Alto da Boa Vista', 
  NOW(), 
  'in_progress', 
  'Roberto Almeida', 
  'Comercial', 
  '00000000-0000-0000-0000-000000000001', 
  'João Pereira',
  '{"address": "Rua dos Pinheiros, 789 - Alto da Boa Vista", "type": "Comercial", "area": 200}',
  '{"name": "João Pereira", "email": "joao@exemplo.com"}'
),
(
  uuid_generate_v4(), 
  'VST202503040004', 
  'Alameda das Acácias, 234 - Jardim Europa', 
  NOW() + INTERVAL '1 day', 
  'pending', 
  'Fernanda Costa', 
  'Apartamento', 
  '00000000-0000-0000-0000-000000000001', 
  'Ana Santos',
  '{"address": "Alameda das Acácias, 234 - Jardim Europa", "type": "Apartamento", "area": 85}',
  '{"name": "Ana Santos", "email": "ana@exemplo.com"}'
);
