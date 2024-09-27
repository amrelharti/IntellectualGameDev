import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../state/GlobaleState';
import { WebSocketContext } from '../../services/WebSocketProvider';
import './GameRoom.css';

const GameRoom = () => {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const { state, dispatch } = useContext(GlobalContext);
    const { WebSocketService } = useContext(WebSocketContext);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedAnswerType, setSelectedAnswerType] = useState('');
    const [options, setOptions] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [questionCount, setQuestionCount] = useState(0);
    const [timer, setTimer] = useState(10);
    const TOTAL_QUESTIONS = 10;
    const timerRef = useRef(null);

    // Define getNextQuestion before useEffect
    const getNextQuestion = async () => {
        try {
            if (questionCount >= TOTAL_QUESTIONS) {
                setGameOver(true);
                return;
            }

            const question = await WebSocketService.getNextQuestion(gameId);
            console.log("Received question:", question);
            setCurrentQuestion(question);
            console.log("Correct answer:", question.correctAnswer);

            setSelectedAnswerType('');
            setOptions([]);
            setSelectedAnswer('');
            setQuestionCount(prevCount => prevCount + 1);
            setTimer(15); // Reset timer for new question
        } catch (error) {
            console.error('Error fetching question:', error);
        }
    };

    useEffect(() => {
        getNextQuestion();
    }, []); // Use empty array to call on component mount only

    useEffect(() => {
        if (timer > 0 && currentQuestion) {
            timerRef.current = setTimeout(() => setTimer(timer - 1), 1000);
        } else if (timer === 0 && currentQuestion) {
            handleAnswerSubmit();
        }
        return () => clearTimeout(timerRef.current);
    }, [timer, currentQuestion]);

    const handleAnswerTypeSelect = (type) => {
        setSelectedAnswerType(type);
        if (type === 'Carré') {
            setOptions([...currentQuestion.options]);
        } else if (type === 'Duo') {
            setOptions(currentQuestion.options.slice(0, 2));
        } else if (type === 'Cash') {
            setOptions([]);
        }
    };

    const handleAnswerSubmit = async () => {
        clearTimeout(timerRef.current);
        if (!currentQuestion) return;

        try {
            console.log(`Submitting answer: ${selectedAnswer} (${selectedAnswerType})`);
            const result = await WebSocketService.submitAnswer(
                gameId,
                currentQuestion.id,
                selectedAnswer,
                selectedAnswerType
            );
            console.log("Submit answer result:", result);

            let points = 0;
            const correctAnswer = currentQuestion.correctAnswer;

            if (selectedAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
                if (selectedAnswerType === 'Carré') points = 10;
                else if (selectedAnswerType === 'Duo') points = 5;
                else if (selectedAnswerType === 'Cash') points = 15;
                console.log("Answer was correct.");
            } else {
                console.log("Answer was incorrect.");
            }

            const newScore = score + points;
            setScore(newScore);
            if (state.player && state.player.id) {
                dispatch({ type: 'UPDATE_SCORE', payload: { playerId: state.player.id, newScore } });
            }
            console.log(`Score updated: ${score} + ${points} = ${newScore}`);

            if (questionCount >= TOTAL_QUESTIONS) {
                setGameOver(true);
            } else {
                setTimeout(getNextQuestion, 1000);
            }
        } catch (error) {
            console.error('Error submitting answer:', error);
            if (questionCount < TOTAL_QUESTIONS) {
                setTimeout(getNextQuestion, 1000);
            } else {
                setGameOver(true);
            }
        }
    };

    const handleBackToHome = () => {
        // Navigate to home without losing WebSocket connection
        navigate('/start', { replace: true });
    };

    const handleReplay = () => {
        // Refresh the page to replay the game
        window.location.reload();
    };


    if (gameOver) {
        return (
            <div className="game-room">
                <h2 className="game-over">Game Over!</h2>
                <p className="final-score">Your final score: {score}</p>
                <button className="replay-btn" onClick={handleReplay}>Replay</button>
                <button className="home-btn" onClick={handleBackToHome}>Back to Home</button>
            </div>
        );
    }

    return (
        <div className="game-room">
            <p className="game-question-count">Question {questionCount} of {TOTAL_QUESTIONS}</p>
            <p className="timer">Time left: {timer} seconds</p>
            <p className="game-score">Score: {score}</p>
            {currentQuestion && (
                <div className="question-container">
                    <h3 className="question-text">{currentQuestion.text}</h3>
                    {!selectedAnswerType && (
                        <div className="answer-type-selection">
                            <button className="answer-type-btn" onClick={() => handleAnswerTypeSelect('Carré')}>Carré (10 points)</button>
                            <button className="answer-type-btn" onClick={() => handleAnswerTypeSelect('Duo')}>Duo (5 points)</button>
                            <button className="answer-type-btn" onClick={() => handleAnswerTypeSelect('Cash')}>Cash (15 points)</button>
                        </div>
                    )}
                    {selectedAnswerType && (
                        <div className="options">
                            {selectedAnswerType === 'Cash' ? (
                                <input
                                    className="answer-input"
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
                                        className={`option-btn ${selectedAnswer === option ? 'selected' : ''}`}
                                    >
                                        {option}
                                    </button>
                                ))
                            )}
                            <button className="submit-answer-btn" onClick={handleAnswerSubmit} disabled={!selectedAnswer}>
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
