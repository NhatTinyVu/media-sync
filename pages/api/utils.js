let users = {};
let host = "";

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

export const reset = () => {
  resetUser();
  resetHost();
};
