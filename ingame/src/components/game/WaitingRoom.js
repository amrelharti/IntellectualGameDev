import React, {useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {GlobalContext} from '../../state/GlobaleState';
import WebSocketService from '../../services/websocketService';

const WaitingRoom = () => {
    const { state, dispatch } = useContext(GlobalContext);
    const navigate = useNavigate();
    const { gameId } = useParams();
    const [statusMessage, setStatusMessage] = useState('Waiting for players...');
    const [playerNames, setPlayerNames] = useState({});

    useEffect(() => {
        console.log('Current game state:', state.game);
        if (!state.player || !gameId) {
            navigate('/');
            return;
        }

        const setupGame = async () => {
            try {
                await WebSocketService.ensureConnection();
                WebSocketService.subscribe(`/topic/game.${gameId}.playerJoined`, handlePlayerJoined);
                WebSocketService.subscribe(`/topic/game.${gameId}.start`, handleGameStart);

                // Only join if not already in the game
                if (!state.game || !state.game.players.includes(state.player.id)) {
                    const gameState = await WebSocketService.joinLobby(gameId, state.player.id);
                    dispatch({ type: 'SET_GAME', payload: gameState });
                }

                // Fetch player names
                if (state.game && state.game.players) {
                    fetchPlayerNames(state.game.players);
                }
            } catch (error) {
                setStatusMessage('Error connecting to game. Please try again.');
                console.error('Setup game error:', error);
            }
        };

        setupGame();

        return () => {
            WebSocketService.unsubscribe(`/topic/game.${gameId}.playerJoined`);
            WebSocketService.unsubscribe(`/topic/game.${gameId}.start`);
        };
    }, [gameId, state.player, dispatch, navigate, state.game]);

    const fetchPlayerNames = async (playerIds) => {
        const names = {};
        for (const playerId of playerIds) {
            try {
                const name = await WebSocketService.getPlayerName(playerId);
                names[playerId] = name;
            } catch (error) {
                console.error(`Error fetching name for player ${playerId}:`, error);
                names[playerId] = `Player ${playerId}...`;
            }
        }
        console.log('Fetched player names:', names); // Debug log
        setPlayerNames(prev => ({ ...prev, ...names }));
    };

    const handlePlayerJoined = (response) => {
        console.log('Player joined event received:', response);
        dispatch({ type: 'UPDATE_GAME', payload: response });
        if (response.playerId && !playerNames[response.playerId]) {
            fetchPlayerNames([response.playerId]);
        }
    };

    const handleGameStart = (game) => {
        dispatch({ type: 'UPDATE_GAME', payload: game });
        navigate(`/game/${gameId}`);
    };

    return (
        <div className="waiting-room">
            <h2>Waiting Room</h2>
            <p>{statusMessage}</p>
            <div className="players-list">
                <h3>Players in the room:</h3>
                <ul>
                    {state.game?.players?.map((playerId) => (
                        <li key={playerId}>
                            {playerId === state.player.id
                                ? `${state.player.username} (You)`
                                : playerNames[playerId] || `Player ${playerId.substr(0, 5)}...`}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default WaitingRoom;
