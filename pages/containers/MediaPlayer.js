import React, { useState, useCallback, useEffect, useRef } from "react";
import { Switch } from "antd";
import ReactPlayer from "react-player";
import axios from "axios";
import { isEmpty } from "lodash";

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

const MediaPlayer = ({ fileURL, isHost, time, currentPlayingStatus }) => {
  const player = useRef(null);
  const [flip, setFlip] = useState(false);
  const [playingStatus, setPlayingStatus] = useState(true);

  const handleUpdateTime = useCallback(async () => {
    const time = player?.current?.getCurrentTime();
    await axios.post("/api/updateTime", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ time }),
    });
  }, []);

  const handleUpdatePlayingStatus = useCallback(async () => {
    await axios.post("/api/updatePlayingStatus", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPlayingStatus: playingStatus }),
    });
  }, [playingStatus]);

  useEffect(() => {
    let intervalEmit = null;
    if (isHost) intervalEmit = setInterval(() => handleUpdateTime(), 5000);
    return () => {
      if (intervalEmit) clearInterval(intervalEmit);
    };
  }, [isHost]);

  useEffect(() => {
    let intervalEmit = null;
    if (isHost)
      intervalEmit = setInterval(() => handleUpdatePlayingStatus(), 5000);
    return () => {
      if (intervalEmit) clearInterval(intervalEmit);
    };
  }, [isHost]);

  useEffect(() => {
    if (isHost) handleUpdatePlayingStatus();
  }, [playingStatus]);

  useEffect(() => {
    if (
      !isHost &&
      Math.abs(Number(player?.current?.getCurrentTime()) - Number(time)) > 5
    ) {
      player?.current?.seekTo(time);
    }
  }, [isHost, time]);

  useEffect(() => {
    if (!isHost) {
      console.log("set currentPlayingStatus", currentPlayingStatus);
      setPlayingStatus(currentPlayingStatus);
    }
  }, [isHost, currentPlayingStatus]);

  return (
    !isEmpty(fileURL) && (
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
          playing={playingStatus}
          url={fileURL}
          style={flip ? { transform: "scaleX(-1)" } : undefined}
          onStart={() => setPlayingStatus(true)}
          onPlay={() => setPlayingStatus(true)}
          onPause={() => {
            console.log("onPause");
            setPlayingStatus(false);
          }}
        />
      </div>
    )
  );
};

export default MediaPlayer;
