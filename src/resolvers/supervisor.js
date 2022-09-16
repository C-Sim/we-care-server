const { AuthenticationError, ApolloError } = require("apollo-server");
const { User } = require("../models");

//for future development - for users to be able to see their supervisor's contact details
const supervisor = async (_, __, { user }) => {
  try {
    if (user) {
      const supervisor = await User.findOne({ accountType: "supervisor" });

      return supervisor;
    } else {
      return new AuthenticationError(
        "You are not authorized to perform this operation"
      );
    }
  } catch (error) {
    console.log(`[ERROR]: Failed to proceed | ${error.message}`);
    return new ApolloError("Failed to proceed");
  }
};

module.exports = supervisor;
