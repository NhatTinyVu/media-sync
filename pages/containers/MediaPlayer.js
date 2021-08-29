import React, { useState, useCallback, useEffect, useRef } from "react";
import { Switch } from "antd";
import ReactPlayer from "react-player";
import axios from "axios";

function secondsToHms(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var hDisplay = h > 0 ? h + "h" : "";
  var mDisplay = m > 0 ? m + "m" : "";
  var sDisplay = s > 0 ? s + "s" : "";
  return hDisplay + mDisplay + sDisplay;
}

const MediaPlayer = ({ fileURL, isHost, time }) => {
  const player = useRef(null);
  const [flip, setFlip] = useState(false);

  const handleUpdateTime = useCallback(async () => {
    const time = player?.current?.getCurrentTime();
    await axios.post("/api/updateTime", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ time }),
    });
  }, []);

  useEffect(() => {
    let intervalEmit = null;
    if (isHost) intervalEmit = setInterval(() => handleUpdateTime(), 3000);
    return () => {
      if (intervalEmit) clearInterval(intervalEmit);
    };
  }, [isHost]);

  useEffect(() => {
    if (!isHost && Math.abs(player?.current?.getCurrentTime() - time) > 1) {
      player?.current?.seekTo(time + 0.02);
    }
  }, [isHost, time]);

  return (
    fileURL && (
      <div>
        <div
          style={{
            textAlign: "center",
            padding: 8,
            background: "rgba(255, 255, 255, 0.75)",
          }}
        >
          <span style={{ fontWeight: "bold" }}>Lật hướng cho video </span>
          <Switch value={flip} onChange={(newFlip) => setFlip(newFlip)} />
          <span>
            {" "}
            Thời gian mà host đang play:{" "}
            {time ? secondsToHms(time) : <b>Chưa có host</b>}
          </span>
        </div>

        <ReactPlayer
          ref={player}
          width="100%"
          height="100%"
          controls
          url={fileURL}
          style={flip ? { transform: "scaleX(-1)" } : undefined}
        />
      </div>
    )
  );
};

export default MediaPlayer;
