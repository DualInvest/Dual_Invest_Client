import React, { useState, useEffect } from "react";
import { SlidingImagesArray } from "../../data.js";
import "./slidingImages.css"; // Import the CSS file for styling

export default function SlidingImages() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to update the current index
  const updateIndex = (index) => {
    setCurrentIndex((prevIndex) => (index + SlidingImagesArray.length) % SlidingImagesArray.length);
  };

  // Set up the interval to change the image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      updateIndex(currentIndex + 1);
    }, 5000);
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [currentIndex]);

  // Handle scrolling
  useEffect(() => {
    const handleScroll = () => {
      updateIndex(currentIndex + 1);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup event listener
  }, [currentIndex]);

  return (
    <div className="sliding-images-container">
      {SlidingImagesArray.map((image, index) => (
        <div
          key={index}
          className={`sliding-image ${index === currentIndex ? "active" : ""}`}
          style={{ backgroundImage: `url(${image.url})` }}
        >
        </div>
      ))}
    </div>
  );
}
