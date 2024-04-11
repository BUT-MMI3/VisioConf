/*
Author: @arthur-mdn
Date: Janvier 2024
*/

import './Message.scss';
import FeatherIcon from "feather-icons-react";
import {useSelector} from "react-redux";
import {
    Loader,
    Check,
    CheckCircle
} from "react-feather";

const Message = ({message}) => {
    const session = useSelector((state) => state.session);

    const formattedTime = new Date(message.message_date_create).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (

        <div className={(message.message_sender.user_uuid === session.user_uuid) ? 'message current-user' : 'message'}>
            <div className={"profile-picture-container"}>
                <img className={"profile-picture"} src={message.message_sender.user_picture} alt={"profile pic"}/>
            </div>
            <div className="message-box">
                <div className={"content"}>
                    <p>{message.message_content}</p>
                </div>
                <div className={"time-and-status"}>
                    <span className={"time"}>{formattedTime}</span>
                    <span className={"status"}>
                    {message.message_status === "sending" ? <Loader/> : message.message_status === "sent" ? <Check/> :
                        <CheckCircle/>}
                </span>
                </div>
            </div>
        </div>
    );
};

export default Message;
