import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            <div className="overlay"></div> {/* Optional overlay */}
            <div className="hero-content">
                <h1 className="typewriter">Intellectual Game</h1>
                <p className="game-description1">
                    Challenge your intellect, compete against others, and rise to the top in our engaging and interactive quiz game!
                </p>
                <div className="button-group">
                    <button className="action-btn" onClick={() => navigate('/login')}>Login</button>
                    <button className="action-btn" onClick={() => navigate('/signup')}>Sign Up</button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
