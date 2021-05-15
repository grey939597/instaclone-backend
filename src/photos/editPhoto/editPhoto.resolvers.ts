import { Resolver, Resolvers } from "../../types";
import { protectedResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";

const resolverFn: Resolver = async (
  _,
  { id, caption },
  { client, loggedInUser }
) => {
  try {
    const oldPhoto = await client.photo.findFirst({
      where: {
        id,
        userId: loggedInUser.id,
      },
      include: {
        hashtags: {
          select: {
            hashtag: true,
          },
        },
      },
    });
    if (!oldPhoto) {
      return {
        ok: false,
        error: "Photo not found.",
      };
    }

    await client.photo.update({
      where: {
        id,
      },
      data: {
        caption,
        hashtags: {
          disconnect: oldPhoto.hashtags,
          connectOrCreate: processHashtags(caption),
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
    editPhoto: protectedResolver(resolverFn),
  },
};

export default resolvers;
