import { RefObject } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// This function adds temporary styles to the document for PDF printing.
const addPrintStyles = () => {
  const existingStyle = document.getElementById('pdf-print-styles');
  if (existingStyle) {
    existingStyle.remove();
  }

  const style = document.createElement('style');
  style.id = 'pdf-print-styles';
  style.textContent = `
    .pdf-container {
      background: white !important;
      color: black !important;
      font-family: 'Arial', sans-serif !important;
      padding: 10px !important;
      box-sizing: border-box !important;
      overflow: visible !important;
      width: auto !important;
      max-width: none !important;
    }
    
    .pdf-container * {
      background: white !important;
      color: black !important;
      border-color: #333 !important;
      box-shadow: none !important;
    }
    
    .pdf-container table {
      width: 100% !important;
      border-collapse: collapse !important;
      font-size: 8px !important;
      line-height: 1.8 !important;
      table-layout: fixed !important;
    }
    
    .pdf-container th,
    .pdf-container td {
      padding: 3px 1px !important;
      border: 1px solid #333 !important;
      text-align: center !important;
      word-wrap: break-word !important;
      overflow-wrap: break-word !important;
      white-space: normal !important;
      font-size: 14px !important; /* Standardize all number sizes */
      max-width: none !important;
      min-width: 0 !important;
    }
    
    .pdf-container th {
      background: #f5f5f5 !important;
      font-weight: bold !important;
      font-size: 18px !important;
    }

    .pdf-container .date-cell .day {
      font-size: 10px !important;
      color: #666 !important;
    }

    .pdf-container .date-cell .date {
      font-size: 18px !important;
    }

    .pdf-container thead th,
    .pdf-container thead td,
    .pdf-container thead th *,
    .pdf-container thead td * {
      background: #f5f5f5 !important;
    }

    .pdf-container input {
      font-size: 14px !important; /* Standardize all number sizes */
      border: none !important;
      text-align: center !important;
      background: transparent !important;
    }
    
    .pdf-container button {
      font-size: 14px !important;
    }

    .pdf-container .card {
      border: 2px solid #333 !important;
      border-radius: 4px !important;
      margin: 5px 0 !important;
    }
    
    .pdf-container .card-header {
      border-bottom: 1px solid #333 !important;
      padding: 8px !important;
      background: #f8f8f8 !important;
    }
    
    .pdf-container .card-title {
      font-size: 14px !important;
      font-weight: bold !important;
      margin: 0 !important;
    }
    
    .pdf-container .card-content {
      padding: 5px !important;
    }
    
    .pdf-container .summary-section {
      margin: 20px 0 !important;
      padding: 8px !important;
      border: 2px solid #333 !important;
      background: #f9f9f9 !important;
    }
    
    .pdf-container .date-cell {
      font-weight: bold !important;
      background: #f0f0f0 !important;
    }
    
    .pdf-container .total-row {
      font-weight: bold !important;
      background: #e8e8e8 !important;
    }
    
    .pdf-container .lucide,
    .pdf-container svg {
      display: none !important;
    }
    
    .pdf-container .table,
    .pdf-container .table-header,
    .pdf-container .table-body,
    .pdf-container .table-row,
    .pdf-container .table-head,
    .pdf-container .table-cell,
    .pdf-container .table-footer {
      display: table !important;
      width: 100% !important;
      table-layout: fixed !important;
    }
    
    .pdf-container .table-header,
    .pdf-container .table-body,
    .pdf-container .table-footer {
      display: table-row-group !important;
    }
    
    .pdf-container .table-row {
      display: table-row !important;
    }
    
    .pdf-container .table-head,
    .pdf-container .table-cell {
      display: table-cell !important;
    }
  `;
  document.head.appendChild(style);
};

// This function removes the temporary styles after printing.
const removePrintStyles = () => {
  const style = document.getElementById('pdf-print-styles');
  if (style) {
    style.remove();
  }
};

// The main function to handle the print/export action.
export const handlePrint = async (
  printRef: RefObject<HTMLDivElement>,
  toast: (options: { variant?: "default" | "destructive" | null, title: string, description: string }) => void,
  selectedSheet: string,
  selectedMonth: Date
) => {
  const input = printRef.current;
  if (!input) {
    toast({
      variant: "destructive",
      title: "Export Failed",
      description: "No content found to export.",
    });
    return;
  }

  const originalTheme = document.documentElement.getAttribute('data-theme');
  const originalClass = input.className;

  try {
    document.documentElement.setAttribute('data-theme', 'light');
    addPrintStyles();
    input.className = `${originalClass} pdf-container`;

    await new Promise(resolve => setTimeout(resolve, 500));

    const canvas = await html2canvas(input, {
      scale: 1.5, // Reduced scale for smaller file size
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        const clonedInput = clonedDoc.querySelector('.pdf-container');
        if (clonedInput) {
          // Replace inputs with their values
          const inputs = clonedInput.querySelectorAll('input');
          inputs.forEach((input: HTMLInputElement) => {
            const value = input.value || '0';
            const span = clonedDoc.createElement('span');
            span.textContent = value;
            span.style.display = 'inline-block';
            span.style.width = '100%';
            span.style.textAlign = 'center';
            span.style.fontSize = '8px';
            input.parentNode?.replaceChild(span, input);
          });

          // Replace button groups with selected text
          const buttonGroups = clonedInput.querySelectorAll('.flex.flex-col.gap-1');
          buttonGroups.forEach((group) => {
            const selectedButton = group.querySelector(
              'button.bg-blue-500, button.bg-orange-500, button.bg-green-500, button.bg-purple-500'
            );
            if (selectedButton) {
              const span = clonedDoc.createElement('span');
              span.textContent = selectedButton.textContent || '';
              span.style.display = 'inline-block';
              span.style.width = '100%';
              span.style.textAlign = 'center';
              span.style.fontSize = '8px';
              group.parentNode?.replaceChild(span, group);
            }
          });
        }
      },
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.8); // Use JPEG for compression

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a3',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const canvasAspectRatio = canvasWidth / canvasHeight;

    let imgWidth = pdfWidth - 20; // 10mm margin on each side
    let imgHeight = imgWidth / canvasAspectRatio;

    if (imgHeight > pdfHeight - 20) { // Check if it fits vertically
      imgHeight = pdfHeight - 20; // 10mm margin on top/bottom
      imgWidth = imgHeight * canvasAspectRatio;
    }

    const x = (pdfWidth - imgWidth) / 2; // Center horizontally
    const y = (pdfHeight - imgHeight) / 2; // Center vertically

    pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);

    const monthName = selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const fileName = `${selectedSheet.replace(/[^a-zA-Z0-9]/g, '_')}_${monthName.replace(' ', '_')}.pdf`;

    pdf.save(fileName);

    toast({
      title: "Export Successful",
      description: `The report has been saved as ${fileName}`,
    });

  } catch (error: any) {
    toast({
      variant: "destructive",
      title: "Export Failed",
      description: error.message || "An unexpected error occurred during PDF export.",
    });
  } finally {
    if (input) {
      input.className = originalClass;
    }
    if (originalTheme) {
      document.documentElement.setAttribute('data-theme', originalTheme);
    }
    removePrintStyles();
  }
};
