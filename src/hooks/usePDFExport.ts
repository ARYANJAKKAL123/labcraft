import { useState, useCallback } from 'react';
import type { Practical, Manual } from '@/types';

// Access jsPDF from CDN
declare global {
  interface Window {
    jspdf: {
      jsPDF: any;
    };
    html2canvas: (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
  }
}

export function usePDFExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const exportToPDF = useCallback(async (
    elementId: string,
    filename: string
  ): Promise<boolean> => {
    setIsExporting(true);
    setProgress(0);

    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Element not found');
      }

      // Wait for any images to load
      await new Promise(resolve => setTimeout(resolve, 500));

      setProgress(30);

      // Use html2canvas from CDN
      const html2canvas = window.html2canvas;
      if (!html2canvas) {
        throw new Error('html2canvas not loaded');
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      setProgress(60);

      const imgData = canvas.toDataURL('image/png');
      
      // Use jsPDF from CDN
      const { jsPDF } = window.jspdf;
      if (!jsPDF) {
        throw new Error('jsPDF not loaded');
      }

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      let imgY = 10;
      
      let scaledHeight = imgHeight * ratio;
      let heightLeft = scaledHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, scaledHeight);
      heightLeft -= (pdfHeight - 20);

      // Add additional pages if content is too long
      while (heightLeft > 0) {
        position = heightLeft - scaledHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, scaledHeight);
        heightLeft -= (pdfHeight - 20);
      }

      setProgress(90);

      pdf.save(`${filename}.pdf`);

      setProgress(100);
      return true;
    } catch (err) {
      console.error('PDF export error:', err);
      return false;
    } finally {
      setIsExporting(false);
      setProgress(0);
    }
  }, []);

  const exportPractical = useCallback(async (
    practical: Practical,
    manual: Manual
  ): Promise<boolean> => {
    const elementId = `practical-print-${practical.id}`;
    const filename = `${manual.subject}_Practical_${practical.number}_${practical.title.replace(/[^a-zA-Z0-9]/g, '_')}`;
    return exportToPDF(elementId, filename);
  }, [exportToPDF]);

  const exportFullManual = useCallback(async (
    manual: Manual,
    _practicals: Practical[]
  ): Promise<boolean> => {
    const elementId = `manual-print-${manual.id}`;
    const filename = `${manual.subject}_Complete_Manual`;
    return exportToPDF(elementId, filename);
  }, [exportToPDF]);

  const printElement = useCallback((elementId: string): boolean => {
    try {
      const element = document.getElementById(elementId);
      if (!element) return false;

      const printWindow = window.open('', '_blank');
      if (!printWindow) return false;

      const styles = Array.from(document.styleSheets)
        .map(sheet => {
          try {
            return Array.from(sheet.cssRules)
              .map(rule => rule.cssText)
              .join('\n');
          } catch {
            return '';
          }
        })
        .join('\n');

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print</title>
            <style>${styles}</style>
            <style>
              @media print {
                body { margin: 0; padding: 20px; }
                .no-print { display: none !important; }
              }
            </style>
          </head>
          <body>
            ${element.innerHTML}
          </body>
        </html>
      `);

      printWindow.document.close();
      
      // Wait for content to load then print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);

      return true;
    } catch (err) {
      console.error('Print error:', err);
      return false;
    }
  }, []);

  return {
    exportToPDF,
    exportPractical,
    exportFullManual,
    printElement,
    isExporting,
    progress,
  };
}
