import { Resolver, Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolverFn: Resolver = async (_, { id }, { client, loggedInUser }) => {
  try {
    // id에 해당하는 message가 있는지 확인.
    // loggedInUser가 보낸 메세지가 아니고,
    // 현재 대화방에 있는 메세지이어야 함.
    const message = await client.message.findFirst({
      where: {
        id,
        userId: {
          not: loggedInUser.id,
        },
        room: {
          users: {
            some: {
              id: loggedInUser.id,
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (!message) {
      return {
        ok: false,
        error: "Meesage not found.",
      };
    }

    await client.message.update({
      where: {
        id,
      },
      data: {
        read: true,
      },
    });

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
    readMessage: protectedResolver(resolverFn),
  },
};

export default resolvers;
