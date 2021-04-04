require("dotenv").config();
import { ApolloServer } from "apollo-server";
import schema from "./schema";

// Create a server
const server = new ApolloServer({
  schema,
});

const PORT = process.env.PORT;

// Running a server
server.listen(PORT).then(({ url }) => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
