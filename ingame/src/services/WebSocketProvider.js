import React, { createContext, useState, useEffect, useCallback } from 'react';
import WebSocketService from './websocketService';

export const WebSocketContext = createContext(null);

const WebSocketProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [connectionState, setConnectionState] = useState('disconnected');

    const connectWebSocket = useCallback(async () => {
        try {
            await WebSocketService.ensureConnection();
            setIsConnected(true);
            setConnectionState('connected');
        } catch (error) {
            console.error('Failed to connect to WebSocket:', error);
            setIsConnected(false);
            setConnectionState('disconnected');
        }
    }, []);

    useEffect(() => {
        connectWebSocket();
    }, [connectWebSocket]);

    return (
        <WebSocketContext.Provider value={{ isConnected, connectionState, WebSocketService }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export default WebSocketProvider;