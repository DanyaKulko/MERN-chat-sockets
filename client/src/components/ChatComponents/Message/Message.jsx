import React from 'react';
import styles from "./Message.module.css";

const Message = ({showContextMenu, message, userData}) => {
    const isMine = message.user._id === userData.user.id;
    const time = new Date(message.createdAt).toLocaleTimeString().slice(0, -3);
    const isEdited = message.createdAt && message.createdAt !== message.updatedAt;

    return (
        <div className={`${styles.message} ${isMine ? styles.my_message : ''}`}
             onContextMenu={(e) => showContextMenu(e, message._id, isMine)}>
            <div>{message.message}</div>
            <div className={styles.message_info}>
                {message.temporary ?
                    <img className={styles.message_sending_image}
                         src="/images/send_image_loading.svg" alt=""/> :
                    (
                        <div className={styles.message_time}>
                            {time}
                        </div>
                    )}
                {isEdited && (
                    <div className={styles.message_edited}>
                        Edited
                    </div>
                )}
            </div>
        </div>
    );
};

export default Message