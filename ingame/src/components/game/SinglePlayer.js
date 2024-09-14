import React, {useState, useEffect, useContext} from 'react';
import WebSocketService from '../../services/websocketService';
import {WebSocketContext} from "../../services/WebSocketProvider";

const SinglePlayerGame = ({ playerId }) => {
    const [gameState, setGameState] = useState('INIT');
    const [gameId, setGameId] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [answerMethod, setAnswerMethod] = useState(null);
    const ConnectionStatus = () => {
        const { isConnected } = useContext(WebSocketContext);
        return (
            <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
                {isConnected ? 'Connected' : 'Disconnected'}
            </div>
        );
    };
    useEffect(() => {
        if (gameId) {
            startGame();
        }
    }, [gameId]);

    useEffect(() => {
        if (gameState === 'IN_PROGRESS' && currentQuestion && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [gameState, currentQuestion, timeLeft]);

    const startGame = async () => {
        const response = await WebSocketService.createSinglePlayerGame(playerId);
        setGameId(response.gameId);
        setGameState(response.gameState);
        const subjectsResponse = await WebSocketService.getAvailableSubjects();
        setSubjects(subjectsResponse);
    };

    const chooseSubject = async (subject) => {
        await WebSocketService.chooseSinglePlayerSubject(gameId, subject);
        setGameState('IN_PROGRESS');
        getNextQuestion();
    };

    const getNextQuestion = async () => {
        const response = await WebSocketService.getNextQuestion(gameId);
        setCurrentQuestion(response);
        setTimeLeft(30);
        setAnswerMethod(null);
    };

    const chooseAnswerMethod = (method) => {
        setAnswerMethod(method);
    };

    const submitAnswer = async (answer) => {
        if (!answerMethod) return;
        const response = await WebSocketService.submitSinglePlayerAnswer(gameId, currentQuestion.id, answer, answerMethod);
        setScore(response.scores);
        if (response.gameState === 'FINISHED') {
            setGameState('FINISHED');
        } else {
            getNextQuestion();
        }
    };

    if (gameState === 'IN_PROGRESS') {
        return (
            <div>
                <h2>Choose a subject:</h2>
                {subjects.map(subject => (
                    <button key={subject} onClick={() => chooseSubject(subject)}>{subject}</button>
                ))}
            </div>
        );
    }

    if (gameState === 'IN_PROGRESS' && currentQuestion) {
        return (
            <div>
                <h2>Question: {currentQuestion.text}</h2>
                <p>Time left: {timeLeft} seconds</p>
                {!answerMethod ? (
                    <div>
                        <h3>Choose answer method:</h3>
                            <button onClick={() => chooseAnswerMethod('carre')}>Carré (10 points)</button>
                        <button onClick={() => chooseAnswerMethod('duo')}>Duo (5 points)</button>
                        <button onClick={() => chooseAnswerMethod('cash')}>Cash (15 points)</button>
                    </div>
                ) : (
                    <div>
                        {currentQuestion.options.map(option => (
                            <button key={option} onClick={() => submitAnswer(option)}>{option}</button>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    if (gameState === 'FINISHED') {
        return (
            <div>
                <h2>Game Over!</h2>
                <p>Your final score: {score}</p>
            </div>
        );
    }

    return <div>Loading...</div>;
};

export default SinglePlayerGame;