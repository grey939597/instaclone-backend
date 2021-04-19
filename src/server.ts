require("dotenv").config();
import { ApolloServer } from "apollo-server";
import client from "./client";
import schema from "./schema";
import { getUser } from "./users/users.utils";

// Create a server
const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    return {
      loggedInUser: await getUser(req.headers.token),
      client,
    };
  },
});

const PORT = process.env.PORT;

// Running a server
server.listen(PORT).then(({ url }) => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
