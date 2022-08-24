const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");

const secret = process.env.SECRET;
const expiresIn = "1h";

const signToken = ({ _id, firstName, lastName, email }) => {
  const token = jwt.sign(
    {
      id: _id,
      firstName,
      lastName,
      email,
    },
    secret,
    {
      expiresIn,
    }
  );

  return token;
};

const authMiddleware = ({ req }) => {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(" ").pop().trim();
  }

  if (!token) {
    return req;
  }

  try {
    const data = jwt.verify(token, secret, { maxAge: expiresIn });

    req.user = data;
  } catch (error) {
    console.log(`[ERROR]: Invalid token | ${error.message}`);

    throw new AuthenticationError("Invalid error");
  }

  return req;
};

module.exports = {
  signToken,
  authMiddleware,
};
