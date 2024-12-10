import React from 'react';
import styles from './home.module.css';
import axios from 'axios';


  
const HomePage = () => {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
            <div className={styles.leftSection}>
                    <div className={styles.logo}>Ghumfir</div>
                    <div className={styles.searchContainer}>
                        <input
                            type="text"
                            placeholder="Places to go, things to do..."
                            className={styles.searchInput}
                        />
                        <button className={styles.searchButton}>Search</button>
                    </div>
                </div>  
                <nav className={styles.nav}>
                    <a href="#">Discover</a>
                    <a href="#">Trips</a>
                    <a href="#">Review</a>
                    <a href="#">More</a>
                </nav>
                <div className={styles.profileMenu}>
                <a href="#">Notifications</a>
                <a href="#">Messages</a>
                    <div className={styles.profileDropdown}>
                        <span>Profile</span>
                        <div className={styles.dropdownContent}>
                            <a href="#">Trips</a>
                            <a href="#">Write a review</a>
                            <a href="#">Profile</a>
                            <a href="#">Bookings</a>
                            <a href="#">Account info</a>
                            <a href="#">Sign out</a>
                        </div>
                    </div>
                </div>
            </header>
          
        </div>
    );
};

export default HomePage;