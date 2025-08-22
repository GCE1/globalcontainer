import pdf from 'html-pdf-node';
import path from 'path';
import fs from 'fs';

export interface InvoiceData {
  invoice: {
    invoiceNumber: string;
    invoiceDate: Date;
    dueDate: Date;
    status: string;
    totalAmount: string;
    subtotal: string;
    shippingCost: string;
    expeditedFee: string;
  };
  order: {
    orderNumber: string;
    shippingMethod: string;
    doorDirection: string;
    expeditedDelivery: boolean;
    payOnDelivery: boolean;
    distanceMiles: string;
    referralCode: string;
    orderNote: string;
  };
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    phone: string;
    billingAddress: string;
    billingCity: string;
    billingState: string;
    billingZip: string;
    shippingAddress: string;
    shippingCity: string;
    shippingState: string;
    shippingZip: string;
  };
  items: Array<{
    sku: string;
    containerType: string;
    containerCondition: string;
    unitPrice: string;
    quantity: number;
    totalPrice: string;
    depotName: string;
    depotLocation: string;
  }>;
}

export class PDFInvoiceGenerator {
  private getLogoBase64(): string {
    try {
      const logoPath = path.join(process.cwd(), 'attached_assets', 'Container-Silouett.png');
      if (fs.existsSync(logoPath)) {
        const logoBuffer = fs.readFileSync(logoPath);
        return `data:image/png;base64,${logoBuffer.toString('base64')}`;
      }
    } catch (error) {
      console.warn('Logo file not found, using text logo');
    }
    return '';
  }

  private generateInvoiceHTML(data: InvoiceData): string {
    const logo = this.getLogoBase64();
    const formatDate = (date: Date) => new Date(date).toLocaleDateString('en-US');
    const formatCurrency = (amount: string) => `$${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice ${data.invoice.invoiceNumber}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            line-height: 1.4;
        }
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #001937;
            padding-bottom: 20px;
        }
        .logo-section {
            display: flex;
            align-items: center;
        }
        .logo {
            width: 80px;
            height: 80px;
            margin-right: 20px;
        }
        .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #001937;
            margin: 0;
        }
        .company-tagline {
            font-size: 14px;
            color: #42d1bd;
            margin: 5px 0 0 0;
        }
        .invoice-title {
            font-size: 36px;
            font-weight: bold;
            color: #001937;
            text-align: right;
        }
        .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
        }
        .bill-to, .invoice-info {
            width: 48%;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #001937;
            margin-bottom: 15px;
            border-bottom: 2px solid #42d1bd;
            padding-bottom: 5px;
        }
        .customer-info, .invoice-meta {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
        }
        .info-row {
            margin-bottom: 8px;
        }
        .label {
            font-weight: bold;
            color: #001937;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
        }
        .items-table th {
            background: #001937;
            color: white;
            padding: 15px 10px;
            text-align: left;
            font-weight: bold;
        }
        .items-table td {
            padding: 12px 10px;
            border-bottom: 1px solid #eee;
        }
        .items-table tr:nth-child(even) {
            background: #f8f9fa;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .totals-section {
            margin-top: 30px;
            display: flex;
            justify-content: flex-end;
        }
        .totals-table {
            width: 300px;
        }
        .totals-table td {
            padding: 8px 15px;
            border: none;
        }
        .totals-row {
            border-top: 1px solid #ddd;
        }
        .total-final {
            background: #001937;
            color: white;
            font-weight: bold;
            font-size: 18px;
        }
        .shipping-info {
            background: #e3f2fd;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
        }
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #001937;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
        .payment-status {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-paid {
            background: #4caf50;
            color: white;
        }
        .status-pending {
            background: #ff9800;
            color: white;
        }
        .notes-section {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <div class="logo-section">
                ${logo ? `<img src="${logo}" alt="Global Container Exchange" class="logo">` : ''}
                <div>
                    <h1 class="company-name">Global Container Exchange</h1>
                    <p class="company-tagline">Your Trusted Container Procurement Partner</p>
                </div>
            </div>
            <div class="invoice-title">INVOICE</div>
        </div>

        <div class="invoice-details">
            <div class="bill-to">
                <div class="section-title">Bill To</div>
                <div class="customer-info">
                    <div class="info-row">
                        <span class="label">${data.customer.company ? data.customer.company : 'Individual Customer'}</span>
                    </div>
                    <div class="info-row">
                        ${data.customer.firstName} ${data.customer.lastName}
                    </div>
                    <div class="info-row">${data.customer.email}</div>
                    ${data.customer.phone ? `<div class="info-row">${data.customer.phone}</div>` : ''}
                    <div class="info-row">${data.customer.billingAddress}</div>
                    <div class="info-row">${data.customer.billingCity}, ${data.customer.billingState} ${data.customer.billingZip}</div>
                </div>
            </div>

            <div class="invoice-info">
                <div class="section-title">Invoice Details</div>
                <div class="invoice-meta">
                    <div class="info-row">
                        <span class="label">Invoice #:</span> ${data.invoice.invoiceNumber}
                    </div>
                    <div class="info-row">
                        <span class="label">Order #:</span> ${data.order.orderNumber}
                    </div>
                    <div class="info-row">
                        <span class="label">Invoice Date:</span> ${formatDate(data.invoice.invoiceDate)}
                    </div>
                    <div class="info-row">
                        <span class="label">Due Date:</span> ${formatDate(data.invoice.dueDate)}
                    </div>
                    <div class="info-row">
                        <span class="label">Status:</span> 
                        <span class="payment-status status-${data.invoice.status}">${data.invoice.status}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="section-title">Container Details</div>
        <table class="items-table">
            <thead>
                <tr>
                    <th>SKU</th>
                    <th>Container Type</th>
                    <th>Condition</th>
                    <th>Depot Location</th>
                    <th class="text-center">Qty</th>
                    <th class="text-right">Unit Price</th>
                    <th class="text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                ${data.items.map(item => `
                    <tr>
                        <td>${item.sku}</td>
                        <td>${item.containerType}</td>
                        <td>${item.containerCondition}</td>
                        <td>${item.depotLocation}</td>
                        <td class="text-center">${item.quantity}</td>
                        <td class="text-right">${formatCurrency(item.unitPrice)}</td>
                        <td class="text-right">${formatCurrency(item.totalPrice)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="shipping-info">
            <div class="section-title">Shipping Information</div>
            <div class="info-row">
                <span class="label">Method:</span> ${data.order.shippingMethod.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                ${data.order.distanceMiles ? ` (${parseFloat(data.order.distanceMiles).toFixed(1)} miles)` : ''}
            </div>
            <div class="info-row">
                <span class="label">Door Direction:</span> ${data.order.doorDirection.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </div>
            ${data.order.expeditedDelivery ? '<div class="info-row"><span class="label">Expedited Delivery:</span> Yes (+$200)</div>' : ''}
            ${data.order.payOnDelivery ? '<div class="info-row"><span class="label">Payment:</span> Pay on Delivery</div>' : ''}
            ${data.customer.shippingAddress ? `
                <div class="info-row">
                    <span class="label">Ship To:</span> ${data.customer.shippingAddress}, ${data.customer.shippingCity}, ${data.customer.shippingState} ${data.customer.shippingZip}
                </div>
            ` : ''}
        </div>

        ${data.order.orderNote ? `
            <div class="notes-section">
                <div class="section-title">Order Notes</div>
                <p>${data.order.orderNote}</p>
            </div>
        ` : ''}

        <div class="totals-section">
            <table class="totals-table">
                <tr class="totals-row">
                    <td><strong>Subtotal:</strong></td>
                    <td class="text-right">${formatCurrency(data.invoice.subtotal)}</td>
                </tr>
                <tr class="totals-row">
                    <td><strong>Shipping:</strong></td>
                    <td class="text-right">${formatCurrency(data.invoice.shippingCost)}</td>
                </tr>
                ${parseFloat(data.invoice.expeditedFee) > 0 ? `
                    <tr class="totals-row">
                        <td><strong>Expedited Fee:</strong></td>
                        <td class="text-right">${formatCurrency(data.invoice.expeditedFee)}</td>
                    </tr>
                ` : ''}
                <tr class="totals-row total-final">
                    <td><strong>TOTAL:</strong></td>
                    <td class="text-right"><strong>${formatCurrency(data.invoice.totalAmount)}</strong></td>
                </tr>
            </table>
        </div>

        <div class="footer">
            <p><strong>Global Container Exchange</strong> | North America's Leading Container Procurement Platform</p>
            <p>Thank you for your business! For questions about this invoice, please contact our customer service team.</p>
            ${data.order.referralCode ? `<p>Referral Code: ${data.order.referralCode}</p>` : ''}
        </div>
    </div>
</body>
</html>`;
  }

  async generateInvoicePDF(invoiceData: InvoiceData): Promise<Buffer> {
    try {
      const html = this.generateInvoiceHTML(invoiceData);
      
      const options = {
        format: 'A4',
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        }
      };

      const file = { content: html };
      const pdfBuffer = await pdf.generatePdf(file, options);
      
      return pdfBuffer;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate invoice PDF');
    }
  }

  async saveInvoicePDF(invoiceData: InvoiceData, outputPath?: string): Promise<string> {
    try {
      const pdfBuffer = await this.generateInvoicePDF(invoiceData);
      
      const fileName = `invoice-${invoiceData.invoice.invoiceNumber}.pdf`;
      const filePath = outputPath || path.join(process.cwd(), 'invoices', fileName);
      
      // Ensure directory exists
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(filePath, pdfBuffer);
      
      return filePath;
    } catch (error) {
      console.error('Error saving PDF:', error);
      throw new Error('Failed to save invoice PDF');
    }
  }
}

export const pdfInvoiceGenerator = new PDFInvoiceGenerator();