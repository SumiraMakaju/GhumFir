'use client';

import { useState, useEffect } from 'react';
import styles from './slider.module.css';

const slides = [
  {
    image: '/images/barunvalley.jpg', // Corrected path
    name: 'Barun Valley',
    description: 'A breathtaking view of Barun Valley.',
  },
  {
    image: '/images/everest.jpg', // Corrected path
    name: 'Mt. Everest',
    description: 'The majestic beauty of Mt. Everest.',
  },
  {
    image: '/images/sarangkot_20180710001134.jpg', // Corrected path
    name: 'Sarangkot',
    description: 'Stunning views from Sarangkot.',
  },
  {
    image: '/images/slide1.jpg', // Corrected path
    name: 'Pokhara',
    description: 'Vibrant landscapes of Pokhara.',
  },
];

const Slider = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  // Handle keyboard events for left/right arrow keys
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        handleNext();
      } else if (event.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div
      className={styles.sliderContainer}
      style={{ backgroundImage: `url(${slides[activeIndex].image})` }}
    >
      <div className={styles.thumbnailContainer}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`${styles.thumbnail} ${index === activeIndex ? styles.active : ''}`}
            onClick={() => handleThumbnailClick(index)}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        ))}
      </div>

      <div className={styles.controlsright}>
        <button onClick={handleNext} className={styles.arrowButton}>›</button>
      </div>
      <div className={styles.controlsleft}>
        <button onClick={handlePrev} className={styles.arrowButton}>‹</button>
      </div>

      <div className={styles.descriptionContainer}>
        <h2>{slides[activeIndex].name}</h2>
        <p>{slides[activeIndex].description}</p>
      </div>
    </div>
  );
};

export default Slider;
