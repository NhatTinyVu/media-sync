import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import MediaSync from "./containers/media-sync";
import { isEmpty } from "lodash";
import Register from "./containers/register";

import "antd/dist/antd.css";

import { getSocket } from "./containers/utils";

const App = () => {
  const [isReady, setIsReady] = useState(false);
  const [socketID, setSocketID] = useState(null);
  const [users, setUsers] = useState(null);
  const [host, setHost] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const socket = getSocket();

    socket.on("connect", () => {
      console.log("SOCKET CONNECTED!", socket.id);
      setSocketID(socket.id);
    });

    socket.on("users", (users) => {
      const newUsers = JSON.parse(users);
      console.log("users", newUsers);
      if (isEmpty(newUsers)) window.location.reload();

      setUsers(newUsers);
    });

    socket.on("host", (newHost) => {
      console.log("host", newHost);
      setHost(newHost);
    });

    socket.on("time", (newTime) => {
      console.log("time", newTime);
      setTime(newTime);
    });

    if (socket) return () => socket.disconnect();
  }, []);

  const handleOnRegistered = useCallback(() => setIsReady(true), []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      {!isReady && (
        <Register socketID={socketID} onComplete={handleOnRegistered} />
      )}
      {isReady && (
        <MediaSync time={time} socketID={socketID} users={users} host={host} />
      )}
    </>
  );
};

export default App;
