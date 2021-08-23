import React, { useState, useCallback, useEffect, useRef } from "react";
import { Upload } from "antd";
import ReactPlayer from "react-player";
import axios from "axios";

const { Dragger } = Upload;

const beforeUpload = () => false;

const MediaPlayer = ({ isHost, time }) => {
  console.log(isHost);
  const player = useRef(null);
  const [fileURL, setFileURL] = useState(null);

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
        Kéo video vào đây nhé
      </Dragger>
      {fileURL && (
        <ReactPlayer
          ref={player}
          width="100%"
          height="100%"
          controls
          playing
          url={fileURL}
        />
      )}
    </div>
  );
};

export default MediaPlayer;
