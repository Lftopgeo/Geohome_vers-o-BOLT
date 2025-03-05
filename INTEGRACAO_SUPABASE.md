# Integração com Supabase no Geohome

Este documento descreve as alterações realizadas para integrar o Supabase como banco de dados para o projeto Geohome.

## Credenciais do Supabase

- **URL**: https://agpxzftesvqwmbhaxhtd.supabase.co
- **API Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFncHh6ZnRlc3Zxd21iaGF4aHRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwNDM2NjgsImV4cCI6MjA1NjYxOTY2OH0.ga52hvkHXEHqPeQXUcvllHrYbRbGFnKrWAq4rITsmAM

## Arquivos Modificados

1. **`.env`**: Atualizado com as credenciais do Supabase
2. **`src/lib/supabase.ts`**: Criado para configurar o cliente Supabase
3. **`src/services/inspectionService.ts`**: Atualizado para usar o Supabase com fallback para localStorage
4. **`src/services/checklistService.ts`**: Atualizado para usar o Supabase com fallback para localStorage
5. **`supabase/schema.sql`**: Criado com o esquema do banco de dados
6. **`supabase/README.md`**: Criado com instruções para configuração

## Estratégia de Implementação

A implementação segue uma estratégia de "graceful degradation" que permite que o aplicativo funcione mesmo quando o Supabase não está disponível:

1. **Verificação de Conexão**: Antes de cada operação, o sistema verifica se o Supabase está acessível
2. **Operações Primárias**: Se o Supabase estiver disponível, todas as operações são realizadas diretamente no banco de dados
3. **Fallback Automático**: Se o Supabase não estiver disponível ou ocorrer um erro, o sistema automaticamente usa o localStorage
4. **Logs de Diagnóstico**: Mensagens de log detalhadas são geradas para facilitar a depuração

## Estrutura do Banco de Dados

### Tabela: inspections

Armazena dados de inspeções de imóveis com campos como:
- ID único
- Informações da propriedade
- Detalhes da inspeção
- Status e datas

### Tabela: checklists

Armazena checklists associados a inspeções com:
- ID único
- Referência à inspeção
- Lista de itens em formato JSONB
- Progresso e datas

## Segurança

O banco de dados utiliza Row Level Security (RLS) para controle de acesso. Para desenvolvimento, foram criadas políticas que permitem acesso anônimo a todas as tabelas.

## Como Testar a Integração

1. Verifique se as variáveis de ambiente estão configuradas corretamente no arquivo `.env`
2. Execute o aplicativo e realize operações como criar inspeções e checklists
3. Verifique no console do navegador se as operações estão sendo realizadas no Supabase
4. Para testar o fallback, você pode temporariamente modificar a URL do Supabase para uma inválida

## Próximos Passos

1. Implementar sincronização de dados offline quando a conexão for restabelecida
2. Adicionar autenticação de usuários
3. Implementar políticas de segurança mais restritivas
4. Criar testes automatizados para verificar o funcionamento do fallback
