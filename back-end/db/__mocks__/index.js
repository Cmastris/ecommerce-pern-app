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

const emailExists = (email_address) => {
  throwIfArgsUndefined([email_address]);
  return email_address === "emailExists@example.com";
};

const getUserByEmail = async (email_address) => {
  throwIfArgsUndefined([email_address]);
  if (email_address === "emailExists@example.com") {
    const hashedPassword = await bcrypt.hash("pw", 1);
    return { "id": 1, "email_address": "emailExists@example.com", hashed_pw: hashedPassword };
  } else {
    return undefined;
  }
};

const addUser = (email_address, hashed_pw) => {
  throwIfArgsUndefined([email_address, hashed_pw]);
  return { "id": 1, "email_address": email_address };
};

const updateUserPassword = (id, hashed_pw) => {
  throwIfArgsUndefined([id, hashed_pw]);
  return;
};

const getProducts = (category_id=undefined) => {
  if (category_id) {
    res = [{}, {}, {}];
  } else {
    res = [{}, {}, {}, {}, {}];
  }
  return res;
};

const getProductById = (id) => {
  if (id === '1') {
    return {};
  }
  return undefined;
};


// Exports
module.exports = {
  emailExists,
  getUserByEmail,
  addUser,
  updateUserPassword,
  getProducts,
  getProductById
};