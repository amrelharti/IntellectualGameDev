import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const WS_URL = 'http://localhost:8080/ws-quiz-game';
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 5000;

let stompClient = null;
let connectionState = 'disconnected';
let connectedCallback = null;
let errorCallback = null;
let reconnectTimeout = null;
let reconnectAttempts = 0;

const connect = (onConnected, onError) => {
    connectedCallback = onConnected;
    errorCallback = onError;

    if (connectionState === 'connected' || connectionState === 'connecting') {
        console.log(`Already ${connectionState}`);
        return;
    }

    connectionState = 'connecting';

    const socket = new SockJS(WS_URL);
    stompClient = Stomp.over(socket);

    stompClient.connect(
        {},
        frame => {
            console.log('Connected to WebSocket');
            connectionState = 'connected';
            reconnectAttempts = 0;
            if (connectedCallback) connectedCallback();
        },
        error => {
            console.error('WebSocket error', error);
            connectionState = 'error';
            if (errorCallback) errorCallback(new Error('WebSocket connection failed'));
            scheduleReconnect();
        }
    );
};

const disconnect = () => {
    if (stompClient && (connectionState === 'connected' || connectionState === 'connecting')) {
        stompClient.disconnect();
        stompClient = null;
        connectionState = 'disconnected';
    }
    if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
    }
    reconnectAttempts = 0;
};

const scheduleReconnect = () => {
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.error('Max reconnect attempts reached. Please check your connection.');
        return;
    }

    if (!reconnectTimeout) {
        reconnectTimeout = setTimeout(() => {
            reconnectTimeout = null;
            reconnectAttempts++;
            console.log(`Attempting to reconnect... (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
            connect(connectedCallback, errorCallback);
        }, RECONNECT_DELAY);
    }
};

const subscribe = (destination, callback) => {
    if (!stompClient || connectionState !== 'connected') {
        console.error('Cannot subscribe, no connection');
        return null;
    }
    return stompClient.subscribe(destination, message => {
        try {
            const payload = JSON.parse(message.body);
            callback(payload);
        } catch (error) {
            console.error('Error parsing message', error);
        }
    });
};

const sendMessage = (destination, body) => {
    if (!stompClient || connectionState !== 'connected') {
        console.error('Cannot send message, no connection');
        return false;
    }
    stompClient.send(destination, {}, JSON.stringify(body));
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