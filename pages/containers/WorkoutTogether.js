import React, { useCallback, useState } from "react";

import Register from "./Register";
import ListUsers from "./ListUsers";
import MediaPlayer from "./MediaPlayer";

const WorkoutTogether = ({ socketID, users, host, time }) => {
  const [isReady, setIsReady] = useState(false);
  const handleOnRegistered = useCallback(() => setIsReady(true), []);

  if (!isReady)
    return <Register socketID={socketID} onComplete={handleOnRegistered} />;

  return (
    <>
      <ListUsers users={users} host={host} socketID={socketID} />
      <MediaPlayer time={time} isHost={host === socketID} />
    </>
  );
};

export default WorkoutTogether;
