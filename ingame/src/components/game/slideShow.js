import React, { useState, useEffect } from 'react';
import './slideShow.css';
import il from '../../images/il.jpg'
import il2 from '../../images/il2.jpg'
import il3 from '../../images/il3.jpg'
import il4 from '../../images/il4.jpg'
const images = [
    il, // Update with the correct paths to your images
    il2,
    il3,
    il4,
];

const Slideshow = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000);

        return () => clearInterval(interval); // Cleanup the interval on component unmount
    }, []);

    return (
        <div
            className="slideshow-background"
            style={{ backgroundImage: `url(${images[currentIndex]})` }}
        >
            {/* Add any content you want to overlay on the background */}
        </div>
    );
};

export default Slideshow;
