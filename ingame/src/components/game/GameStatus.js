import React, { useContext } from 'react';
import { GlobalContext } from '../../state/GlobaleState';

const GameStatus = () => {
    const { state } = useContext(GlobalContext);

    if (!state.game) {
        return null;
    }

    return (
        <div className="game-status">
            <h3>Game Status</h3>
            <p>State: {state.game.state}</p>
            <p>Current Player: {state.game.currentPlayer}</p>
            <h4>Scores:</h4>
            <ul>
                {Object.entries(state.game.scores).map(([playerId, score]) => (
                    <li key={playerId}>{playerId}: {score}</li>
                ))}
            </ul>
            {state.game.winner && <p>Winner: {state.game.winner}</p>}
        </div>
    );
};

export default GameStatus;