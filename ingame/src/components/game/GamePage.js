import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../state/GlobaleState';
import { WebSocketContext } from '../../services/WebSocketProvider';
import '../game/GameStyle.css';
import Categories from '../design/Categories';
import Footer from '../design/Footer';
import Slideshow from "./slideShow";

const GamePage = () => {
    const { state, dispatch } = useContext(GlobalContext);
    const { isConnected, WebSocketService } = useContext(WebSocketContext);
    const navigate = useNavigate();
    const [isConnecting, setIsConnecting] = useState(false);


    const handleStartSinglePlayerGame = async () => {
        if (isConnecting || !isConnected) {
            console.log('Not connected or already attempting to connect, ignoring click');
            return;
        }

        setIsConnecting(true);
        try {
            console.log('Attempting to start single player game...');
            console.log('Player ID:', state.player.id);
            const game = await WebSocketService.createSinglePlayerGame(state.player.id);
            console.log('Received game object:', game);

            if (!game || !game.gameId) {
                throw new Error('Invalid game object received');
            }

            console.log('Dispatching SET_GAME action');
            dispatch({ type: 'SET_GAME', payload: game });
            console.log('Game set in state, game ID:', game.gameId);

            dispatch({ type: 'SET_GAME_STATE', payload: 'IN_PROGRESS' });
            console.log('Game state set to IN_PROGRESS');

            console.log('Navigating to game room...');
            navigate(`/gameroom/${game.gameId}`);
            console.log('Navigation called');
        } catch (error) {
            console.error('Error in handleStartSinglePlayerGame:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to start single player game: ' + error.message });
            alert(`Failed to start single player game: ${error.message}`);
        } finally {
            setIsConnecting(false);
        }
    };
    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };
    const handleStartMultiplayerGame = async () => {
        if (isConnecting || !isConnected) {
            console.log('Not connected or already attempting to connect, ignoring click');
            return;
        }

        setIsConnecting(true);
        try {
            console.log('Attempting to auto-join multiplayer game...');
            console.log('Player ID:', state.player.id);
            const game = await WebSocketService.autoJoinGame(state.player.id);
            console.log('Received game object:', game);

            if (!game || !game.gameId) {
                throw new Error('Invalid game object received');
            }

            console.log('Dispatching SET_GAME action');
            dispatch({ type: 'SET_GAME', payload: game });
            console.log('Game set in state, game ID:', game.gameId);

            dispatch({ type: 'SET_GAME_STATE', payload: 'WAITING_FOR_PLAYERS' });
            console.log('Game state set to WAITING_FOR_PLAYERS');

            console.log('Navigating to waiting room...');
            navigate(`/waitingroom/${game.gameId}`);
            console.log('Navigation called');
        } catch (error) {
            console.error('Error in handleStartMultiplayerGame:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to join/create multiplayer game: ' + error.message });
            alert(`Failed to join/create multiplayer game: ${error.message}`);
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
                    <a href="#" onClick={() => scrollToSection('home')}>Home</a>
                    <a href="#" onClick={() => scrollToSection('About')}>About</a>
                    <a href="#" onClick={() => scrollToSection('Categories')}>Categories</a>
                </nav>
            </header>

            <div className="hero-section" id="home">
                <h1 className="animated-text">Welcome, {state.player.username} !</h1>
                {!isConnected && <div>Connecting to game server...</div>}
                <div className="game-buttons">
                    <button
                        className={`start-btn ${isConnecting || !isConnected ? 'disabled' : ''}`}
                        onClick={handleStartSinglePlayerGame}
                        disabled={isConnecting || !isConnected}>
                        {isConnecting ? 'Starting...' : 'Start Single Player Game'}
                    </button>
                    <button
                        className={`start-btn ${isConnecting || !isConnected ? 'disabled' : ''}`}
                        onClick={handleStartMultiplayerGame}
                        disabled={isConnecting || !isConnected}>
                        {isConnecting ? 'Joining...' : 'Join Multiplayer Game'}
                    </button>
                </div>
                <Slideshow />
                <div className="dynamic-hero-section" id="About">
                    <div className="dynamic-content">
                        <div className="decorative-icons">
                            <span className="icon icon-lightbulb"></span>
                            <span className="icon icon-trophy"></span>
                            <span className="icon icon-quiz"></span>
                        </div>
                        <div className="dynamic-text">
                            <h2>Unleash Your Knowledge!</h2>
                            <p>
                                Dive into an exciting trivia adventure with challenges tailored for you! Play alone or against friends in real-time, choosing your answer style: strategic, bold, or calculated. Each game is a step towards becoming the ultimate quiz champion. Ready to play? Choose your game mode and let the journey begin!
                            </p>
                        </div>
                    </div>
                </div>
                <h1>Categories :</h1>
            </div>

            <Categories id="Categories" />
            <Footer />

            <div className="background-animations"></div>
        </div>
    );
};

export default GamePage;