import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Generate simple mock barcode lines
export function generateBarcodeValue(value: string): string {
  // Return SVG-like styled pattern based on input string hash
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const binary = Math.abs(hash).toString(2).padStart(24, '0').slice(0, 20);
  return binary;
}

// Mock PDF generation trigger using browser print preview
export function exportToPDFMock(title: string, selectorId: string) {
  const printContent = document.getElementById(selectorId);
  if (!printContent) return;
  
  const windowUrl = 'about:blank';
  const uniqueName = new Date().getTime();
  const windowName = 'Print' + uniqueName;
  
  const printWindow = window.open(windowUrl, windowName, 'left=50,top=50,width=800,height=600');
  if (!printWindow) return;
  
  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: sans-serif; padding: 20px; color: #333; }
          h1 { color: #B76E79; border-bottom: 2px solid #B76E79; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #FFF0F5; color: #B76E79; }
          .footer { margin-top: 30px; font-size: 12px; color: #888; text-align: center; border-top: 1px dashed #ccc; padding-top: 10px; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div>${printContent.innerHTML}</div>
        <div class="footer">Dibuat otomatis oleh Milla Hair Studio Enterprise Platform - ${new Date().toLocaleString('id-ID')}</div>
      </body>
    </html>
  `);
  
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}

// Mock CSV download exporter
export function exportToCSVMock(headers: string[], rows: any[][], fileName: string) {
  const csvContent = "data:text/csv;charset=utf-8," 
    + [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
    
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
