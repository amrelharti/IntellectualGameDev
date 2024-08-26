import React, { useState, useEffect } from 'react';
import { getQuestions, addAnswerOperation } from '../../services/apiService';

const ManageAnswerOperations = () => {
    const [questions, setQuestions] = useState([]);
    const [newAnswerOperation, setNewAnswerOperation] = useState({
        answerType: 'carre', // Default to 'carre'
        answer: '',
        score: 0,
        question: '',
        players: []
    });

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const fetchedQuestions = await getQuestions();
            setQuestions(fetchedQuestions);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    const handleAddAnswerOperation = async () => {
        let score;
        switch (newAnswerOperation.answerType) {
            case 'cash':
                score = 15;
                break;
            case 'carre':
                score = 10;
                break;
            case 'duo':
                score = 4;
                break;
            default:
                score = 0;
        }
        const operationToAdd = { ...newAnswerOperation, score };
        try {
            const addedAnswerOperation = await addAnswerOperation(operationToAdd);
            console.log('Added Answer Operation:', addedAnswerOperation);
        } catch (error) {
            console.error('Error adding answer operation:', error);
        }
    };

    return (
        <div className="manage-answer-operations">
            <select
                value={newAnswerOperation.question}
                onChange={(e) => setNewAnswerOperation({ ...newAnswerOperation, question: e.target.value })}
            >
                <option value="">Select Question</option>
                {questions.map(question => (
                    <option key={question.id} value={question.id}>{question.text}</option>
                ))}
            </select>
            <select
                value={newAnswerOperation.answerType}
                onChange={(e) => setNewAnswerOperation({ ...newAnswerOperation, answerType: e.target.value })}
            >
                <option value="carre">Carre</option>
                <option value="duo">Duo</option>
                <option value="cash">Cash</option>
            </select>
            <input
                type="text"
                value={newAnswerOperation.answer}
                onChange={(e) => setNewAnswerOperation({ ...newAnswerOperation, answer: e.target.value })}
                placeholder="Answer"
            />
            <input
                type="number"
                value={newAnswerOperation.score}
                onChange={(e) => setNewAnswerOperation({ ...newAnswerOperation, score: parseInt(e.target.value) })}
                placeholder="Score"
            />
            <button onClick={handleAddAnswerOperation}>Add Answer Operation</button>
        </div>
    );
};

export default ManageAnswerOperations;
