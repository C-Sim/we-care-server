require("dotenv").config();

const { ApolloServer } = require("apollo-server");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");

const connectToDatabase = require("./config/connection");

const PORT = process.env.PORT || 4000;

const init = async () => {
  try {
    await connectToDatabase();

    // create a graphQL server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    const { url } = await server.listen(PORT);

    console.log(`Server running on ${url}`);
  } catch (error) {
    console.log(`[ERROR]: Failed to start server | ${error.message}`);
  }
};

init();
