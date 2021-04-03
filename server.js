import { ApolloServer } from "apollo-server";
import schema from "./schema";

// Create a server
const server = new ApolloServer({
  schema,
});

// Running a server
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at http://localhost:4000`);
});
