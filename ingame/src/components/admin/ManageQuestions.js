import React, { useState, useEffect } from 'react';
import { getQuestions, addQuestion, deleteQuestion } from '../../services/apiService';

const ManageQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({ text: '', correctAnswer: '', questionType: '' });

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

    const handleAddQuestion = async () => {
        try {
            const addedQuestion = await addQuestion(newQuestion);
            setQuestions([...questions, addedQuestion]);
            setNewQuestion({ text: '', correctAnswer: '', questionType: '' });
        } catch (error) {
            console.error('Error adding question:', error);
        }
    };

    const handleDeleteQuestion = async (id) => {
        try {
            await deleteQuestion(id);
            setQuestions(questions.filter(question => question.id !== id));
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };

    return (
        <div className="manage-questions">
            <h3>Manage Questions</h3>
            <input
                type="text"
                value={newQuestion.text}
                onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                placeholder="Question text"
            />
            <input
                type="text"
                value={newQuestion.correctAnswer}
                onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                placeholder="Correct answer"
            />
            <input
                type="text"
                value={newQuestion.questionType}
                onChange={(e) => setNewQuestion({ ...newQuestion, questionType: e.target.value })}
                placeholder="Question type"
            />
            <button onClick={handleAddQuestion}>Add Question</button>
            <ul>
                {questions.map(question => (
                    <li key={question.id}>
                        {question.text}
                        <button onClick={() => handleDeleteQuestion(question.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageQuestions;