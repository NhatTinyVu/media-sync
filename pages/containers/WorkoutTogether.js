import React, { useCallback, useState } from "react";

import Register from "./Register";
import ListUsers from "./ListUsers";
import ListFiles from "./ListFiles";
import MediaPlayer from "./MediaPlayer";

const WorkoutTogether = ({ socketID, users, host, time }) => {
  const [isReady, setIsReady] = useState(false);
  const [fileURL, setFileURL] = useState(null);
  const handleOnRegistered = useCallback(() => setIsReady(true), []);
  const handleChangeFileURL = useCallback((url) => setFileURL(url), []);

  if (!isReady)
    return <Register socketID={socketID} onComplete={handleOnRegistered} />;

  return (
    <>
      <ListUsers users={users} host={host} socketID={socketID} />
      <ListFiles onChange={handleChangeFileURL} />
      <MediaPlayer fileURL={fileURL} time={time} isHost={host === socketID} />
    </>
  );
};

export default WorkoutTogether;
