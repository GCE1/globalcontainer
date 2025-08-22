import { db } from "./db";
import { wholesaleInvoices, wholesaleInvoiceItems } from "@shared/schema";

export async function addSampleWholesaleInvoices() {
  try {
    console.log("Adding sample wholesale invoice data...");

    // Create sample invoices
    const invoices = [
      {
        userId: "demo-user",
        invoiceNumber: "WS-2024-001",
        customerName: "Global Shipping Co.",
        customerEmail: "procurement@globalshipping.com",
        customerAddress: "123 Port Avenue, Long Beach, CA 90802",
        issueDate: new Date("2024-01-15"),
        dueDate: new Date("2024-02-14"),
        subtotal: "85000.00",
        taxAmount: "6800.00",
        totalAmount: "91800.00",
        status: "pending",
        paymentStatus: "unpaid",
        notes: "Bulk container purchase for Q1 expansion",
        terms: "Net 30 days payment terms"
      },
      {
        userId: "demo-user",
        invoiceNumber: "WS-2024-002",
        customerName: "Maritime Logistics Inc.",
        customerEmail: "orders@maritimelogistics.com",
        customerAddress: "456 Harbor Boulevard, Seattle, WA 98101",
        issueDate: new Date("2024-01-20"),
        dueDate: new Date("2024-02-19"),
        subtotal: "62500.00",
        taxAmount: "5000.00",
        totalAmount: "67500.00",
        status: "paid",
        paymentStatus: "paid",
        paymentDate: new Date("2024-01-25"),
        notes: "Refrigerated container order",
        terms: "Net 30 days payment terms"
      },
      {
        userId: "demo-user",
        invoiceNumber: "WS-2024-003",
        customerName: "Pacific Trade Corp.",
        customerEmail: "finance@pacifictrade.com",
        customerAddress: "789 Commerce Street, Oakland, CA 94607",
        issueDate: new Date("2024-01-25"),
        dueDate: new Date("2024-02-24"),
        subtotal: "124000.00",
        taxAmount: "9920.00",
        totalAmount: "133920.00",
        status: "overdue",
        paymentStatus: "unpaid",
        notes: "High cube container fleet expansion",
        terms: "Net 30 days payment terms"
      },
      {
        userId: "demo-user",
        invoiceNumber: "WS-2024-004",
        customerName: "Coastal Freight Solutions",
        customerEmail: "billing@coastalfreight.com",
        customerAddress: "321 Wharf Road, Miami, FL 33132",
        issueDate: new Date("2024-02-01"),
        dueDate: new Date("2024-03-02"),
        subtotal: "45000.00",
        taxAmount: "3600.00",
        totalAmount: "48600.00",
        status: "sent",
        paymentStatus: "unpaid",
        notes: "Standard container replacement order",
        terms: "Net 30 days payment terms"
      },
      {
        userId: "demo-user",
        invoiceNumber: "WS-2024-005",
        customerName: "International Container Leasing",
        customerEmail: "purchasing@iclease.com",
        customerAddress: "555 Industrial Park Drive, Houston, TX 77002",
        issueDate: new Date("2024-02-05"),
        dueDate: new Date("2024-03-07"),
        subtotal: "78000.00",
        taxAmount: "6240.00",
        totalAmount: "84240.00",
        status: "draft",
        paymentStatus: "unpaid",
        notes: "Open top container specialty order",
        terms: "Net 30 days payment terms"
      }
    ];

    // Insert invoices and get their IDs
    const createdInvoices = await db.insert(wholesaleInvoices).values(invoices).returning();
    console.log(`Created ${createdInvoices.length} sample invoices`);

    // Create sample invoice items
    const invoiceItems = [
      // Items for WS-2024-001
      {
        invoiceId: createdInvoices[0].id,
        description: "20' Dry Container - New Condition",
        quantity: 50,
        unitPrice: "1700.00",
        totalPrice: "85000.00",
        containerType: "20GP",
        containerCondition: "New"
      },
      
      // Items for WS-2024-002
      {
        invoiceId: createdInvoices[1].id,
        description: "40' Refrigerated Container - IICL Grade",
        quantity: 25,
        unitPrice: "2500.00",
        totalPrice: "62500.00",
        containerType: "40RF",
        containerCondition: "IICL"
      },
      
      // Items for WS-2024-003
      {
        invoiceId: createdInvoices[2].id,
        description: "40' High Cube Container - Cargo Worthy",
        quantity: 40,
        unitPrice: "2200.00",
        totalPrice: "88000.00",
        containerType: "40HC",
        containerCondition: "CW"
      },
      {
        invoiceId: createdInvoices[2].id,
        description: "45' High Cube Container - New Condition",
        quantity: 12,
        unitPrice: "3000.00",
        totalPrice: "36000.00",
        containerType: "45HC",
        containerCondition: "New"
      },
      
      // Items for WS-2024-004
      {
        invoiceId: createdInvoices[3].id,
        description: "20' Dry Container - Wind Water Tight",
        quantity: 30,
        unitPrice: "1500.00",
        totalPrice: "45000.00",
        containerType: "20GP",
        containerCondition: "WWT"
      },
      
      // Items for WS-2024-005
      {
        invoiceId: createdInvoices[4].id,
        description: "40' Open Top Container - Cargo Worthy",
        quantity: 20,
        unitPrice: "2400.00",
        totalPrice: "48000.00",
        containerType: "40OT",
        containerCondition: "CW"
      },
      {
        invoiceId: createdInvoices[4].id,
        description: "20' Open Top Container - IICL Grade",
        quantity: 15,
        unitPrice: "2000.00",
        totalPrice: "30000.00",
        containerType: "20OT",
        containerCondition: "IICL"
      }
    ];

    // Insert invoice items
    const createdItems = await db.insert(wholesaleInvoiceItems).values(invoiceItems).returning();
    console.log(`Created ${createdItems.length} sample invoice items`);

    console.log("✓ Sample wholesale invoice data added successfully");
    
    return {
      invoices: createdInvoices,
      items: createdItems
    };
  } catch (error) {
    console.error("Error adding sample wholesale invoices:", error);
    throw error;
  }
}