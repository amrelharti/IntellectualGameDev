import React, { useContext } from 'react';
import { GlobalContext } from '../../state/GlobaleState';
import webSocketService from '../../services/websocketService';

const GameBoard = () => {
    const { state } = useContext(GlobalContext);

    const submitAnswer = (answer) => {
        if (state.game) {
            webSocketService.sendMessage('/app/game.submitAnswer', {
                gameId: state.game.id,
                playerId: state.player.id,
                answer
            });
        }
    };

    if (!state.game) {
        return <div>Loading game...</div>;
    }

    return (
        <div className="game-board">
            <h3>Current Question</h3>
            <p>{state.game.currentQuestion}</p>
            <div className="answer-options">
                {state.game.answerOptions.map((option, index) => (
                    <button key={index} onClick={() => submitAnswer(option)}>
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default GameBoard;