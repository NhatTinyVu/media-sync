import React, { useState, useCallback } from "react";
import { Button } from "antd";
import axios from "axios";
import MediaPlayer from "../media-player";
import User from "../../components/user";

const Home = ({ users, host, socketID, time }) => {
  const handleReset = useCallback(async () => {
    const resp = await axios.post("/api/reset", {
      headers: { "Content-Type": "application/json" },
    });

    if (resp) console.log(resp);
  }, []);

  const handleTakeHost = useCallback(async () => {
    const resp = await axios.post("/api/takeHost", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ host: socketID }),
    });

    if (resp) console.log(resp);
  }, [host]);

  return (
    <div>
      <div>
        <div style={{ textAlign: "right", padding: "16px" }}>
          <Button onClick={handleTakeHost}>Lấy quyền phát</Button>{" "}
          <Button onClick={handleReset}>Reset (please be careful)</Button>
        </div>
        <div style={{ padding: "16px" }}>
          {users &&
            Object.entries(users).map(([key, value]) => (
              <User key={key} name={value?.name} active={host === key} />
            ))}
        </div>
        <div>
          <MediaPlayer time={time} isHost={host === socketID} />
        </div>
      </div>
    </div>
  );
};

export default Home;
