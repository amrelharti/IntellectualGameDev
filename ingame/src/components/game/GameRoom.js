import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../state/GlobaleState';
import { WebSocketContext } from '../../services/WebSocketProvider';

const GameRoom = () => {
    const { gameId } = useParams();
    const { state, dispatch } = useContext(GlobalContext);
    const { WebSocketService } = useContext(WebSocketContext);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [questionCount, setQuestionCount] = useState(0);

    useEffect(() => {
        getNextQuestion();
    }, []);

    const getNextQuestion = async () => {
        try {
            const question = await WebSocketService.getNextQuestion(gameId);
            console.log("Received question:", question);
            setCurrentQuestion(question);
            setSelectedAnswer('');
            setQuestionCount(prev => prev + 1);
        } catch (error) {
            console.error('Error fetching question:', error);
            setGameOver(true);
        }
    };

    const handleAnswerSubmit = async () => {
        if (!selectedAnswer) return;

        try {
            const result = await WebSocketService.submitAnswer(gameId, currentQuestion.id, selectedAnswer, 'SINGLE');
            console.log("Submit answer result:", result);

            if (result && typeof result.score === 'number') {
                setScore(result.score);
                dispatch({ type: 'UPDATE_SCORE', payload: result.score });
            }

            if (result && result.gameState === 'FINISHED' || questionCount >= 10) {
                setGameOver(true);
            } else {
                setTimeout(getNextQuestion, 2000); // Wait 2 seconds before moving to the next question
            }
        } catch (error) {
            console.error('Error submitting answer:', error);
        }
    };

    if (gameOver) {
        return (
            <div className="game-room">
                <h2>Game Over!</h2>
                <p>Your final score: {score}</p>
            </div>
        );
    }

    return (
        <div className="game-room">
            <h2>Single Player Game</h2>
            <p>Score: {score}</p>
            <p>Question {questionCount} of 10</p>
            {currentQuestion && (
                <div className="question-container">
                    <h3>{currentQuestion.text}</h3>
                    <div className="options">
                        {currentQuestion.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedAnswer(option)}
                                className={selectedAnswer === option ? 'selected' : ''}
                                style={{
                                    backgroundColor: selectedAnswer === option ? '#4CAF50' : '',
                                    color: selectedAnswer === option ? 'white' : ''
                                }}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                    <button onClick={handleAnswerSubmit} disabled={!selectedAnswer}>
                        Submit Answer
                    </button>
                </div>
            )}
        </div>
    );
};

export default GameRoom;