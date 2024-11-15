import React from 'react';
import styles from './HomePage.module.css';

const HomePage = () => {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.logo}>Ghumfir</div>
                <nav className={styles.nav}>
                    <a href="#">Discover</a>
                    <a href="#">Trips</a>
                    <a href="#">Review</a>
                    <a href="#">More</a>
                </nav>
                <div className={styles.profileMenu}>
                    <span>USD</span>
                    <div className={styles.profileDropdown}>
                        <span>Account</span>
                        <div className={styles.dropdownContent}>
                            <a href="#">Trips</a>
                            <a href="#">Write a review</a>
                            <a href="#">Profile</a>
                            <a href="#">Bookings</a>
                            <a href="#">Messages</a>
                            <a href="#">Account info</a>
                            <a href="#">Sign out</a>
                        </div>
                    </div>
                </div>
            </header>
            <main className={styles.main}>
                <h1 className={styles.title}>Where to?</h1>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Places to go, things to do, hotels..."
                        className={styles.searchInput}
                    />
                    <button className={styles.searchButton}>Search</button>
                </div>
                <div className={styles.banner}>
                    <h2>AI Trip Builder Gets You Out There</h2>
                    <p>Get a whole getaway's worth of ideas made for you—ready in seconds.</p>
                    <button className={styles.tryButton}>Try it</button>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
