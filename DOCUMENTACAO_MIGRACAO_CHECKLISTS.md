# Documentação de Migração e Estrutura de Banco de Dados - Checklists Geohome

## Visão Geral

Este documento descreve a estrutura de banco de dados, migrações e políticas de segurança implementadas para o sistema de checklists do Geohome. O objetivo é fornecer uma referência completa para desenvolvedores que precisam entender ou modificar a estrutura de dados do sistema.

## Estrutura de Tabelas

### 1. Tabela `checklists`

Tabela principal que armazena os checklists associados a inspeções.

| Coluna | Tipo | Descrição | Restrições |
|--------|------|-----------|------------|
| id | UUID | Identificador único do checklist | PRIMARY KEY, DEFAULT uuid_generate_v4() |
| inspection_id | UUID | ID da inspeção associada | NOT NULL, REFERENCES inspections(id) |
| title | TEXT | Título do checklist | NOT NULL |
| description | TEXT | Descrição detalhada do checklist | NULL |
| progress | INTEGER | Porcentagem de conclusão (0-100) | NOT NULL, DEFAULT 0 |
| created_at | TIMESTAMP WITH TIME ZONE | Data de criação | DEFAULT NOW() |
| updated_at | TIMESTAMP WITH TIME ZONE | Data da última atualização | DEFAULT NOW() |
| user_id | UUID | ID do usuário que criou o checklist | NOT NULL |
| is_template | BOOLEAN | Indica se é um template reutilizável | DEFAULT FALSE |

**Índices:**
- `idx_checklists_inspection_id`: Melhora a performance de consultas por inspection_id
- `idx_checklists_user_id`: Melhora a performance de consultas por user_id

### 2. Tabela `checklist_items`

Armazena os itens individuais de cada checklist.

| Coluna | Tipo | Descrição | Restrições |
|--------|------|-----------|------------|
| id | UUID | Identificador único do item | PRIMARY KEY, DEFAULT uuid_generate_v4() |
| checklist_id | UUID | ID do checklist ao qual o item pertence | REFERENCES checklists(id) |
| category | TEXT | Categoria do item | NOT NULL |
| title | TEXT | Título do item | NOT NULL |
| description | TEXT | Descrição detalhada do item | NOT NULL |
| status | TEXT | Status atual do item | NOT NULL |
| observations | TEXT | Observações adicionais | NULL |
| created_at | TIMESTAMP WITH TIME ZONE | Data de criação | DEFAULT NOW() |
| updated_at | TIMESTAMP WITH TIME ZONE | Data da última atualização | DEFAULT NOW() |
| inspection_id | UUID | ID da inspeção associada | NOT NULL |
| user_id | UUID | ID do usuário que criou o item | NOT NULL |
| priority | TEXT | Prioridade do item (low, medium, high) | NOT NULL, DEFAULT 'medium' |
| completed | BOOLEAN | Indica se o item foi concluído | NOT NULL, DEFAULT FALSE |
| due_date | TIMESTAMP WITH TIME ZONE | Data de vencimento do item | NULL |
| assigned_to | UUID | ID do usuário responsável pelo item | NULL |

**Índices:**
- `idx_checklist_items_checklist_id`: Melhora a performance de consultas por checklist_id
- `idx_checklist_items_inspection_id`: Melhora a performance de consultas por inspection_id

### 3. Tabela `checklist_templates`

Armazena templates de checklists que podem ser reutilizados.

| Coluna | Tipo | Descrição | Restrições |
|--------|------|-----------|------------|
| id | UUID | Identificador único do template | PRIMARY KEY, DEFAULT uuid_generate_v4() |
| title | TEXT | Título do template | NOT NULL |
| description | TEXT | Descrição detalhada do template | NULL |
| category | TEXT | Categoria do template | NULL |
| created_at | TIMESTAMP WITH TIME ZONE | Data de criação | DEFAULT NOW() |
| updated_at | TIMESTAMP WITH TIME ZONE | Data da última atualização | DEFAULT NOW() |
| user_id | UUID | ID do usuário que criou o template | NOT NULL |
| is_public | BOOLEAN | Indica se o template é público | DEFAULT FALSE |

### 4. Tabela `checklist_template_items`

Armazena os itens dos templates de checklist.

| Coluna | Tipo | Descrição | Restrições |
|--------|------|-----------|------------|
| id | UUID | Identificador único do item | PRIMARY KEY, DEFAULT uuid_generate_v4() |
| template_id | UUID | ID do template ao qual o item pertence | NOT NULL, REFERENCES checklist_templates(id) |
| title | TEXT | Título do item | NOT NULL |
| description | TEXT | Descrição detalhada do item | NULL |
| category | TEXT | Categoria do item | NULL |
| priority | TEXT | Prioridade do item (low, medium, high) | NOT NULL, DEFAULT 'medium' |
| order_index | INTEGER | Ordem do item no template | NOT NULL, DEFAULT 0 |
| created_at | TIMESTAMP WITH TIME ZONE | Data de criação | DEFAULT NOW() |
| updated_at | TIMESTAMP WITH TIME ZONE | Data da última atualização | DEFAULT NOW() |

**Índices:**
- `idx_checklist_template_items_template_id`: Melhora a performance de consultas por template_id

### 5. Tabela `keys_meters_checklist` (Existente)

Tabela específica para checklists de chaves e medidores.

| Coluna | Tipo | Descrição | Restrições |
|--------|------|-----------|------------|
| id | UUID | Identificador único do item | PRIMARY KEY |
| inspection_id | UUID | ID da inspeção associada | NOT NULL |
| checklist_type | TEXT | Tipo de checklist (keys, meters) | NOT NULL |
| item_label | TEXT | Rótulo do item | NOT NULL |
| is_checked | BOOLEAN | Indica se o item foi verificado | NOT NULL |
| observations | TEXT | Observações adicionais | NULL |
| created_at | TIMESTAMP WITH TIME ZONE | Data de criação | DEFAULT NOW() |
| updated_at | TIMESTAMP WITH TIME ZONE | Data da última atualização | DEFAULT NOW() |

## Relacionamentos entre Tabelas

```
inspections 1 ------ n checklists 1 ------ n checklist_items
                                  |
                                  |
                                  |
checklist_templates 1 ----------- n checklist_template_items
```

## Migrações de Banco de Dados

### Migração 1: Criação da Tabela `checklists`

Esta migração cria a tabela principal de checklists e seus índices associados.

```sql
CREATE TABLE IF NOT EXISTS checklists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inspection_id UUID NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  progress INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL,
  is_template BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_checklists_inspection_id ON checklists(inspection_id);
CREATE INDEX IF NOT EXISTS idx_checklists_user_id ON checklists(user_id);
```

### Migração 2: Atualização da Tabela `checklist_items`

Esta migração adiciona novas colunas à tabela `checklist_items` existente para suportar a funcionalidade completa de checklists.

```sql
-- Adicionar coluna checklist_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'checklist_items' AND column_name = 'checklist_id'
  ) THEN
    ALTER TABLE checklist_items ADD COLUMN checklist_id UUID REFERENCES checklists(id) ON DELETE CASCADE;
    CREATE INDEX idx_checklist_items_checklist_id ON checklist_items(checklist_id);
  END IF;
END $$;

-- Adicionar coluna priority
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'checklist_items' AND column_name = 'priority'
  ) THEN
    ALTER TABLE checklist_items ADD COLUMN priority TEXT NOT NULL DEFAULT 'medium' 
    CHECK (priority IN ('low', 'medium', 'high'));
  END IF;
END $$;

-- Adicionar coluna completed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'checklist_items' AND column_name = 'completed'
  ) THEN
    ALTER TABLE checklist_items ADD COLUMN completed BOOLEAN NOT NULL DEFAULT FALSE;
  END IF;
END $$;

-- Adicionar coluna due_date
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'checklist_items' AND column_name = 'due_date'
  ) THEN
    ALTER TABLE checklist_items ADD COLUMN due_date TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Adicionar coluna assigned_to
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'checklist_items' AND column_name = 'assigned_to'
  ) THEN
    ALTER TABLE checklist_items ADD COLUMN assigned_to UUID;
  END IF;
END $$;
```

### Migração 3: Criação das Tabelas de Templates

Esta migração cria as tabelas para templates de checklists.

```sql
CREATE TABLE IF NOT EXISTS checklist_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL,
  is_public BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS checklist_template_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID NOT NULL REFERENCES checklist_templates(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_checklist_template_items_template_id ON checklist_template_items(template_id);
```

### Migração 4: Criação de Triggers para Atualização Automática

Esta migração cria um trigger para atualizar automaticamente o progresso do checklist quando os itens são marcados como concluídos.

```sql
CREATE OR REPLACE FUNCTION update_checklist_progress()
RETURNS TRIGGER AS $$
DECLARE
  total_items INTEGER;
  completed_items INTEGER;
  progress_value INTEGER;
BEGIN
  -- Contar total de itens para este checklist
  SELECT COUNT(*) INTO total_items
  FROM checklist_items
  WHERE checklist_id = NEW.checklist_id;
  
  -- Contar itens completados para este checklist
  SELECT COUNT(*) INTO completed_items
  FROM checklist_items
  WHERE checklist_id = NEW.checklist_id AND completed = TRUE;
  
  -- Calcular progresso (evitar divisão por zero)
  IF total_items > 0 THEN
    progress_value := (completed_items * 100) / total_items;
  ELSE
    progress_value := 0;
  END IF;
  
  -- Atualizar o progresso na tabela de checklists
  UPDATE checklists
  SET progress = progress_value, updated_at = NOW()
  WHERE id = NEW.checklist_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_checklist_progress_trigger
AFTER INSERT OR UPDATE OR DELETE ON checklist_items
FOR EACH ROW
EXECUTE FUNCTION update_checklist_progress();
```

## Políticas de Segurança (Row Level Security)

O Supabase utiliza o sistema de Row Level Security (RLS) do PostgreSQL para controlar o acesso aos dados. As seguintes políticas foram implementadas:

### 1. Políticas para a Tabela `checklists`

```sql
ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;

-- Política para checklists: usuários só podem ver seus próprios checklists ou checklists de inspeções que eles têm acesso
CREATE POLICY checklists_user_policy ON checklists
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM inspections i WHERE i.id = inspection_id AND i.user_id = auth.uid()
  ));
```

### 2. Políticas para a Tabela `checklist_items`

```sql
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;

-- Política para itens de checklist: usuários só podem ver itens de seus próprios checklists ou de inspeções que eles têm acesso
CREATE POLICY checklist_items_user_policy ON checklist_items
  USING (EXISTS (
    SELECT 1 FROM checklists c WHERE c.id = checklist_id AND (c.user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM inspections i WHERE i.id = c.inspection_id AND i.user_id = auth.uid()
    ))
  ));
```

### 3. Políticas para a Tabela `checklist_templates`

```sql
ALTER TABLE checklist_templates ENABLE ROW LEVEL SECURITY;

-- Política para templates de checklist: usuários podem ver seus próprios templates ou templates públicos
CREATE POLICY checklist_templates_user_policy ON checklist_templates
  USING (user_id = auth.uid() OR is_public = TRUE);
```

### 4. Políticas para a Tabela `checklist_template_items`

```sql
ALTER TABLE checklist_template_items ENABLE ROW LEVEL SECURITY;

-- Política para itens de template: usuários podem ver itens de seus próprios templates ou de templates públicos
CREATE POLICY checklist_template_items_user_policy ON checklist_template_items
  USING (EXISTS (
    SELECT 1 FROM checklist_templates t WHERE t.id = template_id AND (t.user_id = auth.uid() OR t.is_public = TRUE)
  ));
```

## Considerações de Desempenho

1. **Índices**: Foram criados índices para melhorar o desempenho de consultas frequentes, especialmente para relacionamentos entre tabelas.

2. **Triggers**: O trigger `update_checklist_progress_trigger` atualiza automaticamente o progresso do checklist, mas pode impactar o desempenho em operações em massa. Para operações em lote, considere desativar temporariamente o trigger.

3. **Consultas Comuns**: Para consultas frequentes, como listar todos os checklists de uma inspeção, os índices criados devem garantir um bom desempenho.

## Estratégia de Fallback

Devido a problemas persistentes com a importação do pacote @supabase/supabase-js, implementamos uma solução alternativa usando localStorage. Quando a conexão com o Supabase estiver funcionando corretamente, o sistema automaticamente usará o banco de dados para armazenar e recuperar dados.

A estratégia de fallback inclui:

1. Tentativa de conexão com o Supabase
2. Em caso de falha, uso de dados do localStorage
3. Se não houver dados no localStorage, uso de dados mockados

## Migração de Dados do localStorage para o Supabase

Quando a conexão com o Supabase for restabelecida, será necessário migrar os dados do localStorage para o banco de dados. O seguinte processo é recomendado:

1. Recuperar todos os checklists do localStorage
2. Para cada checklist, verificar se já existe no Supabase (por ID)
3. Se não existir, inserir no Supabase
4. Se existir, verificar qual é mais recente (baseado em updated_at) e atualizar se necessário

## Próximos Passos

1. **Implementação de Relatórios**: Criar views e funções para gerar relatórios sobre o progresso dos checklists.

2. **Notificações**: Implementar um sistema de notificações para itens de checklist com prazo próximo ou vencido.

3. **Histórico de Alterações**: Adicionar uma tabela para rastrear o histórico de alterações em checklists e seus itens.

4. **Sincronização em Tempo Real**: Implementar sincronização em tempo real usando as funcionalidades de realtime do Supabase.

5. **Backup Automático**: Implementar um sistema de backup automático dos dados do localStorage para evitar perda de dados.
