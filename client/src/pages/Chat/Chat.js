import React, {useEffect} from 'react';
import {useDispatch} from "react-redux";
import {getAllChats, getChatData} from "../../redux/actions/chatActions";
import Conversations from "../../components/ChatComponents/Conversations";
import RightPart from "../../components/ChatComponents/RightPart";
import styles from "./Chat.module.css";
import {useParams} from "react-router-dom";

const Chat = () => {
    const { chatId } = useParams();
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(getAllChats());
    } , []);



    return (
        <div className={`${styles.chat_container} container`}>
            <Conversations/>
            <RightPart chatId={chatId} />
        </div>
    );
};

export default Chat