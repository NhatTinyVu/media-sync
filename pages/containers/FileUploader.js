import React, { useCallback } from "react";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { noop } from "lodash";

const { Dragger } = Upload;

const beforeUpload = () => false;

const draggerBackgroundStyle = {
  display: "inline-block",
  textAlign: "left",
  background: "rgba(255, 255, 255, 0.75)",
  borderRadius: 2,
};

const draggerContainerStyle = {
  padding: "0 16px",
  textAlign: "left",
  background: "none",
};

const FileUploader = ({ buttonText, disabled, onChange = noop }) => {
  const handleAddFile = useCallback(({ file }) => {
    onChange({
      name: file.name,
      url: URL.createObjectURL(file),
    });
  }, []);

  return (
    <>
      <div style={{ padding: 16, maxWidth: 500 }}>
        <div style={draggerBackgroundStyle}>
          <Dragger
            name="file"
            fileList={[]}
            multiple={false}
            beforeUpload={beforeUpload}
            onChange={handleAddFile}
            style={draggerContainerStyle}
            disabled={disabled}
          >
            <Button icon={<UploadOutlined />}>{buttonText}</Button>
          </Dragger>
        </div>
      </div>
    </>
  );
};

export default FileUploader;
