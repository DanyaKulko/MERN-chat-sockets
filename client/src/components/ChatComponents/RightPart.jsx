import React, {useEffect} from 'react';
import styles from './ChatComponent.module.css';
import {useDispatch, useSelector} from "react-redux";
import MessengerTemplate from "./RightPartTemplates/MessengerTemplate";
import DefaultTemplate from "./RightPartTemplates/DefaultTemplate";
import {getChatData} from "../../redux/actions/chatActions";

const RightPart = ({chatId}) => {
    const data = useSelector(state => state.chat);
    const dispatch = useDispatch();

    useEffect(() => {
        if (chatId) {
            dispatch(getChatData(chatId));
        }
    }, [])


    return (
        <div className={styles.rightPart}>
            {data.current_chat ? <MessengerTemplate/> : <DefaultTemplate/>}
        </div>
    );
};

export default RightPart