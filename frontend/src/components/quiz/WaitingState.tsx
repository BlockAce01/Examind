import React from 'react';
import styles from './WaitingState.module.css';

const WaitingState = () => {
    return (
        <div className={styles.waitingContainer}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
        </div>
    );
};

export default WaitingState;
