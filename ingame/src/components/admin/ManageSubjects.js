import React, { useState, useEffect } from 'react';
import { getSubjects, addSubject, deleteSubject } from '../../services/apiService';

const ManageSubjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [newSubject, setNewSubject] = useState('');

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const fetchedSubjects = await getSubjects();
            setSubjects(fetchedSubjects);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    const handleAddSubject = async () => {
        try {
            const addedSubject = await addSubject({ name: newSubject });
            setSubjects([...subjects, addedSubject]);
            setNewSubject('');
        } catch (error) {
            console.error('Error adding subject:', error);
        }
    };

    const handleDeleteSubject = async (id) => {
        try {
            await deleteSubject(id);
            setSubjects(subjects.filter(subject => subject.id !== id));
        } catch (error) {
            console.error('Error deleting subject:', error);
        }
    };

    return (
        <div className="manage-subjects">
            <h3>Manage Subjects</h3>
            <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="New subject name"
            />
            <button onClick={handleAddSubject}>Add Subject</button>
            <ul>
                {subjects.map(subject => (
                    <li key={subject.id}>
                        {subject.name}
                        <button onClick={() => handleDeleteSubject(subject.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageSubjects;