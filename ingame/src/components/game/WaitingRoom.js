import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GlobalContext } from '../../state/GlobaleState';
import { WebSocketContext } from '../../services/WebSocketProvider';

const WaitingRoom = () => {
    const { state, dispatch } = useContext(GlobalContext);
    const { WebSocketService } = useContext(WebSocketContext);
    const navigate = useNavigate();
    const { gameId } = useParams();
    const [statusMessage, setStatusMessage] = useState('Waiting for players...');
    const [playerNames, setPlayerNames] = useState({});
    const [isReady, setIsReady] = useState(false);

    const fetchPlayerNames = useCallback(async (playerIds) => {
        const names = {};
        for (const playerId of playerIds) {
            if (!playerNames[playerId]) {
                try {
                    const name = await WebSocketService.getPlayerName(playerId);
                    names[playerId] = name;
                    setPlayerNames((prevNames) => ({ ...prevNames, [playerId]: name }));
                } catch (error) {
                    console.error(`Error fetching name for player ${playerId}:`, error);
                    names[playerId] = `Player ${playerId.substr(0, 5)}...`;
                }
            }
        }
    }, [WebSocketService, playerNames]);

    const handleGameStart = useCallback(() => {
        console.log('Checking game start conditions...');
        const readyPlayersCount = state.game.readyPlayers?.length || 0;
        const totalPlayersCount = state.game.players?.length || 0;
        console.log('Ready players:', state.game.readyPlayers);
        console.log('Total players:', state.game.players);
        console.log('Ready players count:', readyPlayersCount);
        console.log('Total players count:', totalPlayersCount);

        if (readyPlayersCount === totalPlayersCount && totalPlayersCount === 2) {
            console.log('All players are ready. Changing state to starting.');
            dispatch({ type: 'SET_GAME_STATE', payload: 'STARTING' });
            WebSocketService.startGame(gameId);
        } else {
            console.log('Not all players are ready yet.');
        }
    }, [state.game, gameId, dispatch, WebSocketService]);

    useEffect(() => {
        const setupGame = async () => {
            try {
                console.log('Setting up game...');
                await WebSocketService.ensureConnection();

                dispatch({ type: 'SET_GAME_STATE', payload: 'WAITING_FOR_PLAYERS' });

                const playerJoinedSubscription = WebSocketService.subscribe(`/topic/game.${gameId}.playerJoined`, (response) => {
                    console.log('Player joined:', response);
                    dispatch({
                        type: 'UPDATE_GAME',
                        payload: {
                            players: [response.playerId],
                        },
                    });
                    fetchPlayerNames([response.playerId]);
                });

                const playerReadySubscription = WebSocketService.subscribe(`/topic/game.${gameId}.playerReady`, (response) => {
                    console.log('Player ready event received:', response);
                    dispatch({
                        type: 'UPDATE_GAME',
                        payload: {
                            readyPlayers: [response.playerId],
                        },
                    });
                    handleGameStart();
                });

                const gameStartSubscription = WebSocketService.subscribe(`/topic/game.${gameId}.start`, () => {
                    console.log('Game start event received.');
                    navigate(`/gameplay/${gameId}`);
                });

                await fetchPlayerNames(state.game.players);

                return () => {
                    playerJoinedSubscription.unsubscribe();
                    playerReadySubscription.unsubscribe();
                    gameStartSubscription.unsubscribe();
                };
            } catch (error) {
                console.error('Error setting up game:', error);
                setStatusMessage('Error connecting to game. Please try again.');
            }
        };

        setupGame();
    }, [gameId, state.game, dispatch, fetchPlayerNames, handleGameStart, WebSocketService, navigate]);

    const handleReady = async () => {
        try {
            console.log('Marking player as ready...');
            await WebSocketService.markPlayerReady(gameId, state.player.id);
            setIsReady(true);
            dispatch({
                type: 'UPDATE_GAME',
                payload: {
                    readyPlayers: [state.player.id],
                },
            });
            console.log('Updated ready players:', state.game.readyPlayers);
            handleGameStart();
        } catch (error) {
            console.error('Error marking player as ready:', error);
            setStatusMessage('Error marking you as ready. Please try again.');
        }
    };

    useEffect(() => {
        console.log('Current game state:', state.gameState);
        if (state.gameState === 'STARTING') {
            setStatusMessage('All players are ready. Starting game...');
        }
    }, [state.gameState]);

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
                                ? `${playerNames[playerId] || state.player.username} (You)`
                                : playerNames[playerId] || `Player ${playerId.substr(0, 5)}...`}
                            {state.game.readyPlayers && state.game.readyPlayers.includes(playerId) && ' - Ready'}
                        </li>
                    ))}
                </ul>
            </div>
            {!isReady && state.game?.players?.length === 2 && (
                <button onClick={handleReady}>I'm Ready</button>
            )}
        </div>
    );
};

export default WaitingRoom;