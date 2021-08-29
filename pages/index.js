import React, { useState, useMemo, useEffect } from "react";
import Head from "next/head";
import SocketIOClient from "socket.io-client";
import { isEmpty, random } from "lodash";

import WorkoutTogether from "./containers/WorkoutTogether";

import "antd/dist/antd.css";

const navbarStyle = {
  background: `rgb(9,9,121)`,
  background: `linear-gradient(90deg, rgba(9,9,121,1) 0%, rgba(65,65,176,1) 52%, rgba(9,9,121,1) 82%, rgba(65,65,176,1) 100%)`,
  padding: 16,
};
const titleStyle = { color: "white", fontWeight: "bold", fontSize: 20 };

let socket = null;

export const getSocket = () => {
  if (!socket)
    socket = SocketIOClient.connect(process.env.BASE_URL, {
      path: "/api/socketio",
    });

  return socket;
};

function makeID(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return new Date().toISOString() + result;
}

const getSocketID = () => {
  let socketID = window?.localStorage?.getItem("socketID");
  if (!socketID || socketID === "null" || socketID === "undefined") {
    socketID = makeID(8);
    window?.localStorage?.setItem("socketID", socketID);
  }

  return socketID;
};

const genBackgroundID = () => random(1, 3);

const useBackground = () => {
  const [backgroundID, setBackgroundID] = useState(genBackgroundID());
  const style = useMemo(
    () => ({
      backgroundImage: `url(/gym-${backgroundID}.jpeg)`,
      backgroundPosition: "top",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      height: "100%",
      position: "relative",
      minHeight: "100vh",
    }),
    [backgroundID]
  );

  return [style, setBackgroundID];
};

const App = () => {
  const [users, setUsers] = useState(null);
  const [host, setHost] = useState("");
  const [time, setTime] = useState("");
  const [socketID, setSocketID] = useState("");
  const [program, setProgram] = useState([]);
  const [currentProgram, setCurrentProgram] = useState("");
  const [currentPlayingStatus, setCurrentPlayingStatus] = useState(true);
  const [backgroundStyle] = useBackground();

  useEffect(() => {
    console.log("getSocketID()", getSocketID());
    setSocketID(getSocketID());
    const socket = getSocket();

    socket.on("connect", () => {
      console.log("SOCKET CONNECTED!", socket.id);
    });

    socket.on("users", (users) => {
      const newUsers = JSON.parse(users);
      console.log("users", newUsers);
      if (isEmpty(newUsers)) {
        window?.localStorage?.setItem("socketID", undefined);
        window?.localStorage?.clear();
        window.location.reload();
      }

      setUsers(newUsers);
    });

    socket.on("host", (newHost) => {
      console.log("host", newHost);
      setHost(newHost);
    });

    socket.on("time", (newTime) => {
      console.log("time", newTime);
      setTime(newTime ? Number(newTime) : newTime);
    });

    socket.on("program", (newProgram) => {
      console.log("program", newProgram);
      setProgram(newProgram ? JSON.parse(newProgram) : []);
    });

    socket.on("currentProgram", (newCurrentProgram) => {
      console.log("currentProgram", newCurrentProgram);
      setCurrentProgram(JSON.parse(newCurrentProgram));
    });

    socket.on("currentPlayingStatus", (newCurrentPlayingStatus) => {
      console.log("currentPlayingStatus", newCurrentPlayingStatus);
      setCurrentPlayingStatus(JSON.parse(newCurrentPlayingStatus));
    });

    if (socket) return () => socket.disconnect();
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div style={navbarStyle}>
        <div style={titleStyle}>TẬP LUYỆN CÙNG NHAU NHÉ</div>
      </div>
      <div style={backgroundStyle}>
        <WorkoutTogether
          socketID={socketID}
          users={users}
          host={host}
          time={time}
          program={program}
          currentProgram={currentProgram}
          setHost={setHost}
          currentPlayingStatus={currentPlayingStatus}
        />
      </div>
    </>
  );
};

export default App;
