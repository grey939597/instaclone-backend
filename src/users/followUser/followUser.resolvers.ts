import { Resolvers } from "../../types";
import { protectedResolver } from "../users.utils";

const resolvers: Resolvers = {
  Mutation: {
    followUser: protectedResolver(
      async (_, { username }, { loggedInUser, client }) => {
        try {
          const ok = await client.user.findUnique({
            where: { username },
          });
          if (!ok) {
            return {
              ok: false,
              error: "That user odes not exist.",
            };
          }
          await client.user.update({
            where: {
              id: loggedInUser.id,
            },
            data: {
              following: {
                connect: {
                  username,
                },
              },
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
      }
    ),
  },
};

export default resolvers;
