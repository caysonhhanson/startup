let socket = null;
let reconnectTimeout = null;
const listeners = new Map();

export const WebSocketClient = {
  // Initialize WebSocket connection
  connect() {
    if (socket) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname;
    socket = new WebSocket(`${protocol}//${host}/ws`);

    socket.onopen = () => {
      console.log('WebSocket connected');
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
      }
      notifyListeners('connection', { connected: true });
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
      notifyListeners('connection', { connected: false });
      socket = null;

      // Attempt to reconnect after 3 seconds
      reconnectTimeout = setTimeout(() => {
        WebSocketClient.connect();
      }, 3000);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      notifyListeners('error', { error });
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        notifyListeners(message.type, message.data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
  },

  // Disconnect WebSocket
  disconnect() {
    if (socket) {
      socket.close();
      socket = null;
    }
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
  },

  // Send message through WebSocket
  send(type, data) {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type, data }));
    } else {
      console.warn('WebSocket is not connected');
    }
  },

  // Add event listener
  on(type, callback) {
    if (!listeners.has(type)) {
      listeners.set(type, new Set());
    }
    listeners.get(type).add(callback);
  },

  // Remove event listener
  off(type, callback) {
    if (listeners.has(type)) {
      listeners.get(type).delete(callback);
      if (listeners.get(type).size === 0) {
        listeners.delete(type);
      }
    }
  },

  // Check if WebSocket is connected
  isConnected() {
    return socket && socket.readyState === WebSocket.OPEN;
  }
};

// Notify all listeners of a specific event type
function notifyListeners(type, data) {
  if (listeners.has(type)) {
    listeners.get(type).forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in WebSocket listener:', error);
      }
    });
  }
}