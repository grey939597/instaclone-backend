require("dotenv").config();
import * as http from "http";
import * as express from "express";
import * as logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import client from "./client";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";
import pubsub from "./pubsub";

const PORT = process.env.PORT;

// Create a server
const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    if (req) {
      return {
        loggedInUser: await getUser(req.headers.token),
        client,
      };
    }
  },
});

const app = express(); // express server 생성
app.use(logger("tiny"));
// app.use("/static", express.static("uploads"));

apollo.applyMiddleware({ app }); // apollo server를 express server와 연결

const httpServer = http.createServer(app); // http Server 생성
apollo.installSubscriptionHandlers(httpServer);

// Listen http Server, Not on app.
// Running a server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
