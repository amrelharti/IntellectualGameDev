import React, { createContext, useReducer } from 'react';

const initialState = {
    player: null,
    game: null,
    error: null,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_PLAYER':
            return { ...state, player: action.payload };
        case 'SET_GAME':
            return { ...state, game: action.payload };
        case 'UPDATE_GAME_STATE':
            return { ...state, game: { ...state.game, ...action.payload } };
        case 'UPDATE_SCORES':
            return { ...state, game: { ...state.game, scores: action.payload } };
        case 'SET_WINNER':
            return { ...state, game: { ...state.game, winner: action.payload } };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        default:
            return state;
    }
};

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <GlobalContext.Provider value={{ state, dispatch }}>
            {children}
        </GlobalContext.Provider>
    );
};