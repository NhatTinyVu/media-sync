import React, { useState, useCallback } from "react";
import { Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import ReactPlayer from "react-player";

const { Dragger } = Upload;

const beforeUpload = () => false;

const MediaPlayer = () => {
  const [fileURL, setFileURL] = useState(null);

  const handleAddFile = useCallback(({ file }) => {
    setFileURL(URL.createObjectURL(file));
  }, []);

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
