let users = {};
let host = "";
let time = 0;
let currentProgram = "";
let currentPlayingStatus = false;
let program = [];

export const getUsers = () => users;
export const setUsers = (newUsers) => {
  users = newUsers;
  return users;
};
export const addUser = (user) => {
  users = {
    ...users,
    ...user,
  };
  return users;
};
export const resetUser = () => {
  users = {};
  return users;
};

export const getHost = () => host;
export const setHost = (newHost) => {
  host = newHost;
  return host;
};
export const resetHost = () => {
  host = "";
  return host;
};

export const getTime = () => time;
export const setTime = (newTime) => {
  time = newTime;
  return time;
};
export const resetTime = () => {
  time = 0;
  return time;
};

export const getCurrentProgram = () => currentProgram;
export const setCurrentProgram = (newCurrentProgram) => {
  currentProgram = newCurrentProgram;
  return currentProgram;
};
export const resetCurrentProgram = () => {
  currentProgram = "";
  return currentProgram;
};

export const getCurrentPlayingStatus = () => currentPlayingStatus;
export const setCurrentPlayingStatus = (newCurrentPlayingStatus) => {
  currentPlayingStatus = newCurrentPlayingStatus;
  return currentPlayingStatus;
};
export const resetCurrentPlayingStatus = () => {
  currentPlayingStatus = "";
  return currentPlayingStatus;
};

export const reset = () => {
  resetUser();
  resetHost();
  resetTime();
  resetProgram();
  resetCurrentPlayingStatus();
};

export const getProgram = () => program;
export const setProgram = (newProgram) => {
  program = newProgram;
  return program;
};
export const resetProgram = () => {
  program = [];
  return program;
};
