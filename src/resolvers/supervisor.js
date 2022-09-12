const { User } = require("../models");

const supervisor = async (_, __, { user }) => {
  const supervisor = await User.findOne({ accountType: user.accountType });

  return supervisor;
};

module.exports = supervisor;
