import { Resolvers } from "../../types";
import { protectedResolver } from "../users.utils";

const resolvers: Resolvers = {
  Query: {
    seeProfile: protectedResolver((_, { username }, { client }) =>
      client.user.findUnique({
        where: {
          username,
        },
        include: {
          following: true,
          followers: true,
        },
      })
    ),
  },
};

export default resolvers;
