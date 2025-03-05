# Guia de Solução de Problemas - Integração Supabase

Este guia contém instruções para solucionar problemas comuns relacionados à integração com o Supabase no projeto Geohome.

## Problemas Comuns e Soluções

### 1. Falha na Conexão com o Supabase

**Sintomas:**
- Mensagem "Aplicativo iniciado no modo offline (usando localStorage)"
- Falha ao tentar salvar ou carregar dados

**Soluções:**

1. **Verificar Variáveis de Ambiente:**
   - Abra o arquivo `.env.development`
   - Verifique se as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão definidas corretamente
   - Exemplo:
     ```
     VITE_SUPABASE_URL=https://agpxzftesvqwmbhaxhtd.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```

2. **Verificar Conexão com a Internet:**
   - Certifique-se de que você está conectado à internet
   - Tente acessar o Supabase Dashboard em seu navegador

3. **Executar Diagnóstico:**
   - Acesse a página de diagnóstico em `/diagnostico`
   - Clique em "Verificar Conexão" para testar a conexão com o Supabase
   - Analise o relatório de diagnóstico para identificar problemas específicos

4. **Reiniciar o Aplicativo:**
   - Pare o servidor de desenvolvimento (Ctrl+C)
   - Inicie o servidor novamente (`npm run dev`)

### 2. Erros ao Salvar Dados

**Sintomas:**
- Mensagens de erro ao tentar salvar inspeções ou checklists
- Dados salvos apenas localmente, não no Supabase

**Soluções:**

1. **Verificar Formato dos Dados:**
   - Abra o console do navegador (F12)
   - Verifique os logs para identificar erros específicos
   - Certifique-se de que os dados estão no formato esperado pelo Supabase

2. **Verificar Políticas de Segurança:**
   - Acesse o Supabase Dashboard
   - Verifique as políticas de segurança (RLS) para as tabelas `inspections` e `checklists`
   - Certifique-se de que as políticas permitem inserção e atualização de dados

3. **Verificar Estrutura das Tabelas:**
   - Acesse o Supabase Dashboard
   - Verifique se as tabelas `inspections` e `checklists` existem e têm a estrutura correta
   - Compare com os modelos de dados no código

4. **Usar o Modo Offline:**
   - Se o problema persistir, o aplicativo continuará funcionando no modo offline
   - Os dados serão salvos no localStorage e estarão disponíveis para uso

### 3. Problemas de Importação do Pacote Supabase

**Sintomas:**
- Erros de importação do pacote `@supabase/supabase-js`
- Falhas na compilação do aplicativo

**Soluções:**

1. **Usar o Cliente Alternativo:**
   - O projeto já implementa um cliente Supabase alternativo em `src/lib/supabaseFetch.ts`
   - Este cliente não depende do pacote `@supabase/supabase-js`
   - Certifique-se de que o código está usando este cliente alternativo

2. **Verificar Dependências:**
   - Execute `npm list @supabase/supabase-js` para verificar a versão instalada
   - Se necessário, atualize a dependência com `npm update @supabase/supabase-js`

3. **Limpar Cache:**
   - Execute `npm cache clean --force`
   - Remova a pasta `node_modules` e o arquivo `package-lock.json`
   - Execute `npm install` para reinstalar as dependências

## Ferramentas de Diagnóstico

### Página de Diagnóstico

O projeto inclui uma página de diagnóstico acessível em `/diagnostico` que oferece:

- Verificação de conexão com o Supabase
- Diagnóstico detalhado de problemas
- Histórico de diagnósticos para análise

### Console do Navegador

O aplicativo registra informações detalhadas no console do navegador:

1. Abra o console do navegador (F12)
2. Filtre os logs por "Supabase" para ver mensagens relacionadas
3. Procure por erros ou avisos que possam indicar problemas

### Logs Detalhados

O código foi atualizado para incluir logs detalhados em pontos críticos:

- Tentativas de conexão com o Supabase
- Operações de inserção e atualização de dados
- Fallbacks para localStorage
- Erros específicos com detalhes

## Estratégia de Fallback

O aplicativo implementa uma estratégia robusta de fallback que:

1. Detecta automaticamente falhas de conexão com o Supabase
2. Armazena dados no localStorage quando o Supabase está indisponível
3. Fornece uma experiência consistente mesmo offline
4. Registra detalhes dos erros para diagnóstico

## Recomendações

1. **Mantenha as Variáveis de Ambiente Atualizadas:**
   - Sempre verifique se as variáveis de ambiente estão configuradas corretamente
   - Não compartilhe chaves de acesso em repositórios públicos

2. **Teste Regularmente a Conexão:**
   - Use a página de diagnóstico para verificar a conexão com o Supabase
   - Execute diagnósticos completos periodicamente

3. **Verifique os Logs:**
   - Monitore os logs do console para identificar problemas
   - Preste atenção a erros específicos e detalhes

4. **Mantenha o Código Atualizado:**
   - Acompanhe atualizações do Supabase e do cliente alternativo
   - Implemente correções e melhorias conforme necessário

## Contato para Suporte

Se você encontrar problemas que não consegue resolver, entre em contato com a equipe de desenvolvimento:

- **Email:** suporte@geobolt.com.br
- **Slack:** #geohome-suporte
