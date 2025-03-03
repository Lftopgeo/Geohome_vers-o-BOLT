# Geohome_vers-o-BOLT

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/Lftopgeo/Geohome_vers-o-BOLT)

## Geração de PDF com ReportLab

Este projeto agora inclui integração com ReportLab 4.0+ para geração de relatórios PDF de alta qualidade. A integração é feita através de um serviço backend em Python que utiliza ReportLab para gerar PDFs com recursos avançados.

### Instalação do Backend ReportLab

Para utilizar o serviço de geração de PDF com ReportLab, siga os passos abaixo:

1. Certifique-se de ter o Python 3.8 ou superior instalado em seu sistema
2. Execute o script de instalação na pasta `backend`:
   ```
   cd backend
   install.bat
   ```
3. Após a instalação, inicie o servidor:
   ```
   run.bat
   ```
4. O serviço estará disponível em `http://localhost:8000`

### Uso no Frontend

O serviço de relatório foi atualizado para utilizar o ReportLab como primeira opção, com fallback para o gerador PDF original (jsPDF) caso o serviço ReportLab não esteja disponível.

```typescript
import { ReportService } from './services/reportService';

// Gerar e baixar um PDF
const report = { /* ... dados do relatório ... */ };
const blob = await ReportService.generatePDF(report);
```

### Documentação da API

A documentação interativa da API do backend estará disponível em `http://localhost:8000/docs` após iniciar o serviço.