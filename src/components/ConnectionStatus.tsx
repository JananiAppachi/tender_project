import { useEffect, useRef } from 'react';
import { useToast } from '../hooks/useToast';

interface ConnectionStatusProps {
  isConnected: boolean;
  error: string | null;
}

export const ConnectionStatus = ({ isConnected, error }: ConnectionStatusProps) => {
  const { toast } = useToast();
  const hasShownConnectedMessage = useRef(false);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const previousConnectionState = useRef(isConnected);

  useEffect(() => {
    // Clear any existing timeout
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    // Only show messages if the connection state has changed
    if (previousConnectionState.current !== isConnected) {
      toastTimeoutRef.current = setTimeout(() => {
        if (!isConnected && error) {
          toast({
            title: 'Connection Lost',
            description: error,
            type: 'error'
          });
        } else if (isConnected && !hasShownConnectedMessage.current) {
          toast({
            title: 'Connected',
            description: 'Successfully connected to server',
            type: 'success'
          });
          hasShownConnectedMessage.current = true;
        }
      }, 2000); // Wait 2 seconds before showing any connection message
    }

    // Update previous connection state
    previousConnectionState.current = isConnected;

    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, [isConnected, error, toast]);

  // Reset the connected message flag when the component unmounts
  useEffect(() => {
    return () => {
      hasShownConnectedMessage.current = false;
    };
  }, []);

  return null;
}; 