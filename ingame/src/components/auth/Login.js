import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../state/GlobaleState';
import { loginUser } from '../../services/apiService';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useContext(GlobalContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const player = await loginUser(username, password);
            dispatch({ type: 'SET_PLAYER', payload: player });
            navigate('/start');
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const goToSignUp = () => {
        navigate('/signup'); // Redirect to the sign-up page
    };

    return (
        <div className="login-container d-flex align-items-center justify-content-center">
            <div className="card login-card shadow-lg">
                <div className="card-body p-4">
                    <h2 className="card-title text-center mb-4">Login</h2>
                    <form onSubmit={handleLogin}>
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
                            className="btn btn-block login-btn"
                            disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                        <div className="d-flex justify-content-center align-items-center mt-4">
                            <p className="text-muted mb-0">Don't have an account?</p>
                            <button
                                type="button"
                                className="btn btn-link ms-2"
                                onClick={goToSignUp}>
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
