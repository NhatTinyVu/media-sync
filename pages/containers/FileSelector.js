import React, { useCallback } from "react";
import { Tag } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import axios from "axios";

const containerStyle = {
  display: "flex",
  gap: 4,
  margin: "0 16px 16px",
  cursor: "pointer",
};

const FileSelector = ({
  files,
  selectedFile,
  program,
  onSelected,
  onRemoved,
  isHost,
}) => {
  const hanleSelectFile = useCallback(
    async (programName) => {
      onSelected(programName);
      if (isHost) {
        const resp = await axios.post("/api/updateCurrentProgram", {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentProgram: programName }),
        });

        if (resp) console.log(resp);
      }
    },
    [onSelected, isHost]
  );

  return (
    <div style={containerStyle}>
      {files?.map(({ name, program: programName }) => (
        <span
          key={`${name}-${programName}`}
          onClick={() => hanleSelectFile(programName)}
        >
          <Tag
            color={program.includes(programName) ? "#72c040" : "#ed5b56"}
            icon={
              selectedFile &&
              selectedFile.program === programName && <SyncOutlined spin />
            }
            closable
            style={{ padding: "8px 16px" }}
            onClose={() => onRemoved(programName)}
          >
            <b>{programName}</b>{" "}
            <u>
              <i>{name}</i>
            </u>
          </Tag>
        </span>
      ))}
    </div>
  );
};

export default FileSelector;
