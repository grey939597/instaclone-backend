import { Resolver, Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolverFn: Resolver = async (_, { lastId }, { client, loggedInUser }) =>
  client.photo.findMany({
    where: {
      OR: [
        {
          user: {
            followers: {
              some: {
                id: loggedInUser.id,
              },
            },
          },
        },
        {
          userId: loggedInUser.id,
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: lastId ? 1 : 0,
    take: 5,
    ...(lastId && { cursor: { id: lastId } }),
  });

const resolvers: Resolvers = {
  Query: {
    seeFeed: protectedResolver(resolverFn),
  },
};

export default resolvers;
