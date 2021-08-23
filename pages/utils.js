import SocketIOClient from "socket.io-client";

let socket = null;

export const getSocket = () => {
  if (!socket)
    socket = SocketIOClient.connect(process.env.BASE_URL, {
      path: "/api/socketio",
    });

  return socket;
};
