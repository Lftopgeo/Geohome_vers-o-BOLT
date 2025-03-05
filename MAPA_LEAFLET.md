# Integração do Mapa Leaflet no Dashboard do Geohome

Este documento descreve a implementação do mapa de geolocalização das vistorias no dashboard do Geohome utilizando a biblioteca Leaflet.

## Visão Geral

O mapa de geolocalização substitui os gráficos de desempenho no dashboard principal, exibindo a localização de todas as vistorias cadastradas no sistema. Cada vistoria é representada por um marcador no mapa, que ao ser clicado exibe informações como tipo de propriedade, endereço e status da vistoria.

## Componentes Implementados

1. **InspectionMap.tsx**: Componente principal que exibe o mapa com os marcadores das vistorias.
2. **InspectionMapAlternative.tsx**: Versão alternativa do componente que utiliza uma abordagem diferente para carregar os ícones do Leaflet, evitando problemas de importação.
3. **InspectionMapBasic.tsx**: Versão básica do componente que exibe as vistorias em um formato de grade simples, mantendo a simulação de coordenadas geográficas.
4. **InspectionMap.css**: Estilos específicos para o componente do mapa.

## Dependências Adicionadas

Foram adicionadas as seguintes dependências ao projeto:

```json
"leaflet": "^1.9.4",
"react-leaflet": "^4.2.1",
"@types/leaflet": "^1.9.8"
```

## Configuração do Vite

O arquivo `vite.config.ts` foi atualizado para incluir suporte aos arquivos estáticos do Leaflet:

```typescript
resolve: {
  alias: {
    // Resolver problemas de importação de imagens do Leaflet
    'leaflet': resolve(__dirname, 'node_modules/leaflet'),
  }
},
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        leaflet: ['leaflet', 'react-leaflet']
      }
    }
  }
}
```

## Importação do CSS do Leaflet

O CSS do Leaflet foi importado no arquivo `src/index.css`:

```css
/* Importar CSS do Leaflet para o mapa */
@import 'leaflet/dist/leaflet.css';
```

## Simulação de Geolocalização

Como o sistema ainda não possui uma integração com uma API de geocodificação real, foi implementada uma função para simular coordenadas geográficas para as vistorias:

```typescript
const getSimulatedCoordinates = (address: string): GeoLocation => {
  // Gerar coordenadas aleatórias próximas ao centro do mapa
  // Apenas para simulação
  const randomLat = mapCenter.lat + (Math.random() - 0.5) * 0.1;
  const randomLng = mapCenter.lng + (Math.random() - 0.5) * 0.1;
  
  return {
    lat: randomLat,
    lng: randomLng
  };
};
```

## Problemas Conhecidos e Soluções

### Erro de Importação do react-leaflet

Se você encontrar o seguinte erro:

```
[plugin:vite:import-analysis] Failed to resolve import "react-leaflet" from "src/components/Dashboard/InspectionMapAlternative.tsx". Does the file exist?
```

Isso indica que o pacote `react-leaflet` não está sendo resolvido corretamente pelo Vite.

#### Solução Temporária

Uma solução temporária foi implementada através do componente `InspectionMapBasic.tsx`, que não depende do Leaflet ou do react-leaflet. Este componente exibe as vistorias em um formato de grade simples, mantendo a simulação de coordenadas geográficas.

Para usar esta solução:

1. Importe o componente `InspectionMapBasic` em vez do `InspectionMap` ou `InspectionMapAlternative`:

```tsx
import { InspectionMapBasic as InspectionMap } from '../components/Dashboard/InspectionMapBasic';
```

#### Solução Permanente

Para resolver o problema permanentemente:

1. Verifique se as dependências estão instaladas corretamente:
   ```bash
   npm install leaflet react-leaflet @types/leaflet --save
   ```

2. Limpe o cache do npm e reinstale as dependências:
   ```bash
   npm cache clean --force
   npm ci
   ```

3. Verifique se o arquivo `vite.config.ts` está configurado corretamente para resolver os arquivos do Leaflet:
   ```typescript
   resolve: {
     alias: {
       // Resolver problemas com importações de imagens do Leaflet
       'leaflet': 'leaflet/dist/leaflet-src.esm.js',
     }
   }
   ```

4. Certifique-se de que o CSS do Leaflet está sendo importado corretamente:
   ```css
   /* Em index.css */
   @import 'leaflet/dist/leaflet.css';
   ```

## Próximos Passos

1. **Integração com API de Geocodificação**: Substituir a simulação de coordenadas por uma integração com uma API de geocodificação real, como Google Maps ou OpenStreetMap Nominatim.
2. **Filtragem no Mapa**: Implementar filtros para exibir vistorias no mapa por status, período ou tipo de propriedade.
3. **Agrupamento de Marcadores**: Adicionar funcionalidade de clustering para melhorar a visualização quando houver muitos marcadores próximos.
4. **Rotas entre Vistorias**: Implementar funcionalidade para calcular e exibir rotas entre vistorias agendadas para o mesmo dia.

## Observações

- O componente utiliza o OpenStreetMap como provedor de tiles, que é gratuito para uso não comercial.
- Para uso em produção com alto volume de requisições, considere utilizar um provedor de tiles comercial ou hospedar seus próprios tiles.
- A implementação atual é responsiva e se adapta a diferentes tamanhos de tela.
