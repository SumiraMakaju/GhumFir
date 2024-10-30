'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './slider.module.css';

const slides = [
  {
    image: '/slide2.jpg',
    name: 'Lumbini',
    description: 'Vibrant landscapes of Pokhara.',
  },
  {
    image: '/barunvalley.jpg', 
    name: 'Barun Valley',
    description: 'A breathtaking view of Barun Valley.',
  },
  {
    image: '/everest.jpg',
    name: 'Mt. Everest',
    description: 'The majestic beauty of Mt. Everest.',
  },
  {
    image: '/sarangkot_20180710001134.jpg',
    name: 'Sarangkot',
    description: 'Stunning views from Sarangkot.',
  },
  {
    image: '/slide1.jpg',
    name: 'Pokhara',
    description: 'Vibrant landscapes of Pokhara.',
  },
  {
    image: '/bhaktapur-city.webp',
    name: 'Bhaktapur',
    description: 'Vibrant landscapes of Pokhara.',
  },
  
  
  {
    image: '/tilicho.jpg',
    name: 'Tilicho Lake',
    description: 'Vibrant landscapes of Pokhara.',
  },

];

const Slider = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = useCallback(() => {
    setActiveIndex(prevIndex => (prevIndex + 1) % slides.length);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex(prevIndex => (prevIndex - 1 + slides.length) % slides.length);
  }, []);

  const handleThumbnailClick = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') handleNext();
      if (event.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

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

      <div className={styles.controlsleft}>
        <button onClick={handlePrev} className={styles.arrowButton}>‹</button>
      </div>
      <div className={styles.controlsright}>
        <button onClick={handleNext} className={styles.arrowButton}>›</button>
      </div>

      <div className={styles.descriptionContainer}>
        <h2>{slides[activeIndex].name}</h2>
        <p>{slides[activeIndex].description}</p>
      </div>
    </div>
  );
};

export default Slider;
