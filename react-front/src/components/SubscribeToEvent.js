import { socket } from "../socket.js";

const SubscribeToEvent = (eventName, callback) => {
  socket.on(eventName, callback);

  return () => {
    socket.off(eventName, callback);
  };
};

export default SubscribeToEvent;
