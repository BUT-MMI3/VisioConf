/* 
Author: @mathis-lambert
Date: Janvier 2024
*/

import { useDiscussion } from "../context/DiscussionContext.jsx";
import "./FilDiscussion.scss";
import { useRef, useEffect } from "react";
import Message from "../../../elements/Message/Message.jsx";

function FilDiscussion() {
  const { messages } = useDiscussion();

  // Scroll to bottom on messages change
  const messagesRef = useRef();

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
    console.log(messages)
  }, [messages]);

  return (
    <div className="fil-discussion-container">
      <div className="fil-discussion-container--scroll" ref={messagesRef}>
        <div className="fil-discussion">
          {/* Affichage des messages */}
          {messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FilDiscussion;
