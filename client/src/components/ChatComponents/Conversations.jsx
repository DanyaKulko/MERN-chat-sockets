import React, {useState} from 'react';
import $api from "../../http";
import {getChatData, setIsTyping} from "../../redux/actions/chatActions";
import {useDispatch, useSelector} from "react-redux";
import styles from "./ChatComponent.module.css";
import UserBlock from "./UserBlock/UserBlock";
import {useNavigate} from "react-router-dom";

const Conversations = () => {
    const [search, setSearch] = useState('');
    const [autoComplete, setAutoComplete] = useState([]);
    let navigate = useNavigate();

    const dispatch = useDispatch();
    const chatData = useSelector(state => state.chat);
    const userData = useSelector(state => state.user);

    let filterTimeout
    const debounce = (callback, time) => {
        clearTimeout(filterTimeout)

        filterTimeout = setTimeout(() => {
            callback()
        }, time)
    }

    const handleChange = (inputValue) => {
        setSearch(inputValue);

        if (inputValue.length === 0) {
            setAutoComplete([]);
            return;
        }

        $api.get('/user/usersAutocomplete', {
            params: {
                username: inputValue
            }
        }).then(res => {
            setAutoComplete(res.data.users);
        }).catch(err => {
            console.log(err);
        })
    }

    const handleChangeAutoComplete = (e) => {
        debounce(() => handleChange(e.target.value), 300)
    }

    const selectChat = (id) => {
        navigate('/chat/' + id);
        dispatch(setIsTyping(false))
        dispatch(getChatData(id));
        setAutoComplete([]);
    }

    return (
        <div className={styles.leftPart}>
            <div className={styles.input_search_block}>
                <input type="text" placeholder="Search" onChange={handleChangeAutoComplete}/>
                <div className={styles.input_autocomplete_block}>
                    {autoComplete.map((user, key) =>
                        <UserBlock
                            key={key}
                            data={user}
                            isAutocomplete={true}
                            userData={userData}
                            clickHandler={selectChat}/>
                    )}
                </div>
            </div>

            <div className={styles.conversations_list}>
                {chatData.chats.map((chat, key) =>
                    <UserBlock key={key} data={chat} userData={userData} clickHandler={selectChat}/>
                )}
            </div>


        </div>
    );
};

export default Conversations