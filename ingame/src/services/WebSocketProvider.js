import React, { useEffect, useState } from 'react';
import WebSocketService from '../services/websocketService';

export const WebSocketContext = React.createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const connectWebSocket = async () => {
            try {
                await WebSocketService.ensureConnection();
                setIsConnected(true);
                console.log('Connected to WebSocket');
            } catch (error) {
                console.error('WebSocket connection error:', error);
                setIsConnected(false);
            }
        };

        connectWebSocket();

        return () => {
            WebSocketService.disconnect();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{ isConnected, WebSocketService }}>
            {children}
        </WebSocketContext.Provider>
    );
};