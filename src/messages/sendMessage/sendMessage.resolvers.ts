import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";
import { Resolver, Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolverFn: Resolver = async (
  _,
  { payload, roomId, userId },
  { client, loggedInUser }
) => {
  try {
    let user = null;
    let room = null;
    if (userId) {
      user = await client.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
        },
      });
      if (!user) {
        return {
          ok: false,
          error: "This user does not exist.",
        };
      }
    }

    if (roomId) {
      room = await client.room.findUnique({
        where: {
          id: roomId,
        },
        select: {
          id: true,
        },
      });
    } else {
      room = await client.room.create({
        data: {
          users: {
            connect: [
              {
                id: userId,
              },
              {
                id: loggedInUser.id,
              },
            ],
          },
        },
      });
    }

    if (!room) {
      return {
        ok: false,
        error: "Room not found.",
      };
    }

    const message = await client.message.create({
      data: {
        payload,
        room: {
          connect: {
            id: room.id,
          },
        },
        user: {
          connect: {
            id: loggedInUser.id,
          },
        },
      },
    });

    // Event를 Publish (triggerName, payload)
    pubsub.publish(NEW_MESSAGE, { roomUpdates: { ...message } });

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Error occured.",
    };
  }
};

const resolvers: Resolvers = {
  Mutation: {
    sendMessage: protectedResolver(resolverFn),
  },
};

export default resolvers;
