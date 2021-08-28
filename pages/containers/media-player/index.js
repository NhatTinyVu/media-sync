import React, { useState, useCallback, useEffect, useRef } from "react";
import { Upload, Switch } from "antd";
import ReactPlayer from "react-player";
import axios from "axios";

const { Dragger } = Upload;

const beforeUpload = () => false;

function secondsToHms(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return hDisplay + mDisplay + sDisplay;
}

const MediaPlayer = ({ isHost, time }) => {
  console.log(isHost);
  const player = useRef(null);
  const [fileURL, setFileURL] = useState(null);
  const [flip, setFlip] = useState(false);

  const handleAddFile = useCallback(({ file }) => {
    setFileURL(URL.createObjectURL(file));
  }, []);

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
      player?.current?.seekTo(time);
    }
  }, [isHost, time]);

  return (
    <div>
      <Dragger
        name="file"
        fileList={[]}
        beforeUpload={beforeUpload}
        onChange={handleAddFile}
        style={{ padding: "0 16px" }}
      >
        Bấm chọn hoặc Kéo video vào đây nhé
      </Dragger>
      {fileURL && (
        <>
          <div style={{ textAlign: "center", padding: 8 }}>
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
            playing
            url={fileURL}
            style={flip ? { transform: "scaleX(-1)" } : undefined}
          />
        </>
      )}
    </div>
  );
};

export default MediaPlayer;
