// Import storage and paypal
const { storage } = require('./storage');
// Import paypal as an ES module
const paypal = require('./paypal');

// Status calculations
const CONTAINER_STATUS = {
  AVAILABLE: 'available',
  LEASED: 'leased',
  FREE_DAYS: 'free-days',
  PER_DIEM: 'per-diem'
};

/**
 * Calculate container status based on lease dates and free days
 */
function calculateContainerStatus(contract, today = new Date()) {
  if (!contract) {
    return CONTAINER_STATUS.AVAILABLE;
  }

  const leaseStartDate = new Date(contract.startDate);
  const leaseEndDate = contract.endDate ? new Date(contract.endDate) : null;

  // If the contract has an end date and it's in the past, container is available
  if (leaseEndDate && leaseEndDate < today) {
    return CONTAINER_STATUS.AVAILABLE;
  }

  // Calculate free days end date
  const freeDaysEndDate = new Date(leaseStartDate);
  freeDaysEndDate.setDate(leaseStartDate.getDate() + contract.freeDays);

  // If today is before free days end, it's in the free days period
  if (today < freeDaysEndDate) {
    return CONTAINER_STATUS.FREE_DAYS;
  }

  // If today is after free days end, it's in the per diem period
  return CONTAINER_STATUS.PER_DIEM;
}

/**
 * Calculate number of days in per diem period
 */
function calculatePerDiemDays(contract, today = new Date()) {
  if (!contract) return 0;

  const leaseStartDate = new Date(contract.startDate);
  
  // Calculate free days end date
  const freeDaysEndDate = new Date(leaseStartDate);
  freeDaysEndDate.setDate(leaseStartDate.getDate() + contract.freeDays);

  // If today is before free days end, no per diem days
  if (today <= freeDaysEndDate) return 0;

  // Calculate days between free days end and today
  const diffTime = Math.abs(today - freeDaysEndDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculate total per diem charges
 */
function calculatePerDiemTotal(perDiemRate, perDiemDays) {
  // Remove currency symbol and parse as float
  const rate = parseFloat(perDiemRate.replace(/[^0-9.]/g, ''));
  return (rate * perDiemDays).toFixed(2);
}

/**
 * Generate calendar events for containers
 */
async function generateCalendarEvents(filters = {}, startDate, endDate) {
  try {
    // Get all active contracts with their containers
    const contracts = await storage.getContracts();
    
    // Filter contracts based on criteria
    const filteredContracts = contracts.filter(contract => {
      // Apply origin filter
      if (filters.origin && contract.container.origin !== filters.origin) {
        return false;
      }
      
      // Apply destination filter
      if (filters.destination && contract.container.destination !== filters.destination) {
        return false;
      }
      
      // Apply container size filter
      if (filters.containerSize && contract.container.size !== filters.containerSize) {
        return false;
      }
      
      // Apply status filter
      if (filters.status) {
        const status = calculateContainerStatus(contract);
        if (status !== filters.status) {
          return false;
        }
      }
      
      return true;
    });
    
    // Generate events based on contracts
    const events = [];
    const today = new Date();
    
    // Process each contract
    for (const contract of filteredContracts) {
      const container = contract.container;
      const leaseStartDate = new Date(contract.startDate);
      
      // Calculate free days end date
      const freeDaysEndDate = new Date(leaseStartDate);
      freeDaysEndDate.setDate(leaseStartDate.getDate() + contract.freeDays);
      
      // Calculate container status
      const status = calculateContainerStatus(contract);
      
      // Base event props shared by all events
      const baseEventProps = {
        containerId: container.id,
        origin: container.origin,
        destination: container.destination,
        containerSize: container.size,
        leaseStart: leaseStartDate,
        freeDaysEnd: freeDaysEndDate,
        perDiemRate: `$${contract.perDiemRate.toFixed(2)}`,
        status: status
      };
      
      // Generate different events based on status
      if (status === CONTAINER_STATUS.FREE_DAYS) {
        // Event for free days period
        events.push({
          title: `${container.id} - Free Days`,
          start: leaseStartDate,
          end: freeDaysEndDate,
          classNames: ['free-days'],
          color: '#2196f3',
          extendedProps: baseEventProps
        });
      } else if (status === CONTAINER_STATUS.PER_DIEM) {
        // Event for the free days period (past)
        events.push({
          title: `${container.id} - Free Days`,
          start: leaseStartDate,
          end: freeDaysEndDate,
          classNames: ['free-days'],
          color: '#2196f3',
          extendedProps: baseEventProps
        });
        
        // Calculate per diem info
        const perDiemDays = calculatePerDiemDays(contract);
        const perDiemTotal = calculatePerDiemTotal(baseEventProps.perDiemRate, perDiemDays);
        
        // Calculate next billing date (tomorrow)
        const nextBillingDate = new Date(today);
        nextBillingDate.setDate(today.getDate() + 1);
        
        // Event for the per diem period (current and future)
        events.push({
          title: `${container.id} - Per Diem ($${perDiemTotal})`,
          start: freeDaysEndDate,
          end: endDate,
          classNames: ['per-diem'],
          color: '#ff9800',
          extendedProps: {
            ...baseEventProps,
            perDiemDays: perDiemDays,
            perDiemTotal: `$${perDiemTotal}`,
            nextBillingDate: nextBillingDate
          }
        });
      } else if (status === CONTAINER_STATUS.AVAILABLE) {
        // Event for available containers
        events.push({
          title: `${container.id} - Available`,
          start: today,
          end: endDate,
          classNames: ['available'],
          color: '#4caf50',
          extendedProps: baseEventProps
        });
      }
    }
    
    return events;
  } catch (error) {
    console.error('Error generating calendar events:', error);
    throw error;
  }
}

/**
 * Generate invoice for per diem charges and process PayPal payment
 */
async function generatePerDiemInvoice(contract) {
  try {
    const today = new Date();
    
    // Only generate invoices for contracts in per diem period
    const status = calculateContainerStatus(contract, today);
    if (status !== CONTAINER_STATUS.PER_DIEM) {
      console.log(`Contract ${contract.id} is not in per diem period, skipping invoice generation`);
      return null;
    }
    
    // Calculate per diem days and total
    const perDiemDays = calculatePerDiemDays(contract, today);
    const perDiemTotal = calculatePerDiemTotal(`$${contract.perDiemRate.toFixed(2)}`, 1); // Daily charge
    
    // Create invoice record
    const invoice = {
      userId: contract.userId,
      contractId: contract.id,
      containerId: contract.containerId,
      amount: parseFloat(perDiemTotal),
      status: 'pending',
      dueDate: new Date(today.getTime() + (24 * 60 * 60 * 1000)), // Due tomorrow
      description: `Per diem charge for container ${contract.containerId} - Day ${perDiemDays}`,
      items: [
        {
          description: `Per diem charge - Day ${perDiemDays}`,
          quantity: 1,
          price: contract.perDiemRate,
          total: parseFloat(perDiemTotal)
        }
      ]
    };
    
    // Save invoice to database
    const createdInvoice = await storage.createInvoice(invoice);
    
    // Process PayPal payment if auto-billing is enabled for this contract
    if (contract.autoBilling) {
      // Create PayPal order
      const paypalOrder = await paypal.createPaypalOrder({
        body: {
          intent: 'CAPTURE',
          amount: parseFloat(perDiemTotal),
          currency: 'USD'
        }
      }, {
        status: (code) => ({ 
          json: (data) => data,
          statusCode: code
        })
      });
      
      // Update invoice with PayPal order ID
      await storage.updateInvoice(createdInvoice.id, {
        paymentId: paypalOrder.id,
        paymentMethod: 'paypal'
      });
    }
    
    return createdInvoice;
  } catch (error) {
    console.error('Error generating per diem invoice:', error);
    throw error;
  }
}

/**
 * Process daily per diem charges for all contracts
 */
async function processDailyPerDiemCharges() {
  try {
    console.log('Processing daily per diem charges');
    
    // Get all active contracts
    const contracts = await storage.getContracts();
    
    // Filter for contracts in per diem period
    const perDiemContracts = contracts.filter(contract => 
      calculateContainerStatus(contract) === CONTAINER_STATUS.PER_DIEM
    );
    
    console.log(`Found ${perDiemContracts.length} contracts in per diem period`);
    
    // Generate invoices and process payments for each contract
    const results = await Promise.all(
      perDiemContracts.map(contract => generatePerDiemInvoice(contract))
    );
    
    console.log(`Successfully processed ${results.filter(Boolean).length} per diem charges`);
    return results.filter(Boolean);
  } catch (error) {
    console.error('Error processing daily per diem charges:', error);
    throw error;
  }
}

module.exports = {
  CONTAINER_STATUS,
  calculateContainerStatus,
  calculatePerDiemDays,
  calculatePerDiemTotal,
  generateCalendarEvents,
  generatePerDiemInvoice,
  processDailyPerDiemCharges
};