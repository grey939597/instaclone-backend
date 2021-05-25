import client from "../client";
import { Resolvers } from "../types";

const resolvers: Resolvers = {
  Room: {
    users: ({ id }) =>
      client.room
        .findUnique({
          where: { id },
        })
        .users(),
    messages: ({ id }, { lastId }) =>
      client.message.findMany({
        where: {
          roomId: id,
        },
        skip: lastId ? 1 : 0,
        take: 20,
        ...(lastId && { cursor: { id: lastId } }),
      }),
    unreadTotal: ({ id }, { loggedInUser }) => {
      if (!loggedInUser) {
        return 0;
      }
      return client.message.count({
        where: {
          read: false,
          roomId: id,
          user: {
            id: {
              not: loggedInUser.id,
            },
          },
        },
      });
    },
  },
};

export default resolvers;
