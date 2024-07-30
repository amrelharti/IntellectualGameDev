import React, { useState, useEffect } from 'react';
import { getAnswerOperations, addAnswerOperation, deleteAnswerOperation } from '../../services/apiService';

const ManageAnswerOperations = () => {
    const [answerOperations, setAnswerOperations] = useState([]);
    const [newAnswerOperation, setNewAnswerOperation] = useState({
        answerType: '',
        answer: '',
        score: 0,
        question: '',
        players: []
    });

    useEffect(() => {
        fetchAnswerOperations();
    }, []);

    const fetchAnswerOperations = async () => {
        try {
            const fetchedOperations = await getAnswerOperations();
            setAnswerOperations(fetchedOperations);
        } catch (error) {
            console.error('Error fetching answer operations:', error);
        }
    };

    const handleAddAnswerOperation = async () => {
        try {
            const addedOperation = await addAnswerOperation(newAnswerOperation);
            setAnswerOperations([...answerOperations, addedOperation]);
            setNewAnswerOperation({
                answerType: '',
                answer: '',
                score: 0,
                question: '',
                players: []
            });
        } catch (error) {
            console.error('Error adding answer operation:', error);
        }
    };

    const handleDeleteAnswerOperation = async (id) => {
        try {
            await deleteAnswerOperation(id);
            setAnswerOperations(answerOperations.filter(op => op.id !== id));
        } catch (error) {
            console.error('Error deleting answer operation:', error);
        }
    };

    return (
        <div className="manage-answer-operations">
            <h3>Manage Answer Operations</h3>
            <input
                type="text"
                value={newAnswerOperation.answerType}
                onChange={(e) => setNewAnswerOperation({ ...newAnswerOperation, answerType: e.target.value })}
                placeholder="Answer type"
            />
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
            <input
                type="text"
                value={newAnswerOperation.question}
                onChange={(e) => setNewAnswerOperation({ ...newAnswerOperation, question: e.target.value })}
                placeholder="Question ID"
            />
            <input
                type="text"
                value={newAnswerOperation.players.join(',')}
                onChange={(e) => setNewAnswerOperation({ ...newAnswerOperation, players: e.target.value.split(',') })}
                placeholder="Player IDs (comma separated)"
            />
            <button onClick={handleAddAnswerOperation}>Add Answer Operation</button>
            <ul>
                {answerOperations.map(op => (
                    <li key={op.id}>
                        {op.answer} - {op.score} points
                        <button onClick={() => handleDeleteAnswerOperation(op.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageAnswerOperations;