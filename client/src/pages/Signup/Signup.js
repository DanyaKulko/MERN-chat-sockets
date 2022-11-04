import React, {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {signup} from "../../redux/actions/userActions";
import {useDispatch, useSelector} from "react-redux";
import styles from '../Login/Login.module.css';
import FormInput from "../../components/Form/FormInput/FormInput";
import Form from "../../components/Form/Form/Form";
import FormButton from "../../components/Form/FormButton/FormButton";
import FormTitle from "../../components/Form/FormTitle/FormTitle";
import {signupRules} from "../../utils/validationSchemas";

const Signup = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    const [formData, setFormData] = useState({
        username: '', email: '', password: '', confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    useEffect(() => {
        if (user.isLoggedIn) {
            navigate('/');
        }
    }, [user])


    const successSubmit = () => {
        dispatch(signup(formData.username, formData.email, formData.password));
    }

    return (
        <div className={styles.form_outer}>
            <Form
                onSuccessSubmit={successSubmit}
                rules={signupRules}
                formData={formData}
                serverErrors={user.errors}>

                <FormTitle>Sign Up</FormTitle>

                <FormInput onChange={handleChange}
                           name='username'
                           type="text"
                           value={formData.username}
                           placeholder="john_smith228"
                           labelTitle='Username'/>

                <FormInput onChange={handleChange}
                           name='email'
                           type="email"
                           value={formData.email}
                           placeholder="john_smith@gmail.com"
                           labelTitle='Email'/>

                <FormInput onChange={handleChange}
                           name='password'
                           type="password"
                           value={formData.password}
                           placeholder="**********"
                           labelTitle='Password'/>

                <FormInput onChange={handleChange}
                           name='confirmPassword'
                           type="password"
                           value={formData.confirmPassword}
                           placeholder="**********"
                           labelTitle='Confirm password'/>

                <FormButton text="Sign up" disabled={!!user.isLoading}/>

            </Form>
        </div>

    );
};

export default Signup