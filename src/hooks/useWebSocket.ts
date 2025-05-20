import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { API_ENDPOINTS } from '../config/api';

interface UseWebSocketOptions<T> {
  reconnectAttempts?: number;
  reconnectInterval?: number;
  onMessage?: (data: T) => void;
  enabled?: boolean; // New option to control if WebSocket should connect
}

// Define valid channel names
export type WebSocketChannel = 'DASHBOARD_STATS' | 'TENDER_REQUESTS' | 'WEBSITE_ANALYTICS';

// Keep track of active connections
const activeConnections: { [key: string]: WebSocket } = {};

export const useWebSocket = <T = any>(channel: WebSocketChannel, options: UseWebSocketOptions<T> = {}) => {
  const {
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    onMessage,
    enabled = true // Default to true for backward compatibility
  } = options;

  const { token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const lastMessageTimeRef = useRef<number>(Date.now());
  const isUnmountedRef = useRef(false);

  const connect = useCallback(() => {
    try {
      // If WebSocket is disabled, don't connect
      if (!enabled) {
        return;
      }

      // If already connected or attempting to connect, don't create a new connection
      if (wsRef.current?.readyState === WebSocket.CONNECTING || 
          wsRef.current?.readyState === WebSocket.OPEN) {
        return;
      }

      // Check if there's an existing connection for this channel
      if (activeConnections[channel]) {
        wsRef.current = activeConnections[channel];
        setIsConnected(true);
        return;
      }

      // Get the correct WebSocket URL based on the channel
      const wsUrl = `${API_ENDPOINTS.WS[channel]}?channel=${channel}`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      activeConnections[channel] = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        reconnectCountRef.current = 0;
        lastMessageTimeRef.current = Date.now();

        // Send authentication if token exists
        if (token) {
          ws.send(JSON.stringify({ type: 'AUTH', token, channel }));
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          lastMessageTimeRef.current = Date.now();
          onMessage?.(data);
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      ws.onclose = (event) => {
        if (isUnmountedRef.current) return;

        setIsConnected(false);
        wsRef.current = null;
        delete activeConnections[channel];
        
        // Don't reconnect if unmounted, disabled, or max attempts reached
        if (!isUnmountedRef.current && enabled && reconnectCountRef.current < reconnectAttempts) {
          const timeout = Math.min(1000 * Math.pow(2, reconnectCountRef.current), 30000);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectCountRef.current++;
            connect();
          }, timeout);
        } else if (reconnectCountRef.current >= reconnectAttempts) {
          setError('Maximum reconnection attempts reached');
        }
      };

      ws.onerror = (event) => {
        console.error(`WebSocket error for ${channel}:`, event);
        setError('Connection error occurred');
      };

      // Set up ping interval
      const pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'PING', channel }));
        }
      }, 30000);

      // Set up connection health check
      const healthCheck = setInterval(() => {
        if (isUnmountedRef.current || !enabled) {
          clearInterval(healthCheck);
          return;
        }

        const now = Date.now();
        if (now - lastMessageTimeRef.current > 45000) {
          ws.close();
          clearInterval(healthCheck);
          clearInterval(pingInterval);
        }
      }, 45000);

      return () => {
        clearInterval(pingInterval);
        clearInterval(healthCheck);
      };
    } catch (err) {
      console.error('Failed to establish WebSocket connection:', err);
      setError('Failed to establish connection');
    }
  }, [channel, token, onMessage, reconnectAttempts, enabled]);

  useEffect(() => {
    isUnmountedRef.current = false;

    if (enabled) {
      connect();
    }

    return () => {
      isUnmountedRef.current = true;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      // Only close the connection if we're the last component using it
      if (wsRef.current) {
        const otherComponentsUsingChannel = Object.values(activeConnections).includes(wsRef.current);
        if (!otherComponentsUsingChannel) {
          wsRef.current.close();
          delete activeConnections[channel];
        }
        wsRef.current = null;
      }
    };
  }, [connect, enabled]);

  return { isConnected, error };
}; 