import React, { useCallback, useState, useMemo, useEffect } from "react";
import { isEmpty, get, find } from "lodash";
import axios from "axios";

import Register from "./Register";
import ListUsers from "./ListUsers";
import FileUploader from "./FileUploader";
import ExcerciseProgram from "./ExcerciseProgram";
import FileSelector from "./FileSelector";
import MediaPlayer from "./MediaPlayer";

const WorkoutTogether = ({
  setHost,
  socketID,
  users,
  host,
  time,
  currentPlayingStatus,
  program: programFromSocket,
  currentProgram: currentProgramFromServer,
}) => {
  const isHost = host === socketID;
  const [isReady, setIsReady] = useState(false);
  const [program, setProgram] = useState(programFromSocket);
  const [currentFile, setCurrentFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentProgram, setCurrentProgram] = useState(null);
  const handleOnRegistered = useCallback(() => setIsReady(true), []);
  const handleChangeFileURL = useCallback(({ url, name }) => {
    setCurrentFile({ url, name });
  }, []);
  const handleSelectFile = useCallback(
    (programName) =>
      setSelectedFile(
        selectedFiles.find(({ program: name }) => name === programName)
      ),
    [selectedFiles]
  );

  useEffect(() => {
    setProgram(programFromSocket);
  }, [programFromSocket]);

  useEffect(() => {
    const getProgram = async () => {
      const resp = await axios.get("/api/program", {
        headers: { "Content-Type": "application/json" },
      });

      if (resp) console.log(resp);

      if (resp?.data) setProgram(resp.data);
    };

    getProgram();
  }, []);

  const updateSelectedProgram = useCallback(
    async (programName) => {
      if (isHost) {
        const resp = await axios.post("/api/updateCurrentProgram", {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentProgram: programName }),
        });

        if (resp) console.log(resp);
      }
    },
    [isHost]
  );

  useEffect(() => {
    let intervalEmit = null;
    if (isHost && selectedFile?.program)
      intervalEmit = setInterval(
        () => updateSelectedProgram(selectedFile?.program),
        5000
      );
    return () => {
      if (intervalEmit) clearInterval(intervalEmit);
    };
  }, [isHost, selectedFile]);

  useEffect(() => {
    if (get(program, "length") > 0)
      setCurrentProgram(
        program.find(
          (name) => !selectedFiles.map(({ program }) => program).includes(name)
        )
      );
  }, [program]);

  useEffect(() => {
    if (currentProgramFromServer) {
      const newSelectedFile = find(
        selectedFiles,
        ({ program: programName }) =>
          programName.toString() === currentProgramFromServer.toString()
      );

      if (newSelectedFile) setSelectedFile(newSelectedFile);
    }
  }, [currentProgramFromServer]);

  useEffect(() => {
    if (!currentFile) return;

    const file = { ...currentFile, program: currentProgram };
    const mapSelectedFiles = [
      ...selectedFiles.filter(
        ({ program: programName }) => programName !== currentProgram
      ),
      file,
    ];
    setSelectedFile(file);
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
    if (!get(program, "length"))
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

  const disabledUpload = isEmpty(program) || !currentProgram;

  if (!isReady)
    return (
      <Register
        setHost={setHost}
        socketID={socketID}
        onComplete={handleOnRegistered}
      />
    );

  return (
    <div>
      <ListUsers users={users} host={host} socketID={socketID} />
      <ExcerciseProgram program={program} />
      <FileUploader
        disabled={disabledUpload}
        buttonText={buttonText}
        onChange={handleChangeFileURL}
      />
      <FileSelector
        isHost={isHost}
        program={program}
        files={selectedFiles}
        selectedFile={selectedFile}
        currentProgram={currentProgram}
        currentProgramFromServer={currentProgramFromServer}
        onSelected={handleSelectFile}
      />
      <MediaPlayer
        currentPlayingStatus={currentPlayingStatus}
        fileURL={get(selectedFile, "url")}
        time={time}
        isHost={isHost}
      />
    </div>
  );
};

export default WorkoutTogether;
