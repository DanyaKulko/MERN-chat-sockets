import React from 'react';
import styles from './Form.module.css'

export const FormContext = React.createContext({
    errors: {}
});

const Form = ({children, onSuccessSubmit, serverErrors, formData, rules, useStyles = true}) => {
    const [formErrors, setFormErrors] = React.useState({});

    const validate = (data, rules) => {
        const errors = {};
        Object.keys(rules).forEach((key) => {
                if (rules[key].required && !data[key]) {
                    errors[key] = 'This field is required';
                } else if (rules[key].minLength && data[key].length < rules[key].minLength) {
                    errors[key] = 'This field must be at least ' + rules[key].minLength + ' characters long';
                } else if (rules[key].maxLength && data[key].length > rules[key].maxLength) {
                    errors[key] = 'This field must be less than ' + rules[key].maxLength + ' characters long';
                } else if (rules[key].isEmail && !data[key].match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)) {
                    errors[key] = 'This field must be a valid email';
                } else if (rules[key].isPasswordMatch && data.password !== data.confirmPassword) {
                    errors[key] = 'Passwords do not match';
                }
            }
        );
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate(formData, rules)) {
            onSuccessSubmit(formData);
        }
    }

    return (
        <form onSubmit={handleSubmit} className={useStyles ? styles.form_block : ''}>
            <FormContext.Provider value={{errors: {...formErrors, ...serverErrors}}}>
                {children}
            </FormContext.Provider>
        </form>
    );
};

export default Form