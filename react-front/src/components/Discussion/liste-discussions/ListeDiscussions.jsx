import "./ListeDiscussions.scss";
import {useEffect, useRef, useState} from "react";
import LinkTo from "../../../elements/LinkTo/LinkTo.jsx";
import {appInstance} from "../../../controller/index.js";
import {useDiscussion} from "../context/DiscussionContext.jsx";

export default function ListeDiscussions() {


    const {listeDiscussions, newDiscussion} = useDiscussion();

    const handleNewDiscussion = () => {
        console.log("handleNewDiscussion");
        newDiscussion();
    }

    return (
        <div className="liste-discussion">
            <div className="liste-discussion--card">
                <h2>Discussions</h2>

                <button className="btn btn-tertiary" onClick={handleNewDiscussion}>
                    Nouvelle discussion
                </button>

                <div className="liste-discussion--container">
                    <div className="liste-discussion--scroll">
                        <ul className="liste-discussion--list">
                            {listeDiscussions?.map((discussion) => (
                                <li key={discussion.discussion_uuid}>
                                    <LinkTo
                                        to={`/discussion/${discussion.discussion_uuid}`}
                                        className="liste-discussion--item"
                                    >
                                        {discussion.discussion_name}
                                        {discussion.discussion_messages.length > 0 && (
                                        <span className="liste-discussion--last-message">
                                            <span className="message">
                                                De {discussion.discussion_messages[discussion.discussion_messages.length - 1].message_sender.user_firstname}
                                            &nbsp;:&nbsp;
                                            {discussion.discussion_messages[discussion.discussion_messages.length - 1].message_content}
                                            </span>
                                            <span className="date">
                                                {new Date(discussion.discussion_messages[discussion.discussion_messages.length - 1].message_date_create?.split("T")[0]).toLocaleDateString("fr-FR", {
                                                    month: "2-digit",
                                                    day: "2-digit",
                                                })}
                                            </span>
                                        </span>
                                    )}
                                    </LinkTo>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
