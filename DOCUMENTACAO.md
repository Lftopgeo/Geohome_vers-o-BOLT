# Documentação do Funcionamento do Aplicativo Geohome

## 1. Visão Geral

O Geohome é uma aplicação web completa para gerenciamento de vistorias técnicas de imóveis. O sistema permite que inspetores técnicos realizem vistorias detalhadas, registrando condições de ambientes internos e externos, medidores, chaves e outros elementos relevantes, gerando relatórios profissionais em formato PDF.

A aplicação é dividida em duas partes principais:
- **Frontend**: Interface de usuário construída com React e TypeScript
- **Backend**: API RESTful desenvolvida com Node.js e Express, integrada com banco de dados PostgreSQL via Supabase

O sistema implementa autenticação segura, armazenamento de dados estruturados, upload de imagens e geração de relatórios detalhados, tudo com uma interface moderna e responsiva.

## 2. Frontend

### Descrição Geral

O frontend do Geohome é uma aplicação de página única (SPA) que oferece uma experiência de usuário fluida e intuitiva. A interface é organizada em várias páginas que seguem o fluxo natural de uma vistoria, desde o login até a geração do relatório final.

### Tecnologias Utilizadas

- **Framework Principal**: React 18 com TypeScript
- **Roteamento**: React Router DOM 6
- **Estilização**: TailwindCSS
- **Geração de PDF**: @react-pdf/renderer, jsPDF, html2canvas
- **Captura de Assinaturas**: react-signature-canvas
- **Formatação de Datas**: date-fns
- **Ícones**: Lucide React
- **Bundler**: Vite

### Fluxo de Navegação

1. **Login**: Autenticação do usuário
2. **Dashboard**: Visão geral das vistorias e opções disponíveis
3. **Nova Vistoria**: Criação de uma nova vistoria com dados básicos
4. **Áreas de Vistoria**: Definição das áreas a serem vistoriadas
5. **Ambiente Interno**: Registro de condições dos cômodos internos
6. **Ambiente Externo**: Registro de condições das áreas externas
7. **Chaves e Medidores**: Registro de chaves e leituras de medidores
8. **Relatório**: Visualização e geração do relatório final em PDF

### Melhores Práticas de UI/UX

- **Design Responsivo**: Interface adaptável a diferentes tamanhos de tela
- **Feedback Visual**: Indicadores claros de progresso e conclusão de tarefas
- **Formulários Intuitivos**: Campos organizados logicamente com validação em tempo real
- **Navegação Simplificada**: Menu de navegação consistente e breadcrumbs
- **Modo Offline**: Capacidade de trabalhar offline com sincronização posterior
- **Acessibilidade**: Conformidade com diretrizes WCAG para acessibilidade

## 3. Backend

### Arquitetura Geral

O backend do Geohome segue uma arquitetura MVC (Model-View-Controller) adaptada para APIs RESTful. O sistema é construído com Node.js e Express, utilizando o Supabase como plataforma de banco de dados PostgreSQL com funcionalidades adicionais.

### Tecnologias e Frameworks

- **Runtime**: Node.js
- **Framework Web**: Express
- **Banco de Dados**: PostgreSQL via Supabase
- **Autenticação**: Supabase Auth com JWT
- **Upload de Arquivos**: Multer
- **Validação**: Express Validator
- **Variáveis de Ambiente**: Dotenv
- **CORS**: Cors

### Gerenciamento de Dados

- **ORM**: Supabase JavaScript Client
- **Migrações**: Scripts SQL para criação e atualização de esquemas
- **Segurança de Dados**: Row Level Security (RLS) no PostgreSQL
- **Transações**: Suporte a transações para operações complexas
- **Relacionamentos**: Chaves estrangeiras e integridade referencial
- **Armazenamento de Arquivos**: Sistema de arquivos local com referências no banco

### Segurança

- **Autenticação**: JWT (JSON Web Tokens) via Supabase Auth
- **Autorização**: Middleware de autenticação e políticas RLS
- **Validação de Entrada**: Sanitização e validação de todos os dados recebidos
- **Proteção contra Ataques Comuns**: XSS, CSRF, SQL Injection
- **Limitação de Tamanho**: Limite de 5MB para uploads de arquivos
- **Tipos de Arquivo**: Restrição a formatos de imagem específicos (jpg, jpeg, png, gif)

## 4. Rotas

### Definição de Rotas

#### Rotas de Autenticação
- `/api/auth/register`: Registro de novos usuários
- `/api/auth/login`: Autenticação de usuários
- `/api/auth/logout`: Encerramento de sessão
- `/api/auth/profile`: Gerenciamento de perfil de usuário

#### Rotas de Inspeção
- `/api/inspections`: Gerenciamento de vistorias
- `/api/rooms`: Gerenciamento de cômodos internos
- `/api/external-areas`: Gerenciamento de áreas externas
- `/api/keys-and-meters`: Gerenciamento de chaves e medidores
- `/api/templates`: Gerenciamento de modelos de vistoria
- `/api/photos`: Gerenciamento de fotos da vistoria

#### Rota de Upload
- `/api/upload`: Upload de arquivos de imagem

### Metodologias HTTP

- **GET**: Recuperação de recursos (listagem de vistorias, detalhes específicos)
- **POST**: Criação de novos recursos (nova vistoria, novo cômodo)
- **PUT**: Atualização completa de recursos existentes
- **PATCH**: Atualização parcial de recursos existentes
- **DELETE**: Remoção de recursos

### Políticas de CORS e Autenticação de Rotas

- **CORS**: Configurado para permitir requisições da origem do frontend
- **Middleware de Autenticação**: Verifica tokens JWT em rotas protegidas
- **Níveis de Acesso**: Usuários só podem acessar seus próprios dados
- **Row Level Security**: Políticas no banco de dados que restringem acesso baseado no ID do usuário

## 5. Relatório Final

### Composição do Relatório

O relatório final de vistoria é um documento PDF abrangente que inclui:

- **Cabeçalho**: Logo, informações da empresa e número de protocolo
- **Dados do Inspetor**: Nome, identificação e assinatura digital
- **Dados do Cliente**: Nome, documento, contato
- **Dados do Imóvel**: Endereço, tipo, área total
- **Ambientes Internos**: Detalhes de cada cômodo vistoriado
- **Áreas Externas**: Condições das áreas externas
- **Chaves e Medidores**: Registro de chaves e leituras de medidores
- **Fotos**: Imagens capturadas durante a vistoria
- **Parecer Técnico**: Conclusão profissional sobre o estado do imóvel
- **Rodapé**: Data, hora e página

### Integração de Dados

O processo de geração do relatório envolve:

1. Coleta de dados do frontend (formulários preenchidos pelo inspetor)
2. Envio para o backend para processamento e validação
3. Recuperação de dados complementares do banco de dados
4. Estruturação dos dados no formato adequado para o relatório
5. Geração do PDF com todas as seções e imagens

### Automação e Geração

- O relatório pode ser gerado a qualquer momento durante a vistoria
- A geração final ocorre após a conclusão de todas as etapas da vistoria
- O sistema verifica a completude dos dados antes da geração
- O relatório recebe um número de protocolo único gerado automaticamente

### Formatos Disponíveis

- **PDF**: Formato principal, otimizado para impressão e compartilhamento digital
- **Visualização Web**: Prévia do relatório antes da geração do PDF
- **Armazenamento**: Cópia do relatório armazenada no banco de dados para referência futura

## 6. Conclusão

### Desempenho e Escalabilidade

- **Otimização de Consultas**: Índices no banco de dados para consultas frequentes
- **Caching**: Implementação de cache para dados estáticos e templates
- **Processamento Assíncrono**: Operações pesadas como geração de PDF executadas assincronamente
- **Arquitetura Modular**: Componentes independentes que facilitam a manutenção e escalabilidade
- **Supabase**: Plataforma escalável que gerencia automaticamente recursos de banco de dados

### Considerações Finais

O Geohome representa uma solução completa e profissional para vistorias técnicas de imóveis, combinando:

- Interface moderna e intuitiva
- Backend robusto e seguro
- Banco de dados bem estruturado com políticas de segurança
- Geração de relatórios profissionais
- Fluxo de trabalho otimizado para inspetores

#### Melhorias Futuras

- Implementação de aplicativo móvel para trabalho offline
- Integração com sistemas de gestão imobiliária
- Recursos avançados de IA para detecção automática de problemas em fotos
- Expansão para outros tipos de vistorias técnicas
- Dashboard analítico para gestão de múltiplos inspetores

## 7. Diagramas

### Diagrama de Arquitetura
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │
│   Cliente   │────▶│   Frontend  │────▶│   Backend   │
│  (Browser)  │     │   (React)   │     │  (Express)  │
│             │◀────│             │◀────│             │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │             │
                                        │  Supabase   │
                                        │ (PostgreSQL)│
                                        │             │
                                        └─────────────┘
```

### Diagrama de Fluxo de Vistoria
```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│         │     │         │     │         │     │         │
│  Login  │────▶│  Nova   │────▶│  Áreas  │────▶│ Ambiente│
│         │     │ Vistoria│     │         │     │ Interno │
└─────────┘     └─────────┘     └─────────┘     └────┬────┘
                                                     │
┌─────────┐     ┌─────────┐     ┌─────────┐         │
│         │     │         │     │         │         │
│Relatório│◀────│ Chaves e│◀────│ Ambiente│◀────────┘
│   PDF   │     │Medidores│     │ Externo │
└─────────┘     └─────────┘     └─────────┘
```

### Diagrama ER Simplificado
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Users     │     │ Inspections │     │    Rooms    │
│             │1   *│             │1   *│             │
│ id          │────▶│ id          │────▶│ id          │
│ email       │     │ property_data│     │ name        │
│ password    │     │ status      │     │ condition   │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│External Areas│    │ Keys/Meters │    │   Photos    │
│             │    │             │    │             │
│ id          │    │ id          │    │ id          │
│ name        │    │ type        │    │ filename    │
│ condition   │    │ reading     │    │ room_id     │
└─────────────┘    └─────────────┘    └─────────────┘
```
