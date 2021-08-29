import React, { useState, useCallback, useEffect, useRef } from "react";
import { Switch, Button } from "antd";
import { PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";
import ReactPlayer from "react-player";
import axios from "axios";
import { isEmpty } from "lodash";

const backgroundStyle = {
  textAlign: "center",
  padding: 8,
  background: "rgba(255, 255, 255, 0.75)",
};

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

const MediaPlayer = ({
  fileURL,
  isHost,
  time,
  currentPlayingStatus,
  currentProgramFromServer,
}) => {
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
        <div style={backgroundStyle}>
          <Button
            type="primary"
            danger={playingStatus}
            icon={
              playingStatus ? <PauseCircleOutlined /> : <PlayCircleOutlined />
            }
            onClick={() => setPlayingStatus((status) => !status)}
          >
            {playingStatus ? "Dừng video" : "Phát video"}
          </Button>
          <span style={{ color: "#3e91f7" }}>{` | `}</span>
          <span style={{ fontWeight: "bold", color: "#3e91f7" }}>
            Lật hướng cho video{" "}
          </span>
          <Switch value={flip} onChange={(newFlip) => setFlip(newFlip)} />
          <div>
            Host đang mở video:{" "}
            {currentProgramFromServer ? (
              <b>{currentProgramFromServer}</b>
            ) : (
              "Host chưa mở/Chưa có host"
            )}
          </div>
          {` | `}
          <span>
            Trạng thái host:{" "}
            <b>
              {currentPlayingStatus ? "Đang play video" : "Đang dừng video"}
            </b>
            {` | `}
            Thời gian host đang play:{" "}
            {time ? secondsToHms(time) : <b>Chưa có host/thông tin</b>}
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
