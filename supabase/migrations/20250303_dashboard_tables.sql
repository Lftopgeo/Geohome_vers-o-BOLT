-- Criação de tabelas para suporte ao dashboard

-- Tabela de atividades do sistema
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id),
  user_name VARCHAR(255) NOT NULL,
  related_entity_id UUID,
  related_entity_type VARCHAR(50),
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Adicionar campos para estatísticas na tabela de inspeções
ALTER TABLE inspections 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS priority VARCHAR(10) DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS completion_time INTEGER,
ADD COLUMN IF NOT EXISTS client_satisfaction INTEGER;

-- Tabela para eventos do calendário
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  all_day BOOLEAN DEFAULT FALSE,
  event_type VARCHAR(50) NOT NULL,
  status VARCHAR(20),
  location TEXT,
  description TEXT,
  user_id UUID REFERENCES auth.users(id),
  related_entity_id UUID,
  related_entity_type VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela para métricas de desempenho
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_name VARCHAR(100) NOT NULL,
  metric_value NUMERIC NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  metric_type VARCHAR(50) NOT NULL,
  dimension VARCHAR(50),
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Adicionar índices para melhorar a performance das consultas
CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON activities(timestamp);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);

CREATE INDEX IF NOT EXISTS idx_inspections_status ON inspections(status);
-- Removendo o índice da coluna 'date' que não existe na tabela inspections
-- CREATE INDEX IF NOT EXISTS idx_inspections_date ON inspections(date);

CREATE INDEX IF NOT EXISTS idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX IF NOT EXISTS idx_calendar_events_event_type ON calendar_events(event_type);

CREATE INDEX IF NOT EXISTS idx_performance_metrics_period ON performance_metrics(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_name ON performance_metrics(metric_name);

-- Funções e triggers para atualizar automaticamente as atividades
CREATE OR REPLACE FUNCTION create_inspection_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activities (
    type, 
    description, 
    user_id, 
    user_name, 
    related_entity_id, 
    related_entity_type
  ) VALUES (
    'inspection_created',
    'Nova vistoria criada para ' || COALESCE(NEW.property_address, 'endereço não especificado'),
    NEW.inspector_id,
    COALESCE((SELECT email FROM auth.users WHERE id = NEW.inspector_id), 'Usuário desconhecido'),
    NEW.id,
    'inspection'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para criar atividade quando uma nova inspeção é criada
DROP TRIGGER IF EXISTS inspection_created_trigger ON inspections;
CREATE TRIGGER inspection_created_trigger
AFTER INSERT ON inspections
FOR EACH ROW
EXECUTE FUNCTION create_inspection_activity();

-- Adicionar RLS (Row Level Security) para as novas tabelas
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para atividades (verificando se já existem antes)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'activities' AND policyname = 'activities_select_policy'
  ) THEN
    CREATE POLICY activities_select_policy ON activities
      FOR SELECT USING (true);  -- Todos podem ver atividades
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'activities' AND policyname = 'activities_insert_policy'
  ) THEN
    CREATE POLICY activities_insert_policy ON activities
      FOR INSERT WITH CHECK (auth.uid() = user_id);  -- Apenas o próprio usuário pode inserir
  END IF;
END
$$;

-- Políticas de segurança para eventos do calendário
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'calendar_events' AND policyname = 'calendar_events_select_policy'
  ) THEN
    CREATE POLICY calendar_events_select_policy ON calendar_events
      FOR SELECT USING (true);  -- Todos podem ver eventos
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'calendar_events' AND policyname = 'calendar_events_insert_policy'
  ) THEN
    CREATE POLICY calendar_events_insert_policy ON calendar_events
      FOR INSERT WITH CHECK (auth.uid() = user_id);  -- Apenas o próprio usuário pode inserir
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'calendar_events' AND policyname = 'calendar_events_update_policy'
  ) THEN
    CREATE POLICY calendar_events_update_policy ON calendar_events
      FOR UPDATE USING (auth.uid() = user_id);  -- Apenas o próprio usuário pode atualizar
  END IF;
END
$$;

-- Políticas de segurança para métricas de desempenho
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'performance_metrics' AND policyname = 'performance_metrics_select_policy'
  ) THEN
    CREATE POLICY performance_metrics_select_policy ON performance_metrics
      FOR SELECT USING (true);  -- Todos podem ver métricas
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'performance_metrics' AND policyname = 'performance_metrics_insert_policy'
  ) THEN
    CREATE POLICY performance_metrics_insert_policy ON performance_metrics
      FOR INSERT WITH CHECK (auth.uid() = user_id);  -- Apenas o próprio usuário pode inserir
  END IF;
END
$$;
