let users = {};
let host = "";
let time = 0;
let program = [];

export const getUsers = () => users;
export const setUsers = (newUsers) => {
  users = newUsers;
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

export const reset = () => {
  resetUser();
  resetHost();
  resetTime();
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
