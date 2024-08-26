import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../state/GlobaleState';
import { WebSocketContext } from '../../services/WebSocketProvider';
import '../game/GameStyle.css';
import Categories from '../design/Categories';
import Footer from '../design/Footer';

const GamePage = () => {
    const { state, dispatch } = useContext(GlobalContext);
    const { isConnected, WebSocketService } = useContext(WebSocketContext);
    const navigate = useNavigate();
    const [isConnecting, setIsConnecting] = useState(false);

    const handleStartGame = async () => {
        if (isConnecting || !isConnected) {
            console.log('Not connected or already attempting to connect, ignoring click');
            return;
        }

        setIsConnecting(true);
        try {
            console.log('Attempting to auto-join game...');
            console.log('Player ID:', state.player.id);
            const game = await WebSocketService.autoJoinGame(state.player.id);
            console.log('Received game object:', game);

            if (!game || !game.gameId) {
                throw new Error('Invalid game object received');
            }

            console.log('Dispatching SET_GAME action');
            dispatch({ type: 'SET_GAME', payload: game });
            console.log('Game set in state, game ID:', game.gameId);

            console.log('Navigating to waiting room...');
            navigate(`/waitingroom/${game.gameId}`);
            console.log('Navigation called');
        } catch (error) {
            console.error('Error in handleStartGame:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to join/create game: ' + error.message });
            alert(`Failed to join/create game: ${error.message}`);
        } finally {
            setIsConnecting(false);
        }
    };

    if (!state.player) {
        return <div>Please log in to play the game.</div>;
    }

    return (
        <div className="game-page">
            <header className="header">
                <div>GameZone</div>
                <nav className="nav">
                    <a href="#">Home</a>
                    <a href="#">About</a>
                    <a href="#">Leaderboard</a>
                    <a href="#">Settings</a>
                </nav>
            </header>

            <div className="hero-section">
                <h1 className="animated-text">Welcome, {state.player.username}!</h1>
                {!isConnected && <div>Connecting to game server...</div>}
                <button
                    className={`start-btn ${isConnecting || !isConnected ? 'disabled' : ''}`}
                    onClick={handleStartGame}
                    disabled={isConnecting || !isConnected}>
                    {isConnecting ? 'Connecting...' : 'Start Game'}
                </button>
            </div>

            <Categories />
            <Footer />

            <div className="background-animations"></div>
        </div>
    );
};

export default GamePage;