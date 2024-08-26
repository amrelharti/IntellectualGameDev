import axios from 'axios';

export const getPlayerName = async (playerId) => {
    try {
        const response = await axios.post('/getPlayerName', { playerId });
        return response.data.username;
    } catch (error) {
        console.error('Error fetching player name:', error);
        throw error;
    }
};
