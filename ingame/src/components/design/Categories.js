import React from 'react';
import './Categories.css';
import scienceImage from '../../images/science.jpg';
import olympics from '../../images/olympics.jpg';
import history from '../../images/history.webp';
import cinema from '../../images/cinema2.jpg';



const categories = [
    {
        title: "Science",
        image: scienceImage
    },

    {
        title: "Olympics",
        image: olympics
    },
    {
        title: "History",
        image: history
    },


    // Add more categories as needed
];

const Categories = () => {
    return (
        <div className="categories-container">
            {categories.map((category, index) => (
                <div key={index} className="category-card">
                    <img src={category.image} alt={category.title} className="category-image" />
                    <div className="category-title">{category.title}</div>
                </div>
            ))}
        </div>
    );
};

export default Categories;