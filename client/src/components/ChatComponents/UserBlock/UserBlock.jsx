import React from 'react';
import {serverURI} from "../../../http";
import styles from "./UserBlock.module.css"
import {useSelector} from "react-redux";

const UserBlock = ({data, userData, isAutocomplete = false, clickHandler}) => {

    const current_chat = useSelector(state => state.chat.current_chat);

    const onlineField = data.isPrivate && data.users[0].isOnline
    let chatHeader = data.isPrivate ? data.users[0].username : 'Group chat';
    let chatContent = ''
    let fullLastMessageDate = ''
    let avatar = 'default.png'


    const getLastMessageDate = (lastMessageDate) => {
        let lastMessageTime = lastMessageDate.toLocaleTimeString().slice(0, -3);

        if(lastMessageDate.toDateString() !== new Date().toDateString()) {
            return lastMessageDate.toLocaleDateString() + ' ' + lastMessageTime
        } else {
            return lastMessageTime;
        }
    }
    const getLastSeenDate = (lastMessageDate) => {
        let lastMessageTime = lastMessageDate.toLocaleTimeString().slice(0, -3);

        if(lastMessageDate.toDateString() !== new Date().toDateString()) {
            return lastMessageDate.toLocaleDateString() + ' ' + lastMessageTime
        } else {
            return lastMessageTime;
        }
    }
    const getOnlineField = () => {
        if(data.isOnline) return 'Online';
        return 'Last seen: ' + getLastSeenDate(new Date(data.lastOnline))
    }

    if (isAutocomplete) {
        if(data.isAvatarSet) {
            avatar = data.avatar
        }
        chatHeader = data.username;
        chatContent = getOnlineField();
    } else {
        chatContent = data.isPrivate ? data.users[0].username : 'Group chat';
        let sender = data.lastMessage.user._id === userData.user.id ? 'You' : data.lastMessage.user.username;
        chatContent = `${sender}: ${data.lastMessage.message}`;
        if(data.users[0].isAvatarSet) {
            avatar = data.users[0].avatar
        }

        fullLastMessageDate = getLastMessageDate(new Date(data.lastMessage.createdAt));
    }



    return (
        <div className={`${styles.conversation_block} ${current_chat?._id === data._id ? styles.checked_chat : ''}`}
             onClick={() => clickHandler(data._id)}>
            <img className={styles.conversation_image}
                 src={`${serverURI}/user_profile_images/${avatar}`} alt=""/>
            <div className={styles.conversation_info}>
                <div className={styles.conversation_title}>{chatHeader}</div>
                <div
                    className={styles.conversation_last_message}>{chatContent}</div>
            </div>
            <div className={styles.conversation_last_message_time}>

                {fullLastMessageDate}
                {onlineField && <div className={styles.online_field}>Online</div>}
            </div>
        </div>
    );
};

export default UserBlock