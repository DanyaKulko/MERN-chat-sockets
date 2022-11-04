import React, {useState} from 'react';
import styles from './Profile.module.css'
import {useDispatch, useSelector} from "react-redux";
import {updatePassword, updateProfileInfo, uploadAvatar} from "../../redux/actions/userActions";
import {serverURI} from "../../http";
import Form from "../../components/Form/Form/Form";
import FormButton from "../../components/Form/FormButton/FormButton";
import FormInput from "../../components/Form/FormInput/FormInput";
import FormFileUpload from "../../components/Form/FormFileUpload/FormFileUpload";
import {updatePasswordRules, updateProfileInfoRules} from "../../utils/validationSchemas";
import FormTitle from "../../components/Form/FormTitle/FormTitle";

const Profile = () => {
    const userData = useSelector(state => state.user);
    const dispatch = useDispatch();


    const handleImageChange = (e) => {
        if (!e.target.files[0]) return;
        const data = new FormData();
        data.append("avatar", e.target.files[0]);
        dispatch(uploadAvatar(data));
    }

    const avatar = userData.user.isAvatarSet ? userData.user.avatar : "default.png";

    const [formData, setFormData] = useState({
        username: userData.user.username,
        email: userData.user.email
    });

    const [passwordFormData, setPasswordFormData] = useState({
        oldPassword: "",
        password: "",
        confirmPassword: ""
    })

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }
    const handlePasswordChange = (e) => {
        setPasswordFormData({...passwordFormData, [e.target.name]: e.target.value});
    }

    const successSubmit = () => {
        dispatch(updateProfileInfo(formData));
    }

    const successPasswordChangeSubmit = () => {
        dispatch(updatePassword(passwordFormData));
    }

    return (
        <div className={`${styles.profile_forms_flex} container`} style={{display: 'flex'}}>
            <div className={`${styles.form_container} ${styles.image_form_container}`}>
                <img className={styles.profile_image} src={`${serverURI}/user_profile_images/${avatar}`} alt=""/>
                <Form useStyles={false}
                      onSuccessSubmit={successSubmit}
                      rules={updateProfileInfoRules}
                      formData={formData}
                      serverErrors={userData.errors}>

                    <FormFileUpload
                        onChange={handleImageChange}
                        accept='image/*'
                        name='avatar'
                        labelTitle='Upload avatar image'/>

                    <FormInput
                        labelTitle='Username'
                        name='username'
                        onChange={handleChange}
                        value={formData.username}/>

                    <FormInput
                        labelTitle='Email'
                        name='email'
                        onChange={handleChange}
                        value={formData.email}/>

                    <FormButton type="submit" text="Update"/>
                </Form>
            </div>

            <div className={styles.form_container}>
                <Form useStyles={false}
                      onSuccessSubmit={successPasswordChangeSubmit}
                      rules={updatePasswordRules}
                      formData={passwordFormData}
                      serverErrors={userData.errors}>

                    <FormTitle>Change password</FormTitle>

                    <FormInput
                        labelTitle='Old password'
                        name='oldPassword'
                        type='password'
                        placeholder='********'
                        onChange={handlePasswordChange}
                        />

                    <FormInput
                        labelTitle='Password'
                        name='password'
                        type='password'
                        placeholder='********'
                        onChange={handlePasswordChange}
                        />

                    <FormInput
                        labelTitle='Confirm password'
                        name='confirmPassword'
                        type='password'
                        placeholder='********'
                        onChange={handlePasswordChange}
                        />

                    <FormButton type="submit" text="Update"/>
                </Form>
            </div>

        </div>
    );
};

export default Profile