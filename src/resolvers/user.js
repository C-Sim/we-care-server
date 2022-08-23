const { User, Appointment, Notification } = require("../models");

const userInfo = async (_, { userId }) => {
  const user = await User.findById(userId);

  return user;
};

module.exports = userInfo;
