import React, { useState, useCallback, useEffect, useRef } from "react";
import { Switch, Button } from "antd";
import { PlayCircleOutlined, SyncOutlined } from "@ant-design/icons";
import ReactPlayer from "react-player";
import axios from "axios";
import { isEmpty, debounce } from "lodash";

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
  const [delay, setDelay] = useState(0.0);
  const [flip, setFlip] = useState(false);
  const [syncing, setSyncing] = useState(true);
  const [playingStatus, setPlayingStatus] = useState(true);
  const [isForcingSync, setIsForcingSync] = useState(false);

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

  const handleForceSync = useCallback(() => {
    if (!isNaN(player?.current?.getCurrentTime() && delay !== 0)) {
      setIsForcingSync(true);
      player?.current?.seekTo(player?.current?.getCurrentTime() + delay);
      setDelay(0);
      setTimeout(() => setIsForcingSync(false), 1500);
    }
  }, [delay]);

  const toggleSyncing = useCallback(() => setSyncing((sync) => !sync), []);

  useEffect(() => {
    let intervalEmit = null;
    if (isHost)
      intervalEmit = setInterval(() => {
        if (syncing) handleUpdateTime();
      }, 7000);
    return () => {
      if (intervalEmit) clearInterval(intervalEmit);
    };
  }, [isHost]);

  useEffect(() => {
    let intervalEmit = null;
    if (isHost)
      intervalEmit = setInterval(() => {
        if (syncing) handleUpdatePlayingStatus();
      }, 7000);
    return () => {
      if (intervalEmit) clearInterval(intervalEmit);
    };
  }, [isHost, playingStatus]);

  useEffect(() => {
    if (!isHost && syncing) {
      const delayTime =
        Number(time) - Number(player?.current?.getCurrentTime());
      setDelay((current) => (!isNaN(delayTime) ? delayTime + 0.03 : current));
      if (Math.abs(delayTime) > 7) player?.current?.seekTo(time);
    }
  }, [isHost, time]);

  useEffect(() => {
    if (!isHost && syncing && currentPlayingStatus != null) {
      console.log("set currentPlayingStatus", currentPlayingStatus);
      setPlayingStatus(currentPlayingStatus);
    }
  }, [isHost, currentPlayingStatus]);

  return (
    !isEmpty(fileURL) && (
      <div>
        <div style={backgroundStyle}>
          <div>
            Host đang mở video:{" "}
            <b>
              {currentProgramFromServer
                ? currentProgramFromServer
                : "Chưa có host/thông tin"}
            </b>
          </div>
          <div style={{ marginBottom: 8 }}>
            <span>
              Trạng thái host:{" "}
              <b>
                {currentPlayingStatus == null && "Chưa có host/thông tin"}
                {currentPlayingStatus === true && "Đang play video"}
                {currentPlayingStatus === false && "Đang dừng video"}
              </b>
              {` | `}
              Thời gian host đang play:{" "}
              {time ? secondsToHms(time) : <b>Chưa có host/thông tin</b>}
            </span>
          </div>

          <div style={{ marginBottom: 8 }}>
            <Button
              type="primary"
              danger={!playingStatus}
              icon={
                playingStatus ? <SyncOutlined spin /> : <PlayCircleOutlined />
              }
              onClick={() => setPlayingStatus((status) => !status)}
            >
              {playingStatus ? "Đang play video" : "Đang dừng video"}
            </Button>
            <span style={{ color: "#3e91f7" }}>{` | `}</span>
            <Button
              onClick={toggleSyncing}
              type="primary"
              danger={!syncing}
              icon={syncing ? <SyncOutlined spin /> : <PlayCircleOutlined />}
            >
              {isHost && syncing && "Host đang bật đồng bộ"}
              {isHost && !syncing && "Host đang tắt đồng bộ"}
              {!isHost && syncing && "Đang đồng bộ từ host"}
              {!isHost && !syncing && "Đang tắt đồng bộ từ host"}
            </Button>

            {!isHost && (
              <>
                <span style={{ color: "#3e91f7" }}>{` | `}</span>
                <Button
                  onClick={debounce(handleForceSync, 2000)}
                  type="primary"
                  danger={isForcingSync}
                >
                  Đồng bộ lại với host: {delay > 0 && "+"}
                  {Math.round(delay, 0)}s
                </Button>
              </>
            )}
          </div>
          <span style={{ fontWeight: "bold", color: "#3e91f7" }}>
            Lật hướng cho video{" "}
          </span>
          <Switch value={flip} onChange={(newFlip) => setFlip(newFlip)} />
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
          onPause={() => setPlayingStatus(false)}
        />
      </div>
    )
  );
};

export default MediaPlayer;
