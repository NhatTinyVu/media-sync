import React, { useState, useCallback, useEffect, useRef } from "react";
import { Upload, Switch, Button } from "antd";
import {
  UploadOutlined,
  VideoCameraOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import ReactPlayer from "react-player";
import axios from "axios";

const { Dragger } = Upload;

const beforeUpload = () => false;

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

const draggerBackgroundStyle = {
  display: "inline-block",
  textAlign: "left",
  background: "rgba(255, 255, 255, 0.75)",
  // paddingBottom: 16,
  borderRadius: 2,
};

const draggerContainerStyle = {
  padding: "0 16px",
  textAlign: "left",
  background: "none",
  // marginBottom: 16,
};

const neededReleases = ["bodyjam 78", "bodyjam 86"];

const MediaPlayer = ({ isHost, time }) => {
  const player = useRef(null);
  const [fileURL, setFileURL] = useState(null);
  const [listFiles, setListFiles] = useState([]);
  const [flip, setFlip] = useState(false);

  const handleAddFile = useCallback(({ file }) => {
    setFileURL(URL.createObjectURL(file));
    // setListFiles((current) =>
    //   current.find(({ name }) => name === file.name)
    //     ? current
    //     : [
    //         ...current,
    //         {
    //           name: file.name,
    //           url: URL.createObjectURL(file),
    //         },
    //       ]
    // );
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
    <>
      <div style={{ padding: 16 }}>
        <div style={draggerBackgroundStyle}>
          <Dragger
            name="file"
            fileList={[]}
            multiple={false}
            beforeUpload={beforeUpload}
            onChange={handleAddFile}
            style={draggerContainerStyle}
          >
            <Button icon={<UploadOutlined />}>
              Chọn video trong máy bạn để tập
            </Button>
          </Dragger>
          {/* <div
          style={{
            padding: "0 16px",
            textAlign: "left",
            color: "#3e91f7",
            fontSize: 14,
          }}
        >
          <b>
            Bạn cần những video sau:{" "}
            {neededReleases.map((release, index) => (
              <>
                {index > 0 && <span> | </span>}
                <span key={release}>{release.toUpperCase()}</span>
              </>
            ))}
          </b>
          {listFiles.map(({ name }) => (
            <div key={name} style={{ padding: "8px 0" }}>
              <Button type="text" style={{ color: "#3e91f7" }}>
                <VideoCameraOutlined /> {name} (Nhấn để nhận diện){" "}
              </Button>
              <Button
                type="text"
                style={{ color: "#ed5b56" }}
                onClick={() =>
                  setListFiles((current) =>
                    current.filter(({ name: fileName }) => name !== fileName)
                  )
                }
              >
                <CloseOutlined /> Xóa
              </Button>
            </div>
          ))}
        </div> */}
        </div>
      </div>
      {fileURL && (
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
      )}
    </>
  );
};

export default MediaPlayer;
