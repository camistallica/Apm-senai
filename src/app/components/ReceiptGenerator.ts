import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateReceiptPDF = async (elementId: string, fileName: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Captura o elemento como imagem
  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');

  // Define o tamanho "Estilo PIX": 80mm de largura por 160mm de altura
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, 160] 
  });

  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(`${fileName}.pdf`);
};