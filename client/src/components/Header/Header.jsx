import React from 'react';
import {NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../redux/actions/userActions";
import {closeMessage} from "../../redux/actions/notificationActions";
import styles from './Header.module.css';

const Header = () => {
    const user = useSelector(state => state.user);
    const notification = useSelector(state => state.notification);

    const dispatch = useDispatch();

    const logoutHandler = (e) => {
        e.preventDefault()
        dispatch(logout());
    }


    return (
        <>
            <div className={styles.header_outer}>
                <div className={`${styles.header} container`}>

                    <div className="header__logo">
                        <NavLink className={({isActive}) => isActive ? styles.active_link : ''} to='/'>Home</NavLink>
                    </div>
                    <div className="header__nav">
                        {user.isLoggedIn && <NavLink className={({isActive}) => isActive ? styles.active_link : ''} to='/chat'>Chat</NavLink>}
                    </div>
                    <div className={styles.header__controls}>
                        {user.isLoggedIn ?
                            (
                                <>
                                    <NavLink className={({isActive}) => isActive ? styles.active_link : ''} to='/profile'>Profile</NavLink>
                                    <NavLink to='#' onClick={logoutHandler}>Log out</NavLink>
                                </>
                            )
                            : (
                                <>
                                    <NavLink className={({isActive}) => isActive ? styles.active_link : ''} to='/login'>Login</NavLink>
                                    <NavLink className={({isActive}) => isActive ? styles.active_link : ''} to='/signup'>Sign Up</NavLink>
                                </>
                            )}
                    </div>

                </div>
            </div>


            {notification.isOpen && (
                <div className={`${styles.alert} ${styles['alert-' + notification.type]}`} role="alert">
                    <div className={styles.alert_header}>
                        <span className={styles.message_type}>{notification.type} message</span>
                        <span className={styles.close_btn} onClick={() => dispatch(closeMessage())}>x</span>
                    </div>
                    <div className={styles.alert_message_body}>
                        {notification.message}
                    </div>
                </div>
            )}
        </>
    );
};

export default Header