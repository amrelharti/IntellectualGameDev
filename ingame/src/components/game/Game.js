import React, { useEffect, useContext } from 'react';
import { GlobalContext } from '../../state/GlobaleState';
import GameAction from './GameAction';
import GameBoard from './GameBoard';
import GameStatus from './GameStatus';
import PlayerList from './PlayerList';
import webSocketService from '../../services/websocketService';

const Game = () => {
    const { state, dispatch } = useContext(GlobalContext);

    useEffect(() => {
        const onConnected = () => {
            console.log('Connected to game server');
            webSocketService.subscribe('/topic/game.created', handleGameCreated);
            webSocketService.subscribe('/topic/game.joined', handleGameJoined);
            webSocketService.subscribe('/topic/game.stateUpdated', handleGameStateUpdated);
            webSocketService.subscribe('/topic/game.scoresUpdated', handleScoresUpdated);
            webSocketService.subscribe('/topic/game.winnerSet', handleWinnerSet);
        };

        const onError = (error) => {
            console.error('WebSocket error:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Lost connection to game server' });
        };

        webSocketService.connect(onConnected, onError);

        return () => {
            webSocketService.disconnect();
        };
    }, [dispatch]);

    const handleGameCreated = (game) => {
        dispatch({ type: 'SET_GAME', payload: game });
    };

    const handleGameJoined = (game) => {
        dispatch({ type: 'SET_GAME', payload: game });
    };

    const handleGameStateUpdated = (gameState) => {
        dispatch({ type: 'UPDATE_GAME_STATE', payload: gameState });
    };

    const handleScoresUpdated = (scores) => {
        dispatch({ type: 'UPDATE_SCORES', payload: scores });
    };

    const handleWinnerSet = (winner) => {
        dispatch({ type: 'SET_WINNER', payload: winner });
    };

    if (!state.player) {
        return <div>Please log in to play the game.</div>;
    }

    return (
        <div>
            <h2>Welcome, {state.player.username}!</h2>
            <GameAction />
            {state.game ? (
                <>
                    <GameBoard />
                    <GameStatus />
                    <PlayerList />
                </>
            ) : (
                <p>No active game. Create or join a game to start playing!</p>
            )}
        </div>
    );
};

export default Game;