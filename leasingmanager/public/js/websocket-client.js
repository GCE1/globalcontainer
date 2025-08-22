/**
 * WebSocket Client for Container Leasing Platform
 * Handles real-time updates for calendar events, invoice status, and per diem charges
 */

class WebSocketClient {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 5000; // 5 seconds
    this.eventCallbacks = {
      'per-diem-update': [],
      'invoice-update': [],
      'calendar-update': [],
      'connection': [],
      'error': []
    };
  }

  /**
   * Connect to the WebSocket server
   */
  connect() {
    if (this.socket && this.connected) {
      console.log('WebSocket already connected');
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    console.log(`Connecting to WebSocket at ${wsUrl}`);
    
    try {
      this.socket = new WebSocket(wsUrl);
      
      this.socket.onopen = () => {
        console.log('WebSocket connection established');
        this.connected = true;
        this.reconnectAttempts = 0;
        this._triggerCallbacks('connection', { status: 'connected' });
      };
      
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          
          // Trigger appropriate callbacks based on message type
          if (data.type && this.eventCallbacks[data.type]) {
            this._triggerCallbacks(data.type, data);
          }
        } catch (error) {
          console.error('Error handling WebSocket message:', error);
        }
      };
      
      this.socket.onclose = () => {
        console.log('WebSocket connection closed');
        this.connected = false;
        
        // Attempt to reconnect
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
          setTimeout(() => this.connect(), this.reconnectInterval);
        } else {
          console.error('Max reconnect attempts reached. Please refresh the page to reconnect.');
          this._triggerCallbacks('error', { 
            error: 'connection_lost',
            message: 'WebSocket connection lost. Please refresh the page.'
          });
        }
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this._triggerCallbacks('error', { 
          error: 'connection_error',
          message: 'WebSocket connection error'
        });
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this._triggerCallbacks('error', { 
        error: 'initialization_error',
        message: 'Failed to initialize WebSocket connection'
      });
    }
  }

  /**
   * Disconnect from the WebSocket server
   */
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.connected = false;
    }
  }

  /**
   * Subscribe to an event type
   * @param {string} eventType - The event type to subscribe to
   * @param {function} callback - The callback function to be called when the event occurs
   */
  subscribe(eventType, callback) {
    if (!this.eventCallbacks[eventType]) {
      this.eventCallbacks[eventType] = [];
    }
    
    this.eventCallbacks[eventType].push(callback);
    
    // If we're already connected, send a subscription message to the server
    if (this.connected && ['per-diem-update', 'invoice-update', 'calendar-update'].includes(eventType)) {
      this.sendMessage({
        type: 'subscribe',
        channel: eventType
      });
    }
    
    return this; // Allow chaining
  }

  /**
   * Unsubscribe from an event type
   * @param {string} eventType - The event type to unsubscribe from
   * @param {function} callback - The callback function to remove (if not provided, removes all)
   */
  unsubscribe(eventType, callback) {
    if (!this.eventCallbacks[eventType]) {
      return;
    }
    
    if (callback) {
      // Remove specific callback
      const index = this.eventCallbacks[eventType].indexOf(callback);
      if (index !== -1) {
        this.eventCallbacks[eventType].splice(index, 1);
      }
    } else {
      // Remove all callbacks for this event type
      this.eventCallbacks[eventType] = [];
    }
    
    return this; // Allow chaining
  }

  /**
   * Send a message to the WebSocket server
   * @param {object} data - The data to send
   */
  sendMessage(data) {
    if (!this.connected) {
      console.error('Cannot send message: WebSocket not connected');
      return false;
    }
    
    try {
      this.socket.send(JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      return false;
    }
  }

  /**
   * Trigger callbacks for an event type
   * @param {string} eventType - The event type
   * @param {object} data - The data to pass to the callbacks
   * @private
   */
  _triggerCallbacks(eventType, data) {
    if (!this.eventCallbacks[eventType]) {
      return;
    }
    
    this.eventCallbacks[eventType].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in ${eventType} callback:`, error);
      }
    });
  }
}

// Create a singleton instance
const wsClient = new WebSocketClient();

// Export the client
window.ContainerLeasingWS = wsClient;