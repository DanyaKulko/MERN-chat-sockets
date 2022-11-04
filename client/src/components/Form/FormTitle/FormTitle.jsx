import React from 'react';
import styles from './FormTitle.module.css';

const FormTitle = ({children}) => {
    return (
        <h1 className={styles.form_title}>
            {children}
        </h1>
    );
};

export default FormTitle