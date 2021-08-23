import { Server as ServerIO } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function socket(req, res) {
  if (!res.socket.server.io) {
    console.log("New Socket.io server...");
    const io = new ServerIO(res.socket.server, { path: "/api/socketio" });
    res.socket.server.io = io;
  }
  res.end();
}
