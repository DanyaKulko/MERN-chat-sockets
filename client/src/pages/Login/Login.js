import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {login} from "../../redux/actions/userActions";
import styles from "./Login.module.css";
import Form from "../../components/Form/Form/Form";
import FormInput from "../../components/Form/FormInput/FormInput";
import FormButton from "../../components/Form/FormButton/FormButton";
import FormTitle from "../../components/Form/FormTitle/FormTitle";
import {loginRules} from "../../utils/validationSchemas";


const Login = () => {
    const user = useSelector(state => state.user);
    const [formData, setFormData] = useState({username: '', password: ''});
    const navigate = useNavigate();

    const dispatch = useDispatch();


    useEffect(() => {
        if (user.isLoggedIn) {
            navigate('/');
        }
    }, [user.isLoggedIn])

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const successSubmit = () => {
        dispatch(login(formData.username, formData.password));
    }


    return (
        <div className={styles.form_outer}>
            <Form onSuccessSubmit={successSubmit}
                  rules={loginRules}
                  formData={formData}
                  serverErrors={user.errors}>
                <FormTitle>Login</FormTitle>

                <FormInput onChange={handleChange}
                           name='username'
                           type="text"
                           value={formData.username}
                           placeholder="john_smith228"
                           labelTitle='Email or Username'/>

                <FormInput onChange={handleChange}
                           name='password'
                           type="password"
                           value={formData.password}
                           placeholder="**********"
                           labelTitle='Password'/>


                <FormButton text="Login" disabled={!!user.isLoading}/>

            </Form>
        </div>
    );
};

export default Login