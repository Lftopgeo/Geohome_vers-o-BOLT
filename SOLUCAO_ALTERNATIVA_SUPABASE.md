# Solução Alternativa para Integração com Supabase

## Problema Enfrentado

Estávamos enfrentando problemas com a importação do pacote `@supabase/supabase-js` no projeto Geohome. O erro ocorria durante a compilação:

```
[plugin:vite:import-analysis] Failed to resolve import "@supabase/supabase-js" from "src/lib/supabase.ts". Does the file exist?
```

## Solução Implementada

Para contornar esse problema, implementamos uma solução alternativa que não depende do pacote oficial do Supabase. Esta solução consiste em:

1. **Cliente Supabase Simplificado**: Criamos uma implementação simplificada do cliente Supabase usando a API Fetch nativa do JavaScript.
2. **Interface Compatível**: Mantivemos uma interface compatível com o cliente oficial para minimizar mudanças no código existente.
3. **Fallback para localStorage**: Mantivemos o mecanismo de fallback para localStorage quando o Supabase não está disponível.
4. **Uso de Variáveis de Ambiente Vite**: Utilizamos `import.meta.env` em vez de `process.env` para compatibilidade com o Vite.

## Arquivos Modificados

1. **src/lib/supabaseFetch.ts**: Implementação alternativa do cliente Supabase usando Fetch.
2. **src/lib/supabase.ts**: Adaptador para usar a implementação alternativa mantendo a mesma interface.
3. **src/services/inspectionService.ts**: Atualizado para usar o cliente alternativo.
4. **src/services/checklistService.ts**: Atualizado para usar o cliente alternativo.
5. **src/utils/testSupabaseConnection.ts**: Atualizado para usar o cliente alternativo.
6. **src/App.tsx**: Atualizado para usar as novas funções de teste de conexão.
7. **.env.development**: Adicionado com as variáveis de ambiente no formato do Vite.

## Como Funciona

### Cliente Alternativo (supabaseFetch.ts)

O cliente alternativo implementa as principais funcionalidades do Supabase:

- **Consultas**: Suporte para select, where, order by, limit, etc.
- **Inserção**: Suporte para inserir dados nas tabelas.
- **Atualização**: Suporte para atualizar dados nas tabelas.
- **Exclusão**: Suporte para excluir dados das tabelas.
- **Verificação de Conexão**: Função para verificar se o Supabase está disponível.

### Adaptador (supabase.ts)

O adaptador mantém a mesma interface do cliente oficial:

```typescript
import { supabaseFetch, checkSupabaseConnection as checkConnection } from './supabaseFetch';

export const supabase = supabaseFetch;
export const checkSupabaseConnection = checkConnection;

export async function getSupabase() {
  return supabaseFetch;
}
```

## Configuração de Variáveis de Ambiente

Para que o Vite reconheça corretamente as variáveis de ambiente, criamos um arquivo `.env.development` com as seguintes variáveis:

```
VITE_SUPABASE_URL=https://agpxzftesvqwmbhaxhtd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

E no código, acessamos essas variáveis usando `import.meta.env` em vez de `process.env`:

```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://agpxzftesvqwmbhaxhtd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '...';
```

## Vantagens da Solução

1. **Independência de Pacotes**: Não depende do pacote oficial do Supabase, evitando problemas de importação.
2. **Simplicidade**: Implementação mais simples e direta, facilitando a manutenção.
3. **Controle**: Maior controle sobre o comportamento do cliente, permitindo adaptações específicas para o projeto.
4. **Compatibilidade**: Mantém a mesma interface do cliente oficial, minimizando mudanças no código existente.

## Limitações

1. **Funcionalidades Reduzidas**: Implementa apenas as funcionalidades básicas do Supabase, não suportando recursos avançados como autenticação, armazenamento, etc.
2. **Manutenção**: Requer manutenção manual para acompanhar atualizações da API do Supabase.
3. **Tratamento de Erros**: Tratamento de erros simplificado em comparação com o cliente oficial.

## Próximos Passos

1. **Testes**: Realizar testes extensivos para garantir que a solução alternativa funciona corretamente.
2. **Documentação**: Documentar todas as funcionalidades implementadas e suas limitações.
3. **Melhorias**: Implementar funcionalidades adicionais conforme necessário.
4. **Monitoramento**: Monitorar o desempenho e a estabilidade da solução alternativa.

## Conclusão

A solução alternativa implementada permite que o projeto Geohome continue funcionando com o Supabase, contornando os problemas de importação do pacote oficial. Esta solução é temporária e pode ser substituída pelo cliente oficial quando os problemas de importação forem resolvidos.
