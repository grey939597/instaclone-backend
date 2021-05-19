import { Resolver, Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";

const resolverFn: Resolver = async (
  _,
  { photoId, payload },
  { client, loggedInUser }
) => {
  try {
    const ok = await client.photo.findUnique({
      where: {
        id: photoId,
      },
      select: {
        id: true,
      },
    });

    if (!ok) {
      return {
        ok: false,
        error: "Photo not found.",
      };
    }

    await client.comment.create({
      data: {
        payload,
        photo: {
          connect: {
            id: photoId,
          },
        },
        user: {
          connect: {
            id: loggedInUser.id,
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
};

const resolvers: Resolvers = {
  Mutation: {
    createComment: protectedResolver(resolverFn),
  },
};

export default resolvers;
