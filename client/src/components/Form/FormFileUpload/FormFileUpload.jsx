import React, {createRef, useContext} from 'react';
import styles from './FormFileUpload.module.css';
import {FormContext} from "../Form/Form";

const FormFileUpload = ({labelTitle, onChange, ...args}) => {
    const formContext = useContext(FormContext);
    const error = formContext.errors[args.name]
    const fileRef = createRef();

    return (
        <div className={styles.form_control}>
            {labelTitle && <label className={styles.form_label}>{labelTitle}</label>}
            <input type='button' value='Select Avatar' className={styles.file_upload_button} onClick={() => fileRef.current.click()} />
            <input onChange={onChange} type='file' hidden={true} ref={fileRef} {...args} />
            {/*{error && <span className={styles.form_error}>{error}</span>}*/}
        </div>
    );
};

export default FormFileUpload