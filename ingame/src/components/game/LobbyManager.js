import React, { useState, useEffect } from 'react';
import WebSocketService from '../../services/websocketService';

const LobbyManager = () => {
    const [lobbyId, setLobbyId] = useState('');
    const [playerId, setPlayerId] = useState('');
    const [action, setAction] = useState('create'); // 'create', 'join', 'ready', 'start'
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        WebSocketService.connect(
            () => {
                setIsConnected(true);
                // Auto-join logic if applicable
            },
            () => setIsConnected(false)
        );

        return () => {
            WebSocketService.disconnect();
        };
    }, []);

    const handleAction = () => {
        if (!isConnected) {
            console.error('Not connected to WebSocket');
            return;
        }

        const actionMap = {
            create: () => WebSocketService.createLobby(playerId),
            join: () => WebSocketService.joinLobby(lobbyId, playerId),
            ready: () => WebSocketService.markPlayerReady(lobbyId, playerId),
            start: () => WebSocketService.startLobby(lobbyId)
        };

        const actionFunction = actionMap[action];

        if (actionFunction) {
            actionFunction()
                .then(response => {
                    console.log(`${action.charAt(0).toUpperCase() + action.slice(1)} action successful:`, response);
                })
                .catch(error => {
                    console.error(`Error during ${action} action:`, error);
                });
        } else {
            console.error('Invalid action');
        }
    };

    return (
        <div>
            <input
                type="text"
                value={lobbyId}
                onChange={(e) => setLobbyId(e.target.value)}
                placeholder="Enter lobby ID"
            />
            <input
                type="text"
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
                placeholder="Enter your player ID"
            />
            <select value={action} onChange={(e) => setAction(e.target.value)}>
                <option value="create">Create Lobby</option>
                <option value="join">Join Lobby</option>
                <option value="ready">Mark Ready</option>
                <option value="start">Start Lobby</option>
            </select>
            <button onClick={handleAction}>Execute Action</button>
        </div>
    );
};

export default LobbyManager;
