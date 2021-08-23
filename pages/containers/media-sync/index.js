import React, { useEffect } from "react";
import SocketIOClient from "socket.io-client";

import MediaPlayer from "../../components/media-player";
import User from "../../components/user";
import styles from "../../../styles/Home.module.css";

export default function Home() {
  useEffect(() => {
    const socket = SocketIOClient.connect(process.env.BASE_URL, {
      path: "/api/socketio",
    });

    socket.on("connect", () => {
      console.log("SOCKET CONNECTED!", socket.id);
    });

    if (socket) return () => socket.disconnect();
  }, []);

  return (
    <div className={styles.container}>
      <User name="Nhat Vu" />
      <MediaPlayer />
    </div>
  );
}
