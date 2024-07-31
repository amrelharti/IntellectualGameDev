import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const loginUser = async (username, password) => {
    const response = await apiClient.post('/players/login', { username, password });
    return response.data;
};

export const signUpUser = async (username, password) => {
    const response = await apiClient.post('/players/signup', { username, password });
    return response.data;
};

export const getQuestions = async () => {
    const response = await apiClient.get('/questions');
    return response.data;
};

export const addQuestion = async (question) => {
    const response = await apiClient.post('/questions', question);
    return response.data;
};

export const deleteQuestion = async (id) => {
    await apiClient.delete(`/questions/${id}`);
};

export const getSubjects = async () => {
    const response = await apiClient.get('/subjects');
    return response.data;
};

export const addSubject = async (subject) => {
    const response = await apiClient.post('/subjects', subject);
    return response.data;
};

export const deleteSubject = async (id) => {
    await apiClient.delete(`/subjects/${id}`);
};

export const getAnswerOperations = async () => {
    const response = await apiClient.get('/answer_operations');
    return response.data;
};

export const addAnswerOperation = async (answerOperation) => {
    const response = await apiClient.post('/answer_operations', answerOperation);
    return response.data;
};

export const deleteAnswerOperation = async (id) => {
    await apiClient.delete(`/answer_operations/${id}`);
};

export default apiClient;