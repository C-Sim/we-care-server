const { User } = require("../models");

const users = async () => {
  const users = await User.find({});
  return users;
};

module.exports = users;
