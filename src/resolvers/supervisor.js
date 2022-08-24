const { User } = require("../models");

const supervisor = async (_, { accountType }) => {
  const supervisor = await User.findOne({ accountType: accountType });

  return supervisor;
};

module.exports = supervisor;
