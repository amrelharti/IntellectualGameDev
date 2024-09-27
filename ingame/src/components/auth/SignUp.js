import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../state/GlobaleState';
import { signUpUser } from '../../services/apiService';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SignUp.css'; // Import the custom CSS file

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useContext(GlobalContext);
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const player = await signUpUser(username, email, password);
            dispatch({ type: 'SET_PLAYER', payload: player });
            navigate('/login');
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="signup-container d-flex align-items-center justify-content-center">
            <div className="card signup-card shadow-lg">
                <div className="card-body p-4">
                    <h2 className="card-title text-center mb-4">Sign Up</h2>
                    <form onSubmit={handleSignUp}>
                        <div className="form-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mb-4">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-block signup-btn"
                            disabled={isLoading}>
                            {isLoading ? 'Signing up...' : 'Sign Up'}
                        </button>
                    </form>
                    <div className="text-center mt-4">
                        <p className="text-muted mb-0">Already have an account?</p>
                        <a href="/login" className="btn btn-link">Login</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
