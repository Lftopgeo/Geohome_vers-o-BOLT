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

  /**
   * Uploads a PDF file to cloud storage
   * @param file - The PDF file blob to upload
   * @returns A promise that resolves to the URL of the uploaded file
   * @todo Implement cloud storage integration
   */
  static async uploadToCloud(/* file: Blob */): Promise<string> {
    // This would upload the file to your cloud storage
    throw new Error('Not implemented');
  }

  /**
   * Sends an email with the report
   * @param report - The inspection report data
   * @param pdfUrl - The URL of the uploaded PDF
   * @returns A promise that resolves when the email is sent
   * @todo Implement email service integration
   */
  static async sendEmail(/* report: InspectionReport, pdfUrl: string */): Promise<void> {
    // This would send the email with the report
    throw new Error('Not implemented');
  }

  static generateProtocol(): string {
    const date = format(new Date(), 'yyyyMMdd');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `VST${date}${random}`;
  }
}