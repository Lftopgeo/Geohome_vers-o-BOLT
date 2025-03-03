import { format } from 'date-fns';
import type { InspectionReport } from '../types/report';
import { PDFGenerator } from './pdfGenerator';
import { ReportLabPdfService } from './reportlabPdfService';

export class ReportService {
  static async generatePDF(report: InspectionReport): Promise<Blob> {
    try {
      // Try to use the ReportLab service first
      return await ReportLabPdfService.generatePDF(report);
    } catch (error) {
      console.warn('Failed to generate PDF with ReportLab, falling back to jsPDF:', error);
      // Fall back to the original PDF generator
      return await PDFGenerator.generatePDF(report);
    }
  }

  static async uploadToCloud(file: Blob): Promise<string> {
    // This would upload the file to your cloud storage
    throw new Error('Not implemented');
  }

  static async sendEmail(report: InspectionReport, pdfUrl: string): Promise<void> {
    // This would send the email with the report
    throw new Error('Not implemented');
  }

  static generateProtocol(): string {
    const date = format(new Date(), 'yyyyMMdd');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `VST${date}${random}`;
  }
}