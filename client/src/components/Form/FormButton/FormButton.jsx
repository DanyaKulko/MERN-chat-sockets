import React from 'react';
import styles from "./FormButton.module.css";

const FormButton = ({handleSubmit, text, disabled = false}) => {
    return (
        <div className={styles.form_control}>
            <button className={styles.form_button} disabled={disabled} onSubmit={handleSubmit}
                    type="submit">{text}</button>
        </div>
    );
};

export default FormButton