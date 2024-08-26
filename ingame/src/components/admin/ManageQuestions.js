import React, { useState, useEffect } from 'react';
import { getQuestions, addQuestion, deleteQuestion } from '../../services/apiService';

const ManageQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({
        text: '',
        correctAnswer: '',
        options: [''] // Initialize with one empty option
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

    const handleAddOption = () => {
        setNewQuestion({
            ...newQuestion,
            options: [...newQuestion.options, ''] // Add a new empty option
        });
    };

    const handleOptionChange = (index, value) => {
        const updatedOptions = newQuestion.options.map((option, i) =>
            i === index ? value : option
        );
        setNewQuestion({
            ...newQuestion,
            options: updatedOptions
        });
    };

    const handleAddQuestion = async () => {
        try {
            const addedQuestion = await addQuestion(newQuestion);
            setQuestions([...questions, addedQuestion]);
            setNewQuestion({ text: '', correctAnswer: '', options: [''] });
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
            {newQuestion.options.map((option, index) => (
                <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                />
            ))}
            <button onClick={handleAddOption}>Add Option</button>
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
