import { Client } from '@stomp/stompjs';

const WS_URL ='ws://localhost:8080/ws-quiz-game';

let client = null;
let connectionState = 'disconnected';
let connectedCallback = null;
let errorCallback = null;
let reconnectTimeout = null;

const connect = (onConnected, onError) => {
    connectedCallback = onConnected;
    errorCallback = onError;

    if (connectionState === 'connected' || connectionState === 'connecting') {
        console.log(`Already ${connectionState}`);
        return;
    }

    connectionState = 'connecting';

    client = new Client({
        brokerURL: WS_URL,
        connectHeaders: {},
        debug: (str) => {
            console.log('STOMP debug', str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
        console.log('Connected to WebSocket');
        connectionState = 'connected';
        if (connectedCallback) connectedCallback();
    };

    client.onStompError = (frame) => {
        console.error('STOMP error', frame);
        connectionState = 'error';
        if (errorCallback) errorCallback(new Error(`STOMP error: ${frame.headers.message}`));
    };

    client.onWebSocketError = (event) => {
        console.error('WebSocket error', event);
        connectionState = 'error';
        if (errorCallback) errorCallback(new Error('WebSocket connection failed'));
    };

    client.onWebSocketClose = (event) => {
        console.log('WebSocket connection closed', event);
        connectionState = 'disconnected';
        scheduleReconnect();
    };

    try {
        client.activate();
    } catch (error) {
        console.error('Error activating STOMP client', error);
        connectionState = 'error';
        if (errorCallback) errorCallback(error);
        scheduleReconnect();
    }
};

const disconnect = () => {
    if (client && (connectionState === 'connected' || connectionState === 'connecting')) {
        client.deactivate();
        client = null;
        connectionState = 'disconnected';
    }
    if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
    }
};

const scheduleReconnect = () => {
    if (!reconnectTimeout) {
        reconnectTimeout = setTimeout(() => {
            reconnectTimeout = null;
            console.log('Attempting to reconnect...');
            connect(connectedCallback, errorCallback);
        }, 5000);
    }
};

const subscribe = (destination, callback) => {
    if (!client || connectionState !== 'connected') {
        console.error('Cannot subscribe, no connection');
        return null;
    }
    return client.subscribe(destination, (message) => {
        try {
            const payload = JSON.parse(message.body);
            callback(payload);
        } catch (error) {
            console.error('Error parsing message', error);
        }
    });
};

const sendMessage = (destination, body) => {
    if (!client || connectionState !== 'connected') {
        console.error('Cannot send message, no connection');
        return false;
    }
    client.publish({ destination, body: JSON.stringify(body) });
    return true;
};

const getConnectionState = () => connectionState;

export default {
    connect,
    disconnect,
    subscribe,
    sendMessage,
    getConnectionState,
};