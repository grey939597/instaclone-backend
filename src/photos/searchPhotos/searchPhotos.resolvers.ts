import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    searchPhotos: (_, { keyword, page }, { client }) =>
      client.photo.findMany({
        where: {
          caption: {
            startsWith: keyword,
          },
        },
        skip: (page - 1) * 5,
        take: 5,
      }),
  },
};

export default resolvers;
