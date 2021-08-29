import React, { useCallback, useState, useMemo, useEffect } from "react";
import { remove } from "lodash";

import Register from "./Register";
import ListUsers from "./ListUsers";
import FileUploader from "./FileUploader";
import ExcerciseProgram from "./ExcerciseProgram";
import MediaPlayer from "./MediaPlayer";

const WorkoutTogether = ({ socketID, users, host, time, program }) => {
  const [isReady, setIsReady] = useState(false);
  const [fileURL, setFileURL] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentProgram, setCurrentProgram] = useState(null);
  const handleOnRegistered = useCallback(() => setIsReady(true), []);
  const handleChangeFileURL = useCallback(({ url, name }) => {
    setCurrentFile({ url, name });
  }, []);

  useEffect(() => {
    if (program.length > 0) setCurrentProgram(program[0]);
  }, [program]);

  useEffect(() => {
    if (!currentFile) return;

    setFileURL(currentFile.url);

    const mapSelectedFiles = [
      ...selectedFiles,
      { ...currentFile, program: currentProgram },
    ];
    setSelectedFiles(mapSelectedFiles);
    setCurrentProgram(
      program.find(
        (name) =>
          !mapSelectedFiles
            .map(({ program: programName }) => programName)
            .includes(name)
      )
    );
  }, [currentFile]);

  const buttonText = useMemo(() => {
    if (program.length === 0)
      return "Vui lòng nhập bộ môn muốn tập ở trên trước";
    if (currentProgram)
      return (
        <span>
          Vui lòng bấm chọn môn tập{" "}
          <b style={{ color: "#3e91f7" }}>{currentProgram}</b>
        </span>
      );
    return "Bạn đã chọn đủ môn tập";
  }, [program, currentProgram]);

  const disabledUpload = program.length === 0 || !currentProgram;

  if (!isReady)
    return <Register socketID={socketID} onComplete={handleOnRegistered} />;

  return (
    <div>
      <ListUsers users={users} host={host} socketID={socketID} />
      <ExcerciseProgram program={program} />
      <FileUploader
        disabled={disabledUpload}
        buttonText={buttonText}
        onChange={handleChangeFileURL}
      />
      <MediaPlayer fileURL={fileURL} time={time} isHost={host === socketID} />
    </div>
  );
};

export default WorkoutTogether;
