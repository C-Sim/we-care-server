const { ApolloError } = require("apollo-server");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const login = async (_, { loginInput }) => {
  try {
    const user = await User.findOne({ email: loginInput.email });

    if (!user) {
      console.log(
        `[ERROR]: Failed to login | ${loginInput.email} does not exist`
      );

      throw new ApolloError("Failed to login");
    }

    const isPasswordValid = await user.checkPassword(loginInput.password);

    if (!isPasswordValid) {
      console.log(
        `[ERROR]: Failed to login | ${loginInput.email} has incorrect password`
      );

      throw new ApolloError("Failed to login");
    }

    return {
      success: true,
      token: signToken(user),
      user: user,
    };
  } catch (error) {
    console.log(`[ERROR]: Failed to login | ${error.message}`);

    throw new ApolloError("Failed to login");
  }
};

module.exports = login;
