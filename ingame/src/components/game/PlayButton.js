import React, { useState, useEffect } from 'react';
import WebSocketService from '../../services/websocketService';

const PlayButton = () => {
    const [waiting, setWaiting] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [lobbyId, setLobbyId] = useState('');
    const playerId = 'player123'; // Replace with actual player ID logic

    const handlePlayClick = () => {
        WebSocketService.connect(
            () => {
                WebSocketService.createLobby(playerId)
                    .then(response => {
                        setLobbyId(response.lobbyId);
                        if (response.isFirstPlayer) {
                            setWaiting(true);
                            WebSocketService.subscribe(`/topic/lobbies/${response.lobbyId}`, message => {
                                if (message.type === 'GAME_STARTED') {
                                    setGameStarted(true);
                                }
                            });
                        } else {
                            setWaiting(false);
                            WebSocketService.joinLobby(response.lobbyId, playerId)
                                .then(() => WebSocketService.markPlayerReady(response.lobbyId, playerId))
                                .catch(error => console.error('Error joining lobby:', error));
                        }
                    })
                    .catch(error => console.error('Error creating lobby:', error));
            },
            () => console.error('WebSocket connection error')
        );
    };

    useEffect(() => {
        if (waiting && lobbyId) {
            WebSocketService.subscribe(`/topic/lobbies/${lobbyId}`, message => {
                if (message.type === 'GAME_STARTED') {
                    setGameStarted(true);
                }
            });
        }
    }, [waiting, lobbyId]);

    return (
        <div>
            {!gameStarted ? (
                <div>
                    <button onClick={handlePlayClick}>Play</button>
                    {waiting && <p>Waiting for another player...</p>}
                </div>
            ) : (
                <div>
                    <p>Game Started!</p>
                </div>
            )}
        </div>
    );
};

export default PlayButton;
