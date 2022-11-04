import React from 'react';
import {NavLink} from "react-router-dom";
import styles from './HomePage.module.css'

const HomePage = () => {
    return (
        <div className={`${styles.main_container} container`}>
            <h1 className={styles.title}><img src="/images/waving_hand.svg" alt='waving hand'/> Hi there!</h1>

            This is my test MERN chat project.

            <br/>
            <br/>

            I tried make client-side by more native way, without using lots of third-party libraries, <b>just native way</b>.
            For example it was created Debounce function, Smooth preloader opening and closing, Form components with
            validation etc... This project <b>is not</b> a full-fledged MERN chat application. It's just a test project.
            It was made from scratch, without using any code from any other projects and tutorials.

            <br/>
            <br/>

            Actually I am not a designer, I made this project just for fun.

            <br/>
            <br/>

            Chat Link: <NavLink to='/chat'>Chat</NavLink> (to go there you should login first)

            <br/>

            <h3 className={styles.list_title}>Some more info:</h3>
            <ul className={styles.list}>
                <li>
                    Chatting system: Socket.io
                </li>
                <li>
                    Authentication system: JWT
                </li>
                <li>
                    Database: MongoDB
                </li>
                <li>
                    Server: Node.js + Express.js + Socket.io
                </li>
                <li>
                    Client: React.js + Redux + Socket.io
                </li>
            </ul>

            <br/>

            A lot of work has been done on this project


            <h3 className={styles.list_title}>Some features that already exist:</h3>
            <ul className={styles.list}>
                <li>
                    Login/Sign Up/Profile form validation
                </li>
                <li>
                    Live time sending messages
                </li>
                <li>
                    Search bar to find any user you want to chat with
                </li>
                <li>
                    Live time updating online/offline users
                </li>
                <li>
                    Live time showing typing status
                </li>
            </ul>

            <br/>


            Of course there is a lot of ideas to implement, but I am not sure if I will be able to do it in a short
            time.

            <h3 className={styles.list_title}>Some ideas to implement:</h3>
            <ul className={styles.list}>
                <li>
                    Responsive design
                </li>
                <li>
                    <s>Full profile page with changing avatar</s> - done ✅
                </li>
                <li>
                    Creating group chats with admins
                </li>
                <li>
                    <s>Deleting and copying messages from chat</s> - done ✅
                </li>
                <li>
                    <s>Edit messages in chat</s> - done ✅
                </li>
            </ul>

            <br/>

            <h3 className={styles.list_title}>Additional:</h3>
            If you want to contact me or see more info about this project, you can find me on telegram: <a
            target='_blank' href='https://t.me/danya_kulko'>@danya_kulko</a>

            <br/>
            <br/>
            <br/>



            <div className={styles.enjoy_project}><img src="/images/heart.svg" alt="hugging"/>I really hope you will
                enjoy this project.
            </div>
        </div>
    );
};

export default HomePage