import "./ListeDiscussion.scss";
import {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import {controller} from "../../controller/index.js";

const listeMessageEmis = [
    "nouvelle_discussion",
]

const listeMessageRecus = [
    "liste_discussions",
    "liste_messages",
]

export default function ListeDiscussion() {
    const instanceName = "ListeDiscussion";
    const verbose = false;

    const [discussions, setDiscussions] = useState([]);

    const {current} = useRef({
        instanceName,
        traitementMessage: (msg) => {
            if (verbose || controller.verboseall) console.log(`INFO (${instanceName}) - traitementMessage : `, msg);


            if (typeof msg.liste_discussions !== "undefined") {
                setDiscussions(msg.liste_discussions);
            }
        }
    });

    useEffect(() => {
        controller.subscribe(current, listeMessageEmis, listeMessageRecus);

        return () => {
            controller.unsubscribe(current, listeMessageEmis, listeMessageRecus);
        }
    }, [current]);

    return (
        <div className="liste-discussion">
            <div className="liste-discussion--card">
                <h2>Discussions</h2>

                <Link to="/nouvelle-discussion">
                    <button className="btn btn-primary">
                        Nouvelle discussion
                    </button>
                </Link>

                <div className="liste-discussion--container">
                    <div className="liste-discussion--scroll">
                        <ul className="liste-discussion--list">
                            {discussions.map((discussion) => (
                                <li key={discussion.discussion_uuid}>
                                    <Link
                                        to={`/discussion/${discussion.discussion_uuid}`}
                                        className="liste-discussion--item"
                                    >
                                        {discussion.discussion_name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
