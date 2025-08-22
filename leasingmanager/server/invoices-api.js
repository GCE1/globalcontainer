const express = require('express');
const router = express.Router();
const { storage } = require('./storage');
const { createPaypalOrder, capturePaypalOrder } = require('./paypal');

/**
 * Get all invoices with filtering and pagination
 */
router.get('/api/invoices', async (req, res) => {
  try {
    const {
      status,
      containerId,
      dateFrom,
      dateTo,
      page = 1,
      limit = 10
    } = req.query;
    
    // Get all invoices from storage
    let invoices = await storage.getInvoices();
    
    // Apply filters
    if (status) {
      invoices = invoices.filter(invoice => invoice.status.toLowerCase() === status.toLowerCase());
    }
    
    if (containerId) {
      invoices = invoices.filter(invoice => invoice.containerId === containerId);
    }
    
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      invoices = invoices.filter(invoice => new Date(invoice.date) >= fromDate);
    }
    
    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      invoices = invoices.filter(invoice => new Date(invoice.date) <= toDate);
    }
    
    // Sort by date (newest first)
    invoices.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Calculate summary
    const summary = {
      total: invoices.length,
      paid: invoices.filter(invoice => invoice.status === 'paid').length,
      pending: invoices.filter(invoice => invoice.status === 'pending').length,
      overdue: invoices.filter(invoice => invoice.status === 'overdue').length,
      totalAmount: invoices.reduce((sum, invoice) => sum + invoice.amount, 0)
    };
    
    // Paginate results
    const totalItems = invoices.length;
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = parseInt(page, 10);
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + parseInt(limit, 10);
    
    const paginatedInvoices = invoices.slice(startIndex, endIndex);
    
    res.json({
      invoices: paginatedInvoices,
      summary,
      pagination: {
        currentPage,
        totalPages,
        itemsPerPage: parseInt(limit, 10),
        totalItems
      }
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

/**
 * Get invoice details by ID
 */
router.get('/api/invoices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await storage.getInvoice(id);
    
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    res.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

/**
 * Update invoice status
 */
router.put('/api/invoices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'paid', 'overdue', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    
    const updatedInvoice = await storage.updateInvoice(id, { status });
    
    if (!updatedInvoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    res.json(updatedInvoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ error: 'Failed to update invoice' });
  }
});

/**
 * Process payment for an invoice
 */
router.post('/api/invoices/:id/pay', async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMethod } = req.body;
    
    // Get the invoice
    const invoice = await storage.getInvoice(id);
    
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    if (invoice.status !== 'pending') {
      return res.status(400).json({ error: 'Invoice cannot be paid (not in pending status)' });
    }
    
    // Process payment based on payment method
    if (paymentMethod === 'paypal') {
      // Create PayPal order
      const paypalOrder = await createPaypalOrder({
        body: {
          intent: 'CAPTURE',
          amount: invoice.amount.toString(),
          currency: 'USD'
        }
      }, {
        status: (code) => ({ 
          json: (data) => data,
          statusCode: code
        })
      });
      
      // Update invoice with PayPal order ID
      await storage.updateInvoice(id, {
        paymentId: paypalOrder.id,
        paymentMethod: 'paypal'
      });
      
      // Return PayPal redirect URL
      const approveLink = paypalOrder.links.find(link => link.rel === 'approve');
      
      res.json({
        success: true,
        paymentId: paypalOrder.id,
        redirectUrl: approveLink ? approveLink.href : null
      });
    } else {
      return res.status(400).json({ error: 'Unsupported payment method' });
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

/**
 * Handle PayPal payment webhook
 */
router.post('/api/invoices/paypal-webhook', async (req, res) => {
  try {
    const { paymentId, invoiceId, event } = req.body;
    
    // Verify the payment with PayPal
    if (event === 'PAYMENT.CAPTURE.COMPLETED') {
      // Update invoice status to paid
      const updatedInvoice = await storage.updateInvoice(invoiceId, {
        status: 'paid',
        paymentId,
        paymentDate: new Date().toISOString()
      });
      
      res.json({ success: true, invoice: updatedInvoice });
    } else {
      // Handle other payment events
      res.json({ success: true, status: 'ignored' });
    }
  } catch (error) {
    console.error('Error handling PayPal webhook:', error);
    res.status(500).json({ error: 'Failed to process PayPal webhook' });
  }
});

/**
 * Get all containers (for filtering in the invoices page)
 */
router.get('/api/containers', async (req, res) => {
  try {
    const containers = await storage.getContainers();
    res.json(containers);
  } catch (error) {
    console.error('Error fetching containers:', error);
    res.status(500).json({ error: 'Failed to fetch containers' });
  }
});

module.exports = router;