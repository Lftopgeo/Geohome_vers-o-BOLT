-- Migration para tabelas de chaves e medidores
-- Criado em: 2025-03-04

-- Tabela para armazenar informações de chaves
CREATE TABLE IF NOT EXISTS keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inspection_id UUID NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
  room_name TEXT NOT NULL,
  key_count INTEGER NOT NULL DEFAULT 1,
  clearly_identified BOOLEAN NOT NULL DEFAULT FALSE,
  condition TEXT NOT NULL CHECK (condition IN ('optimal', 'good', 'regular', 'bad')),
  tested BOOLEAN NOT NULL DEFAULT FALSE,
  photos TEXT[] DEFAULT '{}',
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para armazenar informações de medidores
CREATE TABLE IF NOT EXISTS meters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inspection_id UUID NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
  meter_type TEXT NOT NULL CHECK (meter_type IN ('water', 'electricity', 'gas')),
  meter_number TEXT NOT NULL,
  current_reading NUMERIC NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('optimal', 'good', 'regular', 'bad')),
  seal_intact BOOLEAN NOT NULL DEFAULT TRUE,
  photos TEXT[] DEFAULT '{}',
  observations TEXT,
  leaks BOOLEAN, -- Relevante para água e gás
  meter_display_type TEXT CHECK (meter_display_type IN ('digital', 'analog')), -- Relevante para eletricidade
  breakers_working BOOLEAN, -- Relevante para eletricidade
  leak_test_done BOOLEAN, -- Relevante para gás
  safety_valve_working BOOLEAN, -- Relevante para gás
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para armazenar o checklist de chaves e medidores
CREATE TABLE IF NOT EXISTS keys_meters_checklist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inspection_id UUID NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
  checklist_type TEXT NOT NULL CHECK (checklist_type IN ('keys', 'meters')),
  item_label TEXT NOT NULL,
  is_checked BOOLEAN NOT NULL DEFAULT FALSE,
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionando políticas RLS para as novas tabelas
ALTER TABLE keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE meters ENABLE ROW LEVEL SECURITY;
ALTER TABLE keys_meters_checklist ENABLE ROW LEVEL SECURITY;

-- Criando políticas para chaves
CREATE POLICY "Usuários podem visualizar suas próprias chaves" 
  ON keys FOR SELECT 
  USING (inspection_id IN (SELECT id FROM inspections WHERE user_id = auth.uid()));

CREATE POLICY "Usuários podem inserir suas próprias chaves" 
  ON keys FOR INSERT 
  WITH CHECK (inspection_id IN (SELECT id FROM inspections WHERE user_id = auth.uid()));

CREATE POLICY "Usuários podem atualizar suas próprias chaves" 
  ON keys FOR UPDATE 
  USING (inspection_id IN (SELECT id FROM inspections WHERE user_id = auth.uid()));

CREATE POLICY "Usuários podem excluir suas próprias chaves" 
  ON keys FOR DELETE 
  USING (inspection_id IN (SELECT id FROM inspections WHERE user_id = auth.uid()));

-- Criando políticas para medidores
CREATE POLICY "Usuários podem visualizar seus próprios medidores" 
  ON meters FOR SELECT 
  USING (inspection_id IN (SELECT id FROM inspections WHERE user_id = auth.uid()));

CREATE POLICY "Usuários podem inserir seus próprios medidores" 
  ON meters FOR INSERT 
  WITH CHECK (inspection_id IN (SELECT id FROM inspections WHERE user_id = auth.uid()));

CREATE POLICY "Usuários podem atualizar seus próprios medidores" 
  ON meters FOR UPDATE 
  USING (inspection_id IN (SELECT id FROM inspections WHERE user_id = auth.uid()));

CREATE POLICY "Usuários podem excluir seus próprios medidores" 
  ON meters FOR DELETE 
  USING (inspection_id IN (SELECT id FROM inspections WHERE user_id = auth.uid()));

-- Criando políticas para checklist
CREATE POLICY "Usuários podem visualizar seus próprios checklists" 
  ON keys_meters_checklist FOR SELECT 
  USING (inspection_id IN (SELECT id FROM inspections WHERE user_id = auth.uid()));

CREATE POLICY "Usuários podem inserir seus próprios checklists" 
  ON keys_meters_checklist FOR INSERT 
  WITH CHECK (inspection_id IN (SELECT id FROM inspections WHERE user_id = auth.uid()));

CREATE POLICY "Usuários podem atualizar seus próprios checklists" 
  ON keys_meters_checklist FOR UPDATE 
  USING (inspection_id IN (SELECT id FROM inspections WHERE user_id = auth.uid()));

CREATE POLICY "Usuários podem excluir seus próprios checklists" 
  ON keys_meters_checklist FOR DELETE 
  USING (inspection_id IN (SELECT id FROM inspections WHERE user_id = auth.uid()));

-- Criando índices para melhorar performance
CREATE INDEX IF NOT EXISTS keys_inspection_id_idx ON keys(inspection_id);
CREATE INDEX IF NOT EXISTS meters_inspection_id_idx ON meters(inspection_id);
CREATE INDEX IF NOT EXISTS meters_type_idx ON meters(meter_type);
CREATE INDEX IF NOT EXISTS keys_meters_checklist_inspection_id_idx ON keys_meters_checklist(inspection_id);
CREATE INDEX IF NOT EXISTS keys_meters_checklist_type_idx ON keys_meters_checklist(checklist_type);
