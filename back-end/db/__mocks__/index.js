// https://jestjs.io/docs/manual-mocks

const bcrypt = require('bcrypt');

const isDefined = data => {
  return typeof data !== "undefined";
};

const allDefined = arr => {
  return arr.every(isDefined);
};

const throwIfArgsUndefined = arr => {
  const argsDefined = allDefined(arr);
  if (!argsDefined) {
    throw new Error('One or more required args undefined; db transaction would fail.');
  }
};

const usernameExists = (username) => {
  throwIfArgsUndefined([username]);
  return username === "usernameExists";
};

const getUserByUsername = async (username) => {
  throwIfArgsUndefined([username]);
  if (username === "usernameExists") {
    const hashedPassword = await bcrypt.hash("pw", 1);
    return { "id": 1, "username": "usernameExists", hashed_pw: hashedPassword };
  } else {
    return undefined;
  }
};

const addUser = (username, hashed_pw) => {
  throwIfArgsUndefined([username, hashed_pw]);
  return { "id": 1, "username": username };
};


// Exports
module.exports = {
  usernameExists,
  getUserByUsername,
  addUser
};