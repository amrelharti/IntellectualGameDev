import React from 'react';
import ManageQuestions from './ManageQuestions';
import ManageSubjects from './ManageSubjects';
import ManageAnswerOperations from './ManageAnswerOperations';

const AdminPanel = () => {
    return (
        <div className="admin-panel">
            <h2>Admin Panel</h2>
            <ManageQuestions />
            <ManageSubjects />
            <ManageAnswerOperations />
        </div>
    );
};

export default AdminPanel;