import { withFilter } from "graphql-subscriptions";
import client from "../../client";
import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";

// triggers를 listen (NEW_MESSAGE event를 listen)
const resolvers = {
  Subscription: {
    roomUpdates: {
      subscribe: async (root, args, context, info) => {
        const room = await client.room.findFirst({
          where: {
            id: args.id, // roomId가 맞는지 확인
            users: {
              some: {
                id: context.loggedInUser.id,
              },
            }, // loggedInUser가 room에 존재하는지 확인
          },
          select: {
            id: true,
          },
        });

        if (!room) {
          throw new Error("You shall not see this.");
        }

        return withFilter(
          () => pubsub.asyncIterator(NEW_MESSAGE),
          async (payload, { id }, { loggedInUser }) => {
            const {
              roomUpdates: { roomId },
            } = payload;
            if (roomId === id) {
              const room = await client.room.findFirst({
                where: {
                  id: args.id, // roomId가 맞는지 확인
                  users: {
                    some: {
                      id: loggedInUser.id,
                    },
                  }, // loggedInUser가 room에 존재하는지 확인
                },
                select: {
                  id: true,
                },
              });
              return room ? true : false;
            }
            return false;
          }
        )(root, args, context, info);
      },
    },
  },
};

export default resolvers;
