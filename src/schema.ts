import {
  loadFilesSync,
  makeExecutableSchema,
  mergeTypeDefs,
  mergeResolvers,
} from "graphql-tools";

// ** : every folders, * : every filenames
// loadFilesSync : export default로만 파일 불러오기 가능
const loadedTypes = loadFilesSync(`${__dirname}/**/*.typeDefs.ts`);
const loadedResolvers = loadFilesSync(`${__dirname}/**/*.resolvers.ts`);

// The GraphQL schema
export const typeDefs = mergeTypeDefs(loadedTypes);
// A map of functions which return data for the schema.
export const resolvers = mergeResolvers(loadedResolvers);

// const schema = makeExecutableSchema({ typeDefs, resolvers });
// export default schema;
