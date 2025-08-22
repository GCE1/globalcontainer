// Session management utility for environments where cookies are disabled
export class SessionManager {
  private static readonly SESSION_KEY = 'gce-session-id';
  private static readonly CART_KEY = 'gce-cart-items';
  
  // Generate a unique session ID
  static generateSessionId(): string {
    return 'sess_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }
  
  // Get current session ID from localStorage
  static getSessionId(): string {
    let sessionId = localStorage.getItem(this.SESSION_KEY);
    if (!sessionId) {
      sessionId = this.generateSessionId();
      localStorage.setItem(this.SESSION_KEY, sessionId);
      console.log('Generated new session ID:', sessionId);
    }
    return sessionId;
  }
  
  // Store cart items locally
  static setCartItems(items: any[]): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(items));
    console.log('Stored cart items locally:', items.length);
  }
  
  // Get cart items from localStorage
  static getCartItems(): any[] {
    try {
      const items = localStorage.getItem(this.CART_KEY);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Error parsing cart items:', error);
      return [];
    }
  }
  
  // Add item to cart
  static addCartItem(item: any): any[] {
    const items = this.getCartItems();
    const newItem = {
      ...item,
      id: Date.now(), // Simple ID generation
      userId: this.getSessionId(),
      createdAt: new Date().toISOString()
    };
    items.push(newItem);
    this.setCartItems(items);
    return items;
  }
  
  // Clear cart
  static clearCart(): void {
    localStorage.removeItem(this.CART_KEY);
    console.log('Cart cleared from localStorage');
  }
  
  // Check if cookies are available
  static areCookiesEnabled(): boolean {
    return navigator.cookieEnabled && document.cookie !== undefined;
  }
  
  // Get session info for debugging
  static getSessionInfo() {
    return {
      sessionId: this.getSessionId(),
      cartItemCount: this.getCartItems().length,
      cookiesEnabled: this.areCookiesEnabled(),
      storageAvailable: typeof(Storage) !== "undefined"
    };
  }
}