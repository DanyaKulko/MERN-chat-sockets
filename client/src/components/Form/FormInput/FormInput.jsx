import React, {useContext} from 'react';
import styles from "./FormInput.module.css";
import {FormContext} from "../Form/Form";

const FormInput = ({onChange, labelTitle, ...args}) => {
    const formContext = useContext(FormContext);
    const error = formContext.errors[args.name]

    return (
        <div className={styles.form_control}>
            {labelTitle && <label className={styles.form_label}>{labelTitle}</label>}
            <input className={`${styles.form_input} ${error && styles.form_input_error}`}
                   onChange={onChange} {...args} />
            {error && <span className={styles.form_error}>{error}</span>}
        </div>
    );
};

export default FormInput