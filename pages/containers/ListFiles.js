import React, { useState, useCallback, useEffect, useRef } from "react";
import { Upload, Button } from "antd";
import {
  UploadOutlined,
  VideoCameraOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { noop } from "lodash";

const { Dragger } = Upload;

const beforeUpload = () => false;

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

const ListFiles = ({ onChange = noop }) => {
  const [listFiles, setListFiles] = useState([]);

  const handleAddFile = useCallback(({ file }) => {
    onChange(URL.createObjectURL(file));
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
    </>
  );
};

export default ListFiles;
