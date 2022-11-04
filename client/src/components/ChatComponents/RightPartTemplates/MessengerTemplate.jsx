import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {delete_message, messageEdit, sendMessage, setIsTyping} from "../../../redux/actions/chatActions";
import styles from "../ChatComponent.module.css";
import {serverURI} from "../../../http";
import Message from "../Message/Message";

const MessengerTemplate = () => {
    const [message, setMessage] = useState([]);
    const [typing, setTyping] = useState(false);
    const [editingMessage, setEditingMessage] = useState('');

    const userData = useSelector(state => state.user);
    const data = useSelector(state => state.chat);

    const dispatch = useDispatch();

    const bottomRef = useRef(null)
    const messageInputRef = useRef(null)
    const contextRef = useRef(null)
    const contextDeleteBtn = useRef(null)

    useEffect(() => {
        // hide the context menu when the user clicks outside it
        const handleClickOutside = (event) => {
            if (contextRef.current && !contextRef.current.contains(event.target)) {
                contextRef.current.style.display = 'none';
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])

    useEffect(() => {
        // scroll to the bottom of the chat when new messages are received
        if (data.chat_messages.length > 0) {
            bottomRef.current.scrollIntoView();
        }
    }, [data.chat_messages]);

    useEffect(() => {
        // update info on other chat open
        setMessage('');
        setTyping(false);
        messageInputRef.current.focus();
    }, [data.current_chat._id]);

    useEffect(() => {
        // update typing status
        dispatch(setIsTyping(typing));
        return () => {
            dispatch(setIsTyping(false));
        }
    }, [typing]);

    const avatar = data.current_chat.users[0].isAvatarSet ? data.current_chat.users[0].avatar : 'default.png';


    const getLastSeenDate = (lastMessageDate) => {
        let lastMessageTime = lastMessageDate.toLocaleTimeString().slice(0, -3);

        if (lastMessageDate.toDateString() !== new Date().toDateString()) {
            return lastMessageDate.toLocaleDateString() + ' ' + lastMessageTime
        } else {
            return lastMessageTime;
        }
    }

    const getOnlineField = () => {
        if (!data.current_chat.isPrivate) return null;
        if (data.current_chat.users[0].isOnline) return 'Online';
        return 'Last seen: ' + getLastSeenDate(new Date(data.current_chat.users[0].lastOnline))
    }


    const onMessageChange = (e) => {
        setMessage(e.target.value);
        setTyping(e.target.value.length > 0);
    }

    const sendMessageBtn = () => {
        if (!message.length) {
            return false;
        }

        if (editingMessage.length > 0) {
            dispatch(messageEdit(data.current_chat._id, editingMessage, message));
        } else {
            dispatch(sendMessage(data.current_chat._id, message, userData.user.id));
        }
        setMessage('');
        setEditingMessage('');
    }

    const messageChange = (e) => {
        if (e.keyCode === 13) {
            sendMessageBtn();
        }
    }

    const hideContextMenu = () => {
        contextRef.current.style.display = 'none';
    }

    const showContextMenu = (e, message_id, isMine) => {
        e.preventDefault();
        contextDeleteBtn.current.style.display = isMine ? 'block' : 'none';

        contextRef.current.style.display = 'block';
        contextRef.current.style.top = e.clientY + 'px';
        contextRef.current.style.left = e.clientX + 'px';
        contextRef.current.setAttribute('data-message-id', message_id);
    }

    const copyToClipboard = () => {
        const message_id = contextRef.current.getAttribute('data-message-id');
        const message = data.chat_messages.find(message => message._id === message_id).message;
        const textarea = document.createElement('textarea');
        textarea.value = message;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
        hideContextMenu();
    }

    const deleteMessage = () => {
        const message_id = contextRef.current.getAttribute('data-message-id');
        dispatch(delete_message(data.current_chat._id, message_id));
        hideContextMenu();
    }
    const editMessage = () => {
        const message_id = contextRef.current.getAttribute('data-message-id');
        setEditingMessage(message_id);
        const message = data.chat_messages.find(message => message._id === message_id).message;
        setMessage(message);
        setTyping(false);
        messageInputRef.current.focus();
        hideContextMenu();
    }

    const cancelEditing = () => {
        setEditingMessage('');
        setMessage('');
        setTyping(false);
        messageInputRef.current.focus();
    }

    return (
        <>
            <div className={styles.chat_messages_header}>

                <div className={styles.chat_messages_header_avatar}>
                    <img src={`${serverURI}/user_profile_images/${avatar}`} alt=""/>
                </div>
                <div>
                    <div className={styles.chat_messages_header_info_name}>
                        {data.current_chat.users[0].username}
                    </div>
                    <div>
                        {data.current_chat.users[0]?.isTyping ? 'Typing...' : getOnlineField()}
                    </div>
                </div>
            </div>
            <div className={styles.chat_messages_body}>
                <div className={styles.chat_messages_body_messages}>
                    {data.chat_messages.map((message, key) => <Message key={key} message={message} userData={userData}
                                                                       showContextMenu={showContextMenu}/>)}
                    <div className={styles.context_menu} ref={contextRef}>
                        <div className={styles.context_menu_item} onClick={copyToClipboard}>
                            {/*<img src="/images/context_menu_item_copy.svg" alt=""/>*/}
                            Copy
                        </div>
                        <div ref={contextDeleteBtn}>
                            <div className={styles.context_menu_item} onClick={editMessage}>
                                Edit
                            </div>
                            <div className={styles.context_menu_item} onClick={deleteMessage}>
                                {/*<img src="/images/context_menu_item_delete.svg" alt=""/>*/}
                                Delete
                            </div>

                        </div>
                    </div>

                    <div ref={bottomRef}/>
                </div>

                <div className={styles.chat_messages_input}>
                    <input type="text"
                           placeholder='Type here...'
                           value={message}
                           ref={messageInputRef}
                           onChange={onMessageChange}
                           onKeyUp={messageChange}/>
                    {editingMessage.length > 0 && (<span onClick={cancelEditing}>x</span>)}

                    <button className={styles.send_message_button}
                            onClick={sendMessageBtn}>{editingMessage.length > 0 ? 'Update' : 'Send'}</button>
                </div>
            </div>
        </>
    );
};

export default MessengerTemplate