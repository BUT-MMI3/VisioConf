/*
Author: @arthur-mdn
Date: Janvier 2024
*/

import './Message.css';
import FeatherIcon from "feather-icons-react";

const Message = ({message}) => {
    const messageClass = (message.message_sender === "actualUser") ? 'message current-user' : 'message';// PS : comparer l'id de l'utilisateur actuel avec l'id de l'expéditeur (pour tester la vue current-user, changez "===" par "!==")
    const formattedTime = new Date(message.message_date_create).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
    let statusIcon;
    if (message.message_status === "sending") {
        statusIcon = <FeatherIcon icon="loader"/>;
    } else if (message.message_status === "sent") {
        statusIcon = <FeatherIcon icon="check"/>;
    } else if (message.message_status === "check-sent") {
        statusIcon = <FeatherIcon icon="check-circle"/>;
    }
    return (

        <div className={messageClass}>
            <div className={"profile-picture-and-content"}>
                <img className={"profile-picture"} src={message.sender} alt={"profile pic"}/>
                <div className={"content"}>
                    <p>{message.message_content}</p>
                </div>
            </div>
            <div className={"time-and-status"}>
                <span className={"time"}>{formattedTime}</span>
                <span className={"status"}>{statusIcon}</span>
            </div>
        </div>
    );
};

export default Message;
