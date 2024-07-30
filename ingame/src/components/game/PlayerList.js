import React, { useContext } from 'react';
import { GlobalContext } from '../../state/GlobaleState';

const PlayerList = () => {
    const { state } = useContext(GlobalContext);

    if (!state.game) {
        return null;
    }

    return (
        <div className="player-list">
            <h3>Players</h3>
            <ul>
                {state.game.players.map((playerId) => (
                    <li key={playerId}>{playerId}</li>
                ))}
            </ul>
        </div>
    );
};

export default PlayerList;