import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../state/GlobaleState';
import { signUpUser } from '../../services/apiService';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useContext(GlobalContext);
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const player = await signUpUser(username, password);
            dispatch({ type: 'SET_PLAYER', payload: player });
            navigate('/game');
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <h2>Sign Up for Quiz Game</h2>
            <form onSubmit={handleSignUp}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Signing up...' : 'Sign Up'}
                </button>
            </form>
        </div>
    );
};

export default SignUp;