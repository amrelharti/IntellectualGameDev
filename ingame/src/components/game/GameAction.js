import React, { useContext } from 'react';
import { GlobalContext } from '../../state/GlobaleState';
import webSocketService from '../../services/websocketService';

const GameAction = () => {
    const { state } = useContext(GlobalContext);

    const createGame = () => {
        const gameData = {
            state: 'waitingForPlayers',
            subjectsChosen: ['Math', 'Science'],
            scores: {},
            currentPlayer: state.player.id,
            players: [state.player.id]
        };

        webSocketService.sendMessage('/app/game.create', gameData);
    };

    const joinGame = () => {
        const gameId = prompt('Enter game ID to join:');
        if (gameId) {
            webSocketService.sendMessage('/app/game.join', { gameId, playerId: state.player.id });
        }
    };

    const startGame = () => {
        if (state.game) {
            webSocketService.sendMessage('/app/game.start', { gameId: state.game.id });
        } else {
            alert('No game joined yet');
        }
    };

    return (
        <div className="game-actions">
            <button onClick={createGame}>Create Game</button>
            <button onClick={joinGame}>Join Game</button>
            {state.game && <button onClick={startGame}>Start Game</button>}
        </div>
    );
};

export default GameAction;