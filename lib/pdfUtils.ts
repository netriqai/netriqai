import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Invoice, Customer } from './db';

export function generateInvoicePDF(invoice: Invoice, customer: Customer): jsPDF {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 33, 36); // #162124
  doc.text('TAX INVOICE', 14, 22);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Invoice Number: ${invoice.id}`, 14, 30);
  doc.text(`Date Issued: ${invoice.date}`, 14, 35);
  doc.text(`Due Date: ${invoice.dueDate}`, 14, 40);
  
  // From Section (Netriq AI Word Logo & Info at top right)
  // Draw 'NETRIQ' in bold dark navy
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(22, 33, 36); // #162124
  doc.text('NETRIQ', 140, 22);
  
  const netriqWidth = doc.getTextWidth('NETRIQ');
  
  // Draw 'AI' in bold italic brand teal immediately following the text
  doc.setFont('helvetica', 'bolditalic');
  doc.setTextColor(48, 200, 168); // Brand teal
  doc.text('AI', 140 + netriqWidth, 22);

  // Business info underneath the logo
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Melbourne, VIC 3000', 140, 31);
  doc.text('netriqai@gmail.com', 140, 35);
  doc.text('ABN: 48 641 706 767', 140, 39);

  // To Section (Customer)
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 33, 36);
  doc.text('Billed To:', 14, 55);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text(customer.name, 14, 63);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  if (customer.email) doc.text(customer.email, 14, 68);
  if (customer.address) doc.text(customer.address, 14, 73);
  if (customer.abn) doc.text(`ABN: ${customer.abn}`, 14, 78);
  
  // Project
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 33, 36);
  doc.text(`Project: ${invoice.project}`, 14, 88);

  // Items Table
  const tableColumn = ["Description", "Quantity", "Rate", "Amount"];
  const tableRows = invoice.items.map(item => [
    item.description,
    item.quantity.toString(),
    `$${item.rate.toFixed(2)}`,
    `$${item.amount.toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: 94,
    head: [tableColumn],
    body: tableRows,
    theme: 'striped',
    headStyles: { fillColor: [22, 33, 36], halign: 'left' },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 25, halign: 'center' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 35, halign: 'right' }
    },
    margin: { left: 14, right: 14 }
  });

  const finalY = (doc as any).lastAutoTable.finalY || 150;

  // Draw elegant Status Badge on the left
  const badgeX = 14;
  const badgeY = finalY + 10;
  const badgeW = 32;
  const badgeH = 8;
  const isPaid = invoice.status === 'paid';
  const isOverdue = invoice.status === 'overdue';
  
  if (isPaid) {
    doc.setFillColor(220, 252, 231); // light green
    doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 2, 2, 'F');
    doc.setDrawColor(34, 197, 94); // green
    doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 2, 2, 'S');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(21, 128, 61); // dark green
    doc.text('PAID', badgeX + 16, badgeY + 5.5, { align: 'center' });
  } else if (isOverdue) {
    doc.setFillColor(254, 243, 199); // light orange
    doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 2, 2, 'F');
    doc.setDrawColor(245, 158, 11); // orange
    doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 2, 2, 'S');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(180, 83, 9); // dark orange
    doc.text('OVERDUE', badgeX + 16, badgeY + 5.5, { align: 'center' });
  } else {
    doc.setFillColor(254, 242, 242); // light red
    doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 2, 2, 'F');
    doc.setDrawColor(239, 68, 68); // red
    doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 2, 2, 'S');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(220, 38, 38); // dark red
    doc.text('UNPAID', badgeX + 16, badgeY + 5.5, { align: 'center' });
  }

  // Totals - perfectly right-aligned to match the right edge of the table (x=196)
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Subtotal:', 160, finalY + 12, { align: 'right' });
  doc.text(`$${invoice.subtotal.toFixed(2)}`, 196, finalY + 12, { align: 'right' });
  
  doc.text('GST (10%):', 160, finalY + 18, { align: 'right' });
  doc.text(`$${invoice.gst.toFixed(2)}`, 196, finalY + 18, { align: 'right' });
  
  // Solid line divider under Subtotal/GST
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(140, finalY + 22, 196, finalY + 22);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 33, 36);
  doc.text('Total (AUD):', 160, finalY + 28, { align: 'right' });
  doc.text(`$${invoice.total.toFixed(2)}`, 196, finalY + 28, { align: 'right' });
  
  return doc;
}
