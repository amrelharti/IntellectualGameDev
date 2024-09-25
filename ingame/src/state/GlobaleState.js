import React, { createContext, useReducer } from 'react';

const initialState = {
    player: null,
    game: {
        gameId: null,
        players: [],
        readyPlayers: [],
        gameState: null,
        scores: {},
        winner: null,
    },
    gameState: null,
    players: {},
    error: null,
};

const reducer = (state, action) => {
    console.log('Reducer action:', action.type, 'Payload:', action.payload);
    switch (action.type) {
        case 'SET_PLAYER':
            return { ...state, player: action.payload };
        case 'SET_GAME':
            return {
                ...state,
                game: {
                    ...initialState.game,
                    ...action.payload,
                    readyPlayers: action.payload.readyPlayers || [],
                },
                gameState: action.payload.gameState,
            };
        case 'SET_GAME_STATE':
            return { ...state, gameState: action.payload };
        case 'UPDATE_GAME':
            const updatedGame = {
                ...state.game,
                ...action.payload,
                players: [...new Set([...(state.game?.players || []), ...(action.payload.players || [])])],
                readyPlayers: [...new Set([...(state.game?.readyPlayers || []), ...(action.payload.readyPlayers || [])])],
            };
            console.log('Updated game state:', updatedGame);
            return {
                ...state,
                game: updatedGame,
                gameState: action.payload.gameState || state.gameState,
            };
        case 'UPDATE_SCORE':
            return {
                ...state,
                score: action.payload
            };
        case 'SET_WINNER':
            return { ...state, game: { ...state.game, winner: action.payload } };
        case 'UPDATE_PLAYERS':
            return { ...state, players: { ...state.players, ...action.payload } };
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