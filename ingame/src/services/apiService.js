import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const handleApiError = (error) => {
    // Handle API errors and format error message
    if (error.response) {
        // Request made and server responded with a status code outside of 2xx
        return error.response.data.message || 'An error occurred';
    } else if (error.request) {
        // Request made but no response received
        return 'No response from server';
    } else {
        // Something else happened
        return error.message || 'An error occurred';
    }
};

export const loginUser = async (username, password) => {
    try {
        const response = await apiClient.post('/players/login', { username, password });
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

export const signUpUser = async (username, email, password) => {
    try {
        const response = await apiClient.post('/players/signup', { username, email, password });
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

export const getQuestions = async () => {
    try {
        const response = await apiClient.get('/questions');
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

export const addQuestion = async (question) => {
    try {
        const response = await apiClient.post('/questions', question);
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

export const deleteQuestion = async (id) => {
    try {
        await apiClient.delete(`/questions/${id}`);
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

export const getSubjects = async () => {
    try {
        const response = await apiClient.get('/subjects');
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

export const addSubject = async (subject) => {
    try {
        const response = await apiClient.post('/subjects', subject);
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

export const deleteSubject = async (id) => {
    try {
        await apiClient.delete(`/subjects/${id}`);
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

export const getAnswerOperations = async () => {
    try {
        const response = await apiClient.get('/answer_operations');
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data.message : 'An error occurred');
    }
};

export const addAnswerOperation = async (answerOperation) => {
    try {
        const response = await apiClient.post('/answer_operations', answerOperation);
        return response.data;
    } catch (error) {
        console.error('Error adding answer operation:', error);
        throw error; // Ensure errors are thrown for handling
    }
};



export const deleteAnswerOperation = async (id) => {
    try {
        await apiClient.delete(`/answer_operations/${id}`);
    } catch (error) {
        throw new Error(handleApiError(error));
    }
};

export default apiClient;
