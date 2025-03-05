# Solução para o Problema de Importação do react-leaflet

## Problema Identificado

O projeto estava enfrentando um erro ao tentar importar o pacote `react-leaflet`:

```
[plugin:vite:import-analysis] Failed to resolve import "react-leaflet" from "src/components/Dashboard/InspectionMapAlternative.tsx". Does the file exist?
```

Este erro ocorre quando o pacote `react-leaflet` não está instalado corretamente ou quando há problemas com a resolução de dependências no projeto.

## Solução Implementada

Para resolver este problema, foi criada uma versão alternativa do componente de mapa que não depende do Leaflet ou do react-leaflet. Esta solução temporária permite que o aplicativo continue funcionando enquanto os problemas de dependência são resolvidos.

### Arquivos Modificados:

1. **Criado novo componente**: `InspectionMapBasic.tsx`
   - Um componente simplificado que exibe as vistorias em um formato de grade
   - Mantém a simulação de coordenadas geográficas
   - Não depende de nenhuma biblioteca externa de mapas

2. **Atualizado o DashboardPage.tsx**:
   - Substituída a importação do `InspectionMapAlternative` pelo novo `InspectionMapBasic`

3. **Simplificado o CSS**:
   - Removidas as classes específicas do Leaflet do arquivo `InspectionMap.css`
   - Mantidas apenas as classes necessárias para o componente básico

4. **Removidas importações desnecessárias**:
   - Removida a importação do CSS do Leaflet do arquivo `index.css`

## Como Resolver o Problema Original

Para resolver o problema original e restaurar a funcionalidade completa do mapa com Leaflet, siga estas etapas:

1. **Instalar as dependências corretamente**:
   ```bash
   npm install leaflet react-leaflet @types/leaflet --save
   ```

2. **Verificar o package.json**:
   - Certifique-se de que as dependências estão listadas corretamente
   - Verifique se não há conflitos de versões

3. **Limpar o cache do npm**:
   ```bash
   npm cache clean --force
   ```

4. **Reinstalar as dependências**:
   ```bash
   npm ci
   ```

5. **Restaurar os componentes originais**:
   - Voltar a usar o `InspectionMap.tsx` ou `InspectionMapAlternative.tsx`
   - Restaurar as importações do CSS do Leaflet

## Próximos Passos

1. Resolver os problemas de instalação das dependências
2. Restaurar a funcionalidade completa do mapa com Leaflet
3. Considerar adicionar fallbacks para quando as bibliotecas externas não estiverem disponíveis
