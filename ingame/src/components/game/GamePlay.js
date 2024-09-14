import React, { useState, useEffect, useContext } from 'react';
import { WebSocketContext } from '../../services/WebSocketProvider';
import { GlobalContext } from '../../state/GlobaleState';

const SUBJECTS = ['Subject 1', 'Subject 2', 'Subject 3', 'Subject 4'];

const Gameplay = () => {
    const { WebSocketService } = useContext(WebSocketContext);
    const { state, dispatch } = useContext(GlobalContext);

    const [gamePhase, setGamePhase] = useState('subjectSelection');
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [answerType, setAnswerType] = useState(null);
    const [timer, setTimer] = useState(30);
    const [score, setScore] = useState(0);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        let interval;
        if (gamePhase === 'answering' && timer > 0) {
            interval = setInterval(() => setTimer(prevTimer => prevTimer - 1), 1000);
        } else if (timer === 0) {
            handleTimeUp();
        }

        return () => clearInterval(interval);
    }, [gamePhase, timer]);

    useEffect(() => {
        const connectWebSocket = async () => {
            try {
                await WebSocketService.ensureConnection();
                setIsConnected(true);
                WebSocketService.subscribe('/topic/game.subjectChosen', handleSubjectChosen);
                WebSocketService.subscribe('/topic/game.questionReceived', handleQuestionReceived);
                WebSocketService.subscribe('/topic/game.answerResult', handleAnswerResult);
            } catch (error) {
                console.error('Failed to connect to WebSocket:', error);
                setIsConnected(false);
            }
        };

        connectWebSocket();

        return () => {
            WebSocketService.unsubscribe('/topic/game.subjectChosen');
            WebSocketService.unsubscribe('/topic/game.questionReceived');
            WebSocketService.unsubscribe('/topic/game.answerResult');
        };
    }, [WebSocketService]);

    const handleSubjectSelection = (subject) => {
        if (selectedSubjects.length < 2 && !selectedSubjects.includes(subject)) {
            setSelectedSubjects(prev => [...prev, subject]);
            WebSocketService.chooseSubject(state.game.id, state.player.id, subject);
        }
    };

    const handleSubjectChosen = (data) => {
        if (data.allSubjectsChosen) {
            setGamePhase('answering');
            requestQuestion();
        }
    };

    const requestQuestion = () => {
        WebSocketService.requestQuestion(state.game.id, state.player.id);
    };

    const handleQuestionReceived = (question) => {
        setCurrentQuestion(question);
        setTimer(30);
    };

    const handleAnswer = (answer) => {
        WebSocketService.submitAnswer(
            state.game.id,
            state.player.id,
            currentQuestion.id,
            answer,
            answerType
        );
    };

    const handleAnswerResult = (result) => {
        if (result.correct) {
            setScore(prevScore => prevScore + result.points);
        }
        if (result.isLastQuestion) {
            setGamePhase('gameOver');
        } else {
            requestQuestion();
        }
    };

    const handleTimeUp = () => {
        handleAnswer('');
    };

    const renderSubjectSelection = () => (
        <div>
            <h2>Select a subject for your opponent</h2>
            {SUBJECTS.map(subject => (
                <button
                    key={subject}
                    onClick={() => handleSubjectSelection(subject)}
                    disabled={selectedSubjects.includes(subject)}
                >
                    {subject}
                </button>
            ))}
        </div>
    );

    const renderAnswering = () => (
        <div>
            <h2>Question: {currentQuestion?.text}</h2>
            <p>Time remaining: {timer} seconds</p>
            <div>
                <button onClick={() => setAnswerType('Carré')}>Carré (4 options)</button>
                <button onClick={() => setAnswerType('Duo')}>Duo (2 options)</button>
                <button onClick={() => setAnswerType('Cash')}>Cash (Type answer)</button>
            </div>
            {answerType === 'Carré' && renderCarréOptions()}
            {answerType === 'Duo' && renderDuoOptions()}
            {answerType === 'Cash' && renderCashInput()}
        </div>
    );

    const renderCarréOptions = () => (
        <div>
            {currentQuestion?.options.map((option, index) => (
                <button key={index} onClick={() => handleAnswer(option)}>{option}</button>
            ))}
        </div>
    );

    const renderDuoOptions = () => (
        <div>
            {currentQuestion?.options.slice(0, 2).map((option, index) => (
                <button key={index} onClick={() => handleAnswer(option)}>{option}</button>
            ))}
        </div>
    );

    const renderCashInput = () => (
        <div>
            <input type="text" placeholder="Type your answer" />
            <button onClick={() => handleAnswer(document.querySelector('input').value)}>Submit</button>
        </div>
    );

    const renderGameOver = () => (
        <div>
            <h2>Game Over</h2>
            <p>Final Score: {score}</p>
        </div>
    );

    return (
        <div>
            <h1>Quiz Game</h1>
            {!isConnected && <p>Connecting to game server...</p>}
            {isConnected && (
                <>
                    {gamePhase === 'subjectSelection' && renderSubjectSelection()}
                    {gamePhase === 'answering' && renderAnswering()}
                    {gamePhase === 'gameOver' && renderGameOver()}
                    <p>Current Score: {score}</p>
                </>
            )}
        </div>
    );
};

export default Gameplay;