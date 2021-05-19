import { Resolvers } from "../../types";

const resolvers: Resolvers = {
  Query: {
    seePhotoComments: async (_, { id, lastId }, { client }) =>
      client.comment.findMany({
        where: {
          photoId: id,
        },
        orderBy: {
          createdAt: "asc",
        },
        skip: lastId ? 1 : 0,
        take: 5,
        ...(lastId && {
          cursor: {
            id: lastId,
          },
        }),
      }),
  },
};

export default resolvers;
