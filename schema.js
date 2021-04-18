import {
  loadFilesSync,
  makeExecutableSchema,
  mergeTypeDefs,
  mergeResolvers,
} from "graphql-tools";

// ** : every folders, * : every filenames
// loadFilesSync : export default로만 파일 불러오기 가능
const loadedTypes = loadFilesSync(`${__dirname}/**/*.typeDefs.js`);
const loadedResolvers = loadFilesSync(`${__dirname}/**/*.resolvers.js`);

// The GraphQL schema
const typeDefs = mergeTypeDefs(loadedTypes);

// A map of functions which return data for the schema.
const resolvers = mergeResolvers(loadedResolvers);

const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
