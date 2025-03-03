# Backend para Geração de PDF com ReportLab

Este é um serviço backend para geração de PDF utilizando a biblioteca ReportLab versão 4.0 ou superior. O serviço é construído com FastAPI e oferece uma API para geração de relatórios de vistoria técnica.

## Requisitos

- Python 3.8 ou superior
- ReportLab 4.0 ou superior
- FastAPI
- Uvicorn
- Outras dependências listadas em `requirements.txt`

## Instalação

1. Certifique-se de ter o Python instalado em seu sistema
2. Crie um ambiente virtual (opcional, mas recomendado):
   ```
   python -m venv venv
   ```
3. Ative o ambiente virtual:
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`
4. Instale as dependências:
   ```
   pip install -r requirements.txt
   ```

## Executando o Serviço

Para iniciar o serviço, execute:

```
python main.py
```

Ou diretamente com o Uvicorn:

```
uvicorn main:app --reload
```

O serviço estará disponível em `http://localhost:8000`.

## Endpoints

### POST /generate-pdf

Gera um PDF com base nos dados de vistoria técnica fornecidos.

**Corpo da Requisição:**
```json
{
  "id": "string",
  "date": "string",
  "inspector": {
    "name": "string",
    "registration": "string",
    "signature": "string (base64)"
  },
  "property": {
    "address": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string",
    "type": "string",
    "area": 0,
    "constructionYear": 0
  },
  "rooms": [
    {
      "name": "string",
      "condition": "string",
      "observations": "string",
      "photos": ["string (base64)"]
    }
  ],
  "externalItems": [
    {
      "name": "string",
      "condition": "string",
      "observations": "string",
      "photos": ["string (base64)"]
    }
  ],
  "keysAndMeters": [
    {
      "type": "string",
      "quantity": 0,
      "observations": "string",
      "photos": ["string (base64)"]
    }
  ],
  "technicalOpinion": "string"
}
```

**Resposta:**
- Arquivo PDF contendo o relatório de vistoria técnica

## Documentação da API

A documentação interativa da API estará disponível em `http://localhost:8000/docs` após iniciar o serviço.
