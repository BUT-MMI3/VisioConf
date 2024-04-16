import "./ListeDiscussions.scss";
import LinkTo from "../../../elements/LinkTo/LinkTo.jsx";
import {useDiscussion} from "../context/DiscussionContext.jsx";
import {useSelector} from "react-redux";

export default function ListeDiscussions() {
    const {listeDiscussions, newDiscussion} = useDiscussion();
    const session = useSelector((state) => state.session);

    const handleNewDiscussion = () => {
        console.log("handleNewDiscussion");
        newDiscussion();
    };

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
                                        {(discussion.discussion_members.length === 2 && (
                                            <span className="liste-discussion--members">
                                                {discussion.discussion_name || discussion.discussion_members.find((m) => m.user_uuid !== session.user_uuid).user_firstname}
                                            </span>
                                        )) || (discussion.discussion_members.length > 2 && (
                                            <span className="liste-discussion--members">
                                                {discussion.discussion_name || discussion.discussion_members.filter((m) => m.user_uuid !== session.user_uuid).map((m) => m.user_firstname).join(', ')}
                                            </span>
                                        )) || (
                                            <span className="liste-discussion--members">
                                                {discussion.discussion_name || "Discussion vide"}
                                            </span>
                                        )}
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
