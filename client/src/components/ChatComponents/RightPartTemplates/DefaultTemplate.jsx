import React from 'react';
import styles from "../ChatComponent.module.css";

const DefaultTemplate = () => {
    return (
        <div className={styles.select_chat}>
            👈 Please select a chat to start chatting...
        </div>
    );
};

export default DefaultTemplate