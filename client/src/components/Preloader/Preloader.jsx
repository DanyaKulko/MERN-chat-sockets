import React from 'react';
import styles from './Preloader.module.css';

const Preloader = ({show}) => {
    return (
        <div className={`${styles.preloader_outer} ${show ? styles.preloader_visible : styles.preloader_invisible}`}>
            <div className={styles.preloader}></div>
        </div>
    );
};

export default Preloader