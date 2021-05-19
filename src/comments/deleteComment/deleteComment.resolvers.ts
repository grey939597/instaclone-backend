import { Resolver, Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolverFn: Resolver = async (_, { id }, { client, loggedInUser }) => {
  try {
    const comment = await client.comment.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!comment) {
      return {
        ok: false,
        error: "Comment not found.",
      };
    } else if (comment.userId !== loggedInUser.id) {
      return {
        ok: false,
        error: "Not authorized.",
      };
    } else {
      await client.comment.delete({ where: { id } });
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
    deleteComment: protectedResolver(resolverFn),
  },
};

export default resolvers;
