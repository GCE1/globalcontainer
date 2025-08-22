// Error handler for runtime errors and payment processing
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errors: Array<{
    message: string;
    timestamp: number;
    type: string;
    stack?: string;
  }> = [];

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  public logError(error: Error, type: string = 'runtime'): void {
    const errorInfo = {
      message: error.message,
      timestamp: Date.now(),
      type,
      stack: error.stack
    };
    
    this.errors.push(errorInfo);
    
    // Log to console for debugging
    console.error(`[${type.toUpperCase()}] ${error.message}`, error);
    
    // Handle MetaMask connection errors specifically
    if (error.message.includes('MetaMask') || error.message.includes('chrome-extension')) {
      this.handleMetaMaskError(error);
    }
  }

  private handleMetaMaskError(error: Error): void {
    console.warn('MetaMask connection failed - using fallback payment system');
    
    // Prevent MetaMask connection attempts by setting a flag
    if (typeof window !== 'undefined') {
      (window as any).metamaskDisabled = true;
    }
  }

  public getErrors(): Array<{message: string; timestamp: number; type: string}> {
    return this.errors;
  }

  public clearErrors(): void {
    this.errors = [];
  }

  public suppressError(message: string): void {
    // Add to suppressed errors list to prevent showing in UI
    if (typeof window !== 'undefined') {
      const suppressed = (window as any).suppressedErrors || [];
      suppressed.push(message);
      (window as any).suppressedErrors = suppressed;
    }
  }
}

// Global error handler setup
if (typeof window !== 'undefined') {
  const errorHandler = ErrorHandler.getInstance();
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason instanceof Error ? event.reason : new Error(event.reason);
    errorHandler.logError(error, 'unhandled-promise');
    
    // Prevent default handling for MetaMask errors
    if (error.message.includes('MetaMask') || error.message.includes('chrome-extension')) {
      event.preventDefault();
    }
  });
  
  // Handle runtime errors
  window.addEventListener('error', (event) => {
    errorHandler.logError(event.error, 'runtime');
  });
}

export default ErrorHandler;