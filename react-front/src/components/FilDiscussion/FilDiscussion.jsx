/* 
Author: @mathis-lambert
Date: Janvier 2024
*/

import { useDiscussion } from "./DiscussionContext";
import "./FilDiscussion.scss";
import { useRef, useEffect } from "react";

function FilDiscussion() {
  const { messages } = useDiscussion();

  // Scroll to bottom on messages change
  const messagesRef = useRef();

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="fil-discussion-container" ref={messagesRef}>
      <div className="fil-discussion">
        {/* Affichage des messages */}
        {messages.map((message, index) => (
          <div key={index} className="message">
            {message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FilDiscussion;
