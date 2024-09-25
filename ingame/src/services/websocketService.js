import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const WS_URL = 'http://localhost:8080/ws-quiz-game';
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 5000;

let stompClient = null;
let connectionState = 'disconnected';
let connectedCallback = null;
let errorCallback = null;
let reconnectAttempts = 0;
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
        reconnectDelay: 0,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000
    });

    stompClient.onConnect = (frame) => {
        console.log('Connected to WebSocket');
        connectionState = 'connected';
        reconnectAttempts = 0;
        if (connectedCallback) connectedCallback(frame);
    };

    stompClient.onStompError = (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        connectionState = 'error';
        if (errorCallback) errorCallback(new Error('WebSocket connection failed'));

        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttempts++;
            setTimeout(() => {
                console.log('Attempting to reconnect...');
                connect(onConnected, onError);
            }, RECONNECT_DELAY);
        } else {
            console.error('Max reconnect attempts reached');
        }
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
            connect(() => resolve(), reject);
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
            body: JSON.stringify(body),
            headers: {
                'content-type': 'application/json',
                'reply-to': replyTo
            }
        });
        console.log('Message sent, waiting for response...');
    });
};

const autoJoinGame = (playerId) => {
    return new Promise((resolve, reject) => {
        if (stompClient && connectionState === 'connected') {
            const destination = '/app/game.autoJoin';
            const body = JSON.stringify({ playerId });

            const subscription = stompClient.subscribe('/user/queue/responses', (message) => {
                subscription.unsubscribe();

                try {
                    const response = JSON.parse(message.body);
                    if (response.gameId) {
                        // Ensure the gameState is set to WAITING_FOR_PLAYERS
                        response.gameState = 'WAITING_FOR_PLAYERS';
                        resolve(response);
                    } else {
                        reject(new Error(response.message || 'Failed to auto-join game'));
                    }
                } catch (error) {
                    reject(error);
                }
            });

            stompClient.publish({
                destination: destination,
                body: body,
                headers: { 'content-type': 'application/json' }
            });
        } else {
            reject(new Error('STOMP client is not connected'));
        }
    });
};

const markPlayerReady = (gameId, playerId) => {
    return new Promise((resolve, reject) => {
        if (stompClient && connectionState === 'connected') {
            const destination = '/app/game.playerReady';
            const body = JSON.stringify({ gameId, playerId });

            stompClient.publish({
                destination: destination,
                body: body,
                headers: { 'content-type': 'application/json' }
            });

            resolve();
        } else {
            reject(new Error('STOMP client is not connected'));
        }
    });
};

const startGame = (gameId) => {
    return new Promise((resolve, reject) => {
        if (stompClient && connectionState === 'connected') {
            const destination = '/app/game.start';
            const body = JSON.stringify({ gameId });

            stompClient.publish({
                destination: destination,
                body: body,
                headers: { 'content-type': 'application/json' }
            });

            resolve();
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

const startLobby = async (lobbyId) => {
    try {
        await sendMessage('/app/lobby.start', { lobbyId });
        console.log('Lobby start message sent successfully');
    } catch (error) {
        console.error('Error sending start lobby message:', error);
        throw error;
    }
};

const getPlayerName = async (playerId) => {
    return new Promise((resolve, reject) => {
        const destination = '/app/getPlayerName';
        const body = JSON.stringify({ playerId });

        const subscription = stompClient.subscribe('/user/queue/playerName', (message) => {
            subscription.unsubscribe();
            try {
                const response = JSON.parse(message.body);
                resolve(response.username);
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

const subscribeToGameUpdates = (gameId, callback) => {
    const destination = `/topic/game.${gameId}.update`;
    return subscribe(destination, (message) => {
        try {
            const payload = JSON.parse(message.body);
            callback(payload.gameState);
        } catch (error) {
            console.error('Error parsing game update message', error);
        }
    });
};

const unsubscribeFromGameUpdates = (gameId) => {
    const destination = `/topic/game.${gameId}.update`;
    unsubscribe(destination);
};




const WebSocketService = {
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    sendMessage,
    getConnectionState: () => connectionState,
    createLobby: (playerId) => sendMessage('/app/game.create', { playerId }),
    joinLobby,
    autoJoinGame,
    getPlayerName,
    ensureConnection,
    startLobby,
    subscribeToGameUpdates,
    unsubscribeFromGameUpdates,
    markPlayerReady,
    startGame: async (gameId) => {
        return sendMessage('/app/game.start', { gameId });
    },
    chooseSubject: (gameId, playerId, subject) =>
        sendMessage('/app/game.chooseSubject', { gameId, playerId, subject }),
    requestQuestion: (gameId, playerId) =>
        sendMessage('/app/game.requestQuestion', { gameId, playerId }),

    endTurn: (gameId) =>
        sendMessage('/app/game.endTurn', { gameId }),
    createSinglePlayerGame: (playerId) =>
        sendMessage('/app/game.createSinglePlayer', { playerId }),

    getNextQuestion: (gameId) =>
        sendMessage('/app/game.getNextQuestion', { gameId }),

    submitAnswer: (gameId, questionId, answer, answerType) =>
        sendMessage('/app/game.submitAnswer', { gameId, questionId, answer, answerType }),
};

export default WebSocketService;