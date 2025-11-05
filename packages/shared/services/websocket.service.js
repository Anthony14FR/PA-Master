import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

if (typeof window !== 'undefined') {
  window.Pusher = Pusher;
}

class WebSocketService {
  constructor() {
    this.echo = null;
    this.isConnected = false;
    this.channels = new Map();
    this.listeners = new Map();
  }

  /**
   * Connect to the WebSocket server
   * @param {string} token - JWT token for authentication
   */
  connect(token) {
    if (typeof window === 'undefined') {
      return null;
    }

    if (this.echo) {
      return this.echo;
    }

    const reverbConfig = {
      broadcaster: 'reverb',
      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || 'yy72ove9gjqwhugrgkp7',
      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || 'localhost',
      wsPort: process.env.NEXT_PUBLIC_REVERB_PORT || 8080,
      wssPort: process.env.NEXT_PUBLIC_REVERB_PORT || 8080,
      forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME || 'http') === 'https',
      enabledTransports: ['ws', 'wss'],
      authEndpoint: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      },
    };

    this.echo = new Echo(reverbConfig);
    this.isConnected = true;

    return this.echo;
  }

  /**
   * Disconnect from the WebSocket server
   */
  disconnect() {
    if (this.echo) {
      this.echo.disconnect();
      this.echo = null;
      this.isConnected = false;
      this.channels.clear();
      this.listeners.clear();
    }
  }

  /**
   * Subscribe to a private channel
   * @param {string} channelName - Channel name (e.g., 'conversation.123', 'notifications.456')
   * @param {Object} events - Object mapping event names to callback functions
   * @param {string} listenerId - Unique identifier for this listener
   * @returns {Object|null} The channel object or null
   *
   * @example
   * websocketService.subscribe('conversation.123', {
   *   'message.sent': (event) => console.log(event),
   *   'booking.created': (event) => console.log(event)
   * }, 'my-listener');
   */
  subscribe(channelName, events = {}, listenerId = 'default') {
    if (!this.echo) {
      return null;
    }

    if (!this.channels.has(channelName)) {
      const channel = this.echo.private(channelName);
      this.channels.set(channelName, channel);
      this.listeners.set(channelName, new Map());

      Object.entries(events).forEach(([eventName, callback]) => {
        channel.listen(`.${eventName}`, (event) => {
          const listeners = this.listeners.get(channelName);
          if (listeners) {
            listeners.forEach((listenerEvents) => {
              if (listenerEvents[eventName]) {
                listenerEvents[eventName](event);
              }
            });
          }
        });
      });
    } else {
      const channel = this.channels.get(channelName);
      const existingListeners = this.listeners.get(channelName);

      Object.entries(events).forEach(([eventName, callback]) => {
        let eventExists = false;
        existingListeners.forEach((listenerEvents) => {
          if (listenerEvents[eventName]) {
            eventExists = true;
          }
        });

        if (!eventExists) {
          channel.listen(`.${eventName}`, (event) => {
            const listeners = this.listeners.get(channelName);
            if (listeners) {
              listeners.forEach((listenerEvents) => {
                if (listenerEvents[eventName]) {
                  listenerEvents[eventName](event);
                }
              });
            }
          });
        }
      });
    }

    const channelListeners = this.listeners.get(channelName);
    if (channelListeners) {
      channelListeners.set(listenerId, events);
    }

    return this.channels.get(channelName);
  }

  /**
   * Unsubscribe from a private channel
   * @param {string} channelName - Channel name
   * @param {string} listenerId - Listener identifier
   */
  unsubscribe(channelName, listenerId = 'default') {
    if (!this.echo) return;

    const channelListeners = this.listeners.get(channelName);

    if (channelListeners) {
      channelListeners.delete(listenerId);

      if (channelListeners.size === 0) {
        this.echo.leave(channelName);
        this.channels.delete(channelName);
        this.listeners.delete(channelName);
      }
    }
  }

  /**
   * Get the connection state
   * @returns {boolean}
   */
  getConnectionState() {
    return this.isConnected;
  }

  // ============================================
  // Convenience methods for specific channels
  // ============================================

  /**
   * Subscribe to conversation events
   * @param {string} conversationId - Conversation ID
   * @param {Object} callbacks - Event callbacks
   * @param {string} listenerId - Listener ID
   */
  joinConversation(conversationId, callbacks = {}, listenerId = 'default') {
    const events = {};
    if (callbacks.onMessageSent) events['message.sent'] = callbacks.onMessageSent;
    if (callbacks.onBookingCreated) events['booking.created'] = callbacks.onBookingCreated;
    if (callbacks.onBookingCompleted) events['booking.completed'] = callbacks.onBookingCompleted;

    return this.subscribe(`conversation.${conversationId}`, events, listenerId);
  }

  /**
   * Unsubscribe from conversation events
   * @param {string} conversationId - Conversation ID
   * @param {string} listenerId - Listener ID
   */
  leaveConversation(conversationId, listenerId = 'default') {
    return this.unsubscribe(`conversation.${conversationId}`, listenerId);
  }
}

export const websocketService = new WebSocketService();
