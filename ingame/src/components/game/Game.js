import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../state/GlobaleState';
import webSocketService from '../../services/websocketService';

const Game = () => {
    const { state, dispatch } = useContext(GlobalContext);
    const { gameId } = useParams();

    useEffect(() => {
        const handleGameStateUpdate = (gameState) => {
            dispatch({ type: 'UPDATE_GAME', payload: gameState });
        };

        webSocketService.subscribe(`/topic/game.${gameId}.stateUpdate`, handleGameStateUpdate);

        return () => {
            webSocketService.unsubscribe(`/topic/game.${gameId}.stateUpdate`);
        };
    }, [gameId, dispatch]);

    if (!state.game) {
        return <div>Loading game...</div>;
    }

    return (
        <div>
            <h2>Game in Progress</h2>
            <p>Game ID: {gameId}</p>
            {/* Add your game UI components here */}
        </div>
    );
};

export default Game;