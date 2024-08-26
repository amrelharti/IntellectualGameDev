import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const WS_URL = 'http://localhost:8080/ws-quiz-game';
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 5000;

let stompClient = null;
let connectionState = 'disconnected';
let connectedCallback = null;
let errorCallback = null;
const subscriptions = {};

const connect = (onConnected, onError) => {
    if (connectionState === 'connected' || connectionState === 'connecting') {
        console.log(`Already ${connectionState}`);
        return;
    }

    connectionState = 'connecting';
    connectedCallback = onConnected;
    errorCallback = onError;

    stompClient = new Client({
        webSocketFactory: () => new SockJS(WS_URL),
        connectHeaders: {},
        reconnectDelay: RECONNECT_DELAY,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000
    });

    stompClient.onConnect = (frame) => {
        console.log('Connected to WebSocket');
        connectionState = 'connected';
        if (connectedCallback) connectedCallback(frame);
    };

    stompClient.onStompError = (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        connectionState = 'error';
        if (errorCallback) errorCallback(new Error('WebSocket connection failed'));
        // Attempt to reconnect
        setTimeout(() => {
            console.log('Attempting to reconnect...');
            connect(onConnected, onError);
        }, RECONNECT_DELAY);
    };

    stompClient.activate();
};

const disconnect = () => {
    if (stompClient) {
        stompClient.deactivate();
        stompClient = null;
        connectionState = 'disconnected';
    }
    Object.keys(subscriptions).forEach(unsubscribe);
};

const subscribe = (destination, callback) => {
    if (!stompClient || connectionState !== 'connected') {
        console.error('Cannot subscribe, no connection');
        return null;
    }
    const subscription = stompClient.subscribe(destination, message => {
        try {
            const payload = JSON.parse(message.body);
            callback(payload);
        } catch (error) {
            console.error('Error parsing message', error);
        }
    });
    subscriptions[destination] = subscription;
    return subscription;
};

const unsubscribe = (destination) => {
    if (subscriptions[destination]) {
        subscriptions[destination].unsubscribe();
        delete subscriptions[destination];
    }
};

const ensureConnection = () => {
    return new Promise((resolve, reject) => {
        if (connectionState === 'connected') {
            resolve();
        } else {
            connect(resolve, reject);
        }
    });
};

const sendMessage = (destination, body) => {
    return new Promise((resolve, reject) => {
        console.log('Sending message to:', destination, 'Body:', body);
        if (!stompClient || connectionState !== 'connected') {
            console.log('Not connected, attempting to connect...');
            connect(() => {
                console.log('Connected, retrying sendMessage');
                sendMessage(destination, body).then(resolve).catch(reject);
            }, reject);
            return;
        }

        const correlationId = Date.now().toString();
        const replyTo = `/user/queue/responses`;

        const subscription = stompClient.subscribe(replyTo, (message) => {
            subscription.unsubscribe();
            try {
                const response = JSON.parse(message.body);
                console.log('Received response:', response);
                resolve(response);
            } catch (error) {
                console.error('Error parsing response:', error);
                reject(new Error('Invalid response from server'));
            }
        });

        stompClient.publish({
            destination: destination,
            body: body,
            headers: {
                'content-type': 'application/json',
                'reply-to': '/user/queue/game.joined'
            }
        });
        console.log('Message sent, waiting for response...');
    });
};

const autoJoinGame = (playerId) => {
    return new Promise((resolve, reject) => {
        console.log(`AutoJoinGame called with playerId: ${playerId}`);

        if (stompClient && stompClient.connected) {
            const destination = '/app/game.autoJoin';
            const body = JSON.stringify({ playerId });

            console.log(`Sending message to: ${destination} Body: ${body}`);

            const subscriptionId = stompClient.subscribe('/user/queue/responses', (message) => {
                console.log('Received message on /user/queue/responses:', message);
                stompClient.unsubscribe(subscriptionId);

                try {
                    const response = JSON.parse(message.body);
                    console.log('Parsed response:', response);
                    if (response.gameId) {
                        resolve(response);
                    } else {
                        reject(new Error(response.message || 'Failed to auto-join game'));
                    }
                } catch (error) {
                    console.error('Error parsing auto-join response:', error);
                    reject(error);
                }
            });

            stompClient.publish({
                destination: destination,
                body: body,
                headers: { 'content-type': 'application/json' }
            });

            console.log('Message sent, waiting for response...');
        } else {
            reject(new Error('STOMP client is not connected'));
        }
    });
};

const joinLobby = (lobbyId, playerId) => {
    return sendMessage('/app/game.addPlayer', { gameId: lobbyId, playerId: playerId })
        .then(response => {
            if (response.error) {
                throw new Error(response.error);
            }
            return response;
        });
};

const startLobby = (lobbyId) => {
    return sendMessage('/app/lobby.start', { lobbyId });
};

const getPlayerName = async (playerId) => {
    return new Promise((resolve, reject) => {
        const destination = '/app/getPlayerName';
        const body = JSON.stringify({ playerId: playerId });

        const subscription = stompClient.subscribe('/user/queue/playerName', (message) => {
            subscription.unsubscribe();
            try {
                const response = JSON.parse(message.body);
                resolve(response.username); // Ensure the server returns { username: "playerName" }
            } catch (error) {
                console.error('Error parsing player name response:', error);
                reject(error);
            }
        });

        stompClient.publish({
            destination: destination,
            body: body,
            headers: { 'content-type': 'application/json' }
        });
    });
};

const WebSocketService = {
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    sendMessage,
    getConnectionState: () => connectionState,
    createLobby: (playerId) => sendMessage('/app/game.create', { playerId }),
    joinLobby: (lobbyId, playerId) => sendMessage('/app/game.join', { lobbyId, playerId }),
    markPlayerReady: (lobbyId, playerId) => sendMessage('/app/lobby.ready', { lobbyId, playerId }),
    autoJoinGame,
    getPlayerName,
    ensureConnection,
    startLobby
};

export default WebSocketService;
