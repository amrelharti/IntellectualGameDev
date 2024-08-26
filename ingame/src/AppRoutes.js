import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import GamePage from './components/game/GamePage';
import WaitingRoom from './components/game/WaitingRoom';
import PrivateRoute from './components/PrivateRoute';
import AdminPanel from "./components/admin/AdminPanel";
import SignUp from "./components/auth/SignUp";

const AppRoutes = () => (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/game" element={<PrivateRoute><GamePage /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
        <Route path="/waitingroom/:gameId" element={<PrivateRoute><WaitingRoom /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/game" replace />} />

    </Routes>
);

export default AppRoutes;