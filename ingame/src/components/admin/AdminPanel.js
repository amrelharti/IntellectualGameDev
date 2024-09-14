import React, { useState } from 'react';
import ManageQuestions from './ManageQuestions';
import ManageSubjects from './ManageSubjects';
import ManageAnswerOperations from './ManageAnswerOperations';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './AdminPanel.css';

const AdminPanel = () => {
    const [activeSection, setActiveSection] = useState(null);

    const toggleSection = (section) => {
        setActiveSection(activeSection === section ? null : section);
    };

    return (
        <div className="admin-panel">
            <h2>Admin Panel</h2>

            <div className={`manage-section ${activeSection === 'questions' ? 'active' : ''}`}>
                <h3 onClick={() => toggleSection('questions')}>
                    Manage Questions {activeSection === 'questions' ? <FaChevronUp /> : <FaChevronDown />}
                </h3>
                <div className="content">
                    {activeSection === 'questions' && <ManageQuestions />}
                </div>
            </div>

            <div className={`manage-section ${activeSection === 'subjects' ? 'active' : ''}`}>
                <h3 onClick={() => toggleSection('subjects')}>
                    Manage Subjects {activeSection === 'subjects' ? <FaChevronUp /> : <FaChevronDown />}
                </h3>
                <div className="content">
                    {activeSection === 'subjects' && <ManageSubjects />}
                </div>
            </div>

        </div>
    );
};

export default AdminPanel;
