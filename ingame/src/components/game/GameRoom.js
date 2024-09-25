import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../state/GlobaleState';
import { WebSocketContext } from '../../services/WebSocketProvider';

const GameRoom = () => {
    const { gameId } = useParams();
    const { state, dispatch } = useContext(GlobalContext);
    const { WebSocketService } = useContext(WebSocketContext);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedAnswerType, setSelectedAnswerType] = useState('');
    const [options, setOptions] = useState([]);
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
            setSelectedAnswerType('');
            setOptions([]);
            setSelectedAnswer('');
            setQuestionCount(prev => prev + 1);
        } catch (error) {
            console.error('Error fetching question:', error);
            setGameOver(true);
        }
    };

    const handleAnswerTypeSelect = (type) => {
        setSelectedAnswerType(type);

        // Set the options based on the answer type
        if (type === 'Carré') {
            setOptions([...currentQuestion.options]); // All 4 options
        } else if (type === 'Duo') {
            setOptions(currentQuestion.options.slice(0, 2)); // Only 2 options
        } else if (type === 'Cash') {
            setOptions([]); // No options for Cash, user will input manually
        }
    };

    const handleAnswerSubmit = async () => {
        if (selectedAnswerType === 'Cash' && !selectedAnswer) return; // For Cash, the answer is input manually
        if ((selectedAnswerType === 'Carré' || selectedAnswerType === 'Duo') && !selectedAnswer) return; // Ensure an answer is selected

        try {
            const result = await WebSocketService.submitAnswer(
                gameId,
                currentQuestion.id,
                selectedAnswerType === 'Cash' ? selectedAnswer : selectedAnswer,
                selectedAnswerType
            );
            console.log("Submit answer result:", result);

            if (result && typeof result.score === 'number') {
                setScore(result.score);
                dispatch({ type: 'UPDATE_SCORE', payload: result.score });
            }

            if (result && (result.gameState === 'FINISHED' || questionCount >= 10)) {
                setGameOver(true);
            } else {
                setTimeout(getNextQuestion, 1000); // Wait 2 seconds before moving to the next question
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

                    {/* Answer type selection */}
                    {!selectedAnswerType && (
                        <div className="answer-type-selection">
                            <button onClick={() => handleAnswerTypeSelect('Carré')}>Carré (10 points)</button>
                            <button onClick={() => handleAnswerTypeSelect('Duo')}>Duo (5 points)</button>
                            <button onClick={() => handleAnswerTypeSelect('Cash')}>Cash (15 points)</button>
                        </div>
                    )}

                    {/* Display options after answer type is selected */}
                    {selectedAnswerType && (
                        <div className="options">
                            {selectedAnswerType === 'Cash' ? (
                                <input
                                    type="text"
                                    placeholder="Enter your answer"
                                    value={selectedAnswer}
                                    onChange={(e) => setSelectedAnswer(e.target.value)}
                                />
                            ) : (
                                options.map((option, index) => (
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
                                ))
                            )}
                            <button onClick={handleAnswerSubmit} disabled={!selectedAnswer}>
                                Submit Answer
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GameRoom;
