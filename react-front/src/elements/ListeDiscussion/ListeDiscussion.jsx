import "./ListeDiscussion.scss";
import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { socket } from "../../socket";
import SubscribeToEvent from "../SubscribeToEvent";
import { Link } from "react-router-dom";

export default function ListeDiscussion() {
  const location = useLocation();
  const [discussions, setDiscussions] = useState([]);

  const onListeDiscussionsRef = useRef((listeDiscussions) => {
    console.log("liste-discussions", listeDiscussions);
    setDiscussions(listeDiscussions);
  });

  useEffect(() => {
    socket.emit("fetch-discussions");

    const unsubscribe = SubscribeToEvent(
      "discussions-list",
      onListeDiscussionsRef.current
    );

    return () => {
      unsubscribe();
    };
  }, [location]);

  return (
    <div className="liste-discussion">
      <div className="liste-discussion--card">
        <h2>Discussions</h2>

        <Link to="/nouvelle-discussion">
          <button className="btn btn-primary">Nouvelle discussion</button>
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
