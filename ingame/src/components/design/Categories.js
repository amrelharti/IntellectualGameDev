import React from 'react';
import './Categories.css';
import scienceImage from '../../images/science.jpg';
import olympics from '../../images/olympics.jpg';
import history from '../../images/history.webp';
import vg from '../../images/VG.jpg';
import food from '../../images/food.webp';
import f1 from '../../images/F1.jpg';
import sport from '../../images/sport.jpg';
import code from '../../images/code.jpg';

const categories = [
    { title: "Science", image: scienceImage },
    { title: "Coding", image: code },
    { title: "Sport", image: sport },
    { title: "Video Games", image: vg },
    { title: "Food", image: food },
    { title: "Formula 1", image: f1 },
    { title: "Olympics", image: olympics },
    { title: "History", image: history },
];

const Categories = () => {
    return (
        <div className="categories-container" id={"Categories"}>
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
