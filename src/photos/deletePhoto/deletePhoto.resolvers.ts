import { Resolver, Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolverFn: Resolver = async (_, { id }, { client, loggedInUser }) => {
  try {
    const photo = await client.photo.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!photo) {
      return {
        ok: false,
        error: "Photo not found.",
      };
    } else if (photo.userId !== loggedInUser.id) {
      return {
        ok: false,
        error: "Not authorized.",
      };
    } else {
      await client.photo.delete({ where: { id } });
      return {
        ok: true,
      };
    }
  } catch (error) {
    return {
      ok: false,
      error: "Error occured.",
    };
  }
};

const resolvers: Resolvers = {
  Mutation: {
    deletePhoto: protectedResolver(resolverFn),
  },
};

export default resolvers;
