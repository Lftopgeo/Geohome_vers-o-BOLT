from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import json
import os
import tempfile
from typing import Dict, List, Any, Optional
from pydantic import BaseModel
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import base64
import io

app = FastAPI(title="Geohome PDF Generator API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define models
class Inspector(BaseModel):
    name: str
    registration: str
    signature: Optional[str] = None

class Property(BaseModel):
    address: str
    city: str
    state: str
    zipCode: str
    type: str
    area: float
    constructionYear: int

class Room(BaseModel):
    name: str
    condition: str
    observations: Optional[str] = None
    photos: List[str] = []

class ExternalItem(BaseModel):
    name: str
    condition: str
    observations: Optional[str] = None
    photos: List[str] = []

class KeysMeter(BaseModel):
    type: str
    quantity: int
    observations: Optional[str] = None
    photos: List[str] = []

class InspectionReport(BaseModel):
    id: str
    date: str
    inspector: Inspector
    property: Property
    rooms: List[Room]
    externalItems: List[ExternalItem]
    keysAndMeters: List[KeysMeter]
    technicalOpinion: str

@app.post("/generate-pdf")
async def generate_pdf(report: InspectionReport = Body(...)):
    try:
        # Create a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            temp_filename = tmp.name
        
        # Generate PDF with ReportLab
        doc = SimpleDocTemplate(
            temp_filename,
            pagesize=A4,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72
        )
        
        # Prepare styles
        styles = getSampleStyleSheet()
        title_style = styles['Heading1']
        subtitle_style = styles['Heading2']
        normal_style = styles['Normal']
        
        # Build content
        content = []
        
        # Title
        content.append(Paragraph("Relatório de Vistoria Técnica", title_style))
        content.append(Paragraph(f"Protocolo: {report.id}", subtitle_style))
        content.append(Paragraph(f"Data: {report.date}", normal_style))
        content.append(Spacer(1, 12))
        
        # Inspector information
        content.append(Paragraph("Dados do Inspetor", subtitle_style))
        content.append(Paragraph(f"Nome: {report.inspector.name}", normal_style))
        content.append(Paragraph(f"Registro: {report.inspector.registration}", normal_style))
        content.append(Spacer(1, 12))
        
        # Property information
        content.append(Paragraph("Dados do Imóvel", subtitle_style))
        content.append(Paragraph(f"Endereço: {report.property.address}", normal_style))
        content.append(Paragraph(f"Cidade: {report.property.city}", normal_style))
        content.append(Paragraph(f"Estado: {report.property.state}", normal_style))
        content.append(Paragraph(f"CEP: {report.property.zipCode}", normal_style))
        content.append(Paragraph(f"Tipo: {report.property.type}", normal_style))
        content.append(Paragraph(f"Área: {report.property.area} m²", normal_style))
        content.append(Paragraph(f"Ano de Construção: {report.property.constructionYear}", normal_style))
        content.append(Spacer(1, 12))
        
        # Rooms
        content.append(Paragraph("Ambientes Internos", subtitle_style))
        for room in report.rooms:
            content.append(Paragraph(f"Ambiente: {room.name}", normal_style))
            content.append(Paragraph(f"Condição: {room.condition}", normal_style))
            if room.observations:
                content.append(Paragraph(f"Observações: {room.observations}", normal_style))
            content.append(Spacer(1, 6))
            
            # Add photos if available
            if room.photos:
                for i, photo_base64 in enumerate(room.photos):
                    try:
                        # Skip the data:image/jpeg;base64, part
                        if "base64," in photo_base64:
                            photo_base64 = photo_base64.split("base64,")[1]
                        
                        photo_data = base64.b64decode(photo_base64)
                        photo_stream = io.BytesIO(photo_data)
                        img = Image(photo_stream, width=200, height=150)
                        content.append(img)
                        content.append(Paragraph(f"Foto {i+1}", normal_style))
                        content.append(Spacer(1, 6))
                    except Exception as e:
                        content.append(Paragraph(f"Erro ao processar foto: {str(e)}", normal_style))
            
            content.append(Spacer(1, 12))
        
        # External items
        content.append(Paragraph("Ambiente Externo", subtitle_style))
        for item in report.externalItems:
            content.append(Paragraph(f"Item: {item.name}", normal_style))
            content.append(Paragraph(f"Condição: {item.condition}", normal_style))
            if item.observations:
                content.append(Paragraph(f"Observações: {item.observations}", normal_style))
            content.append(Spacer(1, 12))
        
        # Keys and meters
        content.append(Paragraph("Chaves e Medidores", subtitle_style))
        for item in report.keysAndMeters:
            content.append(Paragraph(f"Tipo: {item.type}", normal_style))
            content.append(Paragraph(f"Quantidade: {item.quantity}", normal_style))
            if item.observations:
                content.append(Paragraph(f"Observações: {item.observations}", normal_style))
            content.append(Spacer(1, 12))
        
        # Technical opinion
        content.append(Paragraph("Parecer Técnico", subtitle_style))
        content.append(Paragraph(report.technicalOpinion, normal_style))
        content.append(Spacer(1, 24))
        
        # Signature
        if report.inspector.signature:
            try:
                # Skip the data:image/jpeg;base64, part
                if "base64," in report.inspector.signature:
                    signature_base64 = report.inspector.signature.split("base64,")[1]
                else:
                    signature_base64 = report.inspector.signature
                
                signature_data = base64.b64decode(signature_base64)
                signature_stream = io.BytesIO(signature_data)
                signature_img = Image(signature_stream, width=100, height=50)
                content.append(signature_img)
            except Exception as e:
                content.append(Paragraph(f"Erro ao processar assinatura: {str(e)}", normal_style))
        
        content.append(Paragraph(report.inspector.name, normal_style))
        content.append(Paragraph("Responsável Técnico", normal_style))
        
        # Build the PDF
        doc.build(content)
        
        # Return the PDF file
        return FileResponse(
            temp_filename,
            media_type="application/pdf",
            filename=f"relatorio_{report.id}.pdf"
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar PDF: {str(e)}")
    finally:
        # Clean up the temporary file
        if 'temp_filename' in locals():
            try:
                os.unlink(temp_filename)
            except:
                pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
