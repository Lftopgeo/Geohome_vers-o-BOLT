# Problema de Importação do Supabase

## Descrição do Problema

Estamos enfrentando um problema com a importação do pacote `@supabase/supabase-js` no projeto Geohome. O erro ocorre durante a compilação:

```
[plugin:vite:import-analysis] Failed to resolve import "@supabase/supabase-js" from "src/lib/supabase.ts". Does the file exist?
```

## Causas Possíveis

1. **Pacote não instalado corretamente**: Apesar de estar listado no `package.json`, o pacote pode não ter sido instalado corretamente.
2. **Problemas de compatibilidade com o Vite**: O Vite pode estar tendo problemas para resolver a importação.
3. **Configuração incorreta do projeto**: Pode haver alguma configuração no projeto que está impedindo a importação.

## Soluções Propostas

### 1. Reinstalação do Pacote

```bash
# Remover o pacote
npm uninstall @supabase/supabase-js

# Reinstalar o pacote
npm install --save @supabase/supabase-js
```

### 2. Usar Importação Dinâmica

Modificamos o arquivo `src/lib/supabase.ts` para usar importação dinâmica:

```typescript
// Importação alternativa para evitar problemas com o módulo
const supabaseJs = import('@supabase/supabase-js');

// Função para inicializar o cliente Supabase
export async function initSupabase() {
  try {
    const { createClient } = await supabaseJs;
    // Resto do código...
  } catch (error) {
    console.error('Erro ao inicializar o Supabase:', error);
    return null;
  }
}
```

### 3. Configuração Alternativa do Vite

Se o problema persistir, pode ser necessário modificar a configuração do Vite para resolver corretamente o pacote:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@supabase/supabase-js': '/node_modules/@supabase/supabase-js/dist/umd/supabase.js',
    },
  },
});
```

### 4. Solução de Fallback

Enquanto o problema não é resolvido, o sistema está configurado para usar o localStorage como fallback. Isso permite que o aplicativo continue funcionando mesmo sem a conexão com o Supabase.

## Próximos Passos

1. Tentar as soluções propostas acima
2. Se o problema persistir, considerar usar uma abordagem de API REST para comunicação com o Supabase em vez da biblioteca cliente
3. Investigar se há problemas específicos de compatibilidade entre a versão do Vite e a biblioteca do Supabase

## Referências

- [Documentação do Supabase](https://supabase.com/docs)
- [Problemas conhecidos do Vite](https://vitejs.dev/guide/troubleshooting.html)
