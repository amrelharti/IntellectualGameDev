// src/components/GameLobby.js

import React, { useContext } from 'react';
import { GlobalContext } from '../../state/GlobaleState';
import webSocketService from '../../services/websocketService';

const GameLobby = () => {
    const { state } = useContext(GlobalContext);
    const user = state.player;

    const createGame = () => {
        if (user && user.id) {
            console.log(`Creating game for user ${user.id}`);
            webSocketService.sendMessage('/app/game.create', { playerId: user.id });
        } else {
            console.error('User not logged in');
        }
    };

    return (
        <div>
            <button onClick={createGame}>Create Game</button>
        </div>
    );
};

export default GameLobby;
